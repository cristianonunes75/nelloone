-- Tabela para armazenar tokens de transição entre apps admin
CREATE TABLE public.admin_cross_app_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID NOT NULL,
  token TEXT NOT NULL UNIQUE,
  target_app TEXT NOT NULL,
  target_path TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '30 seconds'),
  used_at TIMESTAMP WITH TIME ZONE,
  ip_address TEXT,
  user_agent TEXT
);

-- Enable RLS
ALTER TABLE public.admin_cross_app_tokens ENABLE ROW LEVEL SECURITY;

-- Política: Somente service role pode inserir/atualizar (via edge function)
-- Não criar políticas públicas - somente edge function com service role acessa

-- Índice para busca rápida por token
CREATE INDEX idx_admin_cross_app_tokens_token ON public.admin_cross_app_tokens(token);
CREATE INDEX idx_admin_cross_app_tokens_expires ON public.admin_cross_app_tokens(expires_at);

-- Função para limpar tokens expirados (rodar via cron)
CREATE OR REPLACE FUNCTION public.cleanup_expired_cross_app_tokens()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.admin_cross_app_tokens
  WHERE expires_at < now() OR used_at IS NOT NULL;
END;
$$;