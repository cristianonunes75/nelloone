import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  console.log(`[GENERATE-ACTION-PLAN] ${step}`, details ? JSON.stringify(details) : '');
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
    
    // Get chosen path details
    const chosenPath = activation.chosen_path;
    const pathData = activation[`path_${chosenPath}`];
    
    if (!pathData) {
      throw new Error("No chosen path found");
    }

    logStep("Generating plan for path", { chosenPath, pathTitle: pathData.title });

    // Build prompt for 14-day action plan
    const prompts: Record<string, string> = {
      pt: `Você é um coach de carreira especializado em planos de ação práticos. Crie um plano de 14 dias para o caminho escolhido.

CAMINHO ESCOLHIDO: ${pathData.title}
DESCRIÇÃO: ${pathData.description}
PRIMEIRO PASSO SUGERIDO: ${pathData.first_step}
MOTOR DA ESSÊNCIA: ${activation.essence_motor || "Não informado"}
SABOTADOR A OBSERVAR: ${activation.main_saboteur || "Não informado"}
MODO DE AÇÃO: ${activation.action_mode || "Não informado"}
HORAS DISPONÍVEIS/SEMANA: ${activation.hours_per_week || "10"}

Gere um plano dividido em 2 semanas:

SEMANA 1 (Exploração e Validação):
- 3 ações práticas e específicas
- Foco em pesquisa, conversas e pequenos experimentos
- Cada ação deve levar no máximo 2-3 horas

SEMANA 2 (Execução e Decisão):
- 3 ações práticas e específicas
- Foco em executar, testar e decidir
- Cada ação deve levar no máximo 2-3 horas

As ações devem ser:
- Concretas (não abstratas)
- Mensuráveis (saber quando completou)
- Alinhadas com o modo de ação da pessoa
- Pequenas o suficiente para não gerar resistência

Responda em JSON:
{
  "week_1": ["Ação 1", "Ação 2", "Ação 3"],
  "week_2": ["Ação 4", "Ação 5", "Ação 6"]
}`,
      en: `You are a career coach specialized in practical action plans. Create a 14-day plan for the chosen path.

CHOSEN PATH: ${pathData.title}
DESCRIPTION: ${pathData.description}
SUGGESTED FIRST STEP: ${pathData.first_step}
ESSENCE MOTOR: ${activation.essence_motor || "Not provided"}
SABOTEUR TO WATCH: ${activation.main_saboteur || "Not provided"}
ACTION MODE: ${activation.action_mode || "Not provided"}
AVAILABLE HOURS/WEEK: ${activation.hours_per_week || "10"}

Generate a plan divided into 2 weeks:

WEEK 1 (Exploration and Validation):
- 3 practical and specific actions
- Focus on research, conversations, and small experiments
- Each action should take max 2-3 hours

WEEK 2 (Execution and Decision):
- 3 practical and specific actions
- Focus on executing, testing, and deciding
- Each action should take max 2-3 hours

Actions should be:
- Concrete (not abstract)
- Measurable (know when completed)
- Aligned with the person's action mode
- Small enough to not create resistance

Respond in JSON:
{
  "week_1": ["Action 1", "Action 2", "Action 3"],
  "week_2": ["Action 4", "Action 5", "Action 6"]
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
          { role: "system", content: "You are a career action plan expert. Always respond with valid JSON only, no markdown." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 800,
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
      
      // Fallback plan
      result = language === "en" ? {
        week_1: [
          "List all career options you're considering and rate each 1-10 on excitement",
          "Have 2 conversations with people in your target area (use LinkedIn)",
          "Narrow down to 2 main paths based on your research"
        ],
        week_2: [
          "Execute a micro-experience in your chosen path (shadow, volunteer, or small project)",
          "Simulate the new routine for 3 days (wake up time, activities, energy levels)",
          "Evaluate emotional cost vs. benefit and make a preliminary decision"
        ]
      } : {
        week_1: [
          "Liste todas as opções de carreira que está considerando e avalie cada uma de 1-10 em entusiasmo",
          "Converse com 2 pessoas da área alvo (use LinkedIn)",
          "Reduza para 2 caminhos principais baseado na sua pesquisa"
        ],
        week_2: [
          "Execute uma micro-experiência no caminho escolhido (observe, voluntarie ou faça um mini projeto)",
          "Simule a nova rotina por 3 dias (horário de acordar, atividades, níveis de energia)",
          "Avalie o custo emocional vs. benefício e tome uma decisão preliminar"
        ]
      };
    }

    logStep("Action plan generated successfully", { week1Actions: result.week_1?.length, week2Actions: result.week_2?.length });

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
