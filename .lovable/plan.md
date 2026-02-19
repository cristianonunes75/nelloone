

# Campanha Flash Sale Fevereiro -- Landing Page Nello One

## Visao Geral

Transformar a landing page atual ("Condicao de Estreia" a R$ 648,50) em uma campanha de tempo limitado "Flash Sale Fevereiro" com countdown, novo preco (R$ 248,50), selo flutuante de 50% OFF e CTAs atualizados.

**Prazo da campanha:** Ate 28 de fevereiro de 2026, 23:59 (horario de Brasilia)

---

## O que muda

| Elemento | Atual | Novo |
|----------|-------|------|
| Preco BRL | R$ 648,50 | R$ 248,50 (original R$ 497 riscado) |
| Preco USD | $198,50 | ~$98,50 |
| Preco EUR | EUR 148,50 | ~EUR 74,50 |
| Label | "Primeira Edicao - Condicao de Estreia" | "Flash Sale Fevereiro - 50% OFF" |
| CTA principal | "Acessar meu Codigo da Essencia" | "Garantir meu Codigo com 50% OFF" |
| Countdown | Nao existe | Timer regressivo ate 28/02/2026 23:59 BRT |
| Selo flutuante | Nao existe | Badge "50% OFF" fixo na tela |
| Texto de confianca | Parcial | "Pagamento unico. Acesso vitalicio. Stripe." |

---

## Componentes a criar

### 1. CountdownBanner (novo componente)
- Barra fixa no topo da pagina (abaixo da NavSection)
- Contador regressivo com dias, horas, minutos e segundos
- Data-alvo: 28/02/2026 23:59:59 BRT (UTC-3)
- Quando expirar, exibe "Oferta encerrada" e oculta automaticamente
- Estilo: fundo escuro (ink-deep) com texto dourado

### 2. FloatingBadge (novo componente)
- Selo circular "50% OFF" flutuante
- Posicao fixa no canto inferior direito (acima do MobileStickyCtA no mobile)
- Aparece apos scroll de 300px
- Animacao sutil de pulse
- Ao clicar, rola ate a secao de precos (#precos)

### 3. FlashSalePricingCard (atualizacao da secao de precos)
- Preco original R$ 497 com texto riscado (line-through)
- Preco promocional R$ 248,50 em destaque
- Badge "50% de Desconto Real" acima do preco
- Texto: "Condicao exclusiva de lancamento. O valor retorna ao original em 1 de Marco."
- Texto de confianca: "Pagamento unico. Acesso vitalicio ao sistema e aos seus relatorios. Processamento seguro via Stripe."
- Secao "O que voce recebe":
  - Codigo da Essencia (Seu perfil individual)
  - Codigo do Casal (Sinergia com seu parceiro/a)
  - Ativacao Pratica (Decisao concreta para os proximos 7 dias)

---

## Arquivos a modificar

### `src/lib/priceConfig.ts`
- Atualizar `launchPrices` e `bundlePrices` com os novos valores da Flash Sale
- BRL: original R$ 497 -> promo R$ 248,50
- USD: original $197 -> promo $98,50
- EUR: original EUR 147 -> promo EUR 74,50

### `src/components/landing/v2/NelloOneLanding.tsx`
- Adicionar CountdownBanner logo apos NavSection
- Atualizar secao de pricing (secao 6) com nova estrutura de preco
- Atualizar CTAs do hero e pricing para novo texto
- Adicionar FloatingBadge no final do componente

### Novos arquivos:
- `src/components/landing/v2/CountdownBanner.tsx` -- componente do countdown
- `src/components/landing/v2/FloatingBadge.tsx` -- selo flutuante 50% OFF

### `src/components/landing/v2/MobileStickyCtA.tsx`
- Atualizar preco exibido para R$ 248,50
- Atualizar texto do CTA para "Garantir meu Codigo com 50% OFF"

---

## Detalhes tecnicos

### Countdown Timer
- Usa `useEffect` + `setInterval` de 1 segundo
- Calcula diferenca entre `now()` e data-alvo (28/02/2026 23:59:59 no fuso BRT)
- Exibe dias:horas:minutos:segundos
- Quando chega a zero, para o timer e pode ocultar elementos promocionais

### Internacionalizacao
- BRL (pt): "Flash Sale Fevereiro -- 50% OFF"
- USD (en): "February Flash Sale -- 50% OFF"
- EUR (pt-pt): "Flash Sale Fevereiro -- 50% OFF"

### Stripe
- Os Stripe Price IDs existentes no bundlePrices serao mantidos -- o desconto sera aplicado via cupom Stripe ou novo Price ID (a definir se voce ja tem um priceId no Stripe para R$ 248,50)

