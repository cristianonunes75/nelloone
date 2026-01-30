import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  console.log(`[GENERATE-ESSENCE-READING] ${step}`, details ? JSON.stringify(details) : '');
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");
    
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");
    
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    if (authError || !user) throw new Error("User not authenticated");
    
    logStep("User authenticated", { userId: user.id });

    const { activation, language = "pt" } = await req.json();
    
    // Get user's Código da Essência
    const { data: codigoData, error: codigoError } = await supabaseClient
      .from("profiles")
      .select("codigo_da_essencia")
      .eq("id", user.id)
      .single();
    
    if (codigoError || !codigoData?.codigo_da_essencia) {
      throw new Error("Código da Essência not found");
    }
    
    const codigo = codigoData.codigo_da_essencia;
    logStep("Código retrieved", { codigo });

    // Build prompt for AI analysis
    const prompts: Record<string, string> = {
      pt: `Você é um especialista em psicologia comportamental e desenvolvimento profissional. Analise o perfil abaixo e gere uma leitura de essência profissional.

CÓDIGO DA ESSÊNCIA: ${codigo}
FASE DE VIDA: ${activation.life_phase || "Não informado"}
DÚVIDA PRINCIPAL: ${activation.main_doubt || "Não informado"}
RAZÃO DO TRAVAMENTO: ${activation.stuck_reason || "Não informado"}

Com base nisso, identifique:

1. MOTOR DA ESSÊNCIA: Qual é o motor interno que impulsiona essa pessoa? (1 frase de no máximo 15 palavras)

2. SABOTADOR PRINCIPAL: Qual é o padrão de autossabotagem mais provável baseado no código? (1 palavra/conceito + explicação de 20 palavras)

3. MODO DE AÇÃO NATURAL: Como essa pessoa opera melhor - planejador metódico, executor intuitivo, experimentador iterativo, ou adaptador contextual? (1 escolha + 15 palavras explicando)

Responda em JSON:
{
  "essence_motor": "string",
  "main_saboteur": "string",
  "action_mode": "string"
}`,
      en: `You are an expert in behavioral psychology and professional development. Analyze the profile below and generate a professional essence reading.

ESSENCE CODE: ${codigo}
LIFE PHASE: ${activation.life_phase || "Not provided"}
MAIN DOUBT: ${activation.main_doubt || "Not provided"}
STUCK REASON: ${activation.stuck_reason || "Not provided"}

Based on this, identify:

1. ESSENCE MOTOR: What is the internal motor that drives this person? (1 sentence, max 15 words)

2. MAIN SABOTEUR: What is the most likely self-sabotage pattern based on the code? (1 word/concept + 20-word explanation)

3. NATURAL ACTION MODE: How does this person operate best - methodical planner, intuitive executor, iterative experimenter, or contextual adapter? (1 choice + 15 words explaining)

Respond in JSON:
{
  "essence_motor": "string",
  "main_saboteur": "string",
  "action_mode": "string"
}`
    };

    const prompt = prompts[language] || prompts.pt;

    // Call Lovable AI
    const aiResponse = await fetch("https://api.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are a professional development expert. Always respond with valid JSON only." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      logStep("AI API error", { status: aiResponse.status, error: errorText });
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices[0]?.message?.content || "";
    
    logStep("AI response received", { contentLength: content.length });

    // Parse JSON from response
    let result;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      logStep("Parse error, using fallback", { error: parseError });
      result = {
        essence_motor: language === "en" 
          ? "Creating meaningful impact through authentic expression"
          : "Criar impacto significativo através da expressão autêntica",
        main_saboteur: language === "en"
          ? "Perfectionism - The need to have everything perfect before acting"
          : "Perfeccionismo - A necessidade de ter tudo perfeito antes de agir",
        action_mode: language === "en"
          ? "Iterative Experimenter - Learns best through small tests and adjustments"
          : "Experimentador Iterativo - Aprende melhor através de pequenos testes e ajustes",
      };
    }

    logStep("Reading generated successfully", result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    logStep("ERROR", { message: error instanceof Error ? error.message : String(error) });
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
