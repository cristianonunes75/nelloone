## Objetivo

Tornar a leitura do **Meu Espaço** (Nello Business) mais palpável: em vez de afirmações genéricas, mostrar **cenas reais do dia a dia da loja** ("cliente entra indeciso", "fila no caixa", "devolução difícil") e, para o gestor/CEO, **exemplos concretos de ações de gestão** por perfil (como dar feedback, como delegar, como reconhecer).

A linguagem continua de **fase, não rótulo**, sem termos clínicos, sempre em 2ª pessoa.

---

## O que a colaboradora vai passar a ver

Na aba **No trabalho**, dois novos blocos serão acrescentados (após "Como você se conecta com o cliente" e antes de "Pontos de atenção"):

### 1. "Um dia comum na loja com você"
3–4 micro-cenas curtas, escolhidas pelo perfil DISC + Temperamento + Arquétipo. Exemplos:

- **Perfil D / Colérico (vendedora):** "Quando o cliente chega decidido, você fecha rápido e bem. Já o cliente que precisa pensar em voz alta tende a te cansar — combine com você mesma uma respiração antes de responder."
- **Perfil I / Sanguíneo:** "Você é a primeira a notar quando alguém entra na loja sem rumo. Seu desafio costuma ser **manter o foco no fechamento** depois de criar vínculo — ter um lembrete simples no balcão ajuda."
- **Perfil S / Fleumático:** "Quando a fila aumenta, você mantém a calma do time. Em troca, peça que avisem mudanças de promoção com antecedência — não no meio do expediente."
- **Perfil C / Melancólico:** "Você nota detalhes na vitrine, no estoque e no atendimento que ninguém mais vê. Não tente corrigir tudo de uma vez — escolha 1 ponto por semana."

### 2. "Cenas que pedem mais consciência sua"
2–3 situações típicas onde o perfil costuma ter mais dificuldade, com sugestão prática:

- "Devolução difícil com cliente irritado → respira, valida o que ele sente antes de explicar a regra."
- "Reunião rápida no início do dia → escreve as 2 metas suas no celular antes."
- "Final de mês com pressão de meta → combine com a gestora um check de 5 min, não cobrança longa."

---

## O que muda na aba "No trabalho" para perfis de **liderança**

Quando `categorizeRole(jobTitle) === 'leadership'` (Lisa, Larissa, etc.), o bloco **"O que pedir ao time / gestor"** é substituído por **"Como você lidera melhor a equipe"**, com **exemplos concretos de ação de gestão** por perfil:

- **Líder D/Colérico:** 
  - "Quando for dar feedback, comece pelo ponto direto, mas pergunte: *'faz sentido pra você?'* antes de fechar."
  - "Em vez de assumir a venda difícil sozinha, **delegue com confiança e esteja por perto** — sua equipe cresce assim."
- **Líder I/Sanguíneo:**
  - "Use seu dom de leitura de clima nas reuniões de segunda — comece pela energia da equipe antes da meta."
  - "Crie um pequeno ritual semanal de reconhecimento nominal — funciona muito com quem você lidera."
- **Líder S/Fleumático:**
  - "Sua presença estável é o que segura o time em mês difícil. Torne isso visível: diga em voz alta 'estou aqui'."
  - "Marque 15 min individuais por semana com cada vendedora — você cuida melhor 1:1 do que em grupo."
- **Líder C/Melancólico:**
  - "Quando trouxer um padrão novo, mostre o **exemplo bom e o exemplo ruim** — sua equipe aprende mais com referência visual."
  - "Cuidado para o critério não virar cobrança silenciosa. Verbalize o que está bom também."

Adicionalmente: **micro-exemplos de gestão cruzando o perfil da líder com o perfil de cada colega** já aparecem na aba "Minha equipe" (campo "ponte natural") — esse texto será enriquecido com 1 ação prática por par (ex.: "Com a Larissa (perfil S), evite delegar tarefa nova de última hora — combine na sexta o que vem na segunda").

---

## Detalhes técnicos

Arquivos a modificar:

1. **`src/apps/business/lib/essenceLens.ts`**
   - Adicionar `storeDayScenes: string[]` e `awarenessScenes: string[]` em `WorkLensBlocks`.
   - Nova função `buildStoreDayScenes(snap, role)` com bibliotecas internas indexadas por DISC + categoria de cargo (`sales` vs `leadership` vs `admin`/`ops`/`marketing`).
   - Nova função `buildAwarenessScenes(snap, role)`.
   - Para liderança: novo `buildLeadershipActions(snap)` que substitui `askTeam` quando `role === 'leadership'`. Manter `askTeam` original para os demais cargos.
   - Enriquecer `buildTeammateDeepConnect` adicionando 1 frase de **ação de gestão prática** quando `self` for liderança (campo extra `managementTip` em `TeammateConnect`).

2. **`src/apps/business/lib/gentleVocabulary.ts`**
   - Novas chaves: `storeDay: 'Um dia comum na loja com você'`, `awarenessScenes: 'Cenas que pedem mais consciência sua'`, `leadershipActions: 'Como você lidera melhor a equipe'`, `managementTip: 'Ação prática de gestão'`.

3. **`src/apps/business/pages/BusinessMySpace.tsx`**
   - Renderizar `lens.storeDayScenes` e `lens.awarenessScenes` como dois novos `LensBlock` na aba "No trabalho" (entre `clientConnection` e `weight`).
   - Quando o usuário for liderança, trocar o título do bloco final de `askTeam` para `leadershipActions`.
   - No `ColleagueCard`, exibir `connect.managementTip` em uma 5ª linha (apenas quando presente, ou seja, quando o próprio usuário for líder).

4. Sem mudanças em RPC, RLS ou tipos do banco — toda a leitura é construída no cliente a partir do `essence_visual_data` já trazido por `get_company_team_for_member`.

## Compliance / linguagem

- Toda cena começa com verbo de tendência ("você costuma", "tende a", "quando...").
- Nenhuma menção a MBTI, "linguagens do amor", ou termos clínicos. Mantém Nello16 e Estilos de Conexão Afetiva.
- Encerramento de cada bloco reforça: *"isto descreve uma fase, não quem você é"*.
- O `EthicalFooter` e o `PhaseAnchor` continuam em todos os blocos.
