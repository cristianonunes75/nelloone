## Resposta às suas duas perguntas

**1) "Que tipo de pessoa acrescentaria essa pessoa?"** — ainda **não existe**. A leitura pastoral atual mostra só o que a pessoa agrega, pontos de atenção e melhor encaixe. Faz total sentido adicionar uma 5ª seção: **"Quem complementa este perfil"**, listando o tipo de companheiro de círculo que equilibraria os pontos baixos dela.

**2) Cruzamento por IA já programado?** Existe um edge function `discernir-generate-cruzamento`, mas ele é para **cruzamento de casal** (eixos ritmo/família/decisão, com convite e consentimento). **Não há** cruzamento por IA para combinar membros do mesmo círculo. Hoje o painel de Coordenação usa apenas a "Sugestão automática de círculos" determinística (sem IA).

Proponho fazer as duas coisas, mantendo o que já é determinístico de graça e usando IA só onde agrega de verdade.

---

## O que vou implementar

### Parte A — "Quem complementa este perfil" (determinístico, grátis, instantâneo)

Adicionar à `gerarLeituraPerfilServico` uma 5ª saída: `complementa: string`.

**Regra:** identificar os 1–2 blocos mais baixos da pessoa (< 50%) e descrever qual perfil de companheiro equilibraria. Exemplos:
- Liderança alta + Acolhimento baixo → "Combina bem com alguém de **Acolhimento alto** (Pastor do Círculo ou Guardião do Clima): para que a direção forte seja temperada por escuta cuidadosa."
- Comunicação alta + Espiritualidade baixa → "Combina bem com um **Intercessor** ou alguém com Espiritualidade alta: para ancorar a fala bonita em oração."
- Perfil sem blocos críticos → "Perfil equilibrado — combina bem com qualquer composição, especialmente perfis que tenham pelo menos um Intercessor ou Pastor."

Tabela `COMPLEMENTA_BLOCO_BAIXO` (6 frases, uma por bloco baixo) + lógica de combinar até 2 blocos baixos numa única recomendação.

**Onde aparece:** mesmo lugar que a leitura atual já aparece — card de Coordenação, tela de resultado pessoal e PDF. Entra como última seção da leitura, antes do disclaimer.

### Parte B — Cruzamento por IA no painel de Coordenação (opcional, sob demanda)

No painel `DiscernirCoordenacao`, em cada **círculo sugerido** (ou par/trio que você selecionar), botão **"Gerar leitura de combinação por IA"**.

- **Edge function nova:** `discernir-generate-circle-combination`
- **Modelo:** `google/gemini-3-flash-preview` via Lovable AI Gateway (`LOVABLE_API_KEY`, sem custo extra de chave para você)
- **Input:** lista de membros do círculo com nome, papel principal/secundário e os 6 percentuais
- **Output (JSON via tool calling):**
  - `forcas_do_grupo`: 2–3 pontos do que esse círculo, juntos, terá de bom
  - `riscos_do_grupo`: 1–2 pontos cegos coletivos (ex.: "ninguém com Espiritualidade alta — risco de virar grupo de amigos sem âncora")
  - `recomendacao_pratica`: 1 frase sobre como esse círculo deveria funcionar dado o perfil somado
  - `quem_puxa_o_que`: lista por pessoa de qual papel concreto ela tende a ocupar nesse círculo específico (ex.: "Maria abre os encontros com oração", "João media conflitos")
- **Linguagem:** pastoral, não-clínica, "tende a" / "pode ajudar". Mesmo padrão da leitura atual.
- **Cache:** salvo em nova tabela `discernir_circle_combinations` (círculo → resultado IA), para não regerar a cada visita. Botão "Regenerar" disponível.
- **Tratamento de erros:** 429 e 402 retornam toast amigável; o painel continua funcional sem a leitura IA.

### Parte C — Disponibilidade

- Parte A entra automaticamente para todo mundo (é só recálculo client-side).
- Parte B fica como **opção** do coordenador: o botão só dispara IA quando você clica. Sem custo passivo.

---

## Detalhes técnicos

**Arquivos a editar:**
- `src/apps/discernir/utils/perfilServicoLeitura.ts` — adicionar tabela `COMPLEMENTA_BLOCO_BAIXO`, expandir `LeituraPerfilServico` com `complementa`, atualizar `leituraToText`.
- `src/apps/discernir/pages/DiscernirCoordenacao.tsx` — renderizar a nova seção "Quem complementa" no `LeituraPastoralBlock`; adicionar botão e modal "Leitura de combinação por IA" por círculo sugerido.
- `src/apps/discernir/pages/DiscernirPerfilServico.tsx` — renderizar "Quem complementa" na tela individual.
- `src/apps/discernir/utils/perfilServicoPDF.ts` — incluir "Quem complementa" no PDF.

**Arquivos a criar:**
- `supabase/functions/discernir-generate-circle-combination/index.ts` — edge function com Lovable AI Gateway, tool calling para JSON estruturado, tratamento de 429/402.
- Migration para tabela `discernir_circle_combinations` (id, circle_signature_hash, member_user_ids[], result_json, generated_by, created_at) com RLS restrita à coordenação.

**Sem mudanças** em banco para a Parte A. Sem novas dependências.

---

## Fora do escopo

- Geração automática (sem clique) da leitura IA — fica sob demanda para controlar custo.
- Reescrever a sugestão automática de círculos — continua determinística como hoje.
- Editar manualmente a leitura IA — pode virar próximo passo.