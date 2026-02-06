
# Plano: Corrigir Perda de Progresso de Testes (Caso Saula)

## Problema Identificado

A usuária Saula completou 5 testes, mas quando retomou a jornada, 3 testes apareceram como "não iniciados".

### Diagnóstico Técnico

**Dados encontrados no banco:**

| Teste | Registro | Status | Respostas | Language | Created |
|-------|----------|--------|-----------|----------|---------|
| Arquétipos | Original | ✅ completed | 36 | pt-legacy | 05/02 19:07 |
| Arquétipos | **DUPLICADO** | ⚠️ in_progress | 0 | pt | 06/02 16:50 |

**Causa Raiz (3 problemas encadeados):**

1. **Teste legacy ativo**: Saula fez Arquétipos com test_id de `pt-legacy`
2. **Constraint errada**: `UNIQUE(user_id, test_id)` permite duplicados por **tipo** de teste
3. **Falta de ORDER BY**: Query em `useTests.tsx` sem ordenação - `.find()` pegou registro errado
4. **startTest sem validação**: Não verifica se já existe teste do mesmo **tipo** antes de criar

### Fluxo do Bug

```text
Saula acessa jornada → 
Sistema busca test_id de pt (novo) → 
startTest faz upsert → 
Constraint não encontra conflito (pt-legacy ≠ pt) → 
Cria novo registro vazio → 
Query sem ORDER BY pega o registro errado → 
Dashboard mostra "não iniciado"
```

---

## Solução Proposta

### Parte 1: Correção Imediata dos Dados

Deletar o registro duplicado vazio da Saula:

```sql
-- Remover o registro duplicado de arquetipos
DELETE FROM user_tests 
WHERE id = 'abad7563-9bca-41ac-8bd2-8ea6fde81a4c';
-- Este é o registro vazio criado hoje às 16:50
```

### Parte 2: Adicionar ORDER BY nas Queries

**Arquivo**: `src/hooks/useTests.tsx`

Modificar a query para priorizar registros completados e mais recentes:

```typescript
// Linha 53-56: Adicionar ordenação
const { data, error } = await supabase
  .from("user_tests")
  .select("*, tests(*)")
  .eq("user_id", effectiveUserId!)
  .order("status", { ascending: true }) // 'completed' vem primeiro alfabeticamente
  .order("completed_at", { ascending: false, nullsFirst: false }); // Mais recente primeiro
```

**Arquivo**: `src/hooks/useJourneyProgress.tsx`

Mesma correção para a query de target user:

```typescript
// Linha 69-72: Adicionar ordenação
const { data, error } = await supabase
  .from("user_tests")
  .select("*, tests(*)")
  .eq("user_id", effectiveUserId!)
  .order("status", { ascending: true })
  .order("completed_at", { ascending: false, nullsFirst: false });
```

### Parte 3: Prevenir Duplicações Futuras

**Arquivo**: `src/hooks/useTests.tsx`

Modificar `startTest` para verificar se já existe teste do mesmo TIPO antes de criar:

```typescript
// Antes do upsert, verificar se já existe um test do mesmo tipo
startTest = useMutation({
  mutationFn: async (testId: string) => {
    if (!user) throw new Error("User not authenticated");
    
    // Buscar o tipo do teste solicitado
    const { data: targetTest } = await supabase
      .from("tests")
      .select("type")
      .eq("id", testId)
      .single();
    
    if (!targetTest) throw new Error("Test not found");
    
    // Verificar se já existe user_test do mesmo tipo
    const { data: existingTests } = await supabase
      .from("user_tests")
      .select("id, test_id, status, tests!inner(type)")
      .eq("user_id", user.id)
      .eq("tests.type", targetTest.type);
    
    // Se já existe um registro para este tipo, atualizar em vez de criar novo
    if (existingTests && existingTests.length > 0) {
      // Priorizar o registro completado ou mais recente
      const existingRecord = existingTests.find(t => t.status === 'completed') 
                          || existingTests[0];
      
      // Atualizar o registro existente para apontar ao novo test_id
      const { data, error } = await supabase
        .from("user_tests")
        .update({
          test_id: testId,
          status: existingRecord.status === 'completed' ? 'completed' : 'in_progress',
          started_at: existingRecord.status === 'completed' 
            ? undefined // Manter o started_at original
            : new Date().toISOString(),
        })
        .eq("id", existingRecord.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
    
    // Se não existe, criar novo (comportamento original)
    const { data, error } = await supabase
      .from("user_tests")
      .insert({
        user_id: user.id,
        test_id: testId,
        status: "in_progress",
        started_at: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  // ... resto igual
});
```

---

## Arquivos a Modificar

| Arquivo | Tipo | Mudança |
|---------|------|---------|
| Manual SQL | Database | Deletar registro duplicado da Saula |
| `src/hooks/useTests.tsx` | Frontend | Adicionar ORDER BY + validar tipo antes de criar |
| `src/hooks/useJourneyProgress.tsx` | Frontend | Adicionar ORDER BY na query de admin |

---

## Resultado Esperado

| Cenário | Antes | Depois |
|---------|-------|--------|
| Saula acessa jornada | Vê Arquétipos como "não iniciado" | Vê como "concluído" |
| Usuário com teste pt-legacy | Pode criar duplicado | Atualiza registro existente |
| Query de progresso | Pega primeiro registro (aleatório) | Pega registro completado primeiro |

---

## Seção Técnica

### Por que `ORDER BY status ASC` funciona?

Em ordem alfabética:
- `completed` (c) vem antes de `in_progress` (i) vem antes de `not_started` (n)

Então `ORDER BY status ASC` garante que registros `completed` apareçam primeiro.

### Por que não usar constraint `UNIQUE(user_id, test_type)`?

Não existe coluna `test_type` em `user_tests` - ela está em `tests`. 
Criar uma constraint cross-table é complexo e pode quebrar funcionalidades existentes.
A solução via código é mais segura e flexível.
