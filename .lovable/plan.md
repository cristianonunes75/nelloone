## O que está acontecendo hoje (e por que parece genérico)

A tela de Coordenação do Discernir tem **dois tipos de leitura**, e elas não conversam entre si:

1. **Leitura combinada do círculo (IA)** — o card grande no topo ("Forças do grupo / Riscos coletivos / Quem puxa o quê / Recomendação prática"). Esta é a IA. Ela já recebe **todos os 6 percentuais de todos os membros** e **só descreve o grupo como um todo** — não compara ninguém com ninguém. Ela faz uma frase curta de "papel no grupo" para cada membro, mas não diz o quanto cada perfil combina com os outros.
2. **Leitura pastoral combinada (individual, por pessoa)** — o accordion dentro de cada participante (Arthur, Rafael etc.). Essa **não usa IA**. É um motor de regras determinístico (`perfilServicoLeitura.ts`) que monta o texto a partir de templates por papel + bloco alto/baixo. Por isso pessoas com o mesmo papel principal acabam recebendo textos muito parecidos — ele só olha o **próprio perfil** da pessoa, não enxerga os outros membros do círculo nem os percentuais relativos.

Resumindo a sua pergunta: **a IA não cruzou ninguém com ninguém**. Ela leu o grupo inteiro como um bloco. E o accordion individual também não cruza — só relê o perfil daquela pessoa isolado.

## O que você está pedindo

Você quer um **terceiro nível**: dentro de cada participante (especialmente os jovens), ver **com quais outros membros do mesmo círculo aquele perfil combina mais**, com **percentual de compatibilidade** e justificativa que use os 6 quesitos individuais — não só o papel principal.

## Plano

### 1. Calcular compatibilidade par a par dentro do círculo (determinístico, sem IA)

Criar `src/apps/discernir/utils/circleCompatibility.ts` que, dado um membro e a lista dos outros membros do círculo, retorna para cada par um objeto:

```text
{
  outro_membro: "Rafael Botelho Rangel",
  score: 86,                    // 0–100
  tipo: "complementar" | "espelho" | "tensao",
  forcas_do_par: [ "..." , "..." ],
  cuidados_do_par: [ "..." ]
}
```

Como o score é calculado (transparente, baseado nos 6 quesitos):
- **Complementaridade** (peso maior): para cada bloco em que o membro está baixo (<50%), soma pontos se o outro está alto (≥75%) naquele bloco. E vice-versa.
- **Eixo espiritual compartilhado**: bônus se ambos têm Espiritualidade ≥ 60% (núcleo de oração comum).
- **Risco de espelhamento**: penalidade se os dois têm exatamente os mesmos blocos altos e os mesmos baixos (grupo fica enviesado).
- **Tensão produtiva vs destrutiva**: par Liderança alta + Acolhimento baixo encontrando outro igual = tensão; encontrando o oposto = complementar.
- Resultado normalizado 0–100, com classificação:
  - ≥ 75 → "complementar"
  - 55–74 → "bom encaixe"
  - 40–54 → "encaixe parcial"
  - < 40 → "tensão a cuidar"

A justificativa de cada par é **gerada a partir dos blocos reais que se complementam ou colidem**, citando os blocos por nome (ex.: "Você baixo em Comunicação (45%) + Rafael alto em Comunicação (88%) — ele tende a traduzir o que você sente mas trava de nomear").

### 2. Mostrar os "Top 3 encaixes neste círculo" dentro de cada participante

No accordion `LeituraPastoralBlock` de cada membro, adicionar uma nova seção abaixo de "Quem complementa este perfil":

```text
Encaixes dentro deste círculo
1. Rafael Botelho Rangel — 86% complementar
   Você é forte em Acolhimento (97%); ele é forte em Liderança (88%) e Espiritualidade (88%) — ele puxa direção e oração onde você sustenta o clima.
2. Tiago Leão Buson — 72% bom encaixe
   ...
3. Sofia Gonçalves — 58% encaixe parcial
   ...
```

