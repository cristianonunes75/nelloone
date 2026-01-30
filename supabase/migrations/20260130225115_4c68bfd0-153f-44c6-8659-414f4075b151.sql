-- Create ativacao_profissional table to store professional activation results
CREATE TABLE public.ativacao_profissional (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  language VARCHAR(10) NOT NULL DEFAULT 'pt',
  
  -- Step 1: Life phase
  life_phase TEXT,
  
  -- Step 2: Problem definition
  main_doubt TEXT,
  stuck_reason TEXT,
  rewritten_decision TEXT,
  
  -- Step 3: Essence reading (AI generated)
  essence_motor TEXT,
  action_mode TEXT,
  main_saboteur TEXT,
  
  -- Step 4: Professional criteria
  needs_at_work JSONB DEFAULT '[]'::jsonb, -- Array of 3 items
  cannot_tolerate JSONB DEFAULT '[]'::jsonb, -- Array of 2 items
  hours_per_week INTEGER,
  needs_income_short_term BOOLEAN,
  change_horizon TEXT, -- '30', '90', '180' days
  
  -- Step 5: The 3 possible paths (AI generated)
  path_a JSONB, -- { title, description, risk, decision_type }
  path_b JSONB, -- { title, description, growth_potential, emotional_demands, planning_needs }
  path_c JSONB, -- { title, description, when_makes_sense, how_to_test, risk }
  
  -- Step 6: 14-day plan (AI generated)
  plan_week_1 JSONB, -- Array of actions
  plan_week_2 JSONB, -- Array of actions
  
  -- Step 7: Closing
  direction_sentence TEXT,
  chosen_path TEXT, -- 'A', 'B', or 'C'
  saboteur_to_watch TEXT,
  
  -- Metadata
  status TEXT DEFAULT 'in_progress', -- 'in_progress', 'completed'
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ativacao_profissional ENABLE ROW LEVEL SECURITY;

-- User can read their own activation records
CREATE POLICY "Users can view their own professional activation"
ON public.ativacao_profissional
FOR SELECT
USING (auth.uid() = user_id);

-- User can create their own activation records
CREATE POLICY "Users can create their own professional activation"
ON public.ativacao_profissional
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- User can update their own activation records
CREATE POLICY "Users can update their own professional activation"
ON public.ativacao_profissional
FOR UPDATE
USING (auth.uid() = user_id);

-- Add has_activation_professional column to profiles if not exists
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS has_activation_professional BOOLEAN DEFAULT FALSE;

-- Trigger for auto-updating updated_at
CREATE TRIGGER update_ativacao_profissional_updated_at
BEFORE UPDATE ON public.ativacao_profissional
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for user lookups
CREATE INDEX idx_ativacao_profissional_user_id ON public.ativacao_profissional(user_id);
CREATE INDEX idx_ativacao_profissional_status ON public.ativacao_profissional(status);