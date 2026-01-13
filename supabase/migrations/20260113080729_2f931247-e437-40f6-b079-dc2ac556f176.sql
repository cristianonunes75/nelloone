-- Make public_slug nullable on insert by adding a default value
-- The trigger will override this with the proper slug
ALTER TABLE public.job_postings 
  ALTER COLUMN public_slug SET DEFAULT '';