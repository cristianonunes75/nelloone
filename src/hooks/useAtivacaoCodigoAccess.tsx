import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useEffect } from "react";
import { useAdminPermissions } from "./useAdminPermissions";

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
 * 
 * This hook checks BOTH:
 * - Profile flag (ativacao_codigo_unlocked)
 * - Purchase record in test_purchases
 * And auto-corrects inconsistencies for redundancy.
 */
export function useAtivacaoCodigoAccess(): AtivacaoCodigoAccessState {
  const { user, userRole } = useAuth();
  const queryClient = useQueryClient();
  const { isSuperAdmin, isLoading: adminLoading } = useAdminPermissions();
  
  // Admin bypass
  const isAdmin = userRole === 'admin';

  // Check if user has purchased ativacao_codigo in test_purchases
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

  // Auto-correction mutation: if purchase exists but profile flag is false, fix it
  const autoCorrectMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from("profiles")
        .update({ ativacao_codigo_unlocked: true })
        .eq("id", userId);

      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      // Invalidate profile query to reflect the correction
      queryClient.invalidateQueries({ queryKey: ["profile-ativacao-unlocked", user?.id] });
      console.log("Auto-corrected ativacao_codigo_unlocked flag");
    },
    onError: (error) => {
      console.error("Failed to auto-correct ativacao flag:", error);
    },
  });

  const isLoading = purchaseLoading || profileLoading || codigoLoading || adminLoading;
  const hasCodigoEssencia = !!codigoData?.id || isAdmin; // Admins always have "Código"
  
  // Check both sources for purchase validation
  const hasPurchaseRecord = !!purchaseData?.id;
  const hasProfileFlag = !!(profileData as any)?.ativacao_codigo_unlocked;
  
  // User has purchased if EITHER condition is true (redundancy) OR is admin
  const hasPurchased = hasPurchaseRecord || hasProfileFlag || isAdmin;

  // Auto-correct: if purchase exists but profile flag is missing, update it
  useEffect(() => {
    if (!isLoading && user?.id && hasPurchaseRecord && !hasProfileFlag && !isAdmin) {
      console.log("Detected inconsistency: purchase exists but profile flag is false. Auto-correcting...");
      autoCorrectMutation.mutate(user.id);
    }
  }, [isLoading, user?.id, hasPurchaseRecord, hasProfileFlag, isAdmin]);

  return {
    hasPurchased,
    hasCodigoEssencia,
    // Admins can always see menu item; others need Código da Essência
    canSeeMenuItem: hasCodigoEssencia || isAdmin,
    // Admins can always generate; others need purchase AND Código
    canGenerateActivation: isAdmin || (hasPurchased && hasCodigoEssencia),
    // Admins never need to purchase
    needsPurchase: !isAdmin && hasCodigoEssencia && !hasPurchased,
    isLoading,
  };
}
