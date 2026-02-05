
# Plano: Adicionar Opção de Jornada Completa na Página de Compra Individual

## Problema Identificado

Quando um usuário:
1. Cria perfil e inicia a jornada
2. Cancela o pagamento no checkout
3. Volta ao dashboard

Ele vê apenas a opção de clicar no próximo teste (ex: Temperamentos) e é levado para a página de compra **individual** (`/cliente/comprar/:testId`), que oferece apenas aquele teste específico — sem nenhuma menção à **Jornada Completa** (R$ 297).

---

## Solução Proposta

Adicionar uma **seção de upsell** na página `ComprarTeste.tsx` que destaca a Jornada Completa como opção mais vantajosa.

---

## Mudanças Técnicas

### Arquivo: `src/pages/ComprarTeste.tsx`

Adicionar um card de upsell abaixo do card de compra individual com:

1. **Comparação de preços**:
   - Preço individual: R$ XX (ou equivalente em USD/EUR)
   - Preço da Jornada Completa: R$ 297 (7 testes + Código da Essência)
   - Economia: mostrar o valor economizado

2. **Destaque visual**:
   - Badge "RECOMENDADO" ou "MELHOR VALOR"
   - Ícone de presente/desconto
   - Bordas douradas/primárias para chamar atenção

3. **Botão de ação**:
   - "Desbloquear Jornada Completa" → redireciona para `/checkout`

4. **Lista de benefícios**:
   - 7 testes comportamentais
   - Relatórios PDF premium
   - Código da Essência incluído
   - Análise com IA
   - Acesso vitalício

---

## Layout Visual Proposto

```text
┌─────────────────────────────────────────┐
│  [Card atual: Compra Individual]        │
│  Temperamentos - R$ XX                  │
│  [Botão: Liberar Teste]                 │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  ⭐ MELHOR VALOR                        │
│  ─────────────────────────────          │
│  Jornada Completa                       │
│  7 testes + Código da Essência          │
│                                         │
│  De R$ 597  →  R$ 297                   │
│  (Economize R$ 300)                     │
│                                         │
│  ✓ 7 Testes Premium                     │
│  ✓ Código da Essência                   │
│  ✓ Análise IA                           │
│  ✓ Acesso Vitalício                     │
│                                         │
│  [Botão: Desbloquear Jornada]           │
└─────────────────────────────────────────┘
```

---

## Lógica de Exibição

O upsell da Jornada Completa será exibido **sempre** que:
- O usuário estiver na página de compra individual
- O usuário **não** tiver `ativacao_codigo_unlocked: true` no perfil

Se o usuário já tiver a jornada desbloqueada, o upsell não aparece.

---

## Imports Necessários

```typescript
import { bundlePrices, formatPrice } from "@/lib/priceConfig";
import { Gift, Star } from "lucide-react";
```

---

## Benefícios

1. **Recupera vendas perdidas**: Usuários que cancelaram o checkout da jornada agora veem a oferta novamente
2. **Aumenta ticket médio**: Mostra claramente a economia da jornada vs. compras individuais
3. **Experiência melhor**: Usuário tem escolha clara entre compra única ou bundle
4. **Sem mudanças no backend**: Apenas frontend, reutiliza o checkout existente (`/checkout`)

---

## Textos Localizados

| Idioma | Título | CTA |
|--------|--------|-----|
| PT-BR | "Jornada Completa" | "Desbloquear Tudo" |
| EN | "Complete Journey" | "Unlock Everything" |
| PT-PT | "Jornada Completa" | "Desbloquear Tudo" |
