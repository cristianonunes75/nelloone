

# Auditoria Completa das Rotas de Compra - NELLO ONE

## Resumo Executivo

Foram auditadas **4 Edge Functions de checkout** e **14 componentes frontend** que invocam essas funcoes. A arquitetura geral esta solida, mas foram encontrados **7 problemas** que precisam de correcao.

---

## Rotas de Compra Auditadas

| # | Produto | Frontend | Edge Function | Status |
|---|---------|----------|---------------|--------|
| 1 | Jornada Completa (Bundle) | PurchaseTestDialog, Checkout, TestExecution, ComprarTeste | create-checkout (isBundle) | COM PROBLEMAS |
| 2 | Teste Individual/Avulso | CartSummary, ComprarTeste | create-checkout (testIds) | OK |
| 3 | Fundadores | Checkout (coupon flow) | create-checkout (isFundadores) | OK |
| 4 | Ativacao do Codigo | PurchaseAtivacaoDialog | create-checkout (ativacao_codigo) | COM PROBLEMAS |
| 5 | Ativacao Profissional | PurchaseProfessionalActivationDialog | create-checkout (activation_individual) | COM PROBLEMAS |
| 6 | Codigo do Casal | CruzamentoCodigos | create-checkout (codigo_casal) | OK |
| 7 | Identity Couple Premium | IdentityCouplePremiumModal | create-checkout (priceId) | COM PROBLEMAS |
| 8 | Nello Flow (Assinatura) | useFlowSubscription | flow-checkout | OK |
| 9 | Business (Assinatura) | useBusinessSubscription | business-checkout | OK |
| 10 | Verificacao pos-compra | CheckoutSuccess | verify-checkout | COM PROBLEMAS |

---

## Problemas Encontrados

### PROBLEMA 1 - CRITICO: Precos divergentes entre priceConfig.ts e create-checkout

Os precos da **Ativacao do Codigo** estao diferentes no frontend e no backend:

- **priceConfig.ts** (frontend): BRL R$197, USD $57, EUR 47 euros -- usa Stripe Price IDs reais
- **create-checkout** (backend): BRL R$97, USD $27, EUR 27 euros -- usa `price_data` com valores hardcoded diferentes

O backend ignora os Price IDs do Stripe e cria precos dinamicos com valores **menores**. Isso significa que o usuario ve R$197 na interface mas pagaria R$97 no Stripe.

O **mesmo problema** existe para o **Activation Individual (Profissional)**:
- **priceConfig.ts**: BRL R$197, USD $57, EUR 47 euros
- **create-checkout**: BRL R$97, USD $27, EUR 27 euros

**Correcao**: Atualizar o `create-checkout` para usar os Stripe Price IDs corretos (ja existentes em `priceConfig.ts`) em vez de `price_data` com valores hardcoded.

### PROBLEMA 2 - MEDIO: Bundle Price IDs desatualizados no create-checkout

O `bundlePrices` em `priceConfig.ts` foi atualizado para a Flash Sale:
- BRL: `price_1T2Wc4DjhZZxZELMq1flZ1uv` (R$248,50)
- USD: `price_1T2WdaDjhZZxZELMp1qmbc4X` ($98,50)
- EUR: `price_1T2WftDjhZZxZELMyVAZPHhe` (74,50 euros)

Porem o `create-checkout` usa Price IDs **antigos** nos mapas BRL_PRICES, USD_PRICES, EUR_PRICES:
- BRL bundle: `price_1SyxwqDjhZZxZELM5b6l6Ug4` (R$1.297)
- USD bundle: `price_1SZNYXDjhZZxZELMoGVJUZRP`
- EUR bundle: `price_1SZz6vDjhZZxZELMQsZuLKah`

A Flash Sale **depende do cupom LANCAMENTO50 ser auto-aplicado** no checkout, o que funciona. Mas os Price IDs base nao refletem o preco atualizado.

**Correcao**: Atualizar os Price IDs de bundle no `create-checkout` para os novos da Flash Sale OU manter a logica de auto-apply do cupom como esta (funcional, mas fragil).

### PROBLEMA 3 - MEDIO: priceId enviado pelo frontend e ignorado pelo backend

Os componentes `IdentityCouplePremiumModal` e `ProductPaywallModal` enviam `body.priceId` para o `create-checkout`, mas a Edge Function **nunca usa esse campo**. O backend decide o preco baseado apenas em `productType`.

