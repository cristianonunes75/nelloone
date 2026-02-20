

# Correção: Liberar Todos os Testes ao Comprar a Jornada

## Problema

Dois problemas foram identificados:

1. **Webhook desabilitado no Stripe** -- Como mostra a sua captura de tela, o webhook `webhook-pagamento-saas` está com status "Disabled". Isso significa que o Stripe nao consegue notificar o sistema quando um pagamento e concluido, impedindo o desbloqueio automatico dos testes.

2. **Falta de redundancia no desbloqueio** -- Quando alguem compra a Jornada Completa, o sistema registra compras individuais na tabela `test_purchases`, mas nao ativa o flag `ativacao_codigo_unlocked` no perfil. Se qualquer passo falhar (webhook desabilitado, redirect nao completado), o acesso nao e liberado.

## Solucao

### Passo 1: Habilitar o Webhook no Stripe (acao sua)

1. Acesse o [Stripe Dashboard > Developers > Webhooks](https://dashboard.stripe.com/workbench/webhooks)
2. Clique no webhook `webhook-pagamento-saas` que esta "Disabled"
3. Clique nos tres pontinhos (...) e selecione "Enable"
4. Confirme que o status muda para "Enabled"

Isso e essencial para que compras futuras sejam processadas automaticamente.

### Passo 2: Adicionar flag de desbloqueio na Jornada Completa (alteracao no codigo)

Vou modificar as duas Edge Functions que processam a compra da Jornada Completa para tambem ativar `ativacao_codigo_unlocked = true` no perfil do usuario. Isso garante redundancia: mesmo que os registros de `test_purchases` falhem, o flag no perfil desbloqueia tudo.

**Arquivo 1**: `supabase/functions/stripe-webhook/index.ts`

Na secao "JORNADA COMPLETA PURCHASE" (linha 835), adicionar `ativacao_codigo_unlocked: true` ao update do perfil:

```text
// Antes:
.update({ 
  journey_status: "in_progress",
  journey_started_at: new Date().toISOString(),
  codigo_essencia_unlocked: true,
})

// Depois:
.update({ 
  journey_status: "in_progress",
  journey_started_at: new Date().toISOString(),
  codigo_essencia_unlocked: true,
  ativacao_codigo_unlocked: true,  // Desbloqueia TODOS os testes
})
```

**Arquivo 2**: `supabase/functions/verify-checkout/index.ts`

Na secao "jornada_completa" (linha 158), adicionar o mesmo flag:

```text
// Antes:
.update({ 
  journey_status: "in_progress",
  journey_started_at: new Date().toISOString(),
  codigo_essencia_unlocked: true,
})

// Depois:
.update({ 
  journey_status: "in_progress",
  journey_started_at: new Date().toISOString(),
  codigo_essencia_unlocked: true,
  ativacao_codigo_unlocked: true,  // Desbloqueia TODOS os testes
})
```

### Como funciona o desbloqueio

O hook `useTestAccessV2.tsx` ja verifica o flag `ativacao_codigo_unlocked` como uma das tres formas de ter acesso total:

```text
hasFullJourneyAccess = hasBundlePurchase OU hasAtivacaoUnlocked OU hasCompletedArquetipos
```

Ao ativar `ativacao_codigo_unlocked = true`, o sistema reconhece acesso total e:
- Remove os botoes "Liberar" e "R$ XX" dos testes
- Mostra o botao "Comecar" diretamente
- Funciona mesmo se o webhook falhar no futuro

## Resumo das Alteracoes

| Item | Acao |
|------|------|
| Stripe Webhook | Habilitar manualmente no painel do Stripe |
| `stripe-webhook/index.ts` | Adicionar `ativacao_codigo_unlocked: true` no update da Jornada Completa |
| `verify-checkout/index.ts` | Adicionar `ativacao_codigo_unlocked: true` no update da Jornada Completa |

## Resultado Esperado

- Ao comprar a Jornada Completa, **todos os testes sao liberados imediatamente**
- Nenhum botao de "Liberar" ou preco aparece para quem ja comprou
- O sistema tem redundancia: webhook + verify-checkout + flag no perfil

