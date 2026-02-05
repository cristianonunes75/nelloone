import { useState, useEffect } from "react";
import { hasUserConsent } from "./useConsentRecord";

interface ConsentStatus {
  hasConsent: boolean;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Hook to check if the current user has given LGPD consent
 * Returns reactive status that can be used to show consent modal
 */
export function useConsentStatus(userId: string | undefined): ConsentStatus {
  const [hasConsent, setHasConsent] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkConsent = async () => {
    if (!userId) {
      setIsLoading(false);
      setHasConsent(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await hasUserConsent(userId);
      setHasConsent(result);
    } catch (err: any) {
      console.error("Error checking consent status:", err);
      setError(err.message);
      setHasConsent(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkConsent();
  }, [userId]);

  return {
    hasConsent,
    isLoading,
    error,
    refetch: checkConsent,
  };
}
