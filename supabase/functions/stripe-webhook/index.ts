import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") as string, {
  apiVersion: "2023-10-16",
});

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    console.error("No Stripe signature found");
    return new Response("No signature", { status: 400 });
  }

  try {
    const body = await req.text();
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

    // Verify webhook signature
    const event = webhookSecret
      ? stripe.webhooks.constructEvent(body, signature, webhookSecret)
      : JSON.parse(body);

    console.log("Webhook event received:", event.type);

    // Handle successful payment
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      
      console.log("Processing completed checkout:", session.id);

      const testId = session.metadata?.test_id;
      const userId = session.metadata?.user_id;

      if (!testId || !userId) {
        console.error("Missing metadata in session:", session.metadata);
        return new Response("Missing metadata", { status: 400 });
      }

      // Validate test exists and price matches
      const { data: test, error: testError } = await supabase
        .from("tests")
        .select("id, price_brl")
        .eq("id", testId)
        .single();

      if (testError || !test) {
        console.error("Invalid test_id in webhook:", testId, testError);
        return new Response("Invalid test", { status: 400 });
      }

      // Verify amount paid matches test price (allow small variance for fees)
      const pricePaid = (session.amount_total || 0) / 100;
      const expectedPrice = parseFloat(test.price_brl);
      if (Math.abs(pricePaid - expectedPrice) > 1) {
        console.error("Price mismatch:", { pricePaid, expectedPrice, testId });
        return new Response("Price mismatch", { status: 400 });
      }

      // Check for duplicate purchase (idempotency)
      const { data: existing } = await supabase
        .from("test_purchases")
        .select("id")
        .eq("user_id", userId)
        .eq("test_id", testId)
        .eq("payment_status", "completed")
        .single();

      if (existing) {
        console.warn("Duplicate purchase attempt:", { userId, testId });
        return new Response(JSON.stringify({ received: true, duplicate: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Record the purchase with conflict resolution
      const { error: purchaseError } = await supabase
        .from("test_purchases")
        .upsert(
          {
            user_id: userId,
            test_id: testId,
            price_paid: pricePaid,
            payment_status: "completed",
            payment_method: "stripe",
            transaction_id: session.payment_intent as string,
          },
          {
            onConflict: "transaction_id",
            ignoreDuplicates: true,
          }
        );

      if (purchaseError) {
        console.error("Error recording purchase:", purchaseError);
        throw purchaseError;
      }

      console.log("Purchase recorded successfully for user:", userId);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});
