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
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }

    // Use service role key to check admin roles (bypasses RLS)
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError || !userData.user) {
      console.log("[CREATE-COUPON] Auth error:", userError?.message);
      throw new Error("User not authenticated");
    }

    console.log("[CREATE-COUPON] User authenticated:", userData.user.id);

    // Check if user is admin using service role (bypasses RLS)
    const { data: roles, error: rolesError } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id)
      .eq("role", "admin");

    console.log("[CREATE-COUPON] Roles query result:", { roles, error: rolesError?.message });

    if (rolesError || !roles || roles.length === 0) {
      throw new Error("Unauthorized: Admin access required");
    }

    console.log("[CREATE-COUPON] Admin verified for user:", userData.user.id);

    const body = await req.json();
    const { name, percent_off, amount_off, currency, duration, duration_in_months, max_redemptions, redeem_by_months, allowed_product_type } = body;

    console.log("[CREATE-COUPON] Creating coupon:", { name, percent_off, amount_off, currency, duration, max_redemptions, redeem_by_months });

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Build coupon params
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

    // Add expiration date (redeem_by_months converts to Unix timestamp)
    let expiresAt: string | null = null;
    if (redeem_by_months) {
      const redeemByDate = new Date();
      redeemByDate.setMonth(redeemByDate.getMonth() + redeem_by_months);
      couponParams.redeem_by = Math.floor(redeemByDate.getTime() / 1000);
      expiresAt = redeemByDate.toISOString();
    }

    // Use the name as the coupon ID for easy reference
    couponParams.id = name;

    // Create the coupon in Stripe
    const coupon = await stripe.coupons.create(couponParams);
    console.log("[CREATE-COUPON] Stripe coupon created:", coupon.id);

    // Create a Promotion Code so users can type the code in Stripe Checkout
    const promotionCodeParams: Stripe.PromotionCodeCreateParams = {
      coupon: coupon.id,
      code: name, // Use the same name as the promotion code
      active: true,
    };

    // Add max redemptions to promotion code if specified
    if (max_redemptions) {
      promotionCodeParams.max_redemptions = max_redemptions;
    }

    const promotionCode = await stripe.promotionCodes.create(promotionCodeParams);
    console.log("[CREATE-COUPON] Stripe promotion code created:", promotionCode.id, "code:", promotionCode.code);

    // Save to local database for sync
    const { data: dbCoupon, error: dbError } = await supabaseAdmin
      .from("coupons")
      .insert({
        code: name,
        discount_type: percent_off ? "percentual" : "fixo",
        discount_value: percent_off || (amount_off ? amount_off / 100 : 0),
        max_uses: max_redemptions || null,
        times_used: 0,
        is_active: true,
        expires_at: expiresAt,
        stripe_coupon_id: coupon.id,
        allowed_product_type: allowed_product_type || null,
        created_by: userData.user.id,
      })
      .select()
      .single();

    if (dbError) {
      console.log("[CREATE-COUPON] Database save warning:", dbError.message);
      // Don't fail the request, coupon is already created in Stripe
    } else {
      console.log("[CREATE-COUPON] Coupon saved to database:", dbCoupon?.id);
    }

    return new Response(JSON.stringify({ 
      coupon, 
      promotionCode: {
        id: promotionCode.id,
        code: promotionCode.code,
      },
      dbCoupon 
    }), {
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
