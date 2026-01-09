
-- =====================================================
-- NELLO ONE BUSINESS MODULE - DATABASE SCHEMA
-- =====================================================

-- Enum for business user roles
CREATE TYPE public.business_role AS ENUM ('super_admin', 'company_admin', 'collaborator');

-- Enum for invite status
CREATE TYPE public.invite_status AS ENUM ('pending', 'accepted', 'expired', 'revoked');

-- Enum for company subscription status  
CREATE TYPE public.company_subscription_status AS ENUM ('trialing', 'active', 'past_due', 'canceled', 'incomplete');

-- =====================================================
-- COMPANIES TABLE
-- =====================================================
CREATE TABLE public.companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  website TEXT,
  industry TEXT,
  employee_count_range TEXT, -- '1-10', '11-50', '51-200', '201-500', '500+'
  
  -- Billing
  billing_email TEXT,
  stripe_customer_id TEXT,
  
  -- Settings
  settings JSONB DEFAULT '{}'::jsonb,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID
);

-- Enable RLS
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- COMPANY SUBSCRIPTIONS TABLE
-- =====================================================
CREATE TABLE public.company_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  
  -- Stripe
  stripe_subscription_id TEXT,
  status public.company_subscription_status DEFAULT 'incomplete',
  
  -- Plan details
  plan_tier TEXT DEFAULT 'starter', -- 'starter', 'growth', 'enterprise'
  max_collaborators INTEGER DEFAULT 10,
  current_collaborators INTEGER DEFAULT 0,
  
  -- Pricing (stored for reference)
  price_per_collaborator NUMERIC(10,2) DEFAULT 49.90,
  discount_percent INTEGER DEFAULT 0,
  
  -- Period
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  trial_ends_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.company_subscriptions ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- COMPANY USERS TABLE (links users to companies with roles)
-- =====================================================
CREATE TABLE public.company_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role public.business_role NOT NULL DEFAULT 'collaborator',
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  -- Consent for collaborators
  consent_given BOOLEAN DEFAULT false,
  consent_given_at TIMESTAMP WITH TIME ZONE,
  consent_text_version TEXT, -- Track which version of consent text was agreed to
  
  -- Onboarding
  onboarding_completed BOOLEAN DEFAULT false,
  onboarding_completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Privacy settings
  share_report_with_company BOOLEAN DEFAULT false, -- If true, company can see detailed report
  
  -- Metadata
  invited_by UUID,
  joined_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Unique constraint: one user per company
  UNIQUE(company_id, user_id)
);

ALTER TABLE public.company_users ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- COMPANY INVITES TABLE
-- =====================================================
CREATE TABLE public.company_invites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  
  -- Invite details
  email TEXT NOT NULL,
  role public.business_role NOT NULL DEFAULT 'collaborator',
  invite_token TEXT UNIQUE NOT NULL,
  
  -- Status
  status public.invite_status DEFAULT 'pending',
  
  -- Tracking
  sent_at TIMESTAMP WITH TIME ZONE,
  accepted_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '7 days'),
  
  -- Who invited
  invited_by UUID NOT NULL,
  
  -- If accepted, which user accepted
  accepted_by UUID REFERENCES public.profiles(id),
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.company_invites ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- COMPANY TEAM INSIGHTS TABLE (aggregated, non-identifying data)
-- =====================================================
CREATE TABLE public.company_team_insights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  
  -- Aggregated data (anonymous)
  total_members INTEGER DEFAULT 0,
  completed_assessments INTEGER DEFAULT 0,
  
  -- Distribution data (percentages, no individual identification)
  temperament_distribution JSONB DEFAULT '{}'::jsonb,
  disc_distribution JSONB DEFAULT '{}'::jsonb,
  enneagram_distribution JSONB DEFAULT '{}'::jsonb,
  communication_styles JSONB DEFAULT '{}'::jsonb,
  
  -- Team insights (aggregated patterns)
  team_strengths JSONB DEFAULT '[]'::jsonb,
  team_growth_areas JSONB DEFAULT '[]'::jsonb,
  conflict_risk_areas JSONB DEFAULT '[]'::jsonb,
  leadership_potential_indicators JSONB DEFAULT '{}'::jsonb,
  
  -- Recommendations
  management_recommendations JSONB DEFAULT '[]'::jsonb,
  team_building_suggestions JSONB DEFAULT '[]'::jsonb,
  
  -- Last calculation
  last_calculated_at TIMESTAMP WITH TIME ZONE,
  calculation_member_count INTEGER, -- How many members were included in calculation
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(company_id)
);

ALTER TABLE public.company_team_insights ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- BUSINESS PRICING TIERS TABLE
-- =====================================================
CREATE TABLE public.business_pricing_tiers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Tier definition
  min_collaborators INTEGER NOT NULL,
  max_collaborators INTEGER, -- NULL means unlimited
  
  -- Pricing
  price_per_collaborator NUMERIC(10,2) NOT NULL,
  discount_percent INTEGER DEFAULT 0,
  
  -- Stripe
  stripe_price_id_brl TEXT,
  stripe_price_id_usd TEXT,
  stripe_price_id_eur TEXT,
  
  -- Display
  tier_name TEXT NOT NULL,
  tier_description TEXT,
  is_featured BOOLEAN DEFAULT false,
  
  -- Active
  is_active BOOLEAN DEFAULT true,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.business_pricing_tiers ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- COMPANY AUDIT LOG TABLE
-- =====================================================
CREATE TABLE public.company_audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  
  -- Action details
  action TEXT NOT NULL,
  actor_id UUID,
  target_user_id UUID,
  
  -- Data
  details JSONB DEFAULT '{}'::jsonb,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address TEXT,
  user_agent TEXT
);

