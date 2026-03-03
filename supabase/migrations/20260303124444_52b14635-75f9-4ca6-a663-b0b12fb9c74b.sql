
-- ══════════════════════════════════════════════
-- PHASE 3: Performance Review + PDI + AI Chat
-- ══════════════════════════════════════════════

-- 1. Performance Review Tables
CREATE TABLE public.company_performance_cycles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  created_by UUID NOT NULL,
  title TEXT NOT NULL DEFAULT 'Ciclo de Performance',
  review_type TEXT NOT NULL DEFAULT '180' CHECK (review_type IN ('90', '180', '360')),
  start_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  end_date TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'closed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.company_performance_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT '180' CHECK (type IN ('90', '180', '360')),
  competencies_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  goals_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.company_performance_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cycle_id UUID NOT NULL REFERENCES public.company_performance_cycles(id) ON DELETE CASCADE,
  company_user_id UUID NOT NULL REFERENCES public.company_users(id) ON DELETE CASCADE,
  reviewer_company_user_id UUID REFERENCES public.company_users(id),
  template_id UUID REFERENCES public.company_performance_templates(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'submitted', 'closed')),
  overall_score NUMERIC,
  is_anonymous BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  submitted_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.company_performance_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID NOT NULL REFERENCES public.company_performance_reviews(id) ON DELETE CASCADE,
  dimension TEXT NOT NULL CHECK (dimension IN ('competence', 'goal', 'values')),
  question TEXT NOT NULL,
  score INTEGER CHECK (score >= 1 AND score <= 5),
  comment_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. PDI Tables
CREATE TABLE public.company_pdi_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  company_user_id UUID NOT NULL REFERENCES public.company_users(id) ON DELETE CASCADE,
  created_by UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
  start_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  target_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.company_pdi_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pdi_plan_id UUID NOT NULL REFERENCES public.company_pdi_plans(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'skill' CHECK (category IN ('skill', 'behavior', 'leadership', 'delivery')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  success_metric TEXT,
  deadline TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.company_pdi_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pdi_goal_id UUID NOT NULL REFERENCES public.company_pdi_goals(id) ON DELETE CASCADE,
  action_text TEXT NOT NULL,
  frequency TEXT,
  owner TEXT NOT NULL DEFAULT 'self' CHECK (owner IN ('self', 'manager')),
  due_date TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.company_pdi_checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pdi_plan_id UUID NOT NULL REFERENCES public.company_pdi_plans(id) ON DELETE CASCADE,
  checkin_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  progress_notes TEXT,
  blockers TEXT,
  next_steps TEXT,
  mood_score INTEGER CHECK (mood_score >= 1 AND mood_score <= 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. AI Queries Log
CREATE TABLE public.company_ai_queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  company_user_id UUID,
  feature TEXT NOT NULL DEFAULT 'people_strategy_chat',
  question_text TEXT NOT NULL,
  response_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ══════════════════════════════════════════════
-- RLS Policies
-- ══════════════════════════════════════════════

ALTER TABLE public.company_performance_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_performance_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_performance_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_performance_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_pdi_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_pdi_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_pdi_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_pdi_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_ai_queries ENABLE ROW LEVEL SECURITY;

-- Performance Cycles
CREATE POLICY "Company admins manage performance cycles"
  ON public.company_performance_cycles FOR ALL TO authenticated
  USING (public.is_company_admin(company_id, auth.uid()));

-- Performance Templates
CREATE POLICY "Company admins manage templates"
  ON public.company_performance_templates FOR ALL TO authenticated
  USING (public.is_company_admin(company_id, auth.uid()));

-- Performance Reviews - admins full, users see own
CREATE POLICY "Admins manage reviews"
  ON public.company_performance_reviews FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.company_performance_cycles c
      WHERE c.id = cycle_id
      AND public.is_company_admin(c.company_id, auth.uid())
    )
  );

CREATE POLICY "Users see own reviews"
  ON public.company_performance_reviews FOR SELECT TO authenticated
  USING (
    company_user_id IN (
      SELECT id FROM public.company_users WHERE user_id = auth.uid()
    )
    OR reviewer_company_user_id IN (
      SELECT id FROM public.company_users WHERE user_id = auth.uid()
    )
  );

-- Performance Answers
CREATE POLICY "Admins manage answers"
  ON public.company_performance_answers FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.company_performance_reviews r
      JOIN public.company_performance_cycles c ON c.id = r.cycle_id
      WHERE r.id = review_id
      AND public.is_company_admin(c.company_id, auth.uid())
    )
  );

