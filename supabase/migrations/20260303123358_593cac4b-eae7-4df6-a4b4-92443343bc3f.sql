
-- eNPS Cycles table
CREATE TABLE public.company_enps_cycles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  created_by UUID NOT NULL,
  title TEXT NOT NULL DEFAULT 'Ciclo eNPS',
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'closed')),
  enps_score NUMERIC,
  promoters_count INTEGER DEFAULT 0,
  neutrals_count INTEGER DEFAULT 0,
  detractors_count INTEGER DEFAULT 0,
  total_responses INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.company_enps_cycles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Company admins can manage eNPS cycles"
ON public.company_enps_cycles
FOR ALL
TO authenticated
USING (public.is_company_admin(company_id, auth.uid()) OR public.is_nello_admin(auth.uid()))
WITH CHECK (public.is_company_admin(company_id, auth.uid()) OR public.is_nello_admin(auth.uid()));

-- eNPS Responses table
CREATE TABLE public.company_enps_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cycle_id UUID NOT NULL REFERENCES public.company_enps_cycles(id) ON DELETE CASCADE,
  company_user_id UUID REFERENCES public.company_users(id),
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 10),
  comment TEXT,
  anonymous BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.company_enps_responses ENABLE ROW LEVEL SECURITY;

-- Admins can view all responses for their company cycles
CREATE POLICY "Company admins can view eNPS responses"
ON public.company_enps_responses
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.company_enps_cycles c
    WHERE c.id = cycle_id
    AND (public.is_company_admin(c.company_id, auth.uid()) OR public.is_nello_admin(auth.uid()))
  )
);

-- Any authenticated user can insert their response (validated by edge function)
CREATE POLICY "Users can submit eNPS responses"
ON public.company_enps_responses
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.company_enps_cycles c
    WHERE c.id = cycle_id
    AND c.status = 'active'
  )
);

-- Unique constraint: one response per user per cycle (non-anonymous)
CREATE UNIQUE INDEX idx_enps_unique_response 
ON public.company_enps_responses (cycle_id, company_user_id) 
WHERE company_user_id IS NOT NULL;

-- Trigger for updated_at on cycles
CREATE TRIGGER update_enps_cycles_updated_at
BEFORE UPDATE ON public.company_enps_cycles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to recalculate eNPS score
CREATE OR REPLACE FUNCTION public.recalculate_enps_score(_cycle_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_total INTEGER;
  v_promoters INTEGER;
  v_neutrals INTEGER;
  v_detractors INTEGER;
  v_score NUMERIC;
BEGIN
  SELECT 
    COUNT(*),
    COUNT(*) FILTER (WHERE score >= 9),
    COUNT(*) FILTER (WHERE score >= 7 AND score <= 8),
    COUNT(*) FILTER (WHERE score <= 6)
  INTO v_total, v_promoters, v_neutrals, v_detractors
  FROM public.company_enps_responses
  WHERE cycle_id = _cycle_id;

  IF v_total > 0 THEN
    v_score := ((v_promoters::NUMERIC / v_total) - (v_detractors::NUMERIC / v_total)) * 100;
  ELSE
    v_score := NULL;
  END IF;

  UPDATE public.company_enps_cycles
  SET 
    enps_score = v_score,
    promoters_count = v_promoters,
    neutrals_count = v_neutrals,
    detractors_count = v_detractors,
    total_responses = v_total
  WHERE id = _cycle_id;
END;
$$;

-- Auto-recalculate on new response
CREATE OR REPLACE FUNCTION public.trigger_recalculate_enps()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  PERFORM public.recalculate_enps_score(NEW.cycle_id);
  RETURN NEW;
END;
$$;

CREATE TRIGGER after_enps_response_insert
AFTER INSERT ON public.company_enps_responses
FOR EACH ROW
EXECUTE FUNCTION public.trigger_recalculate_enps();
