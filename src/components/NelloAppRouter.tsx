import { ReactNode } from 'react';
import { useNelloApp } from '@/contexts/NelloAppContext';
import FlowApp from '@/apps/flow/FlowApp';
import LifeApp from '@/apps/life/LifeApp';

interface NelloAppRouterProps {
  children: ReactNode; // Nello One routes (default)
}

/**
 * Routes to the correct Nello app based on subdomain
 * 
 * - flow.nello.one → Nello Flow
 * - life.nello.one → Nello Life  
 * - one.nello.one or nello.one → Nello One (default)
 */
export function NelloAppRouter({ children }: NelloAppRouterProps) {
  const { currentApp } = useNelloApp();
  
  switch (currentApp) {
    case 'flow':
      return <FlowApp />;
    case 'life':
      return <LifeApp />;
    case 'one':
    case 'main':
    default:
      // Nello One uses the existing routes passed as children
      return <>{children}</>;
  }
}
