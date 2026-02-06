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
      throw new Error("User not authenticated");
    }

    // Check if user is admin
    const { data: roles, error: rolesError } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id)
      .eq("role", "admin");

    if (rolesError || !roles || roles.length === 0) {
      throw new Error("Unauthorized: Admin access required");
    }

    const body = await req.json();
    const { coupon_id, action, max_redemptions } = body;

    console.log("[UPDATE-COUPON] Request:", { coupon_id, action, max_redemptions });

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    if (action === "deactivate") {
      // Delete coupon in Stripe (this deactivates it)
      await stripe.coupons.del(coupon_id);
      console.log("[UPDATE-COUPON] Coupon deleted:", coupon_id);

      // Update local database
      await supabaseAdmin
        .from("coupons")
        .update({ is_active: false })
        .eq("stripe_coupon_id", coupon_id);

      return new Response(JSON.stringify({ success: true, action: "deactivated" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    if (action === "update_metadata") {
      // Stripe coupons have limited update capabilities
      // We can update metadata and name, but not discount values
      const coupon = await stripe.coupons.update(coupon_id, {
        metadata: body.metadata || {},
        name: body.name || undefined,
      });

      console.log("[UPDATE-COUPON] Coupon updated:", coupon.id);

      return new Response(JSON.stringify({ success: true, coupon }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    if (action === "get_promotion_codes") {
      // List promotion codes for this coupon
      const promotionCodes = await stripe.promotionCodes.list({
        coupon: coupon_id,
        limit: 10,
      });

      return new Response(JSON.stringify({ promotionCodes: promotionCodes.data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    if (action === "deactivate_promotion_code") {
      // Deactivate a promotion code
      const { promotion_code_id } = body;
      const promotionCode = await stripe.promotionCodes.update(promotion_code_id, {
        active: false,
      });

      console.log("[UPDATE-COUPON] Promotion code deactivated:", promotion_code_id);

      return new Response(JSON.stringify({ success: true, promotionCode }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    throw new Error("Invalid action");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[UPDATE-COUPON] Error:", errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
