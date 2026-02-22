
-- ============================================================
-- PRAXIS-BUSINESS BRIDGE: company_operators, company_programs, company_program_members
-- ============================================================

-- 1) company_operators: links operators to companies
CREATE TABLE public.company_operators (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  operator_workspace_id UUID NOT NULL REFERENCES public.operator_workspaces(id) ON DELETE CASCADE,
  role_in_company TEXT NOT NULL DEFAULT 'operator',
  status TEXT NOT NULL DEFAULT 'active',
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(company_id, operator_workspace_id)
);

-- 2) company_programs: programs an operator runs inside a company
CREATE TABLE public.company_programs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  operator_workspace_id UUID NOT NULL REFERENCES public.operator_workspaces(id) ON DELETE CASCADE,
  program_name TEXT NOT NULL,
  description TEXT,
  methodology_name TEXT,
  start_date DATE,
  end_date DATE,
  status TEXT NOT NULL DEFAULT 'draft',
  max_participants INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3) company_program_members: participants in a program (requires consent)
CREATE TABLE public.company_program_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_program_id UUID NOT NULL REFERENCES public.company_programs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  consent_status TEXT NOT NULL DEFAULT 'pending',
  consent_given_at TIMESTAMPTZ,
  consent_revoked_at TIMESTAMPTZ,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(company_program_id, user_id)
);

-- Enable RLS
ALTER TABLE public.company_operators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_program_members ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- SECURITY DEFINER HELPERS (avoid infinite recursion)
-- ============================================================

-- Check if user is an operator linked to a company
CREATE OR REPLACE FUNCTION public.is_company_operator(check_company_id uuid, check_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.company_operators co
    JOIN public.operator_workspaces ow ON ow.id = co.operator_workspace_id
    WHERE co.company_id = check_company_id
      AND ow.user_id = check_user_id
      AND co.status = 'active'
  )
$$;

-- Get operator workspace id for a user
CREATE OR REPLACE FUNCTION public.get_operator_workspace_id(check_user_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT id FROM public.operator_workspaces
  WHERE user_id = check_user_id
  LIMIT 1
$$;

-- ============================================================
-- RLS POLICIES: company_operators
-- ============================================================

-- Company admins can manage operators in their company
CREATE POLICY "Company admins manage operators"
  ON public.company_operators FOR ALL
  USING (public.is_company_admin(company_id, auth.uid()))
  WITH CHECK (public.is_company_admin(company_id, auth.uid()));

-- Operators can view their own assignments
CREATE POLICY "Operators view own assignments"
  ON public.company_operators FOR SELECT
  USING (
    operator_workspace_id = public.get_operator_workspace_id(auth.uid())
  );

-- ============================================================
-- RLS POLICIES: company_programs
-- ============================================================

-- Company admins can view programs in their company
CREATE POLICY "Company admins view programs"
  ON public.company_programs FOR SELECT
  USING (public.is_company_admin(company_id, auth.uid()));

-- Operators manage programs they own
CREATE POLICY "Operators manage own programs"
  ON public.company_programs FOR ALL
  USING (
    operator_workspace_id = public.get_operator_workspace_id(auth.uid())
    AND public.is_company_operator(company_id, auth.uid())
  )
  WITH CHECK (
    operator_workspace_id = public.get_operator_workspace_id(auth.uid())
    AND public.is_company_operator(company_id, auth.uid())
  );

-- ============================================================
-- RLS POLICIES: company_program_members
-- ============================================================

-- Company admins can manage members (invite collaborators)
CREATE POLICY "Company admins manage program members"
  ON public.company_program_members FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.company_programs cp
      WHERE cp.id = company_program_id
      AND public.is_company_admin(cp.company_id, auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.company_programs cp
      WHERE cp.id = company_program_id
      AND public.is_company_admin(cp.company_id, auth.uid())
    )
  );

-- Operators view members WITH GRANTED CONSENT ONLY
CREATE POLICY "Operators view consented members"
  ON public.company_program_members FOR SELECT
  USING (
    consent_status = 'granted'
    AND EXISTS (
      SELECT 1 FROM public.company_programs cp
      WHERE cp.id = company_program_id
      AND cp.operator_workspace_id = public.get_operator_workspace_id(auth.uid())
    )
  );

-- Users can view and update their own membership (consent)
CREATE POLICY "Users manage own membership"
  ON public.company_program_members FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Triggers
CREATE TRIGGER update_company_operators_updated_at
  BEFORE UPDATE ON public.company_operators
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_company_programs_updated_at
  BEFORE UPDATE ON public.company_programs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_company_program_members_updated_at
  BEFORE UPDATE ON public.company_program_members
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
