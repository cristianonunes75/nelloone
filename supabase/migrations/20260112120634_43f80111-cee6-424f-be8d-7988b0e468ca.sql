-- Create business_health_alerts table
CREATE TABLE public.business_health_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('critical', 'warning', 'positive')),
  title TEXT NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'acknowledged', 'resolved')),
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.business_health_alerts ENABLE ROW LEVEL SECURITY;

-- Only super_admin can view alerts (no one else)
CREATE POLICY "Super admins can view all health alerts"
ON public.business_health_alerts
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.admin_permissions
    WHERE user_id = auth.uid()
    AND permission_level = 'super_admin'
  )
);

-- Super admins can update alerts (mark as resolved, etc)
CREATE POLICY "Super admins can update health alerts"
ON public.business_health_alerts
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.admin_permissions
    WHERE user_id = auth.uid()
    AND permission_level = 'super_admin'
  )
);

-- System/edge functions can insert alerts (no auth check needed for system inserts)
CREATE POLICY "System can insert health alerts"
ON public.business_health_alerts
FOR INSERT
WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX idx_health_alerts_company ON public.business_health_alerts(company_id);
CREATE INDEX idx_health_alerts_status ON public.business_health_alerts(status);
CREATE INDEX idx_health_alerts_severity ON public.business_health_alerts(severity);
CREATE INDEX idx_health_alerts_created ON public.business_health_alerts(created_at DESC);

-- Add trigger for updated_at
CREATE TRIGGER update_business_health_alerts_updated_at
BEFORE UPDATE ON public.business_health_alerts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();