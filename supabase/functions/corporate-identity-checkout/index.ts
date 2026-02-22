import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CORPORATE-IDENTITY-CHECKOUT] ${step}${detailsStr}`);
};

// Identity Corporate License - per-seat pricing
const CORPORATE_PRICE_ID = "price_1T3biVDjhZZxZELMpgu7TGmv";
const CORPORATE_PRODUCT_ID = "prod_U1f2EgCZazEoN9";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
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

    const { companyId, seats, operatorId } = await req.json();
    if (!companyId) throw new Error("Company ID is required");
    if (!seats || seats < 1 || seats > 500) throw new Error("Seats must be between 1 and 500");

    // Verify user is admin of the company
    const { data: companyUser, error: companyError } = await supabaseClient
      .from('company_users')
      .select('role')
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

    // Get or create Stripe customer
    const { data: company, error: companyFetchError } = await supabaseClient
      .from('companies')
      .select('stripe_customer_id, billing_email, name')
      .eq('id', companyId)
      .single();

    if (companyFetchError) throw new Error("Failed to fetch company details");

    let customerId = company?.stripe_customer_id;

    if (!customerId) {
      const customerEmail = company?.billing_email || user.email;
      const customers = await stripe.customers.list({ email: customerEmail, limit: 1 });

      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
      } else {
        const newCustomer = await stripe.customers.create({
          email: customerEmail,
          name: company?.name || undefined,
          metadata: { company_id: companyId, user_id: user.id },
        });
        customerId = newCustomer.id;
      }

      await supabaseClient
        .from('companies')
        .update({ stripe_customer_id: customerId })
        .eq('id', companyId);

      logStep("Stripe customer created/found", { customerId });
    }

    // Validate operator if provided
    let validOperatorId: string | null = null;
    if (operatorId) {
      const { data: opWorkspace } = await supabaseClient
        .from('operator_workspaces')
        .select('id')
        .eq('id', operatorId)
        .single();

      if (opWorkspace) {
        validOperatorId = opWorkspace.id;
        logStep("Operator validated", { operatorId: validOperatorId });
      }
    }

    const origin = req.headers.get("origin") || "https://business.nello.one";

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: CORPORATE_PRICE_ID,
          quantity: seats,
        },
      ],
      mode: "subscription",
      success_url: `${origin}/dashboard?subscription=success`,
      cancel_url: `${origin}/dashboard?subscription=cancelled`,
      metadata: {
        company_id: companyId,
        seats: seats.toString(),
        operator_id: validOperatorId || "",
        product_type: "identity_corporate_license",
      },
      subscription_data: {
        metadata: {
          company_id: companyId,
          seats: seats.toString(),
          operator_id: validOperatorId || "",
          product_type: "identity_corporate_license",
        },
      },
    });

    logStep("Checkout session created", { sessionId: session.id, seats, url: session.url });

    return new Response(JSON.stringify({ url: session.url }), {
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
