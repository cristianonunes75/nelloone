import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useConsentStatus } from "@/hooks/useConsentStatus";
import { ConsentModal } from "./ConsentModal";

interface ConsentGateProps {
  children: ReactNode;
}

// Páginas onde o modal NÃO deve aparecer (legais/públicas)
const EXCLUDED_PATHS = [
  '/termos', '/termos-de-servico', '/terms', '/terms-of-service',
  '/privacidade', '/politica-de-privacidade', '/privacy', '/privacy-policy',
  '/contato', '/contact',
  '/en/terms', '/en/privacy', '/en/contact',
  '/pt-pt/termos', '/pt-pt/privacidade', '/pt-pt/contato'
];

/**
 * Wraps protected content and shows mandatory consent modal
 * for authenticated users who haven't given LGPD consent yet.
 */
export function ConsentGate({ children }: ConsentGateProps) {
  const location = useLocation();
  const { user, isLoading: authLoading } = useAuth();
  const { hasConsent, isLoading: consentLoading, refetch } = useConsentStatus(user?.id);

  // Não mostrar modal em páginas legais/públicas
  const isExcludedPath = EXCLUDED_PATHS.some(path => 
    location.pathname === path || location.pathname.startsWith(path + '/')
  );

  if (isExcludedPath) {
    return <>{children}</>;
  }

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
