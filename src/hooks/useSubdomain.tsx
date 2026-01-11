import { useMemo } from 'react';

export type NelloApp = 'flow' | 'life' | 'one' | 'business' | 'main';

interface SubdomainConfig {
  app: NelloApp;
  subdomain: string | null;
  isFlow: boolean;
  isLife: boolean;
  isOne: boolean;
  isMain: boolean;
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
 * Examples:
 * - flow.nello.one → Nello Flow
 * - life.nello.one → Nello Life
 * - one.nello.one → Nello One
 * - nello.one → Main/redirect
 * - localhost:8080 → Main (or forced via env)
 */
export function useSubdomain(searchOverride?: string): SubdomainConfig {
  // NOTE: We accept an optional `searchOverride` so the app can react to
  // in-app query param changes (e.g. ?app=business) without a full reload.
  return useMemo(() => {
    const hostname = window.location.hostname;
    const fullDomain = window.location.host;
    const search = searchOverride ?? window.location.search;

    // For development: allow forcing subdomain via env variable
    if (DEV_FORCE_SUBDOMAIN && (hostname === 'localhost' || hostname === '127.0.0.1')) {
      const app = SUBDOMAIN_MAP[DEV_FORCE_SUBDOMAIN] || 'main';
      return {
        app,
        subdomain: DEV_FORCE_SUBDOMAIN,
        isFlow: app === 'flow',
        isLife: app === 'life',
        isOne: app === 'one',
        isMain: app === 'main',
        domain: fullDomain,
      };
    }

    // Extract subdomain from hostname
    // Expected format: subdomain.nello.one or subdomain.domain.com
    const parts = hostname.split('.');

    // Check if it's a subdomain of nello.one (e.g., flow.nello.one)
    if (parts.length >= 3) {
      const subdomain = parts[0].toLowerCase();
      const app = SUBDOMAIN_MAP[subdomain] || 'main';

      return {
        app,
        subdomain,
        isFlow: app === 'flow',
        isLife: app === 'life',
        isOne: app === 'one',
        isMain: app === 'main',
        domain: fullDomain,
      };
    }

    // Preview / local domains: lovable.* (lovable.app, lovable.dev, lovableproject.com, etc.)
    // In this case, we use query params (?app=flow|business|one) or default to 'one'.
    if (hostname.includes('lovable')) {
      const urlParams = new URLSearchParams(search);
      const appParam = urlParams.get('app');
      if (appParam && SUBDOMAIN_MAP[appParam]) {
        const app = SUBDOMAIN_MAP[appParam];
        return {
          app,
          subdomain: appParam,
          isFlow: app === 'flow',
          isLife: app === 'life',
          isOne: app === 'one',
          isMain: false,
          domain: fullDomain,
        };
      }

      return {
        app: 'one',
        subdomain: null,
        isFlow: false,
        isLife: false,
        isOne: true,
        isMain: false,
        domain: fullDomain,
      };
    }

    // Default: main domain (nello.one without subdomain)
    return {
      app: 'main',
      subdomain: null,
      isFlow: false,
      isLife: false,
      isOne: false,
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
