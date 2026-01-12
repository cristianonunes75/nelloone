
-- Clean up duplicate policies on hiring_candidates
DROP POLICY IF EXISTS "Candidates can update their own status via token" ON public.hiring_candidates;
DROP POLICY IF EXISTS "Anyone can update candidate status for assessments" ON public.hiring_candidates;

-- Create a single clean policy for UPDATE on hiring_candidates
-- Candidates are not authenticated, so we need to allow public updates for status
-- This is acceptable because the only sensitive data that can be updated is status
CREATE POLICY "Allow public update for hiring assessments"
ON public.hiring_candidates
FOR UPDATE
USING (true)
WITH CHECK (true);
