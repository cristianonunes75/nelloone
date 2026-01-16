import { ReactNode } from 'react';
import { useNelloApp } from '@/contexts/NelloAppContext';
import FlowApp from '@/apps/flow/FlowApp';
import LifeApp from '@/apps/life/LifeApp';
import BusinessApp from '@/apps/business/BusinessApp';
import MainApp from '@/apps/main/MainApp';
import { BusinessAuthProvider } from '@/apps/business/hooks/useBusinessAuth';

interface NelloAppRouterProps {
  children: ReactNode; // Nello One routes (default)
}

/**
 * Routes to the correct Nello app based on subdomain
 *
 * NEW ARCHITECTURE:
 * - www.nello.one / nello.one → Main institutional landing
 * - one.nello.one → Nello One (self-knowledge)
 * - flow.nello.one → Nello Flow
 * - life.nello.one → Nello Life
 * - business.nello.one → Nello Business
 */
export function NelloAppRouter({ children }: NelloAppRouterProps) {
  const { currentApp } = useNelloApp();

  switch (currentApp) {
    case 'main':
      // New institutional landing page
      return <MainApp />;
    case 'flow':
      return <FlowApp />;
    case 'life':
      return <LifeApp />;
    case 'business':
      return (
        <BusinessAuthProvider>
          <BusinessApp />
        </BusinessAuthProvider>
      );
    case 'identity':
    default:
      // Nello One Identity uses the existing routes passed as children
      return <>{children}</>;
  }
}
