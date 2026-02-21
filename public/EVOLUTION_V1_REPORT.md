# Relatório de Evolução Estrutural — Identity V1

**Data:** 2026-02-21  
**Versão:** V1 → V1-Enhanced  
**Objetivo:** Fortalecer base técnica sem desenvolver V2  

---

## 1. Alterações Realizadas

### 1.1 Migração de Banco de Dados

| Alteração | Tabela | Tipo |
|-----------|--------|------|
| `test_version` (text, default 'v1') | `tests` | Nova coluna |
| `question_version` (integer, default 1) | `test_questions` | Nova coluna |
| `scoring_version` (text, default 'v1') | `user_tests` | Nova coluna |
| `identity_version` (text, default 'v1') | `user_tests` | Nova coluna |
| `normalized_scores` (jsonb) | `user_tests` | Nova coluna |
| `tie_resolution` (jsonb) | `user_tests` | Nova coluna |
| `theoretical_references` | — | Nova tabela |
| `test_conceptual_metadata` | — | Nova tabela |
| `journey_checkpoints` | — | Nova tabela |

### 1.2 Índices Criados

- `idx_tests_version` em `tests(test_version)`
- `idx_test_questions_version` em `test_questions(question_version)`
- `idx_user_tests_scoring_version` em `user_tests(scoring_version)`
- `idx_theoretical_references_test` em `theoretical_references(test_type)`
- `idx_theoretical_references_dimension` em `theoretical_references(test_type, dimension)`
- `idx_journey_checkpoints_user` em `journey_checkpoints(user_id, test_type)`

### 1.3 RLS Policies

- `theoretical_references`: SELECT público, ALL para admins
- `test_conceptual_metadata`: SELECT público, ALL para admins
- `journey_checkpoints`: ALL para owner (auth.uid() = user_id)

---

## 2. Novos Módulos de Código

| Arquivo | Função |
|---------|--------|
| `src/lib/scoring/tieBreaker.ts` | Resolução universal de empates (variância → consistência → híbrido) |
| `src/lib/scoring/normalizeScores.ts` | Normalização 0-100 para todos os testes |
| `src/lib/scoring/schemaValidation.ts` | Validação Zod para JSONB de resultados |
| `src/lib/scoring/fatigueManager.ts` | Estimativa de tempo, checkpoints, pausas |
| `src/lib/scoring/index.ts` | Barrel export central |

---

## 3. Integrações

- `recalculateTestResult.ts` agora:
  - Normaliza scores automaticamente ao salvar
  - Valida schema de resultados (warning, não bloqueante)
  - Salva `scoring_version` e `identity_version`
  - Persiste `normalized_scores` no banco

---

## 4. Compatibilidade Retroativa

| Aspecto | Status |
|---------|--------|
| Dados existentes intactos | ✅ Colunas com defaults, sem migration destrutiva |
| Resultados V1 preservados | ✅ Vinculados a scoring_version='v1' |
| Perguntas existentes | ✅ question_version=1 por default |
| Coexistência V1/V2 futura | ✅ Suporte nativo via test_version |
| APIs de resultado | ✅ Campos adicionais são opt-in |

---

## 5. Dados Inseridos

### Metadata Conceitual (7 testes)

| Teste | Categoria | Mede |
|-------|-----------|------|
| DISC | `behavioral_adaptive` | Comportamento adaptativo observável |
| Temperamentos | `reactive_basal` | Estrutura reativa basal |
| Eneagrama | `motivational_core` | Motivação central inconsciente |
| Arquétipos | `symbolic_identity` | Identidade simbólica e propósito |
| Estilos Conexão | `affective_connection` | Preferência afetiva relacional |
| Inteligências | `cognitive_processing` | Perfil cognitivo múltiplo |
| MBTI | `cognitive_preference` | Preferências cognitivas funcionais |

### Referências Teóricas

- 30+ registros cobrindo cada dimensão de cada teste
- Inclui: base teórica, tipo de escala, max raw score, fórmula de normalização

---

## 6. Impacto no Banco

- **Novas tabelas:** 3
- **Novas colunas:** 6
- **Dados existentes alterados:** 0
- **Migração destrutiva:** Nenhuma
- **Downtime:** Zero

---

## 7. Próximos Passos (Não implementados — reservados para V2)

- Integrar `fatigueManager` no componente de execução de teste (UI de tempo restante)
- Integrar `tieBreaker` diretamente em cada função de scoring individual
- Dashboard analytics usando `normalized_scores`
- Expansão de perguntas com `question_version=2`
