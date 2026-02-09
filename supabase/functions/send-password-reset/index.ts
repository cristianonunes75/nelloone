import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface PasswordResetRequest {
  email: string;
  redirectUrl: string;
  language?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, redirectUrl, language }: PasswordResetRequest = await req.json();

    if (!email || !redirectUrl) {
      throw new Error("Missing required fields: email and redirectUrl");
    }

    // Create admin client to generate recovery link
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: "recovery",
      email,
      options: {
        redirectTo: redirectUrl,
      },
    });

    if (linkError) {
      console.error("Error generating recovery link:", linkError);
      // Don't reveal whether the user exists - return success either way
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Build the recovery URL from the returned properties
    const token = linkData.properties?.hashed_token;
    const recoveryUrl = `${Deno.env.get("SUPABASE_URL")}/auth/v1/verify?token=${token}&type=recovery&redirect_to=${encodeURIComponent(redirectUrl)}`;

    const lang = language || "pt";

    const subject = lang === "en"
      ? "Reset your password - NELLO ONE"
      : "Redefinir sua senha - NELLO ONE";

    const buttonText = lang === "en" ? "Reset Password" : "Redefinir Senha";
    const greeting = lang === "en" ? "Hello!" : "Olá!";
    const bodyText = lang === "en"
      ? "You requested to reset your password. Click the button below to create a new password:"
      : "Você solicitou a redefinição da sua senha. Clique no botão abaixo para criar uma nova senha:";
    const ignoreText = lang === "en"
      ? "If you didn't request this, you can safely ignore this email."
      : "Se você não solicitou isso, pode ignorar este email com segurança.";
    const expiresText = lang === "en"
      ? "This link expires in 24 hours."
      : "Este link expira em 24 horas.";

    const html = `
      <div style="font-family: Inter, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #FCFCFC;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #1A1A1A; font-size: 28px; margin: 0;">NELLO ONE</h1>
          <p style="color: #666; font-size: 14px; margin-top: 8px;">O caminho começa dentro.</p>
        </div>
        
        <div style="background: white; border-radius: 12px; padding: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          <h2 style="color: #1A1A1A; font-size: 22px; margin: 0 0 16px;">${greeting}</h2>
          <p style="color: #444; font-size: 16px; line-height: 1.6;">
            ${bodyText}
          </p>
          
          <div style="text-align: center; margin: 32px 0;">
            <a href="${recoveryUrl}" 
               style="display: inline-block; background: #1F2E4B; color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px; font-weight: 500;">
              ${buttonText}
            </a>
          </div>
          
          <p style="color: #888; font-size: 14px; line-height: 1.6;">
            ${ignoreText}
          </p>
          <p style="color: #888; font-size: 14px; line-height: 1.6;">
            ${expiresText}
          </p>
        </div>
        
        <p style="color: #999; font-size: 12px; text-align: center; margin-top: 32px;">
          © 2025 NELLO ONE. Todos os direitos reservados.
        </p>
      </div>
    `;

    const emailResponse = await resend.emails.send({
      from: "NELLO ONE <noreply@nello.one>",
      to: [email],
      subject,
      html,
    });

    console.log("Password reset email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-password-reset function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
