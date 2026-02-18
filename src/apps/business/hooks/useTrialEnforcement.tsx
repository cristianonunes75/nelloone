import { useMemo } from 'react';
import { useBusinessSubscription } from './useBusinessSubscription';
import { useBusinessAuth } from './useBusinessAuth';

/**
 * Lightweight hook to determine if access should be blocked due to expired trial / inactive subscription.
 * Used by BusinessProtectedRoute to redirect to /billing.
 */
export function useTrialEnforcement() {
  const { subscription, isLoading: subLoading } = useBusinessSubscription();
  const { isSuperAdmin, isNelloOneSuperAdmin, isLoading: authLoading } = useBusinessAuth();

  return useMemo(() => {
    const isLoading = subLoading || authLoading;

    // Super admins bypass everything
    if (isSuperAdmin || isNelloOneSuperAdmin) {
      return { isBlocked: false, isLoading };
    }

    if (isLoading || !subscription) {
      return { isBlocked: false, isLoading };
    }

    // Active subscription = OK
    if (subscription.status === 'active') {
      return { isBlocked: false, isLoading: false };
    }

    // Trial still running = OK  
    if (subscription.status === 'trial' && subscription.subscriptionEnd) {
      const trialEnd = new Date(subscription.subscriptionEnd);
      if (trialEnd > new Date()) {
        return { isBlocked: false, isLoading: false };
      }
    }

    // Trial with no end date (new company, assume OK for now)
    if (subscription.status === 'trial' && !subscription.subscriptionEnd) {
      return { isBlocked: false, isLoading: false };
    }

    // Everything else = blocked
    return { isBlocked: true, isLoading: false };
  }, [subscription, subLoading, authLoading, isSuperAdmin, isNelloOneSuperAdmin]);
}
