import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: Record<string, unknown>) => {
  console.log(`[FLOW-CHECK-SUB] ${step}`, details ? JSON.stringify(details) : '');
};

// Nello Flow product ID
const NELLO_FLOW_PRODUCT_ID = "prod_TfXBYo9TVyTkNC";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    
    // Find customer
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    
    if (customers.data.length === 0) {
      logStep("No customer found");
      
      // Update flow_subscriptions table
      await supabaseClient
        .from('flow_subscriptions')
        .upsert({
          user_id: user.id,
          status: 'inactive',
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });

      return new Response(JSON.stringify({ 
        subscribed: false,
        status: 'inactive'
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    logStep("Found customer", { customerId });

    // Check for active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 10,
    });

    // Find Nello Flow subscription
    const flowSubscription = subscriptions.data.find((sub: Stripe.Subscription) => 
      sub.items.data.some((item: Stripe.SubscriptionItem) => item.price.product === NELLO_FLOW_PRODUCT_ID)
    );

    if (flowSubscription) {
      const subscriptionEnd = new Date(flowSubscription.current_period_end * 1000).toISOString();
      logStep("Active Flow subscription found", { 
        subscriptionId: flowSubscription.id, 
        endDate: subscriptionEnd 
      });

      // Update flow_subscriptions table
      await supabaseClient
        .from('flow_subscriptions')
        .upsert({
          user_id: user.id,
          status: 'active',
          stripe_subscription_id: flowSubscription.id,
          stripe_customer_id: customerId,
          current_period_end: subscriptionEnd,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });

      return new Response(JSON.stringify({
        subscribed: true,
        status: 'active',
        subscription_end: subscriptionEnd,
        subscription_id: flowSubscription.id,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    logStep("No active Flow subscription");
    
    // Update flow_subscriptions table
    await supabaseClient
      .from('flow_subscriptions')
      .upsert({
        user_id: user.id,
        status: 'inactive',
        stripe_customer_id: customerId,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

    return new Response(JSON.stringify({ 
      subscribed: false,
      status: 'inactive'
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
