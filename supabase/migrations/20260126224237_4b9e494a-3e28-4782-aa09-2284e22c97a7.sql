-- Add monetization tracking fields to profiles
-- These fields track access to specific premium modules

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS has_activation_individual boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS has_nello_couple boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS has_activation_couple boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS has_identity_couple_premium boolean DEFAULT false;

-- Add comments for documentation
COMMENT ON COLUMN public.profiles.has_activation_individual IS 'Tracks if user purchased Ativação do Código Individual';
COMMENT ON COLUMN public.profiles.has_nello_couple IS 'Tracks if user purchased Nello Couple (basic couple report)';
COMMENT ON COLUMN public.profiles.has_activation_couple IS 'Tracks if user purchased Ativação do Código do Casal';
COMMENT ON COLUMN public.profiles.has_identity_couple_premium IS 'Tracks if user purchased Identity Couple Premium (R$997 high ticket)';