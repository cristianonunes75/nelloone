

# Plano de Ajuste: Barra de Progresso + PDFs Premium Unificados

## Problema 1: Barra de progresso mostrando 71% mesmo com todos os testes concluidos

**Causa raiz**: A logica em `nextTestInfo` (TestResults.tsx) verifica apenas se o teste *atual* e o ultimo da jornada (`JOURNEY_ORDER`). Se voce esta vendo o resultado do DISC (indice 4 de 7), ele assume que o proximo teste (Eneagrama, posicao 6/7) ainda precisa ser feito -- sem verificar se ja foi concluido.

**Correcao**: Modificar o `useMemo` de `nextTestInfo` para percorrer os testes restantes e verificar quais ja foram completados. Se todos estiverem completos, retornar `{ isLastTest: true }`, o que exibe "Jornada Completa!" com o botao "Ver Codigo da Essencia" e esconde a barra de progresso.

---

## Problema 2: PDFs dos testes individuais com qualidade inferior ao Codigo da Essencia

**Situacao atual**: Existem 7 geradores de PDF separados usando jsPDF puro (um para cada teste). Ja existe tambem o `handleUnifiedPDFDownload` que usa `useScreenPDF` (captura de tela com html2canvas) -- que gera PDFs identicos ao que aparece na tela. Porem, o botao "Baixar Relatorio Premium" chama os geradores jsPDF individuais, nao o screen capture.

**Correcao**: Substituir todas as 7 chamadas de PDF individuais pelo `handleUnifiedPDFDownload` (screen capture). Assim, todos os PDFs terao exatamente o mesmo visual da tela, com a mesma qualidade do Codigo da Essencia e do Codigo do Casal.

---

## Detalhes Tecnicos

### Arquivo: `src/pages/TestResults.tsx`

**Ajuste 1 - nextTestInfo (linhas 749-778)**
- Apos encontrar o proximo teste, verificar se ele ja foi concluido
- Se sim, continuar procurando o proximo nao concluido
- Se todos estiverem concluidos, retornar `isLastTest: true`
- Calcular a porcentagem baseada nos testes efetivamente concluidos, nao na posicao do teste atual

**Ajuste 2 - Botao "Baixar Relatorio Premium" (linhas 1044-1085)**
- Remover toda a cadeia de if/else que chama cada gerador individual
- Usar um unico botao que chama `handleUnifiedPDFDownload` para todos os tipos de teste
- O screen capture ja esta implementado e funcional (usado no menu flutuante)
- O resultado sera um PDF identico a tela, com graficos, cores e layout preservados

### Resultado esperado

- Quando todos os testes estiverem concluidos, a barra de progresso desaparece e mostra "Jornada Completa!" em qualquer resultado de teste
- O botao "Baixar Relatorio Premium" gera um PDF que e uma captura fiel da tela, com o mesmo padrao visual do Codigo da Essencia

