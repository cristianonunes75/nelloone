# Relatório de Migração: linguagens_amor → estilos_conexao_afetiva

**Data:** 2026-02-21  
**Status:** ✅ Migração concluída com sucesso  
**Retrocompatibilidade:** 100% preservada

---

## 1. Resumo Executivo

Migração segura da nomenclatura interna `linguagens_amor` para o modelo proprietário `estilos_conexao_afetiva`, eliminando riscos jurídicos relacionados ao termo "Linguagens do Amor".

---

## 2. Alterações no Banco de Dados

| Alteração | Status |
|-----------|--------|
| Novo enum `estilos_conexao_afetiva` adicionado ao `test_type` | ✅ |
| Função `resolve_test_type()` atualizada para mapear `linguagens_amor` → `estilos_conexao_afetiva` | ✅ |
| View `test_type_mapping` atualizada com novo mapeamento | ✅ |
| Função `check_identity_essencial_completion` aceita ambos os tipos | ✅ |
| Metadata conceitual registrada em `test_conceptual_metadata` | ✅ |

---

## 3. Arquivos Frontend Modificados (src/)

| Arquivo | Alteração |
|---------|-----------|
| `src/lib/testContent.ts` | Slug `estilos_conexao_afetiva` como chave primária |
| `src/lib/priceConfig.ts` | `estilos_conexao_afetiva` como chave primária, `linguagens_amor` como alias LEGACY |
| `src/lib/growthInsights.ts` | Chave `estilos_conexao_afetiva` + tipo atualizado |
| `src/lib/scoring/normalizeScores.ts` | Configuração duplicada para ambos os nomes |
| `src/lib/scoring/schemaValidation.ts` | Schema duplicado para ambos os nomes |
| `src/lib/scoring/fatigueManager.ts` | Estimativa duplicada para ambos os nomes |
| `src/lib/recalculateTestResult.ts` | Case `estilos_conexao_afetiva` + `linguagens_amor` |
| `src/lib/pdfCodigoEssencia.ts` | Interface + lookups priorizam `estilos_conexao_afetiva` |
| `src/lib/pdfPremiumUniversal.ts` | Cor duplicada para ambos |
| `src/lib/coupleSynergy7Pillars.ts` | Chave renomeada na interface de retorno |
| `src/pages/TestExecution.tsx` | Branch aceita ambos os tipos, salva como `estilos_conexao_afetiva` |
| `src/pages/TestResults.tsx` | Detecção aceita ambos os tipos |
| `src/pages/tests/EstilosConexaoAfetiva.tsx` | testType atualizado |
| `src/pages/Cliente.tsx` | Mapeamento de slugs atualizado |
| `src/hooks/usePDFEmail.tsx` | Case duplo no switch |
| `src/utils/journey.ts` | Mapeamento bidirecional atualizado |
| `src/components/tests/TestAnswerOptions.tsx` | Chave renomeada |
| `src/components/tests/TestVisualElements.tsx` | Chave renomeada |
| `src/components/growth/TestImprovementsCard.tsx` | Chave renomeada |
| `src/components/landing/Tests.tsx` | testKey atualizado |
| `src/components/admin/SimulationMode.tsx` | Journey order + case atualizado |
| `src/components/admin/SimulatedMapPreview.tsx` | Detecção aceita ambos |
| `src/components/cliente/dashboard/DashboardStageJourney.tsx` | Chave duplicada |
| `src/components/cliente/dashboard/DashboardStageRevelation.tsx` | Chave duplicada |

---

## 4. Edge Functions Modificadas

| Função | Alteração |
|--------|-----------|
| `nello-codigo-essencia/index.ts` | requiredTypes aceita `estilos_conexao_afetiva`, mappings atualizados |
| `nello-ativacao-codigo/index.ts` | Fallback para ambas as chaves |
| `business-calculate-insights/index.ts` | Case triplo no switch |
| `business-team-insights/index.ts` | Case triplo no switch |

---

## 5. Onde `linguagens_amor` permanece (apenas como LEGACY)

- **Enum `test_type`**: valor mantido para retrocompatibilidade
- **Dados existentes no banco**: registros históricos permanecem com `linguagens_amor`
- **Aliases em configs**: mapeiam para `estilos_conexao_afetiva`
- **Switch cases**: aceitam ambos os valores

---

## 6. Validação de Integridade

| Verificação | Status |
|-------------|--------|
| Resultados históricos acessíveis | ✅ |
| Novos testes usam `estilos_conexao_afetiva` | ✅ |
| APIs aceitam ambos os identificadores | ✅ |
| Versionamento (test_version, scoring_version) intacto | ✅ |
| Normalização de scores funciona para ambos | ✅ |
| Schema validation funciona para ambos | ✅ |
| PDFs gerados corretamente | ✅ |
| Relatórios de cruzamento funcionais | ✅ |

---

## 7. Próximos Passos (Fase 2 — futuro)

1. Após confirmar zero problemas em produção, remover aliases LEGACY gradualmente
2. Migrar dados existentes: `UPDATE tests SET type = 'estilos_conexao_afetiva' WHERE type = 'linguagens_amor'`
3. Remover enum value `linguagens_amor` após período de transição
