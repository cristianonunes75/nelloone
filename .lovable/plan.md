
# Plano: Seguranca de Nivel Duplo para Area Growth

## Resumo do Problema

Atualmente, varias paginas do admin estao protegidas apenas por ocultacao no sidebar. Um usuario Growth pode acessar diretamente via URL paginas sensiveis como `/admin/precos`, `/admin/logs`, etc.

### Estado Atual

| Componente | Tem Guard? | Status |
|------------|-----------|--------|
| AdminPriceManager | Sim | isSuperAdmin |
| AdminSettings | Sim | can_manage_settings |
| DataCleanupTool | Sim | can_delete_data |
| AdminPermissionsManager | Sim | isSuperAdmin |
| AdminLogs | **NAO** | Vulneravel |
| AdminTools | **NAO** | Vulneravel |
| AdminCodigoEssencia | **NAO** | Vulneravel |
| AdminLandingPage | **NAO** | Vulneravel |
| TestimonialsManagement | **NAO** | Vulneravel |
| AdminPostFactory | **NAO** | Vulneravel |
| AdminNotificationSettings | **NAO** | Vulneravel |

---

## Solucao: Arquitetura de 2 Niveis

### Nivel 1: Guard Reutilizavel (Componente)

Criar um componente `AdminGuard` que:
- Recebe props: `isSuperAdminOnly`, `requiredPermission`, `children`
- Verifica permissoes usando `useAdminPermissions`
- Bloqueia renderizacao e mostra Card "Acesso Restrito"
- Previne chamadas de dados antes de mostrar o guard

```text
+-----------------------------------------------------------+
| AdminGuard                                                |
+-----------------------------------------------------------+
| Props:                                                    |
|   - isSuperAdminOnly?: boolean                            |
|   - requiredPermission?: keyof AdminPermissions           |
|   - children: ReactNode                                   |
|   - fallbackMessage?: string                              |
+-----------------------------------------------------------+
| Logica:                                                   |
|   1. Carrega permissoes com useAdminPermissions           |
|   2. Se isSuperAdminOnly e !isSuperAdmin -> bloqueia      |
|   3. Se requiredPermission e !hasPermission -> bloqueia   |
|   4. Caso contrario, renderiza children                   |
+-----------------------------------------------------------+
```

### Nivel 2: Wrapper de Rota

Envolver paginas sensiveis no nivel de rota em `Admin.tsx` com o guard, impedindo ate o lazy load do componente.

---

## Arquivos a Criar

| Arquivo | Descricao |
|---------|-----------|
| `src/components/admin/AdminGuard.tsx` | Componente guard reutilizavel |

## Arquivos a Modificar

| Arquivo | Alteracao |
|---------|-----------|
| `src/pages/Admin.tsx` | Envolver rotas sensiveis com AdminGuard |
| `src/components/admin/AdminLogs.tsx` | Adicionar guard interno (nivel 2) |
| `src/components/admin/AdminTools.tsx` | Adicionar guard interno |
| `src/components/admin/AdminCodigoEssencia.tsx` | Adicionar guard interno |
| `src/components/admin/AdminLandingPage.tsx` | Adicionar guard interno |
| `src/components/admin/TestimonialsManagement.tsx` | Adicionar guard interno |
| `src/components/admin/AdminPostFactory.tsx` | Adicionar guard interno |
| `src/components/admin/AdminNotificationSettings.tsx` | Adicionar guard interno |

---

## Detalhes Tecnicos

### Componente AdminGuard

```typescript
interface AdminGuardProps {
  children: ReactNode;
  isSuperAdminOnly?: boolean;
  requiredPermission?: keyof Omit<AdminPermissions, 'id' | 'user_id' | 'permission_level'>;
  fallbackMessage?: string;
}

export const AdminGuard = ({ 
  children, 
  isSuperAdminOnly, 
  requiredPermission, 
  fallbackMessage 
}: AdminGuardProps) => {
  const { isSuperAdmin, hasPermission, isLoading } = useAdminPermissions();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Check super admin requirement
  if (isSuperAdminOnly && !isSuperAdmin) {
    return <AccessDeniedCard message={fallbackMessage || "Apenas Super Admins"} />;
  }

  // Check specific permission
  if (requiredPermission && !hasPermission(requiredPermission) && !isSuperAdmin) {
    return <AccessDeniedCard message={fallbackMessage || "Permissao insuficiente"} />;
  }

  return <>{children}</>;
};
```

