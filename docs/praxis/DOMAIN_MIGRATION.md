# Nello Praxis — Domain Migration Guide

## Summary

The `professional_*` tables have been **deprecated** in favor of `operator_*` tables as the source of truth for the Praxis professional domain.

## Why?

The original implementation created two parallel identity systems for professionals:

1. **`professional_profiles`** — Legacy table from the initial Praxis MVP
2. **`operator_workspaces`** — New canonical table for the Operator domain

This caused:
- Duplicate identity resolution (which ID represents the professional?)
- Unclear ownership of clients and sessions
- Fragile joins between two systems that should be one

## Migration Map

| Deprecated (professional_*) | Replaced By (operator_*) | Notes |
|---|---|---|
| `professional_profiles` | `operator_workspaces` | Source of truth for professional identity |
| `professional_clients` | — | Still in use for data storage; `professional_id` now maps to `operator_workspaces.id` |
| `professional_financial_records` | — | Deprecated, no replacement yet. Financial tracking to be redesigned. |

## Tables NOT Deleted

The following tables remain in the database but are **deprecated**:

- `professional_profiles` — No new code should read/write to this table
- `professional_financial_records` — No new code should reference this table

The `professional_clients` table is still actively used but its `professional_id` foreign key now semantically points to `operator_workspaces.id`.

## Code Changes

### Hooks

| Before | After |
|---|---|
| `usePraxisAuth()` → reads `professional_profiles` | `useOperatorWorkspace()` → reads `operator_workspaces` |
| `usePraxisClients()` → uses `professionalProfile.id` | `usePraxisClients()` → uses `workspace.id` |
| `usePraxisSessions()` → uses `professionalProfile.id` | `usePraxisSessions()` → uses `workspace.id` |

### Compatibility Layer

`usePraxisAuth.tsx` now exports a **deprecated compatibility shim** that maps `useOperatorWorkspace` to the old `professionalProfile` shape. This allows any remaining consumers to work without immediate changes but should be migrated.

### Provider Chain

**Before:**
```
PraxisAuthProvider → OperatorProvider → Routes
```

**After:**
```
OperatorProvider → Routes
```

`PraxisAuthProvider` is now a no-op passthrough.

## Rules for New Code

1. **NEVER** import from `professional_profiles` directly
2. **NEVER** write to `professional_financial_records`
3. **ALWAYS** use `useOperatorWorkspace()` for professional identity
4. **ALWAYS** use `workspace.id` as the operator/professional identifier
5. The `professional_clients.professional_id` column holds the `operator_workspaces.id` value

## Future Steps

- [ ] Migrate existing `professional_profiles` data into `operator_workspaces`
- [ ] Drop `professional_profile_id` column from `operator_workspaces`
- [ ] Redesign financial tracking under the operator domain
- [ ] Rename `professional_clients` to `operator_clients` (requires migration)
- [ ] Rename `professional_id` columns to `operator_id` across all tables
