-- Add coordinator-managed marker fields to circle profiles
ALTER TABLE public.discernir_circle_profiles
  ADD COLUMN IF NOT EXISTS participant_type text CHECK (participant_type IN ('casal', 'jovem')),
  ADD COLUMN IF NOT EXISTS spouse_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS coordinator_notes text;

CREATE INDEX IF NOT EXISTS idx_discernir_circle_profiles_participant_type
  ON public.discernir_circle_profiles(participant_type);

CREATE INDEX IF NOT EXISTS idx_discernir_circle_profiles_spouse_user_id
  ON public.discernir_circle_profiles(spouse_user_id);

-- Allow coordinators / priests / admins to update the marker fields
DROP POLICY IF EXISTS "Coordinators can update circle profile markers" ON public.discernir_circle_profiles;
CREATE POLICY "Coordinators can update circle profile markers"
ON public.discernir_circle_profiles
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.discernir_priests dp
    WHERE dp.user_id = auth.uid() AND dp.is_active = true
  )
  OR public.has_role(auth.uid(), 'admin'::app_role)
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.discernir_priests dp
    WHERE dp.user_id = auth.uid() AND dp.is_active = true
  )
  OR public.has_role(auth.uid(), 'admin'::app_role)
);

-- Recreate the team view to include the new fields
DROP VIEW IF EXISTS public.discernir_circle_profiles_team_view;

CREATE VIEW public.discernir_circle_profiles_team_view
WITH (security_invoker = true)
AS
SELECT
  cp.id,
  cp.user_id,
  COALESCE(NULLIF(p.full_name, ''), 'Membro da equipe') AS display_name,
  cp.primary_role,
  cp.secondary_role,
  cp.tertiary_role,
  cp.percentages,
  cp.ranking,
  cp.participant_type,
  cp.spouse_user_id,
  cp.coordinator_notes,
  cp.created_at
FROM public.discernir_circle_profiles cp
LEFT JOIN public.profiles p ON p.id = cp.user_id;