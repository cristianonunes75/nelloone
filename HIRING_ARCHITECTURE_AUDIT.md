# HIRING ARCHITECTURE AUDIT
## Auditoria Arquitetural Completa — Módulo Hiring no Ecossistema Nello One

**Data**: 2026-02-22  
**Escopo**: Análise estrutural, sem criação de features

---

## 1. POSICIONAMENTO DO HIRING

### Classificação: HÍBRIDO (submódulo do Business com identidade própria)

**Evidências:**

| Aspecto | Detalhe |
|---------|---------|
| **Código-fonte** | Vive em `src/apps/business/pages/BusinessHiring*.tsx` e `src/apps/business/components/Hiring*.tsx` |
| **Roteamento** | Dentro de `BusinessApp.tsx` — compartilha o mesmo router |
| **Proteção** | Usa `BusinessProtectedRoute` com `requiredRole="company_admin"` |
| **Autenticação** | Reutiliza `useBusinessAuth()` — mesmo sistema de auth do Business |
| **Landing page** | Compartilha `BusinessLanding.tsx` (a landing é focada em Hiring) |
| **Billing** | Compartilha `BusinessBilling` — sem plano/assinatura separada |

### Rotas Reais

```
/hiring                    → BusinessHiring (lista de candidatos)
/hiring/:candidateId       → BusinessHiringResults (resultados)
/assessment/:token         → BusinessHiringAssessment (público, candidato faz teste)
/jobs                      → BusinessJobs (lista de vagas)
/jobs/:jobId               → BusinessJobDetail (detalhe da vaga)
/vaga/:slug                → BusinessJobPublic (vaga pública)
/confirmar/:token          → BusinessApplicationConfirm
/candidates                → BusinessCandidates (visão unificada)
```

### Dependência de BusinessProtectedRoute

**Total**: Todas as rotas Hiring passam por `BusinessProtectedRoute`, que:
1. Verifica autenticação via `useBusinessAuth()`
2. Exige `company_admin` role
3. Aplica paywall (verifica trial/assinatura ativa)

**Conclusão**: Hiring **não pode operar de forma independente** do Business. Depende de `companies`, `company_users`, e do sistema de billing do Business.

---

## 2. FLUXO DE USUÁRIOS

### Fluxo Completo

```
1. Empresa (company_admin) cria vaga
   → INSERT em job_postings (company_id)

2. Candidato se inscreve (via link público /vaga/:slug)
   → INSERT em job_applications (job_id, company_id)
   → OU candidato é criado manualmente pelo admin
   → INSERT em hiring_candidates (company_id)

3. Vinculação (opcional)
   → job_applications.hiring_candidate_id → hiring_candidates.id

4. Avaliação ocorre
   → Candidato acessa /assessment/:token
   → hiring_assessments (DISC + Temperamentos) criados via trigger
   → hiring_answers armazenam respostas
   → result_data calculado e salvo em hiring_assessments

5. Resultados visualizados
   → company_admin acessa /hiring/:candidateId
   → PDF pode ser gerado (pdfHiringResults.ts)
```

### Usuário Identity é criado? ❌ NÃO

- `hiring_candidates` **NÃO** tem campo `user_id`
- Candidato acessa via `invite_token`, sem autenticação Supabase
- **Nenhum registro** é criado em `profiles` ou `user_roles`
- Candidato é uma entidade **completamente separada** do Identity

### Perfil final armazenado onde?

| Dado | Tabela | Campo |
|------|--------|-------|
| Dados pessoais | `hiring_candidates` | full_name, email, phone |
| Resultados DISC | `hiring_assessments` | result_data (JSON) |
| Resultados Temperamentos | `hiring_assessments` | result_data (JSON) |
| Match com perfil ideal | `hiring_candidates` | match_result, match_ideal_profile |
| Currículo | `job_applications` | resume_url, extracted_data |

### Criação de Profiles: ❌ Não ocorre
### User_roles atribuídos: ❌ Nenhum
### Vínculo com company_users: ❌ Inexistente

---

## 3. USO DO IDENTITY NO HIRING

### Testes Utilizados

| Teste | Usado no Hiring? | Mesmo Motor? |
|-------|-------------------|-------------|
| DISC | ✅ Sim | ✅ Mesmo banco de perguntas (`test_questions` via `get_hiring_test_questions`) |
| Temperamentos | ✅ Sim | ✅ Mesmo banco de perguntas |
| Nello16 | ❌ Não | — |
| Estilos de Conexão | ❌ Não | — |
| Enneagrama | ❌ Não | — |
| Inteligências Múltiplas | ❌ Não | — |
| Âncoras de Carreira | ❌ Não | — |

### Motor de Scoring

- Hiring usa funções RPC dedicadas: `save_hiring_answer`, `complete_hiring_assessment`, `start_hiring_assessment`
- Resultados calculados via `result_data` JSON (mesmo formato do Identity)
- Insights interpretados via `discHiringInsights.ts` (biblioteca B2B específica, **diferente** das interpretações do Identity individual)

### Reaproveitamento pós-contratação: ⚠️ PARCIAL

- `hiring_assessments` tem campo `imported_from_user_id` — indica possibilidade de importar dados de um user_test existente
- **Porém**, o caminho inverso (Hiring → Identity) **não existe**
- Se candidato é contratado e cria conta Identity, seus resultados do Hiring **não são migrados**

---

## 4. ENTIDADES E TABELAS

### Mapa de Relações

