import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export const useTestAccess = () => {
  const { user, userRole } = useAuth();

  // Fetch user profile to check founder status
  const { data: profile } = useQuery({
    queryKey: ["user-profile-access", user?.id],
    enabled: !!user,
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("is_founder")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const isFounder = profile?.is_founder || false;

  // Fetch test purchases for current user
  const { data: purchases } = useQuery({
    queryKey: ["test-purchases", user?.id],
    enabled: !!user,
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("test_purchases")
        .select("test_id, payment_status")
        .eq("user_id", user.id)
        .eq("payment_status", "completed");

      if (error) throw error;
      return data || [];
    },
  });

  // Check if user has access to a specific test
  const hasAccess = (testId: string, isFree: boolean) => {
    // Admins have access to all tests
    if (userRole === "admin") return true;
    
    // Founders have access to all tests
    if (isFounder) return true;
    
    if (isFree) return true;
    return purchases?.some((p) => p.test_id === testId) || false;
  };

  // Check if user has purchased a test (or is founder)
  const hasPurchased = (testId: string) => {
    // Founders have access to all tests (full version)
    if (isFounder) return true;
    
    return purchases?.some((p) => p.test_id === testId) || false;
  };

  return { hasAccess, hasPurchased, purchases, isFounder };
};
