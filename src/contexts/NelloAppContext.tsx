import React, { createContext, useContext, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { useSubdomain, NelloApp, getNelloAppUrl } from '@/hooks/useSubdomain';

interface NelloAppContextType {
  currentApp: NelloApp;
  subdomain: string | null;
  isFlow: boolean;
  isLife: boolean;
  isIdentity: boolean;
  isBusiness: boolean;
  isMain: boolean;
  domain: string;
  getAppUrl: (app: NelloApp) => string;
  // Future: shared user data between apps
}

const NelloAppContext = createContext<NelloAppContextType | undefined>(undefined);

interface NelloAppProviderProps {
  children: ReactNode;
}

export function NelloAppProvider({ children }: NelloAppProviderProps) {
  const location = useLocation();
  const subdomainConfig = useSubdomain(location.search);

  const value: NelloAppContextType = {
    currentApp: subdomainConfig.app,
    subdomain: subdomainConfig.subdomain,
    isFlow: subdomainConfig.isFlow,
    isLife: subdomainConfig.isLife,
    isIdentity: subdomainConfig.isIdentity,
    isBusiness: subdomainConfig.app === 'business',
    isMain: subdomainConfig.isMain,
    domain: subdomainConfig.domain,
    getAppUrl: getNelloAppUrl,
  };

  return <NelloAppContext.Provider value={value}>{children}</NelloAppContext.Provider>;
}

export function useNelloApp() {
  const context = useContext(NelloAppContext);
  if (context === undefined) {
    throw new Error('useNelloApp must be used within a NelloAppProvider');
  }
  return context;
}

// Export types for use across apps
export type { NelloApp };
