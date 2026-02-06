
# Plano: Corrigir Conteúdo PT-PT nos Testes Brasileiros

## Problema Identificado

A Saula está vendo português de Portugal (ex: "académica", "a passar", "reages") porque **os testes ativos para `language: pt` estão com conteúdo de PT-PT**, não de PT-BR.

### Causa Raiz

Quando os testes multilíngues foram configurados, as perguntas de Portugal foram copiadas para os testes ativos em vez das brasileiras. O teste `pt-legacy` (inativo) contém o conteúdo brasileiro correto.

### Evidência

| Teste | ID Ativo (PT-PT errado) | ID Legacy (PT-BR correto) |
|-------|-------------------------|---------------------------|
| Estilos de Conexão | `12aaa9e6-cabe-4f77-aae2-5bf478dec76a` | `2a1fea19-0633-4ea9-a165-92c33b92ad5a` |

**Exemplos do erro:**
| # | Ativo (PT-PT ❌) | Correto (PT-BR ✅) |
|---|------------------|-------------------|
| 1 | "O que mais **o(a)** ajudaria?" | "O que mais **te** ajudaria?" |
| 6 | "está **a passar** por luto" | "está **passando** por luto" |
| 10 | "conquista **académica**" | "conquista **acadêmica**" |
| 13 | "mais **ligado(a)**" | "mais **conectado(a)**" |

---

## Solução Proposta

### Opção A: Trocar Perguntas (Recomendada)

Copiar o `question_text` do teste legacy (`pt-legacy`) para o teste ativo (`pt`) em **Estilos de Conexão**.

```sql
-- Para cada pergunta do teste ativo, copiar o texto do legacy
UPDATE test_questions tq_active
SET question_text = tq_legacy.question_text
FROM test_questions tq_legacy
WHERE tq_active.test_id = '12aaa9e6-cabe-4f77-aae2-5bf478dec76a'  -- Ativo (errado)
  AND tq_legacy.test_id = '2a1fea19-0633-4ea9-a165-92c33b92ad5a'  -- Legacy (correto)
  AND tq_active.question_number = tq_legacy.question_number;
```

### Opção B: Ativar o Teste Legacy

Desativar o teste atual e ativar o legacy. Porém, isso pode quebrar registros de `user_tests` existentes que referenciam o ID atual.

---

## Escopo da Correção

**Testes afetados** (precisam revisão):

| Teste | Status |
|-------|--------|
| Estilos de Conexão | ❌ Todo em PT-PT - **CRÍTICO** |
| DISC | ⚠️ Parcialmente PT-PT (ex: Q6 "reages") |
| Temperamentos | ⚠️ Parcialmente PT-PT (ex: "as minhas") |
| Arquétipos | 🔍 A verificar |
| Inteligências | 🔍 A verificar |
| Nello 16 | 🔍 A verificar |
| Eneagrama | 🔍 A verificar |

---

## Plano de Execução

### Fase 1: Correção Urgente - Estilos de Conexão

1. Executar SQL para copiar textos do legacy para o ativo (30 perguntas)
2. Verificar se a Saula vê o conteúdo correto

### Fase 2: Auditoria Completa

1. Comparar todos os 7 testes ativos com seus equivalentes legacy
2. Identificar padrões PT-PT (usar regex para "o(a)", "a passar", "reages", etc.)
3. Aplicar correções necessárias

### Fase 3: Prevenção

1. Adicionar validação no Admin para detectar padrões PT-PT em testes marcados como `pt`
2. Documentar o processo de criação de testes multilíngues

---

## Seção Técnica

### Arquivos

Nenhuma mudança de código necessária - apenas correção de dados no banco.

### Queries a Executar

```sql
-- 1. Corrigir Estilos de Conexão (copiar textos do legacy)
UPDATE test_questions tq_active
SET question_text = tq_legacy.question_text
FROM test_questions tq_legacy
WHERE tq_active.test_id = '12aaa9e6-cabe-4f77-aae2-5bf478dec76a'
  AND tq_legacy.test_id = '2a1fea19-0633-4ea9-a165-92c33b92ad5a'
  AND tq_active.question_number = tq_legacy.question_number;

-- 2. Verificar resultado
SELECT tq.question_number, LEFT(tq.question_text, 60) as texto
FROM test_questions tq
WHERE tq.test_id = '12aaa9e6-cabe-4f77-aae2-5bf478dec76a'
ORDER BY tq.question_number;
```

### Resultado Esperado

| Antes | Depois |
|-------|--------|
| "Numa conquista **académica**" | "Em uma conquista **acadêmica**" |
| "O que mais **o(a)** ajudaria?" | "O que mais **te** ajudaria?" |
| "está **a passar** por luto" | "está **passando** por luto" |
