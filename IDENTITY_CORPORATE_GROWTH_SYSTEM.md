# IDENTITY CORPORATE GROWTH SYSTEM - Implementation Report

## Summary
Implemented the organic growth system for Identity Corporate within Nello Business,
including organizational impact dashboard, executive reporting, company badges,
referral system, and operator notification.

## 1. Impacto Organizacional Tab

### Location
`BusinessDashboard` → Tab "Impacto Organizacional"

### Sub-tabs
- **Evolução**: Team evolution metrics (members, assessments, adoption rate, strengths)
- **Comportamento**: Aggregated DISC, Temperament, Communication styles distributions
- **Cultura**: Leadership potential indicators, team building suggestions, conflict risk areas, company badges
- **Alertas**: Organizational health alerts with severity levels

### Component
`src/apps/business/components/OrganizationalImpactTab.tsx`

### Data Source
Reuses `useTeamInsights` hook → `company_team_insights` table (aggregated, LGPD compliant)

---

## 2. Executive Report Generation

### Edge Function: `generate-executive-report`
- **Input**: `{ company_id }`
- **Authentication**: Requires company admin or Nello admin
- **Output**: Aggregated report data + shareable public link
- **No individual data exposed** - only distributions, counts, and recommendations

### Report Contains
- Company summary (name, industry)
- Behavioral profile (DISC, Temperament, Communication distributions)
- Organizational health (strengths, growth areas, conflict risks)
- Management and team building recommendations
- License information (seats, status)

### Shareable Link
- Generated via `company_executive_reports` table
- `public_token` UUID for external access
- 30-day expiry by default
- Can be deactivated by admin

### Branding
All reports branded as "Identity Corporate" per product identity.

---

## 3. Company Badges

### Database Table: `company_badges`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| company_id | UUID | FK to companies |
| badge_type | TEXT | Badge category (e.g., `identity_corporate`) |
| badge_name | TEXT | Display name |
| description | TEXT | Badge description |
| awarded_at | TIMESTAMPTZ | When badge was granted |
| is_active | BOOLEAN | Whether badge is visible |
| metadata | JSONB | Additional data (asset URLs, etc.) |

### Initial Badge
- **Name**: "Empresa Desenvolvida com Identity Corporate"
- **Type**: `identity_corporate`
- Displayed in the Culture sub-tab of Impacto Organizacional

### RLS
- Company members can view their own badges
- Only admins can manage badges

---

## 4. Company Referrals

### Database Table: `company_referrals`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| referring_company_id | UUID | FK to companies |
| referred_company_name | TEXT | Name of referred company |
| contact_email | TEXT | Contact email |
| contact_name | TEXT | Contact person name |
| contact_phone | TEXT | Contact phone |
| operator_id | UUID | FK to operator_workspaces |
| referred_by | UUID | User who created referral |
| status | TEXT | pending / contacted / converted |
| notes | TEXT | Additional notes |
| operator_notified_at | TIMESTAMPTZ | When operator was notified |
| converted_at | TIMESTAMPTZ | When referral converted |
| converted_company_id | UUID | FK to companies (if converted) |

### UI Component
`src/apps/business/components/CompanyReferralsSection.tsx`
- Form to create referral (company name, contact, email, notes)
- List of sent referrals with status badges
- Automatically links operator_id from company's active operator

### RLS
- Company admins can manage their referrals
- Operators can view referrals assigned to them
- Nello admins have full access

---

## 5. Operator Notification

### Edge Function: `notify-operator-referral`
- **Trigger**: When a company admin creates a referral
- **Action**: 
  1. Finds operator linked to the referring company
  2. Sends email via Resend (if configured)
  3. Updates `operator_notified_at` on the referral
  4. Logs to `admin_notification_logs`

### Email Content
- Referring company name
- Referred company name and contact info
- Call to action to access operator panel

---

## 6. Database Tables Created

### `company_executive_reports`
- Stores generated executive reports
- Public token for external sharing
- Expiry date for security
- RLS: Company admins + public read via token

### `company_badges`
- Company achievement badges
- RLS: Company members read, admins manage

### `company_referrals`
- B2B referral tracking
- RLS: Company admins manage, operators view their assignments

### Indexes
- `idx_company_executive_reports_company` (company_id)
- `idx_company_executive_reports_token` (public_token)
- `idx_company_badges_company` (company_id)
- `idx_company_referrals_referring` (referring_company_id)
- `idx_company_referrals_operator` (operator_id)

---

## 7. Security

- All report data is aggregated - no individual PII exposed
- Executive reports require admin authentication
- Public links have UUID tokens and expiry dates
- Referrals respect company isolation via RLS
- Operator notifications logged for audit trail
- All access logged to `company_audit_logs`

---

## 8. Growth Loop

```
Company uses Identity Corporate
  → Team completes assessments
  → Organizational Impact dashboard shows value
  → Admin generates Executive Report (shareable)
  → Admin refers other companies
  → Operator is notified of referral
  → New company onboards
  → Badge awarded to referring company
  → Cycle repeats
```

## Files Created
- `src/apps/business/components/OrganizationalImpactTab.tsx`
- `src/apps/business/components/CompanyReferralsSection.tsx`
- `supabase/functions/generate-executive-report/index.ts`
- `supabase/functions/notify-operator-referral/index.ts`
- `IDENTITY_CORPORATE_GROWTH_SYSTEM.md`

## Files Modified
- `src/apps/business/pages/BusinessDashboard.tsx` (added Impacto Organizacional tab + Referrals)
