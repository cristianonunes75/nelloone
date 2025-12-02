import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }

    // Verify admin role
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !userData.user) {
      throw new Error("User not authenticated");
    }

    // Check if user is admin
    const { data: roles } = await supabaseClient
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id)
      .eq("role", "admin");

    if (!roles || roles.length === 0) {
      throw new Error("Unauthorized: Admin access required");
    }

    const body = await req.json();
    const { name, percent_off, amount_off, currency, duration, duration_in_months, max_redemptions, redeem_by_months } = body;

    console.log("[CREATE-COUPON] Creating coupon:", { name, percent_off, amount_off, currency, duration, max_redemptions, redeem_by_months });

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    const couponParams: Stripe.CouponCreateParams = {
      name,
      duration: duration || "once",
    };

    if (percent_off) {
      couponParams.percent_off = percent_off;
    } else if (amount_off && currency) {
      couponParams.amount_off = amount_off;
      couponParams.currency = currency;
    }

    if (duration === "repeating" && duration_in_months) {
      couponParams.duration_in_months = duration_in_months;
    }

    // Add max redemptions limit
    if (max_redemptions) {
      couponParams.max_redemptions = max_redemptions;
    }

    // Add expiration date (redeem_by_months converts to Unix timestamp)
    if (redeem_by_months) {
      const redeemByDate = new Date();
      redeemByDate.setMonth(redeemByDate.getMonth() + redeem_by_months);
      couponParams.redeem_by = Math.floor(redeemByDate.getTime() / 1000);
    }

    // Use the name as the coupon ID for easy reference
    couponParams.id = name;

    const coupon = await stripe.coupons.create(couponParams);

    console.log("[CREATE-COUPON] Coupon created:", coupon.id);

    return new Response(JSON.stringify({ coupon }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[CREATE-COUPON] Error:", errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
