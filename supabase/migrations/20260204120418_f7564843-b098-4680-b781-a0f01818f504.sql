-- =============================================
-- DISCERNIR - Pilot Module for Pastoral Listening
-- Version: 0.1 (Controlled Depth MVP)
-- =============================================

-- 1. PARISHES (Paróquias)
CREATE TABLE public.discernir_parishes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  city TEXT,
  diocese TEXT,
  parish_code TEXT UNIQUE NOT NULL DEFAULT substr(gen_random_uuid()::text, 1, 8),
  is_active BOOLEAN DEFAULT true,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. PARISH PRIESTS (Padres responsáveis)
CREATE TABLE public.discernir_priests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  parish_id UUID NOT NULL REFERENCES public.discernir_parishes(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'priest' CHECK (role IN ('priest', 'coordinator', 'assistant')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, parish_id)
);

-- 3. COUPLE INVITATIONS (Convites para casais)
CREATE TABLE public.discernir_couple_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parish_id UUID NOT NULL REFERENCES public.discernir_parishes(id) ON DELETE CASCADE,
  invited_by UUID NOT NULL REFERENCES public.discernir_priests(id),
  spouse_a_email TEXT NOT NULL,
  spouse_b_email TEXT NOT NULL,
  spouse_a_name TEXT,
  spouse_b_name TEXT,
  invite_token TEXT UNIQUE NOT NULL DEFAULT substr(gen_random_uuid()::text, 1, 12),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
  expires_at TIMESTAMPTZ DEFAULT (now() + interval '30 days'),
  accepted_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. COUPLES (Casais vinculados)
CREATE TABLE public.discernir_couples (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parish_id UUID NOT NULL REFERENCES public.discernir_parishes(id) ON DELETE CASCADE,
  invite_id UUID REFERENCES public.discernir_couple_invites(id),
  spouse_a_user_id UUID REFERENCES public.profiles(id),
  spouse_b_user_id UUID REFERENCES public.profiles(id),
  couple_name TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'withdrawn')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. INDIVIDUAL CONSENTS (Consentimentos individuais)
CREATE TABLE public.discernir_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  couple_id UUID REFERENCES public.discernir_couples(id),
  consent_type TEXT NOT NULL CHECK (consent_type IN ('individual', 'conjugal', 'priest_access')),
  consent_text TEXT NOT NULL,
  consent_version TEXT NOT NULL DEFAULT '1.0',
  is_active BOOLEAN DEFAULT true,
  granted_at TIMESTAMPTZ DEFAULT now(),
  revoked_at TIMESTAMPTZ,
  revocation_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. APOIO DE ESCUTA (Listening Support artifacts)
CREATE TABLE public.discernir_apoio_escuta (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  couple_id UUID REFERENCES public.discernir_couples(id),
  parish_id UUID NOT NULL REFERENCES public.discernir_parishes(id),
  artifact_type TEXT NOT NULL DEFAULT 'individual' CHECK (artifact_type IN ('individual', 'couple_protection')),
  
  -- Content based on IDENTITY data (no duplication)
  current_moment JSONB,
  responsibility_relation JSONB,
  fatigue_signals JSONB,
  family_situation JSONB,
  suggested_questions JSONB,
  care_pathways JSONB,
  
  -- For couple protection crossing (3 axes only)
  rhythm_axis JSONB,
  family_service_axis JSONB,
  decision_axis JSONB,
  
  -- Metadata
  identity_data_snapshot_at TIMESTAMPTZ,
  generated_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ DEFAULT (now() + interval '7 days'),
  is_valid BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. PRIEST ACCESS LOG (Audit trail for priest access)
CREATE TABLE public.discernir_access_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  priest_id UUID NOT NULL REFERENCES public.discernir_priests(id),
  user_id UUID REFERENCES public.profiles(id),
  couple_id UUID REFERENCES public.discernir_couples(id),
  apoio_escuta_id UUID REFERENCES public.discernir_apoio_escuta(id),
  action TEXT NOT NULL CHECK (action IN ('view_individual', 'view_couple', 'generate_apoio', 'export')),
  consent_verified BOOLEAN DEFAULT false,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. COUPLE FEEDBACK (Optional feedback after conversations)
CREATE TABLE public.discernir_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID NOT NULL REFERENCES public.discernir_couples(id),
  submitted_by UUID NOT NULL REFERENCES public.profiles(id),
  was_helpful BOOLEAN,
  was_uncomfortable TEXT,
  wants_to_continue BOOLEAN,
  additional_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- ENABLE RLS ON ALL TABLES
-- =============================================

ALTER TABLE public.discernir_parishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discernir_priests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discernir_couple_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discernir_couples ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discernir_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discernir_apoio_escuta ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discernir_access_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discernir_feedback ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS POLICIES - STRICT ACCESS CONTROL
-- =============================================

-- Parishes: Only priests can view their parish
CREATE POLICY "Priests can view their parish"
  ON public.discernir_parishes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.discernir_priests
      WHERE parish_id = discernir_parishes.id
      AND user_id = auth.uid()
      AND is_active = true
    )
  );