Isso funciona para produtos que tem logica propria (ativacao_codigo, etc.), mas para `identity_couple_premium` e outros produtos genericos do `ProductPaywallModal`, o backend **nao tem tratamento** -- cai no fluxo de testes individuais com `testIds = []` e falha com erro "At least one test ID is required".

**Correcao**: Adicionar tratamento para `identity_couple_premium` e para o campo `priceId` generico no `create-checkout`.

### PROBLEMA 4 - MEDIO: verify-checkout nao processa identity_couple_premium

A funcao `verify-checkout` trata: fundadores, jornada_completa, codigo_da_essencia, ativacao_codigo, codigo_casal, activation_individual. Mas **nao tem handler para `identity_couple_premium`**, que deveria setar `has_identity_couple_premium = true` no profile.

**Correcao**: Adicionar bloco de processamento para `identity_couple_premium` no `verify-checkout`.

### PROBLEMA 5 - BAIXO: codigo_casal usa price_placeholder

No create-checkout, os Price IDs para `codigo_casal` sao placeholders:
- `price_placeholder_codigo_casal_brl`
- `price_placeholder_codigo_casal_usd`
- `price_placeholder_codigo_casal_eur`

Isso nao causa erro porque o fluxo de `codigo_casal` usa `price_data` dinamico (hardcoded R$47/9 USD/12 EUR). Mas os placeholders nos mapas podem causar confusao.

### PROBLEMA 6 - BAIXO: Fundadores usa Price ID BRL para todas as moedas

Em `priceConfig.ts`, `fundadoresPrices` usa o mesmo Price ID (`price_1ScWglDjhZZxZELM3tQocxgu`) para BRL, USD e EUR. O `create-checkout` tambem hardcoda esse mesmo ID. Isso significa que clientes USD/EUR pagariam em BRL.

### PROBLEMA 7 - BAIXO: EUR Arquetipos Price ID divergente

Em `create-checkout`, o mapa EUR_PRICES usa `price_1SZywzDjhZZxZELMZfCg6fSd` para arquetipos, mas `priceConfig.ts` usa `price_1SayKNDjhZZxZELMhCJ6Na9m`. Sao Price IDs diferentes que podem ter valores diferentes.

---

## Detalhes Tecnicos da Correcao

### Arquivo 1: `supabase/functions/create-checkout/index.ts`

1. **Ativacao do Codigo** (linhas ~482-513): Trocar `price_data` por `price` usando os Price IDs de `priceConfig.ts`:
   - BRL: `price_1Sw6EEDjhZZxZELMSmPNECig`
   - USD: `price_1Sw6F6DjhZZxZELMfBW3pn5q`
   - EUR: `price_1Sw6FiDjhZZxZELMXDH1ACdx`

2. **Activation Individual** (linhas ~514-545): Trocar `price_data` por `price` usando:
   - BRL: `price_1SxRhHDjhZZxZELMuoj7N1CN`
   - USD: `price_1SxRhuDjhZZxZELMsAYBZqUP`
   - EUR: `price_1SxRjKDjhZZxZELMAqWHQKbm`

3. **Adicionar handler para identity_couple_premium** (apos isActivationIndividual): Usar Price IDs:
   - BRL: `price_1StyMcDjhZZxZELM5IVwqfhV`
   - USD: `price_1SvfdXDjhZZxZELMaNDfVXox`
   - EUR: `price_1SvfdoDjhZZxZELMLaONPhR5`

4. **Atualizar bundle Price IDs** para Flash Sale ou manter logica de cupom.

5. **Corrigir EUR Arquetipos**: Alinhar com `priceConfig.ts`.

### Arquivo 2: `supabase/functions/verify-checkout/index.ts`

Adicionar bloco `else if (productType === "identity_couple_premium")` que:
- Seta `has_identity_couple_premium = true` no profile
- Tambem seta `has_nello_couple = true` e `has_activation_couple = true` (conforme regra de negocio existente)
- Registra purchase na tabela `test_purchases`

### Arquivo 3: `src/lib/priceConfig.ts`

Alinhar Price ID do EUR Arquetipos para consistencia.

---

## O Que Esta Funcionando Bem

- Anti-CrossTrade Protection (validacao IP + moeda + idioma)
- Sistema de cupons (validacao, expiracao, limite de uso)
- Auto-apply do cupom LANCAMENTO50 para bundles
- Fluxo de afiliados no verify-checkout
- Idempotencia de compras (verifica transaction_id duplicado)
- Flow e Business checkouts (subscricoes Stripe)
- Redirecionamento pos-checkout com verificacao de sessao

