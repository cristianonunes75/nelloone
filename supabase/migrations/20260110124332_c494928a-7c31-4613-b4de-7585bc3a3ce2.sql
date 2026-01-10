-- =====================================================
-- BUSINESS TRIAL & LIMITS ENFORCEMENT
-- Add trial tracking and automatic expiration detection
-- =====================================================

-- Add trial_ends_at to company_subscriptions if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'company_subscriptions' 
    AND column_name = 'trial_ends_at'
  ) THEN
    ALTER TABLE public.company_subscriptions 
    ADD COLUMN trial_ends_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '14 days');
  END IF;
END $$;

-- Create company_status_history table for audit trail
CREATE TABLE IF NOT EXISTS public.company_status_history (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    previous_status TEXT,
    new_status TEXT NOT NULL,
    reason TEXT,
    changed_by UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on status history
ALTER TABLE public.company_status_history ENABLE ROW LEVEL SECURITY;

-- Only super_admins and company admins can view history for their company
CREATE POLICY "Admins can view company status history"
    ON public.company_status_history
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.company_users cu
            WHERE cu.user_id = auth.uid()
            AND cu.company_id = company_status_history.company_id
            AND cu.role IN ('company_admin', 'super_admin')
        )
    );

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_company_status_history_company 
    ON public.company_status_history(company_id, created_at DESC);

-- Function to log status changes
CREATE OR REPLACE FUNCTION log_company_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO public.company_status_history (
            company_id, 
            previous_status, 
            new_status, 
            reason
        )
        VALUES (
            NEW.company_id,
            OLD.status,
            NEW.status,
            CASE 
                WHEN NEW.status = 'trial_expired' THEN 'Trial expirado automaticamente'
                WHEN NEW.status = 'active' THEN 'Assinatura ativada'
                WHEN NEW.status = 'cancelled' THEN 'Assinatura cancelada'
                ELSE 'Mudança de status'
            END
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS trigger_log_company_status_change ON public.company_subscriptions;
CREATE TRIGGER trigger_log_company_status_change
    AFTER UPDATE ON public.company_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION log_company_status_change();

-- Enable realtime for company_subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE public.company_subscriptions;