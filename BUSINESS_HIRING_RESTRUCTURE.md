# BUSINESS & HIRING RESTRUCTURE
## Reestruturação Arquitetural — Business como Hub Corporativo + Hiring como Submódulo

**Data**: 2026-02-22  
**Escopo**: Análise estrutural e posicionamento, sem criação de features

---

## 1. POSICIONAMENTO ARQUITETURAL

### Decisão: Business = Corporate Hub do Nello

O módulo **Business** (`business.nello.one`) passa a ser oficialmente o **único ponto de entrada corporativo** do ecossistema Nello One.

#### Responsabilidades do Business

| Área | Descrição | Status Atual |
|------|-----------|-------------|
| **Autenticação corporativa** | Login empresarial via `useBusinessAuth` | ✅ Implementado |
| **Gestão de empresas** | CRUD de `companies`, onboarding | ✅ Implementado |
| **Billing** | Assinaturas, trials, paywall via `useTrialEnforcement` | ✅ Implementado |
| **Colaboradores** | `company_users`, convites, consentimento | ✅ Implementado |
| **Recrutamento (Hiring)** | Vagas, candidatos, avaliações comportamentais | ✅ Implementado (submódulo) |
| **Acompanhamento organizacional** | Team insights, relatórios executivos | ✅ Implementado |

#### Hiring: Reclassificação Oficial

| Antes | Depois |
|-------|--------|
| Tratado ambiguamente como "módulo" | **Submódulo funcional do Business** |
| Mencionado separadamente no Control Center | Listado sob "Business > Recrutamento" |
| Possibilidade de subdomínio próprio | ❌ **Descartada permanentemente** |

**Hiring NÃO terá:**
- Subdomínio próprio (`hiring.nello.one`)
- Auth própria
- Billing separado
- Landing page independente

---

## 2. REESTRUTURAÇÃO DE ROTAS

### Estado Atual das Rotas (BusinessApp.tsx)

```
ROTAS HIRING ATUAIS (já dentro de BusinessApp):
/hiring                    → BusinessHiring (lista de avaliações)
/hiring/:candidateId       → BusinessHiringResults (resultados)
/assessment/:token         → BusinessHiringAssessment (público)
/jobs                      → BusinessJobs (vagas)
/jobs/:jobId               → BusinessJobDetail (detalhe)
/vaga/:slug                → BusinessJobPublic (vaga pública)
/confirmar/:token          → BusinessApplicationConfirm
/candidates                → BusinessCandidates (visão unificada)
```

### Verificação de Conformidade

| Critério | Status |
|----------|--------|
| Todas as rotas Hiring estão em `BusinessApp.tsx` | ✅ Confirmado |
| Rotas admin usam `BusinessProtectedRoute` com `requiredRole="company_admin"` | ✅ Confirmado |
| Rotas públicas (`/assessment`, `/vaga`, `/confirmar`) sem proteção | ✅ Correto |
| Paywall aplicado via `enforceTrial` | ✅ Confirmado |
| Nenhuma rota Hiring existe fora de BusinessApp | ✅ Confirmado |

### Rotas Alvo (Futuro — sem implementar agora)

Para total clareza hierárquica, as rotas poderiam migrar para:

```
ROTAS PROPOSTAS (não implementadas):
/hiring          → /recruitment
/hiring/:id      → /recruitment/results/:id
/jobs            → /recruitment/jobs
/jobs/:id        → /recruitment/jobs/:id
/candidates      → /recruitment/candidates
```

**Decisão**: Manter rotas atuais por estabilidade. A hierarquia já é funcional — Hiring está 100% dentro de BusinessApp e protegido por BusinessProtectedRoute.

---

## 3. EXPERIÊNCIA CORPORATIVA UNIFICADA

### Navegação Atual (BusinessLayout.tsx)

```typescript
const adminNavItems = [
  { href: '/dashboard',    label: 'Dashboard',      icon: LayoutDashboard },
  { href: '/jobs',         label: 'Vagas',           icon: ClipboardList },
  { href: '/candidates',   label: 'Candidatos',      icon: Users },
  { href: '/hiring',       label: 'Avaliações',      icon: Briefcase },
  { href: '/settings',     label: 'Configurações',   icon: Settings },
];
```

### Navegação Alvo (Conceitual)

