import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CORPORATE-MANAGE-SEATS] ${step}${detailsStr}`);
};

const CORPORATE_PRICE_ID = "price_1T3biVDjhZZxZELMpgu7TGmv";

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
    if (!user?.email) throw new Error("User not authenticated");
    logStep("User authenticated", { userId: user.id });

    const { companyId, newSeats } = await req.json();
    if (!companyId) throw new Error("Company ID is required");
    if (!newSeats || newSeats < 1 || newSeats > 500) throw new Error("Seats must be between 1 and 500");

    // Verify admin
    const { data: companyUser } = await supabaseClient
      .from('company_users')
      .select('role')
      .eq('user_id', user.id)
      .eq('company_id', companyId)
      .single();

    if (!companyUser || (companyUser.role !== 'company_admin' && companyUser.role !== 'super_admin')) {
      throw new Error("Only company admins can manage seats");
    }

    // Get subscription
    const { data: sub } = await supabaseClient
      .from('company_subscriptions')
      .select('stripe_subscription_id, seats_used')
      .eq('company_id', companyId)
      .single();

    if (!sub?.stripe_subscription_id) {
      throw new Error("No active subscription found");
    }

    // Check that new seats >= current used
    if (newSeats < (sub.seats_used || 0)) {
      throw new Error(`Cannot reduce below ${sub.seats_used} seats currently in use`);
    }

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Get the subscription from Stripe
    const subscription = await stripe.subscriptions.retrieve(sub.stripe_subscription_id);
    const subscriptionItemId = subscription.items.data[0].id;

    // Update quantity (seats)
    await stripe.subscriptions.update(sub.stripe_subscription_id, {
      items: [
        {
          id: subscriptionItemId,
          price: CORPORATE_PRICE_ID,
          quantity: newSeats,
        },
      ],
      proration_behavior: "create_prorations",
    });

    // Update local record
    await supabaseClient
      .from('company_subscriptions')
      .update({
        seats_total: newSeats,
        max_collaborators: newSeats,
        updated_at: new Date().toISOString(),
      })
      .eq('company_id', companyId);

    // Audit log
    await supabaseClient.from('company_audit_logs').insert({
      company_id: companyId,
      actor_id: user.id,
      action: 'seats_updated',
      details: {
        previous_seats: subscription.items.data[0].quantity,
        new_seats: newSeats,
        stripe_subscription_id: sub.stripe_subscription_id,
      },
    });

    logStep("Seats updated successfully", { newSeats });

    return new Response(JSON.stringify({ success: true, seats: newSeats }), {
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
