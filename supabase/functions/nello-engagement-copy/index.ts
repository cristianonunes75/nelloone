import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EngagementRequest {
  objective: "welcome" | "reactivation" | "discount" | "urgency" | "testimonial" | "custom";
  userName: string;
  daysSinceRegistration: number;
  couponCode?: string;
  couponDiscount?: number;
  discountType?: "percent" | "fixed";
  customPrompt?: string;
  language?: "pt" | "en";
}

const objectivePrompts = {
  pt: {
    welcome: "Dar boas-vindas calorosas e mostrar o valor do autoconhecimento. Tom acolhedor e empático.",
    reactivation: "Reativar gentilmente alguém que se cadastrou mas não começou. Tom curioso e gentil, sem pressão.",
    discount: "Apresentar uma oferta especial com desconto. Destacar o valor, criar senso de oportunidade sem ser agressivo.",
    urgency: "Criar senso de urgência sutil sobre vagas/tempo limitado. Usar escassez de forma ética.",
    testimonial: "Compartilhar uma história inspiradora de transformação através do autoconhecimento.",
    custom: "Seguir as instruções específicas do admin."
  },
  en: {
    welcome: "Give a warm welcome and show the value of self-knowledge. Welcoming and empathetic tone.",
    reactivation: "Gently reactivate someone who registered but didn't start. Curious and gentle tone, no pressure.",
    discount: "Present a special discount offer. Highlight value, create opportunity sense without being aggressive.",
    urgency: "Create subtle urgency about limited spots/time. Use scarcity ethically.",
    testimonial: "Share an inspiring transformation story through self-knowledge.",
    custom: "Follow admin's specific instructions."
  }
};

const systemPrompts = {
  pt: `Você é o Nello, guia de autoconhecimento cristão do NELLO ONE.

MISSÃO: Gerar textos persuasivos mas respeitosos para engajar usuários que se cadastraram mas ainda não começaram os testes.

PRINCÍPIOS:
- Use empatia, nunca pressão agressiva
- Foque no valor do autoconhecimento para a vida da pessoa
- Se houver cupom, destaque o valor sem ser "vendedor"
- Tom: caloroso, sábio, encorajador
- Mantenha mensagens concisas e impactantes

FORMATO DE RESPOSTA (JSON):
{
  "subject": "Assunto do email (máx 60 caracteres, use emoji opcional)",
  "greeting": "Saudação personalizada com nome",
  "body": "Corpo do email (2-3 parágrafos curtos)",
  "cta": "Texto do botão de ação",
  "whatsappVersion": "Versão curta para WhatsApp (máx 300 caracteres, incluir link nello.one/cliente)"
}`,

  en: `You are Nello, a Christian self-knowledge guide from NELLO ONE.

MISSION: Generate persuasive but respectful texts to engage users who registered but haven't started the tests yet.

PRINCIPLES:
- Use empathy, never aggressive pressure
- Focus on the value of self-knowledge for the person's life
- If there's a coupon, highlight value without being "salesy"
- Tone: warm, wise, encouraging
- Keep messages concise and impactful

RESPONSE FORMAT (JSON):
{
  "subject": "Email subject (max 60 characters, optional emoji)",
  "greeting": "Personalized greeting with name",
  "body": "Email body (2-3 short paragraphs)",
  "cta": "Action button text",
  "whatsappVersion": "Short WhatsApp version (max 300 characters, include link nello.one/cliente)"
}`
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      objective, 
      userName, 
      daysSinceRegistration, 
      couponCode, 
      couponDiscount,
      discountType = "percent",
      customPrompt,
      language = "pt" 
    }: EngagementRequest = await req.json();

    const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
    if (!OPENROUTER_API_KEY) {
      throw new Error("OPENROUTER_API_KEY is not configured");
    }

    const objectiveInstruction = objectivePrompts[language][objective];
    
    let couponInfo = "";
    if (couponCode && couponDiscount) {
      const discountText = discountType === "percent" 
        ? `${couponDiscount}% de desconto` 
        : `R$ ${couponDiscount} de desconto`;
      couponInfo = language === "pt"
        ? `\n\nCUPOM DISPONÍVEL: ${couponCode} (${discountText}). Integre naturalmente no texto.`
        : `\n\nAVAILABLE COUPON: ${couponCode} (${discountText} off). Integrate naturally in the text.`;
    }

    const contextInfo = language === "pt"
      ? `Nome do usuário: ${userName}\nDias desde cadastro: ${daysSinceRegistration}`
      : `User name: ${userName}\nDays since registration: ${daysSinceRegistration}`;

    const userPrompt = objective === "custom" && customPrompt
      ? `${contextInfo}\n\nInstruções específicas: ${customPrompt}${couponInfo}`
      : `${contextInfo}\n\nObjetivo: ${objectiveInstruction}${couponInfo}`;

    console.log("Generating engagement copy for:", { objective, userName, language });

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompts[language] },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Lovable AI error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content returned from AI");
    }

    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid JSON response from AI");
    }

    const result = JSON.parse(jsonMatch[0]);

    console.log("Generated engagement copy successfully");

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Error in nello-engagement-copy:', error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
