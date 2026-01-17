import { useAuth } from "./useAuth";
import { useJourneyProgress } from "./useJourneyProgress";
import { useAdminPermissions } from "./useAdminPermissions";

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
  const { user, userRole } = useAuth();
  const { isJourneyComplete, isLoading: journeyLoading } = useJourneyProgress();
  const { isSuperAdmin, isLoading: adminLoading } = useAdminPermissions();

  const isLoading = journeyLoading || adminLoading;
  const isAdmin = userRole === 'admin';
  
  // Admin bypass: admins always have full access
  const allTestsCompleted = isJourneyComplete || isAdmin;
  
  // Automatic access when journey is complete OR user is admin
  const hasUnlocked = allTestsCompleted;

  return {
    hasUnlocked,
    allTestsCompleted,
    // Admins can always see menu item
    canSeeMenuItem: allTestsCompleted,
    // Admins can always generate
    canGenerateCode: allTestsCompleted,
    // Never show purchase option - it's included in the journey
    canPurchase: false,
    isLoading,
  };
}
