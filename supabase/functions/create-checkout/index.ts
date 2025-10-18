import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") as string, {
  apiVersion: "2023-10-16",
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface CheckoutRequest {
  testId: string;
  userId: string;
  userEmail: string;
}

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { testId, userId, userEmail }: CheckoutRequest = await req.json();

    console.log("Creating checkout session for:", {
      testId,
      userId,
    });

    // Import Supabase client for server-side validation
    const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2.39.3");
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch actual test price from database (server-side validation)
    const { data: test, error: testError } = await supabase
      .from("tests")
      .select("name, price_brl")
      .eq("id", testId)
      .single();

    if (testError || !test) {
      console.error("Test not found:", testId);
      return new Response(
        JSON.stringify({ error: "Test not found" }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    console.log("Test validated:", {
      testId,
      testName: test.name,
      price: test.price_brl,
    });

    // Create Stripe checkout session with validated price from database
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: `Teste: ${test.name}`,
              description: `Acesso vitalício ao teste ${test.name}`,
            },
            unit_amount: Math.round(parseFloat(test.price_brl) * 100), // Use DB price
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/cliente?payment=success&test_id=${testId}`,
      cancel_url: `${req.headers.get("origin")}/cliente?payment=cancelled`,
      customer_email: userEmail,
      metadata: {
        test_id: testId,
        user_id: userId,
      },
    });

    console.log("Checkout session created:", session.id);

    return new Response(
      JSON.stringify({
        sessionId: session.id,
        url: session.url,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error creating checkout session:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
});
