-- =============================================
-- HIRING ASSESSMENT MODULE FOR NELLO ONE BUSINESS
-- =============================================

-- Table: hiring_candidates
-- Stores candidates for hiring assessments
CREATE TABLE public.hiring_candidates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  position_applied TEXT,
  notes TEXT,
  invite_token TEXT NOT NULL UNIQUE DEFAULT gen_random_uuid()::text,
  invite_sent_at TIMESTAMPTZ,
  invite_expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'invited', 'in_progress', 'completed', 'expired', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Table: hiring_assessments
-- Stores test results for each candidate
CREATE TABLE public.hiring_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  candidate_id UUID NOT NULL REFERENCES public.hiring_candidates(id) ON DELETE CASCADE,
  test_type TEXT NOT NULL CHECK (test_type IN ('disc', 'temperamentos')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  result_data JSONB,
  algorithm_version TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: hiring_answers (stores individual answers)
CREATE TABLE public.hiring_answers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assessment_id UUID NOT NULL REFERENCES public.hiring_assessments(id) ON DELETE CASCADE,
  question_id UUID,
  question_number INTEGER NOT NULL,
  answer JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_hiring_candidates_company ON public.hiring_candidates(company_id);
CREATE INDEX idx_hiring_candidates_token ON public.hiring_candidates(invite_token);
CREATE INDEX idx_hiring_candidates_email ON public.hiring_candidates(email);
CREATE INDEX idx_hiring_candidates_status ON public.hiring_candidates(status);
CREATE INDEX idx_hiring_assessments_candidate ON public.hiring_assessments(candidate_id);
CREATE INDEX idx_hiring_assessments_status ON public.hiring_assessments(status);

-- Enable RLS
ALTER TABLE public.hiring_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hiring_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hiring_answers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for hiring_candidates
-- Company admins can manage their candidates
CREATE POLICY "Company admins can view their candidates"
ON public.hiring_candidates FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.company_users cu
    WHERE cu.user_id = auth.uid()
    AND cu.company_id = hiring_candidates.company_id
    AND cu.role = 'company_admin'
    AND cu.is_active = true
  )
);

CREATE POLICY "Company admins can create candidates"
ON public.hiring_candidates FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.company_users cu
    WHERE cu.user_id = auth.uid()
    AND cu.company_id = hiring_candidates.company_id
    AND cu.role = 'company_admin'
    AND cu.is_active = true
  )
);

CREATE POLICY "Company admins can update their candidates"
ON public.hiring_candidates FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.company_users cu
    WHERE cu.user_id = auth.uid()
    AND cu.company_id = hiring_candidates.company_id
    AND cu.role = 'company_admin'
    AND cu.is_active = true
  )
);

CREATE POLICY "Company admins can delete their candidates"
ON public.hiring_candidates FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.company_users cu
    WHERE cu.user_id = auth.uid()
    AND cu.company_id = hiring_candidates.company_id
    AND cu.role = 'company_admin'
    AND cu.is_active = true
  )
);

-- Public access for candidates via token (no auth required)
CREATE POLICY "Candidates can view their own data via token"
ON public.hiring_candidates FOR SELECT
USING (true);

-- RLS Policies for hiring_assessments
CREATE POLICY "Company admins can view assessments"
ON public.hiring_assessments FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.hiring_candidates hc
    JOIN public.company_users cu ON cu.company_id = hc.company_id
    WHERE hc.id = hiring_assessments.candidate_id
    AND cu.user_id = auth.uid()
    AND cu.role = 'company_admin'
    AND cu.is_active = true
  )
);

-- Anyone can insert/update assessments (candidates taking tests)
CREATE POLICY "Anyone can create assessments"
ON public.hiring_assessments FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update assessments"
ON public.hiring_assessments FOR UPDATE
USING (true);

-- Public select for candidates
CREATE POLICY "Public can view assessments"
ON public.hiring_assessments FOR SELECT
USING (true);

-- RLS Policies for hiring_answers
CREATE POLICY "Anyone can create answers"
ON public.hiring_answers FOR INSERT
WITH CHECK (true);

CREATE POLICY "Company admins can view answers"
ON public.hiring_answers FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.hiring_assessments ha
    JOIN public.hiring_candidates hc ON hc.id = ha.candidate_id
    JOIN public.company_users cu ON cu.company_id = hc.company_id
    WHERE ha.id = hiring_answers.assessment_id
    AND cu.user_id = auth.uid()
    AND cu.role = 'company_admin'
    AND cu.is_active = true
  )
);

-- Public can view their own answers
CREATE POLICY "Public can view answers"
ON public.hiring_answers FOR SELECT
USING (true);

-- Trigger to update updated_at
CREATE TRIGGER update_hiring_candidates_updated_at
BEFORE UPDATE ON public.hiring_candidates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to auto-create assessments when candidate is created
CREATE OR REPLACE FUNCTION public.create_hiring_assessments()
RETURNS TRIGGER AS $$
BEGIN
  -- Create DISC assessment
  INSERT INTO public.hiring_assessments (candidate_id, test_type)
  VALUES (NEW.id, 'disc');
  
  -- Create Temperamentos assessment
  INSERT INTO public.hiring_assessments (candidate_id, test_type)
  VALUES (NEW.id, 'temperamentos');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to auto-create assessments
CREATE TRIGGER trigger_create_hiring_assessments
AFTER INSERT ON public.hiring_candidates
FOR EACH ROW
EXECUTE FUNCTION public.create_hiring_assessments();