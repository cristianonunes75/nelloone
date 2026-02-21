
-- =============================================================
-- EVOLUÇÃO ESTRUTURAL V1 - MIGRAÇÃO DE VERSIONAMENTO E METADATA
-- =============================================================

-- 1. VERSIONAMENTO: Adicionar colunas de versão às tabelas existentes
-- tests: test_version para identificar a versão do instrumento
ALTER TABLE public.tests ADD COLUMN IF NOT EXISTS test_version text NOT NULL DEFAULT 'v1';

-- test_questions: question_version para expansão progressiva de perguntas
ALTER TABLE public.test_questions ADD COLUMN IF NOT EXISTS question_version integer NOT NULL DEFAULT 1;

-- user_tests: scoring_version e identity_version para rastreabilidade
ALTER TABLE public.user_tests ADD COLUMN IF NOT EXISTS scoring_version text NOT NULL DEFAULT 'v1';
ALTER TABLE public.user_tests ADD COLUMN IF NOT EXISTS identity_version text NOT NULL DEFAULT 'v1';

-- Índice para queries por versão
CREATE INDEX IF NOT EXISTS idx_tests_version ON public.tests(test_version);
CREATE INDEX IF NOT EXISTS idx_test_questions_version ON public.test_questions(question_version);
CREATE INDEX IF NOT EXISTS idx_user_tests_scoring_version ON public.user_tests(scoring_version);

-- 2. REFERÊNCIAS TEÓRICAS: Tabela para documentação científica estruturada
CREATE TABLE IF NOT EXISTS public.theoretical_references (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  test_type text NOT NULL, -- disc, eneagrama, etc
  dimension text, -- ex: 'D', 'tipo_1', 'linguistica'
  factor text, -- sub-fator opcional
  construct_label text NOT NULL, -- ex: 'comportamento adaptativo observável'
  theoretical_basis text, -- ex: 'William Marston, 1928'
  academic_references text[], -- array de referências bibliográficas
  measurement_level text, -- 'ordinal', 'interval', 'nominal'
  scale_type text, -- 'likert_5', 'forced_choice', 'ranking'
  max_raw_score integer,
  normalization_formula text, -- como normalizar para 0-100
  metadata jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.theoretical_references ENABLE ROW LEVEL SECURITY;

-- Leitura pública (dados teóricos não são sensíveis)
CREATE POLICY "Theoretical references are publicly readable"
  ON public.theoretical_references FOR SELECT USING (true);

-- Apenas admins podem modificar
CREATE POLICY "Admins can manage theoretical references"
  ON public.theoretical_references FOR ALL 
  USING (public.is_admin_user(auth.uid()));

CREATE INDEX IF NOT EXISTS idx_theoretical_references_test ON public.theoretical_references(test_type);
CREATE INDEX IF NOT EXISTS idx_theoretical_references_dimension ON public.theoretical_references(test_type, dimension);

-- 3. METADATA DE DIFERENCIAÇÃO CONCEITUAL (DISC vs Temperamentos, etc)
CREATE TABLE IF NOT EXISTS public.test_conceptual_metadata (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  test_type text NOT NULL UNIQUE,
  construct_category text NOT NULL, -- 'behavioral_adaptive' ou 'reactive_basal'
  construct_label jsonb NOT NULL, -- {pt: '...', en: '...'}
  measures_what jsonb NOT NULL, -- {pt: '...', en: '...'}
  theoretical_framework text,
  differentiation_notes jsonb, -- notas de diferenciação vs outros testes
  metadata jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.test_conceptual_metadata ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Test metadata is publicly readable"
  ON public.test_conceptual_metadata FOR SELECT USING (true);

CREATE POLICY "Admins can manage test metadata"
  ON public.test_conceptual_metadata FOR ALL 
  USING (public.is_admin_user(auth.uid()));

-- 4. TABELA DE CHECKPOINTS DE JORNADA (gestão de fadiga)
CREATE TABLE IF NOT EXISTS public.journey_checkpoints (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  test_type text NOT NULL,
  user_test_id uuid,
  checkpoint_type text NOT NULL DEFAULT 'module_break', -- module_break, mid_test, fatigue_pause
  elapsed_seconds integer DEFAULT 0,
  questions_answered integer DEFAULT 0,
  total_questions integer DEFAULT 0,
  estimated_remaining_seconds integer,
  paused_at timestamptz,
  resumed_at timestamptz,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.journey_checkpoints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own checkpoints"
  ON public.journey_checkpoints FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_journey_checkpoints_user ON public.journey_checkpoints(user_id, test_type);

-- 5. RESULTADO NORMALIZADO: coluna para scores normalizados 0-100
ALTER TABLE public.user_tests ADD COLUMN IF NOT EXISTS normalized_scores jsonb;
ALTER TABLE public.user_tests ADD COLUMN IF NOT EXISTS tie_resolution jsonb;

-- 6. Trigger para updated_at nas novas tabelas
CREATE TRIGGER update_theoretical_references_updated_at
  BEFORE UPDATE ON public.theoretical_references
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_test_conceptual_metadata_updated_at
  BEFORE UPDATE ON public.test_conceptual_metadata
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
