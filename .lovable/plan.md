## Problema

Hoje os "Top encaixes" de cada participante listam qualquer outro membro do círculo, inclusive o próprio cônjuge — e a IA pode falar do casal como duas pessoas separadas. Você quer:

1. **Cônjuges não devem aparecer como "match" um do outro** nos Top encaixes individuais — eles já são par por definição.
2. **Casal é indivisível**: nas dinâmicas e nos cálculos do círculo, marido e esposa são uma unidade só, não dois encaixes separados.

## Plano

### 1. Excluir cônjuge dos Top encaixes individuais

No `LeituraPastoralBlock` dentro de `DiscernirCoordenacao.tsx`, antes de chamar `calcCompatibilitiesFor(member, others)`, filtrar a lista `others` removendo o `spouse_user_id` do membro atual (quando ele for `participant_type === 'casal'` e tiver cônjuge vinculado).

Resultado: na lista de "Encaixes dentro deste círculo" do Fabio, a Juliana não aparece (e vice-versa). Para os jovens, nada muda — eles continuam vendo todos os outros do círculo.

### 2. Bloco fixo "Vínculo conjugal" no lugar do match

Para quem é casal, acima dos Top encaixes individuais, mostrar um bloco curto separado:

```text
Vínculo conjugal
Fabio + Juliana — par fixo neste círculo.
Combinação: ambos altos em Acolhimento (92% e 88%); Fabio puxa Condução (80%), Juliana puxa Comunicação (85%).
```

Esse texto sai do mesmo motor `calcPairCompatibility`, mas é apresentado como **par fixo**, não como "score" comparável aos jovens — sem percentual de match no título, só a leitura dos blocos. Assim fica claro que casal não é um encaixe que se escolhe.

### 3. Tratar o casal como unidade nas estatísticas e dinâmicas do círculo

No utilitário `circleCompatibility.ts`, adicionar uma função `groupMembersAsUnits(members)` que devolve uma lista onde cada cônjuge vinculado vira **uma unidade só** (média dos 6 percentuais do par, nome composto "Fabio + Juliana"). Jovens ficam como unidades individuais.

Usar essa lista de unidades em:

- **`topPairsOfCircle`** (dinâmicas de par mostradas no card da IA): pares passam a ser entre **unidades**, então nunca vai aparecer "Fabio × Juliana" como dinâmica — só "Casal Fabio+Juliana × Arthur", "Casal Fabio+Juliana × Rafael", "Arthur × Rafael" etc.
- **`calcCircleStats`** (médias, saturação, lacunas): o casal entra como uma única observação, evitando que um par com perfil parecido enviese a média do círculo (hoje conta como duas pessoas).

### 4. Atualizar a Edge Function `discernir-generate-circle-combination`

- Passar para a IA tanto a lista bruta de membros (para citar nomes individuais quando fizer sentido) **quanto** a lista de unidades (com a flag `is_casal: true` e os dois nomes).
- Reforçar no system prompt: *"O casal é uma unidade indivisível. Quando citar o casal, use 'Fabio e Juliana' juntos. Não trate cônjuges como dois encaixes separados nem sugira recombinar cônjuges com outros membros."*
- A matriz de compatibilidade enviada à IA passa a ser entre **unidades** (mesmo critério da seção 3), eliminando da raiz o par cônjuge-cônjuge.
- Bumpar a versão da `signature_hash` (ex.: `v3:`) para invalidar cache antigo.

### 5. Ajuste cosmético

No accordion individual de quem é cônjuge, o subtítulo dos Top encaixes muda de "Encaixes dentro deste círculo" para **"Encaixes além do casal neste círculo"** — deixa explícito por que o cônjuge não aparece.

## Detalhes técnicos

- `groupMembersAsUnits` detecta par por `spouse_user_id` recíproco; cônjuge sem vínculo recíproco é tratado como individual (fallback seguro).
- Unidade-casal recebe `user_id` sintético `"couple:{idA}:{idB}"` (ordenado) para deduplicação estável; nome `"<nomeA> + <nomeB>"`; percentuais = média aritmética dos dois.
- Filtro no `LeituraPastoralBlock`: `others.filter(o => o.user_id !== member.spouse_user_id)`.
- Bump `signature_hash` na edge function para forçar regeneração.
- Sem mudança de banco, sem nova tabela, sem migração.

## O que muda na tela

- Fabio não vê Juliana nos Top encaixes (e vice-versa) — vê os jovens do círculo.
- Card de "Vínculo conjugal" aparece para ambos os cônjuges, com leitura específica do par.
- Nas "Dinâmicas de par" geradas pela IA, o casal entra como bloco único ("Fabio e Juliana × Arthur"), nunca quebrado.
- Médias e lacunas do círculo passam a contar o casal como uma observação só, ficando mais fiéis à realidade do encontro.
