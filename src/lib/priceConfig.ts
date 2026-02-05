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
// 
// IMPORTANT: To update Stripe price IDs, set these environment variables or update the values below:
// - NELLO_STRIPE_PRICE_ARQUETIPOS_BRL (Arquétipos com Propósito - Full version)
// - NELLO_STRIPE_PRICE_ARQUETIPOS_USD
// - NELLO_STRIPE_PRICE_ARQUETIPOS_EUR
export const testPrices: Record<string, TestPrice> = {
  // Arquétipos com Propósito - Freemium test (5 questions free, full version paid)
  arquetipos: {
    testType: "arquetipos",
    brl: { 
      price: 47,
      priceId: "price_1SayAYDjhZZxZELM9kEZiiF4"
    },
    usd: { 
      price: 19, 
      priceId: "price_1SZNW0DjhZZxZELMopbi37cc" 
    },
    eur: { 
      price: 9.90,
      priceId: "price_1SayKNDjhZZxZELMhCJ6Na9m"
    },
  },
  // Alias for the actual type name in database
  arquetipos_proposito: {
    testType: "arquetipos_proposito",
    brl: { 
      price: 47,
      priceId: "price_1SayAYDjhZZxZELM9kEZiiF4"
    },
    usd: { 
      price: 19, 
      priceId: "price_1SZNW0DjhZZxZELMopbi37cc" 
    },
    eur: { 
      price: 9.90,
      priceId: "price_1SayKNDjhZZxZELMhCJ6Na9m"
    },
  },
  disc: {
    testType: "disc",
    brl: { price: 97, priceId: "price_1SNBIuDjhZZxZELMm3qUtTON" },
    usd: { price: 47, priceId: "price_1SZNWgDjhZZxZELMoEGJMpRt" },
    eur: { price: 17.90, priceId: "price_1SZyxMDjhZZxZELMkolH98fK" },
  },
  mbti: {
    testType: "mbti",
    brl: { price: 197, priceId: "price_1SNBJEDjhZZxZELMY1CuVfIZ" },
    usd: { price: 57, priceId: "price_1SZNWuDjhZZxZELMXezDuVOz" },
    eur: { price: 52.90, priceId: "price_1SZz6TDjhZZxZELMXzDUT8kk" },
  },
  eneagrama: {
    testType: "eneagrama",
    brl: { price: 177, priceId: "price_1SNBLhDjhZZxZELMhSvpHn8X" },
    usd: { price: 49, priceId: "price_1SZNX8DjhZZxZELMZhLy7W6b" },
    eur: { price: 44.90, priceId: "price_1SZz5ADjhZZxZELMauUUwZSQ" },
  },
  temperamentos: {
    testType: "temperamentos",
    brl: { price: 117, priceId: "price_1SZUnqDjhZZxZELMtU9tUMFm" },
    usd: { price: 27, priceId: "price_1SZNXKDjhZZxZELMhOhi8sCL" },
    eur: { price: 24.90, priceId: "price_1SZyxYDjhZZxZELMATbPpg7h" },
  },
  // Estilos de Conexão Afetiva
  linguagens_amor: {
    testType: "linguagens_amor",
    brl: { price: 127, priceId: "price_1SZUoWDjhZZxZELMxEJJKhDn" },
    usd: { price: 17, priceId: "price_1SZNXYDjhZZxZELMtlzZO8Id" },
    eur: { price: 15.90, priceId: "price_1SZyykDjhZZxZELM9mlhNwLh" },
  },
  // Alias for new name
  estilos_conexao_afetiva: {
    testType: "linguagens_amor",
    brl: { price: 127, priceId: "price_1SZUoWDjhZZxZELMxEJJKhDn" },
    usd: { price: 17, priceId: "price_1SZNXYDjhZZxZELMtlzZO8Id" },
    eur: { price: 15.90, priceId: "price_1SZyykDjhZZxZELM9mlhNwLh" },
  },
  inteligencias_multiplas: {
    testType: "inteligencias_multiplas",
    brl: { price: 147, priceId: "price_1SZUpxDjhZZxZELMAkQlFX11" },
    usd: { price: 29, priceId: "price_1SZNXnDjhZZxZELMuGMkDImQ" },
    eur: { price: 27.90, priceId: "price_1SZz0nDjhZZxZELMVagCtoXs" },
  },
  // Código da Essência - Premium final report (requires all 7 tests completed)
  codigo_da_essencia: {
    testType: "codigo_da_essencia",
    brl: { price: 397, priceId: "price_1Sc2RRDjhZZxZELMPxAnu0I5" },
    usd: { price: 97, priceId: "price_1Sc2RfDjhZZxZELMbZP1CvLO" },
    eur: { price: 97, priceId: "price_1Sc2TRDjhZZxZELMr66uJZZm" },
  },
  // Ativação do Código da Essência - Premium activation report
  ativacao_codigo: {
    testType: "ativacao_codigo",
    brl: { price: 197, priceId: "price_1Sw6EEDjhZZxZELMSmPNECig" },
    usd: { price: 57, priceId: "price_1Sw6F6DjhZZxZELMfBW3pn5q" },
    eur: { price: 47, priceId: "price_1Sw6FiDjhZZxZELMXDH1ACdx" },
  },
  // Ativação de Direção Profissional - Career direction upsell (UNIQUE Price IDs - NOT shared with ativacao_codigo)
  activation_individual: {
    testType: "activation_individual",
    brl: { price: 197, priceId: "price_1SxRhHDjhZZxZELMuoj7N1CN" },
    usd: { price: 57, priceId: "price_1SxRhuDjhZZxZELMsAYBZqUP" },
    eur: { price: 47, priceId: "price_1SxRjKDjhZZxZELMAqWHQKbm" },
  },
  // Identity Couple Premium - Mapa Definitivo do Casal (7 Pilares) HIGH TICKET
  identity_couple_premium: {
    testType: "identity_couple_premium",
    brl: { 
      price: 997, 
      priceId: "price_1StyMcDjhZZxZELM5IVwqfhV" // R$997 (12x R$99)
    },
    usd: { 
      price: 297, 
      priceId: "price_1SvfdXDjhZZxZELMaNDfVXox" 
    },
    eur: { 
      price: 247, 
      priceId: "price_1SvfdoDjhZZxZELMLaONPhR5" 
    },
  },
};

