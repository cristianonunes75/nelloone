import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[BUSINESS-CREATE-COMPANY] ${step}${detailsStr}`);
};

const slugify = (input: string) =>
  input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData.user) {
      throw new Error(`Invalid authentication: ${userError?.message ?? "no user"}`);
    }

    const user = userData.user;
    logStep("User authenticated", { userId: user.id, email: user.email });

    const body = await req.json().catch(() => ({}));
    const companyName = String(body?.companyName ?? "").trim();
    const billingEmail = String(body?.billingEmail ?? user.email ?? "").trim();

    if (!companyName) throw new Error("companyName is required");
    if (!billingEmail) throw new Error("billingEmail is required");

    const baseSlug = slugify(companyName);
    if (!baseSlug) throw new Error("Invalid companyName");

    const slug = `${baseSlug}-${Date.now().toString(36)}`;

    // Create company
    const { data: company, error: companyError } = await supabase
      .from("companies")
      .insert({
        name: companyName,
        slug,
        created_by: user.id,
        billing_email: billingEmail,
      })
      .select()
      .single();

    if (companyError) throw new Error(`Failed to create company: ${companyError.message}`);

    // Link user as admin
    const nowIso = new Date().toISOString();
    const { error: linkError } = await supabase.from("company_users").insert({
      company_id: company.id,
      user_id: user.id,
      role: "company_admin",
      is_active: true,
      consent_given: true,
      consent_given_at: nowIso,
      joined_at: nowIso,
    });

    if (linkError) throw new Error(`Failed to link user: ${linkError.message}`);

    // Create subscription (trial)
    const trialEndsAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
    const { error: subError } = await supabase.from("company_subscriptions").insert({
      company_id: company.id,
      status: "trialing",
      plan_tier: "starter",
      max_collaborators: 10,
      trial_ends_at: trialEndsAt,
    });

    if (subError) throw new Error(`Failed to create subscription: ${subError.message}`);

    logStep("Company created", { companyId: company.id });

    return new Response(
      JSON.stringify({
        success: true,
        company: {
          id: company.id,
          name: company.name,
          slug: company.slug,
        },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    logStep("ERROR", { message: errorMessage });

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
