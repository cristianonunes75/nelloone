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

  // Fetch test purchases for current user - include test type for cross-language matching
  const { data: purchases } = useQuery({
    queryKey: ["test-purchases", user?.id],
    enabled: !!user,
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("test_purchases")
        .select("test_id, payment_status, tests(type)")
        .eq("user_id", user.id)
        .eq("payment_status", "completed");

      if (error) throw error;
      return data || [];
    },
  });

  // Fetch all tests to enable cross-language matching by type
  const { data: allTests } = useQuery({
    queryKey: ["all-tests-for-access"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tests")
        .select("id, type")
        .eq("active", true);

      if (error) throw error;
      return data || [];
    },
  });

  // Build a map of test types that user has purchased
  const purchasedTypes = new Set<string>();
  purchases?.forEach((p) => {
    const testType = (p.tests as any)?.type;
    if (testType) {
      purchasedTypes.add(testType);
    }
  });

  // Check if user has access to a specific test
  // Now supports cross-language: if user purchased DISC in PT, they can access DISC in EN
  const hasAccess = (testId: string, isFree: boolean) => {
    // Admins have access to all tests
    if (userRole === "admin") return true;
    
    // Founders have access to all tests
    if (isFounder) return true;
    
    // Free tests are accessible to everyone
    if (isFree) return true;
    
    // Check if user purchased this specific test
    if (purchases?.some((p) => p.test_id === testId)) {
      return true;
    }
    
    // Cross-language check: find the type of this test and check if user purchased any test of same type
    const testType = allTests?.find((t) => t.id === testId)?.type;
    if (testType && purchasedTypes.has(testType)) {
      return true;
    }
    
    return false;
  };

  // Check if user has purchased a test (or is founder)
  // Also supports cross-language matching
  const hasPurchased = (testId: string) => {
    // Founders have access to all tests (full version)
    if (isFounder) return true;
    
    // Check direct purchase
    if (purchases?.some((p) => p.test_id === testId)) {
      return true;
    }
    
    // Cross-language check
    const testType = allTests?.find((t) => t.id === testId)?.type;
    if (testType && purchasedTypes.has(testType)) {
      return true;
    }
    
    return false;
  };

  return { hasAccess, hasPurchased, purchases, isFounder };
};
