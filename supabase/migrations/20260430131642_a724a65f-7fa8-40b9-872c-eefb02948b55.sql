CREATE OR REPLACE FUNCTION public.get_company_team_for_member(p_company_id uuid)
RETURNS TABLE(
  user_id uuid,
  full_name text,
  job_title text,
  is_self boolean,
  is_private boolean,
  has_essence_code boolean,
  essence_visual_data jsonb
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT
    cu.user_id,
    COALESCE(NULLIF(p.full_name, ''), 'Colega') AS full_name,
    cu.job_title,
    (cu.user_id = auth.uid()) AS is_self,
    (NOT COALESCE(cu.share_report_with_company, false) AND cu.user_id <> auth.uid()) AS is_private,
    (
      me.id IS NOT NULL
      AND (cu.user_id = auth.uid() OR COALESCE(cu.share_report_with_company, false))
    ) AS has_essence_code,
    CASE
      WHEN me.id IS NOT NULL
        AND (cu.user_id = auth.uid() OR COALESCE(cu.share_report_with_company, false))
      THEN me.sections
      ELSE NULL
    END AS essence_visual_data
  FROM public.company_users cu
  JOIN public.profiles p ON p.id = cu.user_id
  LEFT JOIN public.mapa_essencia me ON me.user_id = cu.user_id
  WHERE cu.company_id = p_company_id
    AND cu.is_active = true
    AND EXISTS (
      SELECT 1 FROM public.company_users me_cu
      WHERE me_cu.company_id = p_company_id
        AND me_cu.user_id = auth.uid()
        AND me_cu.is_active = true
    )
  ORDER BY (cu.user_id = auth.uid()) DESC, p.full_name ASC;
$function$;

GRANT EXECUTE ON FUNCTION public.get_company_team_for_member(uuid) TO authenticated;