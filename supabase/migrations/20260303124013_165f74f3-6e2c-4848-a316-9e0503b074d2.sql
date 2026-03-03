
-- Climate Cycles
CREATE TABLE public.company_climate_cycles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  created_by UUID NOT NULL,
  title TEXT NOT NULL DEFAULT 'Ciclo Clima',
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'closed')),
  overall_score NUMERIC,
  dimension_scores JSONB DEFAULT '{}'::jsonb,
  total_responses INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.company_climate_cycles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Company admins manage climate cycles"
ON public.company_climate_cycles FOR ALL TO authenticated
USING (public.is_company_admin(company_id, auth.uid()) OR public.is_nello_admin(auth.uid()))
WITH CHECK (public.is_company_admin(company_id, auth.uid()) OR public.is_nello_admin(auth.uid()));

CREATE TRIGGER update_climate_cycles_updated_at
BEFORE UPDATE ON public.company_climate_cycles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Climate Questions (global, shared across companies)
CREATE TABLE public.company_climate_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  dimension TEXT NOT NULL CHECK (dimension IN ('lideranca', 'comunicacao', 'reconhecimento', 'cultura', 'crescimento', 'carga_trabalho')),
  question_text TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.company_climate_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can read climate questions"
ON public.company_climate_questions FOR SELECT TO authenticated USING (true);

-- Climate Responses
CREATE TABLE public.company_climate_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cycle_id UUID NOT NULL REFERENCES public.company_climate_cycles(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.company_climate_questions(id),
  company_user_id UUID REFERENCES public.company_users(id),
  score INTEGER NOT NULL CHECK (score >= 1 AND score <= 5),
  anonymous BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.company_climate_responses ENABLE ROW LEVEL SECURITY;

-- Admins view responses for their company cycles
CREATE POLICY "Company admins view climate responses"
ON public.company_climate_responses FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.company_climate_cycles c
    WHERE c.id = cycle_id
    AND (public.is_company_admin(c.company_id, auth.uid()) OR public.is_nello_admin(auth.uid()))
  )
);

-- Users can submit responses to active cycles
CREATE POLICY "Users submit climate responses"
ON public.company_climate_responses FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.company_climate_cycles c
    WHERE c.id = cycle_id AND c.status = 'active'
  )
);

-- Unique: one response per user per question per cycle
CREATE UNIQUE INDEX idx_climate_unique_response
ON public.company_climate_responses (cycle_id, question_id, company_user_id)
WHERE company_user_id IS NOT NULL;

-- Function to recalculate climate scores
CREATE OR REPLACE FUNCTION public.recalculate_climate_scores(_cycle_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_total INTEGER;
  v_overall NUMERIC;
  v_dimensions JSONB;
BEGIN
  SELECT COUNT(DISTINCT CASE WHEN company_user_id IS NOT NULL THEN company_user_id ELSE id END)
  INTO v_total
  FROM public.company_climate_responses
  WHERE cycle_id = _cycle_id;

  SELECT AVG(score) INTO v_overall
  FROM public.company_climate_responses
  WHERE cycle_id = _cycle_id;

  SELECT jsonb_object_agg(dim, avg_score)
  INTO v_dimensions
  FROM (
    SELECT q.dimension AS dim, ROUND(AVG(r.score)::numeric, 2) AS avg_score
    FROM public.company_climate_responses r
    JOIN public.company_climate_questions q ON q.id = r.question_id
    WHERE r.cycle_id = _cycle_id
    GROUP BY q.dimension
  ) sub;

  UPDATE public.company_climate_cycles
  SET
    overall_score = ROUND(v_overall::numeric, 2),
    dimension_scores = COALESCE(v_dimensions, '{}'::jsonb),
    total_responses = v_total
  WHERE id = _cycle_id;
END;
$$;

-- Auto-recalculate on new climate response
CREATE OR REPLACE FUNCTION public.trigger_recalculate_climate()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  PERFORM public.recalculate_climate_scores(NEW.cycle_id);
  RETURN NEW;
END;
$$;

CREATE TRIGGER after_climate_response_insert
AFTER INSERT ON public.company_climate_responses
FOR EACH ROW EXECUTE FUNCTION public.trigger_recalculate_climate();

-- Seed default climate questions
INSERT INTO public.company_climate_questions (dimension, question_text, sort_order) VALUES
('lideranca', 'Meu líder direto me apoia no meu desenvolvimento profissional.', 1),
('lideranca', 'Sinto que minha liderança é acessível e transparente.', 2),
('comunicacao', 'A comunicação interna da empresa é clara e eficiente.', 3),
('comunicacao', 'Recebo feedback regular sobre meu desempenho.', 4),
('reconhecimento', 'Sinto que meu trabalho é reconhecido e valorizado.', 5),
('reconhecimento', 'Existem oportunidades justas de reconhecimento na empresa.', 6),
('cultura', 'Me identifico com os valores e a cultura da empresa.', 7),
('cultura', 'O ambiente de trabalho é respeitoso e inclusivo.', 8),
('crescimento', 'Vejo oportunidades reais de crescimento na empresa.', 9),
('crescimento', 'A empresa investe no meu desenvolvimento.', 10),
('carga_trabalho', 'Minha carga de trabalho é compatível com minha função.', 11),
('carga_trabalho', 'Consigo manter um equilíbrio saudável entre vida pessoal e trabalho.', 12);
