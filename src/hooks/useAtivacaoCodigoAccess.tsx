import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface AtivacaoCodigoAccessState {
  // User has purchased the activation module
  hasPurchased: boolean;
  // User has completed the Código da Essência (prerequisite)
  hasCodigoEssencia: boolean;
  // User can see the menu item (has Código da Essência)
  canSeeMenuItem: boolean;
  // User can generate the activation (purchased + has Código)
  canGenerateActivation: boolean;
  // User needs to purchase (has Código but not purchased)
  needsPurchase: boolean;
  // Loading state
  isLoading: boolean;
}

/**
 * Ativação do Código Access Rules:
 * 
 * 1. Prerequisite: User must have generated their Código da Essência
 * 2. Payment: User must purchase the Ativação module (R$97)
 * 3. Access: After payment, user can generate their personalized activation report
 */
export function useAtivacaoCodigoAccess(): AtivacaoCodigoAccessState {
  const { user } = useAuth();

  // Check if user has purchased ativacao_codigo
  const { data: purchaseData, isLoading: purchaseLoading } = useQuery({
    queryKey: ["ativacao-codigo-purchase", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from("test_purchases")
        .select("id, payment_status")
        .eq("user_id", user.id)
        .eq("purchase_category", "ativacao_codigo")
        .eq("payment_status", "completed")
        .maybeSingle();

      if (error) {
        console.error("Error checking ativacao purchase:", error);
        return null;
      }
      return data;
    },
  });

  // Check if user has profile with ativacao unlocked
  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ["profile-ativacao-unlocked", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from("profiles")
        .select("ativacao_codigo_unlocked")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error checking profile:", error);
        return null;
      }
      return data;
    },
  });

  // Check if user has generated Código da Essência
  const { data: codigoData, isLoading: codigoLoading } = useQuery({
    queryKey: ["mapa-essencia-exists", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from("mapa_essencia")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error checking mapa_essencia:", error);
        return null;
      }
      return data;
    },
  });

  const isLoading = purchaseLoading || profileLoading || codigoLoading;
  const hasCodigoEssencia = !!codigoData?.id;
  const hasPurchased = !!purchaseData?.id || !!(profileData as any)?.ativacao_codigo_unlocked;

  return {
    hasPurchased,
    hasCodigoEssencia,
    // Show menu item only if user has Código da Essência
    canSeeMenuItem: hasCodigoEssencia,
    // Can generate if purchased AND has Código
    canGenerateActivation: hasPurchased && hasCodigoEssencia,
    // Needs purchase if has Código but hasn't purchased
    needsPurchase: hasCodigoEssencia && !hasPurchased,
    isLoading,
  };
}
