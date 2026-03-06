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

    const origin = req.headers.get("origin") || "https://identity.nello.one";
    const checkoutUrl = `${origin}/leitura-inicial`;

    logStep("Sending lead email", { email, name, archetypeName });

    const firstName = name.split(" ")[0];

    const htmlContent = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f9f9f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;padding:40px 20px;">

    <tr><td style="text-align:center;padding-bottom:32px;">
      <p style="font-size:11px;font-weight:600;letter-spacing:0.15em;color:#999;text-transform:uppercase;margin:0;">Nello Identity</p>
    </td></tr>

    <tr><td style="background:#fff;border-radius:12px;padding:36px 32px;margin-bottom:24px;">
      <p style="font-size:17px;color:#1a1a1a;margin:0 0 16px;font-weight:500;">
        ${firstName}, sua leitura ficou salva aqui.
      </p>

      <div style="background:#f5f3ee;border-radius:8px;padding:16px 20px;margin:0 0 20px;">
        <p style="font-size:11px;color:#999;margin:0 0 4px;text-transform:uppercase;letter-spacing:0.1em;">Sua Leitura Inicial</p>
        <p style="font-size:20px;font-weight:700;color:#1a1a1a;margin:0;">${archetypeName || 'Padrão Identificado'}</p>
      </div>

      <p style="font-size:15px;color:#555;line-height:1.7;margin:0 0 16px;">
        Essa é a primeira camada do seu funcionamento. Ela revela como você age, decide e se relaciona — mas é só o começo.
      </p>
      <p style="font-size:15px;color:#555;line-height:1.7;margin:0 0 24px;">
        A <strong>Jornada Identity — Código da Essência</strong> vai mais fundo: padrões emocionais, conflitos internos e o que move você por dentro. Tudo integrado numa leitura que vai fazer sentido de um jeito que nenhuma outra fez.
      </p>

      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="background:#1a1a1a;border-radius:8px;text-align:center;padding:16px 24px;">
            <a href="${checkoutUrl}" style="color:#fff;font-size:15px;font-weight:600;text-decoration:none;display:block;">
              Desbloquear minha leitura completa — R$&nbsp;99
            </a>
          </td>
        </tr>
      </table>

      <p style="font-size:12px;color:#aaa;text-align:center;margin:16px 0 0;">
        Pagamento único. Sem assinatura.
      </p>
    </td></tr>

    <tr><td style="padding:24px 0 0;">
      <p style="font-size:12px;color:#bbb;text-align:center;margin:0;">
        Você recebeu este email porque realizou a Leitura Inicial no Nello Identity.<br>
        <a href="${origin}/ajuda" style="color:#bbb;">Central de Ajuda</a>
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
        from: "Nello Identity <noreply@nello.one>",
        to: [email],
        subject: `${firstName}, sua leitura ficou salva — e tem mais esperando`,
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
