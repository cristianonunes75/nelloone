# PRAXIS_SESSIONS_MIGRATION.md
# Relatório de Migração — Sessões para o Domínio Nello Praxis

**Data:** 2026-02-22  
**Versão:** 1.0  
**Status:** ✅ Concluído

---

## 1. Resumo Executivo

As sessões de acompanhamento profissional foram migradas do domínio legacy (`client_sessions`, `client_milestones`) para o domínio Praxis (`operator_sessions`, `operator_session_notes`, `operator_milestones`). As tabelas antigas foram marcadas como **read-only por 60 dias** para auditoria.

---

## 2. Novas Tabelas Criadas

### `operator_sessions`
Substitui `client_sessions`. Vinculada a `operator_workspaces` em vez de `professional_profiles`.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | PK |
| operator_id | UUID → operator_workspaces | Operador responsável |
| client_id | UUID → professional_clients | Cliente |
| relationship_id | UUID → client_operator_relationships | Vínculo (opcional) |
| title | TEXT | Título da sessão |
| session_date | TIMESTAMPTZ | Data/hora |
| duration_minutes | INTEGER | Duração |
| session_type | TEXT | coaching, mentoring, therapy, etc. |
| status | TEXT | scheduled, completed, cancelled, no_show |
| objectives, notes, insights, tasks_for_client, attention_points | TEXT | Conteúdo |
| tags | TEXT[] | Tags |
| session_rate, currency, payment_status, paid_at | — | Financeiro |
| ai_suggestions, ai_generated_at | JSONB/TIMESTAMPTZ | IA |
| legacy_session_id | UUID | Referência à `client_sessions` original |

### `operator_session_notes`
Notas granulares por sessão (novo recurso, sem equivalente legacy).

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | PK |
| session_id | UUID → operator_sessions | Sessão |
| operator_id | UUID → operator_workspaces | Operador |
| note_type | TEXT | general, insight, action_item, etc. |
| content | TEXT | Conteúdo |

### `operator_milestones`
Substitui `client_milestones`.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | PK |
| operator_id | UUID → operator_workspaces | Operador |
| client_id | UUID → professional_clients | Cliente |
| session_id | UUID → operator_sessions | Sessão relacionada (opcional) |
| title | TEXT | Título do marco |
| description | TEXT | Descrição |
| milestone_type | TEXT | achievement, breakthrough, goal_reached, checkpoint |
| milestone_date | TIMESTAMPTZ | Data |
| legacy_milestone_id | UUID | Referência à `client_milestones` original |

---

## 3. Mapeamento de Migração

| Legacy (deprecated) | Praxis (ativo) | Status |
|---------------------|----------------|--------|
| `client_sessions` | `operator_sessions` | ✅ Dados migrados |
| `client_milestones` | `operator_milestones` | ✅ Dados migrados |
| — (novo) | `operator_session_notes` | ✅ Criado vazio |

### Regras de migração:
- `client_sessions.professional_id` → `operator_sessions.operator_id` (quando `operator_workspaces.id` corresponde)
- `client_sessions.id` → `operator_sessions.legacy_session_id` (rastreabilidade)
- `client_milestones.related_session_id` → `operator_milestones.session_id` (via lookup em `operator_sessions.legacy_session_id`)

---

## 4. Tabelas Deprecated (Read-Only 60 dias)

| Tabela | Deprecação | Expira em | Ação futura |
|--------|-----------|-----------|-------------|
| `client_sessions` | 2026-02-22 | 2026-04-23 | Avaliar remoção |
| `client_milestones` | 2026-02-22 | 2026-04-23 | Avaliar remoção |

Comentários SQL adicionados às tabelas com data de deprecação.

---

## 5. Segurança (RLS)

Todas as novas tabelas possuem RLS habilitado com política:
- **Operadores gerenciam apenas seus próprios dados** via subquery em `operator_workspaces.user_id = auth.uid()`
- Sem políticas `USING(true)` — acesso estritamente limitado ao operador autenticado

---

## 6. Mudanças de Código

### Hooks Atualizados
| Hook | Antes | Depois |
|------|-------|--------|
| `usePraxisSessions` | Lê/escreve `client_sessions` | Lê/escreve `operator_sessions` |
| `usePraxisMilestones` | ❌ Não existia | ✅ Criado — CRUD em `operator_milestones` |

### Interface `ClientSession`
- Campo `professional_id` renomeado para `operator_id` na interface TypeScript
- Novos campos: `upcomingSessions`, `completedSessions` expostos pelo hook

### UI — PraxisClientDetail
- ✅ Tab "Marcos" com timeline visual e CRUD
- ✅ Banner "Próximos Encontros" para sessões agendadas futuras
- ✅ Tab "Evolução" com timeline combinada (sessões + marcos)
- ✅ Stats atualizados: total sessões, próximas, marcos, valor/sessão
- ✅ Dialog para criação de marcos com tipos (conquista, avanço, meta, checkpoint)

---

## 7. Próximos Passos

1. **Após 60 dias (2026-04-23):** Avaliar remoção de `client_sessions` e `client_milestones`
2. **operator_session_notes:** Integrar UI de notas por sessão no PraxisSessionDialog
3. **Relatórios financeiros:** Migrar lógica de `professional_financial_records` para domínio Praxis
4. **Conexão Praxis-Business:** Vincular `operator_workspaces` a `companies` para fluxos corporativos

---

*Gerado automaticamente pelo Nello Architecture System.*
