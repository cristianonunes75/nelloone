

# Plano: Sistema PDF Premium para Todos os Relatórios

## Contexto

O PDF do **Codigo da Essencia** ja usa o sistema programatico jsPDF (`pdfCodigoEssenciaPremium.ts`), e o codigo ja foi atualizado com a linguagem "Como Voce Esta Hoje". O PDF que voce enviou foi gerado **antes** dessa atualizacao -- o codigo atual ja esta correto.

Porem, o **Codigo do Casal** (CruzamentoViewer) e os **resultados individuais dos 7 testes** ainda usam `useScreenPDF` (screenshot do ecra), que gera PDFs de qualidade inferior.

## O Que Sera Feito

### 1. Corrigir o erro de build
- Corrigir o TypeScript error em `usePushNotifications.tsx` (adicionar type assertion para `pushManager`)

### 2. Criar PDF Programatico para o Codigo do Casal
- Criar `src/lib/pdf/pdfCodigoCasalPremium.ts` usando o mesmo sistema `PremiumPDFBuilder` do core
- Estrutura do PDF do Casal:
  - **Capa Premium** (dark/gold, nomes do casal, disclaimer etico de fase)
  - **Semaforo Relacional** (verde/amarelo/vermelho com cards coloridos)
  - **Encontro das Essencias** (narrativa do casal)
  - **Grafico de Sobreposicao** (barras DISC lado a lado)
  - **Tabela de Traducao** (tabela formatada)
  - **Manual do Conjuge A e B**
  - **Alertas de Pressao**
  - **Protocolo de Paz**
  - **Desafio de Conexao 24h**
  - **Fechamento com CTA**
- Substituir o `useScreenPDF` no `CruzamentoViewer.tsx` pela funcao programatica

### 3. Criar PDF Programatico para os 7 Testes Individuais
- Criar `src/lib/pdf/pdfTestResultPremium.ts` -- gerador generico que recebe o tipo de teste e os dados
- Testes cobertos: DISC, Eneagrama, Temperamentos, Estilos de Conexao, Inteligencias, Arquetipos, Nello 16
- Estrutura de cada PDF individual:
  - **Capa** com nome do mapa e usuario
  - **Resumo do Perfil** (scores/tipo dominante)
  - **Grafico de Barras** com os scores
  - **Descricao detalhada** do resultado
  - **Rodape** com disclaimer etico
- Integrar no `TestResults.tsx` substituindo o `useScreenPDF`

### 4. Aplicar Mandato Linguistico em Todos os PDFs
- Todos os novos PDFs incluirao o disclaimer de fase obrigatorio
- Linguagem "Como voce esta" em vez de "Quem voce e"
- Suporte a PT, PT-PT e EN

## Detalhes Tecnicos

### Arquivos a criar:
- `src/lib/pdf/pdfCodigoCasalPremium.ts` -- gerador programatico do casal
- `src/lib/pdf/pdfTestResultPremium.ts` -- gerador generico dos 7 testes

### Arquivos a editar:
- `src/hooks/usePushNotifications.tsx` -- fix build error
- `src/components/codigo-essencia/CruzamentoViewer.tsx` -- trocar useScreenPDF pelo novo gerador
- `src/pages/TestResults.tsx` -- trocar useScreenPDF pelo novo gerador
- `src/lib/pdf/pdfPremiumCore.ts` -- adicionar helpers reutilizaveis (tabelas, barras lado a lado)

### Padrao visual unificado:
- Cores: Deep Navy (#1f2e4b), Gold (#cdae67), Dark Cover (#0f0f14)
- Formato A4, margens 15mm
- Capa elegante com bandas gold
- Cards com barra lateral colorida
- Rodape com paginacao e disclaimer
