import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useConsentStatus } from "@/hooks/useConsentStatus";
import { ConsentModal } from "./ConsentModal";

interface ConsentGateProps {
  children: ReactNode;
}

// Páginas onde o modal NÃO deve aparecer (públicas/legais)
const EXCLUDED_PATHS = [
  // Landing pages
  '/', '/en', '/pt-pt',
  // Auth pages
  '/auth', '/login', '/reset-password',
  '/en/auth', '/en/login', '/en/reset-password',
  '/pt-pt/auth', '/pt-pt/login', '/pt-pt/reset-password',
  // Legal pages
  '/termos', '/termos-de-servico', '/terms', '/terms-of-service',
  '/privacidade', '/politica-de-privacidade', '/privacy', '/privacy-policy',
  '/contato', '/contact',
  '/en/terms', '/en/privacy', '/en/contact',
  '/pt-pt/termos', '/pt-pt/privacidade', '/pt-pt/contato',
  // Institutional pages
  '/metodologia', '/en/methodology', '/pt-pt/metodologia',
  '/os-7-mapas', '/en/the-7-maps', '/pt-pt/os-7-mapas',
  '/para-profissionais', '/en/for-professionals', '/pt-pt/para-profissionais',
  '/ajuda', '/en/help', '/pt-pt/ajuda',
  // WhatsApp redirect
  '/whatsapp', '/en/whatsapp', '/pt-pt/whatsapp',
  // Business public pages (hiring assessments, invites)
  '/business/avaliacao',
  '/business/aceitar-convite',
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
