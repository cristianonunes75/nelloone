import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useJourneyProgress } from "./useJourneyProgress";

export interface CodigoEssenciaAccessState {
  // User has purchased Código da Essência
  hasUnlocked: boolean;
  // All 7 tests are completed
  allTestsCompleted: boolean;
  // User can see the menu item (all tests completed)
  canSeeMenuItem: boolean;
  // User can generate the code (all tests completed + purchased)
  canGenerateCode: boolean;
  // User can purchase (all tests completed but not purchased)
  canPurchase: boolean;
  // Loading state
  isLoading: boolean;
}

/**
 * NELLO ONE Product Rules:
 * 
 * 1. Código da Essência is a SEPARATE premium product
 * 2. It is NOT included in "Jornada Completa" 
 * 3. User must complete all 7 tests to unlock purchase option
 * 4. User must purchase separately to generate the code
 * 5. Never auto-unlock, never include in bundles
 */
export function useCodigoEssenciaAccess(): CodigoEssenciaAccessState {
  const { user } = useAuth();
  const { isJourneyComplete, isLoading: journeyLoading } = useJourneyProgress();

  // Check if user has unlocked Código da Essência via profile flag
  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ["codigo-essencia-access", user?.id],
    enabled: !!user,
    queryFn: async () => {
      if (!user) return { unlocked: false };

      // Check the profile flag
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("codigo_essencia_unlocked")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error("Error checking profile:", profileError);
        return { unlocked: false };
      }

      return { unlocked: profile?.codigo_essencia_unlocked || false };
    },
  });

  const isLoading = journeyLoading || profileLoading;
  const hasUnlocked = profileData?.unlocked || false;
  const allTestsCompleted = isJourneyComplete;

  return {
    hasUnlocked,
    allTestsCompleted,
    // Show menu item only if all tests are completed
    canSeeMenuItem: allTestsCompleted,
    // Can generate only if all tests completed AND purchased
    canGenerateCode: allTestsCompleted && hasUnlocked,
    // Can purchase only if all tests completed AND not purchased yet
    canPurchase: allTestsCompleted && !hasUnlocked,
    isLoading,
  };
}
