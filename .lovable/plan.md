

# Plano: Corrigir Fluxo de Avaliação do Nello Business

## Problema Identificado

A candidata Suzanne está vendo a tela de upsell "Quer ir além?" (2 de 7 testes concluídos) mesmo sem ter preenchido nada.

### Causa Raiz

A migration de segurança (`20260205200004`) removeu políticas públicas das tabelas de hiring para proteger dados sensíveis. No entanto:

1. **A query `hiring_assessments` retorna array vazio** para usuários anônimos (candidatos sem login)
2. **O código JavaScript faz `[].every(a => a.status === "completed")`** que retorna `true` para array vazio
3. **O sistema pula para `phase = "completed"`** e mostra o upsell do Nello One

### Dados no Banco (Confirmados)

| Campo | Valor |
|-------|-------|
| Candidato | Suzanne Landim Xavier de Araujo |
| Status | `pending` |
| Testes | DISC (pending), Temperamentos (pending) |
| Respostas | 0 |

---

## Solução Técnica

### Parte 1: Criar Função RPC para Buscar Assessments

Nova função SECURITY DEFINER que permite buscar assessments via token do convite:

```sql
CREATE OR REPLACE FUNCTION public.get_hiring_assessments_by_token(_token text)
RETURNS TABLE (
  id uuid,
  test_type text,
  status text,
  started_at timestamptz,
  completed_at timestamptz,
  result_data jsonb
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    ha.id,
    ha.test_type,
    ha.status,
    ha.started_at,
    ha.completed_at,
    ha.result_data
  FROM public.hiring_assessments ha
  JOIN public.hiring_candidates hc ON hc.id = ha.candidate_id
  WHERE hc.invite_token = _token
  AND (hc.invite_expires_at IS NULL OR hc.invite_expires_at > now());
$$;
```

### Parte 2: Atualizar Frontend

Modificar `BusinessHiringAssessment.tsx` para usar a nova RPC:

**Antes (linha ~148):**
```typescript
const { data: assessmentsData } = await supabase
  .from("hiring_assessments")
  .select("*")
  .eq("candidate_id", candidateData.id);
```

**Depois:**
```typescript
const { data: assessmentsData } = await supabase
  .rpc("get_hiring_assessments_by_token", { _token: token });
```

### Parte 3: Corrigir Lógica de Array Vazio

Adicionar verificação de segurança para evitar que array vazio seja tratado como "todos concluídos":

```typescript
// Determine initial phase
const allCompleted = assessmentsData && 
                     assessmentsData.length > 0 && 
                     assessmentsData.every(a => a.status === "completed");
```

---

## Arquivos a Modificar

| Arquivo | Tipo | Mudança |
|---------|------|---------|
| Nova migration SQL | Database | Criar função `get_hiring_assessments_by_token` |
| `src/apps/business/pages/BusinessHiringAssessment.tsx` | Frontend | Usar RPC + corrigir lógica de array vazio |

---

## Resultado Esperado

| Cenário | Antes | Depois |
|---------|-------|--------|
| Candidato acessa link | Vê upsell imediatamente | Vê tela de consentimento |
| Assessments carregam | Query retorna [] (bloqueada) | Query retorna dados via RPC |
| Array vazio de assessments | Tratado como "completed" | Tratado como erro |
| Suzanne tenta de novo | Mesma tela de upsell | Consegue fazer os testes |

---

## Seção Técnica

### Por que `[].every()` retorna `true`?

Em JavaScript, `Array.prototype.every()` com um array vazio retorna `true` porque a condição é "vacuamente verdadeira" - não há elementos que violem a condição.

```javascript
[].every(x => x === "completed")  // true (nenhum elemento para falhar)
[{status: "pending"}].every(x => x.status === "completed")  // false
```

### Padrão de Funções SECURITY DEFINER

Este padrão já está sendo usado no projeto:
- `get_candidate_by_invite_token` - busca candidato
- `update_candidate_consent_by_token` - atualiza consentimento
- `accept_company_invite_by_token` - aceita convite

A nova função segue o mesmo padrão de segurança.

