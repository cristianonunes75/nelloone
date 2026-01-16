-- Add column for Ativação do Código unlock status
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS ativacao_codigo_unlocked BOOLEAN DEFAULT FALSE;

-- Add comment for documentation
COMMENT ON COLUMN public.profiles.ativacao_codigo_unlocked IS 'Whether the user has purchased the Ativação do Código module';