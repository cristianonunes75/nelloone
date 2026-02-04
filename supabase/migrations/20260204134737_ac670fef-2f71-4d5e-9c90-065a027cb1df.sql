-- =====================================================
-- IDENTITY ESSENCIAL - Schema para Jornada Pastoral
-- =====================================================

-- Tabela para armazenar o progresso do Identity Essencial
CREATE TABLE public.identity_essencial (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  
  -- Status da jornada
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Origem da conclusão: 'reused' (reaproveitou dados) ou 'completed' (respondeu)
  completion_source TEXT CHECK (completion_source IN ('reused', 'completed')),
  
  -- Testes necessários (DISC, Temperamentos, Estilos de Conexão)
  disc_status TEXT DEFAULT 'not_started' CHECK (disc_status IN ('not_started', 'completed')),
  temperamentos_status TEXT DEFAULT 'not_started' CHECK (temperamentos_status IN ('not_started', 'completed')),
  estilos_conexao_status TEXT DEFAULT 'not_started' CHECK (estilos_conexao_status IN ('not_started', 'completed')),
  
  -- Respostas declarativas de ritmo (3-5 perguntas curtas)
  rhythm_declaration JSONB,
  rhythm_declaration_at TIMESTAMP WITH TIME ZONE,
  
  -- Síntese gerada (não armazenada permanentemente, só referência)
  last_synthesis_at TIMESTAMP WITH TIME ZONE,
  last_synthesis_state TEXT, -- Ex: 'equilibrado', 'exigente', 'exigente_desgaste', 'risco_sobrecarga'
  
  -- Controle
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_identity_essencial_updated_at
  BEFORE UPDATE ON public.identity_essencial
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Índices
CREATE INDEX idx_identity_essencial_user_id ON public.identity_essencial(user_id);
CREATE INDEX idx_identity_essencial_status ON public.identity_essencial(status);

-- RLS - Somente o próprio usuário pode ver/editar seus dados
ALTER TABLE public.identity_essencial ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own identity_essencial"
  ON public.identity_essencial FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own identity_essencial"
  ON public.identity_essencial FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own identity_essencial"
  ON public.identity_essencial FOR UPDATE
  USING (auth.uid() = user_id);

-- =====================================================
-- SÍNTESE DE RITMO E RESPONSABILIDADE
-- Tabela temporária (dados expiram e não são histórico permanente)
-- =====================================================

CREATE TABLE public.identity_essencial_synthesis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  identity_essencial_id UUID REFERENCES public.identity_essencial(id) ON DELETE CASCADE,
  
  -- Estado pastoral de momento
  rhythm_state TEXT NOT NULL CHECK (rhythm_state IN (
    'equilibrado',          -- Ritmo equilibrado
    'exigente_sustentavel', -- Ritmo exigente, porém sustentável
    'exigente_desgaste',    -- Ritmo exigente com sinais de desgaste
    'risco_sobrecarga'      -- Risco de sobrecarga
  )),
  
  -- Texto pastoral para o usuário
  user_message TEXT NOT NULL,
  
  -- Texto pastoral para o padre (Apoio de Escuta)
  pastoral_message TEXT NOT NULL,
  
  -- Perguntas pastorais derivadas
  pastoral_questions JSONB NOT NULL DEFAULT '[]',
  
  -- Dados base (snapshot no momento da geração)
  disc_summary JSONB,
  temperamento_summary JSONB,
  estilos_conexao_summary JSONB,
  rhythm_declaration_snapshot JSONB,
  
  -- Validade e controle
  generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '30 days'),
  is_valid BOOLEAN NOT NULL DEFAULT true,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Índices
CREATE INDEX idx_synthesis_user_id ON public.identity_essencial_synthesis(user_id);
CREATE INDEX idx_synthesis_valid ON public.identity_essencial_synthesis(is_valid, expires_at);

-- RLS
ALTER TABLE public.identity_essencial_synthesis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own synthesis"
  ON public.identity_essencial_synthesis FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own synthesis"
  ON public.identity_essencial_synthesis FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Padres podem ver síntese com consentimento
CREATE POLICY "Priests can view synthesis with consent"
  ON public.identity_essencial_synthesis FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.discernir_priests p
      JOIN public.discernir_consents c ON c.user_id = identity_essencial_synthesis.user_id
      WHERE p.user_id = auth.uid()
      AND p.is_active = true
      AND c.consent_type = 'priest_access'
      AND c.is_active = true
      AND c.revoked_at IS NULL
    )
  );

-- =====================================================
-- FUNÇÃO: Verificar e reaproveitar dados existentes
-- =====================================================

