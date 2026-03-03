

## Audit Results

Here's exactly what's **NOT done yet** from the pending tasks:

### 1. Dashboard executive cards are NOT clickable
The 4 executive cards (Health Index, eNPS, Climate, Adherence) at lines 588-603 are plain `<Card>` components with no `<Link>` wrapping. They should link to `/people-strategy`.

### 2. Stale links pointing to old routes
- **Line 211**: `<Link to="/invite">` in `ExecutiveEmptyState` -- should be `/team?tab=invite`
- **Line 666**: `<Link to="/hiring">` in the Recruitment section -- should be `/candidates`
- **Line 368**: Checklist step link `/invite` -- should be `/team?tab=invite`
- **`TeamMembersSection.tsx` lines 173, 191**: `<Link to="/invite">` -- should be `/team?tab=invite`
- **`JourneyChecklist.tsx` line 39**: link `/invite` -- should be `/team?tab=invite`

### 3. Unused imports in BusinessApp.tsx
- `BusinessInvite` (line 9) -- `/invite` now redirects, import unused
- `BusinessHiring` (line 13) -- `/hiring` now redirects, import unused

---

## Plan

### Task A: Wrap executive cards with links to People Strategy
Wrap each of the 4 cards (`HealthIndexCard`, `ENPSCard`, `ClimateCard`, `AdherenceCard`) in `<Link to="/people-strategy">` with hover styling (`hover:border-primary/50 transition-colors cursor-pointer`) and a subtle arrow indicator.

### Task B: Fix all stale internal links
In `BusinessDashboard.tsx`:
- Line 211: `/invite` → `/team?tab=invite`
- Line 666: `/hiring` → `/candidates`
- Line 368: `/invite` → `/team?tab=invite`

In `TeamMembersSection.tsx`:
- Lines 173, 191: `/invite` → `/team?tab=invite`

In `JourneyChecklist.tsx`:
- Line 39: `/invite` → `/team?tab=invite`

### Task C: Remove unused imports in BusinessApp.tsx
Remove `BusinessInvite` (line 9) and `BusinessHiring` (line 13) imports.

