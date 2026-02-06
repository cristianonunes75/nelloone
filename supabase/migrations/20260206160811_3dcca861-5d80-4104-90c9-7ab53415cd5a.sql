-- Create function to get hiring assessments by invite token
-- This allows anonymous candidates to access their assessments securely

CREATE OR REPLACE FUNCTION public.get_hiring_assessments_by_token(_token text)
RETURNS TABLE (
  id uuid,
  test_type text,
  status text,
  started_at timestamptz,
  completed_at timestamptz,
  result_data jsonb
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    ha.id,
    ha.test_type,
    ha.status,
    ha.started_at,
    ha.completed_at,
    ha.result_data
  FROM public.hiring_assessments ha
  JOIN public.hiring_candidates hc ON hc.id = ha.candidate_id
  WHERE hc.invite_token = _token
  AND (hc.invite_expires_at IS NULL OR hc.invite_expires_at > now());
$$;