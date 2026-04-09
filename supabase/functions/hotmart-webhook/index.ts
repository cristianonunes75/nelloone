import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const HOTMART_TOKEN = Deno.env.get("HOTMART_WEBHOOK_TOKEN");

const logStep = (step: string, details?: any) => {
  console.log(`[HOTMART-WEBHOOK] ${step}`, details ? JSON.stringify(details) : "");
};

// Verify Hotmart webhook authenticity via hottok parameter
function verifyHotmartToken(url: URL): boolean {
  if (!HOTMART_TOKEN) {
    logStep("WARNING: HOTMART_WEBHOOK_TOKEN not set — skipping verification");
    return true;
  }
  const hottok = url.searchParams.get("hottok");
  return hottok === HOTMART_TOKEN;
}

// Grant full journey access to a user
async function grantJourneyAccess(userId: string, transactionId: string): Promise<void> {
  // 1. Update profile
  await supabase
    .from("profiles")
    .update({
      journey_status: "in_progress",
      journey_started_at: new Date().toISOString(),
      ativacao_codigo_unlocked: true,
    })
    .eq("id", userId);

  // 2. Get all active tests
  const { data: allTests, error: testsError } = await supabase
    .from("tests")
    .select("id, type")
    .eq("active", true);

  if (testsError || !allTests) {
    throw new Error(`Failed to fetch tests: ${testsError?.message}`);
  }

  // 3. Create purchase records for each test
  for (const test of allTests) {
    await supabase.from("test_purchases").upsert(
      {
        user_id: userId,
        test_id: test.id,
        payment_status: "completed",
        payment_method: "hotmart",
        price_paid: 0,
        currency: "BRL",
        purchase_category: "jornada_completa",
        test_slug: test.type,
        transaction_id: transactionId,
        metadata: {
          source: "hotmart",
          product_type: "jornada_completa",
          processed_at: new Date().toISOString(),
        },
      },
      { onConflict: "user_id,test_id", ignoreDuplicates: true }
    );
  }

  logStep("Journey access granted", { userId, testsGranted: allTests.length });
}

// Send welcome email with login link
async function sendWelcomeEmail(email: string, name: string): Promise<void> {
  try {
    await fetch(`${supabaseUrl}/functions/v1/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${supabaseServiceKey}`,
      },
      body: JSON.stringify({
        type: "hotmart_welcome",
        to: email,
        data: {
          name,
          loginUrl: "https://identity.nello.one/auth?mode=login",
          language: "pt",
        },
      }),
    });
    logStep("Welcome email sent", { email });
  } catch (e) {
    logStep("Failed to send welcome email", { email, error: e instanceof Error ? e.message : String(e) });
  }
}

