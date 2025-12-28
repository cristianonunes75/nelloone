-- Tabela para armazenar relatórios para o cônjuge
CREATE TABLE public.relatorio_conjuge (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  mapa_essencia_id UUID REFERENCES public.mapa_essencia(id) ON DELETE CASCADE,
  content JSONB NOT NULL DEFAULT '{}',
  raw_content TEXT,
  public_token UUID NOT NULL DEFAULT gen_random_uuid(),
  public_token_expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days'),
  is_public_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_relatorio_conjuge_user_id ON public.relatorio_conjuge(user_id);
CREATE INDEX idx_relatorio_conjuge_public_token ON public.relatorio_conjuge(public_token);
CREATE UNIQUE INDEX idx_relatorio_conjuge_user_unique ON public.relatorio_conjuge(user_id);

-- Enable RLS
ALTER TABLE public.relatorio_conjuge ENABLE ROW LEVEL SECURITY;

-- Política: usuários podem ver seus próprios relatórios
CREATE POLICY "Users can view their own spouse reports"
ON public.relatorio_conjuge
FOR SELECT
USING (auth.uid() = user_id);

-- Política: usuários podem criar seus próprios relatórios
CREATE POLICY "Users can create their own spouse reports"
ON public.relatorio_conjuge
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Política: usuários podem atualizar seus próprios relatórios
CREATE POLICY "Users can update their own spouse reports"
ON public.relatorio_conjuge
FOR UPDATE
USING (auth.uid() = user_id);

-- Política: usuários podem deletar seus próprios relatórios
CREATE POLICY "Users can delete their own spouse reports"
ON public.relatorio_conjuge
FOR DELETE
USING (auth.uid() = user_id);

-- Política: acesso público via token válido (para cônjuge ver o relatório)
CREATE POLICY "Public access via valid token"
ON public.relatorio_conjuge
FOR SELECT
USING (
  is_public_active = true 
  AND public_token_expires_at > NOW()
);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_relatorio_conjuge_updated_at
BEFORE UPDATE ON public.relatorio_conjuge
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();