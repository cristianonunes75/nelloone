import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[BUSINESS-CHECKOUT] ${step}${detailsStr}`);
};

// Business pricing tiers with Stripe price IDs
const BUSINESS_TIERS = {
  starter: {
    name: 'Starter',
    priceId: 'price_1SwNiaDjhZZxZELMWinqktj1',
    productId: 'prod_TuC6AaDuMIKQZb',
    maxCollaborators: 10,
    pricePerMonth: 9700, // in cents
  },
  growth: {
    name: 'Growth',
    priceId: 'price_1SwNkBDjhZZxZELMbsUVK1c9',
    productId: 'prod_TuC8R00QFMgo1D',
    maxCollaborators: 30,
    pricePerMonth: 24700,
  },
  enterprise: {
    name: 'Enterprise',
    priceId: 'price_1SwNkYDjhZZxZELMPvkWmk8j',
    productId: 'prod_TuC8g0iRUOggpb',
    maxCollaborators: 100,
    pricePerMonth: 49700,
  },
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

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const { tier, companyId } = await req.json();
    if (!tier || !BUSINESS_TIERS[tier as keyof typeof BUSINESS_TIERS]) {
      throw new Error("Invalid tier selected");
    }
    
    const selectedTier = BUSINESS_TIERS[tier as keyof typeof BUSINESS_TIERS];
    logStep("Tier selected", { tier, priceId: selectedTier.priceId });

    // Verify user is admin of the company
    const { data: companyUser, error: companyError } = await supabaseClient
      .from('company_users')
      .select('role, company_id')
      .eq('user_id', user.id)
      .eq('company_id', companyId)
      .single();

    if (companyError || !companyUser) {
      throw new Error("User is not associated with this company");
    }

    if (companyUser.role !== 'company_admin' && companyUser.role !== 'super_admin') {
      throw new Error("Only company admins can manage subscriptions");
    }
    logStep("User authorization verified", { role: companyUser.role });

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    
    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Check if company already has a Stripe customer
    const { data: company, error: companyFetchError } = await supabaseClient
      .from('companies')
      .select('stripe_customer_id, billing_email, name')
      .eq('id', companyId)
      .single();

    if (companyFetchError) throw new Error("Failed to fetch company details");

    let customerId = company?.stripe_customer_id;

    // Create Stripe customer if doesn't exist
    if (!customerId) {
      const customerEmail = company?.billing_email || user.email;
      const customers = await stripe.customers.list({ email: customerEmail, limit: 1 });
      
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
      } else {
        const newCustomer = await stripe.customers.create({
          email: customerEmail,
          name: company?.name || undefined,
          metadata: {
            company_id: companyId,
            user_id: user.id,
          },
        });
        customerId = newCustomer.id;
      }

      // Update company with Stripe customer ID
      await supabaseClient
        .from('companies')
        .update({ stripe_customer_id: customerId })
        .eq('id', companyId);

      logStep("Stripe customer created/found", { customerId });
    }

    const origin = req.headers.get("origin") || "https://business.nello.one";
    
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: selectedTier.priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${origin}/dashboard?subscription=success`,
      cancel_url: `${origin}/dashboard?subscription=cancelled`,
      metadata: {
        company_id: companyId,
        tier: tier,
        max_collaborators: selectedTier.maxCollaborators.toString(),
      },
      subscription_data: {
        metadata: {
          company_id: companyId,
          tier: tier,
          max_collaborators: selectedTier.maxCollaborators.toString(),
        },
      },
    });

    logStep("Checkout session created", { sessionId: session.id, url: session.url });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in business-checkout", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
