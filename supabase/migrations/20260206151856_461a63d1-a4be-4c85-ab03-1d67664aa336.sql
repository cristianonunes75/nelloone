-- Create SECURITY DEFINER functions for anonymous candidate assessment flow
-- These allow candidates to save progress without authentication by validating their invite token

-- Function 1: Save individual answer
CREATE OR REPLACE FUNCTION public.save_hiring_answer(
  _invite_token text,
  _assessment_id uuid,
  _question_id uuid,
  _question_number integer,
  _answer jsonb
) RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public' AS $$
DECLARE
  v_candidate_id uuid;
BEGIN
  -- Validate token and get candidate
  SELECT id INTO v_candidate_id FROM hiring_candidates
  WHERE invite_token = _invite_token
  AND (invite_expires_at IS NULL OR invite_expires_at > now());
  
  IF v_candidate_id IS NULL THEN
    RAISE NOTICE 'Invalid or expired invite token';
    RETURN false;
  END IF;
  
  -- Verify assessment belongs to this candidate
  IF NOT EXISTS (
    SELECT 1 FROM hiring_assessments 
    WHERE id = _assessment_id AND candidate_id = v_candidate_id
  ) THEN
    RAISE NOTICE 'Assessment does not belong to candidate';
    RETURN false;
  END IF;
  
  -- Upsert answer
  INSERT INTO hiring_answers (assessment_id, question_id, question_number, answer)
  VALUES (_assessment_id, _question_id, _question_number, _answer)
  ON CONFLICT (assessment_id, question_number) 
  DO UPDATE SET answer = EXCLUDED.answer, question_id = EXCLUDED.question_id;
  
  -- Update last activity timestamp on assessment
  UPDATE hiring_assessments 
  SET last_activity_at = now(), current_question_number = _question_number
  WHERE id = _assessment_id;
  
  RETURN true;
END;
$$;

-- Function 2: Start assessment (transition to in_progress)
CREATE OR REPLACE FUNCTION public.start_hiring_assessment(
  _invite_token text,
  _assessment_id uuid
) RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public' AS $$
DECLARE
  v_candidate_id uuid;
BEGIN
  -- Validate token
  SELECT id INTO v_candidate_id FROM hiring_candidates
  WHERE invite_token = _invite_token
  AND (invite_expires_at IS NULL OR invite_expires_at > now());
  
  IF v_candidate_id IS NULL THEN
    RETURN false;
  END IF;
  
  -- Verify assessment belongs to candidate
  IF NOT EXISTS (
    SELECT 1 FROM hiring_assessments 
    WHERE id = _assessment_id AND candidate_id = v_candidate_id
  ) THEN
    RETURN false;
  END IF;
  
  -- Update assessment status
  UPDATE hiring_assessments
  SET 
    status = 'in_progress',
    started_at = COALESCE(started_at, now()),
    last_activity_at = now()
  WHERE id = _assessment_id;
  
  -- Update candidate status if still pending/invited
  UPDATE hiring_candidates
  SET status = 'in_progress'
  WHERE id = v_candidate_id
  AND status IN ('pending', 'invited');
  
  RETURN true;
END;
$$;

-- Function 3: Complete assessment with results
CREATE OR REPLACE FUNCTION public.complete_hiring_assessment(
  _invite_token text,
  _assessment_id uuid,
  _result_data jsonb,
  _algorithm_version text DEFAULT NULL
) RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public' AS $$
DECLARE
  v_candidate_id uuid;
  v_all_completed boolean;
BEGIN
  -- Validate token
  SELECT id INTO v_candidate_id FROM hiring_candidates
  WHERE invite_token = _invite_token
  AND (invite_expires_at IS NULL OR invite_expires_at > now());
  
  IF v_candidate_id IS NULL THEN
    RAISE NOTICE 'Invalid token for complete_hiring_assessment';
    RETURN false;
  END IF;
  
  -- Verify assessment belongs to candidate
  IF NOT EXISTS (
    SELECT 1 FROM hiring_assessments 
    WHERE id = _assessment_id AND candidate_id = v_candidate_id
  ) THEN
    RAISE NOTICE 'Assessment does not belong to candidate';
    RETURN false;
  END IF;
  
  -- Update assessment with results
  UPDATE hiring_assessments
  SET 
    status = 'completed',
    completed_at = now(),
    result_data = _result_data,
    algorithm_version = _algorithm_version,
    last_activity_at = now()
  WHERE id = _assessment_id;
  
  -- Check if all assessments for this candidate are completed
  SELECT NOT EXISTS (
    SELECT 1 FROM hiring_assessments 
    WHERE candidate_id = v_candidate_id 
    AND status != 'completed'
  ) INTO v_all_completed;
  
  -- Update candidate status if all tests done
  IF v_all_completed THEN
    UPDATE hiring_candidates
    SET status = 'completed', updated_at = now()
    WHERE id = v_candidate_id;
  END IF;
  
  RETURN true;
END;
$$;

-- Grant execute permissions (functions use SECURITY DEFINER so this is safe)
GRANT EXECUTE ON FUNCTION public.save_hiring_answer TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.start_hiring_assessment TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.complete_hiring_assessment TO anon, authenticated;