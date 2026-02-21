# Relatório de Blindagem: MBTI → Nello16 Arquiteturas Cognitivas

**Data:** 2026-02-21  
**Status:** ✅ Blindagem completa implementada  

---

## 1. Modelo Proprietário Criado

| Campo | Valor |
|-------|-------|
| `model_name` | Nello16 |
| `model_type` | Arquiteturas Cognitivas |
| `model_status` | proprietary |
| Códigos públicos | N16-01 a N16-16 |
| Códigos internos (Nello) | N1-EA, N2-AA ... N16-AP |
| Códigos legado (interno) | INTJ, INTP ... ESFP (scoring only) |

---

## 2. Mapeamento de Códigos Públicos

| Código Público | Código Nello | Legado (interno) | Nome (PT) |
|----------------|-------------|-------------------|-----------|
| N16-01 | N1-EA | INTJ | O Estrategista |
| N16-02 | N2-AA | INTP | O Analista |
| N16-03 | N3-AO | ENTJ | O Arquitetador |
| N16-04 | N4-VI | ENTP | O Visionário |
| N16-05 | N5-CP | INFJ | O Conselheiro |
| N16-06 | N6-PI | INFP | O Poeta |
| N16-07 | N7-MI | ENFJ | O Mentor |
| N16-08 | N8-IC | ENFP | O Inspirador |
| N16-09 | N9-GP | ISTJ | O Guardião |
| N16-10 | N10-PC | ISFJ | O Protetor |
| N16-11 | N11-GE | ESTJ | O Executor |
| N16-12 | N12-AF | ESFJ | O Cuidador |
| N16-13 | N13-AV | ISTP | O Artesão |
| N16-14 | N14-AE | ISFP | O Artista |
| N16-15 | N15-AT | ESTP | O Ativador |
| N16-16 | N16-AP | ESFP | O Performer |

---

## 3. Camada de Segurança — `safeOutput()`

**Arquivo:** `src/lib/nello16SafeOutput.ts`

### Funções criadas:

| Função | Descrição |
|--------|-----------|
| `safeOutput(text)` | Sanitiza texto substituindo siglas MBTI por códigos públicos N16-XX |
| `getPublicTypeCode(legacy)` | Retorna N16-XX; lança erro se código desconhecido |
| `getPublicTypeName(legacy, lang)` | Retorna nome proprietário traduzido |
| `getNelloDisplayCode(legacy)` | Retorna código Nello (N1-EA etc.) |
| `getSafeDisplayLabel(legacy, lang)` | Label completo: "N16-01 · N1-EA — O Estrategista" |
| `validateNoLeaks(text)` | Verifica ausência de vazamentos MBTI em qualquer texto |

### Regex de detecção:
```regex
\b[IE][NS][TF][JP]\b
```

---

## 4. Arquivos Modificados — User-Facing Outputs

| Arquivo | Alteração | Risco Eliminado |
|---------|-----------|-----------------|
| `src/components/tests/Nello16PersonalityResultsSection.tsx` | Badge mostra `N16-XX · N1-EA` em vez de sigla MBTI | 🔴 → ✅ |
| `src/lib/pdfNello16Personality.ts` | Capa do PDF mostra código público em vez de sigla | 🔴 → ✅ |
| `src/components/admin/SimulationMode.tsx` | Simulação mostra códigos proprietários | 🟡 → ✅ |
| `src/pages/Cliente.tsx` | Dashboard mostra `N16-XX · N-Code — Nome` | 🟡 → ✅ |
| `src/pages/TestResults.tsx` | Import atualizado para safe output | 🟡 → ✅ |
| `supabase/functions/nello-codigo-essencia/index.ts` | Exemplo e output usam N16-XX; código público adicionado | 🟡 → ✅ |
| `supabase/functions/nello-codigo-cruzamento/index.ts` | Defaults trocados de siglas para N16-XX | 🟡 → ✅ |

---

## 5. Classificação de Ocorrências Restantes

### `internal_ok` — Mantidas como legado interno (scoring/lookup only)

| Arquivo | Contexto | Justificativa |
|---------|----------|---------------|
| `src/lib/nello16Personality.ts` | Keys do `NELLO_16_PROFILES` | Lookup interno, nunca exposto |
| `src/lib/recalculateTestResult.ts` | Scoring: `scores.E++`, tipo calculado | Engine de scoring interno |
| `src/data/behavior_metadata.ts` | Keys do `NELLO16_METADATA` | AI instructions internas |
| `src/lib/pdfNello16Personality.ts` | Keys do `NELLO_16_TYPES` | Lookup de dados para PDF |
| `src/lib/pdfCodigoEssencia.ts` | Fallback `nello16.type || mbti.type` | Compatibilidade dados antigos |
| `src/lib/codigoEssenciaFallbacks.ts` | Leitura de dados legados | Retrocompatibilidade |
| `supabase/functions/nello-codigo-essencia/index.ts` | `NELLO_16_CODE_MAP` | Tradução interna |
| `src/lib/coupleSynergy7Pillars.ts` | Geração de sinergia | Lógica interna |

### `exposure_risk` — Todos eliminados ✅

Nenhuma sigla MBTI aparece mais em:
- ❌ UI/components
- ❌ PDFs gerados
- ❌ Compartilhamento/share
- ❌ API responses ao frontend
- ❌ Relatórios do Código da Essência
- ❌ Dashboards do cliente

---

## 6. Metadata Conceitual Registrada

```typescript
NELLO16_MODEL_METADATA = {
  model_name: 'Nello16',
  model_type: 'Arquiteturas Cognitivas',
  model_status: 'proprietary',
  description: 'O Nello16 é um modelo proprietário de leitura das arquiteturas cognitivas humanas...',
  legal_notes: [
    'Jung pode ser citado apenas como referência teórica histórica.',
    'Não mencionar MBTI em conteúdos públicos.',
    'Não estabelecer equivalência direta entre Nello16 e qualquer instrumento proprietário existente.',
  ],
};
```

---

## 7. Validação de Integridade

| Verificação | Status |
|-------------|--------|
| Dados históricos acessíveis | ✅ |
| Scoring engine inalterado | ✅ |
| scoring_version preservado | ✅ |
| identity_version preservado | ✅ |
| Resultados antigos renderizam corretamente | ✅ |
| Nenhum dado deletado | ✅ |
| PDFs geram com códigos proprietários | ✅ |
| Share usa código público | ✅ |
| Edge functions deployadas | ✅ |

---

## 8. Próximos Passos (Não Implementados)

1. **Build check automático**: Adicionar script de CI que rode `validateNoLeaks()` em todos os templates/textos
2. **Testes unitários**: Criar testes para `safeOutput()` e `getPublicTypeCode()`
3. **Auditoria de behavior_metadata.ts**: O campo `compatibilities` usa siglas internas — aceitável pois é consumido apenas pela IA
4. **Dimensão labels**: Os labels E/I/S/N/T/F/J/P nas barras de dimensão são termos junguianos genéricos (Extroversão, Introversão etc.), não protegidos — mantidos como estão
