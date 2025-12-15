import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ReminderRequest {
  userId: string;
  email: string;
  name: string;
  currentTest: string;
  completedTests: number;
  customMessage?: string;
  type: "email" | "whatsapp";
}

const handler = async (req: Request): Promise<Response> => {
  console.log("send-journey-reminder: Request received");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, email, name, currentTest, completedTests, customMessage, type }: ReminderRequest = await req.json();

    console.log(`Sending ${type} reminder to ${email} for user ${userId}`);

    if (type === "email") {
      const testsRemaining = 7 - completedTests;
      const progressPercent = Math.round((completedTests / 7) * 100);

      const emailHtml = `
        <div style="font-family: Inter, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #FCFCFC;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="color: #1A1A1A; font-size: 28px; margin: 0;">NELLO ONE</h1>
            <p style="color: #666; font-size: 14px; margin-top: 8px;">O caminho começa dentro.</p>
          </div>
          
          <div style="background: white; border-radius: 12px; padding: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
            <h2 style="color: #1A1A1A; font-size: 22px; margin: 0 0 16px;">
              Olá, ${name}! 👋
            </h2>
            
            <p style="color: #444; font-size: 16px; line-height: 1.6;">
              Notamos que você começou sua jornada de autoconhecimento, mas ainda não terminou.
              Você está a apenas <strong>${testsRemaining} ${testsRemaining === 1 ? 'teste' : 'testes'}</strong> de completar sua jornada!
            </p>

            ${customMessage ? `
              <div style="background: #F0F9FF; border-left: 4px solid #1F2E4B; padding: 16px; margin: 24px 0; border-radius: 0 8px 8px 0;">
                <p style="color: #444; font-size: 15px; margin: 0; font-style: italic;">
                  "${customMessage}"
                </p>
              </div>
            ` : ''}
            
            <div style="background: #F8F9FA; border-radius: 8px; padding: 20px; margin: 24px 0;">
              <p style="color: #666; font-size: 14px; margin: 0 0 12px;">Seu progresso atual:</p>
              
              <div style="background: #E5E7EB; border-radius: 999px; height: 12px; overflow: hidden;">
                <div style="background: linear-gradient(90deg, #1F2E4B 0%, #2F3A57 100%); height: 100%; width: ${progressPercent}%; border-radius: 999px;"></div>
              </div>
              
              <p style="color: #1A1A1A; font-size: 16px; font-weight: 600; margin: 12px 0 0;">
                ${completedTests}/7 testes completos (${progressPercent}%)
              </p>
              
              <p style="color: #666; font-size: 14px; margin: 8px 0 0;">
                Próximo teste: <strong>${currentTest}</strong>
              </p>
            </div>
            
            <p style="color: #444; font-size: 16px; line-height: 1.6;">
              Ao completar todos os 7 testes, você receberá seu <strong>Código da Essência</strong> — 
              um relatório integrado com insights profundos sobre quem você é.
            </p>
            
            <a href="https://nello.one/cliente" 
               style="display: inline-block; background: #1F2E4B; color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-size: 16px; font-weight: 500; margin-top: 20px;">
              Continuar Minha Jornada →
            </a>
            
            <p style="color: #999; font-size: 13px; margin-top: 24px; line-height: 1.5;">
              Este é um lembrete gentil. Se você precisar de ajuda ou tiver dúvidas, 
              responda este email que teremos prazer em ajudar.
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
        subject: `${name}, continue sua jornada de autoconhecimento 🌟`,
        html: emailHtml,
      });

      console.log("Email sent successfully:", emailResponse);

      return new Response(
        JSON.stringify({ success: true, type: "email", response: emailResponse }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // WhatsApp will be handled by send-whatsapp function
    return new Response(
      JSON.stringify({ success: false, error: "Use send-whatsapp function for WhatsApp messages" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Error in send-journey-reminder:", error);
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
