import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface ProgressiveFunnelState {
  // Journey status
  journeyCompleted: boolean;
  hasSavedCodigo: boolean;
  
  // Product access
  hasActivationIndividual: boolean;
  hasNelloCouple: boolean;
  hasActivationCouple: boolean;
  hasIdentityCouplePremium: boolean;
  
  // Couple crossing status
  hasCompletedCruzamento: boolean;
  
  // Loading state
  isLoading: boolean;
}

export function useProgressiveFunnel(): ProgressiveFunnelState {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["progressive-funnel", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      if (!user?.id) {
        return {
          journeyCompleted: false,
          hasSavedCodigo: false,
          hasActivationIndividual: false,
          hasNelloCouple: false,
          hasActivationCouple: false,
          hasIdentityCouplePremium: false,
          hasCompletedCruzamento: false,
        };
      }

      // Fetch profile data with all product access flags
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select(`
          journey_status,
          journey_completed_at,
          has_activation_individual,
          has_nello_couple,
          has_activation_couple,
          has_identity_couple_premium
        `)
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error("Error fetching profile for funnel:", profileError);
      }

      // Check if user has a saved codigo essencia
      // Using type assertion because the table may not be in the auto-generated types
      const { data: codigoEssencia } = await (supabase as any)
        .from("codigo_essencias")
        .select("id")
        .eq("user_id", user.id)
        .limit(1);

      const hasSavedCodigo = Array.isArray(codigoEssencia) && codigoEssencia.length > 0;

      // Check if user has completed a couple crossing (cruzamento)
      const { data: cruzamentos, error: cruzamentoError } = await supabase
        .from("codigo_cruzamentos")
        .select("id, status, content")
        .or(`user_a_id.eq.${user.id},user_b_id.eq.${user.id}`)
        .eq("status", "completed")
        .limit(1);

      if (cruzamentoError) {
        console.error("Error fetching cruzamentos:", cruzamentoError);
      }

      const hasCompletedCruzamento = (cruzamentos && cruzamentos.length > 0) || false;

      return {
        journeyCompleted: profile?.journey_status === "completed",
        hasSavedCodigo,
        hasActivationIndividual: profile?.has_activation_individual ?? false,
        hasNelloCouple: profile?.has_nello_couple ?? false,
        hasActivationCouple: profile?.has_activation_couple ?? false,
        hasIdentityCouplePremium: profile?.has_identity_couple_premium ?? false,
        hasCompletedCruzamento,
      };
    },
    staleTime: 30 * 1000,
  });

  return {
    journeyCompleted: data?.journeyCompleted ?? false,
    hasSavedCodigo: data?.hasSavedCodigo ?? false,
    hasActivationIndividual: data?.hasActivationIndividual ?? false,
    hasNelloCouple: data?.hasNelloCouple ?? false,
    hasActivationCouple: data?.hasActivationCouple ?? false,
    hasIdentityCouplePremium: data?.hasIdentityCouplePremium ?? false,
    hasCompletedCruzamento: data?.hasCompletedCruzamento ?? false,
    isLoading,
  };
}
