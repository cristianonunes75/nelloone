import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: Record<string, unknown>) => {
  console.log(`[SEND-LEAD-EMAIL] ${step}`, details ? JSON.stringify(details) : '');
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name, archetypeName, leadId } = await req.json();

    if (!email || !name) {
      throw new Error("Email and name are required");
    }

    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) {
      logStep("RESEND_API_KEY not configured, skipping email");
      return new Response(JSON.stringify({ skipped: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const origin = req.headers.get("origin") || "https://nelloone.lovable.app";
    const journeyUrl = `${origin}/codigo-inicial`;

    logStep("Sending lead email", { email, name, archetypeName });

    const htmlContent = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;padding:40px 20px;">
    <tr><td style="text-align:center;padding-bottom:32px;">
      <h1 style="font-size:24px;font-weight:700;color:#1a1a1a;margin:0;">NELLO ONE</h1>
    </td></tr>
    <tr><td style="padding-bottom:24px;">
      <p style="font-size:18px;color:#1a1a1a;margin:0 0 8px;">Olá, ${name}.</p>
      <p style="font-size:16px;color:#444;line-height:1.6;margin:0;">
        Seu Código Inicial foi revelado: <strong>${archetypeName || 'seu arquétipo único'}</strong>.
      </p>
    </td></tr>
    <tr><td style="padding-bottom:24px;">
      <p style="font-size:15px;color:#666;line-height:1.6;margin:0;">
        Essa é a primeira camada da sua leitura de identidade. 
        O que você viu até agora mostra a direção do seu funcionamento natural — 
        mas existe mais profundidade esperando para ser revelada.
      </p>
    </td></tr>
    <tr><td style="text-align:center;padding-bottom:32px;">
      <a href="${journeyUrl}" style="display:inline-block;background-color:#1a1a1a;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;padding:14px 32px;border-radius:8px;">
        Continuar minha jornada
      </a>
    </td></tr>
    <tr><td style="border-top:1px solid #eee;padding-top:20px;">
      <p style="font-size:12px;color:#999;text-align:center;margin:0;">
        Você recebeu este email porque realizou o Código Inicial no Nello One.
      </p>
    </td></tr>
  </table>
</body>
</html>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from: "Nello One <noreply@nello.one>",
        to: [email],
        subject: "Seu Código foi revelado",
        html: htmlContent,
      }),
    });

    const result = await res.json();
    logStep("Email sent", { status: res.status, result });

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
