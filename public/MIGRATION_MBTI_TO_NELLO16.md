# Relatório de Migração: mbti → nello16

**Data:** 2026-02-21
**Status:** ✅ Migração concluída com sucesso

---

## 1. Migração de Banco de Dados

| Alteração | Status |
|-----------|--------|
| Novo enum `nello16` adicionado a `test_type` | ✅ |
| View `test_type_mapping` criada (legacy → current) | ✅ |
| Função `resolve_test_type()` criada | ✅ |
| Enum `mbti` mantido (legacy, não deletado) | ✅ |

---

## 2. Arquivos Modificados

### Código Core (Scoring/Lógica)
| Arquivo | Alteração |
|---------|-----------|
| `src/lib/mbti.ts` | Convertido em shim de re-export → `nello16Personality.ts` |
| `src/lib/recalculateTestResult.ts` | `case "nello16":` adicionado antes de `case "mbti":` |
| `src/lib/scoring/normalizeScores.ts` | Config `nello16` duplicada de `mbti` |
| `src/lib/scoring/schemaValidation.ts` | Schema `nello16` registrado |
| `src/lib/scoring/fatigueManager.ts` | Tempo estimado `nello16` adicionado |
| `src/lib/priceConfig.ts` | Key `nello16` adicionada (mesmos Price IDs), `mbti.testType` → `"nello16"` |

### Páginas e Componentes
| Arquivo | Alteração |
|---------|-----------|
| `src/pages/TestExecution.tsx` | Import → `getNello16Results`, testType check `mbti \|\| nello16` |
| `src/pages/TestResults.tsx` | `isMBTITest` check inclui `nello16` |
| `src/pages/tests/Nello16Personality.tsx` | `testType="nello16"` |
| `src/pages/ComprarTeste.tsx` | Key `nello16` adicionada |
| `src/components/tests/TestVisualElements.tsx` | Config `nello16` duplicada |
| `src/components/tests/Nello16PersonalityResultsSection.tsx` | Sem alteração (props internas) |
| `src/components/cliente/JourneyStepCard.tsx` | Key `nello16` adicionada |
| `src/components/cliente/dashboard/DashboardStageJourney.tsx` | Key `nello16` adicionada |
| `src/components/cliente/dashboard/DashboardStagePotency.tsx` | Já tinha `nello16` |
| `src/components/growth/TestImprovementsCard.tsx` | Config `nello16` duplicada |
| `src/components/landing/Tests.tsx` | `testKey: "nello16"` |
| `src/components/admin/SimulationMode.tsx` | Import unificado, checks `mbti \|\| nello16` |
| `src/components/admin/SimulatedMapPreview.tsx` | Check `mbti \|\| nello16`, label → "Nello 16" |
| `src/components/admin/AdminProductsTests.tsx` | Já mapeava `mbti: "nello16"` |

### Relatórios PDF e Cruzamentos
| Arquivo | Alteração |
|---------|-----------|
| `src/lib/pdfCodigoEssencia.ts` | Interface `nello16?` adicionada, fallback `nello16 \|\| mbti` |
| `src/lib/codigoEssenciaFallbacks.ts` | Fallback `nello16.type \|\| mbti.type` |
| `src/lib/testContent.ts` | Slug `nello16` adicionado |

---

## 3. Validação de Integridade

| Verificação | Status |
|-------------|--------|
| Dados históricos `mbti` continuam acessíveis | ✅ |
| Novos testes gravam como `nello16` | ✅ |
| Camada de tradução `mbti → nello16` no DB | ✅ |
| Preços Stripe inalterados | ✅ |
| PDFs funcionam com ambos os tipos | ✅ |
| Resultados antigos renderizam corretamente | ✅ |
| Nenhum dado deletado | ✅ |

---

## 4. Estratégia de Descontinuação

- **`mbti` NÃO foi removido** — permanece como valor válido no enum
- Todos os checks de código aceitam `mbti || nello16`
- Novos resultados são gravados com `testType: "nello16"`
- `src/lib/mbti.ts` é agora um shim que re-exporta de `nello16Personality.ts`
- Remoção futura do enum `mbti` requer migração de dados existentes

---

## 5. Próximos Passos (Não Implementados)

1. Migrar registros existentes no banco: `UPDATE user_tests SET test_type = 'nello16' WHERE test_type = 'mbti'` (via tests table)
2. Remover o shim `src/lib/mbti.ts` após confirmar zero imports diretos
3. Aplicar mesma estratégia para `linguagens_amor → estilos_conexao`
