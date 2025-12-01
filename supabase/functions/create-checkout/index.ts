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

// USD Price IDs for EN version
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

// BRL Price IDs for PT version
const BRL_PRICES: Record<string, string> = {
  disc: "price_1SNBIuDjhZZxZELMm3qUtTON",
  mbti: "price_1SNBJEDjhZZxZELMY1CuVfIZ",
  eneagrama: "price_1SNBLhDjhZZxZELMhSvpHn8X",
};

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
    const currency = language === "en" ? "usd" : "brl";
    
    logStep("Currency detected", { language, currency });
    
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
    
    logStep("Request data", { testIds, count: testIds.length, isBundle, language });

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
    
    if (isBundle) {
      // Bundle purchase
      const bundlePriceId = currency === "usd" ? USD_PRICES.bundle : null;
      
      if (!bundlePriceId && currency === "usd") {
        throw new Error("Bundle price not configured for USD");
      }
      
      if (bundlePriceId) {
        lineItems = [{
          price: bundlePriceId,
          quantity: 1,
        }];
      } else {
        // BRL bundle - create price_data
        lineItems = [{
          price_data: {
            currency: "brl",
            product_data: {
              name: "NELLO ONE Completo",
              description: "Todos os 7 testes + Mapa NELLO ONE gerado por IA",
            },
            unit_amount: 59700, // R$ 597
          },
          quantity: 1,
        }];
      }
      
      logStep("Bundle line item created", { currency });
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
        const priceMap = currency === "usd" ? USD_PRICES : BRL_PRICES;
        const priceId = priceMap[test.type] || test.stripe_price_id;
        
        if (priceId) {
          return {
            price: priceId,
            quantity: 1,
          };
        } else {
          // Fallback for tests without stripe_price_id
          const unitAmount = currency === "usd" 
            ? Math.round(parseFloat(test.price_brl.toString()) * 100 / 5) // Approximate USD
            : Math.round(parseFloat(test.price_brl.toString()) * 100);
          
          return {
            price_data: {
              currency: currency,
              product_data: {
                name: currency === "usd" ? `Test: ${test.name}` : `Teste: ${test.name}`,
                description: currency === "usd" 
                  ? `Lifetime access to ${test.name} test`
                  : `Acesso vitalício ao teste ${test.name}`,
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
    const successUrl = language === "en" 
      ? `${origin}/en/dashboard?payment=success`
      : `${origin}/cliente?payment=success`;
    const cancelUrl = language === "en"
      ? `${origin}/en/dashboard?payment=cancelled`
      : `${origin}/cliente?payment=cancelled`;

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
        is_bundle: isBundle ? "true" : "false",
      },
      customer_creation: customerId ? undefined : "always",
    };

    // Add discount if applicable
    if (discountPercentage > 0) {
      const couponName = language === "en" 
        ? `${discountPercentage}% Off - ${testIds.length} tests`
        : `Desconto ${discountPercentage}% - ${testIds.length} testes`;
      
      const coupon = await stripe.coupons.create({
        percent_off: discountPercentage,
        duration: "once",
        name: couponName,
      });
      
      sessionParams.discounts = [{ coupon: coupon.id }];
      logStep("Coupon created", { couponId: coupon.id, discount: discountPercentage });
    }

    const session = await stripe.checkout.sessions.create(sessionParams);
    
    logStep("Checkout session created", { sessionId: session.id, url: session.url, currency });

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