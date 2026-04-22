import { createClient } from "npm:@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface TalentPoolRequest {
  job_id: string;
  company_id: string;
  full_name: string;
  email: string;
  phone?: string;
  neighborhood?: string;
  city?: string;
  commute_time?: string;
  cultural_affinity_response?: string;
  cultural_affinity_level?: string;
  resume_url?: string;
  resume_filename?: string;
  area_of_interest?: string;
}

const logStep = (step: string, details?: Record<string, unknown>) => {
  console.log(`[business-talent-pool-apply] ${step}`, details ? JSON.stringify(details) : "");
};

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body: TalentPoolRequest = await req.json();

    if (!body.job_id || !body.company_id || !body.full_name || !body.email) {
      throw new Error("Campos obrigatórios: job_id, company_id, full_name, email");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      throw new Error("Email inválido");
    }

    logStep("Request received", { email: body.email, jobId: body.job_id });

    // Verify the job posting exists and is a talent_pool type (or open)
    const { data: job, error: jobError } = await supabase
      .from("job_postings")
      .select("id, title, company_id, status, companies(name, logo_url)")
      .eq("id", body.job_id)
      .eq("company_id", body.company_id)
      .single();

    if (jobError || !job) {
      logStep("Job not found", { error: jobError?.message });
      throw new Error("Vaga não encontrada");
    }

    if (job.status !== "open") {
      throw new Error("Este banco de talentos não está recebendo candidaturas no momento");
    }

    logStep("Job verified", { title: job.title });

    // Check for duplicate application (same email + same job)
    const { data: existingApp } = await supabase
      .from("job_applications")
      .select("id, hiring_candidate_id")
      .eq("job_id", body.job_id)
      .eq("email", body.email)
      .maybeSingle();

    if (existingApp) {
      logStep("Duplicate application found", { existingId: existingApp.id });
      throw new Error("Você já se cadastrou neste banco de talentos. Verifique seu email para acessar a avaliação.");
    }

    // 1. Create job_application
    const { data: application, error: appError } = await supabase
      .from("job_applications")
      .insert({
        job_id: body.job_id,
        company_id: body.company_id,
        status: "active_candidate",
        source: "talent_pool",
        full_name: body.full_name,
        email: body.email,
        phone: body.phone || null,
        neighborhood: body.neighborhood || null,
        city: body.city || null,
        commute_time: body.commute_time || null,
        cultural_affinity_response: body.cultural_affinity_response || null,
        cultural_affinity_level: body.cultural_affinity_level || null,
        resume_url: body.resume_url || null,
        resume_filename: body.resume_filename || null,
        lgpd_consent: true,
        lgpd_consent_at: new Date().toISOString(),
        lgpd_consent_text_version: "v1.0",
        confirmed_at: new Date().toISOString(),
        pipeline_stage: "assessment",
      })
      .select()
      .single();

    if (appError || !application) {
      logStep("Error creating application", { error: appError?.message });
      throw new Error("Erro ao criar candidatura");
    }

    logStep("Application created", { applicationId: application.id });

    // 2. Create hiring_candidate (triggers auto-create assessments)
    const inviteToken = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 14); // 14 days for talent pool

    const { data: hiringCandidate, error: hcError } = await supabase
      .from("hiring_candidates")
      .insert({
        company_id: body.company_id,
        full_name: body.full_name,
        email: body.email,
        phone: body.phone || null,
        position_applied: body.area_of_interest || "Banco de Talentos",
        invite_token: inviteToken,
        invite_sent_at: new Date().toISOString(),
        invite_expires_at: expiresAt.toISOString(),
        status: "pending",
        notes: `Banco de Talentos - ${body.area_of_interest || "Área não especificada"}${body.city ? ` | Cidade: ${body.city}` : ""}`,
      })
      .select()
      .single();

    if (hcError || !hiringCandidate) {
      logStep("Error creating hiring candidate", { error: hcError?.message });
      // Clean up application
      await supabase.from("job_applications").delete().eq("id", application.id);
      throw new Error("Erro ao provisionar avaliação");
    }

    logStep("Hiring candidate created", { hiringCandidateId: hiringCandidate.id });

    // 3. Link application to hiring_candidate
    const { error: linkError } = await supabase
      .from("job_applications")
      .update({ hiring_candidate_id: hiringCandidate.id })
      .eq("id", application.id);

    if (linkError) {
      logStep("Error linking", { error: linkError.message });
      await supabase.from("hiring_candidates").delete().eq("id", hiringCandidate.id);
      await supabase.from("job_applications").delete().eq("id", application.id);
      throw new Error("Erro ao vincular candidatura");
    }

    // 4. Verify assessments were auto-created by trigger
    const { data: assessments } = await supabase
      .from("hiring_assessments")
      .select("id, test_type")
      .eq("candidate_id", hiringCandidate.id);

    if (!assessments || assessments.length === 0) {
      logStep("Assessments not auto-created, manual check needed");
    } else {
      logStep("Assessments verified", { count: assessments.length });
    }

    // 5. Send email with assessment link
    const assessmentUrl = `https://business.nello.one/assessment/${inviteToken}`;
    const companyName = (job.companies as any)?.name || "Empresa";

    try {
      await resend.emails.send({
        from: "Nello One Business <noreply@nello.one>",
        to: [body.email],
        subject: `${body.full_name}, sua avaliação está pronta! - ${companyName}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f9fafb; padding: 40px 20px;">
            <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; padding: 40px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              <h1 style="color: #111827; font-size: 24px; margin-bottom: 16px;">
                Bem-vindo(a) ao Banco de Talentos!
              </h1>

              <p style="color: #6b7280; font-size: 16px; line-height: 1.6;">
                Olá, <strong>${body.full_name}</strong>! Obrigado por se cadastrar no Banco de Talentos da <strong>${companyName}</strong>.
              </p>

              <p style="color: #6b7280; font-size: 16px; line-height: 1.6;">
                Para completar seu cadastro, preparamos uma avaliação de perfil comportamental.
                Ela nos ajuda a entender melhor como você trabalha e se comunica, para que possamos
                encontrar a melhor oportunidade para o seu perfil.
              </p>

              <div style="background: #f3f4f6; border-radius: 8px; padding: 20px; margin: 24px 0;">
                <h3 style="color: #374151; font-size: 16px; margin: 0 0 12px;">O que esperar:</h3>
                <ul style="color: #6b7280; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
                  <li><strong>Teste DISC</strong> - Seu estilo de trabalho (10-15 min)</li>
                  <li><strong>Teste de Temperamentos</strong> - Suas tendencias naturais (10-15 min)</li>
                  <li>Nao existem respostas certas ou erradas</li>
                  <li>Resultados confidenciais e instantaneos</li>
                </ul>
              </div>

              <div style="text-align: center; margin: 32px 0;">
                <a href="${assessmentUrl}" style="display: inline-block; background: #2563eb; color: white; font-size: 16px; font-weight: 600; padding: 14px 32px; border-radius: 8px; text-decoration: none;">
                  Iniciar Avaliacao
                </a>
              </div>

              <p style="color: #9ca3af; font-size: 13px; text-align: center; line-height: 1.5;">
                Este link expira em 14 dias. Quando surgirem vagas compativeis com seu perfil,
                entraremos em contato pelo email cadastrado.
              </p>
            </div>
          </body>
          </html>
        `,
      });

      logStep("Email sent successfully");
    } catch (emailError) {
      logStep("Email send failed", { error: String(emailError) });
      // Don't fail the whole operation if email fails
    }

    // 6. Audit log
    await supabase.from("company_audit_logs").insert({
      company_id: body.company_id,
      action: "talent_pool_application",
      details: {
        application_id: application.id,
        hiring_candidate_id: hiringCandidate.id,
        candidate_email: body.email,
        candidate_name: body.full_name,
        area_of_interest: body.area_of_interest,
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Cadastro realizado com sucesso! Verifique seu email para iniciar a avaliação.",
        assessment_url: assessmentUrl,
        invite_token: inviteToken,
      }),
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
