# Índice de afinidade nos círculos

Tudo isso é cálculo determinístico, sem IA — usa o motor já existente em `circleCompatibility.ts` (scores 0–100 por par baseado nos 6 blocos do Perfil de Serviço).

## O que aparece em cada círculo sugerido

No topo de cada card de círculo (na aba "Sugestão de círculos"):

- **Badge geral de afinidade**: cor + rótulo + número.
  - ≥ 70 → "Forte" (verde)
  - 55–69 → "Boa" (âmbar)
  - 40–54 → "Mediana" (cinza)
  - < 40 → "A cuidar" (vermelho suave)
- **Linha resumo** com dois sub-índices:
  - "Casal ↔ Jovens: NN" — média dos scores de cada cônjuge contra cada jovem.
  - "Jovens entre si: NN" — score do par jovem×jovem (a proximidade de idade já entra como bônus no motor existente).

## Ranking dos pares

Logo abaixo, um bloco recolhível **"Top encaixes deste círculo"** mostrando os 3 melhores pares (usando `topPairsOfCircle`), cada linha com:

- Nomes dos dois (ex.: "Joaquim ↔ Marcia")
- Badge do tipo (complementar / bom encaixe / encaixe parcial / tensão a cuidar)
- Score numérico
- Justificativa curta já gerada pelo motor (cita os blocos e percentuais reais)
- Quando houver, a observação de "cuidado" também aparece em itálico discreto

## Como o número geral é calculado

Média dos scores de **todos os pares possíveis dentro do círculo** (casal-jovem, jovem-jovem e cônjuge-cônjuge), usando `calcPairCompatibility` que já considera complementaridade, eixo espiritual, cobertura de blocos e distância vetorial.

## Arquivos alterados

- `src/apps/discernir/pages/DiscernirCoordenacao.tsx`
  - Importar `calcPairCompatibility` e `topPairsOfCircle` do `circleCompatibility.ts`.
  - Criar sub-componente `CircleAffinityBlock` (no mesmo arquivo) que recebe `members: TeamProfile[]` e renderiza badge + sub-índices + ranking.
  - Inserir esse bloco no card de cada círculo sugerido, entre o header e o bloco do casal.

Sem migrações, sem mudanças em edge functions, sem mudanças em outros arquivos.
