-- Add codigo_essencia_unlocked field to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS codigo_essencia_unlocked boolean DEFAULT false;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_codigo_essencia ON public.profiles(codigo_essencia_unlocked) WHERE codigo_essencia_unlocked = true;