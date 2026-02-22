# NELLO ECOSYSTEM — ARCHITECTURE AUDIT
**Data:** 2026-02-22  
**Autor:** Auditoria Automatizada  
**Versão:** 1.0

---

## 1. MAPEAMENTO DE MÓDULOS

### 1.1 Apps Registrados (src/apps/)

| App | Subdomain | Status | Feature Flags | Rotas Principais |
|-----|-----------|--------|---------------|------------------|
| **Identity** (One) | `identity.nello.one` / `nelloone.com` | ✅ Ativo (produto principal) | N/A (always on) | `/`, `/cliente`, `/me`, `/codigo-essencia`, `/ativacao-codigo`, `/cruzamentos`, `/checkout` |
| **Business** (Hiring) | `business.nello.one` | ✅ Ativo | `HIRING_MODULE: true`, `JOBS_MODULE: true`, `TEAM_MANAGEMENT: true`, `BILLING_ENABLED: true` | `/dashboard`, `/hiring`, `/jobs`, `/team`, `/candidates`, `/billing`, `/settings` |
| **Praxis** | `business.nello.one/praxis` | ✅ Ativo (recém-ativado) | `PRAXIS_MODULE: true`, `feature_nello_praxis_enabled` (app_settings) | `/praxis`, `/praxis/dashboard`, `/praxis/clients/:clientId` |
| **Flow** | `flow.nello.one` | ⚠️ Parcial (UI existe, pouco uso) | N/A | App próprio (FlowApp.tsx) |
| **Life** | `life.nello.one` | ⚠️ Parcial (UI existe, pouco uso) | N/A | App próprio (LifeApp.tsx) |
| **Discernir** | `discernir.nello.one` | ✅ Ativo (pastoral) | N/A | `/padre`, `/dashboard`, `/apoio-escuta`, `/consentimento` |
| **Main** | `www.nello.one` / `nello.one` | ✅ Ativo (institucional) | N/A | `/` (landing institucional do ecossistema) |

### 1.2 Permissões de Acesso por Módulo

| Módulo | Roles Necessárias | Proteção |
|--------|-------------------|----------|
| Identity | `cliente`, `admin` | `ProtectedRoute` (allowedRoles) |
| Business | `company_admin`, `collaborator`, `super_admin` | `BusinessProtectedRoute` (business_role enum) |
| Praxis | `operator` (app_role) | `PraxisAuthProvider` + `OperatorProvider` |
| Discernir | `admin` + `discernir_priests` | `is_discernir_priest()` function |
| Admin | `admin` | `ProtectedRoute` + `AdminGuard` (dual-layer) |

---

## 2. ENTIDADES DE DOMÍNIO EXISTENTES

### 2.1 Tabelas de Usuários e Perfis

| Tabela | Propósito | Uso Corporativo |
|--------|-----------|-----------------|
| `profiles` | Perfil básico (nome, telefone, avatar) | ❌ Pessoal |
| `user_roles` | Roles do sistema (admin, cliente, fotografo, operator) | ❌ Sistema |
| `user_consents` | LGPD consents | ❌ Pessoal |
| `user_app_registrations` | Registro em apps do ecossistema | ❌ Sistema |

### 2.2 Tabelas de Operadores (Praxis)

| Tabela | Propósito | Registros |
|--------|-----------|-----------|
| `operator_workspaces` | Workspace do operador (bio, metodologia, status) | 1 (Fernando Duarte) |
| `operator_methodologies` | Metodologias customizadas do operador | 0 |
| `operator_tasks` | Tarefas atribuídas a clientes | 0 |
| `operator_reflections` | Reflexões e checkpoints | 0 |
| `client_operator_relationships` | Vínculo operador↔cliente | 0 |

### 2.3 Tabelas de Profissionais (Legacy — NÃO USADAS pelo Praxis)