A experiência ideal agruparia funcionalidades:

```
Dashboard Empresa          → Visão geral (métricas, alertas)
Recrutamento               → Vagas + Candidatos + Avaliações (Hiring)
  ├─ Vagas                 → /jobs
  ├─ Candidatos            → /candidates
  └─ Avaliações            → /hiring
Equipe                     → /team (colaboradores mapeados)
Insights Organizacionais   → Team insights, relatórios
Billing                    → /billing
Configurações              → /settings (convites, perfil empresa)
```

### Análise de Consistência

| Item | Status |
|------|--------|
| Hiring aparece na nav principal | ✅ Sim (como "Avaliações") |
| Vagas e Candidatos separados de Avaliações | ⚠️ Podem confundir — são 3 itens para 1 módulo |
| Equipe (`/team`) não está na nav | ⚠️ Rota existe mas não aparece no menu |
| Billing não está na nav | ⚠️ Acessível apenas via redirect do paywall |

---

## 4. INTEGRAÇÃO CONCEITUAL COM IDENTITY

### Declaração Arquitetural

> **Hiring = Porta Corporativa do Identity**
>
> O módulo Hiring é o canal pelo qual indivíduos entram no ecossistema Nello através de uma empresa. A avaliação comportamental (DISC + Temperamentos) realizada durante o recrutamento é o primeiro contato do candidato com o motor Identity.

### Fluxo Alvo (Não Implementado)

```
Candidato se inscreve na vaga
  → Avaliação DISC + Temperamentos (já existe)
  → Aprovação pelo company_admin
  → [LACUNA] Criação automática de conta Identity
  → [LACUNA] Migração de hiring_assessments → user_tests
  → [LACUNA] Vínculo company_users (role: collaborator)
  → [LACUNA] Operador Praxis notificado (se vinculado)
  → Colaborador continua jornada Identity
```

### Tabelas Envolvidas na Transição Futura

| Origem (Hiring) | Destino (Identity) | Ação |
|-----------------|-------------------|------|
| `hiring_candidates` (full_name, email) | `profiles` | INSERT |
| `hiring_assessments` (result_data) | `user_tests` | INSERT com migração |
| `hiring_candidates` (company_id) | `company_users` | INSERT (role: collaborator) |
| — | `user_roles` | INSERT (role: cliente) |

### Status: ❌ Nenhum destes fluxos existe hoje

Campo `imported_from_user_id` em `hiring_assessments` indica que a importação inversa (Identity → Hiring) foi prevista, mas o caminho Hiring → Identity **nunca foi implementado**.

---

## 5. AUDITORIA DE NAVEGAÇÃO

### Problemas Identificados

| # | Problema | Severidade | Detalhe |
|---|----------|-----------|---------|
| 1 | **3 itens de menu para Hiring** | Média | "Vagas", "Candidatos" e "Avaliações" são subáreas do mesmo módulo — fragmenta a percepção |
| 2 | **`/team` sem entrada no menu** | Média | Rota existe e é protegida, mas não aparece na navegação |
| 3 | **`/billing` sem entrada no menu** | Baixa | Acessível apenas via redirect do paywall — admin não consegue acessar proativamente |
| 4 | **`/reports` redireciona para `/dashboard`** | Baixa | Rota legacy morta — pode ser removida |
| 5 | **`/invite` separado de `/settings`** | Baixa | Convites já estão nas Configurações, rota `/invite` pode ser legacy |
| 6 | **`/my-journey` para collaborator** | Info | Redireciona via `BusinessCollaboratorRedirect` — funcional mas opaco |

### Componentes que Tratam Hiring como Separado

| Componente / Arquivo | Tratamento |
|---------------------|-----------|
| `AdminControlCenter.tsx` | Lista "Hiring" como módulo separado no Platform Core |
| `NELLO_PLATFORM_ARCHITECTURE.md` | Classifica Hiring como Core Platform (correto, mas ao lado do Business) |
| `BusinessLayout.tsx` | Hiring fragmentado em 3 itens de menu |
| `BusinessLanding.tsx` | Landing focada em Hiring — reforça percepção de produto separado |

### Ajustes Futuros Recomendados

