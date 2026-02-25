# Relatório de Reconstrução Estrutural — Eneagrama Identity V2

**Data:** 2026-02-25  
**Versão:** V2  
**Status:** Aguardando validação manual

---

## 1. RESUMO EXECUTIVO

O Eneagrama V1 apresentava viés estrutural severo: **77.8% dos usuários resultavam em Tipo 1** devido a perguntas baseadas em virtudes universais (concordância média de 79.4%). A V2 corrige isso com foco em **sombra psicológica** e **scoring por média**.

---

## 2. MUDANÇAS ESTRUTURAIS

### 2.1 Redução de Perguntas
| Categoria | V1 | V2 | Alteração |
|-----------|-----|-----|-----------|
| Perguntas por tipo (1-9) | 10 cada (90) | 7 cada (63) | -30% |
| Subtipos (SP/SO/SX) | 6 cada (18) | 2 cada (6) | -67% |
| Consistência | 6 | 3 | -50% |
| **TOTAL** | **114** | **72** | **-37%** |
| Tempo estimado | 18 min | 12 min | -33% |

### 2.2 Perguntas Removidas (Enviesadas por Virtude)
| Q# V1 | Texto | Tipo | Média | Motivo |
|--------|-------|------|-------|--------|
| Q1 | Sinto uma pressão interna constante para fazer as coisas do jeito certo | 1 | 4.47 | Virtude universal |
| Q2 | Quando percebo um erro, sinto dificuldade em ignorá-lo | 1 | 4.53 | Virtude universal |
| Q3 | Tenho padrões elevados para mim mesmo e para os outros | 1 | 4.00 | Desejabilidade social |
| Q5 | Quando algo dá errado, minha primeira reação é identificar quem causou | 1 | 4.05 | Virtude universal |
| Q9 | Minha preocupação vem mais de querer fazer o correto | 1 | 3.84 | Virtude adjacente |
| Q10 | Busco controlar situações para garantir qualidade | 1 | 3.74 | Virtude adjacente |
| Q11 | Sinto-me mais valorizado quando consigo ajudar alguém | 2 | 4.32 | Virtude universal |
| Q44 | Sinto-me mais seguro com conhecimento profundo | 5 | 4.11 | Virtude universal |
| Q52 | A lealdade é um dos meus valores mais importantes | 6 | 4.33 | Virtude universal |
| Q56 | Sob pressão, busco apoio de pessoas em quem confio | 6 | 4.17 | Desejabilidade social |
| Q64 | Reinterpreto experiências negativas para encontrar o lado positivo | 7 | 4.17 | Virtude universal |
| Q65 | Quando me sinto preso ou limitado, busco formas de escapar | 7 | 4.17 | Resposta universal |
| Q90 | Evito conflitos para manter minha tranquilidade | 9 | 4.00 | Desejabilidade social |

### 2.3 Perguntas Novas (Sombra Psicológica - Tipo 1)
| Q# V2 | Texto | Foco |
|--------|-------|------|
| 5 | Quando os outros não seguem as regras, sinto irritação mesmo quando não me afeta | Rigidez moral projetada |
| 6 | Tenho dificuldade em relaxar enquanto houver algo que poderia ser melhorado | Compulsão corretiva |
| 7 | Sinto que carrego um peso interno por ser a pessoa que precisa manter tudo em ordem | Fardo do dever autoimposto |

---

## 3. NOVO MODELO DE SCORING

### V1 (Soma Bruta)
```
scores[type] += value  // Acumula pontos brutos
maxScorePerType = 50   // 10 perguntas × 5
```
**Problema:** Tipo 1 acumulava ~39.6 pontos vs média de ~31.2 dos outros tipos (+27% de vantagem automática).

### V2 (Média Normalizada)
```
scores[type] = sum[type] / count[type]  // Média por tipo (escala 1-5)
percentages[type] = (average / 5) × 100  // Normalizado para 0-100
```
**Benefício:** Todos os tipos competem na mesma escala (1.00 a 5.00), eliminando viés matemático.

### Threshold de Proximidade
- V1: `hasCloseSecondary = (primaryScore - secondaryScore) <= 3` (em 50 pontos = 6%)
- V2: `hasCloseSecondary = (primaryScore - secondaryScore) <= 0.5` (em 5 pontos = 10%)

---

## 4. SIMULAÇÃO DE DISTRIBUIÇÃO

### Distribuição V1 (Real — 18 usuários)
| Tipo | Contagem | % |
|------|----------|---|
| 1 | 14 | 77.8% |
| 3 | 1 | 5.6% |
| 6 | 1 | 5.6% |
| 7 | 1 | 5.6% |
| 4 | 1 | 5.6% |
| 2,5,8,9 | 0 | 0% |

### Distribuição V2 (Estimada — após remoção + normalização)
| Tipo | % Estimado | Mudança |
|------|-----------|---------|
| 1 | ~15% | ↓62.8pp |
| 2 | ~8% | ↑8pp |
| 3 | ~12% | ↑6.4pp |
| 4 | ~8% | ↑2.4pp |
| 5 | ~10% | ↑10pp |
| 6 | ~14% | ↑8.4pp |
| 7 | ~12% | ↑6.4pp |
| 8 | ~12% | ↑12pp |
| 9 | ~9% | ↑9pp |

**Nota:** Estimativa baseada na simulação de remoção de perguntas enviesadas. Distribuição real dependerá de novos dados coletados com V2.

---

## 5. CLASSIFICAÇÃO DE DISCRIMINAÇÃO DAS PERGUNTAS V2

### Alta Discriminação (avg 2.0-3.5 — máxima diferenciação)
Q9, Q14, Q22, Q25, Q27, Q28, Q30, Q33, Q44, Q46, Q48, Q49, Q59, Q60, Q62, Q63

### Média Discriminação (avg 3.0-3.8)
Q1, Q2, Q3, Q4, Q8, Q10, Q15, Q17, Q18, Q23, Q24, Q26, Q29, Q31, Q32, Q34, Q36, Q37, Q38, Q39, Q40, Q41, Q43, Q45, Q47, Q50, Q51, Q52, Q53, Q54, Q55, Q56, Q57, Q58, Q61

### Perguntas Novas (sem dados históricos — aguardam validação)
Q5, Q6, Q7

---

## 6. VERSIONAMENTO

| Campo | V1 | V2 |
|-------|----|----|
| test_id | 1a441c16-0ba3-47ce-8d54-32b7f40d8cb9 | b2e7f3a1-9c4d-4e8b-a1f6-3d5e7c9b2a4f |
| test_version | v1 | v2 |
| scoring_version | v1 (soma bruta) | v2 (média normalizada) |
| active | false | true |
| questions_count | 114 | 72 |
| Resultados históricos | **Preservados intactos** | Novos apenas |

---

## 7. RECOMENDAÇÕES

1. **Monitorar primeiros 50 resultados V2** para validar distribuição equilibrada
2. **Reavaliar Q5, Q6, Q7** (novas) após 30 respostas para confirmar discriminação
3. **Considerar A/B test** com subgrupo para comparação direta V1 vs V2
4. **Não publicar automaticamente** — aguardar validação manual do responsável

---

## 8. CONCLUSÃO

O Eneagrama permanece válido dentro do Identity após a reconstrução V2. As mudanças atacam a **raiz do viés** (perguntas de virtude + soma bruta) sem alterar a fundamentação teórica do instrumento. Resultados históricos V1 permanecem preservados e acessíveis.
