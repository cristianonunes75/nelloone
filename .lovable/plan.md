

## Auditoria do Sistema de Afiliados - Problemas e Correções

### Status Atual

O sistema de afiliados esta **quase completo**, mas tem **2 bugs criticos** e **1 gap de cobertura** que impedem o funcionamento correto em producao.

---

### Problema 1: Codigo de afiliado NUNCA e limpo apos compra (BUG)

A funcao `clearAffiliateCode()` existe em `useAffiliateTracking.tsx` mas **nao e chamada em nenhum lugar do codigo**. Isso significa que:
- Um usuario que chega via `?ref=ERICA` e compra, e depois compra um segundo produto dias depois, gera **comissao duplicada** para o afiliado na segunda compra (mesmo que o afiliado nao tenha influenciado essa segunda compra)
- O codigo fica no localStorage por 30 dias, gerando comissoes indevidas

**Correcao:** Chamar `clearAffiliateCode()` na pagina `CheckoutSuccess.tsx` quando o pagamento for confirmado com sucesso (status "success" ou "already_processed").

---

### Problema 2: Fallback verify-checkout NAO processa afiliados (GAP)

O `verify-checkout` e o mecanismo de seguranca que garante que compras sejam processadas mesmo quando o webhook do Stripe falha. Porem, ele **nao tem nenhuma logica de afiliados**. Se o webhook falhar e o verify-checkout processar a compra, a comissao do afiliado e **perdida**.

**Correcao:** Adicionar processamento de afiliados no `verify-checkout/index.ts`:
1. Recuperar o `affiliate_code` dos metadados da sessao Stripe
2. Implementar a mesma logica de `processAffiliateReferral` do webhook
3. Verificar duplicidade antes de criar o registro (para evitar dupla-contagem se o webhook tambem processar)

---

### Problema 3: AffiliatePanel cria afiliado automaticamente (RISCO)

No `AffiliatePanel.tsx` (linha 115), se um usuario nao e afiliado, o componente **automaticamente cria um registro de afiliado** com 10% de comissao. Isso pode permitir que qualquer usuario se torne afiliado sem aprovacao do admin.

**Correcao:** Remover a criacao automatica de afiliados. Se o usuario nao e afiliado, mostrar apenas uma mensagem informativa ou nao mostrar o painel.

---

### Resumo das Mudancas

| Arquivo | Mudanca |
|---------|---------|
| `src/pages/CheckoutSuccess.tsx` | Importar e chamar `clearAffiliateCode()` apos compra confirmada |
| `supabase/functions/verify-checkout/index.ts` | Adicionar processamento de referral de afiliado (ler `affiliate_code` dos metadados, criar registro em `affiliate_referrals`, atualizar totais) |
| `src/components/cliente/AffiliatePanel.tsx` | Remover auto-criacao de afiliado; se nao encontrar registro, retornar null sem criar |

### Detalhes Tecnicos

**CheckoutSuccess.tsx:**
- Importar `clearAffiliateCode` de `@/hooks/useAffiliateTracking`
- Chamar `clearAffiliateCode()` dentro do bloco `if (data.success)` no `verifyCheckout()`

**verify-checkout/index.ts:**
- Apos processar a compra, ler `session.metadata.affiliate_code`
- Se existir e nao estiver vazio, buscar o afiliado na tabela `affiliates`
- Verificar se ja existe um `affiliate_referral` com o mesmo `transaction_id` (idempotencia)
- Calcular comissao e criar registro se nao existir
- Atualizar `total_sales` e `total_earnings` do afiliado

**AffiliatePanel.tsx:**
- Remover a funcao `createAffiliateRecord` e sua chamada
- Se `data` for null no fetch, simplesmente retornar null (nao mostrar painel)