| Tabela | Propósito | Registros |
|--------|-----------|-----------|
| `professional_profiles` | Perfis profissionais (coaches, terapeutas) | 0 |
| `professional_clients` | Clientes de profissionais | — |
| `professional_financial_records` | Financeiro do profissional | — |
| `client_sessions` | Sessões com clientes | — |
| `client_session_packages` | Pacotes de sessões | — |
| `client_milestones` | Marcos evolutivos | — |

> ⚠️ **SOBREPOSIÇÃO CRÍTICA:** As tabelas `professional_*` e `client_sessions/milestones` existem em paralelo com `operator_workspaces` e `operator_tasks/reflections`. Funcionalidade duplicada.

### 2.4 Tabelas de Empresas (Business/Hiring)

| Tabela | Propósito | Registros |
|--------|-----------|-----------|
| `companies` | Organizações cadastradas | 4 |
| `company_users` | Vínculo empresa↔usuário (role: business_role) | — |
| `company_invites` | Convites para empresas | — |
| `company_subscriptions` | Assinaturas corporativas | — |
| `company_team_insights` | Insights de equipe (DISC/Temperamento agregado) | — |
| `company_user_imports` | Importação de dados de usuários | — |
| `company_audit_logs` | Logs de auditoria corporativa | — |
| `company_status_history` | Histórico de status da empresa | — |
| `company_ai_consultations` | Consultas AI corporativas | — |
| `business_health_alerts` | Alertas de saúde do negócio | — |
| `business_pricing_tiers` | Tiers de preço B2B | — |

### 2.5 Tabelas de Hiring (Recrutamento)

| Tabela | Propósito |
|--------|-----------|
| `hiring_candidates` | Candidatos a vagas |
| `hiring_assessments` | Avaliações (DISC + Temperamentos) |
| `hiring_answers` | Respostas dos candidatos |
| `job_postings` | Vagas publicadas |
| `job_applications` | Candidaturas |
| `job_application_logs` | Logs de pipeline |
| `ideal_profile_templates` | Templates de perfil ideal |

### 2.6 Tabelas de Discernir (Pastoral)

| Tabela | Propósito |
|--------|-----------|
| `discernir_parishes` | Paróquias |
| `discernir_priests` | Padres/agentes pastorais |
| `discernir_apoio_escuta` | Apoios de escuta gerados |
| `discernir_consents` | Consentimentos pastorais |
| `discernir_couples` | Casais |
| `discernir_couple_invites` | Convites conjugais |
| `discernir_feedback` | Feedback pastoral |
| `discernir_access_logs` | Logs de acesso |
| `identity_essencial` | Jornada Identity Essencial |
| `identity_essencial_synthesis` | Síntese da jornada |

### 2.7 Tabelas de Identity (Core)

| Tabela | Propósito |
|--------|-----------|
| `tests` | Catálogo de testes comportamentais |
| `test_questions` | Perguntas dos testes |
| `user_tests` | Testes realizados pelo usuário |
| `test_answers` | Respostas dos testes |
| `test_purchases` | Compras de testes |
| `ativacao_codigo` | Ativação do Código da Essência |
| `ativacao_profissional` | Direção Profissional |
| `mapa_essencia` | Mapa da Essência |
| `codigo_cruzamentos` | Cruzamentos de código |
| `relatorios_contextuais` | Relatórios contextuais |
| `relatorio_conjuge` | Relatório do cônjuge |

---

## 3. PAPÉIS E ROLES IMPLEMENTADOS

### 3.1 Enum `app_role` (Sistema Global)

| Role | Status | Uso |
|------|--------|-----|
| `admin` | ✅ Em uso | Administradores Nello |
| `cliente` | ✅ Em uso | Usuários finais (auto-atribuído no signup) |
| `fotografo` | ⚠️ Legacy | Módulo de fotografia (provavelmente obsoleto) |
| `operator` | ✅ Recém-criado | Operadores Praxis |

### 3.2 Enum `business_role` (Escopo Business)

