ALTER TABLE public.company_team_insights
ADD COLUMN IF NOT EXISTS essence_code jsonb DEFAULT '{"total_with_journey_complete":0,"total_with_essence_code":0,"completion_rate":0}'::jsonb;