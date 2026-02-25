
-- Table for Código Express results (standalone predictive model, not a standard test)
CREATE TABLE IF NOT EXISTS public.codigo_express (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  answers JSONB NOT NULL DEFAULT '{}',
  prediction JSONB NOT NULL DEFAULT '{}',
  confidence_score NUMERIC(5,2) DEFAULT 0,
  predicted_disc TEXT,
  predicted_temperament TEXT,
  predicted_enneagram TEXT,
  predicted_nello16 TEXT,
  model_version TEXT NOT NULL DEFAULT 'express_v1',
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast user lookup
CREATE INDEX IF NOT EXISTS idx_codigo_express_user_id ON public.codigo_express(user_id);

-- RLS
ALTER TABLE public.codigo_express ENABLE ROW LEVEL SECURITY;

-- Users can read their own Express results
CREATE POLICY "Users can read own express results"
  ON public.codigo_express FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own Express results
CREATE POLICY "Users can insert own express results"
  ON public.codigo_express FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own Express results
CREATE POLICY "Users can update own express results"
  ON public.codigo_express FOR UPDATE
  USING (auth.uid() = user_id);

-- Admins can read all
CREATE POLICY "Admins can read all express results"
  ON public.codigo_express FOR SELECT
  USING (public.is_admin_user(auth.uid()));

-- Updated_at trigger
CREATE TRIGGER update_codigo_express_updated_at
  BEFORE UPDATE ON public.codigo_express
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
