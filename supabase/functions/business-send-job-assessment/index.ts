import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SendAssessmentRequest {
  application_id: string;
}

const logStep = (step: string, details?: Record<string, unknown>) => {
  console.log(`[business-send-job-assessment] ${step}`, details ? JSON.stringify(details) : "");
};

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user from authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error("Invalid authentication");
    }

    logStep("User authenticated", { userId: user.id });

    const { application_id }: SendAssessmentRequest = await req.json();

    if (!application_id) {
      throw new Error("Missing required field: application_id");
    }

    // Get job application info with job details
    const { data: application, error: appError } = await supabase
      .from("job_applications")
      .select(`
        *,
        job_postings(title, department, company_id, companies(name, slug))
      `)
      .eq("id", application_id)
      .single();

    if (appError || !application) {
      logStep("Application not found", { error: appError?.message });
      throw new Error("Application not found");
    }

    logStep("Application found", { 
      applicationId: application.id, 
      email: application.email,
      fullName: application.full_name 
    });

    // Check if application already has a hiring_candidate_id
    if (application.hiring_candidate_id) {
      // Check if this candidate already has assessments
      const { data: existingAssessments } = await supabase
        .from("hiring_assessments")
        .select("id, status")
        .eq("candidate_id", application.hiring_candidate_id);
      
      if (existingAssessments && existingAssessments.length > 0) {
        throw new Error("Este candidato já possui uma avaliação comportamental em andamento");
      }
    }

    // Verify user is from the same company
    const companyId = application.job_postings?.company_id;
    if (!companyId) {
      throw new Error("Job posting not found");
    }

    const { data: companyUser, error: cuError } = await supabase
      .from("company_users")
      .select("role, company_id")
      .eq("user_id", user.id)
      .eq("company_id", companyId)
      .eq("is_active", true)
      .single();

    if (cuError || !companyUser) {
      throw new Error("User is not part of this company");
    }

    if (companyUser.role !== "company_admin" && companyUser.role !== "super_admin") {
      throw new Error("User does not have permission to send assessments");
    }

    logStep("User authorized", { userRole: companyUser.role });

    // Validate that the candidate has an email
    if (!application.email) {
      throw new Error("O candidato precisa ter um email cadastrado para receber a avaliação");
    }

    // Generate invite token
    const inviteToken = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    // Create hiring_candidate
    const { data: hiringCandidate, error: hcError } = await supabase
      .from("hiring_candidates")
      .insert({
        company_id: companyId,
        full_name: application.full_name || "Nome não informado",
        email: application.email,
        phone: application.phone || null,
        position_applied: application.job_postings?.title || null,
        invite_token: inviteToken,
        invite_sent_at: new Date().toISOString(),
        invite_expires_at: expiresAt.toISOString(),
        status: "pending",
        created_by: user.id,
        notes: `Candidato originado da vaga: ${application.job_postings?.title || 'N/A'}`,
      })
      .select()
      .single();

    if (hcError || !hiringCandidate) {
      logStep("Error creating hiring candidate", { error: hcError?.message });
      throw new Error("Failed to create hiring candidate");
    }

    logStep("Hiring candidate created", { hiringCandidateId: hiringCandidate.id });

    // IMPORTANT: Link the hiring_candidate to the job_application immediately.
    // This makes the operation idempotent: if anything fails after this point,
    // retries will see application.hiring_candidate_id and won't create duplicates.
    const { error: linkError } = await supabase
      .from("job_applications")
      .update({
        hiring_candidate_id: hiringCandidate.id,
        pipeline_stage: "assessment",
      })
      .eq("id", application_id);

    if (linkError) {
      logStep("Error linking candidate", { error: linkError.message });
      // Best-effort cleanup to avoid leaving orphan candidates
      await supabase.from("hiring_candidates").delete().eq("id", hiringCandidate.id);
      throw new Error("Failed to link candidate to application");
    }

    logStep("Application linked to hiring candidate");

    // NOTE: Assessments are automatically created via DB trigger (create_hiring_assessments)
    // when a hiring_candidate is inserted. We only verify they exist.
    const { data: createdAssessments, error: checkAssessmentsError } = await supabase
      .from("hiring_assessments")
      .select("id, test_type")
      .eq("candidate_id", hiringCandidate.id);

    if (checkAssessmentsError) {
      logStep("Error checking assessments", { error: checkAssessmentsError.message });
      throw new Error("Failed to verify assessments");
    }

    if (!createdAssessments || createdAssessments.length === 0) {
      logStep("No assessments found after candidate insert", { hiringCandidateId: hiringCandidate.id });
      throw new Error("Assessments were not created");
    }

    logStep("Assessments verified", { count: createdAssessments.length });

    // Get assessment link
    const assessmentUrl = `https://business.nello.one/assessment/${inviteToken}`;
    const companyName = application.job_postings?.companies?.name || "Empresa";
    const jobTitle = application.job_postings?.title || "Vaga";
    const candidateName = application.full_name || "Candidato";

    // Send email to candidate
    const emailResponse = await resend.emails.send({
      from: "Nello One Business <noreply@nello.one>",
      to: [application.email],
      subject: `Avaliação comportamental - ${companyName}`,
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
              Olá, ${candidateName}! 👋
            </h1>
            
            <p style="color: #6b7280; font-size: 16px; line-height: 1.6;">
              Parabéns! A empresa <strong>${companyName}</strong> está avançando com sua candidatura 
              para a vaga de <strong>${jobTitle}</strong> e gostaria de conhecer melhor seu perfil comportamental.
            </p>
            
            <p style="color: #6b7280; font-size: 16px; line-height: 1.6;">
              Para isso, preparamos uma avaliação rápida que vai nos ajudar a entender como você trabalha e se comunica.
            </p>
            
            <div style="background: #f3f4f6; border-radius: 8px; padding: 20px; margin: 24px 0;">
              <h3 style="color: #374151; font-size: 16px; margin: 0 0 12px;">Sobre a avaliação:</h3>
              <ul style="color: #6b7280; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
                <li>Teste DISC - Perfil comportamental (10-15 min)</li>
                <li>Teste de Temperamentos (10-15 min)</li>
                <li>Sem respostas certas ou erradas</li>
                <li>Resultados instantâneos e confidenciais</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 32px 0;">
              <a href="${assessmentUrl}" style="display: inline-block; background: #2563eb; color: white; font-size: 16px; font-weight: 600; padding: 14px 32px; border-radius: 8px; text-decoration: none;">
                Iniciar Avaliação
              </a>
            </div>
            
            <p style="color: #9ca3af; font-size: 12px; text-align: center;">
              Este link expira em 7 dias. Se você tiver dúvidas, entre em contato com o RH de ${companyName}.
            </p>
          </div>
        </body>
        </html>
      `,
    });

    logStep("Email sent successfully", { emailId: emailResponse.data?.id });

    // Log audit
    await supabase.from("company_audit_logs").insert({
      company_id: companyId,
      actor_id: user.id,
      action: "job_assessment_sent",
      details: { 
        application_id,
        hiring_candidate_id: hiringCandidate.id,
        candidate_email: application.email,
        candidate_name: candidateName,
        job_title: jobTitle
      },
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Avaliação comportamental enviada com sucesso",
        hiring_candidate_id: hiringCandidate.id
      }),
      { 
        status: 200, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    logStep("Error", { error: errorMessage });
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 400, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
  }
});
