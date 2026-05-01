-- Marca retroativamente o cadastro recente como Discernir
UPDATE public.profiles
SET entry_path = 'discernir'
WHERE id = 'd293cfdf-42b3-4ed9-a5fd-d632f63ebd61'
  AND (entry_path IS NULL OR entry_path = '');

-- Recria a RPC incluindo cadastros marcados como entry_path='discernir'
CREATE OR REPLACE FUNCTION public.get_discernir_team_movement()
RETURNS TABLE(
  user_id uuid,
  display_name text,
  email text,
  journey_status text,
  registered_at timestamp with time zone,
  started_at timestamp with time zone,
  completed_at timestamp with time zone,
  last_activity_at timestamp with time zone,
  profile_id uuid,
  primary_role text,
  participant_type text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH allowed AS (
    SELECT
      has_role(auth.uid(), 'admin'::app_role)
      OR EXISTS (
        SELECT 1 FROM public.discernir_priests dp
        WHERE dp.user_id = auth.uid()
          AND dp.is_active = true
      ) AS ok
  ),
  base AS (
    -- 1) consentimento individual
    SELECT c.user_id, MIN(c.granted_at) AS registered_at
    FROM public.discernir_consents c
    WHERE c.consent_type = 'individual' AND c.is_active = true
    GROUP BY c.user_id
    UNION
    -- 2) qualquer perfil (mesmo sem consent registrado)
    SELECT cp.user_id, MIN(cp.created_at) AS registered_at
    FROM public.discernir_circle_profiles cp
    GROUP BY cp.user_id
    UNION
    -- 3) cadastro feito pela área do Discernir (entry_path)
    SELECT p.id AS user_id, p.created_at AS registered_at
    FROM public.profiles p
    WHERE p.entry_path = 'discernir'
      AND COALESCE(p.is_deleted, false) = false
  ),
  agg AS (
    SELECT b.user_id, MIN(b.registered_at) AS registered_at
    FROM base b
    GROUP BY b.user_id
  )
  SELECT
    a.user_id,
    COALESCE(NULLIF(p.full_name, ''), 'Participante') AS display_name,
    COALESCE(au.email, '') AS email,
    CASE
      WHEN cp_done.id IS NOT NULL THEN 'concluido'
      WHEN cp_draft.id IS NOT NULL THEN 'em_andamento'
      ELSE 'cadastrado'
    END AS journey_status,
    a.registered_at,
    COALESCE(cp_draft.created_at, cp_done.created_at) AS started_at,
    cp_done.updated_at AS completed_at,
    GREATEST(
      a.registered_at,
      COALESCE(cp_draft.updated_at, a.registered_at),
      COALESCE(cp_done.updated_at, a.registered_at)
    ) AS last_activity_at,
    COALESCE(cp_done.id, cp_draft.id) AS profile_id,
    COALESCE(cp_done.primary_role, cp_draft.primary_role) AS primary_role,
    COALESCE(cp_done.participant_type, cp_draft.participant_type) AS participant_type
  FROM agg a
  LEFT JOIN public.profiles p ON p.id = a.user_id
  LEFT JOIN auth.users au ON au.id = a.user_id
  LEFT JOIN LATERAL (
    SELECT id, primary_role, participant_type, created_at, updated_at
    FROM public.discernir_circle_profiles
    WHERE user_id = a.user_id AND status = 'completed'
    ORDER BY updated_at DESC
    LIMIT 1
  ) cp_done ON true
  LEFT JOIN LATERAL (
    SELECT id, primary_role, participant_type, created_at, updated_at
    FROM public.discernir_circle_profiles
    WHERE user_id = a.user_id AND status = 'draft'
    ORDER BY updated_at DESC
    LIMIT 1
  ) cp_draft ON true
  WHERE (SELECT ok FROM allowed)
  ORDER BY
    CASE
      WHEN cp_done.id IS NOT NULL THEN 2
      WHEN cp_draft.id IS NOT NULL THEN 1
      ELSE 0
    END ASC,
    a.registered_at DESC;
$$;