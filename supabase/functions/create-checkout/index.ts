import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
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
};

// BRL Price IDs for PT version (Brazilian market)
// NOTE: For arquetipos, create a product in Stripe called "Arquétipos com Propósito – Acesso Completo NELLO ONE"
const BRL_PRICES: Record<string, string> = {
  // arquetipos/arquetipos_proposito: TODO - Create price in Stripe for BRL (R$47)
  disc: "price_1SNBIuDjhZZxZELMm3qUtTON",
  mbti: "price_1SNBJEDjhZZxZELMY1CuVfIZ",
  eneagrama: "price_1SNBLhDjhZZxZELMhSvpHn8X",
  temperamentos: "price_1SZUnqDjhZZxZELMtU9tUMFm",
  linguagens_amor: "price_1SZUoWDjhZZxZELMxEJJKhDn",
  inteligencias_multiplas: "price_1SZUpxDjhZZxZELMAkQlFX11",
  bundle: "price_1SZNYXDjhZZxZELMoGVJUZRP", // Using USD bundle as fallback
};

// EUR Price IDs for PT-PT version (Portugal/European market)
const EUR_PRICES: Record<string, string> = {
  arquetipos: "price_1SZywzDjhZZxZELMZfCg6fSd",
  arquetipos_proposito: "price_1SZywzDjhZZxZELMZfCg6fSd",
  disc: "price_1SZyxMDjhZZxZELMkolH98fK",
  mbti: "price_1SZz6TDjhZZxZELMXzDUT8kk",
  eneagrama: "price_1SZz5ADjhZZxZELMauUUwZSQ",
  temperamentos: "price_1SZyxYDjhZZxZELMATbPpg7h",
  linguagens_amor: "price_1SZyykDjhZZxZELM9mlhNwLh",
  inteligencias_multiplas: "price_1SZz0nDjhZZxZELMVagCtoXs",
  bundle: "price_1SZz6vDjhZZxZELMQsZuLKah",
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
      throw new Error("testId or testIds array is required");
    }
    
    // Check for bundle purchase
    const isBundle = body.isBundle === true;
    
    if (testIds.length === 0 && !isBundle) {
      throw new Error("At least one test ID is required");
    }
    
    logStep("Request data", { testIds, count: testIds.length, isBundle, language, currency });

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
    
    if (isBundle) {
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
          brl: 59700, // R$ 597
          usd: 14700, // $147
          eur: 8900,  // €89
        };
        
        const bundleNames: Record<string, { name: string; description: string }> = {
          brl: {
            name: "NELLO ONE Completo",
            description: "Todos os 7 testes + Mapa NELLO ONE gerado por IA",
          },
          usd: {
            name: "NELLO ONE Complete",
            description: "All 7 tests + AI-generated NELLO ONE Map",
          },
          eur: {
            name: "NELLO ONE Completo",
            description: "Todos os 7 testes + Mapa NELLO ONE gerado por IA",
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
      // Individual tests purchase
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

    // Set success/cancel URLs based on language
    const origin = req.headers.get("origin") || "";
    let successUrl: string;
    let cancelUrl: string;
    
    switch (language) {
      case "en":
        successUrl = `${origin}/en/cliente?payment=success`;
        cancelUrl = `${origin}/en/cliente?payment=cancelled`;
        break;
      case "pt-pt":
        successUrl = `${origin}/pt-pt/cliente?payment=success`;
        cancelUrl = `${origin}/pt-pt/cliente?payment=cancelled`;
        break;
      default:
        successUrl = `${origin}/cliente?payment=success`;
        cancelUrl = `${origin}/cliente?payment=cancelled`;
    }

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
      },
      customer_creation: customerId ? undefined : "always",
    };

    // Add discount if applicable
    if (discountPercentage > 0) {
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
      
      sessionParams.discounts = [{ coupon: coupon.id }];
      logStep("Coupon created", { couponId: coupon.id, discount: discountPercentage });
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
