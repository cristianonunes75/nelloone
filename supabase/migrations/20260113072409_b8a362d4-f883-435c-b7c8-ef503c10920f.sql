-- =====================================================
-- MÓDULO DE VAGAS & RECRUTAMENTO INTELIGENTE
-- Nello One Business
-- =====================================================

-- 1. Tabela de Vagas
CREATE TABLE public.job_postings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  
  -- Campos obrigatórios
  title TEXT NOT NULL,
  department TEXT NOT NULL, -- Área / setor
  contract_type TEXT NOT NULL CHECK (contract_type IN ('clt', 'pj', 'internship', 'freelancer')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'paused', 'closed')),
  
  -- Campos opcionais
  description TEXT,
  internal_notes TEXT, -- Não visível ao candidato
  
  -- Pergunta de afinidade cultural (configurável por empresa)
  cultural_affinity_question TEXT DEFAULT 'Esta empresa possui uma identidade e valores próprios, vividos no dia a dia do trabalho, de forma respeitosa e aberta. Como você se identifica com esse tipo de ambiente?',
  cultural_affinity_options JSONB DEFAULT '["Me identifico e vivo esses valores no meu dia a dia", "Me identifico e tenho interesse em viver esse ambiente", "Respeito esse tipo de ambiente, mesmo não sendo algo que vivencio", "Prefiro não responder"]'::jsonb,
  
  -- Link público
  public_slug TEXT UNIQUE NOT NULL,
  
  -- Metadados
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  closed_at TIMESTAMPTZ
);

-- 2. Tabela de Candidaturas
CREATE TABLE public.job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.job_postings(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  
  -- Estado do candidato: pre_candidate, active_candidate, evaluated
  status TEXT NOT NULL DEFAULT 'pre_candidate' CHECK (status IN ('pre_candidate', 'active_candidate', 'evaluated', 'hired', 'rejected', 'withdrawn')),
  
  -- Origem da candidatura
  source TEXT NOT NULL DEFAULT 'public_link' CHECK (source IN ('public_link', 'internal_upload', 'email', 'referral', 'job_fair', 'other')),
  source_details TEXT,
  
  -- Dados básicos
  full_name TEXT,
  email TEXT,
  phone TEXT,
  
  -- Localização
  neighborhood TEXT, -- Bairro
  city TEXT,
  
  -- Deslocamento
  commute_time TEXT CHECK (commute_time IN ('up_to_30_min', '30_to_60_min', 'over_60_min')),
  
  -- Afinidade cultural
  cultural_affinity_response TEXT,
  cultural_affinity_level TEXT CHECK (cultural_affinity_level IN ('high', 'medium', 'low', 'not_informed')),
  
  -- Currículo
  resume_url TEXT,
  resume_filename TEXT,
  
  -- Dados extraídos do currículo (PDF parsing)
  extracted_data JSONB,
  extraction_status TEXT DEFAULT 'pending' CHECK (extraction_status IN ('pending', 'processing', 'completed', 'failed')),
  
  -- Campos pendentes
  pending_fields TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Consentimento LGPD
  lgpd_consent BOOLEAN DEFAULT false,
  lgpd_consent_at TIMESTAMPTZ,
  lgpd_consent_text_version TEXT,
  
  -- Confirmação de interesse (para pré-candidatos)
  confirmation_token UUID DEFAULT gen_random_uuid(),
  confirmation_sent_at TIMESTAMPTZ,
  confirmed_at TIMESTAMPTZ,
  
  -- Avaliação comportamental (link com hiring_candidates existente)
  hiring_candidate_id UUID REFERENCES public.hiring_candidates(id),
  
  -- Funil e notas
  pipeline_stage TEXT DEFAULT 'new' CHECK (pipeline_stage IN ('new', 'screening', 'interview', 'assessment', 'offer', 'hired', 'rejected')),
  internal_notes TEXT,
  
  -- Metadados
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Tabela de histórico de ações (auditoria)
CREATE TABLE public.job_application_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.job_applications(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  actor_id UUID REFERENCES auth.users(id),
  actor_type TEXT DEFAULT 'user' CHECK (actor_type IN ('user', 'system', 'candidate')),
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =====================================================
-- ÍNDICES
-- =====================================================

CREATE INDEX idx_job_postings_company ON public.job_postings(company_id);
CREATE INDEX idx_job_postings_status ON public.job_postings(status);
CREATE INDEX idx_job_postings_slug ON public.job_postings(public_slug);

CREATE INDEX idx_job_applications_job ON public.job_applications(job_id);
CREATE INDEX idx_job_applications_company ON public.job_applications(company_id);
CREATE INDEX idx_job_applications_status ON public.job_applications(status);
CREATE INDEX idx_job_applications_email ON public.job_applications(email);
CREATE INDEX idx_job_applications_confirmation ON public.job_applications(confirmation_token);

CREATE INDEX idx_job_application_logs_application ON public.job_application_logs(application_id);

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_application_logs ENABLE ROW LEVEL SECURITY;

-- Políticas para job_postings
CREATE POLICY "Company admins can manage their job postings"
ON public.job_postings
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.company_users cu
    WHERE cu.company_id = job_postings.company_id
    AND cu.user_id = auth.uid()
    AND cu.role = 'company_admin'
    AND cu.is_active = true
  )
);