### Aplicacao nas Rotas (Admin.tsx)

```typescript
// Componente wrapper para rotas protegidas
const GuardedRoute = ({ 
  element, 
  isSuperAdminOnly, 
  requiredPermission 
}: { 
  element: React.LazyExoticComponent<any>;
  isSuperAdminOnly?: boolean;
  requiredPermission?: string;
}) => {
  const Element = element;
  return (
    <AdminGuard 
      isSuperAdminOnly={isSuperAdminOnly} 
      requiredPermission={requiredPermission}
    >
      <Element />
    </AdminGuard>
  );
};

// Uso nas rotas
<Route path="precos" element={
  <AdminGuard isSuperAdminOnly>
    <AdminPriceManager />
  </AdminGuard>
} />

<Route path="configuracoes" element={
  <AdminGuard requiredPermission="can_manage_settings">
    <AdminSettings />
  </AdminGuard>
} />
```

### Mapeamento Completo de Protecao

| Rota | Guard Nivel Rota | Guard Nivel Componente | Requisito |
|------|------------------|------------------------|-----------|
| /admin/precos | AdminGuard | Ja existe | isSuperAdminOnly |
| /admin/permissoes | AdminGuard | Ja existe | isSuperAdminOnly |
| /admin/logs | AdminGuard | A criar | isSuperAdminOnly |
| /admin/tools | AdminGuard | A criar | isSuperAdminOnly |
| /admin/codigo-essencia | AdminGuard | A criar | isSuperAdminOnly |
| /admin/limpeza | AdminGuard | Ja existe | can_delete_data |
| /admin/configuracoes | AdminGuard | Ja existe | can_manage_settings |
| /admin/landing-page | AdminGuard | A criar | can_manage_settings |
| /admin/depoimentos | AdminGuard | A criar | can_manage_settings |
| /admin/identidade-visual | AdminGuard | A criar | can_manage_settings |
| /admin/alertas-admin | AdminGuard | A criar | can_manage_settings |

---

## Padrao de Implementacao nos Componentes

Para cada componente que precisa de guard interno:

```typescript
import { AdminGuard } from "./AdminGuard";

export const AdminLogs = () => {
  return (
    <AdminGuard isSuperAdminOnly fallbackMessage="Logs de auditoria sao restritos a Super Admins">
      {/* Conteudo existente do componente */}
    </AdminGuard>
  );
};
```

Isso garante dupla protecao:
1. Guard na rota impede carregamento do bundle
2. Guard no componente protege se alguem importar diretamente

---

## Card de Acesso Restrito (Design)

```text
+--------------------------------------------------+
|                                                  |
|              [Shield Icon]                       |
|                                                  |
|            Acesso Restrito                       |
|                                                  |
|    Voce nao tem permissao para acessar esta      |
|    pagina. Entre em contato com um Super Admin   |
|    se precisar de acesso.                        |
|                                                  |
|              [Voltar ao Dashboard]               |
|                                                  |
+--------------------------------------------------+
```

---

## Beneficios da Arquitetura

1. **Defesa em Profundidade**: Dois niveis de protecao
2. **DRY**: Guard reutilizavel elimina duplicacao
3. **Lazy Load Seguro**: Guard na rota impede download de codigo nao autorizado
4. **Consistencia Visual**: Mesmo card de acesso negado em todo admin
5. **Manutencao Facil**: Adicionar nova pagina protegida requer apenas uma linha
6. **Tipo Seguro**: TypeScript garante que apenas permissoes validas sao usadas

---

## Criterios de Aceite

- Usuario Growth acessando `/admin/precos` via URL ve "Acesso Restrito"
- Usuario Growth acessando `/admin/logs` via URL ve "Acesso Restrito"
- Nenhuma chamada de API e feita antes do guard bloquear
- Super Admin acessa todas as paginas normalmente
- Todos os 11 componentes listados tem protecao dupla
