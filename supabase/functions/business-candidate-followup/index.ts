import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface FollowupRequest {
  candidate_id: string;
  template_type: "reminder" | "check_problem" | "last_chance" | "custom";
  custom_message?: string;
  custom_subject?: string;
}

const TEMPLATES = {
  reminder: {
    subject: "Lembrete: Sua avaliação comportamental está pendente",
    getBody: (candidateName: string, companyName: string, assessmentUrl: string, position: string | null) => `
      <h1 style="color: #111827; font-size: 24px; margin-bottom: 16px;">
        Olá, ${candidateName}! 👋
      </h1>
      
      <p style="color: #6b7280; font-size: 16px; line-height: 1.6;">
        Notamos que você iniciou a avaliação comportamental ${position ? `para a vaga de <strong>${position}</strong>` : ''} 
        na <strong>${companyName}</strong>, mas ainda não finalizou.
      </p>
      
      <p style="color: #6b7280; font-size: 16px; line-height: 1.6;">
        A avaliação leva apenas <strong>20-25 minutos</strong> e você pode continuar de onde parou.
      </p>
      
      <div style="text-align: center; margin: 32px 0;">
        <a href="${assessmentUrl}" style="display: inline-block; background: #2563eb; color: white; font-size: 16px; font-weight: 600; padding: 14px 32px; border-radius: 8px; text-decoration: none;">
          Continuar Avaliação
        </a>
      </div>
    `,
  },
  check_problem: {
    subject: "Podemos ajudar com sua avaliação?",
    getBody: (candidateName: string, companyName: string, assessmentUrl: string, _position: string | null) => `
      <h1 style="color: #111827; font-size: 24px; margin-bottom: 16px;">
        Olá, ${candidateName}! 👋
      </h1>
      
      <p style="color: #6b7280; font-size: 16px; line-height: 1.6;">
        Notamos que sua avaliação comportamental na <strong>${companyName}</strong> ainda está em andamento.
      </p>
      
      <p style="color: #6b7280; font-size: 16px; line-height: 1.6;">
        Gostaríamos de saber se está enfrentando alguma dificuldade. Estamos aqui para ajudar caso:
      </p>
      
      <ul style="color: #6b7280; font-size: 14px; line-height: 1.8; margin: 16px 0; padding-left: 20px;">
        <li>Tenha alguma dúvida sobre as perguntas</li>
        <li>Encontrou algum problema técnico</li>
        <li>Precisa de mais tempo para completar</li>
      </ul>
      
      <div style="text-align: center; margin: 32px 0;">
        <a href="${assessmentUrl}" style="display: inline-block; background: #2563eb; color: white; font-size: 16px; font-weight: 600; padding: 14px 32px; border-radius: 8px; text-decoration: none;">
          Continuar Avaliação
        </a>
      </div>
      
      <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
        Se preferir, responda este email e entraremos em contato.
      </p>
    `,
  },
  last_chance: {
    subject: "Última chance: Finalize sua avaliação",
    getBody: (candidateName: string, companyName: string, assessmentUrl: string, position: string | null) => `
      <h1 style="color: #111827; font-size: 24px; margin-bottom: 16px;">
        ${candidateName}, não perca essa oportunidade! ⏰
      </h1>
      
      <p style="color: #6b7280; font-size: 16px; line-height: 1.6;">
        Sua avaliação comportamental ${position ? `para a vaga de <strong>${position}</strong>` : ''} 
        na <strong>${companyName}</strong> está próxima de expirar.
      </p>
      
      <p style="color: #6b7280; font-size: 16px; line-height: 1.6;">
        Esta é uma <strong>etapa importante</strong> do processo seletivo. Complete agora para garantir sua participação!
      </p>
      
      <div style="text-align: center; margin: 32px 0;">
        <a href="${assessmentUrl}" style="display: inline-block; background: #dc2626; color: white; font-size: 16px; font-weight: 600; padding: 14px 32px; border-radius: 8px; text-decoration: none;">
          Finalizar Agora
        </a>
      </div>
    `,
  },
};

const logStep = (step: string, details?: Record<string, unknown>) => {
  console.log(`[business-candidate-followup] ${step}`, details ? JSON.stringify(details) : "");
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

    const { candidate_id, template_type, custom_message, custom_subject }: FollowupRequest = await req.json();

    if (!candidate_id || !template_type) {
      throw new Error("Missing required fields: candidate_id and template_type");
    }

    // Get candidate info with company and assessments
    const { data: candidate, error: candidateError } = await supabase
      .from("hiring_candidates")
      .select("*, companies(name, slug)")
      .eq("id", candidate_id)
      .single();

    if (candidateError || !candidate) {
      throw new Error("Candidate not found");
    }

    logStep("Candidate found", { candidateId: candidate.id, email: candidate.email });

    // Verify user is from the same company with proper role
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

    if (!["company_admin", "super_admin", "hr_manager"].includes(companyUser.role)) {
      throw new Error("User does not have permission to send follow-ups");
    }

    logStep("User authorized", { userRole: companyUser.role });

    // Check if candidate has incomplete assessments
    const { data: assessments } = await supabase
      .from("hiring_assessments")
      .select("id, test_type, status")
      .eq("candidate_id", candidate_id);

    const incompleteAssessments = assessments?.filter(a => a.status !== "completed") || [];
    
    if (incompleteAssessments.length === 0) {
      throw new Error("Candidate has already completed all assessments");
    }

    logStep("Incomplete assessments found", { count: incompleteAssessments.length });

    // Build email content
    const assessmentUrl = `https://business.nello.one/assessment/${candidate.invite_token}`;
    const companyName = (candidate.companies as any)?.name || "Empresa";
    
    let subject: string;
    let bodyContent: string;

    if (template_type === "custom") {
      if (!custom_subject || !custom_message) {
        throw new Error("Custom template requires custom_subject and custom_message");
      }
      subject = custom_subject;
      bodyContent = `
        <h1 style="color: #111827; font-size: 24px; margin-bottom: 16px;">
          Olá, ${candidate.full_name}! 👋
        </h1>
        
        <div style="color: #6b7280; font-size: 16px; line-height: 1.6; white-space: pre-wrap;">
          ${custom_message}
        </div>
        
        <div style="text-align: center; margin: 32px 0;">
          <a href="${assessmentUrl}" style="display: inline-block; background: #2563eb; color: white; font-size: 16px; font-weight: 600; padding: 14px 32px; border-radius: 8px; text-decoration: none;">
            Continuar Avaliação
          </a>
        </div>
      `;
    } else {
      const template = TEMPLATES[template_type];
      subject = template.subject;
      bodyContent = template.getBody(candidate.full_name, companyName, assessmentUrl, candidate.position_applied);
    }

    // Send email
    const emailResponse = await resend.emails.send({
      from: "Nello One Business <noreply@nello.one>",
      to: [candidate.email],
      subject: subject,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f9fafb; padding: 40px 20px;">
          <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; padding: 40px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            ${bodyContent}
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;" />
            
            <p style="color: #9ca3af; font-size: 12px; text-align: center;">
              Este email foi enviado pela equipe de recrutamento da ${companyName}.
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
      action: "candidate_followup_sent",
      details: { 
        candidate_id, 
        candidate_email: candidate.email,
        candidate_name: candidate.full_name,
        template_type,
        incomplete_tests: incompleteAssessments.map(a => a.test_type),
      },
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Follow-up enviado com sucesso" 
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
