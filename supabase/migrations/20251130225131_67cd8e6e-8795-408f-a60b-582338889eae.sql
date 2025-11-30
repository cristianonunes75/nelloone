-- Create table for storing generated Mapa da Essência
CREATE TABLE public.mapa_essencia (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  sections JSONB NOT NULL DEFAULT '[]'::jsonb,
  raw_content TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.mapa_essencia ENABLE ROW LEVEL SECURITY;

-- Users can view their own map
CREATE POLICY "Users can view their own mapa"
ON public.mapa_essencia
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own map
CREATE POLICY "Users can create their own mapa"
ON public.mapa_essencia
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own map
CREATE POLICY "Users can update their own mapa"
ON public.mapa_essencia
FOR UPDATE
USING (auth.uid() = user_id);

-- Admins can view all maps
CREATE POLICY "Admins can view all mapas"
ON public.mapa_essencia
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_mapa_essencia_updated_at
BEFORE UPDATE ON public.mapa_essencia
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create unique constraint so each user has only one map
CREATE UNIQUE INDEX idx_mapa_essencia_user_id ON public.mapa_essencia(user_id);