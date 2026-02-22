# PRAXIS DOMAIN UNIFICATION REPORT

**Date:** 2026-02-22  
**Status:** ✅ Completed  
**Author:** Lovable AI

---

## Objective

Unify the professional domain under `operator_workspaces` as the single source of truth, deprecating `professional_*` tables without deleting them.

---

## Changes Executed

### 1. Source of Truth Established

`operator_workspaces` is now the **canonical entity** for professional identity in Nello Praxis.

### 2. Deprecated Tables (NOT deleted)

| Table | Status | Reason |
|---|---|---|
| `professional_profiles` | 🔴 DEPRECATED | Superseded by `operator_workspaces` |
| `professional_financial_records` | 🔴 DEPRECATED | No replacement yet; financial domain to be redesigned |
| `professional_clients` | 🟡 IN USE (semantic change) | `professional_id` now maps to `operator_workspaces.id` |

### 3. UI/Service Dependencies Removed

| File | Change |
|---|---|
| `usePraxisAuth.tsx` | Rewritten as compatibility shim over `useOperatorWorkspace` |
| `usePraxisClients.tsx` | Now uses `workspace.id` from `useOperatorWorkspace` |
| `PraxisClientDetail.tsx` | Replaced `professionalProfile` with `workspace` |
| `PraxisDashboard.tsx` | Removed `usePraxisAuth` import; uses `useOperatorWorkspace` only |
| `PraxisOnboarding.tsx` | Still uses `usePraxisAuth` (compatibility shim, delegates to operator) |
| `useOperatorWorkspace.tsx` | Removed `professional_profiles` lookup from `createWorkspace` |
| `BusinessApp.tsx` | Removed `PraxisAuthProvider` wrapper; only `OperatorProvider` remains |

### 4. No Code Writes to `professional_*`

After this change, **zero application code** directly reads or writes to:
- `professional_profiles`
- `professional_financial_records`

The `professional_clients` table is still used for data but accessed through the operator identity.

### 5. Documentation Created

- `docs/praxis/DOMAIN_MIGRATION.md` — Technical migration guide with rules for new code

---

## Architecture After Unification

```
┌─────────────────────────────────────┐
│         OperatorProvider            │
│  (useOperatorWorkspace context)     │
│                                     │
│  ┌─────────────┐ ┌───────────────┐  │
│  │  workspace   │ │ methodologies │  │
│  │  (identity)  │ │  (methods)    │  │
│  └──────┬──────┘ └───────────────┘  │
│         │                           │
│  ┌──────▼──────┐ ┌───────────────┐  │
│  │   clients    │ │    tasks      │  │
│  │ (prof_clients│ │ (op_tasks)    │  │
│  │  table)      │ └───────────────┘  │
│  └──────┬──────┘                    │
│         │         ┌───────────────┐  │
│  ┌──────▼──────┐ │  reflections  │  │
│  │  sessions    │ │ (op_reflect)  │  │
│  │ (client_sess)│ └───────────────┘  │
│  └─────────────┘                    │
└─────────────────────────────────────┘
```

---

## Deprecated Tables (still in DB)

```
┌──────────────────────────┐
│  ⚠️ DEPRECATED           │
│                          │
│  professional_profiles   │  → Use operator_workspaces
│  professional_financial  │  → To be redesigned
│  _records                │
└──────────────────────────┘
```

---

## Remaining Work (Future)

1. **Data migration**: Move existing `professional_profiles` records into `operator_workspaces`
2. **Column rename**: `professional_id` → `operator_id` in `professional_clients` and `client_sessions`
3. **Table rename**: `professional_clients` → `operator_clients`
4. **Financial redesign**: Create `operator_financial_records` with proper operator domain semantics
5. **Drop deprecated tables**: After confirming zero usage in production

---

## Verification

- ✅ No UI component reads from `professional_profiles` directly
- ✅ No service writes to `professional_profiles`
- ✅ `PraxisAuthProvider` is now a no-op passthrough
- ✅ `OperatorProvider` is the sole identity provider for Praxis routes
- ✅ `usePraxisAuth` compatibility shim delegates to `useOperatorWorkspace`
