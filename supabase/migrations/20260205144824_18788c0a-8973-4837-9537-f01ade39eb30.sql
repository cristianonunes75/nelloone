-- Create compliance_audits table for linguistic audit logs
CREATE TABLE public.compliance_audits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  page_or_component TEXT NOT NULL,
  detected_term TEXT NOT NULL,
  original_text TEXT,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('critical', 'moderate', 'safe')),
  suggested_fix TEXT,
  status TEXT NOT NULL DEFAULT 'blocked' CHECK (status IN ('blocked', 'resolved', 'ignored')),
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.compliance_audits ENABLE ROW LEVEL SECURITY;

-- Allow admins to view and manage compliance audits
CREATE POLICY "Admins can view compliance audits"
ON public.compliance_audits
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.admin_permissions
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Admins can insert compliance audits"
ON public.compliance_audits
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can update compliance audits"
ON public.compliance_audits
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.admin_permissions
    WHERE user_id = auth.uid()
  )
);

-- Create index for faster queries
CREATE INDEX idx_compliance_audits_timestamp ON public.compliance_audits(timestamp DESC);
CREATE INDEX idx_compliance_audits_risk_level ON public.compliance_audits(risk_level);
CREATE INDEX idx_compliance_audits_status ON public.compliance_audits(status);