// Currency Protection Hook - Prevents cross-trade between currencies
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage, Language } from '@/contexts/LanguageContext';

export type Currency = 'BRL' | 'USD' | 'EUR';

interface CurrencyConfig {
  currency: Currency;
  symbol: string;
  locale: string;
}

const CURRENCY_MAP: Record<Language, CurrencyConfig> = {
  pt: { currency: 'BRL', symbol: 'R$', locale: 'pt-BR' },
  en: { currency: 'USD', symbol: '$', locale: 'en-US' },
  'pt-pt': { currency: 'EUR', symbol: '€', locale: 'pt-PT' },
};

// Routes that require currency protection
const PROTECTED_ROUTES = [
  '/testes', '/tests',
  '/pricing', '/precos',
  '/checkout', '/comprar',
  '/cliente', '/dashboard',
  '/me', '/perfil',
];

export function useCurrencyProtection() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const currencyConfig = CURRENCY_MAP[language];

  useEffect(() => {
    const path = location.pathname;
    
    // Check route language prefix
    const isEnRoute = path.startsWith('/en');
    const isPtPtRoute = path.startsWith('/pt-pt');
    const isPtRoute = !isEnRoute && !isPtPtRoute;
    
    // If language is EN but trying to access PT-PT route
    if (language === 'en' && isPtPtRoute) {
      const newPath = path.replace('/pt-pt', '/en');
      navigate(newPath, { replace: true });
      return;
    }
    
    // If language is PT-PT but trying to access EN route
    if (language === 'pt-pt' && isEnRoute) {
      const newPath = path.replace('/en', '/pt-pt');
      navigate(newPath, { replace: true });
      return;
    }
    
    // If language is PT but trying to access EN route
    if (language === 'pt' && isEnRoute) {
      const routeMap: Record<string, string> = {
        '/en/tests': '/testes',
        '/en/pricing': '/precos',
        '/en/dashboard': '/cliente',
        '/en/me': '/me',
        '/en': '/',
      };
      
      const mappedRoute = Object.entries(routeMap).find(([en]) => path.startsWith(en));
      if (mappedRoute) {
        navigate(mappedRoute[1], { replace: true });
        return;
      }
    }
    
    // If language is PT but trying to access PT-PT route
    if (language === 'pt' && isPtPtRoute) {
      const newPath = path.replace('/pt-pt', '');
      navigate(newPath || '/', { replace: true });
      return;
    }
  }, [location.pathname, language, navigate]);

  return {
    currency: currencyConfig.currency,
    symbol: currencyConfig.symbol,
    locale: currencyConfig.locale,
    language,
    formatPrice: (amount: number) => {
      return new Intl.NumberFormat(currencyConfig.locale, {
        style: 'currency',
        currency: currencyConfig.currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    },
  };
}

// Validate currency matches route - for checkout validation
export function validateCurrencyForRoute(
  requestedCurrency: Currency, 
  routeLanguage: Language
): { valid: boolean; error?: string } {
  const expectedCurrency = CURRENCY_MAP[routeLanguage].currency;
  
  if (requestedCurrency !== expectedCurrency) {
    const errorMessages: Record<Language, string> = {
      en: 'Currency mismatch. Please access the correct version of the site for your region.',
      pt: 'Moeda incorreta. Acesse a versão correta do site para sua região.',
      'pt-pt': 'Moeda incorreta. Acede à versão correta do site para a tua região.',
    };
    
    return {
      valid: false,
      error: errorMessages[routeLanguage],
    };
  }
  
  return { valid: true };
}

// Get correct price ID based on language
export function getPriceIdForLanguage(testType: string, language: Language): string | null {
  const USD_PRICES: Record<string, string> = {
    arquetipos: "price_1SZNW0DjhZZxZELMopbi37cc",
    disc: "price_1SZNWgDjhZZxZELMoEGJMpRt",
    mbti: "price_1SZNWuDjhZZxZELMXezDuVOz",
    eneagrama: "price_1SZNX8DjhZZxZELMZhLy7W6b",
    temperamentos: "price_1SZNXKDjhZZxZELMhOhi8sCL",
    linguagens_amor: "price_1SZNXYDjhZZxZELMtlzZO8Id",
    inteligencias_multiplas: "price_1SZNXnDjhZZxZELMuGMkDImQ",
    bundle: "price_1SZNYXDjhZZxZELMoGVJUZRP",
  };

  const BRL_PRICES: Record<string, string> = {
    disc: "price_1SNBIuDjhZZxZELMm3qUtTON",
    mbti: "price_1SNBJEDjhZZxZELMY1CuVfIZ",
    eneagrama: "price_1SNBLhDjhZZxZELMhSvpHn8X",
    temperamentos: "price_1SZUnqDjhZZxZELMtU9tUMFm",
    linguagens_amor: "price_1SZUoWDjhZZxZELMxEJJKhDn",
    inteligencias_multiplas: "price_1SZUpxDjhZZxZELMAkQlFX11",
  };

  // EUR prices - to be filled with actual Stripe price IDs
  const EUR_PRICES: Record<string, string> = {
    // These will be filled when user provides EUR price IDs
  };

  switch (language) {
    case 'en':
      return USD_PRICES[testType] || null;
    case 'pt-pt':
      return EUR_PRICES[testType] || null;
    case 'pt':
    default:
      return BRL_PRICES[testType] || null;
  }
}

// Get currency error messages for anti-crosstrade protection
export function getCurrencyErrorMessage(userLanguage: Language, attemptedCurrency: Currency): string {
  const messages: Record<Language, Record<Currency, string>> = {
    pt: {
      USD: "Pagamentos no Brasil devem ser feitos em Reais (R$).",
      EUR: "Pagamentos no Brasil devem ser feitos em Reais (R$).",
      BRL: "",
    },
    en: {
      BRL: "Payments in the United States must be processed in USD.",
      EUR: "Payments in the United States must be processed in USD.",
      USD: "",
    },
    "pt-pt": {
      BRL: "Os pagamentos em Portugal devem ser realizados em Euros (€) para garantir conformidade e suporte regional.",
      USD: "Os pagamentos em Portugal devem ser realizados em Euros (€) para garantir conformidade e suporte regional.",
      EUR: "",
    },
  };
  
  return messages[userLanguage][attemptedCurrency] || "Currency mismatch error.";
}
