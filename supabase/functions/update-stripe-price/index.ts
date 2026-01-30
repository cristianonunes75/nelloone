import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Verify admin role
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");
    
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Auth error: ${userError.message}`);
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");

    // Check if user is admin
    const { data: roleData } = await supabaseClient
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .single();
    
    if (!roleData) throw new Error("Unauthorized: Admin role required");

    const { priceId, newAmount, currency, productId, originalPrice, description } = await req.json();
    
    if (!productId || !newAmount || !currency) {
      throw new Error("Missing required fields: productId, newAmount, currency");
    }

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY not configured");

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Create new price (Stripe prices are immutable, so we create new ones)
    const amountInCents = Math.round(newAmount * 100);
    
    const newPrice = await stripe.prices.create({
      product: productId,
      unit_amount: amountInCents,
      currency: currency.toLowerCase(),
      metadata: {
        original_price: originalPrice ? String(Math.round(originalPrice * 100)) : undefined,
        updated_at: new Date().toISOString(),
        updated_by: user.email || user.id,
        description: description || undefined,
      },
    });

    // Archive old price if provided
    if (priceId) {
      try {
        await stripe.prices.update(priceId, { active: false });
      } catch (archiveError) {
        console.log("Could not archive old price:", archiveError);
      }
    }

    // Log the action
    await supabaseClient.from("audit_logs").insert({
      user_id: user.id,
      action: "stripe_price_update",
      table_name: "stripe_prices",
      record_id: newPrice.id,
      old_data: priceId ? { old_price_id: priceId } : null,
      new_data: { 
        new_price_id: newPrice.id, 
        amount: newAmount, 
        currency,
        product_id: productId,
      },
    });

    return new Response(JSON.stringify({ 
      success: true, 
      newPriceId: newPrice.id,
      amount: newAmount,
      currency,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error updating Stripe price:", errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
