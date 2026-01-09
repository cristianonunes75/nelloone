import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EngagementEmailRequest {
  to: string;
  name: string;
  subject: string;
  greeting: string;
  body: string;
  cta: string;
  ctaUrl: string;
  couponCode?: string;
}

const generateEmailHtml = (data: EngagementEmailRequest): string => {
  const couponSection = data.couponCode ? `
    <div style="background: linear-gradient(135deg, #f5f0e6 0%, #e8dcc8 100%); border-radius: 12px; padding: 20px; margin: 24px 0; text-align: center; border: 2px dashed #c9a96e;">
      <p style="margin: 0 0 8px 0; font-size: 14px; color: #666;">Use o código:</p>
      <p style="margin: 0; font-size: 28px; font-weight: bold; color: #1a1a1a; letter-spacing: 3px;">${data.couponCode}</p>
    </div>
  ` : '';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f0e6; font-family: 'Georgia', serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f0e6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 300; letter-spacing: 4px;">NELLO ONE</h1>
              <p style="margin: 8px 0 0 0; color: #c9a96e; font-size: 12px; letter-spacing: 2px;">AUTOCONHECIMENTO COM PROPÓSITO</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 48px 40px;">
              <p style="margin: 0 0 24px 0; font-size: 20px; color: #1a1a1a; line-height: 1.4;">
                ${data.greeting}
              </p>
              
              <div style="font-size: 16px; color: #444; line-height: 1.8;">
                ${data.body.split('\n').map(p => `<p style="margin: 0 0 16px 0;">${p}</p>`).join('')}
              </div>
              
              ${couponSection}
              
              <!-- CTA Button -->
              <div style="text-align: center; margin: 32px 0;">
                <a href="${data.ctaUrl}" style="display: inline-block; background: linear-gradient(135deg, #c9a96e 0%, #b8956a 100%); color: #ffffff; text-decoration: none; padding: 16px 48px; border-radius: 8px; font-size: 16px; font-weight: 600; letter-spacing: 1px; box-shadow: 0 4px 16px rgba(201, 169, 110, 0.3);">
                  ${data.cta}
                </a>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f6f1; padding: 32px 40px; text-align: center; border-top: 1px solid #e8e0d0;">
              <p style="margin: 0 0 8px 0; font-size: 14px; color: #666;">
                Com carinho,<br>
                <strong style="color: #1a1a1a;">Nello</strong> — seu guia de autoconhecimento
              </p>
              <p style="margin: 16px 0 0 0; font-size: 12px; color: #999;">
                NELLO ONE | nello.one
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const data: EngagementEmailRequest = await req.json();
    
    console.log("Sending engagement email to:", data.to);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "NELLO ONE <nello@nello.one>",
        to: [data.to],
        subject: data.subject,
        html: generateEmailHtml(data),
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Resend API error:", res.status, errorText);
      throw new Error(`Resend API error: ${res.status}`);
    }

    const emailResponse = await res.json();
    console.log("Engagement email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error sending engagement email:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
