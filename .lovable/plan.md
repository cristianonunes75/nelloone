

# Corrigir Perguntas do DISC e MBTI para Português BR

## Problema Identificado
As perguntas dos testes **DISC** (28 perguntas) e **MBTI** (48 perguntas) que estao marcadas como `language: 'pt'` estao escritas em portugues de Portugal (PT-PT). Exemplos:
- "Perante um novo desafio, **tendes** a:" (PT-PT) -- deveria ser "Diante de um novo desafio, voce **tende** a:"
- "**Recolhes-te** para processar sozinho" (PT-PT) -- deveria ser "Se recolhe para processar sozinho"
- "**Mantens** o momento para ti" (PT-PT)

Os outros 5 testes (Eneagrama, Temperamentos, Inteligencias Multiplas, Linguagens do Amor, Arquetipos) ja estao em PT-BR correto.

## Impacto
A Tania ja completou o DISC com essas perguntas. As respostas dela estao vinculadas por `question_id`, entao os IDs das perguntas NAO podem mudar.

## Solucao

Executar uma migracao SQL que atualiza APENAS o `question_text` e o texto das `options` das 76 perguntas (28 DISC + 48 MBTI), convertendo de PT-PT para PT-BR natural, mantendo:
- Os mesmos IDs de perguntas
- Os mesmos `value` das opcoes (D/I/S/C para DISC, A/B para MBTI)
- A mesma estrutura de `options` (dimension, direction, etc. para MBTI)

## Detalhes Tecnicos

### Testes Afetados

| Teste | Test ID | Perguntas | Status |
|-------|---------|-----------|--------|
| DISC | `bdd55908-87a6-46de-9d1d-e5b37c24cf58` | 28 | PT-PT (corrigir) |
| MBTI | `8de61499-2e46-45ad-8f1c-87523ac5d339` | 48 | PT-PT (corrigir) |

### Abordagem
1. Para cada pergunta, atualizar `question_text` de PT-PT para PT-BR
2. Para cada opcao dentro de `options` (JSONB), atualizar o campo `text` de PT-PT para PT-BR
3. Manter todos os outros campos intactos (`value`, `dimension`, `direction`, `question_number`, `id`)

### Conversoes Linguisticas Principais
- "tendes a" -> "voce tende a" / "tende a"
- "Perante" -> "Diante de"
- "precisas de" -> "precisa"
- "Mantens" -> "Mantem"
- "Recolhes-te" -> "Se recolhe"
- "chegas" -> "chega"
- "Sentes-te" -> "Voce se sente" / "Se sente"
- "partilhar" -> "compartilhar"
- "Aproximas-te" -> "Se aproxima"
- Uso de "tu/teu/tua" -> "voce/seu/sua"
- Remocao de mesoclise e enclise tipicas de PT-PT

### Execucao
Uma unica migracao SQL com 76 `UPDATE` statements, cada um atualizando `question_text` e `options` para a versao PT-BR natural e fluente.

