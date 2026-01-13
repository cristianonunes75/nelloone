-- Corrigir funções com search_path
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
$$ LANGUAGE plpgsql SET search_path = public;

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
$$ LANGUAGE plpgsql SET search_path = public;

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
$$ LANGUAGE plpgsql SET search_path = public;

-- Remover políticas overly permissivas e criar mais seguras
DROP POLICY IF EXISTS "Anyone can insert applications via public form" ON public.job_applications;
DROP POLICY IF EXISTS "Candidates can view their own applications via token" ON public.job_applications;
DROP POLICY IF EXISTS "Candidates can update their own applications via token" ON public.job_applications;
DROP POLICY IF EXISTS "Anyone can insert logs" ON public.job_application_logs;

-- Política mais restritiva para inserção de candidaturas
-- Permite inserção apenas quando associada a uma vaga aberta
CREATE POLICY "Insert applications for open jobs only"
ON public.job_applications
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.job_postings jp
    WHERE jp.id = job_id
    AND jp.status = 'open'
  )
);

-- Políticas seguras para logs (somente sistema pode inserir)
CREATE POLICY "System can insert logs"
ON public.job_application_logs
FOR INSERT
WITH CHECK (actor_type = 'system');