import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useImpersonate } from "@/contexts/ImpersonateContext";

export const useTestAccess = () => {
  const { user, userRole } = useAuth();
  const { impersonatedUserId, isImpersonating } = useImpersonate();
  
  // Use impersonated user if active
  const effectiveUserId = isImpersonating ? impersonatedUserId : user?.id;

  // Fetch test purchases for effective user - include test type and purchase_category for cross-language and bundle matching
  const { data: purchases, isLoading: purchasesLoading } = useQuery({
    queryKey: ["test-purchases", effectiveUserId],
    enabled: !!effectiveUserId,
    queryFn: async () => {
      if (!effectiveUserId) return [];

      const { data, error } = await supabase
        .from("test_purchases")
        .select("test_id, payment_status, purchase_category, tests(type)")
        .eq("user_id", effectiveUserId)
        .eq("payment_status", "completed");

      if (error) throw error;
      return data || [];
    },
  });

  // Fetch user profile to check journey_completed_tests
  const { data: userProfile, isLoading: profileLoading } = useQuery({
    queryKey: ["user-profile-journey", effectiveUserId],
    enabled: !!effectiveUserId,
    queryFn: async () => {
      if (!effectiveUserId) return null;

      const { data, error } = await supabase
        .from("profiles")
        .select("journey_completed_tests, journey_status")
        .eq("id", effectiveUserId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  // Check if user has full journey access via bundle purchase
  const hasBundlePurchase = purchases?.some(p => 
    (p as any).purchase_category === 'jornada_completa'
  ) || false;

  // Check if user completed Arquétipos (step 5, which is journey_completed_tests >= 5)
  // After completing Arquétipos, all remaining tests should be unlocked
  const hasCompletedArquetipos = (userProfile?.journey_completed_tests ?? 0) >= 5;

  // Full journey access = bundle purchase OR completed Arquétipos
  const hasFullJourneyAccess = hasBundlePurchase || hasCompletedArquetipos;
  
  // Loading state - important to avoid false negatives during data fetch
  const isLoading = purchasesLoading || profileLoading;

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
    
    // While loading, be permissive to avoid blocking legitimate users
    // The test execution component will handle loading states
    if (isLoading) return true;
    
    // Users with full journey purchase OR completed Arquétipos have access to all tests
    if (hasFullJourneyAccess) return true;
    
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

  // Check if user has purchased a test
  // Also supports cross-language matching
  const hasPurchased = (testId: string) => {
    // While loading, be permissive to allow questions to load
    // Once loaded, proper access checks will apply
    if (isLoading) return true;
    
    // Users with full journey purchase have access to all tests
    if (hasFullJourneyAccess) return true;
    
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

  return { hasAccess, hasPurchased, purchases, hasFullJourneyAccess, isLoading };
};
