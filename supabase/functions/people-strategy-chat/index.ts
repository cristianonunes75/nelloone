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
    const lovableKey = Deno.env.get("OPENROUTER_API_KEY");

    if (!lovableKey) {
      return new Response(JSON.stringify({ error: "AI key not configured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

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

    const { company_id, question, conversation_history } = await req.json();
    if (!company_id || !question) {
      return new Response(JSON.stringify({ error: "company_id and question required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(supabaseUrl, supabaseKey);

    // Auth check
    const { data: companyUser } = await admin
      .from("company_users").select("id, role")
      .eq("company_id", company_id).eq("user_id", user.id).eq("is_active", true)
      .maybeSingle();
    const { data: isNelloAdmin } = await admin.rpc("is_nello_admin", { check_user_id: user.id });

    if (!isNelloAdmin && (!companyUser || !["company_admin", "super_admin"].includes(companyUser.role))) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Gather organizational context
    const [
      { data: enpsCycles },
      { data: climateCycles },
      { data: perfCycles },
      { data: pdiPlans },
      { data: teamInsights },
    ] = await Promise.all([
      admin.from("company_enps_cycles").select("*").eq("company_id", company_id).order("created_at", { ascending: false }).limit(5),
      admin.from("company_climate_cycles").select("*").eq("company_id", company_id).order("created_at", { ascending: false }).limit(5),
      admin.from("company_performance_cycles").select("*").eq("company_id", company_id).order("created_at", { ascending: false }).limit(5),
      admin.from("company_pdi_plans").select("*").eq("company_id", company_id).limit(100),
      admin.from("company_team_insights").select("*").eq("company_id", company_id).maybeSingle(),
    ]);

    // Get performance reviews for latest cycle
    let perfAvg: number | null = null;
    let perfCount = 0;
    const latestPerfCycle = perfCycles?.find((c: any) => c.status === 'closed' || c.status === 'active');
    if (latestPerfCycle) {
      const { data: reviews } = await admin
        .from("company_performance_reviews").select("overall_score")
        .eq("cycle_id", latestPerfCycle.id).not("overall_score", "is", null);
      if (reviews && reviews.length > 0) {
        perfCount = reviews.length;
        perfAvg = reviews.reduce((sum: number, r: any) => sum + (r.overall_score || 0), 0) / reviews.length;
      }
    }

    // PDI stats
    const activePDIs = pdiPlans?.filter((p: any) => p.status === 'active').length || 0;
    const totalPDIs = pdiPlans?.length || 0;

    const activeEnps = enpsCycles?.find((c: any) => c.status === "active" || c.status === "closed");
    const activeClimate = climateCycles?.find((c: any) => c.status === "active" || c.status === "closed");

    const contextData = `
DADOS ORGANIZACIONAIS REAIS:
- eNPS atual: ${activeEnps?.enps_score ?? "Sem dados"} (${activeEnps?.total_responses ?? 0} respostas)
- Clima geral: ${activeClimate?.overall_score ?? "Sem dados"}/5 (${activeClimate?.total_responses ?? 0} respostas)
- Clima por dimensão: ${activeClimate?.dimension_scores ? JSON.stringify(activeClimate.dimension_scores) : "Sem dados"}
- Performance média: ${perfAvg !== null ? perfAvg.toFixed(1) + "/5" : "Sem dados"} (${perfCount} avaliações)
- PDIs ativos: ${activePDIs} de ${totalPDIs} total
- Total membros: ${teamInsights?.total_members ?? "?"}
- Avaliações comportamentais: ${teamInsights?.completed_assessments ?? 0}
- Distribuição DISC: ${teamInsights?.disc_distribution ? JSON.stringify(teamInsights.disc_distribution) : "Sem dados"}
- Distribuição Temperamentos: ${teamInsights?.temperament_distribution ? JSON.stringify(teamInsights.temperament_distribution) : "Sem dados"}
- Histórico eNPS: ${(enpsCycles || []).filter((c: any) => c.enps_score !== null).map((c: any) => `${c.title}: ${c.enps_score}`).join(", ") || "Sem histórico"}
- Histórico Clima: ${(climateCycles || []).filter((c: any) => c.overall_score !== null).map((c: any) => `${c.title}: ${c.overall_score}`).join(", ") || "Sem histórico"}
`;

    const systemPrompt = `Você é um consultor estratégico de People Analytics para CEOs. Responda em português brasileiro.

REGRAS ESTRITAS:
- Nunca invente dados. Use APENAS os dados fornecidos no contexto.
- Se dados forem insuficientes, diga explicitamente o que falta.
- Linguagem objetiva e executiva. Sem termos clínicos ou terapêuticos.
- Não faça diagnóstico psicológico.
- Sempre termine com: 1 ação prioritária + máximo 2 ações secundárias.
- Sugira abrir ciclos (clima, performance, eNPS) quando relevante.
- Formato: resumo curto → diagnóstico → impacto provável → ações recomendadas.

${contextData}`;

    const messages: Array<{role: string; content: string}> = [
      { role: "system", content: systemPrompt },
    ];

    // Add conversation history if provided
    if (conversation_history && Array.isArray(conversation_history)) {
      for (const msg of conversation_history.slice(-10)) {
        messages.push({ role: msg.role, content: msg.content });
      }
    }

    messages.push({ role: "user", content: question });

    const aiResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages,
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
    const responseText = aiData.choices?.[0]?.message?.content || "Sem resposta da IA.";

    // Log for audit
    await admin.from("company_ai_queries").insert({
      company_id,
      company_user_id: companyUser?.id || null,
      feature: "people_strategy_chat",
      question_text: question,
      response_text: responseText,
    });

    return new Response(JSON.stringify({ response: responseText }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("people-strategy-chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
