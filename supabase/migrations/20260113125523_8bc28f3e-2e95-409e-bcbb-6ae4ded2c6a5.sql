-- Add candidate photo URL field to job_applications
ALTER TABLE public.job_applications 
ADD COLUMN IF NOT EXISTS candidate_photo_url TEXT;