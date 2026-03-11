-- Fix Rayssa's invite: mark as accepted and add her to company_users
-- (Safe for fresh installs: skips if company/user doesn't exist)
UPDATE public.company_invites
SET status = 'accepted', accepted_at = now(), accepted_by = '02231090-7f06-41fc-bec6-537b08d38c4d'
WHERE email = 'rayssasamarafm@gmail.com' AND status = 'pending';

DO $$
BEGIN
  INSERT INTO public.company_users (company_id, user_id, role, is_active, consent_given, consent_given_at, consent_text_version, joined_at, onboarding_completed)
  VALUES ('018b7789-38b3-4986-80ef-cca752d612e2', '02231090-7f06-41fc-bec6-537b08d38c4d', 'collaborator', true, true, now(), '1.0', now(), false)
  ON CONFLICT DO NOTHING;
EXCEPTION WHEN foreign_key_violation THEN
  NULL; -- Skip if company or user doesn't exist in fresh install
END $$;