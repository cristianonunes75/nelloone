
# Plano: Unificar Layout do PDF do Código do Casal com o Código da Essência

## ✅ IMPLEMENTADO

### Fase 1: Biblioteca de Componentes PDF Unificada
**Arquivo criado: `src/lib/pdf/pdfPremiumCore.ts`**

Componentes implementados:
- `PREMIUM_COLORS` - Paleta de cores unificada:
  - Primary: #1f2e4b (Azul Profundo)
  - Gold: #cdae67 (Dourado Essência)
  - Text: #323232 (Texto Principal)
  - Muted: #787878 (Texto Secundário)
  - CoverBackground: #0f0f14 (Capa Escura)
  
- `PremiumPDFBuilder` - Classe com métodos reutilizáveis:
  - `renderPremiumCover()` - Capa escura elegante
  - `renderSectionHeader()` - Headers com barra colorida completa
  - `renderCompactSectionHeader()` - Headers compactos para subsections
  - `renderCard()` - Cards padronizados
  - `renderLabeledValue()` - Exibição de key-value
  - `renderColoredZone()` - Zonas coloridas (semáforo)
  - `ensureSpace()` - Quebra de página automática
  - `writeWrappedText()` - Texto com quebra
  - `measureTextHeight()` - Cálculo de altura
  - `addFooter()` - Rodapé com marca

### Fase 2: PDF do Casal Refatorado
**Arquivo modificado: `src/lib/pdfCodigoCasal.ts`**

Alterações:
1. ✅ Import do core premium (`pdfPremiumCore.ts`)
2. ✅ Cores unificadas com `PREMIUM_COLORS`
3. ✅ Capa redesenhada para o estilo escuro premium:
   - Fundo #0f0f14 (mesmo do Código da Essência)
   - Linha dourada decorativa horizontal
   - Títulos em branco, nomes em cinza
   - Layout idêntico ao Código da Essência
4. ✅ Headers de seção com barra colorida full-width
5. ✅ Mantida toda a lógica de normalização de dados
6. ✅ Mantidos gráficos DISC nativos e semáforo relacional

## Resultado Visual

Agora ambos os PDFs têm:

```text
┌─────────────────────────────────────────────────────────────────┐
│                   FUNDO ESCURO (#0f0f14)                        │
│                                                                 │
│  ════════════════════ LINHA DOURADA ════════════════════════    │
│                                                                 │
│              CODIGO DO CASAL / CODIGO DA ESSENCIA               │
│              Mapa Definitivo do Relacionamento                  │
│                                                                 │
│                    Nome A & Nome B                              │
│                                                                 │
│    "Quote inspiracional em itálico cinza"                       │
│                                                                 │
│                      NELLO ONE                                  │
│                    Data da geração                              │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│████████████████████ HEADER FULL-WIDTH ██████████████████████████│
│  Título da Seção em Branco                                      │
└─────────────────────────────────────────────────────────────────┘
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  CARD PADRONIZADO                                       │    │
│  │  Fundo: #f8f8f8                                         │    │
│  │  Borda: #e6e6e6                                         │    │
│  │  Cantos arredondados: 3px                               │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ────────────────────────────────────────────────────────────   │
│  NELLO ONE • Código do Casal                   Página X         │
└─────────────────────────────────────────────────────────────────┘
```

## Benefícios Alcançados

1. ✅ **Consistência Visual**: Ambos os relatórios têm a mesma identidade premium
2. ✅ **Biblioteca Reutilizável**: Novos PDFs podem usar o core
3. ✅ **Manutenção Simplificada**: Mudanças visuais em um único lugar
4. ✅ **Normalização Preservada**: Dados de IA continuam funcionando

## Arquivos Criados/Modificados

| Arquivo | Status |
|---------|--------|
| `src/lib/pdf/pdfPremiumCore.ts` | ✅ Criado |
| `src/lib/pdfCodigoCasal.ts` | ✅ Modificado (capa, headers, imports) |
