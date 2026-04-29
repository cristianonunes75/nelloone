Vou corrigir isso em duas frentes: primeiro a auditoria/filtro de dados para a página não buscar pessoas fora da equipe; depois a simplificação da navegação e dos módulos visíveis no Business.

## O que encontrei na auditoria inicial

A equipe ativa exibida no print corresponde aos registros ativos em `company_users` da empresa **Da Imaculada Artigos Religiosos**:

- Larissa Martins Nascimento — Supervisora — colaboradora
- Agatha Maria Figueiredo da Paixão — Vendedora — colaboradora
- Hanna Emanuelle — Vendedora — colaboradora
- Rayssa Samara — Vendedora — colaboradora
- Lisa Marini Ferreira dos Santos — Sócia Administrativa — admin
- Cristiano — Sócio — admin
- Lisa Marini Ferreira dos Santos — registro antigo inativo/não iniciado
- Suzanne/suzannelandim@gmail.com — convite pendente, ainda não acessou

O problema principal está na função de cruzamento criada antes: ela passou a unir `company_users` com `hiring_candidates`. Isso trouxe candidatas do processo seletivo que **não fazem parte da equipe atual**, como Ketlin, Jakeline, Barbara, Dariane etc. Isso será removido.

Também vi que o Business está misturando muita coisa na tela e no menu: People Strategy, eNPS, pesquisa de clima, saúde organizacional, PDI, performance e IA estratégica aparecem como se já estivessem implantados. Vou esconder isso por enquanto e deixar o Business mais simples.

## Plano de correção

### 1. Corrigir a origem dos dados do “Cruzamento da Equipe”

Vou alterar a função `get_company_identity_team_crossing` para retornar **somente pessoas vinculadas à equipe da empresa**, usando `company_users` como fonte oficial.

Regras novas:

- Não puxar mais `hiring_candidates` para a leitura da equipe.
- Considerar apenas membros da empresa, ativos ou exibidos na tela de equipe conforme necessário.
- Usar `profiles` + `company_users` para nome, cargo, função, status e compartilhamento.
- Usar apenas dados do Identity: `mapa_essencia` e, se necessário, os mapas já concluídos em `user_tests` da própria pessoa.
- Não usar dados de processo seletivo para leitura de equipe.

### 2. Tratar a Suzanne corretamente

Como a Suzanne aparece no print como **convite pendente / ainda não acessou**, ela não tem `user_id` ativo em `company_users` nessa tela. Então vou tratar assim:

- Ela poderá aparecer na leitura como “convite pendente”/“sem dados de Identity disponíveis”, se a página for pensada como espelho da equipe exibida.
- Não vou puxar os testes dela do Hiring para completar a leitura da equipe, porque você pediu para usar apenas os dados do Nello Identity.
- Onde não houver Código da Essência ou mapas Identity, o sistema mostrará aviso claro:
  - “Não há Código da Essência disponível para Suzanne no Identity.”
  - “Ela ainda não acessou/aceitou o convite da equipe, por isso não há dados corporativos compartilhados.”

### 3. Fazer a página espelhar a equipe do print

Vou ajustar a página “Cruzamento da Equipe” para considerar a lista real de membros/convites da empresa, e não uma lista misturada com candidatos.

A tela ficará organizada assim:

```text
Cruzamento de Códigos da Equipe

1. Resumo executivo simples
   - Quantas pessoas na equipe
   - Quantas têm Código da Essência disponível
   - Quantas estão sem dados Identity
   - Avisos de dados ausentes

2. Leitura da equipe
   - Como o time funciona hoje
   - Pontos de força
   - Riscos de comunicação/ritmo
   - Como liderar a equipe no dia a dia

3. Leitura individual
   - Larissa
   - Agatha
   - Hanna
   - Rayssa
   - Lisa
   - Cristiano
   - Suzanne, com aviso de ausência de dados Identity
```

### 4. Aprofundar a leitura sem inventar dados

Para quem tiver Código da Essência no Identity, vou usar os dados disponíveis no `mapa_essencia`, incluindo:

- DISC
- Temperamento
- Arquétipos
- Estilo de conexão afetiva
- Inteligências
- Eneagrama, se existir
- nello16, exibido somente no padrão protegido do projeto, sem termos de marcas externas

A leitura individual será mais prática e empresarial, incluindo:

- Como a pessoa tende a agir no ambiente de trabalho
- Como reage sob pressão
- O que costuma motivar ou travar essa pessoa
- Onde ela pode contribuir melhor na empresa
- Como o gestor deve conduzir, cobrar e reconhecer
- Riscos de comunicação
- Recomendações de função/rotina
- Pontos de desenvolvimento
- Aviso quando faltar informação

Importante: manterei a linguagem não clínica e educativa, sem prometer diagnóstico.

### 5. Simplificar o menu do Nello Business

Vou esconder do menu, por enquanto:

- People Strategy
- Pesquisa de clima
- eNPS
- Saúde organizacional baseada em clima/eNPS
- Performance/PDI/IA Chat, se estiverem dentro desse fluxo confuso

O menu principal ficará mais simples, priorizando o que já faz sentido hoje:

- Dashboard
- Equipe
- Cruzamento da Equipe
- Vagas
- Candidatos
- WhatsApp, se você quiser manter visível
- Configurações

### 6. Simplificar o Dashboard

Vou remover/ocultar cards que dependem de módulos não implantados:

- eNPS
- Clima Geral
- Saúde Organizacional composta
- Aderência média se depender de perfil ideal/performance ainda incompleto
- Checklist pedindo ciclo de clima/eNPS

No lugar, o dashboard pode mostrar uma visão mais limpa:

- Pessoas na equipe
- Códigos da Essência disponíveis
- Convites pendentes
- Atalho para “Cruzamento da Equipe”
- Vagas/candidatos, se o módulo de recrutamento continuar ativo

### 7. Redirecionar ou esconder a rota People Strategy

Para evitar confusão:

- Removerei o link do menu.
- A rota `/people-strategy` poderá redirecionar para `/team-comparison` ou `/dashboard`, para não ficar acessível por acidente.
- Não vou apagar os arquivos nem o banco desses módulos agora; apenas esconder da experiência principal. Assim preservamos o que já foi construído para reativar depois quando estiver pronto.

## Arquivos/funções que serão alterados

- `src/apps/business/pages/BusinessTeamComparison.tsx`
  - refatorar a leitura para ser mais profunda, empresarial e baseada apenas na equipe real + Identity.

- `src/apps/business/components/BusinessLayout.tsx`
  - simplificar o menu e esconder People Strategy.

- `src/apps/business/BusinessApp.tsx`
  - redirecionar/ocultar rota de People Strategy.

- `src/apps/business/pages/BusinessDashboard.tsx`
  - remover ou esconder cards de eNPS, clima, saúde organizacional, checklist de clima/eNPS.

- Nova migração de banco
  - atualizar `get_company_identity_team_crossing` para não unir com candidatas do Hiring e usar somente equipe/Identity.

## Critério de aceite

Depois da alteração:

- A página de cruzamento não deverá mostrar candidatas fora da equipe.
- A leitura deverá bater com a equipe do print.
- Suzanne aparecerá apenas como pendente/sem dados Identity, sem reaproveitar dados do processo seletivo.
- People Strategy, clima e eNPS ficarão escondidos por enquanto.
- O Business ficará mais claro e focado em equipe + Código da Essência.