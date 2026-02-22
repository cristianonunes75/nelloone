# CORPORATE IDENTITY LICENSE - Implementation Report

## Summary
Implemented per-seat corporate licensing for Nello Identity using the existing Stripe integration.

## Stripe Product
- **Product**: Identity Corporate License (`prod_U1f2EgCZazEoN9`)
- **Price**: R$49/seat/mês (`price_1T3biVDjhZZxZELMpgu7TGmv`)
- **Model**: Subscription mensal, quantidade = seats

## Database Changes
- Added `operator_id` (FK to `operator_workspaces`) to `company_subscriptions`
- Added `seats_total` (integer, default 10) to `company_subscriptions`
- Added `seats_used` (integer, default 0) to `company_subscriptions`
- Index on `operator_id` for performance

## Edge Functions

### `corporate-identity-checkout`
- Creates Stripe Checkout session with per-seat quantity
- Validates company admin authorization
- Records `operator_id` in subscription metadata for future commission tracking
- Creates/reuses Stripe customer linked to company

### `corporate-identity-manage-seats`
- Upgrades/downgrades seat count on existing subscription
- Validates `newSeats >= seats_used` (cannot reduce below active users)
- Uses Stripe proration for fair billing
- Logs changes to `company_audit_logs`

### `business-check-subscription` (updated)
- Now detects corporate license product (`prod_U1f2EgCZazEoN9`)
- Sets `maxCollaborators` = Stripe subscription quantity (seats)
- Syncs `seats_total` and `seats_used` to `company_subscriptions`

## Frontend

### `useCorporateLicense` Hook
- Fetches seat data from `company_subscriptions`
- Counts actual active `company_users` for real-time accuracy
- Provides `canInvite` flag based on `seatsUsed < seatsTotal`
- Methods: `startCorporateCheckout(seats, operatorId?)`, `updateSeats(newSeats)`

### `useBusinessSubscription` (updated)
- Interface now includes `seatsTotal`, `seatsUsed`, `seatsAvailable`
- Tier type extended with `'corporate'`

### `SeatManagementCard` Component
- Visual seat usage bar with color coding (amber at 80%+)
- Checkout dialog for new licenses with seat selector
- Upgrade/downgrade dialog for existing subscriptions
- Minimum seats enforced = current usage
- Integrated into BusinessDashboard as "Licenças" tab

## Enforcement Flow
1. `business-check-subscription` reads Stripe quantity → `maxCollaborators`
2. `useBusinessEnforcement` computes `isOverLimit` when `currentCollaborators >= maxCollaborators`
3. `CollaboratorLimitWarning` blocks new invites when at limit
4. `SeatManagementCard` shows real-time usage and upgrade path

## Operator Commission Tracking
- `operator_id` stored in `company_subscriptions`
- Passed as metadata in Stripe subscription for future webhook processing
- Enables commission calculation per operator sale

## Security
- Admin-only access enforced in all edge functions
- Operator validated against `operator_workspaces` table
- All seat changes logged to `company_audit_logs`
- RLS policies on `company_subscriptions` maintained
