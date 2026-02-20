

# Correção: Campo de Cupom Não Aparece no Checkout

## Problema Identificado

A cliente **tania.manzur@gmail.com** foi cobrada R$ 648,50 sem conseguir inserir um cupom. A análise dos logs mostra:

- O bundle (Jornada Completa) tem preço base de **R$ 1.297**
- O cupom **LANCAMENTO50** (50% OFF) foi **auto-aplicado** pelo backend, resultando em R$ 648,50
- Como o desconto já foi aplicado automaticamente, o campo `allow_promotion_codes` ficou **desabilitado** no Stripe Checkout
- A cliente não conseguiu inserir nenhum cupom próprio na página do Stripe

## Causa Raiz

Na Edge Function `create-checkout` (linhas 922-927), a lógica atual impede o campo de cupom quando qualquer desconto já está aplicado:

```text
if (!sessionParams.discounts || sessionParams.discounts.length === 0) {
  sessionParams.allow_promotion_codes = true;  // Só habilita se NÃO tem desconto
}
```

Isso significa que **toda compra de bundle** com o LANCAMENTO50 ativo bloqueia o campo de cupom no Stripe.

## Solução

### 1. Sempre habilitar o campo de cupom no Stripe Checkout

Alterar a lógica na `create-checkout` para **sempre** permitir que o usuário insira códigos promocionais, mesmo quando um desconto já está auto-aplicado. Isso permite que o cliente substitua ou acumule descontos conforme as regras do Stripe.

**Arquivo**: `supabase/functions/create-checkout/index.ts`

Substituir as linhas 922-927 por:

```text
// Always allow users to enter promo codes on the Stripe Checkout page
// Even when a discount is auto-applied, users should be able to enter their own codes
sessionParams.allow_promotion_codes = true;
logStep("Enabled promotion code field on checkout");
```

**Nota importante**: O Stripe não permite usar `discounts` e `allow_promotion_codes` simultaneamente na mesma sessão. Portanto, quando o LANCAMENTO50 é auto-aplicado via `discounts`, precisamos de uma abordagem diferente.

### 2. Abordagem correta: Remover auto-apply quando o usuário pode ter cupom

A solução mais robusta é:

- Quando o frontend envia `couponCode`, aplicar esse cupom via `discounts` e desabilitar `allow_promotion_codes`
- Quando NÃO há `couponCode` do frontend, NÃO auto-aplicar o LANCAMENTO50 via `discounts`, e em vez disso, habilitar `allow_promotion_codes = true` para que o cliente possa inserir o código manualmente no Stripe (incluindo o LANCAMENTO50 se ele estiver configurado como promotion code no Stripe)

**OU** (mais simples e recomendado):

- Manter o auto-apply do LANCAMENTO50, mas usando `allow_promotion_codes` em vez de `discounts` - criando o promotion code no Stripe e deixando o campo visível para o cliente ver e/ou trocar

### 3. Solução recomendada (mais simples)

Remover o bloco de auto-apply do LANCAMENTO50 (linhas 834-896) e, em vez disso, **sempre** habilitar `allow_promotion_codes = true`. O cupom LANCAMENTO50 deve ser comunicado ao cliente por outros meios (banner no site, e-mail, etc.) para que ela insira manualmente.

Alternativamente, manter o auto-apply mas converter para usar o campo de cupom visível:

**Arquivo**: `supabase/functions/create-checkout/index.ts`

- Remover o bloco de auto-apply do LANCAMENTO50 (linhas 834-896)
- Alterar a lógica final (linhas 922-927) para sempre habilitar `allow_promotion_codes = true`, exceto quando um cupom específico do usuário foi aplicado via `discounts`

```text
// Se o usuário enviou um cupom específico, aplica via discounts (já feito acima)
// Caso contrário, sempre habilita o campo de promotion codes
if (!couponCode) {
  // Remove any auto-applied discounts to enable the promo code field
  delete sessionParams.discounts;
  sessionParams.allow_promotion_codes = true;
  logStep("Enabled promotion code field (no user coupon provided)");
} else if (sessionParams.discounts && sessionParams.discounts.length > 0) {
  // User coupon was applied via discounts, don't enable promo field
  logStep("User coupon applied via discounts, promo field disabled");
} else {
  sessionParams.allow_promotion_codes = true;
  logStep("Enabled promotion code field on checkout");
}
```

### 4. Garantir que LANCAMENTO50 exista como Promotion Code no Stripe

Para que o cliente possa digitar "LANCAMENTO50" no campo de cupom do Stripe, precisamos garantir que exista um **Promotion Code** ativo no Stripe com esse código. Isso já é feito parcialmente no código atual, mas como promotion codes de uso único. Precisamos criar um promotion code reutilizável.

## Resumo das Alterações

| Arquivo | Alteração |
|---------|-----------|
| `supabase/functions/create-checkout/index.ts` | Remover auto-apply do LANCAMENTO50 (linhas 834-896) e ajustar lógica de `allow_promotion_codes` (linhas 922-927) para sempre mostrar o campo quando o usuário não enviou cupom |

## Resultado Esperado

- O campo de cupom **sempre aparecerá** na página de checkout do Stripe quando o usuário não enviar um cupom do frontend
- O cliente poderá digitar LANCAMENTO50 (ou qualquer outro código válido) manualmente
- Se o cliente enviar um cupom do modal da Nello, ele será aplicado automaticamente e o campo não aparecerá (para evitar confusão)

