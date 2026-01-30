import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export type ProductType = 
  | "activation_individual" 
  | "nello_couple" 
  | "activation_couple" 
  | "identity_couple_premium"
  | "ativacao_codigo"
  | "codigo_casal"
  | "jornada_completa";

interface ProductAccessResult {
  hasAccess: boolean;
  isLoading: boolean;
  refetch: () => void;
}

// Map product types to profile column names
const PRODUCT_COLUMN_MAP: Record<string, string> = {
  activation_individual: "has_activation_individual",
  nello_couple: "has_nello_couple",
  activation_couple: "has_activation_couple",
  identity_couple_premium: "has_identity_couple_premium",
  ativacao_codigo: "ativacao_codigo_unlocked",
};

export function useProductAccess(productType: ProductType): ProductAccessResult {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["product-access", productType, user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      if (!user?.id) return { hasAccess: false };

      // For products tracked in profile columns
      const columnName = PRODUCT_COLUMN_MAP[productType];
      if (columnName) {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select(columnName)
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error checking product access:", error);
          return { hasAccess: false };
        }

        return { hasAccess: (profile as any)?.[columnName] === true };
      }

      // For products tracked in test_purchases
      const { data: purchase, error } = await supabase
        .from("test_purchases")
        .select("id")
        .eq("user_id", user.id)
        .eq("purchase_category", productType)
        .eq("payment_status", "completed")
        .maybeSingle();

      if (error) {
        console.error("Error checking purchase:", error);
        return { hasAccess: false };
      }

      return { hasAccess: !!purchase };
    },
    staleTime: 30 * 1000, // 30 seconds
  });

  return {
    hasAccess: data?.hasAccess ?? false,
    isLoading,
    refetch,
  };
}

// Hook to get all product access statuses at once
export function useAllProductAccess() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["all-product-access", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      if (!user?.id) {
        return {
          activation_individual: false,
          nello_couple: false,
          activation_couple: false,
          identity_couple_premium: false,
          ativacao_codigo: false,
        };
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select(`
          has_activation_individual,
          has_nello_couple,
          has_activation_couple,
          has_identity_couple_premium,
          ativacao_codigo_unlocked
        `)
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching product access:", error);
        return {
          activation_individual: false,
          nello_couple: false,
          activation_couple: false,
          identity_couple_premium: false,
          ativacao_codigo: false,
        };
      }

      return {
        activation_individual: profile?.has_activation_individual ?? false,
        nello_couple: profile?.has_nello_couple ?? false,
        activation_couple: profile?.has_activation_couple ?? false,
        identity_couple_premium: profile?.has_identity_couple_premium ?? false,
        ativacao_codigo: profile?.ativacao_codigo_unlocked ?? false,
        ativacao_profissional: profile?.has_activation_individual ?? false, // Alias for professional activation
      };
    },
    staleTime: 30 * 1000,
  });
}

// Hook to unlock access after payment (for immediate UI update)
export function useUnlockProductAccess() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productType: ProductType) => {
      if (!user?.id) throw new Error("User not authenticated");

      const columnName = PRODUCT_COLUMN_MAP[productType];
      if (!columnName) throw new Error("Invalid product type for unlock");

      const { error } = await supabase
        .from("profiles")
        .update({ [columnName]: true })
        .eq("id", user.id);

      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      // Invalidate all product access queries
      queryClient.invalidateQueries({ queryKey: ["product-access"] });
      queryClient.invalidateQueries({ queryKey: ["all-product-access"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}