CREATE OR REPLACE FUNCTION public.check_identity_essencial_completion(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_disc_complete BOOLEAN := false;
  v_temp_complete BOOLEAN := false;
  v_estilos_complete BOOLEAN := false;
  v_result JSONB;
BEGIN
  -- Verificar DISC
  SELECT EXISTS (
    SELECT 1 FROM user_tests ut
    JOIN tests t ON t.id = ut.test_id
    WHERE ut.user_id = p_user_id
    AND ut.status = 'completed'
    AND t.type IN ('disc')
  ) INTO v_disc_complete;
  
  -- Verificar Temperamentos
  SELECT EXISTS (
    SELECT 1 FROM user_tests ut
    JOIN tests t ON t.id = ut.test_id
    WHERE ut.user_id = p_user_id
    AND ut.status = 'completed'
    AND t.type IN ('temperamentos')
  ) INTO v_temp_complete;
  
  -- Verificar Estilos de Conexão (inclui alias linguagens_amor)
  SELECT EXISTS (
    SELECT 1 FROM user_tests ut
    JOIN tests t ON t.id = ut.test_id
    WHERE ut.user_id = p_user_id
    AND ut.status = 'completed'
    AND t.type IN ('estilos_conexao', 'linguagens_amor')
  ) INTO v_estilos_complete;
  
  v_result := jsonb_build_object(
    'disc_complete', v_disc_complete,
    'temperamentos_complete', v_temp_complete,
    'estilos_conexao_complete', v_estilos_complete,
    'all_complete', (v_disc_complete AND v_temp_complete AND v_estilos_complete)
  );
  
  RETURN v_result;
END;
$$;

-- Permitir que usuários autenticados chamem a função
GRANT EXECUTE ON FUNCTION public.check_identity_essencial_completion(UUID) TO authenticated;

-- =====================================================
-- FUNÇÃO: Inicializar ou atualizar Identity Essencial
-- =====================================================

CREATE OR REPLACE FUNCTION public.init_identity_essencial(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_existing RECORD;
  v_completion JSONB;
  v_result JSONB;
BEGIN
  -- Verificar se já existe
  SELECT * INTO v_existing FROM identity_essencial WHERE user_id = p_user_id;
  
  -- Verificar testes completados no Identity
  v_completion := check_identity_essencial_completion(p_user_id);
  
  IF v_existing IS NULL THEN
    -- Criar novo registro
    INSERT INTO identity_essencial (
      user_id,
      status,
      disc_status,
      temperamentos_status,
      estilos_conexao_status,
      started_at,
      completion_source
    ) VALUES (
      p_user_id,
      CASE WHEN (v_completion->>'all_complete')::boolean THEN 'completed' ELSE 'in_progress' END,
      CASE WHEN (v_completion->>'disc_complete')::boolean THEN 'completed' ELSE 'not_started' END,
      CASE WHEN (v_completion->>'temperamentos_complete')::boolean THEN 'completed' ELSE 'not_started' END,
      CASE WHEN (v_completion->>'estilos_conexao_complete')::boolean THEN 'completed' ELSE 'not_started' END,
      now(),
      CASE WHEN (v_completion->>'all_complete')::boolean THEN 'reused' ELSE NULL END
    )
    ON CONFLICT (user_id) DO UPDATE SET
      disc_status = CASE WHEN (v_completion->>'disc_complete')::boolean THEN 'completed' ELSE identity_essencial.disc_status END,
      temperamentos_status = CASE WHEN (v_completion->>'temperamentos_complete')::boolean THEN 'completed' ELSE identity_essencial.temperamentos_status END,
      estilos_conexao_status = CASE WHEN (v_completion->>'estilos_conexao_complete')::boolean THEN 'completed' ELSE identity_essencial.estilos_conexao_status END,
      updated_at = now();
  ELSE
    -- Atualizar existente com novos dados de testes
    UPDATE identity_essencial SET
      disc_status = CASE WHEN (v_completion->>'disc_complete')::boolean THEN 'completed' ELSE disc_status END,
      temperamentos_status = CASE WHEN (v_completion->>'temperamentos_complete')::boolean THEN 'completed' ELSE temperamentos_status END,
      estilos_conexao_status = CASE WHEN (v_completion->>'estilos_conexao_complete')::boolean THEN 'completed' ELSE estilos_conexao_status END,
      status = CASE 
        WHEN (v_completion->>'all_complete')::boolean AND rhythm_declaration IS NOT NULL THEN 'completed'
        WHEN (v_completion->>'all_complete')::boolean THEN 'in_progress'
        ELSE status
      END,
      completion_source = CASE 
        WHEN (v_completion->>'all_complete')::boolean AND completion_source IS NULL THEN 'reused'
        ELSE completion_source
      END,
      updated_at = now()
    WHERE user_id = p_user_id;
  END IF;
  
  -- Buscar status atualizado
  SELECT jsonb_build_object(
    'id', ie.id,
    'status', ie.status,
    'disc_status', ie.disc_status,
    'temperamentos_status', ie.temperamentos_status,
    'estilos_conexao_status', ie.estilos_conexao_status,
    'has_rhythm_declaration', ie.rhythm_declaration IS NOT NULL,
    'completion_source', ie.completion_source,
    'tests_complete', v_completion
  ) INTO v_result
  FROM identity_essencial ie
  WHERE ie.user_id = p_user_id;
  
  RETURN v_result;
END;
$$;

GRANT EXECUTE ON FUNCTION public.init_identity_essencial(UUID) TO authenticated;