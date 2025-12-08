-- Add journey tracking fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS journey_status text NOT NULL DEFAULT 'not_started',
ADD COLUMN IF NOT EXISTS journey_total_tests integer NOT NULL DEFAULT 7,
ADD COLUMN IF NOT EXISTS journey_completed_tests integer NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS journey_tests_status jsonb NOT NULL DEFAULT '{
  "arquetipos_proposito": "not_started",
  "inteligencias_multiplas": "not_started",
  "estilos_conexao": "not_started",
  "nello16": "not_started",
  "disc": "not_started",
  "eneagrama": "not_started",
  "temperamentos": "not_started"
}'::jsonb,
ADD COLUMN IF NOT EXISTS journey_started_at timestamptz NULL,
ADD COLUMN IF NOT EXISTS journey_completed_at timestamptz NULL;

-- Add check constraint for journey_status
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_journey_status_check 
CHECK (journey_status IN ('not_started', 'in_progress', 'completed'));