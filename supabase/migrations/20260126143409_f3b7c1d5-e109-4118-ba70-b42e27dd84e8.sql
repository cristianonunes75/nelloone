-- =====================================================
-- FIX HIRING RLS POLICIES + ENABLE REALTIME MONITORING
-- =====================================================

-- 1. Drop existing restrictive policies on hiring_answers
DROP POLICY IF EXISTS "Secure answer insert" ON public.hiring_answers;
DROP POLICY IF EXISTS "Secure answer update" ON public.hiring_answers;
DROP POLICY IF EXISTS "hiring_answers_insert_policy" ON public.hiring_answers;
DROP POLICY IF EXISTS "hiring_answers_update_policy" ON public.hiring_answers;

-- 2. Create new INSERT policy that allows 'in_progress' status
CREATE POLICY "Candidates can insert answers during assessment" 
ON public.hiring_answers
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.hiring_assessments ha
    JOIN public.hiring_candidates hc ON hc.id = ha.candidate_id
    WHERE ha.id = hiring_answers.assessment_id
    AND hc.invite_token IS NOT NULL
    AND hc.status IN ('pending', 'assessment_sent', 'assessment_started', 'in_progress')
  )
  OR EXISTS (
    SELECT 1 FROM public.company_users cu
    JOIN public.hiring_candidates hc ON hc.company_id = cu.company_id
    JOIN public.hiring_assessments ha ON ha.candidate_id = hc.id
    WHERE ha.id = hiring_answers.assessment_id
    AND cu.user_id = auth.uid()
    AND cu.role IN ('company_admin', 'super_admin')
    AND cu.is_active = true
  )
);

-- 3. Create UPDATE policy (NEW - was missing!)
CREATE POLICY "Candidates can update their own answers" 
ON public.hiring_answers
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.hiring_assessments ha
    JOIN public.hiring_candidates hc ON hc.id = ha.candidate_id
    WHERE ha.id = hiring_answers.assessment_id
    AND hc.invite_token IS NOT NULL
    AND hc.status IN ('pending', 'assessment_sent', 'assessment_started', 'in_progress')
  )
  OR EXISTS (
    SELECT 1 FROM public.company_users cu
    JOIN public.hiring_candidates hc ON hc.company_id = cu.company_id
    JOIN public.hiring_assessments ha ON ha.candidate_id = hc.id
    WHERE ha.id = hiring_answers.assessment_id
    AND cu.user_id = auth.uid()
    AND cu.role IN ('company_admin', 'super_admin')
    AND cu.is_active = true
  )
);

-- 4. Fix hiring_assessments UPDATE policy to include 'in_progress'
DROP POLICY IF EXISTS "Secure assessment update" ON public.hiring_assessments;
DROP POLICY IF EXISTS "hiring_assessments_update_policy" ON public.hiring_assessments;

CREATE POLICY "Candidates and admins can update assessments" 
ON public.hiring_assessments
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.hiring_candidates hc
    WHERE hc.id = hiring_assessments.candidate_id
    AND hc.invite_token IS NOT NULL
    AND hc.status IN ('pending', 'assessment_sent', 'assessment_started', 'in_progress')
  )
  OR EXISTS (
    SELECT 1 FROM public.company_users cu
    JOIN public.hiring_candidates hc ON hc.company_id = cu.company_id
    WHERE hc.id = hiring_assessments.candidate_id
    AND cu.user_id = auth.uid()
    AND cu.role IN ('company_admin', 'super_admin')
    AND cu.is_active = true
  )
);

-- 5. Add column to track current question progress (for real-time monitoring)
ALTER TABLE public.hiring_assessments 
ADD COLUMN IF NOT EXISTS current_question_number integer DEFAULT 0;

ALTER TABLE public.hiring_assessments 
ADD COLUMN IF NOT EXISTS last_activity_at timestamp with time zone DEFAULT now();

-- 6. Enable Realtime for monitoring
ALTER PUBLICATION supabase_realtime ADD TABLE public.hiring_assessments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.hiring_candidates;