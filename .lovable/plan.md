
# Plano: Area para Analista de Growth

## Resumo

Vou criar um novo nivel de permissao chamado "growth" com acesso focado em metricas, analises e acoes de marketing, e uma area personalizada com os dashboards e ferramentas relevantes.

---

## O que o Analista de Growth Precisa

Com base nas funcionalidades existentes, mapeei as paginas do admin em 3 categorias:

```text
+------------------------------------------------------------------+
|                    ACESSO COMPLETO (Growth)                       |
+------------------------------------------------------------------+
| Dashboard Principal     | KPIs, conversoes, metricas gerais       |
| Business Dashboard      | Metricas de negocio, LTV, cohorts       |
| Tempo Real              | Usuarios ativos, eventos ao vivo        |
| Relatorios              | Geracao e analise de relatorios         |
| Visitantes              | Tracking de visitantes, origem          |
| Relatorio de Vendas     | Receita por produto, tendencias         |
| Afiliados               | Performance de afiliados, conversoes    |
| Engajamento             | Campanhas, automacoes, triggers         |
| Historico Push          | Analise de campanhas de push            |
+------------------------------------------------------------------+

+------------------------------------------------------------------+
|                    ACESSO LIMITADO (Visualizar)                   |
+------------------------------------------------------------------+
| Usuarios & Jornadas     | Ver dados, sem editar ou bloquear       |
| Pedidos                 | Ver vendas, sem processar reembolsos    |
| Cupons                  | Ver cupons ativos e uso                 |
| Produtos & Testes       | Ver catalogo, sem modificar             |
+------------------------------------------------------------------+

+------------------------------------------------------------------+
|                    SEM ACESSO                                     |
+------------------------------------------------------------------+
| Permissoes              | Gerenciamento de admins                 |
| Limpeza de Dados        | Exclusao de dados                       |
| Configuracoes           | Settings do sistema                     |
| Gestao de Precos        | Alteracao de precos (sensivel)          |
| Codigo da Essencia      | Regeneracao de relatorios               |
| Tools                   | Ferramentas de desenvolvimento          |
| Logs                    | Auditoria do sistema                    |
+------------------------------------------------------------------+
```

---

## Implementacao

### 1. Novo Nivel de Permissao no Banco de Dados

Adicionar 'growth' ao enum `admin_permission_level`:

```sql
ALTER TYPE admin_permission_level ADD VALUE 'growth';
```

### 2. Atualizar Hook de Permissoes

Modificar `src/hooks/useAdminPermissions.tsx`:

- Adicionar 'growth' ao tipo `AdminPermissionLevel`
- Adicionar preset de permissoes para growth:
  - can_view_reports: true
  - can_send_notifications: true
  - can_manage_users: false
  - can_manage_payments: false
  - can_manage_products: false
  - can_manage_settings: false
  - can_delete_data: false
  - can_impersonate: false

### 3. Criar Sidebar Filtrada

Modificar `src/components/admin/AdminSidebar.tsx` para:

- Usar `useAdminPermissions` para verificar nivel
- Mostrar/esconder itens baseado nas permissoes
- Growth ve apenas items relevantes para analise

Mapeamento de permissoes por pagina:

```text
Pagina                  | Permissao Requerida
------------------------|---------------------
Dashboard               | can_view_reports
Business                | can_view_reports
Tempo Real              | can_view_reports
Relatorios              | can_view_reports
Visitantes              | can_view_reports
Vendas                  | can_view_reports
Usuarios                | can_manage_users (ver) ou can_view_reports
Pedidos                 | can_manage_payments (ver)
Cupons                  | can_manage_products
Engajamento             | can_send_notifications
Notificacoes            | can_send_notifications
Permissoes              | super_admin only
Limpeza                 | can_delete_data
Configuracoes           | can_manage_settings
Precos                  | super_admin only
```

### 4. Atualizar Gerenciador de Permissoes

Modificar `src/components/admin/AdminPermissionsManager.tsx`:

- Adicionar card explicativo para nivel "Growth"
- Incluir growth no seletor de niveis
- Definir preset de permissoes correto

### 5. Proteger Componentes Sensiveis

Adicionar verificacao de permissao nos componentes que Growth nao deve acessar:

- AdminPriceManager: verificar can_manage_settings ou super_admin
- AdminSettings: verificar can_manage_settings
- DataCleanupTool: verificar can_delete_data
- AdminPermissionsManager: ja protege (super_admin only)

---

## Arquivos a Modificar

| Arquivo | Alteracao |
|---------|-----------|
| `src/hooks/useAdminPermissions.tsx` | Adicionar 'growth' ao tipo e presets |
| `src/components/admin/AdminSidebar.tsx` | Filtrar menu por permissoes |
| `src/components/admin/AdminPermissionsManager.tsx` | Adicionar growth ao seletor |
| `src/components/admin/AdminPriceManager.tsx` | Adicionar guard de permissao |
| `src/components/admin/AdminSettings.tsx` | Adicionar guard de permissao |
| `src/components/admin/DataCleanupTool.tsx` | Adicionar guard de permissao |

## Migracao de Banco de Dados

```sql
-- Adicionar novo nivel de permissao
ALTER TYPE admin_permission_level ADD VALUE 'growth';
```

---

## Detalhes Tecnicos

### Preset de Permissoes para Growth

```typescript
growth: {
  can_manage_users: false,      // Ver usuarios, sem editar
  can_manage_payments: false,   // Ver vendas, sem reembolsar
  can_manage_products: false,   // Ver produtos, sem alterar
  can_manage_settings: false,   // Sem acesso a configs
  can_view_reports: true,       // ACESSO TOTAL a metricas
  can_send_notifications: true, // Pode enviar campanhas
  can_delete_data: false,       // Sem exclusao
  can_impersonate: false,       // Sem impersonacao
}
```

### Logica de Filtragem do Sidebar

```typescript
const menuItemPermissions = {
  '/admin': 'can_view_reports',
  '/admin/business': 'can_view_reports',
  '/admin/tempo-real': 'can_view_reports',
  // ... etc
};

// Filtrar baseado em hasPermission()
const visibleItems = section.items.filter(item => {
  const required = menuItemPermissions[item.url];
  return !required || hasPermission(required) || isSuperAdmin;
});
```

### Componente de Acesso Restrito

Para paginas sensiveis, mostrar mensagem informativa:

```typescript
if (!hasPermission('can_manage_settings')) {
  return (
    <Card className="p-8 text-center">
      <Shield className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
      <h3>Acesso Restrito</h3>
      <p>Voce nao tem permissao para acessar esta pagina.</p>
    </Card>
  );
}
```

---

## Fluxo de Uso

1. Voce (super_admin) vai em Admin > Permissoes
2. Adiciona o email do analista como admin
3. Seleciona nivel "Growth" para ele
4. Analista faz login e ve apenas os menus relevantes
5. Se tentar acessar URL protegida, ve mensagem de acesso restrito

---

## Resultado Final

O analista de growth tera acesso a:

- Todos os dashboards de metricas e KPIs
- Funil de conversao completo
- Analise de receita e vendas
- Dados de visitantes e engajamento
- Envio de campanhas e notificacoes
- Exportacao de dados (CSV)

E NAO tera acesso a:

- Alteracao de precos
- Configuracoes do sistema
- Exclusao de dados
- Impersonacao de usuarios
- Gerenciamento de permissoes
