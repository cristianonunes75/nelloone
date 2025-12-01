import { useEffect } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

interface LanguageRouteProps {
  children: React.ReactNode;
}

export function LanguageRoute({ children }: LanguageRouteProps) {
  const location = useLocation();
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    // If we're under /en/ path, ensure language is set to English
    if (location.pathname.startsWith('/en') && language !== 'en') {
      setLanguage('en');
    }
  }, [location.pathname, language, setLanguage]);

  return <>{children}</>;
}

// Helper hook to build localized paths
export function useLocalizedPath() {
  const { language } = useLanguage();
  
  return (path: string) => {
    // If path already has language prefix, return as-is
    if (path.startsWith('/en/') || path.startsWith('/pt/')) {
      return path;
    }
    // For root path, just add language prefix
    if (path === '/') {
      return language === 'en' ? '/en' : '/';
    }
    // For other paths, add language prefix only for EN
    return language === 'en' ? `/en${path}` : path;
  };
}

// Redirect component for language-aware navigation
export function LanguageRedirect({ to }: { to: string }) {
  const { language } = useLanguage();
  const localizedPath = language === 'en' ? `/en${to}` : to;
  return <Navigate to={localizedPath} replace />;
}
