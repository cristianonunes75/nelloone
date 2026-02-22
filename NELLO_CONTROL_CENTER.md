# NELLO CONTROL CENTER - Implementation Report

## Summary
Centralized monitoring dashboard for the entire Nello One ecosystem (Identity, Praxis, Business, Discernir).

## Route
- **Path**: `/admin/control-center`
- **Access**: `super_admin` only (via `AdminGuard`)
- **Sidebar**: First item in MÉTRICAS section

## Dashboard Sections

### 1. USUÁRIOS (Identity)
| Metric | Source |
|--------|--------|
| total_users | `profiles` count |
| novos_usuarios_7d | `profiles` created_at >= 7 days ago |
| codigos_essencia_ativados | `ativacao_codigo` count |
| usuarios_ativos | `user_tests` completed count |

### 2. OPERADORES (Praxis)
| Metric | Source |
|--------|--------|
| operadores_ativos | `operator_workspaces` is_active=true |
| clientes_por_operador | `client_operator_relationships` / operators |
| empresas_por_operador | `company_operators` active count |
| programas_ativos | `company_programs` active count |

### 3. EMPRESAS (Business)
| Metric | Source |
|--------|--------|
| companies_total | `companies` count |
| colaboradores_mapeados | `company_users` active count |
| subscriptions_ativas | `company_subscriptions` active |
| renovações_proximas | `company_subscriptions` expiring in 30d |

### 4. FINANCEIRO
| Metric | Source |
|--------|--------|
| MRR_individual | `test_purchases` current month |
| MRR_corporate | `company_subscriptions` price × collaborators |
| receita_total | `test_purchases` all-time |
| churn_rate | cancelled / (active + cancelled) |

### 5. SISTEMA
| Metric | Source |
|--------|--------|
| feature_flags_status | `app_settings` feature_* |
| uso_IA_estimado | Placeholder (requires analytics) |
| erros_recent | Placeholder (requires log analysis) |
| módulos_ativos | Dynamic detection |

## Service
`src/services/getEcosystemMetrics.ts`
- Aggregates data across all modules
- Does NOT alter any existing table structures
- All queries are read-only SELECT/COUNT
- No individual data exposed

## UI Design
- **Style**: Command Center / Mission Control
- Monochrome metric cards with subtle accent glows
- Module status indicators with color-coded dots
- Real-time refresh button
- Responsive grid: 4 columns on desktop, 2 on mobile

## Files Created
- `src/components/admin/AdminControlCenter.tsx` — Main dashboard component
- `src/services/getEcosystemMetrics.ts` — Data aggregation service
- `NELLO_CONTROL_CENTER.md` — This documentation

## Files Modified
- `src/pages/Admin.tsx` — Added route with AdminGuard
- `src/components/admin/AdminSidebar.tsx` — Added Control Center nav item

## Security
- Protected by `AdminGuard isSuperAdminOnly`
- No write operations
- No individual user data exposed
- All data is aggregated counts and sums
