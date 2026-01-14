-- Create table for Ativação do Código da Essência
CREATE TABLE public.ativacao_codigo (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  historia_usuario JSONB NOT NULL DEFAULT '{}'::jsonb,
  relatorio JSONB,
  language TEXT DEFAULT 'pt',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ativacao_codigo ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own activation" 
ON public.ativacao_codigo FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activation" 
ON public.ativacao_codigo FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own activation" 
ON public.ativacao_codigo FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own activation" 
ON public.ativacao_codigo FOR DELETE 
USING (auth.uid() = user_id);

-- Allow service role full access for edge functions
CREATE POLICY "Service role has full access" 
ON public.ativacao_codigo FOR ALL 
USING (true) 
WITH CHECK (true);

-- Add index
CREATE INDEX idx_ativacao_codigo_user_id ON public.ativacao_codigo(user_id);