-- Priests: Can view own record
CREATE POLICY "Priests can view own record"
  ON public.discernir_priests FOR SELECT
  USING (user_id = auth.uid());

-- Couple Invites: Priests can manage invites for their parish
CREATE POLICY "Priests can manage parish invites"
  ON public.discernir_couple_invites FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.discernir_priests
      WHERE parish_id = discernir_couple_invites.parish_id
      AND user_id = auth.uid()
      AND is_active = true
    )
  );

-- Couples: Members can view their own couple record
CREATE POLICY "Couple members can view own couple"
  ON public.discernir_couples FOR SELECT
  USING (
    spouse_a_user_id = auth.uid() OR spouse_b_user_id = auth.uid()
  );

-- Couples: Priests can view couples in their parish
CREATE POLICY "Priests can view parish couples"
  ON public.discernir_couples FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.discernir_priests
      WHERE parish_id = discernir_couples.parish_id
      AND user_id = auth.uid()
      AND is_active = true
    )
  );

-- Consents: Users can manage their own consents
CREATE POLICY "Users can manage own consents"
  ON public.discernir_consents FOR ALL
  USING (user_id = auth.uid());

-- Apoio de Escuta: Users can view their own
CREATE POLICY "Users can view own apoio escuta"
  ON public.discernir_apoio_escuta FOR SELECT
  USING (user_id = auth.uid());

-- Apoio de Escuta: Priests can view with active consent
CREATE POLICY "Priests can view with consent"
  ON public.discernir_apoio_escuta FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.discernir_priests p
      JOIN public.discernir_consents c ON c.user_id = discernir_apoio_escuta.user_id
      WHERE p.parish_id = discernir_apoio_escuta.parish_id
      AND p.user_id = auth.uid()
      AND p.is_active = true
      AND c.consent_type = 'priest_access'
      AND c.is_active = true
      AND c.revoked_at IS NULL
    )
  );

-- Access Logs: Priests can view their own logs
CREATE POLICY "Priests can view own access logs"
  ON public.discernir_access_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.discernir_priests
      WHERE id = discernir_access_logs.priest_id
      AND user_id = auth.uid()
    )
  );

-- Access Logs: Users can view logs about them
CREATE POLICY "Users can view logs about them"
  ON public.discernir_access_logs FOR SELECT
  USING (user_id = auth.uid());

-- Feedback: Couples can manage their own feedback
CREATE POLICY "Couples can manage own feedback"
  ON public.discernir_feedback FOR ALL
  USING (submitted_by = auth.uid());

-- =============================================
-- HELPER FUNCTIONS
-- =============================================

-- Check if user is a priest in a parish
CREATE OR REPLACE FUNCTION public.is_discernir_priest(check_user_id UUID, check_parish_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.discernir_priests
    WHERE user_id = check_user_id
    AND parish_id = check_parish_id
    AND is_active = true
  )
$$;

-- Check if user has active consent for priest access
CREATE OR REPLACE FUNCTION public.has_discernir_consent(check_user_id UUID, check_consent_type TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.discernir_consents
    WHERE user_id = check_user_id
    AND consent_type = check_consent_type
    AND is_active = true
    AND revoked_at IS NULL
  )
$$;

-- Update timestamps trigger
CREATE TRIGGER update_discernir_parishes_updated_at
  BEFORE UPDATE ON public.discernir_parishes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_discernir_priests_updated_at
  BEFORE UPDATE ON public.discernir_priests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_discernir_couples_updated_at
  BEFORE UPDATE ON public.discernir_couples
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_discernir_couple_invites_updated_at
  BEFORE UPDATE ON public.discernir_couple_invites
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();