CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_pending RECORD;
  v_test RECORD;
  v_hiring_candidate RECORD;
  v_disc_test_id uuid;
  v_temperamentos_test_id uuid;
  v_disc_result jsonb;
  v_temperamentos_result jsonb;
  v_completed_count integer := 0;
  v_status jsonb := '{"disc":"not_started","nello16":"not_started","eneagrama":"not_started","temperamentos":"not_started","estilos_conexao":"not_started","arquetipos_proposito":"not_started","inteligencias_multiplas":"not_started"}'::jsonb;
BEGIN
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', '')
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'cliente');
  
  SELECT * INTO v_pending
  FROM public.pending_cortesia_grants
  WHERE lower(email) = lower(NEW.email)
  AND status = 'pending'
  LIMIT 1;
  
  IF FOUND THEN
    FOR v_test IN
      SELECT id FROM public.tests WHERE active = true
    LOOP
      INSERT INTO public.test_purchases (user_id, test_id, payment_status, payment_method, price_paid, currency, purchase_category)
      VALUES (NEW.id, v_test.id, 'completed', 'founder_grant', 0, 'BRL', 'jornada_completa')
      ON CONFLICT DO NOTHING;
    END LOOP;
    
    UPDATE public.profiles
    SET ativacao_codigo_unlocked = true
    WHERE id = NEW.id;
    
    UPDATE public.pending_cortesia_grants
    SET status = 'processed', processed_at = now(), processed_user_id = NEW.id
    WHERE id = v_pending.id;
  END IF;

  SELECT * INTO v_hiring_candidate
  FROM public.hiring_candidates
  WHERE lower(email) = lower(NEW.email)
  ORDER BY created_at DESC
  LIMIT 1;

  IF FOUND THEN
    SELECT id INTO v_disc_test_id
    FROM public.tests
    WHERE type = 'disc' AND active = true
    ORDER BY created_at DESC
    LIMIT 1;

    SELECT id INTO v_temperamentos_test_id
    FROM public.tests
    WHERE type = 'temperamentos' AND active = true
    ORDER BY created_at DESC
    LIMIT 1;

    SELECT result_data INTO v_disc_result
    FROM public.hiring_assessments
    WHERE candidate_id = v_hiring_candidate.id
      AND test_type = 'disc'
      AND status = 'completed'
    ORDER BY completed_at DESC
    LIMIT 1;

    SELECT result_data INTO v_temperamentos_result
    FROM public.hiring_assessments
    WHERE candidate_id = v_hiring_candidate.id
      AND test_type = 'temperamentos'
      AND status = 'completed'
    ORDER BY completed_at DESC
    LIMIT 1;

    IF v_disc_test_id IS NOT NULL AND v_disc_result IS NOT NULL THEN
      INSERT INTO public.user_tests (
        user_id,
        test_id,
        status,
        started_at,
        completed_at,
        result_data,
        scoring_version,
        identity_version
      ) VALUES (
        NEW.id,
        v_disc_test_id,
        'completed',
        now(),
        now(),
        jsonb_build_object(
          'primary', v_disc_result->>'primary',
          'dominantProfile', v_disc_result->>'primary',
          'secondary', v_disc_result->>'secondary',
          'scores', COALESCE(v_disc_result->'scores', '{}'::jsonb),
          'percentages', COALESCE(v_disc_result->'percentages', '{}'::jsonb),
          'source', 'hiring_reuse',
          'hiring_candidate_id', v_hiring_candidate.id
        ),
        COALESCE(v_disc_result->>'algorithm_version', 'hiring_disc_v2'),
        'business_import'
      ) ON CONFLICT DO NOTHING;
      v_completed_count := v_completed_count + 1;
      v_status := jsonb_set(v_status, '{disc}', '"completed"'::jsonb, true);
    END IF;

    IF v_temperamentos_test_id IS NOT NULL AND v_temperamentos_result IS NOT NULL THEN
      INSERT INTO public.user_tests (
        user_id,
        test_id,
        status,
        started_at,
        completed_at,
        result_data,
        scoring_version,
        identity_version
      ) VALUES (
        NEW.id,
        v_temperamentos_test_id,
        'completed',
        now(),
        now(),
        v_temperamentos_result || jsonb_build_object(
          'source', 'hiring_reuse',
          'hiring_candidate_id', v_hiring_candidate.id
        ),
        COALESCE(v_temperamentos_result->>'algorithm_version', 'temperamentos_v2_2025_12_26'),
        'business_import'
      ) ON CONFLICT DO NOTHING;
      v_completed_count := v_completed_count + 1;
      v_status := jsonb_set(v_status, '{temperamentos}', '"completed"'::jsonb, true);
    END IF;

    IF v_completed_count > 0 THEN
      UPDATE public.profiles
      SET
        journey_status = 'in_progress',
        journey_started_at = COALESCE(journey_started_at, now()),
        journey_completed_tests = GREATEST(journey_completed_tests, v_completed_count),
        journey_tests_status = journey_tests_status || v_status,
        updated_at = now()
      WHERE id = NEW.id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$function$;