| Role | Status | Uso |
|------|--------|-----|
| `super_admin` | ✅ Em uso | Admin máximo da empresa |
| `company_admin` | ✅ Em uso | Administrador da empresa |
| `collaborator` | ✅ Em uso | Colaborador/funcionário |

### 3.3 Roles Implícitas (Sem Enum)

| Role | Mecanismo | Uso |
|------|-----------|-----|
| Priest/Padre | Tabela `discernir_priests` + `is_discernir_priest()` | Agentes pastorais no Discernir |
| Operator | `operator_workspaces.status` (founding_operator, active) | Status do operador |

### 3.4 Análise de Conflitos

| Conflito | Descrição | Risco |
|----------|-----------|-------|
| `operator` vs `professional_profiles` | Duas estruturas paralelas para o mesmo conceito (profissional que acompanha clientes) | 🔴 Alto — duplicação funcional |
| `fotografo` | Role obsoleta, não removida do enum | 🟡 Baixo — poluição de enum |
| `business_role` vs `app_role` | Dois sistemas de roles separados, sem unificação | 🟡 Médio — complexidade desnecessária, mas funcional |

---

## 4. CAPACIDADES JÁ PRESENTES NO NELLO BUSINESS

| Capacidade | Status | Tabela/Componente |
|------------|--------|-------------------|
| Contas organizacionais | ✅ Implementado | `companies` + `company_users` |
| Múltiplos usuários por empresa | ✅ Implementado | `company_users` (com roles) |
| Convites por email | ✅ Implementado | `company_invites` |
| Dashboard corporativo | ✅ Implementado | `BusinessDashboard` |
| Gestão de equipe | ✅ Implementado | `BusinessTeam` |
| Assinaturas/billing | ✅ Implementado | `company_subscriptions`, `BusinessBilling` |
| Vagas e recrutamento | ✅ Implementado | `job_postings`, `hiring_candidates`, `BusinessHiring` |
| Avaliações comportamentais (DISC + Temp) | ✅ Implementado | `hiring_assessments`, motor de scoring compartilhado |
| Relatórios individuais candidatos | ✅ Implementado | `BusinessHiringResults` |
| Insights de equipe agregados | ⚠️ Parcial | `company_team_insights` (tabela existe, `TEAM_INSIGHTS: false`) |
| People Analytics | ❌ Desativado | `PEOPLE_ANALYTICS: false` |
| Importação de dados de usuários | ⚠️ Parcial | `company_user_imports` (tabela existe) |

---

## 5. ESTADO DO NELLO PRAXIS

### 5.1 Funcionalidades Implementadas

| Funcionalidade | Status | Componente |
|----------------|--------|------------|
| Landing page | ✅ | `PraxisLanding` |
| Autenticação própria | ✅ | `PraxisAuth` + `PraxisAuthProvider` |
| Onboarding do operador | ✅ | `PraxisOnboarding` |
| Dashboard principal | ✅ | `PraxisDashboard` (tabs: Clientes, Tarefas, Reflexões) |
| Detalhe de cliente | ✅ | `PraxisClientDetail` |
| Workspace do operador | ✅ | `useOperatorWorkspace` hook |
| Metodologias customizadas | ✅ | `operator_methodologies` |
| Tarefas para clientes | ✅ | `operator_tasks` |
| Reflexões/checkpoints | ✅ | `operator_reflections` |
| Vínculo operador↔cliente | ✅ | `client_operator_relationships` |

### 5.2 Dependências com Identity

- **Código da Essência:** O operador pode visualizar o Código da Essência dos clientes vinculados
- **Testes comportamentais:** O operador NÃO pode alterar scoring, testes ou núcleo Identity
- **Timeline evolutiva:** Baseada nos resultados do Identity (read-only)

### 5.3 Integração com Business

- **Praxis é sub-rota do Business:** `business.nello.one/praxis/*`
- **Auth separada:** `PraxisAuthProvider` (não usa `BusinessProtectedRoute`)
- **Sem vínculo com companies:** Praxis opera independente de `companies` / `company_users`

### 5.4 Limitações Atuais

