// Types for Ativação de Direção Profissional

export type LifePhase = 
  | "first_career"
  | "change_area"
  | "align_career_life"
  | "decide_without_quitting"
  | "couple_decision";

export type ChangeHorizon = "30" | "90" | "180";

export type WorkNeed = 
  | "autonomy"
  | "impact"
  | "stability"
  | "creation"
  | "recognition"
  | "service"
  | "challenge";

export type WorkIntolerance =
  | "rigid_routine"
  | "toxic_environment"
  | "meaningless_pressure"
  | "lack_of_freedom"
  | "excessive_exposure"
  | "loneliness"
  | "constant_conflict";

export interface PathData {
  title: string;
  description: string;
  risk?: string;
  decision_type?: string;
  growth_potential?: string;
  emotional_demands?: string;
  planning_needs?: string;
  when_makes_sense?: string;
  how_to_test?: string;
}

export interface ProfessionalActivation {
  id?: string;
  user_id: string;
  language: string;
  
  // Step 1: Life phase
  life_phase: LifePhase | null;
  
  // Step 2: Problem definition
  main_doubt: string | null;
  stuck_reason: string | null;
  rewritten_decision: string | null;
  
  // Step 3: Essence reading (AI generated)
  essence_motor: string | null;
  action_mode: string | null;
  main_saboteur: string | null;
  
  // Step 4: Professional criteria
  needs_at_work: WorkNeed[];
  cannot_tolerate: WorkIntolerance[];
  hours_per_week: number | null;
  needs_income_short_term: boolean | null;
  change_horizon: ChangeHorizon | null;
  
  // Step 5: The 3 possible paths (AI generated)
  path_a: PathData | null;
  path_b: PathData | null;
  path_c: PathData | null;
  
  // Step 6: 14-day plan (AI generated)
  plan_week_1: string[];
  plan_week_2: string[];
  
  // Step 7: Closing
  direction_sentence: string | null;
  chosen_path: "A" | "B" | "C" | null;
  saboteur_to_watch: string | null;
  
  // Metadata
  status: "in_progress" | "completed";
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export type ActivationStep = 
  | "intro"
  | "life_phase"
  | "problem_definition"
  | "essence_reading"
  | "professional_criteria"
  | "paths"
  | "plan"
  | "closing"
  | "complete";

export const STEP_ORDER: ActivationStep[] = [
  "intro",
  "life_phase",
  "problem_definition",
  "essence_reading",
  "professional_criteria",
  "paths",
  "plan",
  "closing",
  "complete",
];

export interface ActivationStepProps {
  activation: Partial<ProfessionalActivation>;
  onUpdate: (updates: Partial<ProfessionalActivation>) => void;
  onNext: () => void;
  onBack: () => void;
  isLoading?: boolean;
  language?: string;
}
