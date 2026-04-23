
Objetivo: remover o “refresh/flash” que interrompe a execução dos testes no meio do fluxo, sem perder salvamento automático nem retomada de progresso.

1. Estabilizar o estado do teste
- Refatorar `src/hooks/useTestExecution.tsx` para separar:
  - carregamento inicial do teste
  - sincronização de respostas em segundo plano
- O loading de tela cheia ficará disponível apenas no primeiro carregamento.
- Depois que as perguntas e respostas iniciais forem carregadas, qualquer atualização futura passará a ser silenciosa.

2. Parar de forçar refetch intrusivo a cada resposta
- Revisar o salvamento de respostas em `useTestExecution`.
- Trocar a estratégia de `invalidateQueries(["test-answers", userTestId])` em toda resposta por atualização direta de cache/local state.
- Manter o dado atual visível enquanto a resposta é persistida, para que a UI não “pisque” nem pareça recarregar a página.

3. Blindar a tela de execução contra reset visual
- Ajustar `src/pages/TestExecution.tsx` para não depender de um `isLoading` global durante o teste já iniciado.
- Preservar `currentQuestionIndex`, `selectedAnswer`, `showWelcome` e demais estados locais mesmo quando houver sync em background.
- Substituir qualquer sensação de “reload” por feedback discreto, como “salvo automaticamente”, sem desmontar a tela.

4. Aplicar o padrão de “silent updates”
- Seguir o mesmo padrão já adotado em outras áreas do projeto:
  - `initialLoadDone`/flag equivalente
  - background updates sem spinner global
- Garantir que a lógica de restaurar posição rode só uma vez por teste, e não toda vez que respostas/cache mudarem.

5. Auditar dependências que podem re-renderizar o fluxo
- Revisar os hooks consumidos pela tela (`useJourneyProgress`, `useTestAccess`, e o que mais influencia a execução) para evitar que consultas auxiliares provoquem interrupções visuais no fluxo principal.
- Se necessário, limitar refetches não essenciais enquanto o usuário está respondendo.

6. Validar os cenários críticos
- Testar:
  - início do teste
  - resposta com autoavançar
  - voltar pergunta
  - retomada de teste incompleto
  - teste gratuito/freemium
  - conclusão do teste
- Confirmar que não há mais tela “Carregando teste...” aparecendo no meio da execução.

Detalhes técnicos
- Arquivos principais:
  - `src/hooks/useTestExecution.tsx`
  - `src/pages/TestExecution.tsx`
- Ajustes prováveis:
  - criar `isInitialLoading` separado de sync em background
  - usar `queryClient.setQueryData` para `["test-answers", userTestId]`
  - reduzir/remover invalidations por resposta
  - proteger o efeito de restore para executar apenas uma vez
  - manter a UI montada durante persistência assíncrona

Observação de validação
- Se o build final continuar bloqueado pelo erro do `business-resend-assessment` com `npm:resend@2.0.0`, esse ponto precisará ser corrigido junto para permitir verificação completa da solução em produção.
