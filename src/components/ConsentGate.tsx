import { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useConsentStatus } from "@/hooks/useConsentStatus";
import { ConsentModal } from "./ConsentModal";

interface ConsentGateProps {
  children: ReactNode;
}

/**
 * Wraps protected content and shows mandatory consent modal
 * for authenticated users who haven't given LGPD consent yet.
 */
export function ConsentGate({ children }: ConsentGateProps) {
  const { user, isLoading: authLoading } = useAuth();
  const { hasConsent, isLoading: consentLoading, refetch } = useConsentStatus(user?.id);

  // Don't block while loading
  if (authLoading || consentLoading) {
    return <>{children}</>;
  }

  // If not logged in, just render children (public routes)
  if (!user) {
    return <>{children}</>;
  }

  // User is logged in but hasn't given consent - show modal
  const showConsentModal = user && !hasConsent;

  return (
    <>
      {children}
      {showConsentModal && (
        <ConsentModal
          isOpen={true}
          userId={user.id}
          onConsentGiven={refetch}
        />
      )}
    </>
  );
}
