
# Plano: Atualização de Preços do Nello Hiring

## Situação Atual

Os preços atuais do Nello Hiring são:

| Plano | Preço Atual | Colaboradores |
|-------|-------------|---------------|
| **Starter** | R$ 49/mês | Até 10 |
| **Growth** | R$ 129/mês | Até 30 |
| **Enterprise** | R$ 299/mês | Até 100 |

---

## Proposta de Novos Preços

Considerando que o produto oferece **avaliação comportamental inteligente para recrutamento** com sistema de match automatizado, sugiro os seguintes valores:

| Plano | Preço Atual | **Novo Preço** | Aumento |
|-------|-------------|----------------|---------|
| **Starter** | R$ 49/mês | **R$ 97/mês** | +98% |
| **Growth** | R$ 129/mês | **R$ 247/mês** | +91% |
| **Enterprise** | R$ 299/mês | **R$ 497/mês** | +66% |

**Justificativa:** Esses valores estão mais alinhados com ferramentas de recrutamento comportamental do mercado brasileiro (Gupy, Kenoby, etc.) e refletem melhor o valor do sistema de match inteligente.

---

## Implementação Técnica

### 1. Criar Novos Preços no Stripe
- Criar 3 novos Price IDs com os valores atualizados
- Arquivar os preços antigos para manter histórico

### 2. Atualizar Frontend
**Arquivo:** `src/apps/business/hooks/useBusinessSubscription.tsx`
- Atualizar `BUSINESS_TIERS.starter.pricePerMonth` → 97
- Atualizar `BUSINESS_TIERS.growth.pricePerMonth` → 247
- Atualizar `BUSINESS_TIERS.enterprise.pricePerMonth` → 497

### 3. Atualizar Edge Function de Checkout
**Arquivo:** `supabase/functions/business-checkout/index.ts`
- Substituir os Price IDs pelos novos
- Atualizar os valores em centavos (9700, 24700, 49700)

---

## Alternativa: Você Define os Preços

Se preferir outros valores, me diga quais são e ajusto o plano! Exemplos de estruturas alternativas:

- **Conservador:** R$ 79 / R$ 179 / R$ 399
- **Premium:** R$ 147 / R$ 347 / R$ 697
- **Por vagas:** Modelo de preço por quantidade de vagas abertas
