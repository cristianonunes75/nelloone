-- Create table for essence code crossings between users
CREATE TABLE public.codigo_cruzamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_a_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_b_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  relationship_type TEXT NOT NULL CHECK (relationship_type IN ('spouse', 'parent_child', 'siblings', 'friends')),
  
  -- Content
  content JSONB,
  raw_content TEXT,
  
  -- Invite system
  invite_email TEXT,
  invite_token UUID DEFAULT gen_random_uuid(),
  invite_sent_at TIMESTAMPTZ,
  invite_accepted_at TIMESTAMPTZ,
  
  -- Consents (LGPD compliance)
  user_a_consent_at TIMESTAMPTZ,
  user_b_consent_at TIMESTAMPTZ,
  
  -- Public sharing
  public_token UUID DEFAULT gen_random_uuid(),
  is_public_active BOOLEAN DEFAULT false,
  public_expires_at TIMESTAMPTZ,
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'generated', 'expired', 'declined')),
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.codigo_cruzamentos ENABLE ROW LEVEL SECURITY;

-- Policies: Users can view their own crossings (as user_a or user_b)
CREATE POLICY "Users can view own crossings"
  ON public.codigo_cruzamentos
  FOR SELECT
  USING (auth.uid() = user_a_id OR auth.uid() = user_b_id);

-- Users can create crossings where they are user_a
CREATE POLICY "Users can create crossings"
  ON public.codigo_cruzamentos
  FOR INSERT
  WITH CHECK (auth.uid() = user_a_id);

-- Users can update their own crossings (for consent, etc.)
CREATE POLICY "Users can update own crossings"
  ON public.codigo_cruzamentos
  FOR UPDATE
  USING (auth.uid() = user_a_id OR auth.uid() = user_b_id);

-- Users can delete their own crossings
CREATE POLICY "Users can delete own crossings"
  ON public.codigo_cruzamentos
  FOR DELETE
  USING (auth.uid() = user_a_id);

-- Public access via token (for shared reports)
CREATE POLICY "Public access via token"
  ON public.codigo_cruzamentos
  FOR SELECT
  USING (
    is_public_active = true 
    AND (public_expires_at IS NULL OR public_expires_at > now())
  );

-- Create index for invite lookups
CREATE INDEX idx_codigo_cruzamentos_invite_token ON public.codigo_cruzamentos(invite_token);
CREATE INDEX idx_codigo_cruzamentos_public_token ON public.codigo_cruzamentos(public_token);
CREATE INDEX idx_codigo_cruzamentos_user_a ON public.codigo_cruzamentos(user_a_id);
CREATE INDEX idx_codigo_cruzamentos_user_b ON public.codigo_cruzamentos(user_b_id);

-- Trigger for updated_at
CREATE TRIGGER update_codigo_cruzamentos_updated_at
  BEFORE UPDATE ON public.codigo_cruzamentos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();