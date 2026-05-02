DROP VIEW public.discernir_circle_profiles_team_view;
CREATE VIEW public.discernir_circle_profiles_team_view AS
SELECT cp.id,
       cp.user_id,
       COALESCE(NULLIF(p.full_name, ''::text), 'Membro da equipe'::text) AS display_name,
       cp.primary_role,
       cp.secondary_role,
       cp.tertiary_role,
       cp.percentages,
       cp.ranking,
       cp.participant_type,
       cp.spouse_user_id,
       cp.gender,
       cp.coordinator_notes,
       cp.created_at
FROM discernir_circle_profiles cp
LEFT JOIN profiles p ON p.id = cp.user_id;