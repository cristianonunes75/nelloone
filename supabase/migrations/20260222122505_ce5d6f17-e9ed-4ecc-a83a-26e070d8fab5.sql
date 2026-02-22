
-- Add operator_id to company_subscriptions for tracking the selling operator
ALTER TABLE public.company_subscriptions
  ADD COLUMN IF NOT EXISTS operator_id uuid REFERENCES public.operator_workspaces(id),
  ADD COLUMN IF NOT EXISTS seats_total integer DEFAULT 10,
  ADD COLUMN IF NOT EXISTS seats_used integer DEFAULT 0;

-- Add index for operator lookups
CREATE INDEX IF NOT EXISTS idx_company_subscriptions_operator_id ON public.company_subscriptions(operator_id);

-- RLS policies for company_subscriptions already exist, no changes needed
