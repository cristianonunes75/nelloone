
# Plano: Corrigir Exibição dos Scores de Temperamento

## Problema Identificado

Na seção "Mapas Detalhados" do Código da Essência, o componente **Temperamentos** mostra:
- **Primário**: Colérico ✅
- **Secundário**: Melancólico ✅
- **Scores**: 0% para todos ❌

### Screenshot do Bug
O usuário vê "Colérico" e "Melancólico" identificados corretamente como primário/secundário, mas as porcentagens aparecem como **0%** para ambos.

---

## Diagnóstico Técnico

### Causa Raiz 1: Edge Function não extrai scores

A função `extractKeyResults` para temperamentos (linha 2365-2375 de `nello-codigo-essencia/index.ts`) **não extrai os `scores`** do resultado do teste:

```typescript
// ATUAL - INCOMPLETO
case 'temperamentos':
  return {
    dominantTemperament: primaryTemp,
    secondaryTemperament: secondaryTemp,
    description: ...,
    // ❌ FALTA: scores não são extraídos!
  };
```

Enquanto os dados no banco têm os scores completos:
```json
{
  "scores": { "colerico": 26, "fleumatico": 35, "melancolico": 37, "sanguineo": 19 }
}
```

### Causa Raiz 2: Frontend depende de dados da IA

O `chartData.temperament` em `CodigoEssencia.tsx` está construído assim:

```typescript
temperament: {
  primary: testResults?.temperamentos?.primary,      // ✅ OK
  secondary: testResults?.temperamentos?.secondary,  // ✅ OK
  scores: visualData?.temperament?.scores,           // ❌ Depende da IA!
}
```

O problema é que `visualData` vem do `retrato_essencial.visual_data`, que é gerado pela IA. Como a IA não recebe os scores reais (por causa do problema 1), ela pode estar gerando estrutura vazia ou incorreta.

---

## Solução Proposta

### Correção 1: Edge Function - Extrair scores de temperamento

Adicionar `scores` na função `extractKeyResults`:

```typescript
case 'temperamentos':
  return {
    dominantTemperament: primaryTemp,
    secondaryTemperament: secondaryTemp,
    scores: resultData.scores || resultData.pontuacoes, // ✅ ADICIONAR
    description: ...,
  };
```

### Correção 2: Frontend - Preferir dados do teste

Alterar a construção de `chartData.temperament` para priorizar os scores do teste real:

```typescript
temperament: {
  primary: pickTemperament(testResults?.temperamentos?.primary),
  secondary: pickTemperament(testResults?.temperamentos?.secondary),
  scores: testResults?.temperamentos?.scores || visualData?.temperament?.scores, // ✅ Priorizar teste
}
```

---

## Arquivos a Modificar

| Arquivo | Mudança |
|---------|---------|
| `supabase/functions/nello-codigo-essencia/index.ts` | Adicionar `scores` em `extractKeyResults` para temperamentos |
| `src/pages/CodigoEssencia.tsx` | Priorizar `testResults?.temperamentos?.scores` sobre `visualData` |

---

## Impacto

### Para novos códigos gerados
- A IA receberá os scores corretos e poderá usá-los no `visual_data`
- Os gráficos exibirão as porcentagens reais

### Para códigos já gerados
- O frontend buscará os scores diretamente do `testResults` (que já existe no banco)
- Correção imediata sem necessidade de regenerar o código

---

## Seção Técnica

### Mudança no Edge Function

```typescript
// supabase/functions/nello-codigo-essencia/index.ts - linha ~2365
case 'temperamentos':
  const primaryTemp = resultData.primary?.name || resultData.primary?.temperament || resultData.dominant || resultData.dominante;
  const secondaryTemp = resultData.secondary?.name || resultData.secondary?.temperament || resultData.secondary || resultData.secundario;
  return {
    dominantTemperament: primaryTemp,
    secondaryTemperament: secondaryTemp,
    scores: resultData.scores || resultData.pontuacoes || {}, // NOVO
    description: resultData.description || resultData.interpretation || resultData.descricao,
    strengths: resultData.strengths || resultData.forcas,
    challenges: resultData.challenges || resultData.desafios,
  };
```

### Mudança no Frontend

```typescript
// src/pages/CodigoEssencia.tsx - linha ~344
temperament: {
  primary: pickTemperament(testResults?.temperamentos?.primary),
  secondary: pickTemperament(testResults?.temperamentos?.secondary),
  scores: testResults?.temperamentos?.scores || visualData?.temperament?.scores || {},
},
```

---

## Resultado Esperado

| Antes | Depois |
|-------|--------|
| Colérico 0%, Melancólico 0% | Colérico 22%, Melancólico 26%, etc. |
| Scores dependem da IA | Scores vêm do teste real |

---

## Risco

**Baixo** - Apenas ajusta a origem dos dados. Não afeta funcionalidade existente.
