
# Correção: Navegação direta para o Eneagrama (caso Érica Ceolin)

## Problema identificado

A Érica tem o teste Eneagrama "em andamento" (6 de 114 perguntas respondidas). Quando ela clica para continuar, dois problemas ocorrem:

1. A função `handleContinueTest` no dashboard (`Cliente.tsx`) **não tem tratamento de erro** (try/catch). Se `startTestAsync` falhar por qualquer motivo, o erro não é capturado e ela vê um erro genérico sem feedback útil.

2. A função `startTestAsync` faz uma **atualização desnecessária** no banco ao continuar um teste em andamento -- ela busca o registro existente e faz um UPDATE mesmo quando nada precisa mudar. Isso cria uma operação extra que pode falhar.

## Solução

### 1. Adicionar tratamento de erro em `handleContinueTest` (`src/pages/Cliente.tsx`)

Envolver a chamada em try/catch e, em vez de chamar `startTestAsync` (que tenta iniciar/atualizar), buscar diretamente o `userTest` existente dos dados já carregados.

```typescript
const handleContinueTest = async (step: typeof journeySteps[0]) => {
  try {
    // First try to find existing in-progress test from already-loaded data
    const existingUserTest = userTests?.find(
      ut => ut.test_id === step.testId && ut.status === 'in_progress'
    );
    
    if (existingUserTest) {
      const basePath = getBasePath();
      navigate(`${basePath}/cliente/test-execution/${step.testId}/${existingUserTest.id}`);
      return;
    }
    
    // Fallback: use startTestAsync
    const userTest = await startTestAsync(step.testId);
    const basePath = getBasePath();
    navigate(`${basePath}/cliente/test-execution/${step.testId}/${userTest.id}`);
  } catch (error) {
    toast({
      title: "Erro ao continuar teste",
      description: "Tente novamente mais tarde.",
      variant: "destructive",
    });
  }
};
```

### 2. Melhorar `handleStartTest` para usar dados já carregados (`src/pages/Cliente.tsx`)

Mesma lógica: primeiro verificar se já existe um userTest carregado antes de chamar o backend.

### 3. Verificar e corrigir o `ativacao_codigo_unlocked` da Érica (banco de dados)

A Érica tem 6 testes concluídos mas `ativacao_codigo_unlocked` está como `false`. O hook funciona sem isso (verifica `journey_completed_tests >= 5`), mas o campo deveria estar sincronizado. Vou corrigir o valor no banco para garantir consistência.

## Arquivos a editar

- `src/pages/Cliente.tsx` -- adicionar try/catch no `handleContinueTest` e otimizar navegação usando dados já carregados
- Migração SQL -- atualizar `ativacao_codigo_unlocked` para `true` para a Érica

## Resultado esperado

- Ao clicar "Continuar" no Eneagrama, ela vai direto para a pergunta 7 (onde parou)
- Se houver qualquer erro, ela verá uma mensagem clara em vez de um erro genérico
- A navegação é mais rápida pois não precisa chamar o backend desnecessariamente
