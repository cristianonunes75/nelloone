

## Atualizar valores do Bundle para Oferta de Estreia

### O que muda

O `bundlePrices` em `src/lib/priceConfig.ts` sera atualizado para refletir a "Primeira Edicao - Condicao de Estreia":

| Moeda | Original (antes) | Preco (antes) | Original (depois) | Preco (depois) |
|-------|-------------------|---------------|---------------------|-----------------|
| BRL   | R$ 1.897          | R$ 1.297      | R$ 1.297            | R$ 648,50       |
| USD   | $597              | $397          | $397                | $198,50         |
| EUR   | 447 EUR           | 297 EUR       | 297 EUR             | 148,50 EUR      |

### Arquivo alterado

**`src/lib/priceConfig.ts`** - Linhas 239-267 (`bundlePrices`)

Os valores `original` e `price` serao atualizados para alinhar com os valores ja definidos em `launchPrices`. Isso garante que todos os modais internos (PurchaseJornadaDialog, FullJourneyUpsell, NelloOneUpsell, etc.) mostrem o preco correto da oferta de estreia.

### Impacto

Todos os componentes que usam `bundlePrices` ou `getBundlePriceForLanguage()` serao atualizados automaticamente:
- PurchaseJornadaDialog (modal de compra)
- FullJourneyUpsell (upsell na pagina de testes)
- NelloOneUpsell (upsell no business)
- MobileStickyCtA (ja mostra R$ 648,50 hardcoded)
