

## Diagnóstico: Webhook Stripe Falhando

### Problema Identificado

Na **linha 331** do `stripe-webhook/index.ts`, a verificação de assinatura usa o método **síncrono** `constructEvent()`:

```typescript
event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
```

Em Edge Functions (Deno), o Node.js crypto **não está disponível**. O método correto é o **assíncrono** `constructEventAsync()` com `Stripe.createSubtleCryptoProvider()`, que usa a Web Crypto API disponível no Deno.

Este é um problema conhecido que causa falhas silenciosas — o Stripe recebe um erro 400/500 de volta e começa a reportar falhas no webhook.

### Plano de Correção

1. **Corrigir a verificação de assinatura** no `stripe-webhook/index.ts` (linha 331):
   - Trocar `stripe.webhooks.constructEvent(body, signature, webhookSecret)` por `await stripe.webhooks.constructEventAsync(body, signature, webhookSecret, undefined, Stripe.createSubtleCryptoProvider())`

2. **Limpar handlers de produtos descontinuados** no mesmo arquivo:
   - Remover o bloco `nello_couple` (linhas 779-827) — produto descontinuado
   - Remover o bloco `identity_couple_premium` (linhas 879-932) — produto descontinuado

3. **Redeploy** da edge function `stripe-webhook`

### Detalhes Técnicos

A correção principal é uma única linha:

```typescript
// ANTES (falha no Deno):
event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

// DEPOIS (funciona no Deno):
event = await stripe.webhooks.constructEventAsync(
  body, signature, webhookSecret,
  undefined,
  Stripe.createSubtleCryptoProvider()
);
```

