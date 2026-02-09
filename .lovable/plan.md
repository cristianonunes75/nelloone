

## Preço de Lançamento: 50% de desconto na Jornada Identity

### Resumo

Criar um cupom de 50% de desconto para a fase de lançamento, aplicável a Jornada Identity Completa. Os preços de lançamento ficam:

- **BRL**: R$ 1.297 --> **R$ 648,50** (12x R$ 64,85)
- **USD**: $397 --> **$198,50**
- **EUR**: EUR 297 --> **EUR 148,50**

### O que sera feito

**1. Criar cupom de 50% no Stripe (LANCAMENTO50)**
- Cupom percentual de 50% de desconto
- Aplicavel ao produto `jornada_completa` (bundle)
- Limite de usos configuravel (ex: 500 usos)
- Validade de 3 meses

**2. Registrar cupom no banco de dados**
- Inserir na tabela `coupons` com:
  - `code`: LANCAMENTO50
  - `discount_type`: percentual
  - `discount_value`: 50
  - `allowed_product_type`: jornada_completa
  - `max_uses`: 500
  - `expires_at`: +3 meses

**3. Atualizar a Landing Page (SimplifiedPricingSection.tsx)**
- Mostrar preco riscado de R$ 1.297
- Preco de lancamento: **R$ 648,50**
- Badge "Lancamento" em vez de "Acesso Completo"
- Parcelamento: 12x R$ 64,85
- O cupom LANCAMENTO50 sera aplicado automaticamente no checkout

**4. Atualizar NelloOneLanding.tsx e CTAs**
- Ajustar textos de preco nas secoes que exibem valores
- Manter CTA "Acessar meu Codigo + 1 Ativacao Incluida"
- Adicionar badge de urgencia: "Preco de Lancamento"

**5. Atualizar create-checkout Edge Function**
- Adicionar logica para aplicar automaticamente o cupom LANCAMENTO50 quando o usuario comprar o bundle sem outro cupom
- Isso garante que o preco de lancamento seja aplicado sem que o usuario precise digitar codigo

**6. Atualizar MobileStickyCtA.tsx**
- Mostrar o preco de lancamento R$ 648,50

### Secao tecnica

Arquivos a modificar:
- `src/components/landing/v2/SimplifiedPricingSection.tsx` - Preco de lancamento + badge
- `src/components/landing/v2/NelloOneLanding.tsx` - Secoes com preco
- `src/components/landing/v2/MobileStickyCtA.tsx` - Preco mobile
- `src/components/landing/FinalCTA.tsx` - CTA final
- `supabase/functions/create-checkout/index.ts` - Auto-aplicar cupom de lancamento
- `src/lib/priceConfig.ts` - Adicionar precos de lancamento como constante

Stripe: Criar cupom LANCAMENTO50 via ferramenta Stripe (50% off, once)

Banco de dados: INSERT na tabela `coupons` via migracao

