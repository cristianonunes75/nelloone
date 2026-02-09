
# Impedir que usuarios refaçam testes ja concluidos

## Problema identificado

As paginas publicas dos testes (`TestDetailPage.tsx` e `TestDetailLayout.tsx`) mostram o botao "Comecar Teste" sem verificar se o usuario ja completou aquele teste. Isso fez a Danielle refazer o "Estilos de Conexao Afetiva" sem perceber que ja tinha concluido.

No dashboard (`DashboardStageJourney.tsx`), o comportamento esta correto -- testes concluidos mostram "Concluido" e clicam para ver resultado. Mas o problema esta nas paginas de detalhe dos testes, acessiveis pela landing page ou links diretos.

## O que sera feito

### 1. `src/components/tests/TestDetailPage.tsx`
- Verificar o status do teste usando `useTests().getTestStatus(test.id)`
- Se o teste ja estiver **completed**:
  - Trocar o botao de "Comecar Teste" para **"Ver Meu Resultado"**
  - Adicionar um badge/aviso visual: **"Voce ja concluiu este teste"**
  - Ao clicar, navegar para a pagina de resultados (`/cliente/test-results/{userTestId}`) em vez de re-iniciar
- Se o teste estiver **in_progress**:
  - Trocar o texto para **"Continuar Teste"**

### 2. `src/components/tests/TestDetailLayout.tsx`
- Mesma logica: receber o status do teste como prop e ajustar botao/texto
- Mostrar badge de "Ja concluido" quando aplicavel

### 3. Buscar o `userTestId` correto
- Para navegar ao resultado, precisamos do `userTestId` do teste concluido
- Usar o array `userTests` de `useTests()` para encontrar o registro concluido correspondente

## Resultado esperado
- Usuario que ja fez um teste vera "Voce ja concluiu este teste" + botao "Ver Meu Resultado"
- Nenhuma chance de refazer um teste por engano
- Admins ainda poderao resetar testes pelo dashboard se necessario

## Detalhes tecnicos

Arquivos a modificar:
- `src/components/tests/TestDetailPage.tsx` -- adicionar verificacao de status e userTestId
- `src/components/tests/TestDetailLayout.tsx` -- adicionar prop de status e ajustar CTA
