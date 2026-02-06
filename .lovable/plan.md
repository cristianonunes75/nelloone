
# Plano: Correções do Identity (Nello One)

## Falhas a Corrigir

### 1. CheckoutSuccess - Rota de teste incorreta
**Arquivo**: `src/pages/CheckoutSuccess.tsx` (linha 97)

**Problema**: Quando o usuário compra durante um teste, é redirecionado para `/test/` que não existe. A rota correta é `/cliente/test-execution/`.

**Correção**:
```typescript
// Linha 97 - DE:
return `${getBasePath()}/test/${pendingTestId}/${pendingUserTestId}`;

// PARA:
return `${getBasePath()}/cliente/test-execution/${pendingTestId}/${pendingUserTestId}`;
```

---

### 2. CruzamentosPage - Redirecionamento para rota inexistente
**Arquivo**: `src/pages/cliente/CruzamentosPage.tsx` (linha 119)

**Problema**: O botão "Continuar Jornada" redireciona para `/cliente/jornada` que não existe no App.tsx. A rota correta é `/cliente`.

**Correção**:
```typescript
// Linha 119 - DE:
<Button onClick={() => navigate('/cliente/jornada')}>

// PARA:
<Button onClick={() => {
  const basePath = lang === 'en' ? '/en' : lang === 'pt-pt' ? '/pt-pt' : '';
  navigate(`${basePath}/cliente`);
}}>
```

---

### 3. Testes duplicados no banco de dados
**Problema**: Existem múltiplas versões ativas de cada teste (DISC, Temperamentos, MBTI, etc.), o que pode causar inconsistências.

**Correção via SQL**: Desativar testes duplicados, mantendo apenas a versão mais completa (com mais perguntas):
```sql
-- Identificar e desativar duplicatas, mantendo o teste com mais perguntas de cada tipo
WITH ranked_tests AS (
  SELECT 
    t.id,
    t.type,
    t.active,
    COUNT(tq.id) as question_count,
    ROW_NUMBER() OVER (
      PARTITION BY t.type 
      ORDER BY COUNT(tq.id) DESC, t.created_at DESC
    ) as rn
  FROM tests t
  LEFT JOIN test_questions tq ON tq.test_id = t.id
  WHERE t.active = true
  GROUP BY t.id, t.type, t.active
)
UPDATE tests 
SET active = false 
WHERE id IN (
  SELECT id FROM ranked_tests WHERE rn > 1
);
```

---

## Resumo das Mudanças

| Arquivo | Tipo | Descrição |
|---------|------|-----------|
| `src/pages/CheckoutSuccess.tsx` | Código | Corrigir path `/test/` para `/cliente/test-execution/` |
| `src/pages/cliente/CruzamentosPage.tsx` | Código | Corrigir navigate para usar path localizado |
| Banco de dados | SQL | Desativar testes duplicados |

---

## Resultado Esperado

| Cenário | Antes | Depois |
|---------|-------|--------|
| Compra durante teste | Redireciona para 404 | Continua o teste normalmente |
| Clicar "Continuar Jornada" em Cruzamentos | Página 404 | Vai para dashboard `/cliente` |
| Hook useJourneyProgress | Pode pegar teste errado | Sempre pega o teste correto |
