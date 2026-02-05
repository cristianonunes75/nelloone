import { createClient } from "npm:@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface ResendRequest {
  candidate_id: string;
}

const logStep = (step: string, details?: Record<string, unknown>) => {
  console.log(`[business-resend-assessment] ${step}`, details ? JSON.stringify(details) : "");
};

Deno.serve(async (req: Request): Promise<Response> => {
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

    const { candidate_id }: ResendRequest = await req.json();

    if (!candidate_id) {
      throw new Error("Missing required field: candidate_id");
    }

    // Get candidate info
    const { data: candidate, error: candidateError } = await supabase
      .from("hiring_candidates")
      .select("*, companies(name, slug)")
      .eq("id", candidate_id)
      .single();

    if (candidateError || !candidate) {
      throw new Error("Candidate not found");
    }

    logStep("Candidate found", { candidateId: candidate.id, email: candidate.email });

    // Verify user is from the same company
    const { data: companyUser, error: cuError } = await supabase
      .from("company_users")
      .select("role, company_id")
      .eq("user_id", user.id)
      .eq("company_id", candidate.company_id)
      .eq("is_active", true)
      .single();

    if (cuError || !companyUser) {
      throw new Error("User is not part of this company");
    }

    if (companyUser.role !== "company_admin" && companyUser.role !== "super_admin") {
      throw new Error("User does not have permission to resend assessments");
    }

    logStep("User authorized", { userRole: companyUser.role });

    // Reset all assessments for this candidate
    const { error: resetError } = await supabase
      .from("hiring_assessments")
      .update({
        status: "pending",
        result_data: null,
        started_at: null,
        completed_at: null,
      })
      .eq("candidate_id", candidate_id);

    if (resetError) {
      logStep("Error resetting assessments", { error: resetError.message });
      throw new Error("Failed to reset assessments");
    }

    logStep("Assessments reset successfully");

    // Delete old answers
    const { data: assessments } = await supabase
      .from("hiring_assessments")
      .select("id")
      .eq("candidate_id", candidate_id);

    if (assessments && assessments.length > 0) {
      const assessmentIds = assessments.map(a => a.id);
      await supabase
        .from("hiring_answers")
        .delete()
        .in("assessment_id", assessmentIds);
      
      logStep("Old answers deleted");
    }

    // Update candidate status back to pending/invited
    await supabase
      .from("hiring_candidates")
      .update({ status: "pending" })
      .eq("id", candidate_id);

    // Generate new expiration date
    const newExpiresAt = new Date();
    newExpiresAt.setDate(newExpiresAt.getDate() + 7); // 7 days

    await supabase
      .from("hiring_candidates")
      .update({ 
        invite_expires_at: newExpiresAt.toISOString(),
        invite_sent_at: new Date().toISOString()
      })
      .eq("id", candidate_id);

    // Get assessment link
    const assessmentUrl = `https://business.nello.one/assessment/${candidate.invite_token}`;
    const companyName = (candidate.companies as any)?.name || "Empresa";

    // Send email to candidate
    const emailResponse = await resend.emails.send({
      from: "Nello One Business <noreply@nello.one>",
      to: [candidate.email],
      subject: `Nova oportunidade de avaliação - ${companyName}`,
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
              Olá, ${candidate.full_name}! 👋
            </h1>
            
            <p style="color: #6b7280; font-size: 16px; line-height: 1.6;">
              A empresa <strong>${companyName}</strong> habilitou novamente sua avaliação comportamental. 
              Você pode refazer os testes clicando no botão abaixo.
            </p>
            
            <div style="background: #f3f4f6; border-radius: 8px; padding: 20px; margin: 24px 0;">
              <h3 style="color: #374151; font-size: 16px; margin: 0 0 12px;">Sobre a avaliação:</h3>
              <ul style="color: #6b7280; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
                <li>Teste DISC - Perfil comportamental (10-15 min)</li>
                <li>Teste de Temperamentos (10-15 min)</li>
                <li>Resultados instantâneos e privados</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 32px 0;">
              <a href="${assessmentUrl}" style="display: inline-block; background: #2563eb; color: white; font-size: 16px; font-weight: 600; padding: 14px 32px; border-radius: 8px; text-decoration: none;">
                Iniciar Avaliação
              </a>
            </div>
            
            <p style="color: #9ca3af; font-size: 12px; text-align: center;">
              Este link expira em 7 dias. Se você tiver dúvidas, entre em contato com o RH da empresa.
            </p>
          </div>
        </body>
        </html>
      `,
    });

    logStep("Email sent successfully", { emailId: emailResponse.data?.id });

    // Log audit
    await supabase.from("company_audit_logs").insert({
      company_id: candidate.company_id,
      actor_id: user.id,
      action: "assessment_resent",
      details: { 
        candidate_id, 
        candidate_email: candidate.email,
        candidate_name: candidate.full_name 
      },
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Avaliação reenviada com sucesso" 
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
