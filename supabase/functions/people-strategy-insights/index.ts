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
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Invalid auth" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { company_id } = await req.json();
    if (!company_id) {
      return new Response(JSON.stringify({ error: "company_id required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(supabaseUrl, supabaseKey);

    // Auth check
    const { data: companyUser } = await admin
      .from("company_users").select("role")
      .eq("company_id", company_id).eq("user_id", user.id).eq("is_active", true)
      .maybeSingle();
    const { data: isNelloAdmin } = await admin.rpc("is_nello_admin", { check_user_id: user.id });

    if (!isNelloAdmin && (!companyUser || !["company_admin", "super_admin"].includes(companyUser.role))) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── Gather all data ──

    // eNPS
    const { data: enpsCycles } = await admin
      .from("company_enps_cycles").select("*")
      .eq("company_id", company_id).order("created_at", { ascending: false }).limit(10);
    const activeEnps = enpsCycles?.find((c: any) => c.status === "active" || c.status === "closed");

    // Climate
    const { data: climateCycles } = await admin
      .from("company_climate_cycles").select("*")
      .eq("company_id", company_id).order("created_at", { ascending: false }).limit(10);
    const activeClimate = climateCycles?.find((c: any) => c.status === "active" || c.status === "closed");

    // Team insights
    const { data: teamInsights } = await admin
      .from("company_team_insights").select("*")
      .eq("company_id", company_id).maybeSingle();

    // Build data context
    const currentENPS = activeEnps?.enps_score ?? null;
    const enpsHistory = (enpsCycles || [])
      .filter((c: any) => c.enps_score !== null)
      .map((c: any) => ({ title: c.title, score: c.enps_score, responses: c.total_responses }));

    const climateOverall = activeClimate?.overall_score ?? null;
    const climateDimensions = activeClimate?.dimension_scores || {};
    const climateHistory = (climateCycles || [])
      .filter((c: any) => c.overall_score !== null)
      .map((c: any) => ({ title: c.title, score: c.overall_score, dimensions: c.dimension_scores }));

    const discDist = teamInsights?.disc_distribution || {};
    const tempDist = teamInsights?.temperament_distribution || {};
    const totalMembers = teamInsights?.total_members || 0;
    const completedAssessments = teamInsights?.completed_assessments || 0;

    // ── Calculate Organizational Risk Index ──
    let riskIndex: number | null = null;
    const riskFactors: string[] = [];

    if (currentENPS !== null || climateOverall !== null) {
      let weightedSum = 0;
      let totalWeight = 0;

      // eNPS normalized to 0-100 scale (from -100 to +100)
      if (currentENPS !== null) {
        const enpsNormalized = (currentENPS + 100) / 2; // 0-100
        weightedSum += enpsNormalized * 0.3;
        totalWeight += 0.3;
      }

      // Climate overall (1-5 → 0-100)
      if (climateOverall !== null) {
        const climateNormalized = ((climateOverall - 1) / 4) * 100;
        weightedSum += climateNormalized * 0.3;
        totalWeight += 0.3;
      }

      // Leadership dimension (1-5 → 0-100)
      const leadershipScore = climateDimensions?.lideranca;
      if (leadershipScore) {
        const leaderNormalized = ((leadershipScore - 1) / 4) * 100;
        weightedSum += leaderNormalized * 0.2;
        totalWeight += 0.2;
      }

      // DISC concentration (penalize if >60% one profile)
      if (discDist && Object.keys(discDist).length > 0) {
        const discTotal = Object.values(discDist as Record<string, number>).reduce((a: number, b: number) => a + b, 0);
        const maxConcentration = Math.max(...Object.values(discDist as Record<string, number>));
        const concentrationPct = discTotal > 0 ? maxConcentration / discTotal : 0;
        const diversityScore = (1 - Math.max(0, concentrationPct - 0.25) / 0.75) * 100;
        weightedSum += diversityScore * 0.2;
        totalWeight += 0.2;

        if (concentrationPct > 0.6) {
          const dominantProfile = Object.entries(discDist as Record<string, number>)
            .sort((a, b) => b[1] - a[1])[0][0];
          riskFactors.push(`Concentração excessiva de perfil ${dominantProfile} (${Math.round(concentrationPct * 100)}%)`);
        }
      }

      if (totalWeight > 0) {
        riskIndex = Math.round(weightedSum / totalWeight);
      }
    }

    // Build prompt
    const prompt = `Você é um consultor sênior de People Strategy. Analise os dados organizacionais abaixo e forneça um diagnóstico estruturado.

DADOS ORGANIZACIONAIS:
- eNPS atual: ${currentENPS !== null ? currentENPS : "Sem dados"}
- Histórico eNPS: ${enpsHistory.length > 0 ? JSON.stringify(enpsHistory) : "Sem histórico"}
- Clima organizacional geral: ${climateOverall !== null ? climateOverall + "/5" : "Sem dados"}
- Clima por dimensão: ${Object.keys(climateDimensions).length > 0 ? JSON.stringify(climateDimensions) : "Sem dados"}
- Histórico clima: ${climateHistory.length > 0 ? JSON.stringify(climateHistory) : "Sem histórico"}
- Índice de Risco Organizacional: ${riskIndex !== null ? riskIndex + "/100" : "Não calculado"}
- Fatores de risco detectados: ${riskFactors.length > 0 ? riskFactors.join("; ") : "Nenhum"}
- Total membros: ${totalMembers}
- Avaliações completas: ${completedAssessments}
- Distribuição DISC: ${JSON.stringify(discDist)}
- Distribuição Temperamentos: ${JSON.stringify(tempDist)}

REGRAS ESTRITAS:
- Nunca invente dados ou correlações estatísticas complexas.
- Se dados forem insuficientes, diga explicitamente.
- Linguagem objetiva e executiva. Sem termos clínicos ou terapêuticos.
- Baseie-se apenas em padrões simples detectáveis nos dados.
- Máximo 3 itens por lista.
- Máximo 5 linhas por seção textual.

Responda usando a tool call fornecida.`;

    if (!lovableKey) {
      return new Response(JSON.stringify({
        insights: {
          executive_summary: "Chave de IA não configurada.",
          top_risks: "N/A", top_strengths: "N/A", trend_analysis: "N/A",
          priority_action: "N/A", priority_dimension: "N/A", profile_needing_support: "N/A",
        },
        risk_index: riskIndex,
        risk_factors: riskFactors,
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
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
        tools: [{
          type: "function",
          function: {
            name: "provide_strategy_insights",
            description: "Diagnóstico organizacional estruturado com riscos, forças e recomendações.",
            parameters: {
              type: "object",
              properties: {
                executive_summary: { type: "string", description: "Resumo executivo em até 5 linhas" },
                top_risks: { type: "string", description: "3 principais riscos organizacionais, um por linha" },
                top_strengths: { type: "string", description: "3 principais forças organizacionais, uma por linha" },
                trend_analysis: { type: "string", description: "Tendência de evolução baseada no histórico" },
                priority_action: { type: "string", description: "Onde agir primeiro e por quê" },
                priority_dimension: { type: "string", description: "Qual dimensão do clima priorizar" },
                profile_needing_support: { type: "string", description: "Qual perfil comportamental precisa de suporte" },
              },
              required: ["executive_summary", "top_risks", "top_strengths", "trend_analysis", "priority_action", "priority_dimension", "profile_needing_support"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "provide_strategy_insights" } },
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errText);
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos de IA insuficientes." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI error");
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];

    let insights;
    if (toolCall?.function?.arguments) {
      try { insights = JSON.parse(toolCall.function.arguments); }
      catch { insights = { executive_summary: "Erro ao processar resposta da IA." }; }
    } else {
      insights = { executive_summary: aiData.choices?.[0]?.message?.content || "Sem resposta." };
    }

    // Log
    await admin.from("company_ai_consultations").insert({
      company_id,
      consultation_type: "people_strategy_insights",
      requested_by: user.id,
      ai_response: JSON.stringify(insights),
      context: { enps_score: currentENPS, climate_score: climateOverall, risk_index: riskIndex },
    });

    return new Response(JSON.stringify({ insights, risk_index: riskIndex, risk_factors: riskFactors }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("people-strategy-insights error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
