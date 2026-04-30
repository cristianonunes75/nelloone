## Aprofundar a leitura do Meu Espaço com os 7 mapas

Hoje a aba "No trabalho" usa basicamente DISC + Temperamento, com o arquétipo aparecendo só como rótulo. Os outros mapas (Eneagrama, Nello16, Inteligências Múltiplas, Estilos de Conexão Afetiva, Arquétipos completos) não entram na leitura. O plano é trazer **os sete mapas** para dentro do Meu Espaço da colaboradora, com tom de fase, sem julgamento, e com foco em "como você dá e recebe presença no trabalho".

### Princípios (linguagem)

- Nunca dizer "você é", sempre "neste momento, você costuma…"
- Nada de "fraqueza" / "defeito" / "problema": usar **"o que pode pesar"**, **"onde você pede mais cuidado"**, **"o que floresce em você"**.
- Trabalhar é também **dar o seu melhor, amar e ser amado** no contato com cliente e colega — esse fio conduz toda a leitura.
- Sem rótulos clínicos, sem laudo, sem MBTI/Chapman — só Nello16 / estilos de conexão afetiva.

### Estrutura nova da aba "No trabalho" (substitui os 4 blocos atuais)

1. **Como você se apresenta hoje** — síntese curta cruzando DISC + Temperamento + Nello16 + Arquétipo principal.
2. **Onde você floresce** (era "Onde você brilha") — usa DISC + Inteligência mais alta + Arquétipo + Eneagrama (dom).
3. **Como você se conecta com o cliente** (NOVO) — usa Estilos de Conexão Afetiva + Arquétipo + DISC. Mostra **arquétipos de cliente que fluem com você** e **arquétipos de cliente que pedem mais consciência**, com 1 frase prática para cada.
4. **Sua presença ativa: como você dá e recebe cuidado no trabalho** (NOVO) — usa Estilos de Conexão Afetiva como linguagem de carinho profissional (ex.: "você se sente reconhecida quando…"; "você cuida do outro oferecendo…").
5. **O que pode pesar para você nesta fase** — DISC + Eneagrama (zona de estresse) + Temperamento, sempre fechando com "isso é fase, não defeito".
6. **O que costuma te ajudar** — Inteligências (como você aprende/produz melhor) + Temperamento.
7. **O que pedir ao time / gestor** — frases prontas combinando DISC + Eneagrama + Estilo de Conexão Afetiva.

### Aba "Minha equipe" — também ganha profundidade

Para cada colega que autorizou compartilhar, em vez de uma frase única, mostrar 3 linhas curtas:
- **Como abrir conversa** (DISC + Temperamento)
- **Como demonstrar cuidado** (Estilo de Conexão Afetiva)
- **O que evitar nos primeiros contatos** (Eneagrama + arquétipo)

E uma frase de fechamento "compatibilidade do dia": como o seu mapa e o dela costumam combinar (cruzando os arquétipos, sem dizer "match" — usar "ponte natural" / "ponto de atenção").

### Mudanças técnicas

**`src/apps/business/lib/essenceLens.ts`**
- Expandir `EssenceSnapshot` para incluir:
  - `eneagramType` (1–9) e `eneagramWing`
  - `nello16Code` (4 letras Nello16, sem MBTI no UI)
  - `intelligencesTop3: string[]` (não só a top 1)
  - `connectionStylePrimary` e `connectionStyleSecondary` (estilos de conexão afetiva)
  - `archetypePrimary`, `archetypeSecondary`, `archetypeShadow`
- Adicionar leitores robustos em `extractEssenceSnapshot` para os campos novos do `essence_visual_data`.
- Refatorar `buildWorkLens` em **funções menores por bloco** (`buildFlourish`, `buildClientConnection`, `buildActivePresence`, `buildWeight`, `buildHelpYou`, `buildAskTeam`) — fica mais fácil de evoluir.
- Criar `buildClientArchetypeAffinity(snap)` retornando `{ flowsWith: string[], asksAwareness: string[], tip: Record<string,string> }`.
- Criar `buildTeammateDeepConnect(otherSnap)` retornando `{ openConversation, showCare, avoidEarly, bridge }`.

**`src/apps/business/lib/gentleVocabulary.ts`**
- Adicionar novas chaves: `flourish`, `clientConnection`, `activePresence`, `clientFlow`, `clientAwareness`.
- Manter `phaseAnchor` reforçado: "leitura de fase, não rótulo".

**`src/apps/business/pages/BusinessMySpace.tsx`**
- Aba "Meu Código" ganha mais 2 tiles (Eneagrama, Nello16) — total 6 tiles, grid responsivo.
- Aba "No trabalho": substituir os 4 blocos por **7 blocos** acima, com ícones e ordem narrativa (apresentação → florescer → cliente → presença ativa → o que pesa → o que ajuda → o que pedir).
- Aba "Minha equipe": cada card de colega passa a ter os 3 mini-blocos + frase ponte.
- Adicionar `PhaseAnchor` no topo de cada aba e **rodapé suave** com a frase: *"Tudo aqui é uma leitura da sua fase atual de trabalho. Não é diagnóstico, não é definição da sua pessoa."*

**`useMySpaceTeam.tsx` e RPC `get_company_team_for_member`**
- A RPC já devolve `essence_visual_data` cru — só precisamos garantir que ela inclua as seções `eneagram`, `nello16`, `intelligences`, `connection_style` e `archetypes` (verificar e, se faltar campo, ajustar a função SQL). **Sem mudança de RLS** — só seleção de mais campos do JSON existente.

### Compliance

- Nada de "MBTI", "INFP", "linguagens do amor", "Gary Chapman", "Chapman" — só Nello16 e Estilos de Conexão Afetiva (regra do projeto).
- Disclaimer ético padrão no rodapé das abas "No trabalho" e "Minha equipe".
- "Amar e ser amado" só aparece como **metáfora de cuidado profissional** (presença ativa, escuta, reconhecimento) — nunca como recomendação afetiva entre colegas.

### Fora do escopo

- Não toca em PDF, e-mail, ou no Identity em si.
- Não muda a área administrativa (Lisa continua vendo o que já vê).
- Não cria novas tabelas — só lê o JSON `essence_visual_data` que já existe.
