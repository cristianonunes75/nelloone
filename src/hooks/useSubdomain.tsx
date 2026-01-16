import { useMemo } from 'react';

export type NelloApp = 'flow' | 'life' | 'one' | 'business' | 'main';

interface SubdomainConfig {
  app: NelloApp;
  subdomain: string | null;
  isFlow: boolean;
  isLife: boolean;
  isOne: boolean;
  isMain: boolean;
  isBusiness: boolean;
  domain: string;
}

// Subdomain mapping for Nello ecosystem
const SUBDOMAIN_MAP: Record<string, NelloApp> = {
  'flow': 'flow',
  'life': 'life', 
  'one': 'one',
  'business': 'business',
};

// For local development, you can force a subdomain
const DEV_FORCE_SUBDOMAIN = import.meta.env.VITE_FORCE_SUBDOMAIN as string | undefined;

/**
 * Detects which Nello app should be rendered based on subdomain
 * 
 * NEW ARCHITECTURE:
 * - www.nello.one / nello.one → Main institutional landing (ecosystem presentation)
 * - one.nello.one → Nello One (self-knowledge product)
 * - flow.nello.one → Nello Flow
 * - life.nello.one → Nello Life
 * - business.nello.one → Nello Business
 * 
 * For Lovable preview: use ?app=one|flow|life|business|main
 */
export function useSubdomain(searchOverride?: string): SubdomainConfig {
  return useMemo(() => {
    const hostname = window.location.hostname;
    const fullDomain = window.location.host;
    const search = searchOverride ?? window.location.search;

    // For development: allow forcing subdomain via env variable
    if (DEV_FORCE_SUBDOMAIN && (hostname === 'localhost' || hostname === '127.0.0.1')) {
      const app = DEV_FORCE_SUBDOMAIN === 'main' ? 'main' : (SUBDOMAIN_MAP[DEV_FORCE_SUBDOMAIN] || 'one');
      return {
        app,
        subdomain: DEV_FORCE_SUBDOMAIN,
        isFlow: app === 'flow',
        isLife: app === 'life',
        isOne: app === 'one',
        isBusiness: app === 'business',
        isMain: app === 'main',
        domain: fullDomain,
      };
    }

    // Extract subdomain from hostname
    // Expected format: subdomain.nello.one or subdomain.domain.com
    const parts = hostname.split('.');

    // Check if it's a subdomain of nello.one (e.g., flow.nello.one, one.nello.one)
    if (parts.length >= 3) {
      const subdomain = parts[0].toLowerCase();
      
      // www.nello.one should show the main institutional landing
      if (subdomain === 'www') {
        return {
          app: 'main',
          subdomain: 'www',
          isFlow: false,
          isLife: false,
          isOne: false,
          isBusiness: false,
          isMain: true,
          domain: fullDomain,
        };
      }
      
      const app = SUBDOMAIN_MAP[subdomain] || 'main';

      return {
        app,
        subdomain,
        isFlow: app === 'flow',
        isLife: app === 'life',
        isOne: app === 'one',
        isBusiness: app === 'business',
        isMain: app === 'main',
        domain: fullDomain,
      };
    }

    // Preview / local domains: lovable.* (lovable.app, lovable.dev, lovableproject.com, etc.)
    // Use query params (?app=flow|business|one|life|main) or default to 'one' for compatibility
    if (hostname.includes('lovable')) {
      const urlParams = new URLSearchParams(search);
      const appParam = urlParams.get('app');
      
      // If ?app=main, show institutional landing
      if (appParam === 'main') {
        return {
          app: 'main',
          subdomain: 'main',
          isFlow: false,
          isLife: false,
          isOne: false,
          isBusiness: false,
          isMain: true,
          domain: fullDomain,
        };
      }
      
      if (appParam && SUBDOMAIN_MAP[appParam]) {
        const app = SUBDOMAIN_MAP[appParam];
        return {
          app,
          subdomain: appParam,
          isFlow: app === 'flow',
          isLife: app === 'life',
          isOne: app === 'one',
          isBusiness: app === 'business',
          isMain: false,
          domain: fullDomain,
        };
      }

      // Default to Nello One for Lovable preview (backward compatibility)
      return {
        app: 'one',
        subdomain: null,
        isFlow: false,
        isLife: false,
        isOne: true,
        isBusiness: false,
        isMain: false,
        domain: fullDomain,
      };
    }

    // Handle alternative domain: nelloone.com (single word without dot)
    // This should be treated as Nello One (same as one.nello.one)
    if (hostname.includes('nelloone.com') || hostname === 'nelloone.com') {
      return {
        app: 'one',
        subdomain: null,
        isFlow: false,
        isLife: false,
        isOne: true,
        isBusiness: false,
        isMain: false,
        domain: fullDomain,
      };
    }

    // Main domain without subdomain (nello.one) → Show institutional landing
    return {
      app: 'main',
      subdomain: null,
      isFlow: false,
      isLife: false,
      isOne: false,
      isBusiness: false,
      isMain: true,
      domain: fullDomain,
    };
  }, [searchOverride]);
}

/**
 * Get the base URL for a specific Nello app
 */
export function getNelloAppUrl(app: NelloApp): string {
  const baseDomain = 'nello.one';
  
  switch (app) {
    case 'flow':
      return `https://flow.${baseDomain}`;
    case 'life':
      return `https://life.${baseDomain}`;
    case 'business':
      return `https://business.${baseDomain}`;
    case 'one':
      return `https://one.${baseDomain}`;
    case 'main':
    default:
      return `https://${baseDomain}`;
  }
}

/**
 * Check if current domain matches expected app domain
 * Useful for cross-app redirects
 */
export function isCorrectAppDomain(expectedApp: NelloApp): boolean {
  const { app } = useSubdomain();
  return app === expectedApp;
}
