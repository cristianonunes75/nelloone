-- Add entry_path column to profiles for personalized journey ordering
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS entry_path text;

-- Add comment explaining the values
COMMENT ON COLUMN public.profiles.entry_path IS 'User preference for journey order: emocional (emotional path) or pratico (practical path)';