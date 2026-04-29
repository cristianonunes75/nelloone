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
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  WITH company_people AS (
    SELECT
      cu.user_id,
      COALESCE(NULLIF(p.full_name, ''), 'Colaboradora') AS full_name,
      cu.job_title,
      COALESCE(NULLIF(cu.department, ''), CASE WHEN cu.job_title ILIKE '%vended%' THEN 'Vendas' ELSE 'Equipe geral' END) AS department,
      cu.role::text AS business_role,
      p.journey_status::text AS journey_status,
      COALESCE(p.journey_completed_tests, 0) AS journey_completed_tests,
      cu.joined_at,
      0 AS sort_group
    FROM public.company_users cu
    JOIN public.profiles p ON p.id = cu.user_id
    WHERE cu.company_id = p_company_id
      AND cu.is_active = true
      AND public.is_company_admin(p_company_id, auth.uid())
  ), pending_invites AS (
    SELECT
      NULL::uuid AS user_id,
      COALESCE(NULLIF(split_part(ci.email, '@', 1), ''), 'Convite pendente') AS full_name,
      NULL::text AS job_title,
      'Equipe geral'::text AS department,
      ci.role::text AS business_role,
      'pending_invite'::text AS journey_status,
      0::integer AS journey_completed_tests,
      ci.sent_at AS joined_at,
      1 AS sort_group
    FROM public.company_invites ci
    WHERE ci.company_id = p_company_id
      AND ci.status = 'pending'
      AND public.is_company_admin(p_company_id, auth.uid())
  ), eligible AS (
    SELECT * FROM company_people
    UNION ALL
    SELECT * FROM pending_invites
  ), latest_tests AS (
    SELECT DISTINCT ON (ut.user_id, t.type)
      ut.user_id,
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
    JOIN company_people e ON e.user_id = ut.user_id
    WHERE ut.status = 'completed'
    ORDER BY ut.user_id, t.type, ut.completed_at DESC NULLS LAST, ut.created_at DESC
  ), tests_grouped AS (
    SELECT
      user_id AS person_key,
      array_agg(map_type ORDER BY map_type) AS available_maps,
      jsonb_object_agg(
        map_type,
        jsonb_build_object('result_data', result_data, 'completed_at', completed_at)
      ) AS tests_data
    FROM latest_tests
    GROUP BY user_id
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
    JOIN company_people e ON e.user_id = me.user_id
    ORDER BY me.user_id, me.created_at DESC
  )
  SELECT
    e.user_id,
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
  LEFT JOIN tests_grouped tg ON tg.person_key = e.user_id
  LEFT JOIN latest_essence le ON le.user_id = e.user_id
  ORDER BY e.sort_group, e.joined_at DESC NULLS LAST, e.full_name;
$function$;

GRANT EXECUTE ON FUNCTION public.get_company_identity_team_crossing(uuid) TO authenticated;