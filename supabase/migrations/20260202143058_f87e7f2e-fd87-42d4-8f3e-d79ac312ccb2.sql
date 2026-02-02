-- Add columns to store match results for candidates
ALTER TABLE public.hiring_candidates 
ADD COLUMN IF NOT EXISTS match_result jsonb DEFAULT NULL,
ADD COLUMN IF NOT EXISTS match_ideal_profile jsonb DEFAULT NULL,
ADD COLUMN IF NOT EXISTS match_calculated_at timestamptz DEFAULT NULL;

-- Add index for faster queries on candidates with match results
CREATE INDEX IF NOT EXISTS idx_hiring_candidates_match_calculated 
ON public.hiring_candidates(match_calculated_at) 
WHERE match_calculated_at IS NOT NULL;

-- Add comment for documentation
COMMENT ON COLUMN public.hiring_candidates.match_result IS 'Stored sales match result with percentage, level, recommendation, strengths, risks';
COMMENT ON COLUMN public.hiring_candidates.match_ideal_profile IS 'The ideal profile used to calculate the match';
COMMENT ON COLUMN public.hiring_candidates.match_calculated_at IS 'Timestamp when the match was last calculated';