CREATE POLICY "Public can view open job postings"
ON public.job_postings
FOR SELECT
USING (status = 'open');

-- Políticas para job_applications
CREATE POLICY "Company admins can manage their applications"
ON public.job_applications
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.company_users cu
    WHERE cu.company_id = job_applications.company_id
    AND cu.user_id = auth.uid()
    AND cu.role = 'company_admin'
    AND cu.is_active = true
  )
);

CREATE POLICY "Anyone can insert applications via public form"
ON public.job_applications
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Candidates can view their own applications via token"
ON public.job_applications
FOR SELECT
USING (confirmation_token IS NOT NULL);

CREATE POLICY "Candidates can update their own applications via token"
ON public.job_applications
FOR UPDATE
USING (confirmation_token IS NOT NULL AND confirmed_at IS NULL);

-- Políticas para job_application_logs
CREATE POLICY "Company admins can view application logs"
ON public.job_application_logs
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.job_applications ja
    JOIN public.company_users cu ON cu.company_id = ja.company_id
    WHERE ja.id = job_application_logs.application_id
    AND cu.user_id = auth.uid()
    AND cu.role = 'company_admin'
    AND cu.is_active = true
  )
);

CREATE POLICY "Anyone can insert logs"
ON public.job_application_logs
FOR INSERT
WITH CHECK (true);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger para updated_at
CREATE TRIGGER update_job_postings_updated_at
  BEFORE UPDATE ON public.job_postings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_job_applications_updated_at
  BEFORE UPDATE ON public.job_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Função para gerar slug único
CREATE OR REPLACE FUNCTION generate_job_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.public_slug IS NULL THEN
    NEW.public_slug := lower(
      regexp_replace(
        regexp_replace(NEW.title, '[^a-zA-Z0-9\s]', '', 'g'),
        '\s+', '-', 'g'
      )
    ) || '-' || substr(gen_random_uuid()::text, 1, 8);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_job_slug_trigger
  BEFORE INSERT ON public.job_postings
  FOR EACH ROW
  EXECUTE FUNCTION generate_job_slug();

-- Função para calcular campos pendentes
CREATE OR REPLACE FUNCTION calculate_pending_fields()
RETURNS TRIGGER AS $$
DECLARE
  pending TEXT[] := ARRAY[]::TEXT[];
BEGIN
  IF NEW.neighborhood IS NULL OR NEW.neighborhood = '' THEN
    pending := array_append(pending, 'neighborhood');
  END IF;
  IF NEW.commute_time IS NULL THEN
    pending := array_append(pending, 'commute_time');
  END IF;
  IF NEW.cultural_affinity_response IS NULL OR NEW.cultural_affinity_response = '' THEN
    pending := array_append(pending, 'cultural_affinity');
  END IF;
  IF NEW.lgpd_consent = false THEN
    pending := array_append(pending, 'lgpd_consent');
  END IF;
  IF NEW.confirmed_at IS NULL AND NEW.source != 'public_link' THEN
    pending := array_append(pending, 'confirmation');
  END IF;
  
  NEW.pending_fields := pending;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_pending_fields_trigger
  BEFORE INSERT OR UPDATE ON public.job_applications
  FOR EACH ROW
  EXECUTE FUNCTION calculate_pending_fields();

-- Função para log automático de mudanças de status
CREATE OR REPLACE FUNCTION log_application_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.job_application_logs (application_id, action, actor_type, details)
    VALUES (
      NEW.id,
      'status_changed',
      'system',
      jsonb_build_object('old_status', OLD.status, 'new_status', NEW.status)
    );
  END IF;
  
  IF OLD.pipeline_stage IS DISTINCT FROM NEW.pipeline_stage THEN
    INSERT INTO public.job_application_logs (application_id, action, actor_type, details)
    VALUES (
      NEW.id,
      'pipeline_stage_changed',
      'system',
      jsonb_build_object('old_stage', OLD.pipeline_stage, 'new_stage', NEW.pipeline_stage)
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER log_application_changes_trigger
  AFTER UPDATE ON public.job_applications
  FOR EACH ROW
  EXECUTE FUNCTION log_application_status_change();