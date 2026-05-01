-- 1. Allow active Discernir priests/coordinators to read all circle profiles
CREATE POLICY "Priests and coordinators can read circle profiles"
ON public.discernir_circle_profiles
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.discernir_priests dp
    WHERE dp.user_id = auth.uid()
      AND dp.is_active = true
  )
);

-- 2. Allow Nello admins to read all circle profiles (oversight)
CREATE POLICY "Admins can read circle profiles"
ON public.discernir_circle_profiles
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin'::app_role)
);

-- 3. Consolidated view for coordination dashboard
CREATE OR REPLACE VIEW public.discernir_circle_profiles_team_view
WITH (security_invoker = true)
AS
SELECT
  cp.id,
  cp.user_id,
  cp.version,
  cp.status,
  cp.primary_role,
  cp.secondary_role,
  cp.tertiary_role,
  cp.percentages,
  cp.ranking,
  cp.created_at,
  cp.updated_at,
  COALESCE(p.full_name, 'Sem nome') AS display_name
FROM public.discernir_circle_profiles cp
LEFT JOIN public.profiles p ON p.id = cp.user_id
WHERE cp.status = 'completed';

GRANT SELECT ON public.discernir_circle_profiles_team_view TO authenticated;