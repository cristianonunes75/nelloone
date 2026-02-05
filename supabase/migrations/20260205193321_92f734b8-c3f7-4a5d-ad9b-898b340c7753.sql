-- =============================================================
-- Create secure functions for public token access (via edge functions)
-- Using correct column names from actual table schemas
-- =============================================================

-- Function for relatorios_contextuais public access via token
CREATE OR REPLACE FUNCTION public.get_contextual_report_by_token(_token text)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  report_type text,
  recipient_name text,
  content jsonb,
  created_at timestamptz
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, user_id, report_type, recipient_name, content, created_at
  FROM public.relatorios_contextuais
  WHERE public_token = _token::uuid
  AND is_public_active = true
  AND (public_token_expires_at IS NULL OR public_token_expires_at > now())
$$;

-- Function for relatorio_conjuge public access via token
CREATE OR REPLACE FUNCTION public.get_spouse_report_by_token(_token text)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  content jsonb,
  created_at timestamptz
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, user_id, content, created_at
  FROM public.relatorio_conjuge
  WHERE public_token = _token::uuid
  AND is_public_active = true
  AND (public_token_expires_at IS NULL OR public_token_expires_at > now())
$$;

-- Function for codigo_cruzamentos public access via token
CREATE OR REPLACE FUNCTION public.get_crossing_by_token(_token text)
RETURNS TABLE (
  id uuid,
  user_a_id uuid,
  user_b_id uuid,
  relationship_type text,
  status text,
  content jsonb,
  created_at timestamptz
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, user_a_id, user_b_id, relationship_type, status, content, created_at
  FROM public.codigo_cruzamentos
  WHERE public_token = _token::uuid
  AND is_public_active = true
  AND (public_expires_at IS NULL OR public_expires_at > now())
$$;