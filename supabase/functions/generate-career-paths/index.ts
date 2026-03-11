import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  console.log(`[GENERATE-CAREER-PATHS] ${step}`, details ? JSON.stringify(details) : '');
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
    
    // Get user's Código da Essência and profile
    const { data: profileData } = await supabaseClient
      .from("profiles")
      .select("codigo_da_essencia, full_name")
      .eq("id", user.id)
      .single();
    
    const codigo = profileData?.codigo_da_essencia || "Unknown";

    // Build comprehensive prompt
    const prompts: Record<string, string> = {
      pt: `Você é um especialista em carreira e desenvolvimento profissional. Com base no perfil abaixo, gere 3 caminhos profissionais personalizados.

CÓDIGO DA ESSÊNCIA: ${codigo}
FASE DE VIDA: ${activation.life_phase || "Não informado"}
DÚVIDA PRINCIPAL: ${activation.main_doubt || "Não informado"}
MOTOR DA ESSÊNCIA: ${activation.essence_motor || "Não informado"}
MODO DE AÇÃO: ${activation.action_mode || "Não informado"}
NECESSIDADES NO TRABALHO: ${JSON.stringify(activation.needs_at_work) || "Não informado"}
NÃO TOLERA: ${JSON.stringify(activation.cannot_tolerate) || "Não informado"}
HORIZONTE DE MUDANÇA: ${activation.change_horizon || "Não informado"}
PRECISA RENDA CURTO PRAZO: ${activation.needs_income_short_term ? "Sim" : "Não"}
HORAS DISPONÍVEIS/SEMANA: ${activation.hours_per_week || "Flexível"}

Gere exatamente 3 caminhos:

1. CAMINHO SEGURO (path_a): Menor risco, mantém estabilidade, mudança gradual
2. CAMINHO AMBICIOSO (path_b): Maior potencial de realização, requer mais investimento/risco
3. CAMINHO EXPERIMENTAL (path_c): Teste de hipótese, pode ser paralelo ao atual

Para cada caminho, forneça:
- title: Título curto e inspirador (max 6 palavras)
- description: O que é esse caminho (2-3 frases)
- pros: Lista de 3 vantagens
- cons: Lista de 2-3 desafios/riscos
- first_step: Primeiro passo concreto para começar
- timeline: Tempo estimado para ver resultados

Responda em JSON:
{
  "path_a": { "title": "", "description": "", "pros": [], "cons": [], "first_step": "", "timeline": "" },
  "path_b": { "title": "", "description": "", "pros": [], "cons": [], "first_step": "", "timeline": "" },
  "path_c": { "title": "", "description": "", "pros": [], "cons": [], "first_step": "", "timeline": "" }
}`,
      en: `You are a career and professional development expert. Based on the profile below, generate 3 personalized professional paths.

ESSENCE CODE: ${codigo}
LIFE PHASE: ${activation.life_phase || "Not provided"}
MAIN DOUBT: ${activation.main_doubt || "Not provided"}
ESSENCE MOTOR: ${activation.essence_motor || "Not provided"}
ACTION MODE: ${activation.action_mode || "Not provided"}
WORK NEEDS: ${JSON.stringify(activation.needs_at_work) || "Not provided"}
CANNOT TOLERATE: ${JSON.stringify(activation.cannot_tolerate) || "Not provided"}
CHANGE HORIZON: ${activation.change_horizon || "Not provided"}
NEEDS SHORT-TERM INCOME: ${activation.needs_income_short_term ? "Yes" : "No"}
AVAILABLE HOURS/WEEK: ${activation.hours_per_week || "Flexible"}

Generate exactly 3 paths:

1. SAFE PATH (path_a): Lower risk, maintains stability, gradual change
2. AMBITIOUS PATH (path_b): Higher fulfillment potential, requires more investment/risk
3. EXPERIMENTAL PATH (path_c): Hypothesis test, can run parallel to current situation

For each path, provide:
- title: Short inspiring title (max 6 words)
- description: What this path is (2-3 sentences)
- pros: List of 3 advantages
- cons: List of 2-3 challenges/risks
- first_step: First concrete step to start
- timeline: Estimated time to see results

Respond in JSON:
{
  "path_a": { "title": "", "description": "", "pros": [], "cons": [], "first_step": "", "timeline": "" },
  "path_b": { "title": "", "description": "", "pros": [], "cons": [], "first_step": "", "timeline": "" },
  "path_c": { "title": "", "description": "", "pros": [], "cons": [], "first_step": "", "timeline": "" }
}`
    };

    const prompt = prompts[language] || prompts.pt;

    // Call Lovable AI
    const aiResponse = await fetch("https://api.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Deno.env.get("OPENROUTER_API_KEY")}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are a career development expert. Always respond with valid JSON only, no markdown." },
          { role: "user", content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 1500,
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
      
      // Fallback paths
      result = language === "en" ? {
        path_a: {
          title: "Optimize Current Role",
          description: "Leverage your existing position to develop new skills and responsibilities that align with your essence.",
          pros: ["Lower risk", "Uses existing network", "Immediate income stability"],
          cons: ["Slower transformation", "May hit ceiling"],
          first_step: "Schedule a meeting with your manager to discuss growth opportunities",
          timeline: "3-6 months for initial results"
        },
        path_b: {
          title: "Strategic Career Pivot",
          description: "Make a planned transition to a role that better aligns with your core motivations and natural strengths.",
          pros: ["Higher fulfillment potential", "Fresh start", "Better alignment with essence"],
          cons: ["Requires preparation", "Temporary income uncertainty", "Learning curve"],
          first_step: "Research 3 companies in your target field and connect with employees on LinkedIn",
          timeline: "6-12 months for full transition"
        },
        path_c: {
          title: "Side Project Laboratory",
          description: "Test your hypothesis by building something small on the side while maintaining your current stability.",
          pros: ["Zero risk to current income", "Real market feedback", "Skill development"],
          cons: ["Requires extra time", "Slower progress"],
          first_step: "Dedicate 5 hours this week to outline your minimum viable project",
          timeline: "2-3 months for first validation"
        }
      } : {
        path_a: {
          title: "Otimizar Posição Atual",
          description: "Aproveite sua posição existente para desenvolver novas habilidades e responsabilidades alinhadas com sua essência.",
          pros: ["Menor risco", "Usa rede existente", "Estabilidade de renda imediata"],
          cons: ["Transformação mais lenta", "Pode atingir teto"],
          first_step: "Agende uma conversa com seu gestor sobre oportunidades de crescimento",
          timeline: "3-6 meses para resultados iniciais"
        },
        path_b: {
          title: "Pivô Estratégico de Carreira",
          description: "Faça uma transição planejada para um papel que melhor se alinha com suas motivações e forças naturais.",
          pros: ["Maior potencial de realização", "Recomeço", "Melhor alinhamento com essência"],
          cons: ["Requer preparação", "Incerteza temporária de renda", "Curva de aprendizado"],
          first_step: "Pesquise 3 empresas na sua área alvo e conecte-se com funcionários no LinkedIn",
          timeline: "6-12 meses para transição completa"
        },
        path_c: {
          title: "Laboratório Paralelo",
          description: "Teste sua hipótese construindo algo pequeno em paralelo enquanto mantém sua estabilidade atual.",
          pros: ["Zero risco à renda atual", "Feedback real do mercado", "Desenvolvimento de skills"],
          cons: ["Requer tempo extra", "Progresso mais lento"],
          first_step: "Dedique 5 horas esta semana para esboçar seu projeto mínimo viável",
          timeline: "2-3 meses para primeira validação"
        }
      };
    }

    logStep("Paths generated successfully");

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
