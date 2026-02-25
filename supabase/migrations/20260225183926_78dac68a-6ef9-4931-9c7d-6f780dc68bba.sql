
-- Social invites for organic growth via Código Inicial
CREATE TABLE public.social_invites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invite_code TEXT NOT NULL UNIQUE,
  -- Inviter can be a registered user or an anonymous lead
  inviter_user_id UUID,
  inviter_lead_id UUID REFERENCES public.codigo_inicial_leads(id),
  inviter_name TEXT,
  -- Tracking
  clicks INT NOT NULL DEFAULT 0,
  completions INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Track each invited person who completes
CREATE TABLE public.social_invite_connections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invite_id UUID NOT NULL REFERENCES public.social_invites(id),
  -- The invited person (can be user or lead)
  invited_user_id UUID,
  invited_lead_id UUID REFERENCES public.codigo_inicial_leads(id),
  invited_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.social_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_invite_connections ENABLE ROW LEVEL SECURITY;

-- Anyone can insert an invite (anonymous flow)
CREATE POLICY "Anyone can create invite" ON public.social_invites
  FOR INSERT WITH CHECK (true);

-- Anyone can read invites (needed to resolve invite codes)
CREATE POLICY "Anyone can read invites" ON public.social_invites
  FOR SELECT USING (true);

-- Allow incrementing clicks/completions  
CREATE POLICY "Anyone can update invite counters" ON public.social_invites
  FOR UPDATE USING (true) WITH CHECK (true);

-- Anyone can create connections
CREATE POLICY "Anyone can create connections" ON public.social_invite_connections
  FOR INSERT WITH CHECK (true);

-- Admins can read connections
CREATE POLICY "Admins can read connections" ON public.social_invite_connections
  FOR SELECT USING (public.is_admin_user(auth.uid()));

-- Index for code lookups
CREATE INDEX idx_social_invites_code ON public.social_invites(invite_code);
