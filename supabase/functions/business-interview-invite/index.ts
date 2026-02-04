import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface InterviewInviteRequest {
  candidate_id: string;
  template_type: "standard" | "custom";
  interview_date: string;
  interview_time: string;
  interview_location?: string;
  custom_subject?: string;
  custom_message?: string;
}

const logStep = (step: string, details?: Record<string, unknown>) => {
  console.log(`[business-interview-invite] ${step}`, details ? JSON.stringify(details) : "");
};

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
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

    const body: InterviewInviteRequest = await req.json();
    const { 
      candidate_id, 
      template_type, 
      interview_date, 
      interview_time, 
      interview_location,
      custom_subject,
      custom_message 
    } = body;

    if (!candidate_id || !template_type || !interview_date || !interview_time) {
      throw new Error("Missing required fields: candidate_id, template_type, interview_date, interview_time");
    }

    // Get candidate info with company
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
      throw new Error("User does not have permission to send interview invites");
    }

    logStep("User authorized", { userRole: companyUser.role });

    // Build email content
    const companyName = (candidate.companies as any)?.name || "Empresa";
    const formattedDate = formatDate(interview_date);
    const position = candidate.position_applied || "a vaga";

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
      `;
    } else {
      subject = `Convite para Entrevista - ${companyName}`;
      bodyContent = `
        <h1 style="color: #111827; font-size: 24px; margin-bottom: 16px;">
          Olá, ${candidate.full_name}! 🎉
        </h1>
        
        <p style="color: #6b7280; font-size: 16px; line-height: 1.6;">
          Temos o prazer de informar que você foi selecionado(a) para a próxima etapa do processo seletivo 
          para <strong>${position}</strong> na <strong>${companyName}</strong>.
        </p>
        
        <p style="color: #6b7280; font-size: 16px; line-height: 1.6;">
          Gostaríamos de convidá-lo(a) para uma entrevista, conforme os detalhes abaixo:
        </p>
      `;
    }

    // Add interview details block
    const interviewDetailsBlock = `
      <div style="background: #f3f4f6; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h3 style="color: #374151; font-size: 16px; margin: 0 0 16px;">📅 Detalhes da Entrevista</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="color: #6b7280; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
              <strong>Data:</strong>
            </td>
            <td style="color: #111827; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
              ${formattedDate}
            </td>
          </tr>
          <tr>
            <td style="color: #6b7280; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
              <strong>Horário:</strong>
            </td>
            <td style="color: #111827; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
              ${interview_time}
            </td>
          </tr>
          ${interview_location ? `
          <tr>
            <td style="color: #6b7280; font-size: 14px; padding: 8px 0;">
              <strong>Local:</strong>
            </td>
            <td style="color: #111827; font-size: 14px; padding: 8px 0;">
              ${interview_location.startsWith('http') 
                ? `<a href="${interview_location}" style="color: #2563eb;">${interview_location}</a>` 
                : interview_location}
            </td>
          </tr>
          ` : ''}
        </table>
      </div>
      
      <p style="color: #6b7280; font-size: 16px; line-height: 1.6;">
        Por favor, confirme sua disponibilidade respondendo a este email.
      </p>
      
      <p style="color: #6b7280; font-size: 16px; line-height: 1.6;">
        Caso tenha algum imprevisto, entre em contato conosco o mais breve possível para reagendarmos.
      </p>
      
      <p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin-top: 24px;">
        Estamos ansiosos para conhecê-lo(a)!
      </p>
      
      <p style="color: #6b7280; font-size: 16px; line-height: 1.6;">
        Atenciosamente,<br/>
        <strong>Equipe de Recrutamento</strong><br/>
        ${companyName}
      </p>
    `;

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
            ${interviewDetailsBlock}
            
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

    // Update candidate with interview invite info
    const interviewDateTime = new Date(`${interview_date}T${interview_time}`);
    await supabase
      .from("hiring_candidates")
      .update({ 
        interview_invite_sent_at: new Date().toISOString(),
        interview_scheduled_at: interviewDateTime.toISOString(),
      })
      .eq("id", candidate_id);

    // Log audit
    await supabase.from("company_audit_logs").insert({
      company_id: candidate.company_id,
      actor_id: user.id,
      action: "interview_invite_sent",
      details: { 
        candidate_id, 
        candidate_email: candidate.email,
        candidate_name: candidate.full_name,
        interview_date,
        interview_time,
        interview_location: interview_location || null,
        template_type,
      },
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Convite para entrevista enviado com sucesso" 
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
