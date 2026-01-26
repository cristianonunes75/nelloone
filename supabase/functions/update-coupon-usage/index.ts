import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: Record<string, unknown>) => {
  console.log(`[UPDATE-COUPON-USAGE] ${step}`, details ? JSON.stringify(details) : '');
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    // Use service role to bypass RLS
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Verify user is authenticated
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header provided");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !userData.user) {
      throw new Error("Authentication failed");
    }
    logStep("User authenticated", { userId: userData.user.id });

    const { couponCode } = await req.json();
    if (!couponCode) {
      throw new Error("Coupon code is required");
    }
    logStep("Coupon code received", { couponCode });

    // Fetch current coupon data
    const { data: coupon, error: fetchError } = await supabaseClient
      .from("coupons")
      .select("id, times_used, max_uses, code")
      .eq("code", couponCode.toUpperCase())
      .single();

    if (fetchError) {
      logStep("Failed to fetch coupon", { error: fetchError.message });
      throw new Error(`Failed to fetch coupon: ${fetchError.message}`);
    }

    logStep("Coupon fetched", { couponId: coupon.id, currentUsage: coupon.times_used });

    // Increment usage count
    const newUsageCount = (coupon.times_used || 0) + 1;

    const { error: updateError } = await supabaseClient
      .from("coupons")
      .update({ times_used: newUsageCount })
      .eq("id", coupon.id);

    if (updateError) {
      logStep("Failed to update coupon", { error: updateError.message });
      throw new Error(`Failed to update coupon: ${updateError.message}`);
    }

    logStep("Coupon usage updated successfully", { newUsageCount });

    return new Response(
      JSON.stringify({ success: true, newUsageCount }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error: any) {
    logStep("ERROR", { message: error.message });
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
