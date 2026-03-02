

# Correção Critica: RLS e Edge Functions do DISCERNIR

## Problema
A auditoria identificou que varias tabelas do Discernir tem RLS ativo mas faltam policies de INSERT/UPDATE, causando falhas silenciosas. A edge function `discernir-generate-apoio` tambem falha porque tenta inserir dados como usuario comum, mas nao existe policy INSERT na tabela `discernir_apoio_escuta`.

## Resumo das Correcoes

### 1. Adicionar policies INSERT/UPDATE faltantes

**`discernir_apoio_escuta`** - Falta INSERT e UPDATE para o proprio usuario:
- INSERT: `user_id = auth.uid()` (usuario pode gerar seu proprio apoio)
- UPDATE: `user_id = auth.uid()` (usuario pode invalidar registros antigos)

**`discernir_access_logs`** - Falta INSERT para padres registrarem acesso:
- INSERT: permitido para padres ativos (via join com `discernir_priests`)

**`discernir_couples`** - Falta INSERT para criacao de casais:
- INSERT: permitido via service role (edge function ou trigger), pois casais sao criados pelo sistema ao aceitar convite

**`discernir_feedback`** - A policy FOR ALL ja cobre INSERT, OK.

### 2. Corrigir visibilidade de `discernir_parishes`

Atualmente so padres veem a paroquia. Casais vinculados tambem precisam ver o nome da sua paroquia:
- Adicionar SELECT policy: usuarios que pertencem a um casal naquela paroquia podem ver

### 3. Corrigir edge function `discernir-generate-apoio`

A funcao usa `supabaseAnonKey` com header do usuario, o que faz os inserts passarem pelo RLS como usuario comum. Com a correcao da policy INSERT na tabela `discernir_apoio_escuta` (item 1), isso passa a funcionar. Nenhuma mudanca na edge function e necessaria apos adicionar a policy.

### 4. Adicionar SELECT em `discernir_couple_invites` para convidados

Usuarios que recebem convite por email precisam ver o convite pelo token. Adicionar policy SELECT para acesso publico filtrado por token (via RPC existente ou policy direta).

---

## Detalhes Tecnicos

### Migration SQL

Uma unica migration com:

```text
-- 1. INSERT/UPDATE policies para discernir_apoio_escuta
CREATE POLICY "Users can insert own apoio escuta"
  ON discernir_apoio_escuta FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own apoio escuta"
  ON discernir_apoio_escuta FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- 2. INSERT policy para discernir_access_logs (padres)
CREATE POLICY "Priests can insert access logs"
  ON discernir_access_logs FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM discernir_priests
      WHERE id = discernir_access_logs.priest_id
      AND user_id = auth.uid()
    )
  );

-- 3. SELECT em discernir_parishes para casais
CREATE POLICY "Couples can view their parish"
  ON discernir_parishes FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM discernir_couples
      WHERE parish_id = discernir_parishes.id
      AND (spouse_a_user_id = auth.uid() OR spouse_b_user_id = auth.uid())
    )
  );

-- 4. INSERT em discernir_couples (sistema/convite)
CREATE POLICY "System can create couples"
  ON discernir_couples FOR INSERT
  TO authenticated
  WITH CHECK (
    spouse_a_user_id = auth.uid() OR spouse_b_user_id = auth.uid()
  );
```

### Arquivos modificados
- Nenhum arquivo frontend precisa mudar
- Apenas 1 migration SQL nova
- Edge function `discernir-generate-apoio` permanece inalterada (o fix do RLS resolve o problema)

### Resultado esperado
- `discernir-generate-apoio` consegue salvar e atualizar registros
- Padres conseguem registrar logs de acesso
- Casais veem o nome da paroquia
- Casais podem ser criados ao aceitar convite

