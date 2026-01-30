
# Plano: Unificar Layout do PDF do Código do Casal com o Código da Essência

## Análise das Diferenças Identificadas

Após analisar ambos os PDFs e os arquivos de código fonte, identifiquei as seguintes diferenças fundamentais:

### 1. Arquitetura do Código

| Aspecto | Código da Essência | Código do Casal |
|---------|-------------------|-----------------|
| Linhas de código | ~1.161 linhas | ~2.657 linhas (2.3x maior) |
| Estrutura | Função única `buildCodigoEssenciaDoc()` | Classe `PDFGenerator` com múltiplos métodos |
| Complexidade | Fluxo linear e previsível | Lógica complexa com normalização de dados |
| Dependência de dados | Dados dos 7 testes padronizados | Dados de IA dinâmicos com múltiplas variações de chaves |

### 2. Diferenças Visuais

| Elemento | Código da Essência | Código do Casal |
|----------|-------------------|-----------------|
| Capa | Fundo escuro (#0f0f14), elegante e minimalista | Fundo azul-marinho com elementos decorativos mais elaborados |
| Headers | Barra colorida simples no topo | Headers com bordas arredondadas |
| Tipografia | Consistente: títulos 42pt, texto 11pt | Variável: múltiplos tamanhos sem padrão claro |
| Espaçamento | Generoso e respirado | Compacto para caber mais conteúdo |
| Cards | Fundo cinza claro com bordas sutis | Múltiplas cores por seção (verde, âmbar, vermelho) |
| Gráficos | Não possui (os dados vêm dos 7 testes) | Gráfico radar DISC nativo |

### 3. Por Que Você Precisa Pedir Configuração Toda Vez

O problema principal é que os dois PDFs foram desenvolvidos **em momentos diferentes, com filosofias diferentes**:

1. **Código da Essência**: Construído com dados **estruturados e previsíveis** (resultados dos 7 testes)
2. **Código do Casal**: Construído para consumir dados **dinâmicos gerados por IA** com múltiplas variações de chaves

O PDF do Casal precisa de uma camada massiva de normalização de dados (`normalizeContent()` com ~200 linhas) para lidar com:
- Chaves em português vs inglês
- Dados ausentes ou em formato diferente
- Variações de nomes de propriedades (ex: `zona_ajuste` vs `zona_de_ajuste`)

## Solução Proposta

### Fase 1: Criar Biblioteca de Componentes PDF Unificada

Criar um módulo compartilhado `src/lib/pdf/pdfPremiumCore.ts` com:

1. **Paleta de Cores Unificada**
```text
┌─────────────────────────────────────────┐
│  CORES PREMIUM                          │
├─────────────────────────────────────────┤
│  Primary:  #1f2e4b (Azul Profundo)      │
│  Gold:     #cdae67 (Dourado Essência)   │
│  Text:     #323232 (Texto Principal)    │
│  Muted:    #787878 (Texto Secundário)   │
│  Background: #0f0f14 (Capa Escura)      │
└─────────────────────────────────────────┘
```

2. **Componentes Reutilizáveis**
   - `renderPremiumCover()` - Capa escura elegante
   - `renderSectionHeader()` - Headers padronizados
   - `renderCard()` - Cards com estilo consistente
   - `renderFooter()` - Rodapé com marca

3. **Helpers Compartilhados**
   - `ensureSpace()` - Quebra de página automática
   - `writeWrappedText()` - Texto com quebra
   - `measureTextHeight()` - Cálculo de altura

### Fase 2: Refatorar PDF do Casal

1. **Importar componentes do core**
2. **Manter lógica de normalização** (necessária para dados da IA)
3. **Substituir renderização visual** pelos componentes unificados
4. **Preservar conteúdo específico** (gráfico radar DISC, semáforo relacional)

### Fase 3: Resultado Final Esperado

Ambos os PDFs terão:

```text
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                    [CAPA PREMIUM UNIFICADA]                     │
│                    Fundo escuro (#0f0f14)                       │
│                    Linha dourada decorativa                     │
│                    Título em branco, nome em cinza              │
│                    Marca NELLO ONE/IDENTITY                     │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [HEADER DA SEÇÃO]   ████████████████████████████████████       │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  [CARD PADRONIZADO]                                     │    │
│  │  Fundo: #f8f8f8                                         │    │
│  │  Borda: #e6e6e6                                         │    │
│  │  Cantos arredondados: 3px                               │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ────────────────────────────────────────────────────────────   │
│  NELLO ONE • Página X de Y                                      │
└─────────────────────────────────────────────────────────────────┘
```

## Detalhes Técnicos da Implementação

### Arquivos a Criar

1. **`src/lib/pdf/pdfPremiumCore.ts`**
   - Classe `PremiumPDFBuilder` com métodos reutilizáveis
   - Constantes de cores, fontes e espaçamentos
   - Helpers de renderização

2. **`src/lib/pdf/pdfPremiumCover.ts`**
   - Template da capa premium unificada
   - Suporte a nome individual ou casal

3. **`src/lib/pdf/pdfPremiumStyles.ts`**
   - Definições de estilos CSS-like para jsPDF

### Arquivos a Modificar

1. **`src/lib/pdfCodigoCasal.ts`**
   - Importar componentes do core
   - Substituir métodos `renderCover()`, `renderSectionHeader()`, etc.
   - Manter `normalizeContent()` e lógica específica do casal

2. **`src/lib/pdfCodigoEssencia.ts`**
   - Refatorar para usar os mesmos componentes do core
   - Manter estrutura de dados atual

### Impacto nas Funcionalidades Existentes

| Funcionalidade | Impacto |
|---------------|---------|
| Download PDF individual | ✅ Mantido, visual atualizado |
| Download PDF casal | ✅ Mantido, visual unificado |
| Envio por email | ✅ Mantido |
| Gráficos DISC casal | ✅ Mantido (renderização nativa) |
| Semáforo relacional | ✅ Mantido, visual padronizado |
| Dados de IA | ✅ Mantido (normalização preservada) |

## Benefícios da Unificação

1. **Consistência Visual**: Ambos os relatórios terão a mesma identidade premium
2. **Manutenção Simplificada**: Mudanças visuais em um único lugar
3. **Menos Código Duplicado**: Redução de ~40% no código total
4. **Qualidade Premium**: O PDF do casal herdará a elegância do Essência
5. **Fim das Configurações Manuais**: Um padrão = um comportamento

## Estimativa de Esforço

- **Criação do core**: ~200 linhas
- **Refatoração do Casal**: ~400 linhas alteradas
- **Refatoração do Essência**: ~200 linhas alteradas
- **Testes e ajustes**: Verificação de ambos os PDFs

## Próximos Passos

Após aprovação, implementarei:
1. Criar a biblioteca de componentes PDF unificada
2. Refatorar o PDF do Código do Casal para usar os novos componentes
3. Ajustar o PDF do Código da Essência para compartilhar o mesmo core
4. Testar ambos os downloads para garantir consistência
