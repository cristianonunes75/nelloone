# PRAXIS_BUSINESS_BRIDGE_IMPLEMENTED.md
# Ponte Praxis-Business — Relatório de Implementação

**Data:** 2026-02-22  
**Versão:** 1.0  
**Status:** ✅ Concluído

---

## 1. Resumo

Foi criada uma ponte estrutural entre os módulos **Nello Business** (empresas) e **Nello Praxis** (operadores/profissionais), permitindo que operadores conduzam programas de desenvolvimento dentro de empresas, mantendo isolamento de dados e privacidade.

---

## 2. Tabelas Criadas

### `company_operators`
Vincula operadores Praxis a empresas Business.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| company_id | UUID → companies | Empresa |
| operator_workspace_id | UUID → operator_workspaces | Operador |
| role_in_company | TEXT | `lead_operator` ou `operator` |
| status | TEXT | `active`, `paused` |
| started_at | TIMESTAMPTZ | Data de início |

**UNIQUE:** `(company_id, operator_workspace_id)`

### `company_programs`
Programas conduzidos por operadores dentro de empresas.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| company_id | UUID → companies | Empresa |
| operator_workspace_id | UUID → operator_workspaces | Operador responsável |
| program_name | TEXT | Nome do programa |
| description | TEXT | Descrição |
| methodology_name | TEXT | Metodologia utilizada |
| start_date / end_date | DATE | Período |
| status | TEXT | `draft`, `active`, `paused`, `completed` |
| max_participants | INTEGER | Limite (opcional) |

### `company_program_members`
Participantes de um programa, com controle de consentimento.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| company_program_id | UUID → company_programs | Programa |
| user_id | UUID | Colaborador participante |
| consent_status | TEXT | `pending`, `granted`, `revoked` |
| consent_given_at | TIMESTAMPTZ | Data do consentimento |
| consent_revoked_at | TIMESTAMPTZ | Data da revogação |
| joined_at | TIMESTAMPTZ | Data de entrada |

**UNIQUE:** `(company_program_id, user_id)`

---

## 3. Funções de Segurança

| Função | Propósito |
|--------|-----------|
| `is_company_operator(company_id, user_id)` | Verifica se o usuário é operador ativo numa empresa |
| `get_operator_workspace_id(user_id)` | Retorna o workspace_id do operador |

Ambas são `SECURITY DEFINER` para evitar recursão infinita nas políticas RLS.

---

## 4. Políticas RLS — Modelo de Privacidade

### company_operators
| Quem | Permissão | Condição |
|------|-----------|----------|
| Company admin | ALL | `is_company_admin(company_id, auth.uid())` |
| Operador | SELECT | `operator_workspace_id = get_operator_workspace_id(auth.uid())` |

### company_programs
| Quem | Permissão | Condição |
|------|-----------|----------|
| Company admin | SELECT | `is_company_admin(company_id, auth.uid())` |
| Operador | ALL | Próprio workspace + `is_company_operator()` |

### company_program_members
| Quem | Permissão | Condição |
|------|-----------|----------|
| Company admin | ALL | Admin da empresa do programa |
| Operador | SELECT | **Somente `consent_status = 'granted'`** |
| Próprio usuário | ALL | `user_id = auth.uid()` |

### Regra de Privacidade Central
> **O operador SÓ vê dados individuais de membros que concederam consentimento.**  
> A empresa vê SOMENTE dados agregados (contagens, status).  
> Dados de identidade, sessões e scores permanecem isolados no domínio Praxis.

---

## 5. UI Implementada

### Business Dashboard — Tab "Programas Praxis"
- Resumo: contagem de programas e operadores vinculados
- Lista de programas com status e metodologia
- Dialog de detalhes com dados **agregados** (total participantes, consentidos, pendentes)
- Aviso visual: "A empresa vê apenas dados agregados"

### Praxis Dashboard — Tab "Empresas"
- Resumo: contagem de empresas e programas
- Lista de programas corporativos do operador
- Dialog para criar novo programa (com seleção de empresa, metodologia, datas)
- Visualização de membros com consentimento ativo

---

## 6. Fluxos Habilitados

```
┌─────────────┐     company_operators     ┌──────────────────┐
│   Business   │◄────────────────────────►│     Praxis       │
│  (Empresa)   │                          │   (Operador)     │
└──────┬───────┘                          └────────┬─────────┘
       │                                           │
       │  company_programs                         │
       │◄──────────────────────────────────────────┤
       │                                           │
       │  company_program_members                  │
       │  (consent_status = granted)               │
       │──────────────────────────────────────────►│
       │                                           │
  [Dados Agregados]                        [Dados Individuais]
  - Total participantes                    - Sessões
  - % consentimento                        - Milestones
  - Status programa                        - Tarefas
                                           - Código Essência
```

### Fluxo 1: Empresa → Operador → Programa
1. Admin vincula operador à empresa (`company_operators`)
2. Operador cria programa (`company_programs`)
3. Admin adiciona colaboradores (`company_program_members`)
4. Colaborador concede consentimento
5. Operador inicia acompanhamento individual

### Fluxo 2: Operador → Empresa → Colaboradores
1. Operador com vínculo corporativo cria programa
2. Define metodologia e período
3. Empresa aprova e adiciona participantes
4. Consentimento individual dos participantes
5. Operador conduz sessões e registra marcos

---

## 7. Arquivos Criados/Modificados

### Criados
| Arquivo | Descrição |
|---------|-----------|
| `src/apps/business/hooks/usePraxisBridge.tsx` | Hooks para company_operators, company_programs, company_program_members |
| `src/apps/business/components/BusinessProgramsTab.tsx` | Tab de programas no dashboard Business |
| `src/apps/business/components/PraxisCompaniesTab.tsx` | Tab de empresas no dashboard Praxis |

### Modificados
| Arquivo | Mudança |
|---------|---------|
| `src/apps/business/pages/BusinessDashboard.tsx` | Adicionada tab "Programas Praxis" |
| `src/apps/business/pages/PraxisDashboard.tsx` | Adicionada tab "Empresas" |

---

## 8. Próximos Passos

1. **UI para vincular operadores:** Admin precisa de interface para convidar operadores (criar rows em `company_operators`)
2. **Consentimento do colaborador:** Tela de aceite/revogação de consentimento por programa
3. **Logs de auditoria:** Integrar acessos com `company_audit_logs` existente
4. **Relatórios agregados:** Dashboard Business com gráficos de progresso por programa
5. **Notificações:** Alertar operador quando novo membro concede consentimento

---

*Gerado automaticamente pelo Nello Architecture System.*
