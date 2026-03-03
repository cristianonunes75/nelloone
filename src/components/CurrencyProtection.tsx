// Currency Protection Component - Enforces currency based on route
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

interface CurrencyProtectionProps {
  children: React.ReactNode;
}

export function CurrencyProtection({ children }: CurrencyProtectionProps) {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    const isEnRoute = path.startsWith('/en');
    const isPtPtRoute = path.startsWith('/pt-pt');
    
    // NOTE: Language sync is handled by LanguageRoute component.
    // This component only handles cross-trade protection for commerce routes.

    // Cross-trade protection: Only applies after language is synced with route
    // PT-BR users (language='pt') should stay on / routes (BRL)
    // EN users (language='en') should stay on /en routes (USD)
    // PT-PT users (language='pt-pt') should stay on /pt-pt routes (EUR)
    
    // Skip protection if language matches route (normal navigation)
    if ((isEnRoute && language === 'en') || 
        (isPtPtRoute && language === 'pt-pt') || 
        (!isEnRoute && !isPtPtRoute && language === 'pt')) {
      return; // All good, no cross-trade
    }

    // Protection logic for specific commerce routes only
    const isCommerceRoute = path.includes('/testes') || 
                           path.includes('/tests') || 
                           path.includes('/cliente') || 
                           path.includes('/comprar') ||
                           path.includes('/purchase');

    if (!isCommerceRoute) {
      return; // Don't protect non-commerce routes
    }

    // Check for cross-trade attempts from PT-BR to EN (BRL → USD)
    if (language === 'pt' && isEnRoute) {
      toast.error('Você está sendo redirecionado para a versão brasileira do site.');
      const ptPath = path.replace('/en/tests', '/testes').replace('/en', '') || '/';
      navigate(ptPath, { replace: true });
      return;
    }

    // Check for cross-trade attempts from EN to PT-BR (USD → BRL)
    if (language === 'en' && !isEnRoute && !isPtPtRoute) {
      toast.error('You are being redirected to the global version of the site.');
      const enPath = '/en' + path.replace('/testes', '/tests');
      navigate(enPath, { replace: true });
      return;
    }

    // Check for cross-trade attempts from PT-PT to PT-BR (EUR → BRL)
    if (language === 'pt-pt' && !isPtPtRoute && !isEnRoute) {
      toast.error('Está a ser redirecionado para a versão portuguesa do site.');
      const ptPtPath = '/pt-pt' + path;
      navigate(ptPtPath, { replace: true });
      return;
    }

    // Check for cross-trade attempts from PT-PT to EN (EUR → USD)
    if (language === 'pt-pt' && isEnRoute) {
      toast.error('Está a ser redirecionado para a versão portuguesa do site.');
      const ptPtPath = path.replace('/en/tests', '/pt-pt/testes').replace('/en', '/pt-pt');
      navigate(ptPtPath, { replace: true });
      return;
    }

    // Check for cross-trade attempts from EN to PT-PT (USD → EUR)
    if (language === 'en' && isPtPtRoute) {
      toast.error('You are being redirected to the global version of the site.');
      const enPath = path.replace('/pt-pt/testes', '/en/tests').replace('/pt-pt', '/en');
      navigate(enPath, { replace: true });
      return;
    }
  }, [location.pathname, language, navigate]);

  return <>{children}</>;
}
