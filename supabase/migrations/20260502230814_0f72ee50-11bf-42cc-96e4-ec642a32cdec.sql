ALTER TABLE public.discernir_circle_profiles
  ADD COLUMN IF NOT EXISTS birth_date date;

DROP VIEW IF EXISTS public.discernir_circle_profiles_team_view;

CREATE VIEW public.discernir_circle_profiles_team_view
WITH (security_invoker = true)
AS
SELECT
  cp.id,
  cp.user_id,
  COALESCE(NULLIF(p.full_name, ''), 'Participante') AS display_name,
  cp.primary_role,
  cp.secondary_role,
  cp.tertiary_role,
  cp.percentages,
  cp.ranking,
  cp.participant_type,
  cp.spouse_user_id,
  cp.gender,
  cp.birth_date,
  cp.coordinator_notes,
  cp.created_at
FROM public.discernir_circle_profiles cp
LEFT JOIN public.profiles p ON p.id = cp.user_id
WHERE cp.status = 'completed'
  AND (
    public.has_role(auth.uid(), 'admin'::app_role)
    OR EXISTS (
      SELECT 1 FROM public.discernir_priests dp
      WHERE dp.user_id = auth.uid() AND dp.is_active = true
    )
  );