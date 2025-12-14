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

// Check if affiliate system is enabled
async function isAffiliateSystemEnabled(): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("app_settings")
      .select("value")
      .eq("key", "affiliate_system_enabled")
      .single();
    
    if (error) {
      logStep("Could not fetch affiliate system status, defaulting to enabled", { error: error.message });
      return true;
    }
    
    const enabled = (data?.value as any)?.enabled ?? true;
    logStep("Affiliate system status", { enabled });
    return enabled;
  } catch (error) {
    logStep("Error checking affiliate system status", { error });
    return true;
  }
}

// Send notification email to affiliate about new commission
async function notifyAffiliateNewCommission(
  affiliateUserId: string,
  affiliateName: string,
  saleAmount: number,
  commissionAmount: number,
  currency: string,
  productType: string
) {
  try {
    // Get affiliate email from auth
    const { data: authData } = await supabase.auth.admin.getUserById(affiliateUserId);
    const affiliateEmail = authData?.user?.email;
    
    if (!affiliateEmail) {
      logStep("Could not find affiliate email for notification", { affiliateUserId });
      return;
    }
    
    // Map product type to display name
    const productNames: Record<string, string> = {
      fundadores: "NELLO ONE Fundadores",
      jornada_completa: "NELLO ONE Completo",
      test_avulso: "Teste Avulso NELLO ONE",
      codigo_essencia: "Código da Essência",
    };
    
    const productName = productNames[productType] || productType;
    
    // Determine language based on currency
    const language = currency === "USD" ? "en" : "pt";
    
    // Send email notification
    const emailResponse = await fetch(`${supabaseUrl}/functions/v1/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${supabaseServiceKey}`,
      },
      body: JSON.stringify({
        type: "new_commission",
        to: affiliateEmail,
        data: {
          name: affiliateName,
          saleAmount,
          commissionAmount,
          productName,
          language,
        },
      }),
    });
    
    if (emailResponse.ok) {
      logStep("New commission notification sent to affiliate", { affiliateEmail, commissionAmount });
    } else {
      logStep("Failed to send new commission notification", { status: emailResponse.status });
    }
  } catch (error) {
    logStep("Error sending affiliate notification", { error: error instanceof Error ? error.message : String(error) });
  }
}

