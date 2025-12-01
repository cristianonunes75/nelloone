// Price configuration for NELLO ONE - BRL (Brazil) and USD (Global)
// ANTI-CROSSTRADE: Prices are strictly tied to locale (/en = USD, /pt = BRL)

export type Currency = 'BRL' | 'USD';

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
}

// Stripe Price IDs for each test by currency
// PT routes MUST use BRL prices | EN routes MUST use USD prices
export const testPrices: Record<string, TestPrice> = {
  arquetipos: {
    testType: "arquetipos",
    brl: { price: 0, priceId: null }, // Free
    usd: { price: 19, priceId: "price_1SZNW0DjhZZxZELMopbi37cc" },
  },
  disc: {
    testType: "disc",
    brl: { price: 97, priceId: "price_1SNBIuDjhZZxZELMm3qUtTON" },
    usd: { price: 47, priceId: "price_1SZNWgDjhZZxZELMoEGJMpRt" },
  },
  mbti: {
    testType: "mbti",
    brl: { price: 197, priceId: "price_1SNBJEDjhZZxZELMY1CuVfIZ" },
    usd: { price: 57, priceId: "price_1SZNWuDjhZZxZELMXezDuVOz" },
  },
  eneagrama: {
    testType: "eneagrama",
    brl: { price: 177, priceId: "price_1SNBLhDjhZZxZELMhSvpHn8X" },
    usd: { price: 49, priceId: "price_1SZNX8DjhZZxZELMZhLy7W6b" },
  },
  temperamentos: {
    testType: "temperamentos",
    brl: { price: 117, priceId: null },
    usd: { price: 27, priceId: "price_1SZNXKDjhZZxZELMhOhi8sCL" },
  },
  linguagens_amor: {
    testType: "linguagens_amor",
    brl: { price: 127, priceId: null },
    usd: { price: 17, priceId: "price_1SZNXYDjhZZxZELMtlzZO8Id" },
  },
  inteligencias_multiplas: {
    testType: "inteligencias_multiplas",
    brl: { price: 147, priceId: null },
    usd: { price: 29, priceId: "price_1SZNXnDjhZZxZELMuGMkDImQ" },
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
};

// ANTI-CROSSTRADE: Get currency based on language
export const getCurrencyForLanguage = (language: "pt" | "en"): Currency => {
  return language === "en" ? "USD" : "BRL";
};

// ANTI-CROSSTRADE: Validate that currency matches language
export const validateCurrencyMatch = (
  language: "pt" | "en",
  currency: Currency
): { valid: boolean; expectedCurrency: Currency; error?: string } => {
  const expectedCurrency = getCurrencyForLanguage(language);
  const valid = currency === expectedCurrency;
  
  return {
    valid,
    expectedCurrency,
    error: valid ? undefined : (
      language === "en"
        ? "Currency mismatch. EN routes must use USD."
        : "Moeda incorreta. Rotas PT devem usar BRL."
    ),
  };
};

// Helper to get price based on language (ANTI-CROSSTRADE compliant)
export const getPriceForLanguage = (testType: string, language: "pt" | "en") => {
  const test = testPrices[testType];
  if (!test) return null;
  return language === "en" ? test.usd : test.brl;
};

// Helper to get bundle price based on language (ANTI-CROSSTRADE compliant)
export const getBundlePriceForLanguage = (language: "pt" | "en") => {
  return language === "en" ? bundlePrices.usd : bundlePrices.brl;
};

// Helper to format price with currency symbol
export const formatPrice = (price: number, language: "pt" | "en") => {
  if (language === "en") {
    return `$${price}`;
  }
  return `R$ ${price}`;
};

// Get all price IDs for a currency
export const getPriceIdsForCurrency = (currency: "brl" | "usd") => {
  const priceIds: string[] = [];
  Object.values(testPrices).forEach((test) => {
    const priceId = currency === "usd" ? test.usd.priceId : test.brl.priceId;
    if (priceId) priceIds.push(priceId);
  });
  return priceIds;
};

// ANTI-CROSSTRADE: Get price ID strictly based on language
export const getStrictPriceId = (
  testType: string,
  language: "pt" | "en"
): string | null => {
  const test = testPrices[testType];
  if (!test) return null;
  
  // Strict enforcement: language determines currency
  return language === "en" ? test.usd.priceId : test.brl.priceId;
};