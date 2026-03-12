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

// Notify admin about new purchase
async function notifyAdminNewPurchase(
  userName: string,
  userEmail: string,
  amount: number,
  currency: string,
  productType: string,
  affiliateName?: string,
  commission?: number
) {
  try {
    const productNames: Record<string, string> = {
      jornada_completa: "NELLO ONE Completo",
      test_avulso: "Teste Avulso",
      codigo_essencia: "Código da Essência",
      codigo_casal: "Código do Casal",
      ativacao_codigo: "Ativação do Código",
      fundadores: "NELLO ONE Completo",
    };
    
    const productName = productNames[productType] || productType;
    
    // Call notify-admin edge function
    const notifyResponse = await fetch(`${supabaseUrl}/functions/v1/notify-admin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${supabaseServiceKey}`,
      },
      body: JSON.stringify({
        event_type: "new_purchase",
        data: {
          user_name: userName,
          user_email: userEmail,
          amount,
          currency,
          product: productName,
        },
      }),
    });
    
    if (notifyResponse.ok) {
      logStep("Admin notified about new purchase", { productName, amount });
    } else {
      logStep("Failed to notify admin", { status: notifyResponse.status });
    }
    
    // If affiliate sale, send separate notification
    if (affiliateName && commission) {
      await fetch(`${supabaseUrl}/functions/v1/notify-admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${supabaseServiceKey}`,
        },
        body: JSON.stringify({
          event_type: "affiliate_sale",
          data: {
            affiliate_name: affiliateName,
            amount,
            commission,
            currency,
            product: productName,
          },
        }),
      });
      logStep("Admin notified about affiliate sale");
    }
  } catch (error) {
    logStep("Error notifying admin", { error: error instanceof Error ? error.message : String(error) });
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
  const corsHeaders = {
    "Access-Control-Allow-Origin": req.headers.get("origin") ?? "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
    "Access-Control-Allow-Methods": "POST, OPTIONS, GET",
  };

  // Health-check / manual verification endpoint (open in browser)
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  logStep("Request received", {
    method: req.method,
    url: req.url,
    hasStripeSignature: Boolean(req.headers.get("stripe-signature")),
    userAgent: req.headers.get("user-agent"),
  });

  if (req.method === "GET") {
    const hasSecret = Boolean(Deno.env.get("STRIPE_WEBHOOK_SECRET"));
    return new Response(
      JSON.stringify({ ok: true, webhook: "stripe-webhook", hasWebhookSecret: hasSecret }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  }

  // Stripe will call via POST
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    logStep("ERROR: No Stripe signature found", {
      method: req.method,
      url: req.url,
      headers: {
        "content-type": req.headers.get("content-type"),
        "user-agent": req.headers.get("user-agent"),
      },
    });
    return new Response("No signature", { status: 400, headers: corsHeaders });
  }

  try {
    const body = await req.text();
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

    // CRITICAL: Always require webhook secret verification - no fallback to unverified parsing
    if (!webhookSecret) {
      logStep("CRITICAL ERROR: STRIPE_WEBHOOK_SECRET not configured");
      return new Response(
        JSON.stringify({ error: "Webhook not properly configured" }),
        { status: 500, headers: corsHeaders }
      );
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      logStep("ERROR: Webhook signature verification failed", { 
        error: err instanceof Error ? err.message : String(err) 
      });
      return new Response(
        JSON.stringify({ error: "Invalid signature" }),
        { status: 400, headers: corsHeaders }
      );
    }

    logStep("Webhook event verified and received", { type: event.type });

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

      // ====== FUNDADORES PURCHASE (treated as jornada_completa) ======
      if (productType === "fundadores") {
        logStep("Processing Fundadores purchase (as jornada_completa)", { userId });
        
        if (!userId || userId === "guest") {
          logStep("WARN: Guest purchase for fundadores");
          return new Response(JSON.stringify({ received: true, warning: "Guest purchase" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }

        // Update journey status AND unlock Código da Essência + founder flag
        const { error: updateError } = await supabase
          .from("profiles")
          .update({ 
            journey_status: "in_progress",
            journey_started_at: new Date().toISOString(),
            codigo_essencia_unlocked: true,
            is_founder: true,
          })
          .eq("id", userId);

        if (updateError) {
          logStep("ERROR: Failed to update profile for fundadores", { error: updateError });
        }

        // Fetch all tests and record purchases
        const { data: allTestsFundadores } = await supabase
          .from("tests")
          .select("id, name, type")
          .eq("active", true);

        if (allTestsFundadores && allTestsFundadores.length > 0) {
          const amountPaid = (session.amount_total || 0) / 100;
          const pricePerTest = amountPaid / allTestsFundadores.length;

          const purchaseRecords = allTestsFundadores.map(test => ({
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
            },
          }));

          const { error: purchaseError } = await supabase
            .from("test_purchases")
            .upsert(purchaseRecords, {
              onConflict: "user_id,test_id",
              ignoreDuplicates: false,
            });

          if (purchaseError) {
            logStep("ERROR: Failed to record fundadores purchases", { error: purchaseError });
          } else {
            logStep("Fundadores purchases recorded", { count: allTestsFundadores.length });
          }
        }

        // Notify admin
        try {
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", userId)
            .single();
          const { data: userAuth } = await supabase.auth.admin.getUserById(userId);
          await notifyAdminNewPurchase(
            profile?.full_name || "Não informado",
            userAuth?.user?.email || "sem email",
            (session.amount_total || 0) / 100,
            session.metadata?.currency?.toUpperCase() || "BRL",
            "fundadores"
          );
        } catch (notifyError) {
          logStep("WARN: Failed to notify admin", { error: notifyError });
        }

        return new Response(JSON.stringify({ received: true, product: "fundadores" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      // ====== CÓDIGO DO CASAL PURCHASE ======
      if (productType === "codigo_casal") {
        logStep("Processing Código do Casal purchase", { userId });
        
        if (!userId || userId === "guest") {
          logStep("ERROR: Código do Casal requires authenticated user");
          return new Response(JSON.stringify({ error: "User authentication required" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        // Get a test_id for the purchase record (required column)
        const { data: firstTestCC } = await supabase
          .from("tests")
          .select("id")
          .eq("active", true)
          .limit(1)
          .single();

        // Record purchase in test_purchases
        const { error: purchaseError } = await supabase
          .from("test_purchases")
          .insert({
            user_id: userId,
            test_id: firstTestCC?.id || "00000000-0000-0000-0000-000000000000",
            payment_status: "completed",
            payment_method: "stripe",
            price_paid: (session.amount_total || 0) / 100,
            currency: session.metadata?.currency?.toUpperCase() || "BRL",
            transaction_id: session.payment_intent as string,
            purchase_category: "codigo_casal",
            metadata: {
              session_id: session.id,
              product_type: "codigo_casal",
              purchase_origin: session.metadata?.purchase_origin || "couple_paywall",
            },
          });

        if (purchaseError) {
          logStep("ERROR: Failed to record Código do Casal purchase", { error: purchaseError });
          throw purchaseError;
        }

        logStep("Código do Casal purchase recorded successfully", { userId });

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
            const currencySymbol = session.metadata?.currency === "usd" ? "$" : 
                            session.metadata?.currency === "eur" ? "€" : "R$";
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
                  testNames: [language === "en" ? "Couple's Code" : "Código do Casal"],
                  amount: amountPaid,
                  currency: currencySymbol,
                  language,
                },
              }),
            });

            logStep("Confirmation email sent for Código do Casal", { userEmail });
          }
        } catch (emailError) {
          logStep("WARN: Failed to send email", { error: emailError });
        }
        
        // Notify admin about new purchase
        try {
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", userId)
            .single();
          const { data: userAuth } = await supabase.auth.admin.getUserById(userId);
          const amountPaid = (session.amount_total || 0) / 100;
          await notifyAdminNewPurchase(
            profile?.full_name || "Não informado",
            userAuth?.user?.email || "sem email",
            amountPaid,
            session.metadata?.currency?.toUpperCase() || "BRL",
            "codigo_casal"
          );
        } catch (notifyError) {
          logStep("WARN: Failed to notify admin", { error: notifyError });
        }

        return new Response(JSON.stringify({ received: true, product: "codigo_casal" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      // ====== ATIVAÇÃO DO CÓDIGO PURCHASE ======
      if (productType === "ativacao_codigo") {
        logStep("Processing Ativação do Código purchase", { userId });
        
        if (!userId || userId === "guest") {
          logStep("ERROR: Ativação do Código requires authenticated user");
          return new Response(JSON.stringify({ error: "User authentication required" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        // Update profile to unlock ativacao
        const { error: updateError } = await supabase
          .from("profiles")
          .update({ ativacao_codigo_unlocked: true })
          .eq("id", userId);

        if (updateError) {
          logStep("ERROR: Failed to unlock Ativação do Código", { error: updateError });
          throw updateError;
        }

        // Record purchase
        const { data: firstTestAC } = await supabase
          .from("tests").select("id").eq("active", true).limit(1).single();

        const { error: purchaseError } = await supabase
          .from("test_purchases")
          .insert({
            user_id: userId,
            test_id: firstTestAC?.id || "00000000-0000-0000-0000-000000000000",
            payment_status: "completed",
            payment_method: "stripe",
            price_paid: (session.amount_total || 0) / 100,
            currency: session.metadata?.currency?.toUpperCase() || "BRL",
            transaction_id: session.payment_intent as string,
            purchase_category: "ativacao_codigo",
          });

        if (purchaseError) {
          logStep("ERROR: Failed to record purchase", { error: purchaseError });
        }

        logStep("Ativação do Código unlocked successfully", { userId });

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
            const currencySymbol = session.metadata?.currency === "usd" ? "$" : 
                            session.metadata?.currency === "eur" ? "€" : "R$";
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
                  testNames: [language === "en" ? "Essence Code Activation" : "Ativação do Código da Essência"],
                  amount: amountPaid,
                  currency: currencySymbol,
                  language,
                },
              }),
            });

            logStep("Confirmation email sent for Ativação do Código", { userEmail });
          }
        } catch (emailError) {
          logStep("WARN: Failed to send email", { error: emailError });
        }

        return new Response(JSON.stringify({ received: true, product: "ativacao_codigo" }), {
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

      // ====== ACTIVATION INDIVIDUAL PURCHASE ======
      if (productType === "activation_individual") {
        logStep("Processing Activation Individual purchase", { userId });
        
        if (!userId || userId === "guest") {
          logStep("ERROR: Activation Individual requires authenticated user");
          return new Response(JSON.stringify({ error: "User authentication required" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        // Update profile to unlock activation_individual
        const { error: updateError } = await supabase
          .from("profiles")
          .update({ has_activation_individual: true })
          .eq("id", userId);

        if (updateError) {
          logStep("ERROR: Failed to unlock Activation Individual", { error: updateError });
          throw updateError;
        }

        // Record purchase
        const { data: firstTestAI } = await supabase
          .from("tests").select("id").eq("active", true).limit(1).single();

        const { error: purchaseError } = await supabase
          .from("test_purchases")
          .insert({
            user_id: userId,
            test_id: firstTestAI?.id || "00000000-0000-0000-0000-000000000000",
            payment_status: "completed",
            payment_method: "stripe",
            price_paid: (session.amount_total || 0) / 100,
            currency: session.metadata?.currency?.toUpperCase() || "BRL",
            transaction_id: session.payment_intent as string,
            purchase_category: "activation_individual",
          });

        if (purchaseError) {
          logStep("ERROR: Failed to record purchase", { error: purchaseError });
        }

        logStep("Activation Individual unlocked successfully", { userId });

        return new Response(JSON.stringify({ received: true, product: "activation_individual" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      // ====== NELLO COUPLE PURCHASE ======
      if (productType === "nello_couple") {
        logStep("Processing Nello Couple purchase", { userId });
        
        if (!userId || userId === "guest") {
          logStep("ERROR: Nello Couple requires authenticated user");
          return new Response(JSON.stringify({ error: "User authentication required" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        const { error: updateError } = await supabase
          .from("profiles")
          .update({ has_nello_couple: true })
          .eq("id", userId);

        if (updateError) {
          logStep("ERROR: Failed to unlock Nello Couple", { error: updateError });
          throw updateError;
        }

        const { data: firstTestNC } = await supabase
          .from("tests").select("id").eq("active", true).limit(1).single();

        const { error: purchaseError } = await supabase
          .from("test_purchases")
          .insert({
            user_id: userId,
            test_id: firstTestNC?.id || "00000000-0000-0000-0000-000000000000",
            payment_status: "completed",
            payment_method: "stripe",
            price_paid: (session.amount_total || 0) / 100,
            currency: session.metadata?.currency?.toUpperCase() || "BRL",
            transaction_id: session.payment_intent as string,
            purchase_category: "nello_couple",
          });

        if (purchaseError) {
          logStep("ERROR: Failed to record purchase", { error: purchaseError });
        }

        logStep("Nello Couple unlocked successfully", { userId });

        return new Response(JSON.stringify({ received: true, product: "nello_couple" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      // ====== ACTIVATION COUPLE PURCHASE ======
      if (productType === "activation_couple") {
        logStep("Processing Activation Couple purchase", { userId });
        
        if (!userId || userId === "guest") {
          logStep("ERROR: Activation Couple requires authenticated user");
          return new Response(JSON.stringify({ error: "User authentication required" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        const { error: updateError } = await supabase
          .from("profiles")
          .update({ has_activation_couple: true })
          .eq("id", userId);

        if (updateError) {
          logStep("ERROR: Failed to unlock Activation Couple", { error: updateError });
          throw updateError;
        }

        const { error: purchaseError } = await supabase
          .from("test_purchases")
          .insert({
            user_id: userId,
            test_id: null,
            payment_status: "completed",
            amount_paid: (session.amount_total || 0) / 100,
            currency: session.metadata?.currency?.toUpperCase() || "BRL",
            stripe_session_id: session.id,
            purchase_category: "activation_couple",
          });

        if (purchaseError) {
          logStep("ERROR: Failed to record purchase", { error: purchaseError });
        }

        logStep("Activation Couple unlocked successfully", { userId });

        return new Response(JSON.stringify({ received: true, product: "activation_couple" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      // ====== IDENTITY COUPLE PREMIUM PURCHASE (HIGH TICKET R$997) ======
      if (productType === "identity_couple_premium") {
        logStep("Processing Identity Couple Premium purchase (R$997)", { userId });
        
        if (!userId || userId === "guest") {
          logStep("ERROR: Identity Couple Premium requires authenticated user");
          return new Response(JSON.stringify({ error: "User authentication required" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        // Premium includes all couple features
        const { error: updateError } = await supabase
          .from("profiles")
          .update({ 
            has_identity_couple_premium: true,
            has_nello_couple: true,
            has_activation_couple: true,
          })
          .eq("id", userId);

        if (updateError) {
          logStep("ERROR: Failed to unlock Identity Couple Premium", { error: updateError });
          throw updateError;
        }

        const { error: purchaseError } = await supabase
          .from("test_purchases")
          .insert({
            user_id: userId,
            test_id: null,
            payment_status: "completed",
            amount_paid: (session.amount_total || 0) / 100,
            currency: session.metadata?.currency?.toUpperCase() || "BRL",
            stripe_session_id: session.id,
            purchase_category: "identity_couple_premium",
          });

        if (purchaseError) {
          logStep("ERROR: Failed to record purchase", { error: purchaseError });
        }

        logStep("Identity Couple Premium unlocked (includes all couple features)", { userId });

        return new Response(JSON.stringify({ received: true, product: "identity_couple_premium" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      // ====== JORNADA COMPLETA PURCHASE (also handles codigo_essencia_express) ======
      // VALIDATION PHASE: Jornada Completa now includes Código da Essência
      // codigo_essencia_express is treated identically to jornada_completa for fulfillment
      if (productType === "jornada_completa" || productType === "journey" || productType === "codigo_essencia_express") {
        logStep("Processing Jornada Completa purchase (includes Código da Essência)", { userId });
        
        if (!userId || userId === "guest") {
          logStep("WARN: Guest purchase for journey");
          return new Response(JSON.stringify({ received: true, warning: "Guest purchase" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }

        // Update journey status AND unlock Código da Essência (VALIDATION PHASE: included in bundle)
        const { error: updateError } = await supabase
          .from("profiles")
          .update({ 
            journey_status: "in_progress",
            journey_started_at: new Date().toISOString(),
            codigo_essencia_unlocked: true,
          })
          .eq("id", userId);

        if (updateError) {
          logStep("ERROR: Failed to update journey status", { error: updateError });
        } else {
          logStep("Código da Essência unlocked as part of Jornada Completa", { userId });
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
              includes_codigo_essencia: true, // VALIDATION PHASE
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
            logStep("Journey purchases recorded with Código da Essência included", { count: allTests.length });
          }
        }

        // Send confirmation email mentioning Código da Essência is included
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
                  testNames: ["NELLO ONE – Jornada Completa (inclui Código da Essência)"],
                  amount: amountPaid,
                  currency: "R$",
                  language,
                  includesCodigoEssencia: true,
                },
              }),
            });

            logStep("Jornada Completa confirmation email sent", { userEmail });
          }
        } catch (emailError) {
          logStep("WARN: Failed to send email", { error: emailError });
        }
        
        // Notify admin about new jornada completa purchase
        try {
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", userId)
            .single();
          const { data: userAuth } = await supabase.auth.admin.getUserById(userId);
          const amountPaid = (session.amount_total || 0) / 100;
          await notifyAdminNewPurchase(
            profile?.full_name || "Não informado",
            userAuth?.user?.email || "sem email",
            amountPaid,
            session.metadata?.currency?.toUpperCase() || "BRL",
            "jornada_completa"
          );
        } catch (notifyError) {
          logStep("WARN: Failed to notify admin", { error: notifyError });
        }

        return new Response(JSON.stringify({ received: true, product: "jornada_completa", includes_codigo_essencia: true }), {
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