```
companies
  ├── job_postings (company_id FK)
  │     └── job_applications (job_id FK)
  │           └── job_application_logs (application_id FK)
  │
  ├── hiring_candidates (company_id FK)
  │     └── hiring_assessments (candidate_id FK)
  │           └── hiring_answers (assessment_id FK)
  │
  └── company_users (company_id FK)
        [SEM LINK com hiring_candidates]
```

### Vínculo job_applications ↔ hiring_candidates

- `job_applications.hiring_candidate_id` → FK para `hiring_candidates.id`
- Este é o **único ponto de conexão** entre o sistema de vagas e o sistema de avaliação

### Duplicações e Conflitos

| Problema | Detalhe |
|----------|---------|
| **Dados duplicados** | `hiring_candidates` e `job_applications` ambos armazenam `full_name`, `email`, `phone` — sem sincronização automática |
| **Dois pipelines** | `hiring_candidates.status` e `job_applications.pipeline_stage` são sistemas independentes |
| **Sem entidade unificada** | Um mesmo candidato pode existir em `hiring_candidates` sem `job_application` e vice-versa |
| **Identity desconectado** | `hiring_assessments` vs `user_tests` — mesmo tipo de dado, tabelas separadas, sem link |

---

## 5. TRANSIÇÃO CANDIDATO → COLABORADOR

### Existe fluxo automático? ❌ NÃO

**Lacuna arquitetural confirmada:**

1. Candidato completa avaliação → `hiring_candidates.status = 'completed'`
2. **Não há** trigger ou função que:
   - Crie registro em `company_users`
   - Crie registro em `profiles`
   - Atribua `user_roles`
   - Migre resultados para `user_tests`

### O que seria necessário para a transição:

```
hiring_candidates (approved)
  → profiles (INSERT com dados do candidato)
  → user_roles (INSERT role = 'cliente')
  → company_users (INSERT com company_id, role = 'collaborator')
  → user_tests (INSERT com result_data migrado de hiring_assessments)
```

**Nenhum destes passos existe hoje.**

---

## 6. RELAÇÃO HIRING ↔ PRAXIS

### Operador acompanha candidato pós-contratação? ❌ NÃO

| Verificação | Resultado |
|-------------|-----------|
| FK `operator_id` em `hiring_candidates` | ❌ Inexistente |
| FK `operator_id` em `job_postings` | ❌ Inexistente |
| Referência a Praxis no código Hiring | ❌ Nenhuma |
| Referência a Hiring no código Praxis | ❌ Nenhuma |

### Isolamento total

- Praxis opera via `operator_workspaces`, `client_operator_relationships`, `professional_clients`
- Hiring opera via `hiring_candidates`, `hiring_assessments`
- **Zero interseção** entre as duas árvores de dados
- Operador não tem visibilidade sobre candidatos em processo seletivo

---

## 7. RESPONSABILIDADE DO MÓDULO

### O que Hiring faz hoje:

| Função | Status |
|--------|--------|
| Recrutamento (ATS) | ✅ Parcial (vagas, candidaturas, pipeline) |
| Avaliação comportamental | ✅ Completo (DISC + Temperamentos) |
| Match com perfil ideal | ✅ Implementado (Smart Sales Match) |
| PDF de resultados | ✅ Implementado |
| Diagnóstico humano inicial | ⚠️ Sim, mas resultados ficam isolados |
| Entrada corporativa no Identity | ❌ Não (candidato nunca vira user Identity) |
| Onboarding pós-contratação | ❌ Inexistente |

### O que Hiring NÃO faz:

- Criar conta Identity para candidato aprovado
- Migrar resultados para o perfil Identity
- Conectar com operador Praxis
- Alimentar insights do Business (company_team_insights) com dados do Hiring

---

## 8. RECOMENDAÇÃO FINAL

### Posicionamento Ideal: **Porta de Entrada Corporativa do Identity**

Hiring deveria ser mais do que um ATS. Já possui a infraestrutura de avaliação comportamental que é o core do Identity. O posicionamento natural é:

```
HIRING = ATS + Diagnóstico Comportamental + Onboarding Identity

Fluxo ideal:
Vaga publicada
  → Candidato se inscreve
  → Avaliação DISC + Temperamentos (já existe)
  → Aprovação pelo company_admin
  → [LACUNA] Auto-criação de conta Identity
  → [LACUNA] Migração de resultados para user_tests
  → [LACUNA] Vínculo com company_users como collaborator
  → [LACUNA] Operador Praxis notificado (se vinculado à empresa)
  → Colaborador continua jornada Identity com dados já preenchidos
```

### Argumentos

| Como ATS puro | Como porta de entrada Identity |
|---------------|-------------------------------|
| Limitado — compete com Gupy, Kenoby | Diferenciado — ninguém oferece contratação + autoconhecimento |
| Dados descartados após contratação | Dados reaproveitados no ciclo de vida do colaborador |
| Sem valor para retenção | Alimenta insights de equipe e programas de desenvolvimento |
| Módulo isolado | Integrado ao ecossistema |

### Lacunas Arquiteturais Críticas (por prioridade)

1. **Transição candidato → colaborador** — Criar fluxo automático de conversão
2. **Migração de resultados** — `hiring_assessments` → `user_tests` 
3. **Unificação de dados** — Resolver duplicação `hiring_candidates` / `job_applications`
4. **Vínculo com Praxis** — Adicionar `operator_id` a `hiring_candidates` ou `job_postings`
5. **Feed para insights** — Dados do Hiring alimentarem `company_team_insights`

### Status: NENHUMA alteração realizada

Este documento é exclusivamente analítico. Nenhum código, tabela ou configuração foi modificado.

---

*Gerado em 2026-02-22 — Auditoria Arquitetural Nello Hiring*
