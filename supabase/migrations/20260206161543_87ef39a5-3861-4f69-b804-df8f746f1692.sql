-- Create RPC function to get test questions for hiring (bypasses RLS safely)
CREATE OR REPLACE FUNCTION public.get_hiring_test_questions(_test_type text)
RETURNS TABLE (
  id uuid,
  question_number int,
  question_text text,
  options jsonb
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT tq.id, tq.question_number, tq.question_text, tq.options
  FROM test_questions tq
  JOIN tests t ON t.id = tq.test_id
  WHERE t.type = _test_type::test_type
  AND t.active = true
  ORDER BY t.created_at ASC, tq.question_number ASC
  LIMIT 100;
$$;

-- Create RPC function to get hiring answers by token (for progress restoration and result calculation)
CREATE OR REPLACE FUNCTION public.get_hiring_answers_by_token(
  _token text,
  _assessment_id uuid
)
RETURNS TABLE (
  id uuid,
  question_number int,
  answer jsonb
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT ha.id, ha.question_number, ha.answer
  FROM hiring_answers ha
  JOIN hiring_assessments hass ON hass.id = ha.assessment_id
  JOIN hiring_candidates hc ON hc.id = hass.candidate_id
  WHERE ha.assessment_id = _assessment_id
  AND hc.invite_token = _token
  AND (hc.invite_expires_at IS NULL OR hc.invite_expires_at > now())
  ORDER BY ha.question_number;
$$;