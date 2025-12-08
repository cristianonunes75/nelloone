import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SendPDFRequest {
  to: string;
  name: string;
  testName: string;
  testType: string;
  pdfBase64: string;
  language?: string;
}

const getEmailContent = (name: string, testName: string, lang: string) => {
  const templates: Record<string, { subject: string; html: string }> = {
    pt: {
      subject: `Seu Relatório Premium: ${testName} - NELLO ONE`,
      html: `
        <div style="font-family: Inter, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #FCFCFC;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="color: #1A1A1A; font-size: 28px; margin: 0;">NELLO ONE</h1>
            <p style="color: #666; font-size: 14px; margin-top: 8px;">O caminho começa dentro.</p>
          </div>
          
          <div style="background: white; border-radius: 12px; padding: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
            <h2 style="color: #1A1A1A; font-size: 22px; margin: 0 0 16px;">Olá, ${name}!</h2>
            <p style="color: #444; font-size: 16px; line-height: 1.6;">
              Aqui está seu <strong>Relatório Premium</strong> do teste <strong>${testName}</strong>. 📄
            </p>
            
            <div style="background: linear-gradient(135deg, #1F2E4B 0%, #2F3A57 100%); border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center;">
              <p style="color: #CDAE67; font-size: 14px; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 1px;">Anexo</p>
              <p style="color: white; font-size: 20px; font-weight: 600; margin: 0;">Relatório Premium ${testName}</p>
            </div>
            
            <p style="color: #444; font-size: 16px; line-height: 1.6;">
              Este relatório contém análises profundas sobre seu perfil, incluindo:
            </p>
            
            <ul style="color: #444; font-size: 15px; padding-left: 20px; line-height: 1.8;">
              <li>Descrição detalhada do seu resultado</li>
              <li>Pontos de luz e sombra</li>
              <li>Impacto nas três dimensões da vida</li>
              <li>Análise do Miguel</li>
              <li>Plano de evolução de 7 dias</li>
            </ul>
            
            <p style="color: #666; font-size: 14px; line-height: 1.6; margin-top: 24px;">
              O PDF está anexado a este email. Você também pode baixá-lo novamente na sua área de cliente.
            </p>
            
            <a href="https://nello.one/cliente" 
               style="display: inline-block; background: #1F2E4B; color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px; font-weight: 500; margin-top: 16px;">
              Acessar Minha Conta
            </a>
          </div>
          
          <p style="color: #999; font-size: 12px; text-align: center; margin-top: 32px;">
            © 2025 NELLO ONE. Todos os direitos reservados.
          </p>
        </div>
      `,
    },
    en: {
      subject: `Your Premium Report: ${testName} - NELLO ONE`,
      html: `
        <div style="font-family: Inter, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #FCFCFC;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="color: #1A1A1A; font-size: 28px; margin: 0;">NELLO ONE</h1>
            <p style="color: #666; font-size: 14px; margin-top: 8px;">The path begins within.</p>
          </div>
          
          <div style="background: white; border-radius: 12px; padding: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
            <h2 style="color: #1A1A1A; font-size: 22px; margin: 0 0 16px;">Hello, ${name}!</h2>
            <p style="color: #444; font-size: 16px; line-height: 1.6;">
              Here is your <strong>Premium Report</strong> for the <strong>${testName}</strong> test. 📄
            </p>
            
            <div style="background: linear-gradient(135deg, #1F2E4B 0%, #2F3A57 100%); border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center;">
              <p style="color: #CDAE67; font-size: 14px; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 1px;">Attachment</p>
              <p style="color: white; font-size: 20px; font-weight: 600; margin: 0;">${testName} Premium Report</p>
            </div>
            
            <p style="color: #444; font-size: 16px; line-height: 1.6;">
              This report contains deep analysis about your profile, including:
            </p>
            
            <ul style="color: #444; font-size: 15px; padding-left: 20px; line-height: 1.8;">
              <li>Detailed description of your result</li>
              <li>Light and shadow points</li>
              <li>Impact on three life dimensions</li>
              <li>Miguel's analysis</li>
              <li>7-day evolution plan</li>
            </ul>
            
            <p style="color: #666; font-size: 14px; line-height: 1.6; margin-top: 24px;">
              The PDF is attached to this email. You can also download it again from your client area.
            </p>
            
            <a href="https://nello.one/en/cliente" 
               style="display: inline-block; background: #1F2E4B; color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px; font-weight: 500; margin-top: 16px;">
              Access My Account
            </a>
          </div>
          
          <p style="color: #999; font-size: 12px; text-align: center; margin-top: 32px;">
            © 2025 NELLO ONE. All rights reserved.
          </p>
        </div>
      `,
    },
    "pt-pt": {
      subject: `O teu Relatório Premium: ${testName} - NELLO ONE`,
      html: `
        <div style="font-family: Inter, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #FCFCFC;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="color: #1A1A1A; font-size: 28px; margin: 0;">NELLO ONE</h1>
            <p style="color: #666; font-size: 14px; margin-top: 8px;">O caminho começa dentro.</p>
          </div>
          
          <div style="background: white; border-radius: 12px; padding: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
            <h2 style="color: #1A1A1A; font-size: 22px; margin: 0 0 16px;">Olá, ${name}!</h2>
            <p style="color: #444; font-size: 16px; line-height: 1.6;">
              Aqui está o teu <strong>Relatório Premium</strong> do teste <strong>${testName}</strong>. 📄
            </p>
            
            <div style="background: linear-gradient(135deg, #1F2E4B 0%, #2F3A57 100%); border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center;">
              <p style="color: #CDAE67; font-size: 14px; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 1px;">Anexo</p>
              <p style="color: white; font-size: 20px; font-weight: 600; margin: 0;">Relatório Premium ${testName}</p>
            </div>
            
            <p style="color: #444; font-size: 16px; line-height: 1.6;">
              Este relatório contém análises profundas sobre o teu perfil, incluindo:
            </p>
            
            <ul style="color: #444; font-size: 15px; padding-left: 20px; line-height: 1.8;">
              <li>Descrição detalhada do teu resultado</li>
              <li>Pontos de luz e sombra</li>
              <li>Impacto nas três dimensões da vida</li>
              <li>Análise do Miguel</li>
              <li>Plano de evolução de 7 dias</li>
            </ul>
            
            <p style="color: #666; font-size: 14px; line-height: 1.6; margin-top: 24px;">
              O PDF está anexado a este email. Também podes descarregá-lo novamente na tua área de cliente.
            </p>
            
            <a href="https://nello.one/pt-pt/cliente" 
               style="display: inline-block; background: #1F2E4B; color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px; font-weight: 500; margin-top: 16px;">
              Aceder à Minha Conta
            </a>
          </div>
          
          <p style="color: #999; font-size: 12px; text-align: center; margin-top: 32px;">
            © 2025 NELLO ONE. Todos os direitos reservados.
          </p>
        </div>
      `,
    },
  };

  return templates[lang] || templates.pt;
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, name, testName, testType, pdfBase64, language }: SendPDFRequest = await req.json();
    const lang = language || "pt";

    console.log("[SEND-PDF-EMAIL] Processing request", { to, testName, testType, language: lang });

    if (!to || !pdfBase64 || !testName) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: to, pdfBase64, testName" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const emailContent = getEmailContent(name || "Usuário", testName, lang);
    const fileName = `NELLO_ONE_${testType || "report"}_${name?.replace(/\s+/g, "_") || "user"}.pdf`;

    const emailResponse = await resend.emails.send({
      from: "NELLO ONE <noreply@nello.one>",
      to: [to],
      subject: emailContent.subject,
      html: emailContent.html,
      attachments: [
        {
          filename: fileName,
          content: pdfBase64,
        },
      ],
    });

    console.log("[SEND-PDF-EMAIL] Email with PDF sent successfully", { to, testName, response: emailResponse });

    return new Response(JSON.stringify({ success: true, ...emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("[SEND-PDF-EMAIL] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
