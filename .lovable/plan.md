
# Plano: Atualização de Preço da Ativação do Código

## Objetivo
Aumentar o preço da "Ativação do Código da Essência" de R$ 97 para R$ 197 (e proporcionalmente em USD/EUR).

---

## Novos Preços

| Moeda | Atual | Novo | Stripe Price ID |
|-------|-------|------|-----------------|
| BRL | R$ 97 | **R$ 197** | Será criado automaticamente |
| USD | $27 | **$57** | Será criado automaticamente |
| EUR | €27 | **€47** | Será criado automaticamente |

---

## Etapas de Implementação

### 1. Criar novos preços no Stripe
Usar a Edge Function `update-stripe-price` para criar 3 novos preços:
- BRL: R$ 197 → product_id do activation_individual
- USD: $57 → product_id do activation_individual  
- EUR: €47 → product_id do activation_individual

### 2. Atualizar productCatalog.ts
Modificar o objeto `activation_individual`:
```typescript
activation_individual: {
  // ...existing fields...
  priceBRL: 197,  // era 97
  priceUSD: 57,   // era 27
  priceEUR: 47,   // era 27
  priceIdBRL: "price_NOVO_BRL",
  priceIdUSD: "price_NOVO_USD", 
  priceIdEUR: "price_NOVO_EUR",
}
```

### 3. Atualizar priceConfig.ts
Modificar os objetos `ativacao_codigo` e `activation_individual`:
```typescript
ativacao_codigo: {
  testType: "ativacao_codigo",
  brl: { price: 197, priceId: "price_NOVO_BRL" },
  usd: { price: 57, priceId: "price_NOVO_USD" },
  eur: { price: 47, priceId: "price_NOVO_EUR" },
},
activation_individual: {
  testType: "activation_individual",
  brl: { price: 197, priceId: "price_NOVO_BRL" },
  usd: { price: 57, priceId: "price_NOVO_USD" },
  eur: { price: 47, priceId: "price_NOVO_EUR" },
},
```

---

## Arquivos a Modificar

| Arquivo | Ação |
|---------|------|
| `src/components/monetization/productCatalog.ts` | Atualizar preços e Price IDs |
| `src/lib/priceConfig.ts` | Atualizar preços e Price IDs |

---

## Fluxo de Execução

1. Obter o Product ID do Stripe para activation_individual
2. Chamar a ferramenta do Stripe para criar novos preços em cada moeda
3. Atualizar os arquivos de código com os novos Price IDs
4. Testar checkout para verificar funcionamento

---

## Considerações

- **Compras anteriores**: Não são afetadas (já processadas)
- **Cupons**: Continuam funcionando normalmente
- **Preços antigos**: Serão arquivados no Stripe automaticamente
- **Rollback**: Possível reativando os preços antigos no Stripe

---

## Comparação Final de Produtos

| Produto | BRL | USD | EUR |
|---------|-----|-----|-----|
| Teste Individual | R$ 47-197 | $17-57 | €10-53 |
| **Ativação Individual (novo)** | **R$ 197** | **$57** | **€47** |
| Ativação do Casal | R$ 197 | $57 | €47 |
| Código do Casal | R$ 297 | $59 | €55 |
| Couple Premium | R$ 997 | $297 | €247 |

A Ativação Individual agora está corretamente posicionada no mesmo nível da Ativação do Casal.
