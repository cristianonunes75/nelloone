-- Add RLS policies for job_application_logs
ALTER TABLE public.job_application_logs ENABLE ROW LEVEL SECURITY;

-- Company admins can view logs for applications in their company
CREATE POLICY "Company admins can view job application logs"
ON public.job_application_logs
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM job_applications ja
    JOIN company_users cu ON cu.company_id = ja.company_id
    WHERE ja.id = job_application_logs.application_id
    AND cu.user_id = auth.uid()
    AND cu.role IN ('company_admin', 'super_admin')
    AND cu.is_active = true
  )
);

-- Company admins can insert logs for applications in their company
CREATE POLICY "Company admins can insert job application logs"
ON public.job_application_logs
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM job_applications ja
    JOIN company_users cu ON cu.company_id = ja.company_id
    WHERE ja.id = job_application_logs.application_id
    AND cu.user_id = auth.uid()
    AND cu.role IN ('company_admin', 'super_admin')
    AND cu.is_active = true
  )
);

-- Add RLS policies for hiring_answers
ALTER TABLE public.hiring_answers ENABLE ROW LEVEL SECURITY;

-- Company admins can view answers for assessments in their company
CREATE POLICY "Company admins can view hiring answers"
ON public.hiring_answers
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM hiring_assessments ha
    JOIN hiring_candidates hc ON hc.id = ha.candidate_id
    JOIN company_users cu ON cu.company_id = hc.company_id
    WHERE ha.id = hiring_answers.assessment_id
    AND cu.user_id = auth.uid()
    AND cu.role IN ('company_admin', 'super_admin')
    AND cu.is_active = true
  )
);

-- Candidates can insert their own answers (via public token - no auth required for insert)
CREATE POLICY "Anyone can insert hiring answers for valid assessments"
ON public.hiring_answers
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM hiring_assessments ha
    WHERE ha.id = hiring_answers.assessment_id
    AND ha.status IN ('pending', 'in_progress')
  )
);