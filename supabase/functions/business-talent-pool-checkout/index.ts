import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const logStep = (step: string, details?: Record<string, unknown>) => {
  console.log(`[business-talent-pool-checkout] ${step}`, details ? JSON.stringify(details) : "");
};

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY not configured");

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.json();
    const {
      job_id,
      company_id,
      full_name,
      email,
      phone,
      city,
      area_of_interest,
      resume_url,
      resume_filename,
    } = body;

    if (!job_id || !company_id || !full_name || !email) {
      throw new Error("Campos obrigatórios: job_id, company_id, full_name, email");
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Email inválido");
    }

    logStep("Request received", { email, jobId: job_id });

    // Verify job exists and is open
    const { data: job, error: jobError } = await supabase
      .from("job_postings")
      .select("id, title, company_id, status, public_slug, companies(name)")
      .eq("id", job_id)
      .eq("company_id", company_id)
      .single();

    if (jobError || !job) {
      throw new Error("Vaga não encontrada");
    }

    if (job.status !== "open") {
      throw new Error("Este banco de talentos não está recebendo candidaturas");
    }

    // Check for duplicate
    const { data: existingApp } = await supabase
      .from("job_applications")
      .select("id")
      .eq("job_id", job_id)
      .eq("email", email)
      .maybeSingle();

    if (existingApp) {
      throw new Error("Você já se cadastrou neste banco de talentos.");
    }

    const companyName = (job.companies as any)?.name || "Empresa";

    // Create Stripe Checkout session with price_data (no pre-created price needed)
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card", "boleto", "pix"],
      line_items: [
        {
          price_data: {
            currency: "brl",
            unit_amount: 2990, // R$29,90
            product_data: {
              name: "Avaliação Comportamental",
              description: `Perfil DISC + Temperamentos — ${companyName}`,
            },
          },
          quantity: 1,
        },
      ],
      customer_email: email,
      metadata: {
        product_type: "talent_pool_assessment",
        job_id,
        company_id,
        full_name,
        email,
        phone: phone || "",
        city: city || "",
        area_of_interest: area_of_interest || "",
        resume_url: resume_url || "",
        resume_filename: resume_filename || "",
      },
      success_url: `https://business.nello.one/talentos/${(job as any).public_slug || "pool"}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://business.nello.one/talentos/${(job as any).public_slug || "pool"}?payment=cancelled`,
      payment_intent_data: {
        metadata: {
          product_type: "talent_pool_assessment",
          email,
          full_name,
        },
      },
    });

    logStep("Checkout session created", { sessionId: session.id, url: session.url });

    return new Response(
      JSON.stringify({ url: session.url, session_id: session.id }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    logStep("Error", { error: errorMessage });

    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
