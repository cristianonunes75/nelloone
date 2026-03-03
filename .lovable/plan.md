

## Plano: Lista de Convites Enviados com Status e Informações dos Colaboradores

### O que será criado

Uma nova seção na página de Convites (BusinessInvite.tsx) que exibe uma **tabela completa de todos os convites enviados**, com informações ricas sobre cada colaborador contactado.

### Dados disponíveis por colaborador

Cruzando `company_invites`, `company_users` e `profiles`, podemos mostrar:

| Coluna | Fonte | Descrição |
|--------|-------|-----------|
| Email | `company_invites.email` | Email contactado |
| Status do Convite | `company_invites.status` | Pendente / Aceito |
| Tipo de Acesso | `company_invites.role` | Colaborador / Admin |
| Data do Envio | `company_invites.sent_at` | Quando foi enviado |
| Data de Aceite | `company_invites.accepted_at` | Quando aceitou |
| Nome | `profiles.full_name` | Nome completo (após aceite) |
| Fase da Jornada | `profiles.journey_status` | Não iniciado / Em andamento / Concluído |
| Progresso (mapas) | `profiles.journey_completed_tests / 7` | X/7 mapas concluídos |
| Código da Essência | `ativacao_codigo` | Se gerou o código |
| Consentimento LGPD | `company_users.consent_given` | Se aceitou compartilhar |
| Compartilhando dados | `company_users.share_report_with_company` | Se compartilha relatórios |
| Profissão | `profiles.profession` | Profissão informada |
| Gênero | `profiles.gender` | Gênero informado |

### Indicadores visuais de fase

- **Convite Pendente** → Badge amarelo "Aguardando"
- **Aceito, Não Iniciou** → Badge cinza "Não iniciou"
- **Em Andamento** → Badge azul "Em andamento" + barra X/7
- **Concluído** → Badge verde "Concluído"
- **Código da Essência** → Badge dourado especial

### Implementação

**Arquivo**: `src/apps/business/pages/BusinessInvite.tsx`

1. Adicionar estado `inviteHistory` e função `fetchInviteHistory` que:
   - Busca todos os registros de `company_invites` da empresa
   - Para convites aceitos (`accepted_by` não nulo), busca dados de `profiles` e `company_users`
   - Verifica se o usuário tem `ativacao_codigo`

2. Adicionar nova seção **"Histórico de Convites"** abaixo do card de envio, com:
   - Contador total e filtros por status (Todos / Pendentes / Aceitos)
   - Tabela responsiva com todas as colunas acima
   - Badges coloridos para cada fase
   - Busca por nome/email
   - Botão de reenviar convite para pendentes

3. Carregar dados no `useEffect` quando `company` estiver disponível.

Nenhuma mudança de banco de dados necessária — todos os dados já existem nas tabelas atuais.

