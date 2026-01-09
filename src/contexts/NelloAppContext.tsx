import React, { createContext, useContext, ReactNode } from 'react';
import { useSubdomain, NelloApp, getNelloAppUrl } from '@/hooks/useSubdomain';

interface NelloAppContextType {
  currentApp: NelloApp;
  subdomain: string | null;
  isFlow: boolean;
  isLife: boolean;
  isOne: boolean;
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
  const subdomainConfig = useSubdomain();
  
  const value: NelloAppContextType = {
    currentApp: subdomainConfig.app,
    subdomain: subdomainConfig.subdomain,
    isFlow: subdomainConfig.isFlow,
    isLife: subdomainConfig.isLife,
    isOne: subdomainConfig.isOne,
    isBusiness: subdomainConfig.app === 'business',
    isMain: subdomainConfig.isMain,
    domain: subdomainConfig.domain,
    getAppUrl: getNelloAppUrl,
  };
  
  return (
    <NelloAppContext.Provider value={value}>
      {children}
    </NelloAppContext.Provider>
  );
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