// Identity Couple Premium - High Ticket product (R$ 997 / 12x R$ 99)
export const identityCouplePremiumPrices = {
  name: "Identity Couple Premium - Mapa Definitivo do Casal",
  productType: "identity_couple_premium",
  description: "Relatório completo de 7 pilares: DISC, Eneagrama, Temperamentos, Inteligências Múltiplas, Arquétipos, Estilos de Conexão e Nello 16. O livro definitivo da identidade do seu relacionamento.",
  features: [
    "15-20 páginas de análise profunda",
    "Protocolo de Ritmo do Casal (Temperamentos)",
    "Sinergia de Talentos (Inteligências Múltiplas)",
    "Mito do Casal (Arquétipos)",
    "Plano de Abastecimento Emocional (Linguagens de Amor)",
    "Tomada de Decisão Conjunta (Nello 16)",
    "Seção de Ativações para recorrência",
  ],
  brl: {
    price: 997,
    installments: 12,
    installmentPrice: 99,
    originalPrice: 1497,
    priceId: "price_1StyMcDjhZZxZELM5IVwqfhV",
    currency: "BRL" as Currency,
    symbol: "R$",
  },
  usd: {
    price: 297,
    installments: 12,
    installmentPrice: 29,
    originalPrice: 447,
    priceId: "price_1SvfdXDjhZZxZELMaNDfVXox",
    currency: "USD" as Currency,
    symbol: "$",
  },
  eur: {
    price: 247,
    installments: 12,
    installmentPrice: 24,
    originalPrice: 397,
    priceId: "price_1SvfdoDjhZZxZELMLaONPhR5",
    currency: "EUR" as Currency,
    symbol: "€",
  },
};

// Fundadores - Special launch tier with complete access
export const fundadoresPrices = {
  name: "Fundadores Nello One",
  productType: "fundadores",
  brl: {
    price: 197,
    originalPrice: 597,
    priceId: "price_1ScWglDjhZZxZELM3tQocxgu",
    currency: "BRL" as Currency,
    symbol: "R$",
  },
  usd: {
    price: 97,
    originalPrice: 147,
    priceId: "price_1ScWglDjhZZxZELM3tQocxgu", // Same price for now
    currency: "USD" as Currency,
    symbol: "$",
  },
  eur: {
    price: 97,
    originalPrice: 147,
    priceId: "price_1ScWglDjhZZxZELM3tQocxgu", // Same price for now
    currency: "EUR" as Currency,
    symbol: "€",
  },
};

// Bundle prices - FULL JOURNEY (VALIDATION PHASE: R$297 includes everything)
// Includes: 7 tests + Premium PDFs + Código da Essência
export const bundlePrices = {
  brl: {
    original: 597,
    price: 297,
    priceId: "price_1SeL7gDjhZZxZELMKuDFTI5t", // NELLO ONE Jornada Completa - R$297
    currency: "BRL" as Currency,
    symbol: "R$",
    includesCodigoEssencia: true,
  },
  usd: {
    original: 147,
    price: 97,
    priceId: "price_1SZNYXDjhZZxZELMoGVJUZRP",
    currency: "USD" as Currency,
    symbol: "$",
    includesCodigoEssencia: true,
  },
  eur: {
    original: 184,
    price: 89,
    priceId: "price_1SZz6vDjhZZxZELMQsZuLKah",
    currency: "EUR" as Currency,
    symbol: "€",
    includesCodigoEssencia: true,
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