| Limitação | Impacto |
|-----------|---------|
| Sem dados reais (0 clientes, 0 tarefas) | Não testado em produção |
| `professional_profiles` não conectado | Tabelas legacy orphanadas |
| Sem integração com sessões existentes (`client_sessions`) | Funcionalidade de sessões não reutilizada |
| Sub-rota do Business sem autonomia de subdomínio | Depende do Business para routing |
| Nenhuma metodologia cadastrada | Template inicial ausente |

---

## 6. FLUXOS POSSÍVEIS HOJE (SEM NOVO DESENVOLVIMENTO)

### Fluxo 1: Pessoa → Identity → Autoconhecimento
```
Signup → cliente role → Testes (DISC/Temp/Estilos) → Código da Essência → Ativação → Cruzamentos
```
✅ **100% funcional**

### Fluxo 2: Empresa → Hiring → Candidatos
```
Empresa signup → company_admin → Criar vaga → Candidato avalia (DISC+Temp) → Relatório → Decisão
```
✅ **100% funcional**

### Fluxo 3: Empresa → Colaboradores → Identity
```
Empresa → Convite collaborator → Usuário aceita → Faz testes no Identity → Dados compartilhados (company_user_imports)
```
⚠️ **Parcial** — O fluxo de importação existe mas Team Insights está desativado

### Fluxo 4: Operador → Clientes → Acompanhamento
```
Operador signup → operator role → Cria workspace → Vincula clientes → Acompanha (tarefas, reflexões)
```
⚠️ **Estrutura existe, sem dados reais**

### Fluxo 5: Paróquia → Discernir → Escuta Pastoral
```
Padre cadastrado → Paróquia → Fiel faz Identity Essencial → Apoio de Escuta gerado → Acompanhamento pastoral
```
✅ **Funcional**

### Fluxo 6: Pessoa → Operador → Organização ❌
```
Este fluxo NÃO é possível hoje. Não há vínculo entre operator_workspaces e companies.
```

### Fluxo 7: Empresa → Operador → Funcionários → Identity ❌
```
Este fluxo NÃO é possível hoje. Praxis e Business não compartilham entidades.
```

---

## 7. SOBREPOSIÇÃO ARQUITETURAL

### 7.1 Funcionalidades Duplicadas

| Funcionalidade | Módulo A | Módulo B | Ação Recomendada |
|----------------|----------|----------|------------------|
| Perfil profissional | `professional_profiles` | `operator_workspaces` | **Unificar** em `operator_workspaces` |
| Clientes vinculados | `professional_clients` | `client_operator_relationships` | **Unificar** em `client_operator_relationships` |
| Sessões | `client_sessions` | `operator_reflections` (parcial) | **Migrar** sessões para Praxis |
| Pacotes de sessões | `client_session_packages` | Não existe no Praxis | **Avaliar** necessidade |
| Marcos evolutivos | `client_milestones` | `operator_tasks` (parcial) | **Unificar** conceito |
| Financeiro profissional | `professional_financial_records` | Não existe no Praxis | **Manter** se necessário |

### 7.2 Módulos que Deveriam Ser Unificados

1. **`professional_*` → `operator_*`**: As tabelas `professional_profiles`, `professional_clients`, `professional_financial_records` são legacy e devem ser absorvidas pelo domínio Praxis (`operator_*`).

2. **`client_sessions` + `client_milestones` → Praxis**: Sessões e marcos deveriam estar sob controle do operador Praxis, não em tabelas avulsas.

### 7.3 Peças Prontas Não Conectadas

| Peça | Onde está | O que falta |
|------|----------|-------------|
| `company_team_insights` | Business DB | Feature flag desligada, sem cálculo automático |
| `company_user_imports` | Business DB | Fluxo de importação incompleto |
| `company_ai_consultations` | Business DB | Sem edge function conectada |
| `business_health_alerts` | Business DB | Sem geração automática de alertas |
| `professional_financial_records` | DB | Sem UI, sem integração |
| `Flow` app | src/apps/flow | Pouco uso, sem produto definido |
| `Life` app | src/apps/life | Pouco uso, sem produto definido |

