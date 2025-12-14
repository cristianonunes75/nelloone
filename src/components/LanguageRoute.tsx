import { useEffect } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useLanguage, Language } from '@/contexts/LanguageContext';

// Feature flags to control language version availability
// VALIDATION PHASE: Disabled EN/PT-PT to focus on PT-BR market first
const ENGLISH_VERSION_ENABLED = false;
const PT_PT_VERSION_ENABLED = false;

interface LanguageRouteProps {
  children: React.ReactNode;
}

export function LanguageRoute({ children }: LanguageRouteProps) {
  const location = useLocation();
  const { language, setLanguage } = useLanguage();

  // Redirect /en/* to / if English version is not enabled
  if (!ENGLISH_VERSION_ENABLED && location.pathname.startsWith('/en')) {
    const ptPath = location.pathname
      .replace('/en/tests/', '/testes/')
      .replace('/en/tests', '/testes')
      .replace('/en', '') || '/';
    return <Navigate to={ptPath} replace />;
  }

  // Redirect /pt-pt/* to / if PT-PT version is not enabled
  if (!PT_PT_VERSION_ENABLED && location.pathname.startsWith('/pt-pt')) {
    const ptPath = location.pathname
      .replace('/pt-pt/testes/', '/testes/')
      .replace('/pt-pt/testes', '/testes')
      .replace('/pt-pt', '') || '/';
    return <Navigate to={ptPath} replace />;
  }

  useEffect(() => {
    // Sync language with URL path
    if (location.pathname.startsWith('/pt-pt') && language !== 'pt-pt') {
      setLanguage('pt-pt');
    } else if (location.pathname.startsWith('/en') && language !== 'en') {
      setLanguage('en');
    } else if (!location.pathname.startsWith('/en') && !location.pathname.startsWith('/pt-pt') && language !== 'pt') {
      // Root path or /pt/* routes default to PT-BR
      // Only set to PT if not already set to PT
      if (language === 'en' || language === 'pt-pt') {
        setLanguage('pt');
      }
    }
  }, [location.pathname, language, setLanguage]);

  return <>{children}</>;
}

// Helper hook to build localized paths
export function useLocalizedPath() {
  const { language } = useLanguage();
  
  return (path: string) => {
    // If path already has language prefix, return as-is
    if (path.startsWith('/en/') || path.startsWith('/pt-pt/')) {
      return path;
    }
    // For root path, just add language prefix
    if (path === '/') {
      if (language === 'en') return '/en';
      if (language === 'pt-pt') return '/pt-pt';
      return '/';
    }
    // For other paths, add language prefix based on current language
    if (language === 'en') return `/en${path}`;
    if (language === 'pt-pt') return `/pt-pt${path}`;
    return path;
  };
}

// Get route prefix for a language
export function getLanguageRoutePrefix(lang: Language): string {
  switch (lang) {
    case 'en':
      return '/en';
    case 'pt-pt':
      return '/pt-pt';
    case 'pt':
    default:
      return '';
  }
}

// Redirect component for language-aware navigation
export function LanguageRedirect({ to }: { to: string }) {
  const { language } = useLanguage();
  const prefix = getLanguageRoutePrefix(language);
  const localizedPath = `${prefix}${to}`;
  return <Navigate to={localizedPath} replace />;
}