Ordena do maior para o menor score, mostra os 3 melhores. Cada item tem:
- nome
- percentual + rótulo
- 1 frase de justificativa que **cita os percentuais reais** dos blocos relevantes
- (opcional, expansível) 1 frase de cuidado se houver

Para isso, o `LeituraPastoralBlock` passa a receber também `allMembers: TeamProfile[]` para enxergar o círculo todo.

### 3. Reescrever a IA da leitura combinada do círculo para usar os percentuais com profundidade

Atualizar `supabase/functions/discernir-generate-circle-combination/index.ts`:

- **Enriquecer o prompt**: além da lista de membros com 6 percentuais cada, passar para a IA:
  - a **matriz de complementaridade** já calculada no passo 1 (par a par, com score e blocos que se complementam) — assim a IA não precisa adivinhar, ela ancora as frases nos números reais;
  - médias do grupo nos 6 blocos e desvio padrão (para detectar concentração ou lacuna real, ex.: "ninguém acima de 50% em Espiritualidade");
  - blocos em que o grupo está saturado (>3 pessoas altas) e blocos em que ninguém está alto.
- **Endurecer as regras anti-genérico** no system prompt: "cada frase deve citar pelo menos um nome OU um bloco com percentual real. Proibido frases que caberiam em qualquer outro círculo."
- **Expandir o schema da resposta** com um novo campo:
  - `dinamicas_de_par`: 2 a 4 pares dentro do círculo que merecem destaque (quem-com-quem, por quê, e o que vigiar).
- Manter `forcas_do_grupo`, `riscos_do_grupo`, `quem_puxa_o_que`, `recomendacao_pratica`, mas exigir que `quem_puxa_o_que` cite o bloco percentualmente mais alto da pessoa **em comparação ao grupo**, não em abstrato.
- Atualizar a `signature_hash` para invalidar o cache quando a estrutura nova rodar (mudar versão no hash).

### 4. Renderizar o novo campo `dinamicas_de_par` no card de leitura combinada

No `LeituraIACirculoBlock`, adicionar uma seção entre "Quem puxa o quê" e "Recomendação prática":

```text
Dinâmicas de par neste círculo
• JULIANA + Fabio (casal): ambos altos em Acolhimento — risco de o casal se isolar no cuidado mútuo. Vale provocar partilha aberta.
• Arthur (Guardião do Clima 97%) + Rafael Botelho (Intercessor 88%): combinação rara — clima leve sustentado por oração silenciosa. Bom para retiros.
• ...
```

### 5. (Pequeno ajuste de UX)

- Renomear o accordion individual de "Leitura pastoral combinada" para algo menos ambíguo (ex.: "Leitura deste participante no círculo"), porque hoje o nome dele e o do bloco geral se confundem — foi parte da sua confusão sobre "o que ele cruzou".

## Detalhes técnicos

- Tudo que é par a par roda **no cliente** (sem custo de IA) e é determinístico — você consegue auditar cada percentual.
- Só a leitura geral do círculo (passo 3) chama IA, e ela passa a receber os scores já calculados — fica muito mais difícil ela ser genérica.
- Cache da função: bumpar versão da `signature_hash` (ex.: prefixar `v2:`) para que combinações já geradas sejam regeradas com o novo schema na próxima vez que clicar em Gerar/Regenerar.
- Tipos: nova interface `PairCompatibility` exportada de `circleCompatibility.ts`; schema da edge function ganha `dinamicas_de_par: { membros: string[]; tipo: string; observacao: string }[]` (1 a 5 itens).
- Sem mudança de banco. Sem nova tabela.

## O que muda para você na tela

- Cada jovem (Arthur, Rafael etc.) passa a mostrar **com quais outros 3 membros daquele círculo ele tem o melhor encaixe, com %**, e a justificativa cita os blocos com números reais.
- A leitura geral por IA passa a falar de **pares específicos** ("Arthur + Rafael", "Juliana + Fabio") em vez de só descrever o grupo em bloco.
- Some a sensação de "todo Pastor do Círculo recebe o mesmo texto" — porque os textos passam a usar os percentuais relativos ao círculo, não só o papel.
