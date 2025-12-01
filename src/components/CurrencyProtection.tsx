// Currency Protection Component - Enforces currency based on route
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

interface CurrencyProtectionProps {
  children: React.ReactNode;
}

export function CurrencyProtection({ children }: CurrencyProtectionProps) {
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    const isEnRoute = path.startsWith('/en');
    
    // Enforce language based on route
    if (isEnRoute && language !== 'en') {
      setLanguage('en');
    } else if (!isEnRoute && language === 'en' && !path.startsWith('/en')) {
      // If user is on PT route but has EN language, keep them on PT
      // This prevents cross-trade
    }

    // Cross-trade protection: Redirect if accessing wrong currency routes
    const crossTradeRedirects: Record<string, string> = {
      // PT user trying EN routes
      '/en/tests': '/testes',
      '/en/pricing': '/precos',
      '/en/checkout': '/comprar',
      '/en/dashboard': '/cliente',
      // EN user trying PT routes
      '/pt/testes': '/en/tests',
      '/pt/precos': '/en/pricing',
      '/pt/comprar': '/en/checkout',
      '/pt/cliente': '/en/dashboard',
    };

    // Check for cross-trade attempts
    if (language === 'pt' && isEnRoute) {
      const redirectTo = crossTradeRedirects[path];
      if (redirectTo) {
        toast.error('Você está sendo redirecionado para a versão brasileira do site.');
        navigate(redirectTo, { replace: true });
        return;
      }
    }

    // If somehow user on EN language tries to access PT routes directly
    if (language === 'en' && path.startsWith('/pt')) {
      const redirectTo = crossTradeRedirects[path];
      if (redirectTo) {
        toast.error('You are being redirected to the global version of the site.');
        navigate(redirectTo, { replace: true });
        return;
      }
    }
  }, [location.pathname, language, navigate, setLanguage]);

  return <>{children}</>;
}
