

## Bug: Caminho Prático seleciona DISC mas abre Arquétipos

### Problema Encontrado

Quando voce seleciona o caminho "Prático" no modal de entrada, o app diz que vai começar pelo DISC, mas na verdade abre a pagina de Arquétipos.

### Causa Raiz

Na funcao `handleOnboardingComplete` (Cliente.tsx), apos salvar a preferencia:

1. O sistema invalida as queries do perfil (`queryClient.invalidateQueries`)
2. Mas imediatamente (com apenas 100ms de delay) le `journeySteps[0]` -- que ainda esta com a ordem ANTIGA (default = Arquétipos primeiro)
3. A nova ordem (Prático = DISC primeiro) so estaria disponivel apos o perfil ser re-buscado do banco, o que leva mais que 100ms

Resultado: navega para Arquétipos em vez de DISC.

### Solucao

Em vez de depender do `journeySteps` (que esta stale), usar a ordem do caminho selecionado diretamente no callback:

1. **Receber o path selecionado** no `handleOnboardingComplete` (ja recebe como parametro `EntryPath`)
2. **Calcular o primeiro teste correto** baseado no path selecionado (ex: "pratico" -> DISC, "emocional" -> Temperamentos)
3. **Encontrar o step correspondente** diretamente nos testes disponíveis, sem depender do `journeySteps` reativo
4. **Aguardar a invalidacao das queries** antes de navegar, usando `await queryClient.invalidateQueries()`

### Detalhes Tecnicos

**Arquivo:** `src/pages/Cliente.tsx` (funcao `handleOnboardingComplete`, linhas 614-627)

**Mudanca:**
- Importar as ordens de jornada diretamente (`EMOTIONAL_JOURNEY_ORDER`, `PRACTICAL_JOURNEY_ORDER`) do hook `useEntryPath`
- No `handleOnboardingComplete`, determinar o primeiro slug baseado no `path` recebido como parametro
- Buscar o teste correspondente em `journeySteps` pelo `testType` em vez de pelo indice `[0]`
- Usar `await` nas invalidacoes antes de navegar

Isso garante que, independente do estado reativo, o teste correto sera aberto.

