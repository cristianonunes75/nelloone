CREATE OR REPLACE FUNCTION public.get_company_behavioral_comparison(p_company_id uuid)
RETURNS TABLE (
  user_id uuid,
  full_name text,
  job_title text,
  department text,
  disc_profile text,
  disc_secondary text,
  disc_scores jsonb,
  disc_percentages jsonb,
  disc_completed_at timestamptz,
  temperament_profile text,
  temperament_secondary text,
  temperament_scores jsonb,
  temperament_ranking jsonb,
  temperament_completed_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    cu.user_id,
    COALESCE(NULLIF(p.full_name, ''), 'Colaboradora') AS full_name,
    cu.job_title,
    cu.department,
    COALESCE(
      disc.result_data->>'primary',
      disc.result_data->>'dominantProfile',
      disc.result_data->>'primaryProfile'
    ) AS disc_profile,
    COALESCE(
      disc.result_data->>'secondary',
      disc.result_data->>'secondaryProfile'
    ) AS disc_secondary,
    COALESCE(disc.result_data->'scores', '{}'::jsonb) AS disc_scores,
    COALESCE(disc.result_data->'percentages', disc.result_data->'scores', '{}'::jsonb) AS disc_percentages,
    disc.completed_at AS disc_completed_at,
    COALESCE(
      temp.result_data->'primary'->>'temperament',
      temp.result_data->>'primary',
      temp.result_data->>'dominantTemperament'
    ) AS temperament_profile,
    COALESCE(
      temp.result_data->'secondary'->>'temperament',
      temp.result_data->>'secondary',
      temp.result_data->>'secondaryTemperament'
    ) AS temperament_secondary,
    COALESCE(temp.result_data->'scores', temp.result_data->'percentages', '{}'::jsonb) AS temperament_scores,
    COALESCE(temp.result_data->'ranking', '[]'::jsonb) AS temperament_ranking,
    temp.completed_at AS temperament_completed_at
  FROM public.company_users cu
  JOIN public.profiles p ON p.id = cu.user_id
  LEFT JOIN LATERAL (
    SELECT ut.result_data, ut.completed_at
    FROM public.user_tests ut
    JOIN public.tests t ON t.id = ut.test_id
    WHERE ut.user_id = cu.user_id
      AND ut.status = 'completed'
      AND t.type = 'disc'
    ORDER BY ut.completed_at DESC NULLS LAST, ut.created_at DESC
    LIMIT 1
  ) disc ON true
  LEFT JOIN LATERAL (
    SELECT ut.result_data, ut.completed_at
    FROM public.user_tests ut
    JOIN public.tests t ON t.id = ut.test_id
    WHERE ut.user_id = cu.user_id
      AND ut.status = 'completed'
      AND t.type = 'temperamentos'
    ORDER BY ut.completed_at DESC NULLS LAST, ut.created_at DESC
    LIMIT 1
  ) temp ON true
  WHERE cu.company_id = p_company_id
    AND cu.role = 'collaborator'
    AND cu.is_active = true
    AND cu.consent_given = true
    AND cu.share_report_with_company = true
    AND public.is_company_admin(p_company_id, auth.uid())
  ORDER BY p.full_name;
$$;

GRANT EXECUTE ON FUNCTION public.get_company_behavioral_comparison(uuid) TO authenticated;