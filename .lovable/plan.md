
# Plano: Completar Proteção RLS do Fluxo de Hiring

## Contexto

As correções de segurança RLS quebraram partes do fluxo de avaliação para candidatos anônimos. Algumas partes já foram corrigidas (assessments na linha 148), mas restam 5 pontos vulneráveis.

## Problemas Identificados

| Local | Tabela | Problema | Impacto |
|-------|--------|----------|---------|
| Linha 209-224 | `tests`, `test_questions` | Query direta | Candidato não vê perguntas |
| Linha 240-244 | `hiring_answers` | Query direta | Progresso não restaura |
| Linha 393-396 | `hiring_answers` | Query direta | Fallback local pode falhar |
| Linha 492-495 | `hiring_assessments` | Query direta (não usa RPC) | Mesmo bug da Suzanne |
| Linha 500 | Lógica JS | `[].every()` sem proteção | Pula para "completed" |

## Solução

### Parte 1: Nova Função RPC para Perguntas

Criar `get_hiring_test_questions` que retorna perguntas baseado no tipo de teste:

```sql
CREATE OR REPLACE FUNCTION public.get_hiring_test_questions(_test_type text)
RETURNS TABLE (
  id uuid,
  question_number int,
  question_text text,
  options jsonb
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT tq.id, tq.question_number, tq.question_text, tq.options
  FROM test_questions tq
  JOIN tests t ON t.id = tq.test_id
  WHERE t.type = _test_type::test_type
  AND t.active = true
  AND t.language = 'pt'
  ORDER BY tq.question_number;
$$;
```

### Parte 2: Nova Função RPC para Respostas do Candidato

Criar `get_hiring_answers_by_token` para restaurar progresso e calcular resultados:

```sql
CREATE OR REPLACE FUNCTION public.get_hiring_answers_by_token(
  _token text,
  _assessment_id uuid
)
RETURNS TABLE (
  id uuid,
  question_number int,
  answer jsonb
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT ha.id, ha.question_number, ha.answer
  FROM hiring_answers ha
  JOIN hiring_assessments hass ON hass.id = ha.assessment_id
  JOIN hiring_candidates hc ON hc.id = hass.candidate_id
  WHERE ha.assessment_id = _assessment_id
  AND hc.invite_token = _token
  AND (hc.invite_expires_at IS NULL OR hc.invite_expires_at > now())
  ORDER BY ha.question_number;
$$;
```

### Parte 3: Atualizar Frontend

**Arquivo:** `src/apps/business/pages/BusinessHiringAssessment.tsx`

#### 3.1 - Substituir busca de perguntas (linhas 209-228)

```typescript
// Antes: queries diretas em tests e test_questions
const { data: questionsData, error: questionsError } = await supabase
  .rpc("get_hiring_test_questions", { _test_type: testType });

if (questionsError) throw questionsError;

const mappedQuestions = (questionsData || []).map(q => ({ 
  ...q, 
  question: q.question_text 
}));
```

#### 3.2 - Substituir restauração de progresso (linhas 240-244)

```typescript
// Usar nova RPC com token
const { data: existingAnswers, error: answersError } = await supabase
  .rpc("get_hiring_answers_by_token", { 
    _token: token, 
    _assessment_id: assessment.id 
  });
```

#### 3.3 - Substituir busca para cálculo de resultados (linhas 393-396)

```typescript
// Usar mesma RPC para cálculo
const { data: answersData, error: fetchError } = await supabase
  .rpc("get_hiring_answers_by_token", { 
    _token: token, 
    _assessment_id: currentAssessment.id 
  });
```

#### 3.4 - Corrigir refresh de assessments (linhas 492-495)

```typescript
// Usar RPC existente em vez de query direta
const { data: updatedAssessments } = await supabase
  .rpc("get_hiring_assessments_by_token", { _token: token });

setAssessments(updatedAssessments || []);

// IMPORTANTE: Proteção contra array vazio
const allCompleted = updatedAssessments && 
                     updatedAssessments.length > 0 && 
                     updatedAssessments.every(a => a.status === "completed");
```

## Arquivos a Modificar

| Arquivo | Tipo | Mudança |
|---------|------|---------|
| Nova migration SQL | Database | Criar 2 funções RPC |
| `BusinessHiringAssessment.tsx` | Frontend | Usar RPCs em 4 locais |

## Resultado Esperado

| Cenário | Antes | Depois |
|---------|-------|--------|
| Candidato inicia teste | Pode falhar ao carregar perguntas | Carrega via RPC seguro |
| Candidato atualiza página | Perde progresso | Restaura via RPC |
| Candidato completa 1º teste | Pode ir para "completed" | Vai para próximo teste |
| Suzanne tenta novamente | Vê upsell errado | Vê testes pendentes |

## Seção Técnica

### Por que criar novas RPCs?

O padrão SECURITY DEFINER permite que funções executem com privilégios elevados, bypassando RLS de forma controlada. Cada função valida o token do candidato antes de retornar dados, garantindo:

1. **Segurança**: Candidatos só acessam seus próprios dados
2. **Funcionalidade**: Fluxo funciona sem login
3. **Consistência**: Mesmo padrão das 5 RPCs já existentes

### Alternativa Considerada (Descartada)

Criar políticas RLS mais permissivas para `hiring_answers` e `test_questions`:
- **Problema**: Exporia dados sensíveis de outros candidatos
- **Decisão**: Manter RLS restrito + usar RPCs específicas
