
# Área da colaboradora no Business — simples, pessoal e respeitosa

## Princípios (não-negociáveis)

- Linguagem **fase, não identidade**: "hoje você tende a…", "neste momento…". Nada de "você é assim", "tem um problema", "errado".
- Sem rótulos clínicos, sem laudo, sem julgamento. Reaproveita o disclaimer já existente (`RESULTS_DISCLAIMER_PHASE_NOT_IDENTITY`).
- O **Identity continua sendo o lar do pessoal** (Código da Essência mora lá). O **Business só adiciona a lente da empresa** sobre esse mesmo código — nunca duplica teste nem reescreve o código pessoal.
- Vocabulário substituto para "pontos de atenção": **"Onde você brilha"**, **"O que pode pesar para você no dia a dia"**, **"Como o time pode te apoiar"**, **"Como você pode apoiar o time"**. Nada de "fraquezas", "riscos", "problemas".

## O que muda hoje

Hoje, ao logar como colaboradora no Business, ela é **redirecionada para `/cliente`** (Identity). Ela não tem nenhuma tela própria dentro do Business. Isso vai mudar: ela passa a ter **uma área enxuta dentro do Business**, com no máximo **3 abas**, e o Identity continua acessível por um link claro.

## Estrutura proposta da área da colaboradora (3 abas, nada além)

```text
┌─────────────────────────────────────────────────────────┐
│  Olá, Larissa  ·  [Empresa: Loja X]    [Ver meu Identity]│
├─────────────────────────────────────────────────────────┤
│  [Meu Código]  [No trabalho]  [Minha equipe]            │
└─────────────────────────────────────────────────────────┘
```

### Aba 1 — "Meu Código" (resumo pessoal)
- Mostra o **Código da Essência** já gerado no Identity (resumo curto: arquétipo, modo de liderança, temperamento, estilo de conexão).
- Se ainda não tem código → CTA único: "Gerar meu Código no Nello Identity" (abre `/cliente`).
- Botão "Ver meu relatório completo" → abre Identity.
- **Não duplica conteúdo**, só espelha o resumo.

### Aba 2 — "No trabalho" (a lente nova, a parte que ela não tem hoje)
A leitura do mesmo código, **aplicada ao contexto da empresa e ao cargo dela** (`job_title` de `company_users`). Estrutura em 4 blocos curtos:

1. **Onde você brilha aqui** — 2 a 3 frases sobre forças naturais aplicadas ao cargo dela (ex: vendedora + perfil acolhedor → "tende a criar vínculo rápido com a cliente").
2. **O que pode pesar para você** — em vez de "pontos de atenção". Tom: "neste momento, situações X podem te cansar mais que o normal". Ex: "metas muito agressivas sem espaço de respiro podem te tirar do seu eixo natural".
3. **O que costuma te ajudar** — micro-práticas concretas para o dia a dia (1 frase cada, 3 itens).
4. **O que pedir do time/gestor** — frases prontas que ela pode usar ("preciso de clareza no início da semana", "funciono melhor quando…").

Cada bloco abre com a frase-âncora: *"Esta é uma leitura da sua fase atual de trabalho, não um julgamento sobre quem você é."*

### Aba 3 — "Minha equipe" (visão suave, opcional)
- Lista das colegas com **arquétipo + uma frase de "como se conectar com ela"**. Ex: *"A Maria tende a funcionar melhor com combinações claras e prazos definidos."*
- **Não mostra** "pontos fracos" das colegas, **não mostra** scores, **não mostra** insights da empresa.
- Só ajuda ela a se conectar melhor com quem está do lado.
- Se o consentimento de compartilhar (`BusinessSharingToggle`) de alguma colega está desligado, aparece só nome + "perfil privado".

## Sidebar da colaboradora — o que aparece

Hoje a colaboradora tem só 1 item ("Minha Jornada", que é redirect). Passa a ter:

```text
Sidebar (colaboradora)
├─ Meu espaço         ← nova rota /my-space (3 abas acima)
├─ Meu Identity       ← link externo p/ /cliente (o pessoal mora lá)
└─ Configurações      ← só perfil + sair
```

A sidebar da admin (Estratégia, Pessoas, Recrutamento, Comunicação) **continua escondida** dela. Garantia visual de que ela não vê nada da gestão.

## Garantias de privacidade (importante para confiança dela)

Card fixo no rodapé da Aba 1:
> "Seu Código pessoal completo só você vê. A empresa só recebe a versão de equipe agregada e apenas se você tiver autorizado o compartilhamento."

Reaproveita o `BusinessSharingToggle` que já existe.

## Detalhes técnicos

- **Nova rota** `/my-space` em `src/apps/business/BusinessApp.tsx` (substitui o redirect cego de `/my-journey`; mantém `/my-journey` redirecionando para `/my-space` para não quebrar links).
- **Nova página** `src/apps/business/pages/BusinessMySpace.tsx` com `Tabs` shadcn (Meu Código / No Trabalho / Minha Equipe).
- **`BusinessLayout.tsx`**: trocar `collaboratorNavItems` para os 3 itens acima. Sidebar admin permanece intocada.
- **Hook novo** `useMyEssenceLens(userId, companyId)`:
  - Busca `mapa_essencia` do próprio user (RLS já permite).
  - Busca `company_users.job_title` da empresa atual.
  - Reusa `ROLE_HINTS` já criado em `BusinessTeamComparison.tsx` (extrair para `src/apps/business/lib/roleLens.ts` para compartilhar).
  - Gera os 4 blocos da aba "No trabalho" via funções puras (sem IA neste primeiro corte — texto determinístico baseado em arquétipo + cargo, igual ao padrão atual de `getLeaderToMemberReading`).
- **Aba "Minha equipe"**: query em `company_users` + `mapa_essencia` filtrada pelos colegas com `share_with_company = true`. Para os outros, mostra só o nome com badge "perfil privado".
- **Disclaimers**: importar de `src/lib/compliance/phaseDisclaimers.ts` em todos os blocos.
- **Vocabulário**: criar `src/apps/business/lib/gentleVocabulary.ts` centralizando as substituições ("Onde você brilha", "O que pode pesar", etc.) para garantir consistência e fácil revisão.
- **Sem novas tabelas, sem migração de banco.** Usa o que já existe.

## Fora de escopo (deixar para depois)

- Pesquisa de clima e eNPS (continuam escondidos como combinado).
- IA generativa na aba "No trabalho" (primeiro entregamos texto determinístico curado; IA pode entrar numa v2).
- Edição do `job_title` pela própria colaboradora (continua sendo a admin que define).