serve(async (req) => {
  // Hotmart sends POST, but also handle OPTIONS for testing
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "content-type",
      },
    });
  }

  try {
    // 1. Verify Hotmart token
    const url = new URL(req.url);
    if (!verifyHotmartToken(url)) {
      logStep("Invalid hottok");
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    // 2. Parse payload
    // Hotmart can send form-encoded or JSON depending on config
    let payload: any;
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      payload = await req.json();
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await req.formData();
      payload = Object.fromEntries(formData.entries());
      // Hotmart sends nested data as flat keys or JSON strings
      if (typeof payload.data === "string") {
        try { payload = JSON.parse(payload.data); } catch { /* keep as-is */ }
      }
    } else {
      // Try JSON as fallback
      try { payload = await req.json(); } catch {
        payload = Object.fromEntries((await req.formData()).entries());
      }
    }

    logStep("Received webhook", {
      event: payload.event,
      buyerEmail: payload.data?.buyer?.email || payload.buyer?.email,
    });

    // 3. Extract event type
    // Hotmart webhook event types:
    // PURCHASE_COMPLETE / PURCHASE_APPROVED — payment confirmed
    // PURCHASE_CANCELED / PURCHASE_REFUNDED — cancellation/refund
    // PURCHASE_CHARGEBACK — chargeback
    // PURCHASE_DELAYED — delayed payment (boleto pending)
    const event = (payload.event || payload.status || "").toUpperCase();

    // We only process confirmed purchases
    if (!["PURCHASE_COMPLETE", "PURCHASE_APPROVED"].includes(event)) {
      logStep("Ignoring event", { event });
      return new Response(JSON.stringify({ status: "ignored", event }), { status: 200 });
    }

    // 4. Extract buyer data from Hotmart payload
    // Hotmart v2 webhook structure
    const buyer = payload.data?.buyer || payload.buyer || {};
    const purchase = payload.data?.purchase || payload.purchase || {};
    const product = payload.data?.product || payload.product || {};

    const buyerEmail = (buyer.email || "").trim().toLowerCase();
    const buyerName = buyer.name || buyer.first_name || "Usuário Hotmart";
    const transactionId = purchase.transaction || purchase.order_date || `hotmart_${Date.now()}`;
    const productId = product.id || product.name || "unknown";
    const purchasePrice = purchase.price?.value || purchase.original_offer_price?.value || 0;

    if (!buyerEmail) {
      logStep("No buyer email found in payload");
      return new Response(JSON.stringify({ error: "Missing buyer email" }), { status: 400 });
    }

    logStep("Processing purchase", { buyerEmail, buyerName, transactionId, productId, purchasePrice });

    // 5. Record the Hotmart purchase (for audit/tracking)
    await supabase.from("hotmart_purchases" as any).insert({
      email: buyerEmail,
      name: buyerName,
      transaction_id: transactionId,
      product_id: String(productId),
      amount: purchasePrice,
      event_type: event,
      raw_payload: payload,
    } as any).then(({ error }) => {
      if (error) logStep("Could not save hotmart_purchases record", { error: error.message });
    });

    // 6. Check if user exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1 });
    // Direct email lookup
    let userId: string | null = null;

    // Try RPC first (efficient)
    const { data: rpcResult } = await supabase
      .rpc("get_auth_user_by_email" as any, { lookup_email: buyerEmail })
      .maybeSingle();

    if (rpcResult?.id) {
      userId = rpcResult.id;
      logStep("User found via RPC", { userId });
    } else {
      // Fallback: paginated search
      let page = 1;
      while (!userId) {
        const { data: batch, error } = await supabase.auth.admin.listUsers({ page, perPage: 500 });
        if (error) break;
        const match = batch.users.find((u) => u.email?.toLowerCase() === buyerEmail);
        if (match) { userId = match.id; break; }
        if (batch.users.length < 500) break;
        page++;
      }
    }

    if (userId) {
      // 7a. User exists — grant access immediately
      logStep("User exists, granting access", { userId });
      await grantJourneyAccess(userId, transactionId);

      // Send email confirming access
      await sendWelcomeEmail(buyerEmail, buyerName);

    } else {
      // 7b. User doesn't exist — create account with temporary password
      logStep("User not found, creating account", { email: buyerEmail });

      const tempPassword = crypto.randomUUID().replace(/-/g, "").substring(0, 16) + "!A1";

      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: buyerEmail,
        password: tempPassword,
        email_confirm: true, // Skip email confirmation
        user_metadata: {
          full_name: buyerName,
          source: "hotmart",
        },
      });

      if (createError || !newUser.user) {
        logStep("Failed to create user", { error: createError?.message });
        return new Response(
          JSON.stringify({ error: `Failed to create user: ${createError?.message}` }),
          { status: 500 }
        );
      }

      userId = newUser.user.id;
      logStep("User created", { userId });

      // Create profile
      await supabase.from("profiles").upsert({
        id: userId,
        full_name: buyerName,
        email: buyerEmail,
      }, { onConflict: "id" });

      // Grant journey access
      await grantJourneyAccess(userId, transactionId);

      // Send magic link for password-free first login
      const { error: magicLinkError } = await supabase.auth.admin.generateLink({
        type: "magiclink",
        email: buyerEmail,
        options: {
          redirectTo: "https://identity.nello.one/cliente",
        },
      });

      if (magicLinkError) {
        logStep("Could not generate magic link, sending regular welcome", { error: magicLinkError.message });
      }

      // Send welcome email
      await sendWelcomeEmail(buyerEmail, buyerName);
    }

    // 8. Notify admin about the sale
    try {
      await fetch(`${supabaseUrl}/functions/v1/notify-admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${supabaseServiceKey}`,
        },
        body: JSON.stringify({
          event_type: "new_purchase",
          data: {
            user_name: buyerName,
            user_email: buyerEmail,
            amount: purchasePrice,
            currency: "BRL",
            product: `Hotmart: ${product.name || productId}`,
          },
        }),
      });
    } catch { /* non-blocking */ }

    logStep("Purchase processed successfully", { buyerEmail, userId });

    return new Response(
      JSON.stringify({ success: true, userId, email: buyerEmail }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message });
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
