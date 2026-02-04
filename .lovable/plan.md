
# Plano: Integrar Módulo DISCERNIR ao Admin PRO

## Visão Geral

Criar uma seção dedicada "DISCERNIR" no painel administrativo existente (`/admin`) que permite ao Super Admin (você) gerenciar o projeto piloto pastoral: paróquias, padres, casais, convites, consentimentos e métricas.

---

## Arquitetura Proposta

```text
/admin/discernir                    → Dashboard do Piloto (KPIs)
/admin/discernir/paroquias          → Gestão de Paróquias
/admin/discernir/padres             → Gestão de Padres
/admin/discernir/casais             → Visão Global de Casais
/admin/discernir/convites           → Convites Pendentes/Enviados
/admin/discernir/consentimentos     → Auditoria LGPD
/admin/discernir/acessos            → Logs de Acesso Pastoral
```

---

## Hierarquia de Acessos

| Papel | Acesso |
|-------|--------|
| Super Admin (você) | Tudo - gestão completa do piloto |
| Admin Suporte | Leitura de métricas e casais |
| Padre (via DISCERNIR) | Apenas casais da sua paróquia |

---

## Fase 1: Estrutura Base

### 1.1 Adicionar Seção DISCERNIR ao Sidebar

**Arquivo**: `src/components/admin/AdminSidebar.tsx`

Nova seção no menu:
```typescript
{
  label: "DISCERNIR",
  items: [
    { title: "Piloto", url: "/admin/discernir", icon: Church, exact: true, permission: 'super_admin_only' },
    { title: "Paróquias", url: "/admin/discernir/paroquias", icon: Building2, permission: 'super_admin_only' },
    { title: "Padres", url: "/admin/discernir/padres", icon: UserCog, permission: 'super_admin_only' },
    { title: "Casais", url: "/admin/discernir/casais", icon: Users, permission: 'super_admin_only' },
    { title: "Convites", url: "/admin/discernir/convites", icon: Mail, permission: 'super_admin_only' },
    { title: "Consentimentos", url: "/admin/discernir/consentimentos", icon: ShieldCheck, permission: 'super_admin_only' },
  ]
}
```

### 1.2 Adicionar Rotas ao Admin.tsx

**Arquivo**: `src/pages/Admin.tsx`

Novas rotas protegidas com `AdminGuard isSuperAdminOnly`:
```typescript
<Route path="discernir" element={
  <AdminGuard isSuperAdminOnly>
    <AdminDiscernirDashboard />
  </AdminGuard>
} />
<Route path="discernir/paroquias" element={...} />
<Route path="discernir/padres" element={...} />
// etc.
```

---

## Fase 2: Componentes do Módulo

### 2.1 Dashboard do Piloto

**Novo arquivo**: `src/components/admin/discernir/AdminDiscernirDashboard.tsx`

KPIs exibidos:
- Total de paróquias ativas
- Total de padres cadastrados
- Casais ativos vs. concluídos
- Convites pendentes vs. aceitos
- Consentimentos ativos
- Taxa de conversão (convite → casal ativo)

Cards visuais com ícones pastorais (Church, Users, Heart).

### 2.2 Gestão de Paróquias

**Novo arquivo**: `src/components/admin/discernir/AdminDiscernirParoquias.tsx`

Funcionalidades:
- Lista de paróquias (nome, cidade, diocese, código)
- Criar nova paróquia
- Editar paróquia existente
- Ativar/desativar paróquia
- Ver padres vinculados

### 2.3 Gestão de Padres

**Novo arquivo**: `src/components/admin/discernir/AdminDiscernirPadres.tsx`

Funcionalidades:
- Lista de padres (nome, email, paróquia, role)
- Vincular usuário existente como padre
- Definir role: `priest`, `coordinator`, `assistant`
- Ativar/desativar acesso
- Trocar paróquia

### 2.4 Visão Global de Casais

