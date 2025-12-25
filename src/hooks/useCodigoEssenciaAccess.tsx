import { useAuth } from "./useAuth";
import { useJourneyProgress } from "./useJourneyProgress";

export interface CodigoEssenciaAccessState {
  // User has access (always true when journey is complete - no purchase needed)
  hasUnlocked: boolean;
  // All 7 tests are completed
  allTestsCompleted: boolean;
  // User can see the menu item (all tests completed)
  canSeeMenuItem: boolean;
  // User can generate the code (all tests completed)
  canGenerateCode: boolean;
  // User can purchase (always false - no separate purchase)
  canPurchase: boolean;
  // Loading state
  isLoading: boolean;
}

/**
 * NELLO ONE Product Rules (Updated):
 * 
 * 1. Código da Essência is INCLUDED in the "Jornada Completa"
 * 2. It is NOT sold separately anymore
 * 3. User must complete all 7 tests to unlock access
 * 4. No purchase check needed - automatic when journey is complete
 */
export function useCodigoEssenciaAccess(): CodigoEssenciaAccessState {
  const { user } = useAuth();
  const { isJourneyComplete, isLoading: journeyLoading } = useJourneyProgress();

  const isLoading = journeyLoading;
  const allTestsCompleted = isJourneyComplete;
  
  // Automatic access when journey is complete - no purchase needed
  const hasUnlocked = allTestsCompleted;

  return {
    hasUnlocked,
    allTestsCompleted,
    // Show menu item only if all tests are completed
    canSeeMenuItem: allTestsCompleted,
    // Can generate when all tests completed (no purchase check)
    canGenerateCode: allTestsCompleted,
    // Never show purchase option - it's included in the journey
    canPurchase: false,
    isLoading,
  };
}