CREATE POLICY "Reviewers manage own answers"
  ON public.company_performance_answers FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.company_performance_reviews r
      WHERE r.id = review_id
      AND r.reviewer_company_user_id IN (
        SELECT id FROM public.company_users WHERE user_id = auth.uid()
      )
    )
  );

-- PDI Plans
CREATE POLICY "Company admins manage PDI plans"
  ON public.company_pdi_plans FOR ALL TO authenticated
  USING (public.is_company_admin(company_id, auth.uid()));

CREATE POLICY "Users see own PDI"
  ON public.company_pdi_plans FOR SELECT TO authenticated
  USING (
    company_user_id IN (
      SELECT id FROM public.company_users WHERE user_id = auth.uid()
    )
  );

-- PDI Goals
CREATE POLICY "Admins manage PDI goals"
  ON public.company_pdi_goals FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.company_pdi_plans p
      WHERE p.id = pdi_plan_id
      AND public.is_company_admin(p.company_id, auth.uid())
    )
  );

CREATE POLICY "Users see own PDI goals"
  ON public.company_pdi_goals FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.company_pdi_plans p
      WHERE p.id = pdi_plan_id
      AND p.company_user_id IN (
        SELECT id FROM public.company_users WHERE user_id = auth.uid()
      )
    )
  );

-- PDI Actions
CREATE POLICY "Admins manage PDI actions"
  ON public.company_pdi_actions FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.company_pdi_goals g
      JOIN public.company_pdi_plans p ON p.id = g.pdi_plan_id
      WHERE g.id = pdi_goal_id
      AND public.is_company_admin(p.company_id, auth.uid())
    )
  );

CREATE POLICY "Users see own PDI actions"
  ON public.company_pdi_actions FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.company_pdi_goals g
      JOIN public.company_pdi_plans p ON p.id = g.pdi_plan_id
      WHERE g.id = pdi_goal_id
      AND p.company_user_id IN (
        SELECT id FROM public.company_users WHERE user_id = auth.uid()
      )
    )
  );

-- PDI Checkins
CREATE POLICY "Admins manage PDI checkins"
  ON public.company_pdi_checkins FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.company_pdi_plans p
      WHERE p.id = pdi_plan_id
      AND public.is_company_admin(p.company_id, auth.uid())
    )
  );

CREATE POLICY "Users manage own checkins"
  ON public.company_pdi_checkins FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.company_pdi_plans p
      WHERE p.id = pdi_plan_id
      AND p.company_user_id IN (
        SELECT id FROM public.company_users WHERE user_id = auth.uid()
      )
    )
  );

-- AI Queries
CREATE POLICY "Company admins manage AI queries"
  ON public.company_ai_queries FOR ALL TO authenticated
  USING (public.is_company_admin(company_id, auth.uid()));

-- ══════════════════════════════════════════════
-- Triggers for updated_at
-- ══════════════════════════════════════════════

CREATE TRIGGER update_perf_cycles_updated_at BEFORE UPDATE ON public.company_performance_cycles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_perf_templates_updated_at BEFORE UPDATE ON public.company_performance_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_perf_reviews_updated_at BEFORE UPDATE ON public.company_performance_reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pdi_plans_updated_at BEFORE UPDATE ON public.company_pdi_plans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pdi_goals_updated_at BEFORE UPDATE ON public.company_pdi_goals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pdi_actions_updated_at BEFORE UPDATE ON public.company_pdi_actions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to recalculate review overall score
CREATE OR REPLACE FUNCTION public.recalculate_review_score(_review_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_avg NUMERIC;
BEGIN
  SELECT AVG(score) INTO v_avg
  FROM public.company_performance_answers
  WHERE review_id = _review_id AND score IS NOT NULL;

  UPDATE public.company_performance_reviews
  SET overall_score = ROUND(v_avg::numeric, 2)
  WHERE id = _review_id;
END;
$$;
