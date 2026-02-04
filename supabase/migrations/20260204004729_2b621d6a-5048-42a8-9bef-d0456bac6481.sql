-- Add interview notes column to hiring_candidates
ALTER TABLE public.hiring_candidates 
ADD COLUMN interview_notes TEXT DEFAULT NULL;

-- Add interview invitation tracking columns
ALTER TABLE public.hiring_candidates 
ADD COLUMN interview_invite_sent_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
ADD COLUMN interview_scheduled_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;