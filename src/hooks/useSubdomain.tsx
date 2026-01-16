import { useMemo, useEffect } from 'react';

export type NelloApp = 'flow' | 'life' | 'identity' | 'business' | 'main';

interface SubdomainConfig {
  app: NelloApp;
  subdomain: string | null;
  isFlow: boolean;
  isLife: boolean;
  isIdentity: boolean;
  isMain: boolean;
  isBusiness: boolean;
  domain: string;
}

// Subdomain mapping for Nello ecosystem
const SUBDOMAIN_MAP: Record<string, NelloApp> = {
  'flow': 'flow',
  'life': 'life', 
  'identity': 'identity',
  'business': 'business',
};

// Legacy subdomain redirects
const LEGACY_REDIRECTS: Record<string, string> = {
  'one': 'identity', // one.nello.one → identity.nello.one
};

// For local development, you can force a subdomain
const DEV_FORCE_SUBDOMAIN = import.meta.env.VITE_FORCE_SUBDOMAIN as string | undefined;

/**
 * Detects which Nello app should be rendered based on subdomain
 * 
 * CURRENT ARCHITECTURE:
 * - www.nello.one / nello.one → Main institutional landing (ecosystem presentation)
 * - identity.nello.one → Nello One Identity (self-knowledge product)
 * - flow.nello.one → Nello Flow
 * - life.nello.one → Nello Life
 * - business.nello.one → Nello Business
 * 
 * LEGACY REDIRECTS:
 * - one.nello.one → redirects to identity.nello.one
 * 
 * For Lovable preview: use ?app=identity|flow|life|business|main
 */
export function useSubdomain(searchOverride?: string): SubdomainConfig {
  const config = useMemo(() => {
    const hostname = window.location.hostname;
    const fullDomain = window.location.host;
    const search = searchOverride ?? window.location.search;

    // For development: allow forcing subdomain via env variable
    if (DEV_FORCE_SUBDOMAIN && (hostname === 'localhost' || hostname === '127.0.0.1')) {
      // Handle legacy 'one' → 'identity' in dev
      const normalizedSubdomain = DEV_FORCE_SUBDOMAIN === 'one' ? 'identity' : DEV_FORCE_SUBDOMAIN;
      const app = normalizedSubdomain === 'main' ? 'main' : (SUBDOMAIN_MAP[normalizedSubdomain] || 'identity');
      return {
        app,
        subdomain: normalizedSubdomain,
        isFlow: app === 'flow',
        isLife: app === 'life',
        isIdentity: app === 'identity',
        isBusiness: app === 'business',
        isMain: app === 'main',
        domain: fullDomain,
        shouldRedirect: false,
        redirectTo: null as string | null,
      };
    }

    // Extract subdomain from hostname
    // Expected format: subdomain.nello.one or subdomain.domain.com
    const parts = hostname.split('.');

    // Check if it's a subdomain of nello.one (e.g., flow.nello.one, identity.nello.one)
    if (parts.length >= 3) {
      const subdomain = parts[0].toLowerCase();
      
      // www.nello.one should show the main institutional landing
      if (subdomain === 'www') {
        return {
          app: 'main' as NelloApp,
          subdomain: 'www',
          isFlow: false,
          isLife: false,
          isIdentity: false,
          isBusiness: false,
          isMain: true,
          domain: fullDomain,
          shouldRedirect: false,
          redirectTo: null as string | null,
        };
      }
      
      // Check for legacy redirects (e.g., one → identity)
      if (LEGACY_REDIRECTS[subdomain]) {
        const newSubdomain = LEGACY_REDIRECTS[subdomain];
        const newUrl = `https://${newSubdomain}.nello.one${window.location.pathname}${window.location.search}${window.location.hash}`;
        return {
          app: SUBDOMAIN_MAP[newSubdomain] || 'identity' as NelloApp,
          subdomain: newSubdomain,
          isFlow: false,
          isLife: false,
          isIdentity: true,
          isBusiness: false,
          isMain: false,
          domain: fullDomain,
          shouldRedirect: true,
          redirectTo: newUrl,
        };
      }
      
      const app = SUBDOMAIN_MAP[subdomain] || 'main';

      return {
        app,
        subdomain,
        isFlow: app === 'flow',
        isLife: app === 'life',
        isIdentity: app === 'identity',
        isBusiness: app === 'business',
        isMain: app === 'main',
        domain: fullDomain,
        shouldRedirect: false,
        redirectTo: null as string | null,
      };
    }

    // Preview / local domains: lovable.* (lovable.app, lovable.dev, lovableproject.com, etc.)
    // Use query params (?app=flow|business|identity|life|main) or default to 'identity' for compatibility
    if (hostname.includes('lovable')) {
      const urlParams = new URLSearchParams(search);
      let appParam = urlParams.get('app');
      
      // Handle legacy 'one' param
      if (appParam === 'one') {
        appParam = 'identity';
      }
      
      // If ?app=main, show institutional landing
      if (appParam === 'main') {
        return {
          app: 'main' as NelloApp,
          subdomain: 'main',
          isFlow: false,
          isLife: false,
          isIdentity: false,
          isBusiness: false,
          isMain: true,
          domain: fullDomain,
          shouldRedirect: false,
          redirectTo: null as string | null,
        };
      }
      
      if (appParam && SUBDOMAIN_MAP[appParam]) {
        const app = SUBDOMAIN_MAP[appParam];
        return {
          app,
          subdomain: appParam,
          isFlow: app === 'flow',
          isLife: app === 'life',
          isIdentity: app === 'identity',
          isBusiness: app === 'business',
          isMain: false,
          domain: fullDomain,
          shouldRedirect: false,
          redirectTo: null as string | null,
        };
      }

      // Default to Nello One Identity for Lovable preview (backward compatibility)
      return {
        app: 'identity' as NelloApp,
        subdomain: null,
        isFlow: false,
        isLife: false,
        isIdentity: true,
        isBusiness: false,
        isMain: false,
        domain: fullDomain,
        shouldRedirect: false,
        redirectTo: null as string | null,
      };
    }

    // Handle alternative domain: nelloone.com (single word without dot)
    // This should be treated as Nello One Identity (same as identity.nello.one)
    if (hostname.includes('nelloone.com') || hostname === 'nelloone.com') {
      return {
        app: 'identity' as NelloApp,
        subdomain: null,
        isFlow: false,
        isLife: false,
        isIdentity: true,
        isBusiness: false,
        isMain: false,
        domain: fullDomain,
        shouldRedirect: false,
        redirectTo: null as string | null,
      };
    }

    // Main domain without subdomain (nello.one) → Show institutional landing
    return {
      app: 'main' as NelloApp,
      subdomain: null,
      isFlow: false,
      isLife: false,
      isIdentity: false,
      isBusiness: false,
      isMain: true,
      domain: fullDomain,
      shouldRedirect: false,
      redirectTo: null as string | null,
    };
  }, [searchOverride]);

  // Handle automatic redirects for legacy subdomains
  useEffect(() => {
    if (config.shouldRedirect && config.redirectTo) {
      window.location.replace(config.redirectTo);
    }
  }, [config.shouldRedirect, config.redirectTo]);

  return {
    app: config.app,
    subdomain: config.subdomain,
    isFlow: config.isFlow,
    isLife: config.isLife,
    isIdentity: config.isIdentity,
    isBusiness: config.isBusiness,
    isMain: config.isMain,
    domain: config.domain,
  };
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
    case 'identity':
      return `https://identity.${baseDomain}`;
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
