
# Plano: Corrigir Todas as Vulnerabilidades de Segurança (RLS e Políticas)

## Resumo das Vulnerabilidades

A análise de segurança identificou **10 problemas** que precisam de correção:

### ERRO (Crítico) - 3 issues
1. **hiring_candidates** - Dados pessoais de candidatos (nome, email, telefone) expostos via token
2. **codigo_cruzamentos** - Análise de relacionamento de casais acessível publicamente 
3. **support_tickets** - Mensagens de suporte com dados de clientes legíveis publicamente

### AVISO (Alto) - 6 issues  
4. **company_invites** - Política `USING(true)` expõe todos os convites
5. **site_visitors** - Política `WITH CHECK(true)` permite UPDATE irrestrito
6. **ai_prompts/ai_subprompts** - Prompts do AI acessíveis a usuários autenticados (propriedade intelectual)
7. **Múltiplas tabelas com WITH CHECK(true)** no INSERT/UPDATE

### INFO - 2 issues
8. **admin_cross_app_tokens** - RLS habilitado sem políticas
9. **cross_app_tokens** - RLS habilitado sem políticas

---

## Estratégia de Correção

### 1. Criar Funções SECURITY DEFINER para Acesso via Token

Para tabelas que precisam de acesso público via token mas não devem expor todos os dados:

```sql
-- Função para buscar candidato por invite_token (sem expor tabela)
CREATE OR REPLACE FUNCTION public.get_candidate_by_invite_token(_token text)
RETURNS TABLE (
  id uuid,
  full_name text,
  email text,
  position_applied text,
  company_id uuid,
  company_name text,
  company_logo_url text,
  invite_expires_at timestamptz,
  consent_given_at timestamptz,
  status text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    hc.id,
    hc.full_name,
    hc.email,
    hc.position_applied,
    hc.company_id,
    c.name as company_name,
    c.logo_url as company_logo_url,
    hc.invite_expires_at,
    hc.consent_given_at,
    hc.status
  FROM public.hiring_candidates hc
  JOIN public.companies c ON c.id = hc.company_id
  WHERE hc.invite_token = _token
  AND (hc.invite_expires_at IS NULL OR hc.invite_expires_at > now());
$$;
```

### 2. Função para Convites de Empresa

```sql
CREATE OR REPLACE FUNCTION public.get_company_invite_by_token(_token text)
RETURNS TABLE (
  id uuid,
  email text,
  role text,
  status text,
  expires_at timestamptz,
  company_id uuid,
  company_name text,
  company_logo_url text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    ci.id,
    ci.email,
    ci.role::text,
    ci.status,
    ci.expires_at,
    ci.company_id,
    c.name as company_name,
    c.logo_url as company_logo_url
  FROM public.company_invites ci
  JOIN public.companies c ON c.id = ci.company_id
  WHERE ci.invite_token = _token
  AND ci.status = 'pending'
  AND (ci.expires_at IS NULL OR ci.expires_at > now());
$$;
```

### 3. Corrigir Políticas RLS Vulneráveis

#### hiring_candidates - Remover acesso público
```sql
-- Remover política que expõe via token
DROP POLICY IF EXISTS "Candidates can view their own data via invite_token" ON public.hiring_candidates;
DROP POLICY IF EXISTS "Candidates can update their own record via invite_token" ON public.hiring_candidates;

-- Manter apenas acesso via company_admin + Nello admin
-- Acesso público será via função SECURITY DEFINER
```

#### company_invites - Restringir acesso
```sql
DROP POLICY IF EXISTS "Anyone can view invites by token" ON public.company_invites;
-- Acesso público será via função SECURITY DEFINER
```

#### support_tickets - Corrigir política de leitura
```sql
-- Remover a política que permite auth.uid() IS NULL
DROP POLICY IF EXISTS "Users can view their own tickets" ON public.support_tickets;

-- Criar política correta
CREATE POLICY "Users can view their own tickets"
ON public.support_tickets FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Manter: admins podem ver todos, qualquer um pode criar
```

#### site_visitors - Restringir UPDATE
```sql
DROP POLICY IF EXISTS "Anyone can update their own session" ON public.site_visitors;

CREATE POLICY "Visitors can update their own session"
ON public.site_visitors FOR UPDATE
USING (session_id = current_setting('app.session_id', true))
WITH CHECK (session_id = current_setting('app.session_id', true));
```

#### ai_prompts/ai_subprompts - Remover acesso de usuários
```sql
-- Remover políticas que permitem leitura por autenticados
DROP POLICY IF EXISTS "Authenticated users can view active prompts" ON public.ai_prompts;
DROP POLICY IF EXISTS "Authenticated users can view active subprompts" ON public.ai_subprompts;

-- Apenas admins e edge functions (service role) podem acessar
```

### 4. Adicionar Políticas para Tabelas sem Políticas

```sql
-- admin_cross_app_tokens
CREATE POLICY "Only admins can manage cross_app_tokens"
ON public.admin_cross_app_tokens
FOR ALL USING (has_role(auth.uid(), 'admin'));

-- cross_app_tokens
CREATE POLICY "Users can view their own tokens"
ON public.cross_app_tokens
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert tokens"
ON public.cross_app_tokens
FOR INSERT WITH CHECK (true);
```

---

## Arquivos a Modificar

### 1. Database Migration (Nova)
Criar migration SQL com todas as correções de RLS

### 2. Frontend - BusinessHiringAssessment.tsx
Alterar de query direta para usar função RPC:

```typescript
// DE:
const { data } = await supabase
  .from("hiring_candidates")
  .select(`*, company:companies(...)`)
  .eq("invite_token", token)
  .single();

// PARA:
const { data } = await supabase
  .rpc("get_candidate_by_invite_token", { _token: token })
  .single();
```

### 3. Frontend - BusinessAcceptInvite.tsx
Alterar para usar função RPC:

```typescript
// DE:
const { data } = await supabase
  .from('company_invites')
  .select(`id, email, role, ...`)
  .eq('invite_token', token)
  .single();

// PARA:
const { data } = await supabase
  .rpc("get_company_invite_by_token", { _token: token })
  .single();
```

---

## Impacto

### Segurança
- Dados de candidatos protegidos (LGPD compliance)
- Convites de empresa não mais expostos
- Tickets de suporte isolados por usuário
- Prompts do AI protegidos (propriedade intelectual)

### Funcionalidade
- Links de avaliação continuam funcionando (via RPC)
- Links de convite continuam funcionando (via RPC)  
- Formulário de suporte continua funcionando (INSERT público mantido)
- Analytics de visitantes continua funcionando

### Mudanças Necessárias no Frontend
- 2 arquivos a atualizar para usar RPC ao invés de query direta
