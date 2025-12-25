-- Remover coluna codigo_essencia_unlocked que não é mais utilizada
-- O acesso ao Código da Essência agora é automático quando a jornada é completada
ALTER TABLE public.profiles DROP COLUMN IF EXISTS codigo_essencia_unlocked;