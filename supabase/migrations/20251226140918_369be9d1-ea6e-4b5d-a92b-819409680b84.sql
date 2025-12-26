-- Add version tracking to mapa_essencia for history
ALTER TABLE public.mapa_essencia 
ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS generation_metadata JSONB DEFAULT '{}'::jsonb;

-- Create history table for versioned Código da Essência
CREATE TABLE IF NOT EXISTS public.mapa_essencia_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  sections JSONB NOT NULL DEFAULT '{}'::jsonb,
  raw_content TEXT,
  generation_metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.mapa_essencia_history ENABLE ROW LEVEL SECURITY;

-- Users can view their own history
CREATE POLICY "Users can view their own history" 
ON public.mapa_essencia_history 
FOR SELECT 
USING (auth.uid() = user_id);

-- Users can insert their own history
CREATE POLICY "Users can insert their own history" 
ON public.mapa_essencia_history 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_mapa_essencia_history_user_id 
ON public.mapa_essencia_history(user_id);

CREATE INDEX IF NOT EXISTS idx_mapa_essencia_history_created_at 
ON public.mapa_essencia_history(user_id, created_at DESC);

-- Comment for documentation
COMMENT ON TABLE public.mapa_essencia_history IS 'Historical versions of Código da Essência generations for each user';