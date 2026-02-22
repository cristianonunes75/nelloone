
-- Company Executive Reports (shareable links for generated reports)
CREATE TABLE public.company_executive_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  generated_by UUID NOT NULL,
  title TEXT NOT NULL DEFAULT 'Relatório Executivo',
  report_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  public_token UUID DEFAULT gen_random_uuid(),
  is_public_active BOOLEAN DEFAULT false,
  public_expires_at TIMESTAMPTZ,
  pdf_storage_path TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.company_executive_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Company admins can manage executive reports"
  ON public.company_executive_reports FOR ALL
  USING (public.is_company_admin(company_id, auth.uid()) OR public.is_nello_admin(auth.uid()));

CREATE POLICY "Public reports viewable by token"
  ON public.company_executive_reports FOR SELECT
  USING (is_public_active = true AND (public_expires_at IS NULL OR public_expires_at > now()));

-- Company Badges
CREATE TABLE public.company_badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  badge_type TEXT NOT NULL DEFAULT 'identity_corporate',
  badge_name TEXT NOT NULL,
  description TEXT,
  awarded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.company_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Company members can view badges"
  ON public.company_badges FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.company_users WHERE company_id = company_badges.company_id AND user_id = auth.uid() AND is_active = true)
    OR public.is_nello_admin(auth.uid())
  );

CREATE POLICY "Only admins can manage badges"
  ON public.company_badges FOR ALL
  USING (public.is_company_admin(company_id, auth.uid()) OR public.is_nello_admin(auth.uid()));

-- Company Referrals
CREATE TABLE public.company_referrals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  referring_company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  referred_company_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_name TEXT,
  contact_phone TEXT,
  operator_id UUID REFERENCES public.operator_workspaces(id),
  referred_by UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  operator_notified_at TIMESTAMPTZ,
  converted_at TIMESTAMPTZ,
  converted_company_id UUID REFERENCES public.companies(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.company_referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Company admins can manage referrals"
  ON public.company_referrals FOR ALL
  USING (
    public.is_company_admin(referring_company_id, auth.uid()) 
    OR public.is_nello_admin(auth.uid())
  );

CREATE POLICY "Operators can view their referrals"
  ON public.company_referrals FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.operator_workspaces ow 
      WHERE ow.id = company_referrals.operator_id 
      AND ow.user_id = auth.uid()
    )
  );

-- Indexes
CREATE INDEX idx_company_executive_reports_company ON public.company_executive_reports(company_id);
CREATE INDEX idx_company_executive_reports_token ON public.company_executive_reports(public_token);
CREATE INDEX idx_company_badges_company ON public.company_badges(company_id);
CREATE INDEX idx_company_referrals_referring ON public.company_referrals(referring_company_id);
CREATE INDEX idx_company_referrals_operator ON public.company_referrals(operator_id);

-- Triggers for updated_at
CREATE TRIGGER update_company_executive_reports_updated_at
  BEFORE UPDATE ON public.company_executive_reports
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_company_referrals_updated_at
  BEFORE UPDATE ON public.company_referrals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
