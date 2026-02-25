import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const logStep = (step: string, details?: any) => {
  console.log(`[CREATE-CHECKOUT] ${step}`, details ? JSON.stringify(details) : '');
};

// Get client IP from request
function getClientIP(req: Request): string {
  const cfIP = req.headers.get("cf-connecting-ip");
  if (cfIP) return cfIP;
  
  const xForwardedFor = req.headers.get("x-forwarded-for");
  if (xForwardedFor) {
    return xForwardedFor.split(",")[0].trim();
  }
  
  const xRealIP = req.headers.get("x-real-ip");
  if (xRealIP) return xRealIP;
  
  return "unknown";
}

// Detect country from IP using ip-api.com (free, no key required)
async function getCountryFromIP(ip: string): Promise<string | null> {
  if (ip === "unknown" || ip === "127.0.0.1" || ip.startsWith("192.168.") || ip.startsWith("10.")) {
    logStep("Local IP detected, skipping geo check", { ip });
    return null;
  }
  
  try {
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,countryCode`);
    const data = await response.json();
    
    if (data.status === "success") {
      logStep("IP geolocation successful", { ip, country: data.countryCode });
      return data.countryCode;
    }
    
    logStep("IP geolocation failed", { ip, status: data.status });
    return null;
  } catch (error) {
    logStep("IP geolocation error", { ip, error: error instanceof Error ? error.message : String(error) });
    return null;
  }
}

// EU countries that can use EUR
const EU_COUNTRIES = [
  "PT", "ES", "FR", "DE", "IT", "NL", "BE", "AT", "IE", "FI", 
  "GR", "LU", "MT", "CY", "SK", "SI", "EE", "LV", "LT", "HR"
];

// Validate IP country matches currency (Anti-CrossTrade Protection)
function validateIPForCurrency(country: string | null, currency: string): { valid: boolean; reason?: string } {
  if (!country) {
    logStep("Country detection failed, allowing transaction");
    return { valid: true };
  }
  
  // BRL can only be used from Brazil
  if (currency === "brl" && country !== "BR") {
    logStep("BLOCKED: BRL purchase from non-Brazilian IP", { country, currency });
    return { 
      valid: false, 
      reason: "BRL_FROM_NON_BRAZIL"
    };
  }
  
  // USD cannot be used from Brazil or EU
  if (currency === "usd" && (country === "BR" || EU_COUNTRIES.includes(country))) {
    logStep("BLOCKED: USD purchase from Brazil/EU IP", { country, currency });
    return { 
      valid: false, 
      reason: "USD_FROM_BRAZIL_OR_EU"
    };
  }
  
  // EUR can only be used from EU countries (primarily Portugal)
  if (currency === "eur" && !EU_COUNTRIES.includes(country)) {
    logStep("BLOCKED: EUR purchase from non-EU IP", { country, currency });
    return { 
      valid: false, 
      reason: "EUR_FROM_NON_EU"
    };
  }
  
  logStep("IP country validation passed", { country, currency });
  return { valid: true };
}

// Currency validation error messages
const CURRENCY_ERROR_MESSAGES: Record<string, string> = {
  pt: "Você está tentando finalizar uma compra em moeda diferente da sua região. Acesse a versão correta do site.",
  en: "You are trying to complete a purchase in a different currency than your region. Please access the correct version of the site.",
  "pt-pt": "Está a tentar finalizar uma compra numa moeda diferente da sua região. Aceda à versão correta do site.",
};

// USD Price IDs for EN version (Global market)
const USD_PRICES: Record<string, string> = {
  arquetipos: "price_1SZNW0DjhZZxZELMopbi37cc",
  arquetipos_proposito: "price_1SZNW0DjhZZxZELMopbi37cc",
  disc: "price_1SZNWgDjhZZxZELMoEGJMpRt",
  mbti: "price_1SZNWuDjhZZxZELMXezDuVOz",
  eneagrama: "price_1SZNX8DjhZZxZELMZhLy7W6b",
  temperamentos: "price_1SZNXKDjhZZxZELMhOhi8sCL",
  linguagens_amor: "price_1SZNXYDjhZZxZELMtlzZO8Id",
  inteligencias_multiplas: "price_1SZNXnDjhZZxZELMuGMkDImQ",
  bundle: "price_1SZNYXDjhZZxZELMoGVJUZRP",
  codigo_da_essencia: "price_1Sc2RfDjhZZxZELMbZP1CvLO", // $97 USD
  ativacao_codigo: "price_1Sw6F6DjhZZxZELMfBW3pn5q", // $57 USD - Ativação do Código da Essência
  activation_individual: "price_1SxRhuDjhZZxZELMsAYBZqUP", // $57 USD - Ativação de Direção Profissional (UNIQUE)
  codigo_casal: "price_placeholder_codigo_casal_usd", // $9 USD - Couple's Code
  fundadores: "price_1ScWglDjhZZxZELM3tQocxgu", // R$197 (BRL only)
};

// BRL Price IDs for PT version (Brazilian market)
const BRL_PRICES: Record<string, string> = {
  arquetipos: "price_1SayAYDjhZZxZELM9kEZiiF4",
  arquetipos_proposito: "price_1SayAYDjhZZxZELM9kEZiiF4",
  disc: "price_1SNBIuDjhZZxZELMm3qUtTON",
  mbti: "price_1SNBJEDjhZZxZELMY1CuVfIZ",
  eneagrama: "price_1SNBLhDjhZZxZELMhSvpHn8X",
  temperamentos: "price_1SZUnqDjhZZxZELMtU9tUMFm",
  linguagens_amor: "price_1SZUoWDjhZZxZELMxEJJKhDn",
  inteligencias_multiplas: "price_1SZUpxDjhZZxZELMAkQlFX11",
  bundle: "price_1SyxwqDjhZZxZELM5b6l6Ug4", // R$1.297 - Jornada Identity Completa + 1 Ativação do Código
  codigo_da_essencia: "price_1Sc2RRDjhZZxZELMPxAnu0I5", // R$397 BRL
  ativacao_codigo: "price_1Sw6EEDjhZZxZELMSmPNECig", // R$197 BRL - Ativação do Código da Essência
  activation_individual: "price_1SxRhHDjhZZxZELMuoj7N1CN", // R$197 BRL - Ativação de Direção Profissional (UNIQUE)
  codigo_casal: "price_placeholder_codigo_casal_brl", // R$47 BRL - Couple's Code
  fundadores: "price_1ScWglDjhZZxZELM3tQocxgu", // R$197 (BRL only)
};

// EUR Price IDs for PT-PT version (Portugal/European market)
const EUR_PRICES: Record<string, string> = {
  arquetipos: "price_1SayKNDjhZZxZELMhCJ6Na9m",
  arquetipos_proposito: "price_1SayKNDjhZZxZELMhCJ6Na9m",
  disc: "price_1SZyxMDjhZZxZELMkolH98fK",
  mbti: "price_1SZz6TDjhZZxZELMXzDUT8kk",
  eneagrama: "price_1SZz5ADjhZZxZELMauUUwZSQ",
  temperamentos: "price_1SZyxYDjhZZxZELMATbPpg7h",
  linguagens_amor: "price_1SZyykDjhZZxZELM9mlhNwLh",
  inteligencias_multiplas: "price_1SZz0nDjhZZxZELMVagCtoXs",
  bundle: "price_1SZz6vDjhZZxZELMQsZuLKah",
  codigo_da_essencia: "price_1Sc2TRDjhZZxZELMr66uJZZm", // €97 EUR
  ativacao_codigo: "price_1Sw6FiDjhZZxZELMXDH1ACdx", // €47 EUR - Ativação do Código da Essência
  activation_individual: "price_1SxRjKDjhZZxZELMAqWHQKbm", // €47 EUR - Ativação de Direção Profissional (UNIQUE)
  codigo_casal: "price_placeholder_codigo_casal_eur", // €12 EUR - Couple's Code
  fundadores: "price_1ScWglDjhZZxZELM3tQocxgu", // R$197 (BRL only - not available in EUR)
};

// Get expected currency based on language
function getExpectedCurrency(language: string): string {
  switch (language) {
    case "en":
      return "usd";
    case "pt-pt":
      return "eur";
    case "pt":
    default:
      return "brl";
  }
}

// Validate currency matches language (Anti-CrossTrade Protection)
function validateCurrencyForLanguage(language: string, requestedCurrency?: string): { valid: boolean; expectedCurrency: string } {
  const expectedCurrency = getExpectedCurrency(language);
  
  if (!requestedCurrency) {
    return { valid: true, expectedCurrency };
  }
  
  const valid = requestedCurrency.toLowerCase() === expectedCurrency;
  return { valid, expectedCurrency };
}

// Get price map based on currency
function getPriceMap(currency: string): Record<string, string> {
  switch (currency) {
    case "usd":
      return USD_PRICES;
    case "eur":
      return EUR_PRICES;
    case "brl":
    default:
      return BRL_PRICES;
  }
}

// ============================================================================
// NELLO ONE PRODUCT NAMING - Always use "NELLO ONE" branding, never "Essentia"
// ============================================================================
const PRODUCT_NAMES: Record<string, Record<string, { name: string; description: string }>> = {
  arquetipos: {
    pt: { 
      name: "Arquétipos com Propósito – Acesso Completo NELLO ONE", 
      description: "Desbloqueie todas as 36 perguntas e o relatório completo dos 12 arquétipos" 
    },
    en: { 
      name: "Archetypes with Purpose – Full Access NELLO ONE", 
      description: "Unlock all 36 questions and the complete 12 archetypes report" 
    },
    "pt-pt": { 
      name: "Arquétipos com Propósito – Acesso Completo NELLO ONE", 
      description: "Desbloqueie todas as 36 perguntas e o relatório completo dos 12 arquétipos" 
    },
  },
  arquetipos_proposito: {
    pt: { 
      name: "Arquétipos com Propósito – Acesso Completo NELLO ONE", 
      description: "Desbloqueie todas as 36 perguntas e o relatório completo dos 12 arquétipos" 
    },
    en: { 
      name: "Archetypes with Purpose – Full Access NELLO ONE", 
      description: "Unlock all 36 questions and the complete 12 archetypes report" 
    },
    "pt-pt": { 
      name: "Arquétipos com Propósito – Acesso Completo NELLO ONE", 
      description: "Desbloqueie todas as 36 perguntas e o relatório completo dos 12 arquétipos" 
    },
  },
  disc: {
    pt: { name: "Teste DISC – NELLO ONE", description: "Acesso vitalício ao teste DISC" },
    en: { name: "DISC Test – NELLO ONE", description: "Lifetime access to DISC test" },
    "pt-pt": { name: "Teste DISC – NELLO ONE", description: "Acesso vitalício ao teste DISC" },
  },
  mbti: {
    pt: { name: "Nello 16 Personality Map – NELLO ONE", description: "Acesso vitalício ao mapa das 16 personalidades" },
    en: { name: "Nello 16 Personality Map – NELLO ONE", description: "Lifetime access to 16 personalities map" },
    "pt-pt": { name: "Mapa das 16 Personalidades Nello – NELLO ONE", description: "Acesso vitalício ao mapa das 16 personalidades" },
  },
  eneagrama: {
    pt: { name: "Eneagrama Essencial – NELLO ONE", description: "Acesso vitalício ao teste de Eneagrama" },
    en: { name: "Essential Enneagram – NELLO ONE", description: "Lifetime access to Enneagram test" },
    "pt-pt": { name: "Eneagrama Essencial – NELLO ONE", description: "Acesso vitalício ao teste de Eneagrama" },
  },
  temperamentos: {
    pt: { name: "Teste de Temperamentos – NELLO ONE", description: "Acesso vitalício ao teste de Temperamentos" },
    en: { name: "Temperaments Test – NELLO ONE", description: "Lifetime access to Temperaments test" },
    "pt-pt": { name: "Teste de Temperamentos – NELLO ONE", description: "Acesso vitalício ao teste de Temperamentos" },
  },
  linguagens_amor: {
    pt: { name: "Mapa dos Estilos de Conexão Afetiva – NELLO ONE", description: "Acesso vitalício ao teste de estilos de conexão" },
    en: { name: "Affection Connection Styles – NELLO ONE", description: "Lifetime access to connection styles test" },
    "pt-pt": { name: "Mapa dos Estilos de Conexão Afetiva – NELLO ONE", description: "Acesso vitalício ao teste de estilos de conexão" },
  },
  inteligencias_multiplas: {
    pt: { name: "Inteligências Múltiplas – NELLO ONE", description: "Acesso vitalício ao teste de Inteligências Múltiplas" },
    en: { name: "Multiple Intelligences – NELLO ONE", description: "Lifetime access to Multiple Intelligences test" },
    "pt-pt": { name: "Inteligências Múltiplas – NELLO ONE", description: "Acesso vitalício ao teste de Inteligências Múltiplas" },
  },
};

// Get product name based on test type and language
function getProductName(testType: string, language: string): { name: string; description: string } {
  const productNames = PRODUCT_NAMES[testType];
  if (productNames) {
    return productNames[language] || productNames.pt;
  }
  // Fallback - always use NELLO ONE branding
  return {
    name: `Teste – NELLO ONE`,
    description: `Acesso vitalício ao teste`,
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    logStep("Function started");
    
    const body = await req.json();
    
    // Get language/currency from request (defaults to PT/BRL)
    const language = body.language || "pt";
    const requestedCurrency = body.currency;
    
    // ANTI-CROSSTRADE PROTECTION: Validate currency matches language
    const validation = validateCurrencyForLanguage(language, requestedCurrency);
    if (!validation.valid) {
      const errorMessage = CURRENCY_ERROR_MESSAGES[language] || CURRENCY_ERROR_MESSAGES.en;
      logStep("BLOCKED: Cross-trade attempt detected", { language, requestedCurrency, expected: validation.expectedCurrency });
      return new Response(JSON.stringify({ 
        error: errorMessage,
        code: "CURRENCY_MISMATCH",
        expected: validation.expectedCurrency,
        received: requestedCurrency,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }
    
    const currency = validation.expectedCurrency;
    logStep("Currency validated", { language, currency });
    
    // IP-BASED CURRENCY PROTECTION: Validate IP country matches currency
    const clientIP = getClientIP(req);
    logStep("Client IP detected", { ip: clientIP });
    
    const ipCountry = await getCountryFromIP(clientIP);
    const ipValidation = validateIPForCurrency(ipCountry, currency);
    
    if (!ipValidation.valid) {
      let errorMessage: string;
      switch (language) {
        case "pt-pt":
          errorMessage = "A sua localização não corresponde à moeda selecionada. Por favor, aceda à versão correta do site para a sua região.";
          break;
        case "en":
          errorMessage = "Your location does not match the selected currency. Please access the correct version of the site for your region.";
          break;
        default:
          errorMessage = "Sua localização não corresponde à moeda selecionada. Por favor, acesse a versão correta do site para sua região.";
      }
      
      logStep("BLOCKED: IP-currency mismatch", { 
        ip: clientIP, 
        country: ipCountry, 
        currency, 
        reason: ipValidation.reason 
      });
      
      return new Response(JSON.stringify({ 
        error: errorMessage,
        code: "IP_CURRENCY_MISMATCH",
        reason: ipValidation.reason,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 403,
      });
    }
    
    // Support both single test (legacy) and multiple tests (new)
    let testIds: string[];
    if (body.testIds && Array.isArray(body.testIds)) {
      testIds = body.testIds;
    } else if (body.testId) {
      testIds = [body.testId];
    } else {
      testIds = [];
    }
    
    // Check for bundle purchase
    let isBundle = body.isBundle === true;
    
    // Check for Fundadores purchase
    let isFundadores = body.isFundadores === true;
    
    // Check for Ativação do Código purchase
    const isAtivacaoCodigo = body.productType === "ativacao_codigo";
    
    // Check for Código do Casal purchase
    const isCodigoCasal = body.productType === "codigo_casal";
    
    // Check for Activation Individual (Professional Direction) purchase
    const isActivationIndividual = body.productType === "activation_individual";
    
    // Check for Identity Couple Premium purchase
    const isIdentityCouplePremium = body.productType === "identity_couple_premium";
    
    // Check for Código da Essência Express purchase (R$99 upsell from Código Inicial)
    const isCodigoEssenciaExpress = body.productType === "codigo_essencia_express";
    
    // Check for coupon code
    const couponCode = body.couponCode || null;
    
    // ====== CHECK IF COUPON IS A FUNDADORES COUPON (100% discount + fundadores type) ======
    // If so, convert this to a Fundadores purchase automatically
    let fundadoresCoupon = null;
    if (couponCode) {
      const supabaseAdmin = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
      );
      
      const { data: dbCoupon } = await supabaseAdmin
        .from("coupons")
        .select("*")
        .eq("code", couponCode)
        .eq("is_active", true)
        .single();
      
      if (dbCoupon) {
        // Check if it's a fundadores coupon (allowed_product_type = 'fundadores' OR 100% discount)
        const isFundadoresCoupon = dbCoupon.allowed_product_type === "fundadores" || 
          (dbCoupon.discount_type === "percentual" && dbCoupon.discount_value === 100 && 
           (dbCoupon.code.toUpperCase().includes("FUNDADOR") || dbCoupon.allowed_product_type === "all_products"));
        
        if (isFundadoresCoupon) {
          logStep("Fundadores coupon detected - converting to Fundadores purchase", { 
            couponCode, 
            discount: dbCoupon.discount_value,
            type: dbCoupon.allowed_product_type 
          });
          isFundadores = true;
          fundadoresCoupon = dbCoupon;
        }
      }
    }
    
    if (testIds.length === 0 && !isBundle && !isFundadores && !isAtivacaoCodigo && !isCodigoCasal && !isActivationIndividual && !isIdentityCouplePremium && !isCodigoEssenciaExpress) {
      throw new Error("At least one test ID is required, or a valid productType must be specified");
    }
    
    logStep("Request data", { testIds, count: testIds.length, isBundle, isFundadores, isAtivacaoCodigo, isCodigoCasal, isActivationIndividual, isIdentityCouplePremium, isCodigoEssenciaExpress, language, currency, couponCode });

    // Get user (optional - supports guest checkout)
    let user = null;
    let userEmail = body.userEmail || null;
    const authHeader = req.headers.get("Authorization");
    
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data } = await supabaseClient.auth.getUser(token);
      user = data.user;
      userEmail = user?.email || userEmail;
      logStep("User authenticated", { userId: user?.id, email: userEmail });
    } else {
      logStep("Guest checkout - no user authentication");
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Check for existing customer
    let customerId;
    if (userEmail) {
      const customers = await stripe.customers.list({ email: userEmail, limit: 1 });
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
        logStep("Existing customer found", { customerId });
      }
    }

    let lineItems: any[] = [];
    const priceMap = getPriceMap(currency);
    
    if (isCodigoEssenciaExpress) {
      // Código da Essência Express - R$99 BRL / $19 USD / €19 EUR upsell from Código Inicial
      const expressPriceIds: Record<string, string> = {
        brl: "price_1T4nJjDjhZZxZELMvsHEYimS", // R$99
        usd: "price_1T4nKmDjhZZxZELMKy13VF6R", // $19
        eur: "price_1T4nLGDjhZZxZELMSEOF1Yjg", // €19
      };
      
      lineItems = [{
        price: expressPriceIds[currency] || expressPriceIds.brl,
        quantity: 1,
      }];
      logStep("Código da Essência Express line item created", { currency, priceId: expressPriceIds[currency] });
    } else if (isCodigoCasal) {
      // Código do Casal purchase - Dynamic pricing based on currency
      const codigoCasalAmounts: Record<string, number> = {
        brl: 4700,  // R$ 47
        usd: 900,   // $9
        eur: 1200,  // €12
      };
      
      const codigoCasalNames: Record<string, { name: string; description: string }> = {
        brl: {
          name: "Código do Casal – NELLO ONE",
          description: "Manual de instruções do seu relacionamento",
        },
        usd: {
          name: "Couple's Code – NELLO ONE",
          description: "Your relationship's instruction manual",
        },
        eur: {
          name: "Código do Casal – NELLO ONE",
          description: "Manual de instruções do seu relacionamento",
        },
      };
      
      lineItems = [{
        price_data: {
          currency: currency,
          product_data: codigoCasalNames[currency] || codigoCasalNames.brl,
          unit_amount: codigoCasalAmounts[currency] || codigoCasalAmounts.brl,
        },
        quantity: 1,
      }];
      logStep("Código do Casal line item created", { currency, amount: codigoCasalAmounts[currency] });
    } else if (isAtivacaoCodigo) {
      // Ativação do Código purchase - Use real Stripe Price IDs
      const ativacaoPriceIds: Record<string, string> = {
        brl: "price_1Sw6EEDjhZZxZELMSmPNECig", // R$197
        usd: "price_1Sw6F6DjhZZxZELMfBW3pn5q", // $57
        eur: "price_1Sw6FiDjhZZxZELMXDH1ACdx", // €47
      };
      
      lineItems = [{
        price: ativacaoPriceIds[currency] || ativacaoPriceIds.brl,
        quantity: 1,
      }];
      logStep("Ativação do Código line item created with Price ID", { currency, priceId: ativacaoPriceIds[currency] });
    } else if (isActivationIndividual) {
      // Activation Individual (Professional Direction) purchase - Use real Stripe Price IDs
      const activationPriceIds: Record<string, string> = {
        brl: "price_1SxRhHDjhZZxZELMuoj7N1CN", // R$197
        usd: "price_1SxRhuDjhZZxZELMsAYBZqUP", // $57
        eur: "price_1SxRjKDjhZZxZELMAqWHQKbm", // €47
      };
      
      lineItems = [{
        price: activationPriceIds[currency] || activationPriceIds.brl,
        quantity: 1,
      }];
      logStep("Activation Individual line item created with Price ID", { currency, priceId: activationPriceIds[currency] });
    } else if (isIdentityCouplePremium) {
      // Identity Couple Premium - Mapa Definitivo do Casal (High Ticket)
      const identityCouplePriceIds: Record<string, string> = {
        brl: "price_1StyMcDjhZZxZELM5IVwqfhV", // R$997
        usd: "price_1SvfdXDjhZZxZELMaNDfVXox", // $297
        eur: "price_1SvfdoDjhZZxZELMLaONPhR5", // €247
      };
      
      lineItems = [{
        price: identityCouplePriceIds[currency] || identityCouplePriceIds.brl,
        quantity: 1,
      }];
      logStep("Identity Couple Premium line item created with Price ID", { currency, priceId: identityCouplePriceIds[currency] });
    } else if (isFundadores) {
      // Fundadores purchase - R$197 BRL ONLY (restricted to Brazilian market)
      if (currency !== "brl") {
        logStep("BLOCKED: Fundadores purchase attempted with non-BRL currency", { currency });
        return new Response(JSON.stringify({ 
          error: "Fundadores is only available in BRL (Brazilian market).",
          code: "FUNDADORES_BRL_ONLY",
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        });
      }
      const fundadoresPriceId = "price_1ScWglDjhZZxZELM3tQocxgu";
      
      lineItems = [{
        price: fundadoresPriceId,
        quantity: 1,
      }];
      logStep("Fundadores line item created", { priceId: fundadoresPriceId });
    } else if (isBundle) {
      // Bundle purchase
      const bundlePriceId = priceMap.bundle;
      
      if (bundlePriceId) {
        lineItems = [{
          price: bundlePriceId,
          quantity: 1,
        }];
        logStep("Bundle line item created with price ID", { currency, priceId: bundlePriceId });
      } else {
        // Fallback: create price_data for bundle - ALWAYS use NELLO ONE branding
        const bundleAmounts: Record<string, number> = {
          brl: 129700, // R$ 1.297
          usd: 39700,  // $397
          eur: 29700,  // €297
        };
        
        const bundleNames: Record<string, { name: string; description: string }> = {
          brl: {
            name: "NELLO IDENTITY Completo",
            description: "Todos os 7 testes + Mapa NELLO IDENTITY gerado por IA",
          },
          usd: {
            name: "NELLO IDENTITY Complete",
            description: "All 7 tests + AI-generated NELLO IDENTITY Map",
          },
          eur: {
            name: "NELLO IDENTITY Completo",
            description: "Todos os 7 testes + Mapa NELLO IDENTITY gerado por IA",
          },
        };
        
        lineItems = [{
          price_data: {
            currency: currency,
            product_data: bundleNames[currency] || bundleNames.usd,
            unit_amount: bundleAmounts[currency] || bundleAmounts.usd,
          },
          quantity: 1,
        }];
        logStep("Bundle line item created with price_data", { currency });
      }
    } else {
      // Individual tests purchase - DISCONTINUED
      // Individual test purchases are no longer available. Users should purchase the Jornada Completa bundle.
      logStep("BLOCKED: Individual test purchase attempted (discontinued)", { testIds });
      return new Response(JSON.stringify({ 
        error: language === "en" 
          ? "Individual test purchases are no longer available. Please purchase the complete journey." 
          : "A compra de testes avulsos não está mais disponível. Por favor, adquira a Jornada Completa.",
        code: "INDIVIDUAL_TESTS_DISCONTINUED",
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });

      // Legacy code below kept for reference but unreachable
      const { data: tests, error: testsError } = await supabaseClient
        .from("tests")
        .select("id, name, price_brl, stripe_price_id, type")
        .in("id", testIds);

      if (testsError) throw testsError;
      if (!tests || tests.length === 0) throw new Error("No tests found");
      
      logStep("Tests fetched", { count: tests.length });

      // Build line items based on currency
      lineItems = tests.map(test => {
        const priceId = priceMap[test.type] || test.stripe_price_id;
        
        if (priceId) {
          return {
            price: priceId,
            quantity: 1,
          };
        } else {
          // Fallback for tests without configured price ID - ALWAYS use NELLO ONE branding
          const conversionRates: Record<string, number> = {
            brl: 1,
            usd: 0.2, // ~5:1 BRL to USD
            eur: 0.18, // ~5.5:1 BRL to EUR
          };
          
          const rate = conversionRates[currency] || 1;
          const unitAmount = Math.round(parseFloat(test.price_brl.toString()) * 100 * rate);
          
          // Get proper product name with NELLO ONE branding
          const productInfo = getProductName(test.type, language);
          
          return {
            price_data: {
              currency: currency,
              product_data: {
                name: productInfo.name,
                description: productInfo.description,
              },
              unit_amount: unitAmount,
            },
            quantity: 1,
          };
        }
      });
    }

    // Calculate discount based on quantity (only for individual tests)
    let discountPercentage = 0;
    if (!isBundle && testIds.length >= 5) {
      discountPercentage = 10;
    } else if (!isBundle && testIds.length >= 3) {
      discountPercentage = 5;
    }
    
    logStep("Discount calculated", { quantity: testIds.length, discount: discountPercentage });

    // Set success/cancel URLs based on language - use verify-checkout page for reliability
    const origin = req.headers.get("origin") || "";
    let successUrl: string;
    let cancelUrl: string;
    
    switch (language) {
      case "en":
        successUrl = `${origin}/en/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
        cancelUrl = `${origin}/en/cliente?payment=cancelled`;
        break;
      case "pt-pt":
        successUrl = `${origin}/pt-pt/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
        cancelUrl = `${origin}/pt-pt/cliente?payment=cancelled`;
        break;
      default:
        successUrl = `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
        cancelUrl = `${origin}/cliente?payment=cancelled`;
    }

    // Get affiliate code if provided
    const affiliateCode = body.affiliateCode || null;
    
    // Create checkout session
    const sessionParams: any = {
      customer: customerId,
      customer_email: customerId ? undefined : userEmail,
      line_items: lineItems,
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        test_ids: JSON.stringify(testIds),
        user_id: user?.id || body.userId || "guest",
        language: language,
        currency: currency,
        is_bundle: isBundle ? "true" : "false",
        is_fundadores: isFundadores ? "true" : "false",
        is_ativacao_codigo: isAtivacaoCodigo ? "true" : "false",
        is_codigo_casal: isCodigoCasal ? "true" : "false",
        is_activation_individual: isActivationIndividual ? "true" : "false",
        is_identity_couple_premium: isIdentityCouplePremium ? "true" : "false",
        product_type: isCodigoEssenciaExpress ? "jornada_completa" : isIdentityCouplePremium ? "identity_couple_premium" : isActivationIndividual ? "activation_individual" : isCodigoCasal ? "codigo_casal" : isAtivacaoCodigo ? "ativacao_codigo" : isFundadores ? "fundadores" : isBundle ? "jornada_completa" : "test_avulso",
        affiliate_code: affiliateCode || "",
        purchase_origin: isCodigoCasal ? "couple_paywall" : "",
      },
      customer_creation: customerId ? undefined : "always",
    };

    // Check for user-provided coupon code (from database)
    // If fundadoresCoupon was already loaded, use it instead of fetching again
    if (couponCode) {
      const supabaseAdmin = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
      );
      
      // Use already fetched coupon if available, otherwise fetch
      let dbCoupon = fundadoresCoupon;
      if (!dbCoupon) {
        const { data: fetchedCoupon, error: couponError } = await supabaseAdmin
          .from("coupons")
          .select("*")
          .eq("code", couponCode)
          .eq("is_active", true)
          .single();
        
        if (couponError) {
          logStep("Coupon not found or inactive", { couponCode, error: couponError?.message });
        } else {
          dbCoupon = fetchedCoupon;
        }
      }
      
      if (dbCoupon) {
        // Determine the product type being purchased
        const productType = body.productType || (
          isCodigoCasal ? "nello_couple" : 
          isAtivacaoCodigo ? "ativacao_codigo" : 
          isCodigoEssenciaExpress ? "codigo_essencia_express" :
          isFundadores ? "fundadores" : 
          isBundle ? "jornada_completa" : 
          "test_avulso"
        );
        
        // Check if coupon is valid for this product
        // allowed_product_type can be:
        // - null/undefined: valid for all products
        // - "all" or "all_products": valid for all products
        // - single product: "nello_couple", "activation_individual", etc.
        // - comma-separated list: "nello_couple,activation_individual,identity_couple_premium"
        const allowedProducts = dbCoupon.allowed_product_type;
        let isValidForProduct = false;
        
        if (!allowedProducts || allowedProducts === "all" || allowedProducts === "all_products") {
          isValidForProduct = true;
        } else if (allowedProducts.includes(",")) {
          // Multi-product coupon - check if current product is in the list
          const allowedList = allowedProducts.split(",").map((p: string) => p.trim());
          isValidForProduct = allowedList.includes(productType);
        } else {
          // Single product coupon
          isValidForProduct = allowedProducts === productType;
        }
        
        logStep("Coupon product validation", { 
          couponCode, 
          allowedProducts, 
          productType, 
          isValidForProduct 
        });
        
        // Validate expiration and usage
        const isNotExpired = !dbCoupon.expires_at || new Date(dbCoupon.expires_at) > new Date();
        const hasUsesLeft = !dbCoupon.max_uses || dbCoupon.times_used < dbCoupon.max_uses;
        
        if (isValidForProduct && isNotExpired && hasUsesLeft) {
          // Create Stripe coupon and promotion code to show on checkout
          let stripeCouponId = dbCoupon.stripe_coupon_id;
          
          // If no Stripe coupon exists, create one
          if (!stripeCouponId) {
            const stripeCoupon = await stripe.coupons.create({
              percent_off: dbCoupon.discount_value,
              duration: "once",
              name: `${dbCoupon.code} - ${dbCoupon.discount_value}%`,
            });
            stripeCouponId = stripeCoupon.id;
            
            // Save the stripe_coupon_id back to database
            await supabaseAdmin
              .from("coupons")
              .update({ stripe_coupon_id: stripeCouponId })
              .eq("id", dbCoupon.id);
              
            logStep("Created Stripe coupon", { couponId: stripeCouponId });
          }
          
          // Create a Promotion Code so it appears visible on Stripe Checkout
          const promotionCode = await stripe.promotionCodes.create({
            coupon: stripeCouponId,
            code: dbCoupon.code,
            max_redemptions: 1, // Single use per session
          });
          
          // Use promotion_code instead of coupon to show it on checkout
          sessionParams.discounts = [{ promotion_code: promotionCode.id }];
          logStep("Created promotion code for visibility", { 
            promoCodeId: promotionCode.id, 
            code: dbCoupon.code,
            stripeCouponId 
          });
          
          // Increment usage counter
          await supabaseAdmin
            .from("coupons")
            .update({ times_used: (dbCoupon.times_used || 0) + 1 })
            .eq("id", dbCoupon.id);
            
          logStep("Coupon usage incremented", { couponId: dbCoupon.id });
        } else {
          // Return specific error for invalid coupon
          if (!isValidForProduct) {
            logStep("Coupon not valid for product", { couponCode, allowedProducts, productType });
            return new Response(JSON.stringify({ 
              error: "Este cupom não é válido para este produto.",
              error_en: "This coupon is not valid for this product.",
              code: "COUPON_INVALID_PRODUCT",
              details: { couponCode, productType, allowedProducts }
            }), {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 400,
            });
          }
          if (!isNotExpired) {
            logStep("Coupon expired", { couponCode, expires_at: dbCoupon.expires_at });
            return new Response(JSON.stringify({ 
              error: "Este cupom expirou.",
              error_en: "This coupon has expired.",
              code: "COUPON_EXPIRED"
            }), {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 400,
            });
          }
          if (!hasUsesLeft) {
            logStep("Coupon max uses reached", { couponCode, max_uses: dbCoupon.max_uses, times_used: dbCoupon.times_used });
            return new Response(JSON.stringify({ 
              error: "Este cupom atingiu o limite máximo de usos.",
              error_en: "This coupon has reached its maximum number of uses.",
              code: "COUPON_MAX_USES"
            }), {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 400,
            });
          }
        }
      }
    }
    
    // REMOVED: Auto-apply LANCAMENTO50 block - was preventing coupon field from showing
    // Users should enter LANCAMENTO50 manually in the Stripe checkout promo code field
    
    if (!couponCode && discountPercentage > 0) {
      // Add quantity-based discount if applicable (only for individual tests without coupon)
      const couponNames: Record<string, string> = {
        pt: `Desconto ${discountPercentage}% - ${testIds.length} testes`,
        en: `${discountPercentage}% Off - ${testIds.length} tests`,
        "pt-pt": `Desconto ${discountPercentage}% - ${testIds.length} testes`,
      };
      
      const coupon = await stripe.coupons.create({
        percent_off: discountPercentage,
        duration: "once",
        name: couponNames[language] || couponNames.en,
      });
      
      // Create promotion code to show the discount visibly
      const promoCode = await stripe.promotionCodes.create({
        coupon: coupon.id,
        code: `COMBO${testIds.length}`,
      });
      
      sessionParams.discounts = [{ promotion_code: promoCode.id }];
      logStep("Quantity discount promotion code created", { promoCodeId: promoCode.id, discount: discountPercentage });
    }

    // Allow users to enter promo codes on the Stripe Checkout page
    // When user provided a coupon via frontend, it's already in discounts - don't enable promo field
    // Otherwise, always show the promo code field so users can enter LANCAMENTO50 or any other code
    if (!couponCode) {
      // Remove any auto-applied discounts to enable the promo code field
      delete sessionParams.discounts;
      sessionParams.allow_promotion_codes = true;
      logStep("Enabled promotion code field (no user coupon provided)");
    } else if (sessionParams.discounts && sessionParams.discounts.length > 0) {
      // User coupon was applied via discounts, don't enable promo field
      logStep("User coupon applied via discounts, promo field disabled");
    } else {
      sessionParams.allow_promotion_codes = true;
      logStep("Enabled promotion code field on checkout");
    }

    const session = await stripe.checkout.sessions.create(sessionParams);
    
    logStep("Checkout session created", { sessionId: session.id, url: session.url, currency, language });

    return new Response(JSON.stringify({ 
      sessionId: session.id,
      url: session.url 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