1. **Agrupar Vagas/Candidatos/Avaliações** sob um menu dropdown "Recrutamento"
2. **Adicionar `/team`** à navegação principal
3. **Adicionar `/billing`** à navegação (ou dentro de Configurações)
4. **Remover rota `/reports`** (legacy)
5. **Atualizar Control Center** para mostrar Hiring como subseção de Business
6. **Revisar landing page** para posicionar como "Nello Business" (não apenas Hiring)

---

## 6. ADMIN VISIBILITY

### O que o Admin Global pode ver hoje

| Métrica | Fonte | Visível no Control Center? |
|---------|-------|---------------------------|
| Empresas ativas | `companies` | ✅ Sim |
| Vagas abertas | `job_postings` | ❌ Não |
| Candidatos avaliados | `hiring_candidates` | ❌ Não |
| Volume de assessments | `hiring_assessments` | ❌ Não |
| Uso corporativo do Identity | `user_tests` via `company_users` | ❌ Não |
| Subscriptions ativas | `company_subscriptions` | ✅ Sim |
| Colaboradores mapeados | `company_users` | ✅ Sim |

### Métricas Hiring Ausentes no Control Center

```
Métricas a adicionar futuramente:
- total_vagas_abertas          → COUNT(job_postings WHERE status = 'published')
- total_candidatos             → COUNT(hiring_candidates)
- assessments_completos        → COUNT(hiring_assessments WHERE status = 'completed')
- assessments_em_andamento     → COUNT(hiring_assessments WHERE status = 'in_progress')
- taxa_conclusao_assessments   → completed / total
- candidatos_com_match         → COUNT(hiring_candidates WHERE match_result IS NOT NULL)
```

---

## 7. RESULTADO ESPERADO

### Modelo Arquitetural Final

```
┌─────────────────────────────────────────────────┐
│              NELLO ONE ECOSYSTEM                │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌─── CORE PLATFORM ──────────────────────┐    │
│  │                                         │    │
│  │  Identity (Motor Comportamental)        │    │
│  │    └─ DISC, Temperamentos, Nello16...   │    │
│  │                                         │    │
│  │  Business (Hub Corporativo) ◄── CENTRAL │    │
│  │    ├─ Dashboard Empresa                 │    │
│  │    ├─ Equipe & Colaboradores            │    │
│  │    ├─ Hiring (Recrutamento) ◄── SUB     │    │
│  │    │    ├─ Vagas                         │    │
│  │    │    ├─ Candidatos                    │    │
│  │    │    └─ Avaliações (DISC+Temp)        │    │
│  │    ├─ Insights Organizacionais          │    │
│  │    ├─ Billing                           │    │
│  │    └─ Configurações                     │    │
│  │                                         │    │
│  │  Praxis (Acompanhamento Profissional)   │    │
│  │    └─ Operadores, Clientes, Sessões     │    │
│  │                                         │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  ┌─── VERTICAL PRODUCTS ──────────────────┐    │
│  │  Discernir (Pastoral)                   │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Princípios Confirmados

| Princípio | Descrição |
|-----------|-----------|
| **Business = Hub Corporativo** | Único ponto de entrada para empresas |
| **Hiring = Submódulo do Business** | Sem autonomia de auth, billing ou routing |
| **Identity = Motor Invisível** | Fornece testes e scoring, não é acessado diretamente por empresas |
| **Hiring = Porta do Identity** | Candidatos entram no ecossistema Identity via avaliação corporativa |
| **Sem subdomínio Hiring** | `hiring.nello.one` descartado permanentemente |

### Lacunas Arquiteturais (por prioridade)

| # | Lacuna | Impacto |
|---|--------|---------|
| 1 | Transição candidato → colaborador Identity | **Crítico** — dados de avaliação ficam isolados |
| 2 | Métricas Hiring no Control Center | **Médio** — admin não tem visibilidade de recrutamento |
| 3 | Navegação fragmentada (3 itens para Hiring) | **Médio** — UX confusa |
| 4 | Landing page focada em Hiring, não em Business | **Baixo** — posicionamento de marca |
| 5 | Rota `/team` ausente do menu | **Baixo** — funcionalidade oculta |

### Status: NENHUMA alteração de código realizada

Este documento é exclusivamente analítico e de posicionamento arquitetural. Nenhum código, tabela ou configuração foi modificado.

---

*Gerado em 2026-02-22 — Reestruturação Arquitetural Business & Hiring*
