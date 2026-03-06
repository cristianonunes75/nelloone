import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const logStep = (step: string, details?: any) => {
  console.log(`[VERIFY-CHECKOUT] ${step}`, details ? JSON.stringify(details) : '');
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { session_id } = await req.json();
    
    if (!session_id) {
      logStep("ERROR: No session_id provided");
      return new Response(JSON.stringify({ error: "session_id is required" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    logStep("Retrieving Stripe session", { session_id });

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items"],
    });

    logStep("Session retrieved", { 
      id: session.id, 
      status: session.status,
      payment_status: session.payment_status,
      metadata: session.metadata 
    });

    // Check if payment was successful
    if (session.status !== "complete" || session.payment_status !== "paid") {
      logStep("Payment not completed", { status: session.status, payment_status: session.payment_status });
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Payment not completed",
        status: session.status,
        payment_status: session.payment_status,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const userId = session.metadata?.user_id;
    const productType = session.metadata?.product_type;
    const testIdsJson = session.metadata?.test_ids;

    // For guest checkouts, try to find the user by email
    let resolvedUserId = userId;
    if (!userId || userId === "guest") {
      const customerEmail = session.customer_email || session.customer_details?.email;
      if (customerEmail) {
        logStep("Guest checkout - looking up user by email", { email: customerEmail });
        const { data: userData } = await supabase.auth.admin.listUsers();
        const matchedUser = userData?.users?.find(u => u.email?.toLowerCase() === customerEmail.toLowerCase());
        if (matchedUser) {
          resolvedUserId = matchedUser.id;
          logStep("Found user by email", { userId: resolvedUserId });
        } else {
          logStep("No user found for email, skipping database update");
          return new Response(JSON.stringify({
            success: true,
            message: "Payment verified but no matching user found yet (guest checkout)",
          }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          });
        }
      } else {
        logStep("No user_id and no email in session, skipping database update");
        return new Response(JSON.stringify({
          success: true,
          message: "Payment verified but no user to update (guest checkout)",
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }
    }
    const userId2 = resolvedUserId;

    logStep("Processing purchase for user", { userId: userId2, productType });

    // Check if purchase was already processed (idempotency)
    const { data: existingPurchase } = await supabase
      .from("test_purchases")
      .select("id")
      .eq("transaction_id", session.payment_intent as string)
      .limit(1);

    if (existingPurchase && existingPurchase.length > 0) {
      logStep("Purchase already processed", { transaction_id: session.payment_intent });
      return new Response(JSON.stringify({ 
        success: true, 
        message: "Purchase already processed",
        already_processed: true,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Process based on product type
    if (productType === "fundadores") {
      logStep("Processing Fundadores purchase");
      
      // Update profile
      await supabase
        .from("profiles")
        .update({ 
          codigo_essencia_unlocked: true,
          journey_status: "in_progress",
          journey_started_at: new Date().toISOString(),
          is_founder: true,
        })
        .eq("id", userId2);

      // Get all tests and create purchase records
      const { data: allTests } = await supabase
        .from("tests")
        .select("id, name, type")
        .eq("active", true);

      if (allTests && allTests.length > 0) {
        const amountPaid = (session.amount_total || 0) / 100;
        const pricePerTest = amountPaid / allTests.length;

        const purchaseRecords = allTests.map(test => ({
          user_id: userId2,
          test_id: test.id,
          price_paid: pricePerTest,
          payment_status: "completed",
          payment_method: "stripe",
          transaction_id: session.payment_intent as string,
          purchase_category: "fundadores",
          test_slug: test.type,
          metadata: {
            session_id: session.id,
            product_type: "fundadores",
            verified_via: "verify-checkout",
          },
        }));

        await supabase
          .from("test_purchases")
          .upsert(purchaseRecords, { onConflict: "user_id,test_id", ignoreDuplicates: false });
      }

      logStep("Fundadores purchase processed successfully");

    } else if (productType === "jornada_completa" || productType === "journey") {
      logStep("Processing Jornada Completa purchase");
      
      // Update profile - includes Código da Essência in validation phase
      await supabase
        .from("profiles")
        .update({ 
          journey_status: "in_progress",
          journey_started_at: new Date().toISOString(),
          codigo_essencia_unlocked: true,
        })
        .eq("id", userId2);

      // Get all tests and create purchase records
      const { data: allTests } = await supabase
        .from("tests")
        .select("id, name, type")
        .eq("active", true);

      if (allTests && allTests.length > 0) {
        const amountPaid = (session.amount_total || 0) / 100;
        const pricePerTest = amountPaid / allTests.length;

        const purchaseRecords = allTests.map(test => ({
          user_id: userId2,
          test_id: test.id,
          price_paid: pricePerTest,
          payment_status: "completed",
          payment_method: "stripe",
          transaction_id: session.payment_intent as string,
          purchase_category: "jornada_completa",
          test_slug: test.type,
          metadata: {
            session_id: session.id,
            product_type: "jornada_completa",
            includes_codigo_essencia: true,
            verified_via: "verify-checkout",
          },
        }));

        await supabase
          .from("test_purchases")
          .upsert(purchaseRecords, { onConflict: "user_id,test_id", ignoreDuplicates: false });
      }

      logStep("Jornada Completa purchase processed successfully");

    } else if (productType === "codigo_da_essencia") {
      logStep("Processing Código da Essência purchase");
      
      await supabase
        .from("profiles")
        .update({ codigo_essencia_unlocked: true })
        .eq("id", userId2);

      logStep("Código da Essência unlocked successfully");

    } else if (productType === "ativacao_codigo") {
      logStep("Processing Ativação do Código purchase");
      
      // Update profile to unlock ativacao
      await supabase
        .from("profiles")
        .update({ ativacao_codigo_unlocked: true })
        .eq("id", userId2);

      // Also record the purchase
      await supabase
        .from("test_purchases")
        .insert({
          user_id: userId2,
          test_id: null,
          price_paid: (session.amount_total || 0) / 100,
          payment_status: "completed",
          payment_method: "stripe",
          transaction_id: session.payment_intent as string,
          purchase_category: "ativacao_codigo",
          metadata: {
            session_id: session.id,
            product_type: "ativacao_codigo",
            verified_via: "verify-checkout",
          },
        });

      logStep("Ativação do Código unlocked successfully");

      // Individual test purchase
      logStep("Processing individual test purchase", { testIdsJson });
      
      let testIds: string[] = [];
      try {
        testIds = testIdsJson ? JSON.parse(testIdsJson) : [];
      } catch {
        logStep("Failed to parse test_ids");
      }

      if (testIds.length > 0) {
        const { data: tests } = await supabase
          .from("tests")
          .select("id, type, name")
          .in("id", testIds);

        if (tests && tests.length > 0) {
          const amountPaid = (session.amount_total || 0) / 100;
          const pricePerTest = amountPaid / tests.length;

          const purchaseRecords = tests.map(test => ({
            user_id: userId2,
            test_id: test.id,
            price_paid: pricePerTest,
            payment_status: "completed",
            payment_method: "stripe",
            transaction_id: session.payment_intent as string,
            purchase_category: "test_avulso",
            test_slug: test.type,
            metadata: {
              session_id: session.id,
              product_type: "test_avulso",
              verified_via: "verify-checkout",
            },
          }));

          await supabase
            .from("test_purchases")
            .upsert(purchaseRecords, { onConflict: "user_id,test_id", ignoreDuplicates: false });

          logStep("Individual test purchases recorded", { count: tests.length });
        }
      }

    // ====== CÓDIGO DO CASAL PURCHASE ======
    } else if (productType === "codigo_casal") {
      logStep("Processing Código do Casal purchase");

      const amountPaid = (session.amount_total || 0) / 100;

      // Get first available test_id for the purchase record
      const { data: firstTest } = await supabase
        .from("tests")
        .select("id")
        .eq("active", true)
        .limit(1)
        .single();

      const { error: insertError } = await supabase
        .from("test_purchases")
        .insert({
          user_id: userId2,
          test_id: firstTest?.id || null,
          price_paid: amountPaid,
          payment_status: "completed",
          payment_method: "stripe",
          currency: (session.currency || "brl").toUpperCase(),
          transaction_id: session.payment_intent as string,
          purchase_category: "codigo_casal",
          metadata: {
            session_id: session.id,
            product_type: "codigo_casal",
            purchase_origin: session.metadata?.purchase_origin || "couple_paywall",
            verified_via: "verify-checkout",
          },
        });

      if (insertError) {
        logStep("ERROR inserting codigo_casal purchase", { error: insertError.message });
      } else {
        logStep("Código do Casal purchase recorded successfully");
      }

      // Also update profile flag
      await supabase
        .from("profiles")
        .update({ has_nello_couple: true })
        .eq("id", userId2);

      logStep("Profile updated with has_nello_couple flag");

    // ====== IDENTITY COUPLE PREMIUM ======
    } else if (productType === "identity_couple_premium") {
      logStep("Processing Identity Couple Premium purchase");

      // Update profile - unlock all couple-related features
      await supabase
        .from("profiles")
        .update({ 
          has_identity_couple_premium: true,
          has_nello_couple: true,
          has_activation_couple: true,
        })
        .eq("id", userId2);

      // Record the purchase
      await supabase
        .from("test_purchases")
        .insert({
          user_id: userId2,
          test_id: null,
          price_paid: (session.amount_total || 0) / 100,
          payment_status: "completed",
          payment_method: "stripe",
          transaction_id: session.payment_intent as string,
          purchase_category: "identity_couple_premium",
          metadata: {
            session_id: session.id,
            product_type: "identity_couple_premium",
            includes_nello_couple: true,
            includes_activation_couple: true,
            verified_via: "verify-checkout",
          },
        });

      logStep("Identity Couple Premium purchase recorded successfully");

    // ====== ACTIVATION INDIVIDUAL (PROFESSIONAL DIRECTION) ======
    } else if (productType === "activation_individual") {
      logStep("Processing Activation Individual purchase");

      await supabase
        .from("profiles")
        .update({ has_activation_individual: true })
        .eq("id", userId2);

      await supabase
        .from("test_purchases")
        .insert({
          user_id: userId2,
          test_id: null,
          price_paid: (session.amount_total || 0) / 100,
          payment_status: "completed",
          payment_method: "stripe",
          transaction_id: session.payment_intent as string,
          purchase_category: "activation_individual",
          metadata: {
            session_id: session.id,
            product_type: "activation_individual",
            verified_via: "verify-checkout",
          },
        });

      logStep("Activation Individual purchase recorded successfully");
    }

    // Process affiliate referral if applicable
    const affiliateCode = session.metadata?.affiliate_code;
    if (affiliateCode && affiliateCode.trim() !== "") {
      logStep("Processing affiliate referral", { affiliateCode });
      try {
        // Find the affiliate by code
        const { data: affiliateData } = await supabase
          .from("affiliates")
          .select("id, commission_percent, user_id")
          .eq("affiliate_code", affiliateCode.toUpperCase())
          .eq("is_active", true)
          .single();

        if (affiliateData) {
          // Prevent self-referral
          if (affiliateData.user_id !== userId) {
            const transactionId = session.payment_intent as string;
            
            // Check idempotency - don't create duplicate referral
            const { data: existingReferral } = await supabase
              .from("affiliate_referrals")
              .select("id")
              .eq("affiliate_id", affiliateData.id)
              .eq("purchase_id", transactionId)
              .limit(1);

            if (!existingReferral || existingReferral.length === 0) {
              const saleAmount = (session.amount_total || 0) / 100;
              const commissionAmount = saleAmount * (affiliateData.commission_percent / 100);

              await supabase
                .from("affiliate_referrals")
                .insert({
                  affiliate_id: affiliateData.id,
                  referred_user_id: userId2,
                  sale_amount: saleAmount,
                  commission_amount: commissionAmount,
                  currency: (session.currency || "brl").toUpperCase(),
                  status: "pending",
                  purchase_id: transactionId,
                });

              // Update affiliate totals
              await supabase.rpc("increment_affiliate_totals", {
                p_affiliate_id: affiliateData.id,
                p_sale_amount: saleAmount,
                p_commission_amount: commissionAmount,
              }).then(({ error: rpcError }) => {
                if (rpcError) {
                  // Fallback: manual update
                  logStep("RPC not available, using manual update");
                  supabase
                    .from("affiliates")
                    .update({
                      total_sales: affiliateData.user_id ? undefined : 0, // trigger re-read
                    })
                    .eq("id", affiliateData.id);
                }
              });

              // Manual fallback update for totals
              const { data: currentAffiliate } = await supabase
                .from("affiliates")
                .select("total_sales, total_earnings")
                .eq("id", affiliateData.id)
                .single();

              if (currentAffiliate) {
                await supabase
                  .from("affiliates")
                  .update({
                    total_sales: (currentAffiliate.total_sales || 0) + 1,
                    total_earnings: (currentAffiliate.total_earnings || 0) + commissionAmount,
                  })
                  .eq("id", affiliateData.id);
              }

              logStep("Affiliate referral created", { 
                affiliateId: affiliateData.id, 
                commission: commissionAmount 
              });
            } else {
              logStep("Affiliate referral already exists, skipping");
            }
          } else {
            logStep("Self-referral detected, skipping");
          }
        } else {
          logStep("Affiliate not found or inactive", { affiliateCode });
        }
      } catch (affError) {
        logStep("Error processing affiliate referral (non-fatal)", { 
          error: affError instanceof Error ? affError.message : String(affError) 
        });
      }
    }

    // Log fallback alert in audit_logs for admin visibility
    await supabase
      .from("audit_logs")
      .insert({
        action: "FALLBACK_CHECKOUT_VERIFICATION",
        table_name: "test_purchases",
        record_id: userId,
        user_id: userId2,
        new_data: {
          session_id: session.id,
          product_type: productType,
          amount: (session.amount_total || 0) / 100,
          currency: session.currency,
          payment_intent: session.payment_intent,
          customer_email: session.customer_email,
          verified_via: "verify-checkout",
          webhook_bypassed: true,
        },
      });

    logStep("Fallback alert logged to audit_logs");

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Purchase verified and access granted",
      product_type: productType,
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
