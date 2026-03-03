import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableKey = Deno.env.get("LOVABLE_API_KEY");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify user
    const userClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Invalid auth" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { company_id } = await req.json();
    if (!company_id) {
      return new Response(JSON.stringify({ error: "company_id required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(supabaseUrl, supabaseKey);

    // Verify user is company admin
    const { data: companyUser } = await admin
      .from("company_users")
      .select("role")
      .eq("company_id", company_id)
      .eq("user_id", user.id)
      .eq("is_active", true)
      .maybeSingle();

    const { data: isNelloAdmin } = await admin.rpc("is_nello_admin", { check_user_id: user.id });

    if (!isNelloAdmin && (!companyUser || !["company_admin", "super_admin"].includes(companyUser.role))) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Gather data
    // 1. eNPS cycles
    const { data: cycles } = await admin
      .from("company_enps_cycles")
      .select("*")
      .eq("company_id", company_id)
      .order("created_at", { ascending: false })
      .limit(10);

    const activeCycle = cycles?.find((c: any) => c.status === "active" || c.status === "closed");

    // 2. Team insights (cached)
    const { data: teamInsights } = await admin
      .from("company_team_insights")
      .select("*")
      .eq("company_id", company_id)
      .maybeSingle();

    // Build context for AI
    const currentENPS = activeCycle?.enps_score ?? null;
    const history = (cycles || [])
      .filter((c: any) => c.enps_score !== null)
      .map((c: any) => ({ title: c.title, score: c.enps_score, responses: c.total_responses }));

    const discDist = teamInsights?.disc_distribution || {};
    const tempDist = teamInsights?.temperament_distribution || {};
    const totalMembers = teamInsights?.total_members || 0;
    const completedAssessments = teamInsights?.completed_assessments || 0;

    const prompt = `Você é um consultor de People Analytics. Analise os seguintes dados de uma empresa e forneça insights estratégicos.

DADOS:
- eNPS atual: ${currentENPS !== null ? currentENPS : "Sem dados"}
- Histórico eNPS: ${history.length > 0 ? JSON.stringify(history) : "Sem histórico"}
- Promotores: ${activeCycle?.promoters_count ?? 0}, Neutros: ${activeCycle?.neutrals_count ?? 0}, Detratores: ${activeCycle?.detractors_count ?? 0}
- Total de membros na equipe: ${totalMembers}
- Avaliações comportamentais completas: ${completedAssessments}
- Distribuição DISC: ${JSON.stringify(discDist)}
- Distribuição Temperamentos: ${JSON.stringify(tempDist)}

REGRAS:
- Nunca invente dados. Se dados forem insuficientes, informe explicitamente.
- Linguagem objetiva e executiva. Sem linguagem terapêutica ou diagnóstico clínico.
- Máximo 5 linhas por seção.

Responda usando EXATAMENTE a seguinte estrutura de tool call.`;

    if (!lovableKey) {
      return new Response(JSON.stringify({
        insights: {
          executive_summary: "Chave de IA não configurada. Configure o LOVABLE_API_KEY para gerar insights.",
          main_risks: "N/A",
          most_engaged_profile: "N/A",
          least_engaged_profile: "N/A",
          strategic_recommendation: "N/A",
        },
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "Você é um consultor estratégico de People Analytics. Responda em português brasileiro." },
          { role: "user", content: prompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "provide_enps_insights",
              description: "Retorna insights estratégicos sobre eNPS e perfil da equipe.",
              parameters: {
                type: "object",
                properties: {
                  executive_summary: { type: "string", description: "Resumo executivo em até 5 linhas" },
                  main_risks: { type: "string", description: "Principais riscos detectados" },
                  most_engaged_profile: { type: "string", description: "Perfil mais engajado e por quê" },
                  least_engaged_profile: { type: "string", description: "Perfil menos engajado e por quê" },
                  strategic_recommendation: { type: "string", description: "Recomendação estratégica simples e acionável" },
                },
                required: ["executive_summary", "main_risks", "most_engaged_profile", "least_engaged_profile", "strategic_recommendation"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "provide_enps_insights" } },
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errText);

      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Tente novamente em alguns minutos." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos de IA insuficientes." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      throw new Error("AI error");
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];

    let insights;
    if (toolCall?.function?.arguments) {
      try {
        insights = JSON.parse(toolCall.function.arguments);
      } catch {
        insights = {
          executive_summary: "Erro ao processar resposta da IA.",
          main_risks: "N/A",
          most_engaged_profile: "N/A",
          least_engaged_profile: "N/A",
          strategic_recommendation: "N/A",
        };
      }
    } else {
      insights = {
        executive_summary: aiData.choices?.[0]?.message?.content || "Sem resposta da IA.",
        main_risks: "N/A",
        most_engaged_profile: "N/A",
        least_engaged_profile: "N/A",
        strategic_recommendation: "N/A",
      };
    }

    // Log consultation
    await admin.from("company_ai_consultations").insert({
      company_id,
      consultation_type: "enps_insights",
      requested_by: user.id,
      ai_response: JSON.stringify(insights),
      context: { enps_score: currentENPS, total_members: totalMembers },
    });

    return new Response(JSON.stringify({ insights }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("people-enps-insights error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
