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
    const isPtPtRoute = path.startsWith('/pt-pt');
    
    // Enforce language based on route
    if (isEnRoute && language !== 'en') {
      setLanguage('en');
    } else if (isPtPtRoute && language !== 'pt-pt') {
      setLanguage('pt-pt');
    } else if (!isEnRoute && !isPtPtRoute && language !== 'pt') {
      // Root routes default to PT-BR
      if (language === 'en' || language === 'pt-pt') {
        // Only redirect if explicitly on wrong route, not just different preference
      }
    }

    // Cross-trade protection: Redirect if accessing wrong currency routes
    // PT-BR users should stay on / routes (BRL)
    // EN users should stay on /en routes (USD)
    // PT-PT users should stay on /pt-pt routes (EUR)
    
    // Check for cross-trade attempts from PT-BR to EN (BRL → USD)
    if (language === 'pt' && isEnRoute) {
      toast.error('Você está sendo redirecionado para a versão brasileira do site.');
      const ptPath = path.replace('/en/tests', '/testes').replace('/en', '') || '/';
      navigate(ptPath, { replace: true });
      return;
    }

    // Check for cross-trade attempts from PT-BR to PT-PT (BRL → EUR)
    if (language === 'pt' && isPtPtRoute) {
      toast.error('Você está sendo redirecionado para a versão brasileira do site.');
      const ptPath = path.replace('/pt-pt/testes', '/testes').replace('/pt-pt', '') || '/';
      navigate(ptPath, { replace: true });
      return;
    }

    // Check for cross-trade attempts from EN to PT-BR (USD → BRL)
    if (language === 'en' && !isEnRoute && !isPtPtRoute && path !== '/') {
      // Allow root path for language detection, but protect other routes
      if (path.startsWith('/testes') || path.startsWith('/cliente') || path.startsWith('/comprar')) {
        toast.error('You are being redirected to the global version of the site.');
        const enPath = '/en' + path.replace('/testes', '/tests');
        navigate(enPath, { replace: true });
        return;
      }
    }

    // Check for cross-trade attempts from PT-PT to PT-BR (EUR → BRL)
    if (language === 'pt-pt' && !isPtPtRoute && !isEnRoute) {
      if (path.startsWith('/testes') || path.startsWith('/cliente') || path.startsWith('/comprar')) {
        toast.error('Está a ser redirecionado para a versão portuguesa do site.');
        const ptPtPath = '/pt-pt' + path;
        navigate(ptPtPath, { replace: true });
        return;
      }
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
  }, [location.pathname, language, navigate, setLanguage]);

  return <>{children}</>;
}
