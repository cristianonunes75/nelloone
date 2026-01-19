import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface CoupleCodeAccess {
  hasPurchased: boolean;
  isLoading: boolean;
  purchaseDate?: string;
}

export function useCoupleCodeAccess(): CoupleCodeAccess {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["couple-code-purchase", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      if (!user?.id) return null;

      // Check for codigo_casal purchase in test_purchases
      const { data, error } = await supabase
        .from("test_purchases")
        .select("id, purchased_at, payment_status")
        .eq("user_id", user.id)
        .or("product_type.eq.codigo_casal,purchase_category.eq.codigo_casal")
        .eq("payment_status", "completed")
        .maybeSingle();

      if (error) {
        console.error("Error checking couple code purchase:", error);
        return null;
      }

      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    hasPurchased: !!data,
    isLoading,
    purchaseDate: data?.purchased_at,
  };
}
