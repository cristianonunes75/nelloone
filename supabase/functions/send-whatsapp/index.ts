import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Twilio credentials - to be configured
const TWILIO_ACCOUNT_SID = Deno.env.get("TWILIO_ACCOUNT_SID");
const TWILIO_AUTH_TOKEN = Deno.env.get("TWILIO_AUTH_TOKEN");
const TWILIO_WHATSAPP_NUMBER = Deno.env.get("TWILIO_WHATSAPP_NUMBER") || "whatsapp:+14155238886";

interface WhatsAppRequest {
  to: string; // Phone number with country code, e.g., "+5511999999999"
  name: string;
  currentTest?: string;
  completedTests?: number;
  customMessage?: string;
  templateType?: "journey_reminder" | "welcome" | "completion";
}

const getMessageTemplate = (type: string, data: Partial<WhatsAppRequest>): string => {
  const { name, currentTest, completedTests, customMessage } = data;
  
  switch (type) {
    case "journey_reminder":
      return customMessage || 
        `Olá, ${name}! 👋\n\n` +
        `Notamos que você está na sua jornada NELLO ONE e ainda tem testes pendentes.\n\n` +
        `📊 Progresso: ${completedTests}/7 testes\n` +
        `📝 Próximo: ${currentTest}\n\n` +
        `Continue sua jornada de autoconhecimento:\n` +
        `👉 https://nello.one/cliente\n\n` +
        `Ao completar todos os testes, você receberá seu Código da Essência! ✨`;
    
    case "welcome":
      return `Bem-vindo ao NELLO ONE, ${name}! 🌟\n\n` +
        `Sua jornada de autoconhecimento começa agora.\n\n` +
        `São 7 testes que revelarão padrões profundos sobre quem você é.\n\n` +
        `Acesse sua conta:\n` +
        `👉 https://nello.one/cliente`;
    
    case "completion":
      return `Parabéns, ${name}! 🎉\n\n` +
        `Você completou toda a jornada NELLO ONE!\n\n` +
        `Seu Código da Essência está disponível.\n\n` +
        `Acesse agora:\n` +
        `👉 https://nello.one/cliente`;
    
    default:
      return customMessage || `Olá, ${name}! Acesse sua conta NELLO ONE: https://nello.one/cliente`;
  }
};

const handler = async (req: Request): Promise<Response> => {
  console.log("send-whatsapp: Request received");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Check if Twilio is configured
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
    console.error("Twilio credentials not configured");
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: "WhatsApp não configurado. Configure as credenciais Twilio (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_NUMBER) nos secrets do projeto.",
        setup_required: true
      }),
      {
        status: 503,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }

  try {
    const { to, name, currentTest, completedTests, customMessage, templateType = "journey_reminder" }: WhatsAppRequest = await req.json();

    // Validate phone number
    if (!to || !to.startsWith("+")) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Número de telefone inválido. Use formato internacional: +5511999999999" 
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const message = getMessageTemplate(templateType, { name, currentTest, completedTests, customMessage });

    console.log(`Sending WhatsApp to ${to}: ${templateType}`);

    // Send via Twilio
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
    
    const formData = new URLSearchParams();
    formData.append("From", TWILIO_WHATSAPP_NUMBER);
    formData.append("To", `whatsapp:${to}`);
    formData.append("Body", message);

    const twilioResponse = await fetch(twilioUrl, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`)}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    const twilioData = await twilioResponse.json();

    if (!twilioResponse.ok) {
      console.error("Twilio error:", twilioData);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: twilioData.message || "Erro ao enviar WhatsApp",
          twilioError: twilioData
        }),
        {
          status: twilioResponse.status,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log("WhatsApp sent successfully:", twilioData.sid);

    return new Response(
      JSON.stringify({ 
        success: true, 
        messageSid: twilioData.sid,
        status: twilioData.status
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Error in send-whatsapp:", error);
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
