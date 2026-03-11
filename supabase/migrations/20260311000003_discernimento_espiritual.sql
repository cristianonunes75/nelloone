-- ============================================================
-- Tabela: discernimento_espiritual
-- Armazena o Perfil de Discernimento Espiritual gerado a partir
-- do Código da Essência do Identity.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.discernimento_espiritual (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Dados base usados para gerar o relatório (snapshot)
  dados_base_codigo JSONB NOT NULL DEFAULT '{}'::jsonb,

  -- Relatório estruturado em 6 seções
  apresentacao TEXT,
  tendencias_personalidade JSONB NOT NULL DEFAULT '[]'::jsonb,
  tensoes_interiores JSONB NOT NULL DEFAULT '[]'::jsonb,
  riscos_espirituais JSONB NOT NULL DEFAULT '[]'::jsonb,
  potenciais_vocacao JSONB NOT NULL DEFAULT '[]'::jsonb,
  perguntas_direcao JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- Texto completo para PDF/compartilhamento
  relatorio_texto TEXT,

  -- Metadados
  generated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  version INTEGER NOT NULL DEFAULT 1,
  generation_metadata JSONB DEFAULT '{}'::jsonb,

  -- Um registro por usuário (pode ser regenerado)
  CONSTRAINT discernimento_espiritual_user_id_key UNIQUE (user_id)
);

-- RLS
ALTER TABLE public.discernimento_espiritual ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários veem apenas seu próprio discernimento"
  ON public.discernimento_espiritual FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários inserem seu próprio discernimento"
  ON public.discernimento_espiritual FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários atualizam seu próprio discernimento"
  ON public.discernimento_espiritual FOR UPDATE
  USING (auth.uid() = user_id);

-- Índice
CREATE INDEX IF NOT EXISTS discernimento_espiritual_user_id_idx
  ON public.discernimento_espiritual(user_id);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_discernimento_espiritual_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER discernimento_espiritual_updated_at
  BEFORE UPDATE ON public.discernimento_espiritual
  FOR EACH ROW EXECUTE FUNCTION update_discernimento_espiritual_updated_at();
