-- Add ideal_profile column to job_postings for storing business context and matching criteria
ALTER TABLE public.job_postings 
ADD COLUMN IF NOT EXISTS ideal_profile JSONB DEFAULT NULL;

-- Comment explaining the structure
COMMENT ON COLUMN public.job_postings.ideal_profile IS 'Stores business context and ideal profile settings for candidate matching. Structure: { business_segment, ticket_size, decision_type, customer_emotional_state, customer_arrival_mode, seller_main_skill, relationship_level, operation_rhythm, goal_pressure, has_individual_goals, culture_values, team_preference }';
