 import { useQuery } from "@tanstack/react-query";
 import { supabase } from "@/integrations/supabase/client";
 import { useAuth } from "./useAuth";
 import { useImpersonate } from "@/contexts/ImpersonateContext";
 
 /**
  * CRITICAL ACCESS HOOK
  * 
  * This hook determines if a user can access a test.
  * Three ways to unlock ALL tests:
  * 1. User has purchase_category='jornada_completa' in test_purchases
  * 2. User has ativacao_codigo_unlocked=true in profiles table
  * 3. User completed 5+ tests (journey_completed_tests >= 5)
  */
 export const useTestAccess = () => {
   const { user, userRole } = useAuth();
   const { impersonatedUserId, isImpersonating } = useImpersonate();
   
   const effectiveUserId = isImpersonating ? impersonatedUserId : user?.id;
 
   console.log("🔐 [useTestAccess] INITIALIZING", {
     effectiveUserId,
     userRole,
     isImpersonating
   });
 
   // 1. Fetch test purchases
   const { data: purchases, isLoading: purchasesLoading } = useQuery({
     queryKey: ["test-purchases", effectiveUserId],
     enabled: !!effectiveUserId,
     queryFn: async () => {
       if (!effectiveUserId) return [];
 
       console.log("🔍 [useTestAccess] Fetching purchases for user:", effectiveUserId);
 
       const { data, error } = await supabase
         .from("test_purchases")
         .select("test_id, payment_status, purchase_category, tests(type)")
         .eq("user_id", effectiveUserId)
         .eq("payment_status", "completed");
 
       if (error) {
         console.error("❌ [useTestAccess] Error fetching purchases:", error);
         throw error;
       }
 
       console.log("✅ [useTestAccess] Purchases loaded:", data?.length || 0, data);
       return data || [];
     },
   });
 
   // 2. Fetch user profile - CRITICAL FOR UNLOCK FLAGS
   const { data: userProfile, isLoading: profileLoading } = useQuery({
     queryKey: ["user-profile-full-access", effectiveUserId],
     enabled: !!effectiveUserId,
     queryFn: async () => {
       if (!effectiveUserId) return null;
 
       console.log("🔍 [useTestAccess] Fetching profile for user:", effectiveUserId);
 
       const { data, error } = await supabase
         .from("profiles")
         .select("journey_completed_tests, journey_status, ativacao_codigo_unlocked")
         .eq("id", effectiveUserId)
         .single();
 
       if (error) {
         console.error("❌ [useTestAccess] Error fetching profile:", error);
         throw error;
       }
 
       console.log("✅ [useTestAccess] Profile loaded:", data);
       return data;
     },
   });
 
   // 3. Fetch all tests for cross-language matching
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
 
   // Calculate access flags
   const hasBundlePurchase = purchases?.some(p => 
     (p as any).purchase_category === 'jornada_completa'
   ) || false;
 
   const hasAtivacaoUnlocked = userProfile?.ativacao_codigo_unlocked === true;
   const hasCompletedArquetipos = (userProfile?.journey_completed_tests ?? 0) >= 5;
 
   // FULL ACCESS = ANY OF THESE THREE CONDITIONS
   const hasFullJourneyAccess = hasBundlePurchase || hasAtivacaoUnlocked || hasCompletedArquetipos;
   
   const isLoading = purchasesLoading || profileLoading;
 
   // CRITICAL LOG - This must appear in console
   console.log("🎯 [useTestAccess] FINAL ACCESS DECISION:", {
     effectiveUserId,
     hasFullJourneyAccess,
     breakdown: {
       hasBundlePurchase,
       hasAtivacaoUnlocked,
       hasCompletedArquetipos,
       journey_completed_tests: userProfile?.journey_completed_tests ?? 0,
     },
     isLoading,
     isAdmin: userRole === "admin"
   });
 
   // Build purchased types map
   const purchasedTypes = new Set<string>();
   purchases?.forEach((p) => {
     const testType = (p.tests as any)?.type;
     if (testType) {
       purchasedTypes.add(testType);
     }
   });
 
   // Main access check function
   const hasAccess = (testId: string, isFree: boolean) => {
     console.log(`🔑 [useTestAccess] Checking access for test ${testId}:`, {
       isFree,
       isAdmin: userRole === "admin",
       hasFullJourneyAccess,
       isLoading
     });
 
     // Admins always have access
     if (userRole === "admin") {
       console.log("✅ Admin access granted");
       return true;
     }
     
     // While loading, be permissive
     if (isLoading) {
       console.log("⏳ Loading... granting temporary access");
       return true;
     }
     
     // Full journey access unlocks everything
     if (hasFullJourneyAccess) {
       console.log("✅ Full journey access granted");
       return true;
     }
     
     // Free tests
     if (isFree) {
       console.log("✅ Free test access granted");
       return true;
     }
     
     // Direct purchase check
     if (purchases?.some((p) => p.test_id === testId)) {
       console.log("✅ Direct purchase found");
       return true;
     }
     
     // Cross-language check
     const testType = allTests?.find((t) => t.id === testId)?.type;
     if (testType && purchasedTypes.has(testType)) {
       console.log("✅ Cross-language purchase found");
       return true;
     }
     
     console.log("❌ Access denied");
     return false;
   };
 
   // Purchase check function
   const hasPurchased = (testId: string) => {
     if (isLoading) return true;
     if (hasFullJourneyAccess) return true;
     if (purchases?.some((p) => p.test_id === testId)) return true;
     
     const testType = allTests?.find((t) => t.id === testId)?.type;
     if (testType && purchasedTypes.has(testType)) return true;
     
     return false;
   };
 
   return { hasAccess, hasPurchased, purchases, hasFullJourneyAccess, isLoading, userProfile };
 };