// Price configuration for NELLO ONE - BRL (Brazil), USD (Global), EUR (Portugal)
// ANTI-CROSSTRADE: Prices are strictly tied to locale (/en = USD, /pt = BRL, /pt-pt = EUR)

import type { Language } from "@/contexts/LanguageContext";

export type Currency = 'BRL' | 'USD' | 'EUR';

export interface TestPrice {
  testType: string;
  brl: {
    price: number;
    priceId: string | null;
  };
  usd: {
    price: number;
    priceId: string;
  };
  eur: {
    price: number;
    priceId: string | null;
  };
}

// Stripe Price IDs for each test by currency
// PT routes MUST use BRL prices | EN routes MUST use USD prices | PT-PT routes MUST use EUR prices
export const testPrices: Record<string, TestPrice> = {
  arquetipos: {
    testType: "arquetipos",
    brl: { price: 0, priceId: null }, // Free
    usd: { price: 19, priceId: "price_1SZNW0DjhZZxZELMopbi37cc" },
    eur: { price: 0, priceId: null }, // Free
  },
  disc: {
    testType: "disc",
    brl: { price: 97, priceId: "price_1SNBIuDjhZZxZELMm3qUtTON" },
    usd: { price: 47, priceId: "price_1SZNWgDjhZZxZELMoEGJMpRt" },
    eur: { price: 47, priceId: null }, // TODO: Add EUR price ID
  },
  mbti: {
    testType: "mbti",
    brl: { price: 197, priceId: "price_1SNBJEDjhZZxZELMY1CuVfIZ" },
    usd: { price: 57, priceId: "price_1SZNWuDjhZZxZELMXezDuVOz" },
    eur: { price: 57, priceId: null }, // TODO: Add EUR price ID
  },
  eneagrama: {
    testType: "eneagrama",
    brl: { price: 177, priceId: "price_1SNBLhDjhZZxZELMhSvpHn8X" },
    usd: { price: 49, priceId: "price_1SZNX8DjhZZxZELMZhLy7W6b" },
    eur: { price: 49, priceId: null }, // TODO: Add EUR price ID
  },
  temperamentos: {
    testType: "temperamentos",
    brl: { price: 117, priceId: "price_1SZUnqDjhZZxZELMtU9tUMFm" },
    usd: { price: 27, priceId: "price_1SZNXKDjhZZxZELMhOhi8sCL" },
    eur: { price: 27, priceId: null }, // TODO: Add EUR price ID
  },
  linguagens_amor: {
    testType: "linguagens_amor",
    brl: { price: 127, priceId: "price_1SZUoWDjhZZxZELMxEJJKhDn" },
    usd: { price: 17, priceId: "price_1SZNXYDjhZZxZELMtlzZO8Id" },
    eur: { price: 17, priceId: null }, // TODO: Add EUR price ID
  },
  inteligencias_multiplas: {
    testType: "inteligencias_multiplas",
    brl: { price: 147, priceId: "price_1SZUpxDjhZZxZELMAkQlFX11" },
    usd: { price: 29, priceId: "price_1SZNXnDjhZZxZELMuGMkDImQ" },
    eur: { price: 29, priceId: null }, // TODO: Add EUR price ID
  },
};

// Bundle prices - FULL JOURNEY
export const bundlePrices = {
  brl: {
    original: 862,
    price: 597,
    priceId: null, // Create if needed
    currency: "BRL" as Currency,
    symbol: "R$",
  },
  usd: {
    original: 147,
    price: 97,
    priceId: "price_1SZNYXDjhZZxZELMoGVJUZRP",
    currency: "USD" as Currency,
    symbol: "$",
  },
  eur: {
    original: 147,
    price: 97,
    priceId: null, // TODO: Add EUR bundle price ID
    currency: "EUR" as Currency,
    symbol: "€",
  },
};

// ANTI-CROSSTRADE: Get currency based on language
export const getCurrencyForLanguage = (language: Language): Currency => {
  switch (language) {
    case 'en':
      return 'USD';
    case 'pt-pt':
      return 'EUR';
    case 'pt':
    default:
      return 'BRL';
  }
};

// ANTI-CROSSTRADE: Validate that currency matches language
export const validateCurrencyMatch = (
  language: Language,
  currency: Currency
): { valid: boolean; expectedCurrency: Currency; error?: string } => {
  const expectedCurrency = getCurrencyForLanguage(language);
  const valid = currency === expectedCurrency;
  
  const errorMessages: Record<Language, string> = {
    en: "Currency mismatch. EN routes must use USD.",
    pt: "Moeda incorreta. Rotas PT devem usar BRL.",
    'pt-pt': "Moeda incorreta. Rotas PT-PT devem usar EUR.",
  };
  
  return {
    valid,
    expectedCurrency,
    error: valid ? undefined : errorMessages[language],
  };
};

// Helper to get price based on language (ANTI-CROSSTRADE compliant)
export const getPriceForLanguage = (testType: string, language: Language) => {
  const test = testPrices[testType];
  if (!test) return null;
  
  switch (language) {
    case 'en':
      return test.usd;
    case 'pt-pt':
      return test.eur;
    case 'pt':
    default:
      return test.brl;
  }
};

// Helper to get bundle price based on language (ANTI-CROSSTRADE compliant)
export const getBundlePriceForLanguage = (language: Language) => {
  switch (language) {
    case 'en':
      return bundlePrices.usd;
    case 'pt-pt':
      return bundlePrices.eur;
    case 'pt':
    default:
      return bundlePrices.brl;
  }
};

// Helper to format price with currency symbol
export const formatPrice = (price: number, language: Language) => {
  switch (language) {
    case 'en':
      return `$${price}`;
    case 'pt-pt':
      return `€${price}`;
    case 'pt':
    default:
      return `R$ ${price}`;
  }
};

// Get all price IDs for a currency
export const getPriceIdsForCurrency = (currency: "brl" | "usd" | "eur") => {
  const priceIds: string[] = [];
  Object.values(testPrices).forEach((test) => {
    let priceId: string | null = null;
    switch (currency) {
      case "usd":
        priceId = test.usd.priceId;
        break;
      case "eur":
        priceId = test.eur.priceId;
        break;
      case "brl":
      default:
        priceId = test.brl.priceId;
    }
    if (priceId) priceIds.push(priceId);
  });
  return priceIds;
};

// ANTI-CROSSTRADE: Get price ID strictly based on language
export const getStrictPriceId = (
  testType: string,
  language: Language
): string | null => {
  const test = testPrices[testType];
  if (!test) return null;
  
  switch (language) {
    case 'en':
      return test.usd.priceId;
    case 'pt-pt':
      return test.eur.priceId;
    case 'pt':
    default:
      return test.brl.priceId;
  }
};
