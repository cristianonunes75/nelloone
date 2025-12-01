// Currency Protection Hook - Prevents cross-trade between currencies
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

export type Currency = 'BRL' | 'USD';

interface CurrencyConfig {
  currency: Currency;
  symbol: string;
  locale: string;
}

const CURRENCY_MAP: Record<'pt' | 'en', CurrencyConfig> = {
  pt: { currency: 'BRL', symbol: 'R$', locale: 'pt-BR' },
  en: { currency: 'USD', symbol: '$', locale: 'en-US' },
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
    
    // Check if user is trying to access wrong locale route
    const isEnRoute = path.startsWith('/en');
    const isPtRoute = !isEnRoute; // Default is PT
    
    // If language is EN but trying to access PT route with /pt prefix
    if (language === 'en' && path.startsWith('/pt')) {
      const newPath = path.replace('/pt', '/en');
      navigate(newPath, { replace: true });
      return;
    }
    
    // If language is PT but trying to access EN route
    if (language === 'pt' && isEnRoute) {
      // Redirect EN routes to PT equivalents
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
  routeLanguage: 'pt' | 'en'
): { valid: boolean; error?: string } {
  const expectedCurrency = CURRENCY_MAP[routeLanguage].currency;
  
  if (requestedCurrency !== expectedCurrency) {
    return {
      valid: false,
      error: routeLanguage === 'en'
        ? 'Currency mismatch. Please access the correct version of the site for your region.'
        : 'Moeda incorreta. Acesse a versão correta do site para sua região.',
    };
  }
  
  return { valid: true };
}

// Get correct price ID based on language
export function getPriceIdForLanguage(testType: string, language: 'pt' | 'en'): string | null {
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
  };

  if (language === 'en') {
    return USD_PRICES[testType] || null;
  }
  return BRL_PRICES[testType] || null;
}
