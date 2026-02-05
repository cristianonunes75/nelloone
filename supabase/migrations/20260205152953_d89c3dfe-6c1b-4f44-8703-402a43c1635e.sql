-- Create account_deletion_logs table for LGPD compliance
CREATE TABLE public.account_deletion_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  user_email TEXT,
  deleted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'completed',
  ip_address TEXT,
  user_agent TEXT
);

-- Add comment for documentation
COMMENT ON TABLE public.account_deletion_logs IS 'Audit log for account deletions (LGPD compliance). Does not store sensitive content.';

-- Enable RLS
ALTER TABLE public.account_deletion_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can read deletion logs (for audit purposes)
CREATE POLICY "Only admins can view deletion logs"
ON public.account_deletion_logs
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Service role can insert (from edge function)
CREATE POLICY "Service role can insert deletion logs"
ON public.account_deletion_logs
FOR INSERT
WITH CHECK (true);