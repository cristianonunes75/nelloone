CREATE OR REPLACE FUNCTION public.get_company_identity_team_crossing(p_company_id uuid)
RETURNS TABLE(
  user_id uuid,
  full_name text,
  job_title text,
  department text,
  business_role text,
  journey_status text,
  journey_completed_tests integer,
  has_essence_code boolean,
  essence_visual_data jsonb,
  available_maps text[],
  tests_data jsonb
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  WITH company_people AS (
    SELECT
      cu.user_id,
      COALESCE(NULLIF(p.full_name, ''), 'Colaboradora') AS full_name,
      cu.job_title,
      COALESCE(NULLIF(cu.department, ''), 'Equipe geral') AS department,
      cu.role::text AS business_role,
      p.journey_status::text AS journey_status,
      COALESCE(p.journey_completed_tests, 0) AS journey_completed_tests,
      NULL::uuid AS candidate_id
    FROM public.company_users cu
    JOIN public.profiles p ON p.id = cu.user_id
    WHERE cu.company_id = p_company_id
      AND cu.is_active = true
      AND cu.consent_given = true
      AND cu.share_report_with_company = true
      AND public.is_company_admin(p_company_id, auth.uid())
  ), candidate_people AS (
    SELECT
      NULL::uuid AS user_id,
      COALESCE(NULLIF(hc.full_name, ''), 'Candidata') AS full_name,
      hc.position_applied AS job_title,
      'Equipe geral'::text AS department,
      'candidate'::text AS business_role,
      hc.status::text AS journey_status,
      (COUNT(ha.id) FILTER (WHERE ha.status = 'completed'))::integer AS journey_completed_tests,
      hc.id AS candidate_id
    FROM public.hiring_candidates hc
    LEFT JOIN public.hiring_assessments ha ON ha.candidate_id = hc.id
    WHERE hc.company_id = p_company_id
      AND hc.consent_given_at IS NOT NULL
      AND public.is_company_admin(p_company_id, auth.uid())
      AND NOT EXISTS (
        SELECT 1
        FROM public.company_users cu
        JOIN public.profiles p ON p.id = cu.user_id
        WHERE cu.company_id = hc.company_id
          AND lower(COALESCE(p.full_name, '')) = lower(COALESCE(hc.full_name, ''))
      )
    GROUP BY hc.id, hc.full_name, hc.position_applied, hc.status
  ), eligible AS (
    SELECT * FROM company_people
    UNION ALL
    SELECT * FROM candidate_people
  ), latest_tests AS (
    SELECT DISTINCT ON (ut.user_id, t.type)
      ut.user_id,
      NULL::uuid AS candidate_id,
      CASE t.type::text
        WHEN 'mbti' THEN 'nello16'
        WHEN 'linguagens_amor' THEN 'estilos_conexao_afetiva'
        WHEN 'estilos_conexao' THEN 'estilos_conexao_afetiva'
        ELSE t.type::text
      END AS map_type,
      ut.result_data,
      ut.completed_at
    FROM public.user_tests ut
    JOIN public.tests t ON t.id = ut.test_id
    JOIN eligible e ON e.user_id = ut.user_id
    WHERE ut.status = 'completed'
    ORDER BY ut.user_id, t.type, ut.completed_at DESC NULLS LAST, ut.created_at DESC
  ), candidate_tests AS (
    SELECT DISTINCT ON (ha.candidate_id, ha.test_type)
      NULL::uuid AS user_id,
      ha.candidate_id,
      CASE ha.test_type
        WHEN 'mbti' THEN 'nello16'
        WHEN 'linguagens_amor' THEN 'estilos_conexao_afetiva'
        WHEN 'estilos_conexao' THEN 'estilos_conexao_afetiva'
        ELSE ha.test_type
      END AS map_type,
      ha.result_data,
      ha.completed_at
    FROM public.hiring_assessments ha
    JOIN eligible e ON e.candidate_id = ha.candidate_id
    WHERE ha.status = 'completed'
    ORDER BY ha.candidate_id, ha.test_type, ha.completed_at DESC NULLS LAST, ha.started_at DESC
  ), all_tests AS (
    SELECT * FROM latest_tests
    UNION ALL
    SELECT * FROM candidate_tests
  ), tests_grouped AS (
    SELECT
      COALESCE(user_id, candidate_id) AS person_key,
      array_agg(map_type ORDER BY map_type) AS available_maps,
      jsonb_object_agg(
        map_type,
        jsonb_build_object('result_data', result_data, 'completed_at', completed_at)
      ) AS tests_data
    FROM all_tests
    GROUP BY COALESCE(user_id, candidate_id)
  ), latest_essence AS (
    SELECT DISTINCT ON (me.user_id)
      me.user_id,
      COALESCE((
        SELECT section->'visual_data'
        FROM jsonb_array_elements(COALESCE(me.sections, '[]'::jsonb)) section
        WHERE section ? 'visual_data'
        LIMIT 1
      ), '{}'::jsonb) AS visual_data
    FROM public.mapa_essencia me
    JOIN eligible e ON e.user_id = me.user_id
    ORDER BY me.user_id, me.created_at DESC
  )
  SELECT
    COALESCE(e.user_id, e.candidate_id) AS user_id,
    e.full_name,
    e.job_title,
    e.department,
    e.business_role,
    e.journey_status,
    e.journey_completed_tests,
    le.user_id IS NOT NULL AS has_essence_code,
    COALESCE(le.visual_data, '{}'::jsonb) AS essence_visual_data,
    COALESCE(tg.available_maps, ARRAY[]::text[]) AS available_maps,
    COALESCE(tg.tests_data, '{}'::jsonb) AS tests_data
  FROM eligible e
  LEFT JOIN tests_grouped tg ON tg.person_key = COALESCE(e.user_id, e.candidate_id)
  LEFT JOIN latest_essence le ON le.user_id = e.user_id
  WHERE e.user_id IS NOT NULL OR COALESCE(array_length(tg.available_maps, 1), 0) > 0
  ORDER BY e.department, e.job_title, e.full_name;
$function$;