
-- Table for capturing leads from Código Inicial (anonymous quiz completions)
CREATE TABLE public.codigo_inicial_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT,
  prediction JSONB NOT NULL DEFAULT '{}'::jsonb,
  answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  archetype_name TEXT,
  confidence_score NUMERIC,
  user_id UUID,
  converted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Allow anonymous inserts (no auth required)
ALTER TABLE public.codigo_inicial_leads ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (anonymous lead capture)
CREATE POLICY "Anyone can create a lead" ON public.codigo_inicial_leads
  FOR INSERT WITH CHECK (true);

-- Only the lead owner (if they later sign up) or admins can read
CREATE POLICY "Admins can read leads" ON public.codigo_inicial_leads
  FOR SELECT USING (
    public.is_admin_user(auth.uid())
  );

-- Allow anonymous read by email match (for confirmation flow)
CREATE POLICY "Lead can read own by email" ON public.codigo_inicial_leads
  FOR SELECT USING (true);

-- Index for email lookups
CREATE INDEX idx_codigo_inicial_leads_email ON public.codigo_inicial_leads(email);