// Process affiliate referral and create commission record
async function processAffiliateReferral(
  session: Stripe.Checkout.Session, 
  affiliateCode: string, 
  purchasingUserId: string
) {
  try {
    // Check if affiliate system is enabled
    const systemEnabled = await isAffiliateSystemEnabled();
    if (!systemEnabled) {
      logStep("Affiliate system is disabled, skipping referral processing", { affiliateCode });
      return;
    }
    
    logStep("Processing affiliate referral", { affiliateCode, purchasingUserId });
    
    // Find the affiliate by code
    const { data: affiliate, error: affiliateError } = await supabase
      .from("affiliates")
      .select(`
        *,
        profile:profiles(full_name)
      `)
      .eq("affiliate_code", affiliateCode.toUpperCase())
      .eq("is_active", true)
      .single();
    
    if (affiliateError || !affiliate) {
      logStep("Affiliate not found or inactive", { affiliateCode, error: affiliateError?.message });
      return;
    }
    
    // Prevent self-referral
    if (affiliate.user_id === purchasingUserId) {
      logStep("Self-referral blocked", { affiliateCode, userId: purchasingUserId });
      return;
    }
    
    const saleAmount = (session.amount_total || 0) / 100;
    const commissionAmount = saleAmount * (affiliate.commission_percent / 100);
    const currency = session.metadata?.currency?.toUpperCase() || "BRL";
    const productType = session.metadata?.product_type || "test_avulso";
    
    logStep("Calculating commission", { 
      saleAmount, 
      commissionPercent: affiliate.commission_percent, 
      commissionAmount,
      currency 
    });
    
    // Create referral record
    const { error: referralError } = await supabase
      .from("affiliate_referrals")
      .insert({
        affiliate_id: affiliate.id,
        referred_user_id: purchasingUserId,
        sale_amount: saleAmount,
        commission_amount: commissionAmount,
        currency: currency,
        status: "pending",
      });
    
    if (referralError) {
      logStep("ERROR: Failed to create referral record", { error: referralError });
      return;
    }
    
    // Update affiliate totals
    const { error: updateError } = await supabase
      .from("affiliates")
      .update({
        total_sales: affiliate.total_sales + 1,
        total_earnings: affiliate.total_earnings + commissionAmount,
      })
      .eq("id", affiliate.id);
    
    if (updateError) {
      logStep("ERROR: Failed to update affiliate totals", { error: updateError });
    } else {
      logStep("Affiliate referral processed successfully", { 
        affiliateId: affiliate.id,
        commissionAmount,
        totalSales: affiliate.total_sales + 1 
      });
    }
    
    // Send notification to affiliate about new commission
    const affiliateName = (affiliate.profile as any)?.full_name || "Afiliado";
    await notifyAffiliateNewCommission(
      affiliate.user_id,
      affiliateName,
      saleAmount,
      commissionAmount,
      currency,
      productType
    );
  } catch (error) {
    logStep("ERROR in processAffiliateReferral", { error: error instanceof Error ? error.message : String(error) });
  }
}

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
      
      logStep("Processing completed checkout", { sessionId: session.id, metadata: session.metadata });

      const productType = session.metadata?.product_type;
      const userId = session.metadata?.user_id;
      const affiliateCode = session.metadata?.affiliate_code;
      
      // Process affiliate referral if applicable
      if (affiliateCode && affiliateCode.trim() !== "" && userId && userId !== "guest") {
        await processAffiliateReferral(session, affiliateCode, userId);
      }

      // ====== FUNDADORES PURCHASE ======
      if (productType === "fundadores") {
        logStep("Processing Fundadores purchase", { userId });
        
        if (!userId || userId === "guest") {
          logStep("ERROR: Fundadores requires authenticated user");
          return new Response(JSON.stringify({ error: "User authentication required" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        // Fundadores gets: Full journey access + Código da Essência + Founder flag
        const { error: updateError } = await supabase
          .from("profiles")
          .update({ 
            codigo_essencia_unlocked: true,
            journey_status: "in_progress",
            journey_started_at: new Date().toISOString(),
            is_founder: true,
          })
          .eq("id", userId);

        if (updateError) {
          logStep("ERROR: Failed to unlock Fundadores access", { error: updateError });
          throw updateError;
        }

        // Fetch all 7 tests
        const { data: allTests } = await supabase
          .from("tests")
          .select("id, name, type")
          .eq("active", true);

        if (allTests && allTests.length > 0) {
          const amountPaid = (session.amount_total || 0) / 100;
          const pricePerTest = amountPaid / allTests.length;

          // Record purchases for all tests
          const purchaseRecords = allTests.map(test => ({
            user_id: userId,
            test_id: test.id,
            price_paid: pricePerTest,
            payment_status: "completed" as const,
            payment_method: "stripe",
            transaction_id: session.payment_intent as string,
            purchase_category: "fundadores",
            test_slug: test.type,
            metadata: {
              session_id: session.id,
              product_type: "fundadores",
              total_tests: allTests.length,
            },
          }));

          const { error: purchaseError } = await supabase
            .from("test_purchases")
            .upsert(purchaseRecords, {
              onConflict: "user_id,test_id",
              ignoreDuplicates: false,
            });

          if (purchaseError) {
            logStep("ERROR: Failed to record Fundadores purchases", { error: purchaseError });
          } else {
            logStep("Fundadores purchases recorded", { count: allTests.length });
          }
        }

        logStep("Fundadores access unlocked successfully", { userId });

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
            const amountPaid = (session.amount_total || 0) / 100;

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
                  testNames: ["Fundadores Nello One - Acesso Completo"],
                  amount: amountPaid,
                  currency: "R$",
                  language,
                  isFundadores: true,
                },
              }),
            });

            logStep("Fundadores confirmation email sent", { userEmail });
          }
        } catch (emailError) {
          logStep("WARN: Failed to send Fundadores email", { error: emailError });
        }

        return new Response(JSON.stringify({ received: true, product: "fundadores" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      // ====== CÓDIGO DA ESSÊNCIA PURCHASE ======
      if (productType === "codigo_da_essencia") {
        logStep("Processing Código da Essência purchase", { userId });
        
        if (!userId || userId === "guest") {
          logStep("ERROR: Código da Essência requires authenticated user");
          return new Response(JSON.stringify({ error: "User authentication required" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        const { error: updateError } = await supabase
          .from("profiles")
          .update({ codigo_essencia_unlocked: true })
          .eq("id", userId);

        if (updateError) {
          logStep("ERROR: Failed to unlock Código da Essência", { error: updateError });
          throw updateError;
        }

        logStep("Código da Essência unlocked successfully", { userId });

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
            const amountPaid = (session.amount_total || 0) / 100;

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
                  testNames: [language === "en" ? "Essence Code" : "Código da Essência"],
                  amount: amountPaid,
                  currency,
                  language,
                },
              }),
            });

            logStep("Confirmation email sent for Código da Essência", { userEmail });
          }
        } catch (emailError) {
          logStep("WARN: Failed to send email", { error: emailError });
        }

        return new Response(JSON.stringify({ received: true, product: "codigo_da_essencia" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      // ====== JORNADA COMPLETA PURCHASE ======
      if (productType === "jornada_completa" || productType === "journey") {
        logStep("Processing Jornada Completa purchase", { userId });
        
        if (!userId || userId === "guest") {
          logStep("WARN: Guest purchase for journey");
          return new Response(JSON.stringify({ received: true, warning: "Guest purchase" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }

        // Update journey status
        const { error: updateError } = await supabase
          .from("profiles")
          .update({ 
            journey_status: "in_progress",
            journey_started_at: new Date().toISOString(),
          })
          .eq("id", userId);

        if (updateError) {
          logStep("ERROR: Failed to update journey status", { error: updateError });
        }

        // Fetch all 7 tests and record purchases
        const { data: allTests } = await supabase
          .from("tests")
          .select("id, name, type")
          .eq("active", true);

        if (allTests && allTests.length > 0) {
          const amountPaid = (session.amount_total || 0) / 100;
          const pricePerTest = amountPaid / allTests.length;

          const purchaseRecords = allTests.map(test => ({
            user_id: userId,
            test_id: test.id,
            price_paid: pricePerTest,
            payment_status: "completed" as const,
            payment_method: "stripe",
            transaction_id: session.payment_intent as string,
            purchase_category: "jornada_completa",
            test_slug: test.type,
            metadata: {
              session_id: session.id,
              product_type: "jornada_completa",
            },
          }));

          const { error: purchaseError } = await supabase
            .from("test_purchases")
            .upsert(purchaseRecords, {
              onConflict: "user_id,test_id",
              ignoreDuplicates: false,
            });

          if (purchaseError) {
            logStep("ERROR: Failed to record journey purchases", { error: purchaseError });
          } else {
            logStep("Journey purchases recorded", { count: allTests.length });
          }
        }

        return new Response(JSON.stringify({ received: true, product: "jornada_completa" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      // ====== STANDARD TEST PURCHASE ======
      let testIds: string[];
      if (session.metadata?.test_ids) {
        try {
          testIds = JSON.parse(session.metadata.test_ids);
        } catch {
          testIds = [session.metadata.test_ids];
        }
      } else if (session.metadata?.test_id) {
        testIds = [session.metadata.test_id];
      } else {
        logStep("ERROR: Missing test metadata", { metadata: session.metadata });
        return new Response("Missing test metadata", { status: 400 });
      }

      if (!userId || userId === "guest") {
        logStep("WARN: Guest purchase - cannot record without user_id");
        return new Response(JSON.stringify({ received: true, warning: "Guest purchase" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      logStep("Processing purchase", { userId, testIds, count: testIds.length });

      const { data: tests, error: testsError } = await supabase
        .from("tests")
        .select("id, name, type, price_brl")
        .in("id", testIds);

      if (testsError || !tests || tests.length === 0) {
        logStep("ERROR: Invalid test IDs", { testIds, error: testsError });
        return new Response("Invalid tests", { status: 400 });
      }

      const amountPaid = (session.amount_total || 0) / 100;
      logStep("Payment details", { amountPaid, testsCount: tests.length });

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
          purchase_category: "test_avulso",
          test_slug: test?.type || null,
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