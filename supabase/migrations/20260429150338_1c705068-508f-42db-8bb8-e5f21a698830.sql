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
    CASE WHEN le.user_id IS NULL THEN ARRAY[]::text[] ELSE ARRAY(
      SELECT map_key FROM (
        VALUES
          ('disc', le.visual_data ? 'disc'),
          ('temperamentos', le.visual_data ? 'temperament'),
          ('arquetipos_proposito', le.visual_data ? 'archetypes'),
          ('inteligencias_multiplas', le.visual_data ? 'intelligences'),
          ('estilos_conexao_afetiva', le.visual_data ? 'connection_style'),
          ('eneagrama', le.visual_data ? 'enneagram'),
          ('nello16', le.visual_data ? 'nello16')
      ) AS maps(map_key, exists_flag)
      WHERE exists_flag
    ) END AS available_maps,
    '{}'::jsonb AS tests_data
  FROM eligible e
  LEFT JOIN latest_essence le ON le.user_id = e.user_id
  ORDER BY e.sort_group, e.joined_at DESC NULLS LAST, e.full_name;
$function$;

GRANT EXECUTE ON FUNCTION public.get_company_identity_team_crossing(uuid) TO authenticated;