import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") as string, {
  apiVersion: "2025-08-27.basil",
});

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const logStep = (step: string, details?: any) => {
  console.log(`[STRIPE-WEBHOOK] ${step}`, details ? JSON.stringify(details) : '');
};

serve(async (req) => {
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    logStep("ERROR: No Stripe signature found");
    return new Response("No signature", { status: 400 });
  }

  try {
    const body = await req.text();
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

    const event = webhookSecret
      ? stripe.webhooks.constructEvent(body, signature, webhookSecret)
      : JSON.parse(body);

    logStep("Webhook event received", { type: event.type });

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      
      logStep("Processing completed checkout", { sessionId: session.id });

      // Support both single test (legacy) and multiple tests (new)
      let testIds: string[];
      if (session.metadata?.test_ids) {
        try {
          testIds = JSON.parse(session.metadata.test_ids);
        } catch {
          testIds = [session.metadata.test_ids];
        }
      } else if (session.metadata?.test_id) {
        // Legacy single test support
        testIds = [session.metadata.test_id];
      } else {
        logStep("ERROR: Missing test metadata", { metadata: session.metadata });
        return new Response("Missing test metadata", { status: 400 });
      }

      const userId = session.metadata?.user_id;

      if (!userId || userId === "guest") {
        logStep("WARN: Guest purchase - cannot record without user_id");
        return new Response(JSON.stringify({ received: true, warning: "Guest purchase" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      logStep("Processing purchase", { userId, testIds, count: testIds.length });

      // Fetch all tests
      const { data: tests, error: testsError } = await supabase
        .from("tests")
        .select("id, name, price_brl")
        .in("id", testIds);

      if (testsError || !tests || tests.length === 0) {
        logStep("ERROR: Invalid test IDs", { testIds, error: testsError });
        return new Response("Invalid tests", { status: 400 });
      }

      const amountPaid = (session.amount_total || 0) / 100;
      logStep("Payment details", { amountPaid, testsCount: tests.length });

      // Check for existing purchases (idempotency)
      const { data: existingPurchases } = await supabase
        .from("test_purchases")
        .select("test_id")
        .eq("user_id", userId)
        .in("test_id", testIds)
        .eq("payment_status", "completed");

      const existingTestIds = existingPurchases?.map(p => p.test_id) || [];
      const newTestIds = testIds.filter(id => !existingTestIds.includes(id));

      if (newTestIds.length === 0) {
        logStep("WARN: All tests already purchased", { userId, testIds });
        return new Response(JSON.stringify({ received: true, duplicate: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Record purchases for each test
      const pricePerTest = tests.length > 0 ? amountPaid / tests.length : 0;
      
      const purchaseRecords = newTestIds.map(testId => {
        const test = tests.find(t => t.id === testId);
        return {
          user_id: userId,
          test_id: testId,
          price_paid: pricePerTest,
          payment_status: "completed" as const,
          payment_method: "stripe",
          transaction_id: session.payment_intent as string,
          metadata: {
            session_id: session.id,
            total_tests: tests.length,
            test_ids: testIds,
          },
        };
      });

      const { error: purchaseError } = await supabase
        .from("test_purchases")
        .upsert(purchaseRecords, {
          onConflict: "user_id,test_id",
          ignoreDuplicates: false,
        });

      if (purchaseError) {
        logStep("ERROR: Failed to record purchases", { error: purchaseError });
        throw purchaseError;
      }

      logStep("Purchases recorded successfully", { 
        userId, 
        count: newTestIds.length,
        testIds: newTestIds 
      });

      // Send confirmation email
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", userId)
          .single();

        const { data: userAuth } = await supabase.auth.admin.getUserById(userId);
        const userEmail = userAuth?.user?.email;

        if (userEmail) {
          const language = session.metadata?.language || "pt";
          const currency = session.metadata?.currency === "USD" ? "$" : 
                          session.metadata?.currency === "EUR" ? "€" : "R$";

          // Send purchase confirmation
          await fetch(`${supabaseUrl}/functions/v1/send-email`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${supabaseServiceKey}`,
            },
            body: JSON.stringify({
              type: "purchase_confirmation",
              to: userEmail,
              data: {
                name: profile?.full_name || userEmail.split("@")[0],
                testNames: tests.map(t => t.name),
                amount: amountPaid,
                currency,
                language,
              },
            }),
          });

          logStep("Confirmation email sent", { userEmail });
        }
      } catch (emailError) {
        logStep("WARN: Failed to send email", { error: emailError });
        // Don't fail the webhook for email errors
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    logStep("ERROR in webhook processing", { message: error.message });
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});