ALTER TABLE public.company_audit_logs ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Companies: Admins of the company can view/edit
CREATE POLICY "Company admins can view their company"
  ON public.companies FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.company_users
      WHERE company_users.company_id = companies.id
      AND company_users.user_id = auth.uid()
      AND company_users.role IN ('company_admin', 'super_admin')
    )
    OR
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

CREATE POLICY "Company admins can update their company"
  ON public.companies FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.company_users
      WHERE company_users.company_id = companies.id
      AND company_users.user_id = auth.uid()
      AND company_users.role IN ('company_admin', 'super_admin')
    )
  );

CREATE POLICY "Super admin can manage all companies"
  ON public.companies FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Company Users: View based on role
CREATE POLICY "Company members can view fellow members basic info"
  ON public.company_users FOR SELECT
  USING (
    company_id IN (
      SELECT cu.company_id FROM public.company_users cu
      WHERE cu.user_id = auth.uid()
    )
  );

CREATE POLICY "Company admins can manage members"
  ON public.company_users FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.company_users cu
      WHERE cu.company_id = company_users.company_id
      AND cu.user_id = auth.uid()
      AND cu.role IN ('company_admin', 'super_admin')
    )
    OR
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Company Invites
CREATE POLICY "Company admins can manage invites"
  ON public.company_invites FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.company_users
      WHERE company_users.company_id = company_invites.company_id
      AND company_users.user_id = auth.uid()
      AND company_users.role IN ('company_admin', 'super_admin')
    )
    OR
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Allow anyone to read their invite by token (for accepting)
CREATE POLICY "Anyone can view invites by token"
  ON public.company_invites FOR SELECT
  USING (true);

-- Company Subscriptions
CREATE POLICY "Company admins can view subscription"
  ON public.company_subscriptions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.company_users
      WHERE company_users.company_id = company_subscriptions.company_id
      AND company_users.user_id = auth.uid()
      AND company_users.role IN ('company_admin', 'super_admin')
    )
    OR
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

CREATE POLICY "Super admin can manage all subscriptions"
  ON public.company_subscriptions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Team Insights: Only company admins can view
CREATE POLICY "Company admins can view team insights"
  ON public.company_team_insights FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.company_users
      WHERE company_users.company_id = company_team_insights.company_id
      AND company_users.user_id = auth.uid()
      AND company_users.role IN ('company_admin', 'super_admin')
    )
    OR
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

CREATE POLICY "System can update team insights"
  ON public.company_team_insights FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Pricing Tiers: Public read, admin write
CREATE POLICY "Anyone can view pricing tiers"
  ON public.business_pricing_tiers FOR SELECT
  USING (is_active = true);

CREATE POLICY "Super admin can manage pricing tiers"
  ON public.business_pricing_tiers FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Audit Logs
CREATE POLICY "Company admins can view audit logs"
  ON public.company_audit_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.company_users
      WHERE company_users.company_id = company_audit_logs.company_id
      AND company_users.user_id = auth.uid()
      AND company_users.role IN ('company_admin', 'super_admin')
    )
    OR
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

CREATE POLICY "System can insert audit logs"
  ON public.company_audit_logs FOR INSERT
  WITH CHECK (true);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX idx_company_users_company_id ON public.company_users(company_id);
CREATE INDEX idx_company_users_user_id ON public.company_users(user_id);
CREATE INDEX idx_company_invites_token ON public.company_invites(invite_token);
CREATE INDEX idx_company_invites_email ON public.company_invites(email);
CREATE INDEX idx_company_subscriptions_company ON public.company_subscriptions(company_id);
CREATE INDEX idx_companies_slug ON public.companies(slug);

-- =====================================================
-- TRIGGER FOR UPDATED_AT
-- =====================================================
CREATE OR REPLACE FUNCTION public.update_business_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW EXECUTE FUNCTION public.update_business_updated_at();

CREATE TRIGGER update_company_users_updated_at
  BEFORE UPDATE ON public.company_users
  FOR EACH ROW EXECUTE FUNCTION public.update_business_updated_at();

CREATE TRIGGER update_company_invites_updated_at
  BEFORE UPDATE ON public.company_invites
  FOR EACH ROW EXECUTE FUNCTION public.update_business_updated_at();

CREATE TRIGGER update_company_subscriptions_updated_at
  BEFORE UPDATE ON public.company_subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_business_updated_at();

CREATE TRIGGER update_company_team_insights_updated_at
  BEFORE UPDATE ON public.company_team_insights
  FOR EACH ROW EXECUTE FUNCTION public.update_business_updated_at();

CREATE TRIGGER update_business_pricing_tiers_updated_at
  BEFORE UPDATE ON public.business_pricing_tiers
  FOR EACH ROW EXECUTE FUNCTION public.update_business_updated_at();

-- =====================================================
-- INSERT DEFAULT PRICING TIERS
-- =====================================================
INSERT INTO public.business_pricing_tiers (tier_name, tier_description, min_collaborators, max_collaborators, price_per_collaborator, discount_percent, is_featured) VALUES
  ('Starter', 'Ideal para equipes pequenas', 1, 10, 49.90, 0, false),
  ('Growth', 'Desconto progressivo para equipes em crescimento', 11, 30, 44.91, 10, true),
  ('Business', 'Melhor custo-benefício para empresas', 31, 100, 39.92, 20, false),
  ('Enterprise', 'Preço customizado e suporte dedicado', 101, NULL, 34.93, 30, false);

-- =====================================================
-- ADD BUSINESS ROLE TO user_roles enum if not exists
-- =====================================================
-- Note: The business roles are managed via company_users table, not user_roles
