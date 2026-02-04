-- Fix SECURITY DEFINER view issue - use SECURITY INVOKER (default, but explicit)
DROP VIEW IF EXISTS public.admin_profiles_view;
CREATE VIEW public.admin_profiles_view 
WITH (security_invoker = true)
AS
SELECT 
  p.id,
  p.full_name,
  p.created_at,
  p.journey_status,
  p.journey_completed_tests,
  p.journey_total_tests,
  p.phone IS NOT NULL AS has_phone,
  m.id IS NOT NULL AS has_mapa,
  m.version AS mapa_version,
  m.created_at AS mapa_created_at,
  m.updated_at AS mapa_updated_at
FROM public.profiles p
LEFT JOIN public.mapa_essencia m ON m.user_id = p.id;

GRANT SELECT ON public.admin_profiles_view TO authenticated;
COMMENT ON VIEW public.admin_profiles_view IS 'Admin view for user metadata only. Does NOT include sensitive report content. Uses SECURITY INVOKER to respect RLS.';