

## Diagnóstico

### Raíssa (rayssasamarafm@gmail.com)
- **Conta existe** desde 7/Jan, último login 2/Mar
- **Jornada:** `not_started`, 0 testes concluídos
- **Testes iniciados:** Arquétipos e Temperamentos (ambos `in_progress`)
- **Compras:** ZERO registros em `test_purchases`
- **Problema claro:** Sem nenhum registro de compra `jornada_completa`, o hook `useTestAccess` bloqueia o acesso aos testes pagos. Ela provavelmente está vendo paywall ao tentar avançar

### Larissa, Hanna e Suzanne
- **Não possuem conta** no sistema ainda

---

## Plano de Ação

### 1. Criar edge function `grant-cortesia-access`

Uma função administrativa que:
- Recebe uma lista de emails
- Para cada email de usuário existente:
  - Insere registros `test_purchases` para os 7 testes com `payment_method: 'founder_grant'`, `price_paid: 0`, `purchase_category: 'jornada_completa'`
  - Atualiza `profiles` com `ativacao_codigo_unlocked: true`
- Para emails não cadastrados: armazena em `pending_cortesia_grants` (nova tabela simples) para liberar automaticamente quando criarem conta
- Retorna relatório de quais emails foram processados e quais ficaram pendentes

Isso garante que:
- Não contabiliza como venda (payment_method = `founder_grant`, price = 0)
- O filtro de cortesia existente no `AdminOrdersPayments` já reconhece `founder_grant`
- O `useTestAccess` reconhece via `hasBundlePurchase` (purchase_category = `jornada_completa`)

### 2. Criar tabela `pending_cortesia_grants`

```sql
CREATE TABLE pending_cortesia_grants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  granted_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  processed_at timestamptz,
  status text DEFAULT 'pending'
);
```

Com trigger no `handle_new_user` para verificar se o novo email tem cortesia pendente.

### 3. Executar imediatamente para os 4 emails

Após deploy da edge function, invocar para os 4 emails. Raíssa terá acesso imediato; as outras 3 ficarão na fila.

### 4. Página admin para gerenciar cortesias (opcional)

Adicionar uma seção simples no painel admin para conceder cortesias futuras.

### Arquivos afetados
- `supabase/functions/grant-cortesia-access/index.ts` (novo)
- Migração SQL para tabela `pending_cortesia_grants` + trigger
- Ajuste no `handle_new_user()` para processar cortesias pendentes