---

## 8. RECOMENDAÇÃO ARQUITETURAL

### 8.1 Responsabilidade por Módulo

| Módulo | Responsabilidade Principal | NÃO deve fazer |
|--------|---------------------------|----------------|
| **Identity** | Motor comportamental (testes, scoring, Código da Essência, cruzamentos, relatórios). É o **núcleo de dados**. | Gestão de clientes, acompanhamento, organizações |
| **Praxis** | Acompanhamento profissional (operadores, clientes, sessões, tarefas, metodologias, reflexões). É o **módulo operacional**. | Alterar scoring, aplicar testes, billing |
| **Business** | Gestão organizacional (empresas, equipes, hiring, billing, vagas, candidatos). É o **módulo corporativo**. | Acompanhamento individual, sessões 1:1 |
| **Discernir** | Escuta pastoral (paróquias, padres, apoios de escuta). É o **módulo vertical pastoral**. | Scoring, billing, gestão de equipes |

### 8.2 Ações Prioritárias (Sem Novo Desenvolvimento)

| # | Ação | Esforço | Impacto |
|---|------|---------|---------|
| 1 | Deprecar tabelas `professional_*` em favor de `operator_*` | Baixo | 🟢 Remove ambiguidade |
| 2 | Migrar `client_sessions` / `client_milestones` para escopo Praxis | Médio | 🟢 Unifica sessões |
| 3 | Remover role `fotografo` do enum (se confirmado obsoleto) | Baixo | 🟢 Limpeza |
| 4 | Separar Praxis em subdomínio próprio (`praxis.nello.one`) | Médio | 🟡 Autonomia arquitetural |
| 5 | Criar bridge Praxis↔Business (operador vinculado a empresa) | Alto | 🔴 Habilita fluxos corporativos |

### 8.3 Diagrama de Dependências

```
┌─────────────┐
│   IDENTITY   │ ← Motor de dados (read-only para outros módulos)
│  (Núcleo)    │
└──────┬───────┘
       │ Consome resultados
       ├──────────────────┬──────────────────┐
       ▼                  ▼                  ▼
┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│   PRAXIS     │   │  BUSINESS   │   │  DISCERNIR  │
│ (Operador)   │   │ (Empresa)   │   │ (Pastoral)  │
│              │   │             │   │             │
│ • Clientes   │   │ • Hiring    │   │ • Paróquias │
│ • Sessões    │   │ • Equipes   │   │ • Escuta    │
│ • Tarefas    │   │ • Billing   │   │ • Casais    │
│ • Reflexões  │   │ • Vagas     │   │             │
└──────────────┘   └─────────────┘   └─────────────┘
       ╳ Sem vínculo ╳
```

---

## 9. RESUMO EXECUTIVO

| Métrica | Valor |
|---------|-------|
| Apps registrados | 7 (Identity, Business, Praxis, Flow, Life, Discernir, Main) |
| Apps ativos com produto | 4 (Identity, Business/Hiring, Praxis, Discernir) |
| Apps parciais/inativos | 2 (Flow, Life) |
| Tabelas no schema público | 107 |
| Roles no app_role | 4 (admin, cliente, fotografo, operator) |
| Roles no business_role | 3 (super_admin, company_admin, collaborator) |
| Empresas cadastradas | 4 |
| Operadores cadastrados | 1 (Fernando Duarte) |
| Tabelas duplicadas/legacy | ~6 (professional_*) |
| Feature flags (código) | 7 (BUSINESS_FEATURE_FLAGS) |
| Feature flags (DB/app_settings) | 3+ (feature_*_enabled) |

**Conclusão:** O ecossistema possui infraestrutura sólida mas com sobreposição entre domínios Professional e Operator. A prioridade é unificar essas entidades sob Praxis e estabelecer pontes claras entre módulos antes de novas implementações.
