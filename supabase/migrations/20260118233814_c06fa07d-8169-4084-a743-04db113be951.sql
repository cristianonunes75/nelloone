-- Fix security definer view by using SECURITY INVOKER
DROP VIEW IF EXISTS public.nello_user_profile_summary;

CREATE OR REPLACE VIEW public.nello_user_profile_summary 
WITH (security_invoker = true)
AS
SELECT 
  p.id as user_id,
  p.full_name,
  me.sections as essence_sections,
  me.created_at as essence_created_at,
  (
    SELECT jsonb_agg(
      jsonb_build_object(
        'app_source', a.app_source,
        'activity_type', a.activity_type,
        'title', a.title,
        'content', a.content,
        'created_at', a.created_at
      ) ORDER BY a.created_at DESC
    )
    FROM (
      SELECT DISTINCT ON (app_source) *
      FROM public.nello_user_activity
      WHERE user_id = p.id
      ORDER BY app_source, created_at DESC
    ) a
  ) as last_activities
FROM public.profiles p
LEFT JOIN public.mapa_essencia me ON me.user_id = p.id;

GRANT SELECT ON public.nello_user_profile_summary TO authenticated;