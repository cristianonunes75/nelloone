import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[BUSINESS-CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

// Business pricing tiers
const BUSINESS_TIERS = {
  'prod_TlWOSYdR3XRj2e': { name: 'starter', maxCollaborators: 10 },
  'prod_TlWOSs5LczNGxr': { name: 'growth', maxCollaborators: 30 },
  'prod_TlWOhSZJpVB1Xe': { name: 'enterprise', maxCollaborators: 100 },
};

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

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const { companyId } = await req.json();
    if (!companyId) throw new Error("Company ID is required");

    // Verify user is part of the company
    const { data: companyUser, error: companyUserError } = await supabaseClient
      .from('company_users')
      .select('role')
      .eq('user_id', user.id)
      .eq('company_id', companyId)
      .single();

    if (companyUserError || !companyUser) {
      throw new Error("User is not associated with this company");
    }
    logStep("User company verified", { role: companyUser.role });

    // Get company Stripe customer ID
    const { data: company, error: companyError } = await supabaseClient
      .from('companies')
      .select('stripe_customer_id')
      .eq('id', companyId)
      .single();

    if (companyError) throw new Error("Failed to fetch company details");

    if (!company?.stripe_customer_id) {
      logStep("No Stripe customer found for company");
      
      // Update company_subscriptions table to reflect no subscription
      await supabaseClient
        .from('company_subscriptions')
        .upsert({
          company_id: companyId,
          status: 'trial',
          current_collaborators: 0,
          max_collaborators: 10,
          plan_tier: 'trial',
          updated_at: new Date().toISOString(),
        }, { onConflict: 'company_id' });

      return new Response(JSON.stringify({ 
        subscribed: false,
        status: 'trial',
        tier: 'trial',
        maxCollaborators: 10,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    logStep("Checking Stripe subscriptions", { customerId: company.stripe_customer_id });

    const subscriptions = await stripe.subscriptions.list({
      customer: company.stripe_customer_id,
      status: "active",
      limit: 1,
    });

    const hasActiveSub = subscriptions.data.length > 0;
    let tier = 'trial';
    let maxCollaborators = 10;
    let subscriptionEnd: string | null = null;
    let stripeSubscriptionId: string | null = null;

    if (hasActiveSub) {
      const subscription = subscriptions.data[0];
      stripeSubscriptionId = subscription.id;
      subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
      
      const productId = subscription.items.data[0].price.product as string;
      const tierInfo = BUSINESS_TIERS[productId as keyof typeof BUSINESS_TIERS];
      
      if (tierInfo) {
        tier = tierInfo.name;
        maxCollaborators = tierInfo.maxCollaborators;
      }

      logStep("Active subscription found", { 
        subscriptionId: subscription.id, 
        tier, 
        maxCollaborators,
        endDate: subscriptionEnd 
      });
    } else {
      logStep("No active subscription found");
    }

    // Count current collaborators
    const { count: collaboratorCount } = await supabaseClient
      .from('company_users')
      .select('id', { count: 'exact', head: true })
      .eq('company_id', companyId)
      .eq('is_active', true);

    // Update company_subscriptions table
    await supabaseClient
      .from('company_subscriptions')
      .upsert({
        company_id: companyId,
        status: hasActiveSub ? 'active' : 'trial',
        stripe_subscription_id: stripeSubscriptionId,
        current_collaborators: collaboratorCount || 0,
        max_collaborators: maxCollaborators,
        plan_tier: tier,
        current_period_end: subscriptionEnd,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'company_id' });

    return new Response(JSON.stringify({
      subscribed: hasActiveSub,
      status: hasActiveSub ? 'active' : 'trial',
      tier,
      maxCollaborators,
      currentCollaborators: collaboratorCount || 0,
      subscriptionEnd,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in business-check-subscription", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
