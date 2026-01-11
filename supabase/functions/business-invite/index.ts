import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InviteRequest {
  email: string;
  role: "company_admin" | "collaborator";
  company_id: string;
  import_requested?: boolean;
}

const logStep = (step: string, details?: Record<string, unknown>) => {
  console.log(`[business-invite] ${step}`, details ? JSON.stringify(details) : "");
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

    const { email, role, company_id, import_requested }: InviteRequest = await req.json();

    if (!email || !role || !company_id) {
      throw new Error("Missing required fields: email, role, company_id");
    }

    logStep("Processing invite request", { email, role, company_id, import_requested });

    logStep("Processing invite request", { email, role, company_id });

    // Verify user is company admin
    const { data: companyUser, error: cuError } = await supabase
      .from("company_users")
      .select("role, company_id")
      .eq("user_id", user.id)
      .eq("company_id", company_id)
      .eq("is_active", true)
      .single();

    if (cuError || !companyUser) {
      throw new Error("User is not part of this company");
    }

    if (companyUser.role !== "company_admin" && companyUser.role !== "super_admin") {
      throw new Error("User does not have permission to invite");
    }

    logStep("User authorized to invite", { userRole: companyUser.role });

    // Get company info
    const { data: company, error: companyError } = await supabase
      .from("companies")
      .select("name, slug")
      .eq("id", company_id)
      .single();

    if (companyError || !company) {
      throw new Error("Company not found");
    }

    // Check if invite already exists
    const { data: existingInvite } = await supabase
      .from("company_invites")
      .select("id, status")
      .eq("email", email.toLowerCase())
      .eq("company_id", company_id)
      .eq("status", "pending")
      .maybeSingle();

    if (existingInvite) {
      throw new Error("An active invite already exists for this email");
    }

    // Generate invite token
    const inviteToken = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiration

    // Create invite record
    const { data: invite, error: inviteError } = await supabase
      .from("company_invites")
      .insert({
        company_id,
        email: email.toLowerCase(),
        role,
        invite_token: inviteToken,
        invited_by: user.id,
        expires_at: expiresAt.toISOString(),
        status: "pending",
        import_requested: import_requested || false,
      })
      .select()
      .single();

    if (inviteError) {
      logStep("Error creating invite", { error: inviteError.message });
      throw new Error("Failed to create invite");
    }

    logStep("Invite created", { inviteId: invite.id });

    // Send invite email
    const inviteUrl = `https://business.nello.one/invite/${inviteToken}`;
    
    const roleText = role === "company_admin" ? "administrador" : "colaborador";
    
    const emailResponse = await resend.emails.send({
      from: "Nello One Business <noreply@nello.one>",
      to: [email],
      subject: `Convite para ${company.name} - Nello One Business`,
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
              Você foi convidado para participar do Nello One Business
            </h1>
            
            <p style="color: #6b7280; font-size: 16px; line-height: 1.6;">
              A empresa <strong>${company.name}</strong> está convidando você para participar como <strong>${roleText}</strong> na jornada de autoconhecimento empresarial.
            </p>
            
            <div style="background: #f3f4f6; border-radius: 8px; padding: 20px; margin: 24px 0;">
              <h3 style="color: #374151; font-size: 16px; margin: 0 0 12px;">O que você vai encontrar:</h3>
              <ul style="color: #6b7280; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
                <li>Testes de autoconhecimento validados</li>
                <li>Relatório pessoal completo e privado</li>
                <li>Insights para desenvolvimento profissional</li>
                <li>Ferramenta de crescimento pessoal e de equipe</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 32px 0;">
              <a href="${inviteUrl}" style="display: inline-block; background: #2563eb; color: white; font-size: 16px; font-weight: 600; padding: 14px 32px; border-radius: 8px; text-decoration: none;">
                Aceitar Convite
              </a>
            </div>
            
            <p style="color: #9ca3af; font-size: 12px; text-align: center;">
              Este convite expira em 7 dias. Se você não reconhece este convite, pode ignorar este email.
            </p>
          </div>
        </body>
        </html>
      `,
    });

    logStep("Email sent successfully");

    // Update invite with sent timestamp
    await supabase
      .from("company_invites")
      .update({ sent_at: new Date().toISOString() })
      .eq("id", invite.id);

    // Log audit
    await supabase.from("company_audit_logs").insert({
      company_id,
      actor_id: user.id,
      action: "invite_sent",
      details: { email, role, invite_id: invite.id },
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        invite_id: invite.id,
        message: "Convite enviado com sucesso" 
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
