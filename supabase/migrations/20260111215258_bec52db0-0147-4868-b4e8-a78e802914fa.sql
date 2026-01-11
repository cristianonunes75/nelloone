-- Add consent tracking fields to hiring_candidates
ALTER TABLE public.hiring_candidates
ADD COLUMN IF NOT EXISTS consent_given_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS consent_ip TEXT;