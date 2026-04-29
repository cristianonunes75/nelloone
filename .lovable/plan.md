Vou transformar a página atual de **Comparar Equipe** em uma visão mais completa de **Cruzamento de Códigos da Equipe**, usando não só DISC e Temperamentos, mas também os dados disponíveis do Código da Essência e dos demais mapas quando existirem.

Plano de implementação:

1. Ajustar a busca de dados da equipe
   - Atualizar a função segura que alimenta a página Business para retornar todas as pessoas ativas da empresa com compartilhamento autorizado.
   - Manter a Larissa na leitura como supervisora, já que ela está ativa, com consentimento e compartilhamento liberado.
   - Incluir campos de função/cargo e departamento para permitir leitura por time.
   - Remover qualquer lógica que limite a visão apenas ao DISC e Temperamentos.

2. Incluir o Código completo quando existir
   - Buscar, para cada colaboradora, o registro do Código da Essência em `mapa_essencia`.
   - Extrair os dados estruturados usados no Identity: DISC, Temperamentos, Arquétipos, Inteligências, Estilos de Conexão, nello16 e Eneagrama.
   - Quando uma pessoa não tiver Código completo, usar os resultados individuais que ela já tiver em `user_tests`.
   - Marcar cada pessoa como:
     - Código completo
     - Jornada completa sem Código gerado
     - Dados parciais

3. Criar leitura por time no Business
   - Agrupar por departamento quando existir.
   - Quando não houver departamento preenchido, usar um grupo padrão como “Equipe geral” e preservar o cargo, por exemplo: Vendedora, Supervisora, Sócio/Sócia.
   - Para Da Imaculada, isso permitirá ver a equipe de vendas e a supervisora Larissa dentro da análise geral.
   - Exibir cartões de resumo por grupo/time:
     - perfis predominantes
     - forças do time
     - riscos de comunicação
     - melhor forma de gestão
     - complementaridades entre supervisora e vendedoras

4. Reaproveitar a lógica do cruzamento do Identity no Business
   - Adaptar a lógica de cruzamento já existente no Identity para o contexto empresarial.
   - Em vez de “casal/família”, a leitura será de equipe:
     - quem tende a puxar direção
     - quem tende a sustentar rotina
     - quem tende a conectar pessoas
     - quem tende a trazer análise e critério
     - onde podem surgir ruídos entre supervisão e operação
   - Evitar linguagem clínica e manter a leitura como ferramenta educacional de autoconhecimento e gestão.

5. Atualizar a interface da página Business
   - Renomear/expandir a página para algo como **Cruzamento da Equipe** ou **Códigos da Equipe**.
   - Adicionar abas ou blocos:
     - Resumo executivo
     - Times / grupos
     - Cruzamentos entre colaboradoras
     - Mapa individual
   - Manter os gráficos atuais de DISC e Temperamentos.
   - Adicionar novos gráficos quando houver dados:
     - Arquétipos de propósito
     - Inteligências predominantes
     - Estilos de conexão
     - Eneagrama
     - progresso do Código completo

6. Incluir comparações úteis para empresário
   - Mostrar pares e relações relevantes, por exemplo:
     - Supervisora x equipe
     - Perfis complementares
     - Perfis com possível atrito natural
     - Pessoas com tendência à execução, estabilidade, comunicação ou análise
   - Gerar textos objetivos de gestão, como:
     - “Como liderar este time”
     - “Como delegar melhor”
     - “Como extrair o melhor de cada uma”
     - “Pontos de atenção na comunicação”

7. Segurança e consentimento
   - Continuar exibindo apenas dados de pessoas ativas que autorizaram compartilhamento com a empresa.
   - Acesso restrito aos administradores da empresa.
   - Não expor dados sensíveis fora do contexto autorizado.
   - Registrar a página como ferramenta de leitura estratégica, não diagnóstico.

Detalhes técnicos:

- Atualizar a RPC `get_company_behavioral_comparison` ou criar uma nova RPC mais ampla, por exemplo `get_company_identity_team_crossing`.
- A nova consulta retornará dados consolidados de:
  - `company_users`
  - `profiles`
  - `user_tests`
  - `tests`
  - `mapa_essencia`
- A página `BusinessTeamComparison.tsx` será expandida ou substituída por uma versão mais completa.
- O menu lateral continuará apontando para `/team-comparison`, mas o rótulo pode mudar para **Cruzamento da Equipe**.
- Não vou editar arquivos auto-gerados do backend/types manualmente.
- Se necessário, criarei tipos locais no componente para a nova RPC.

Resultado esperado:

Você terá no Nello Business uma visão parecida com a função de cruzamento do Identity, mas adaptada para empresário: uma leitura da equipe, dos grupos e da supervisora Larissa em relação às demais colaboradoras, usando o Código completo quando houver e contabilizando dados parciais quando ainda não houver Código completo.