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
    
    // Support both single test (legacy) and multiple tests (new)
    let testIds: string[];
    if (body.testIds && Array.isArray(body.testIds)) {
      testIds = body.testIds;
    } else if (body.testId) {
      // Legacy single test support
      testIds = [body.testId];
    } else {
      throw new Error("testId or testIds array is required");
    }
    
    if (testIds.length === 0) {
      throw new Error("At least one test ID is required");
    }
    
    logStep("Request data", { testIds, count: testIds.length });

    // Get user (optional - supports guest checkout)
    let user = null;
    let userEmail = body.userEmail || null; // Support legacy userEmail param
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

    // Fetch test details including stripe_price_id
    const { data: tests, error: testsError } = await supabaseClient
      .from("tests")
      .select("id, name, price_brl, stripe_price_id")
      .in("id", testIds);

    if (testsError) throw testsError;
    if (!tests || tests.length === 0) throw new Error("No tests found");
    
    logStep("Tests fetched", { count: tests.length });

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Check for existing customer if user is authenticated
    let customerId;
    if (userEmail) {
      const customers = await stripe.customers.list({ email: userEmail, limit: 1 });
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
        logStep("Existing customer found", { customerId });
      }
    }

    // Calculate discount based on quantity
    let discountPercentage = 0;
    if (tests.length >= 5) {
      discountPercentage = 10;
    } else if (tests.length >= 3) {
      discountPercentage = 5;
    }
    
    logStep("Discount calculated", { quantity: tests.length, discount: discountPercentage });

    // Build line items
    const lineItems = tests.map(test => {
      // Use stripe_price_id if available, otherwise create price_data
      if (test.stripe_price_id) {
        return {
          price: test.stripe_price_id,
          quantity: 1,
        };
      } else {
        // Fallback for tests without stripe_price_id
        return {
          price_data: {
            currency: "brl",
            product_data: {
              name: `Teste: ${test.name}`,
              description: `Acesso vitalício ao teste ${test.name}`,
            },
            unit_amount: Math.round(parseFloat(test.price_brl.toString()) * 100),
          },
          quantity: 1,
        };
      }
    });

    // Create checkout session
    const sessionParams: any = {
      customer: customerId,
      customer_email: customerId ? undefined : userEmail,
      line_items: lineItems,
      mode: "payment",
      success_url: `${req.headers.get("origin")}/cliente?payment=success`,
      cancel_url: `${req.headers.get("origin")}/cliente?payment=cancelled`,
      metadata: {
        test_ids: JSON.stringify(testIds),
        user_id: user?.id || body.userId || "guest",
      },
      customer_creation: customerId ? undefined : "always",
    };

    // Add discount if applicable
    if (discountPercentage > 0) {
      const coupon = await stripe.coupons.create({
        percent_off: discountPercentage,
        duration: "once",
        name: `Desconto ${discountPercentage}% - ${tests.length} testes`,
      });
      
      sessionParams.discounts = [{ coupon: coupon.id }];
      logStep("Coupon created", { couponId: coupon.id, discount: discountPercentage });
    }

    const session = await stripe.checkout.sessions.create(sessionParams);
    
    logStep("Checkout session created", { sessionId: session.id, url: session.url });

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
