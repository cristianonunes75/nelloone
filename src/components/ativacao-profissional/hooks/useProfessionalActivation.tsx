import { useState, useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { 
  ProfessionalActivation, 
  ActivationStep, 
  STEP_ORDER,
  PathData,
  LifePhase,
  ChangeHorizon,
  WorkNeed,
  WorkIntolerance,
} from "../types";
import { Json } from "@/integrations/supabase/types";

// Helper to convert database row to typed activation
function parseActivationFromDB(row: any): ProfessionalActivation {
  return {
    id: row.id,
    user_id: row.user_id,
    language: row.language,
    life_phase: row.life_phase as LifePhase | null,
    main_doubt: row.main_doubt,
    stuck_reason: row.stuck_reason,
    rewritten_decision: row.rewritten_decision,
    essence_motor: row.essence_motor,
    action_mode: row.action_mode,
    main_saboteur: row.main_saboteur,
    needs_at_work: (row.needs_at_work || []) as WorkNeed[],
    cannot_tolerate: (row.cannot_tolerate || []) as WorkIntolerance[],
    hours_per_week: row.hours_per_week,
    needs_income_short_term: row.needs_income_short_term,
    change_horizon: row.change_horizon as ChangeHorizon | null,
    path_a: row.path_a as PathData | null,
    path_b: row.path_b as PathData | null,
    path_c: row.path_c as PathData | null,
    plan_week_1: (row.plan_week_1 || []) as string[],
    plan_week_2: (row.plan_week_2 || []) as string[],
    direction_sentence: row.direction_sentence,
    chosen_path: row.chosen_path as "A" | "B" | "C" | null,
    saboteur_to_watch: row.saboteur_to_watch,
    status: row.status as "in_progress" | "completed",
    completed_at: row.completed_at,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

// Helper to convert typed activation to database format
function prepareActivationForDB(data: Partial<ProfessionalActivation>): Record<string, Json | string | number | boolean | null> {
  const result: Record<string, Json | string | number | boolean | null> = {};
  
  if (data.language !== undefined) result.language = data.language;
  if (data.life_phase !== undefined) result.life_phase = data.life_phase;
  if (data.main_doubt !== undefined) result.main_doubt = data.main_doubt;
  if (data.stuck_reason !== undefined) result.stuck_reason = data.stuck_reason;
  if (data.rewritten_decision !== undefined) result.rewritten_decision = data.rewritten_decision;
  if (data.essence_motor !== undefined) result.essence_motor = data.essence_motor;
  if (data.action_mode !== undefined) result.action_mode = data.action_mode;
  if (data.main_saboteur !== undefined) result.main_saboteur = data.main_saboteur;
  if (data.needs_at_work !== undefined) result.needs_at_work = data.needs_at_work as unknown as Json;
  if (data.cannot_tolerate !== undefined) result.cannot_tolerate = data.cannot_tolerate as unknown as Json;
  if (data.hours_per_week !== undefined) result.hours_per_week = data.hours_per_week;
  if (data.needs_income_short_term !== undefined) result.needs_income_short_term = data.needs_income_short_term;
  if (data.change_horizon !== undefined) result.change_horizon = data.change_horizon;
  if (data.path_a !== undefined) result.path_a = data.path_a as unknown as Json;
  if (data.path_b !== undefined) result.path_b = data.path_b as unknown as Json;
  if (data.path_c !== undefined) result.path_c = data.path_c as unknown as Json;
  if (data.plan_week_1 !== undefined) result.plan_week_1 = data.plan_week_1 as unknown as Json;
  if (data.plan_week_2 !== undefined) result.plan_week_2 = data.plan_week_2 as unknown as Json;
  if (data.direction_sentence !== undefined) result.direction_sentence = data.direction_sentence;
  if (data.chosen_path !== undefined) result.chosen_path = data.chosen_path;
  if (data.saboteur_to_watch !== undefined) result.saboteur_to_watch = data.saboteur_to_watch;
  if (data.status !== undefined) result.status = data.status;
  if (data.completed_at !== undefined) result.completed_at = data.completed_at;
  
  return result;
}

export function useProfessionalActivation() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState<ActivationStep>("intro");
  const [localData, setLocalData] = useState<Partial<ProfessionalActivation>>({});

  // Fetch existing activation or create new one
  const { data: activation, isLoading } = useQuery({
    queryKey: ["professional-activation", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ativacao_profissional")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("Error fetching activation:", error);
        return null;
      }

      if (!data) return null;
      return parseActivationFromDB(data);
    },
  });

  // Initialize local data from fetched activation
  useEffect(() => {
    if (activation) {
      setLocalData(activation);
      // Determine current step based on progress
      if (activation.status === "completed") {
        setCurrentStep("complete");
      } else if (activation.direction_sentence) {
        setCurrentStep("closing");
      } else if (activation.path_a) {
        setCurrentStep("plan");
      } else if (activation.essence_motor) {
        setCurrentStep("professional_criteria");
      } else if (activation.main_doubt) {
        setCurrentStep("essence_reading");
      } else if (activation.life_phase) {
        setCurrentStep("problem_definition");
      } else {
        setCurrentStep("intro");
      }
    }
  }, [activation]);

  // Create new activation
  const createActivation = useMutation({
    mutationFn: async (language: string) => {
      if (!user?.id) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("ativacao_profissional")
        .insert({
          user_id: user.id,
          language,
          status: "in_progress",
          needs_at_work: [],
          cannot_tolerate: [],
          plan_week_1: [],
          plan_week_2: [],
        })
        .select()
        .single();

      if (error) throw error;
      return parseActivationFromDB(data);
    },
    onSuccess: (data) => {
      setLocalData(data);
      queryClient.invalidateQueries({ queryKey: ["professional-activation"] });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível iniciar a ativação",
        variant: "destructive",
      });
      console.error("Error creating activation:", error);
    },
  });

  // Update activation
  const updateActivation = useMutation({
    mutationFn: async (updates: Partial<ProfessionalActivation>) => {
      if (!localData.id) throw new Error("No activation ID");

      const dbUpdates = prepareActivationForDB(updates);
      
      const { error } = await supabase
        .from("ativacao_profissional")
        .update(dbUpdates)
        .eq("id", localData.id);

      if (error) throw error;
      return updates;
    },
    onSuccess: (updates) => {
      setLocalData(prev => ({ ...prev, ...updates }));
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível salvar o progresso",
        variant: "destructive",
      });
      console.error("Error updating activation:", error);
    },
  });

  // Complete activation
  const completeActivation = useMutation({
    mutationFn: async () => {
      if (!localData.id || !user?.id) throw new Error("No activation ID");

      // Update activation status
      const { error: activationError } = await supabase
        .from("ativacao_profissional")
        .update({
          status: "completed",
          completed_at: new Date().toISOString(),
        })
        .eq("id", localData.id);

      if (activationError) throw activationError;

      // Mark product as unlocked in profile
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ has_activation_professional: true })
        .eq("id", user.id);

      if (profileError) {
        console.error("Error updating profile:", profileError);
        // Don't throw - activation is still complete
      }

      return true;
    },
    onSuccess: () => {
      setLocalData(prev => ({ ...prev, status: "completed" }));
      setCurrentStep("complete");
      queryClient.invalidateQueries({ queryKey: ["professional-activation"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível finalizar a ativação",
        variant: "destructive",
      });
      console.error("Error completing activation:", error);
    },
  });

  // Local update (for controlled inputs)
  const updateLocalData = useCallback((updates: Partial<ProfessionalActivation>) => {
    setLocalData(prev => ({ ...prev, ...updates }));
  }, []);

  // Save and go to next step
  const goToNextStep = useCallback(async () => {
    const currentIndex = STEP_ORDER.indexOf(currentStep);
    if (currentIndex < STEP_ORDER.length - 1) {
      // Save current data before moving to next step
      if (localData.id) {
        await updateActivation.mutateAsync(localData);
      }
      setCurrentStep(STEP_ORDER[currentIndex + 1]);
    }
  }, [currentStep, localData, updateActivation]);

  // Go to previous step
  const goToPreviousStep = useCallback(() => {
    const currentIndex = STEP_ORDER.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(STEP_ORDER[currentIndex - 1]);
    }
  }, [currentStep]);

  // Get step progress
  const getProgress = useCallback(() => {
    const currentIndex = STEP_ORDER.indexOf(currentStep);
    return {
      current: currentIndex + 1,
      total: STEP_ORDER.length,
      percentage: ((currentIndex + 1) / STEP_ORDER.length) * 100,
    };
  }, [currentStep]);

  return {
    activation: localData,
    currentStep,
    isLoading,
    isSaving: updateActivation.isPending || completeActivation.isPending,
    createActivation: createActivation.mutate,
    updateActivation: updateLocalData,
    saveAndNext: goToNextStep,
    goBack: goToPreviousStep,
    completeActivation: completeActivation.mutate,
    getProgress,
    setCurrentStep,
  };
}