**Novo arquivo**: `src/components/admin/discernir/AdminDiscernirCasais.tsx`

Funcionalidades:
- Todos os casais de todas as paróquias
- Filtro por paróquia
- Status do casal (ativo, pausado, concluído)
- Status de consentimento de cada cônjuge
- Progresso na jornada Identity

### 2.5 Gestão de Convites

**Novo arquivo**: `src/components/admin/discernir/AdminDiscernirConvites.tsx`

Funcionalidades:
- Convites pendentes/aceitos/expirados
- Padre que enviou
- Emails dos cônjuges
- Reenviar convite
- Cancelar convite

### 2.6 Auditoria de Consentimentos

**Novo arquivo**: `src/components/admin/discernir/AdminDiscernirConsentimentos.tsx`

Funcionalidades:
- Lista de todos os consentimentos
- Tipo: individual, conjugal, priest_access
- Status: ativo ou revogado
- Data de concessão/revogação
- Motivo de revogação (se aplicável)
- Filtros por tipo e status

---

## Fase 3: Logs de Acesso

### 3.1 Auditoria de Acessos Pastorais

**Novo arquivo**: `src/components/admin/discernir/AdminDiscernirAcessos.tsx`

Exibe dados da tabela `discernir_access_logs`:
- Padre que acessou
- Casal/usuário acessado
- Ação realizada (view_couple, view_apoio)
- Data/hora
- Consentimento verificado (sim/não)

---

## Estrutura de Pastas

```text
src/components/admin/
├── discernir/
│   ├── AdminDiscernirDashboard.tsx
│   ├── AdminDiscernirParoquias.tsx
│   ├── AdminDiscernirPadres.tsx
│   ├── AdminDiscernirCasais.tsx
│   ├── AdminDiscernirConvites.tsx
│   ├── AdminDiscernirConsentimentos.tsx
│   └── AdminDiscernirAcessos.tsx
├── AdminSidebar.tsx (atualizado)
└── ... (outros componentes existentes)
```

---

## Considerações de UX

1. **Estilo visual**: Manter consistência com Admin PRO atual (minimalista, cards limpos)
2. **Cores temáticas**: Usar tons âmbar/dourado discretos para referenciar o DISCERNIR
3. **Ícones**: Church (paróquias), Shield (consentimentos), Users (casais), Eye (acessos)
4. **Proteção**: Todas as rotas são `isSuperAdminOnly` - nenhum admin comum pode acessar

---

## Detalhes Técnicos

### Queries principais

```typescript
// Paróquias
supabase.from('discernir_parishes').select('*')

// Padres com dados do perfil
supabase.from('discernir_priests').select(`
  *,
  profile:profiles(full_name, email),
  parish:discernir_parishes(name)
`)

// Casais com consents
supabase.from('discernir_couples').select(`
  *,
  parish:discernir_parishes(name),
  spouse_a:profiles!spouse_a_user_id(full_name, email),
  spouse_b:profiles!spouse_b_user_id(full_name, email)
`)

// Métricas do piloto
// Agregações via .count() ou queries separadas
```

### Permissões (sem novas tabelas)

Reutiliza o sistema existente de `AdminGuard`:
- `isSuperAdminOnly = true` para todas as páginas DISCERNIR
- Nenhuma nova permissão necessária no `admin_permissions`

---

## Ordem de Implementação

1. **Sidebar + Rotas** (estrutura base)
2. **Dashboard do Piloto** (visão geral com KPIs)
3. **Paróquias** (CRUD básico)
4. **Padres** (vincular usuários)
5. **Casais** (visualização global)
6. **Convites** (gestão)
7. **Consentimentos + Acessos** (auditoria LGPD)

---

## Benefícios

- Centralizado no mesmo painel Admin PRO
- Reutiliza infraestrutura de permissões
- Sem duplicação de código de autenticação
- Fácil de expandir conforme o piloto cresce
- Auditoria completa para conformidade LGPD
