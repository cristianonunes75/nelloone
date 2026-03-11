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

    const { company_id, company_user_id } = await req.json();
    if (!company_id || !company_user_id) {
      return new Response(JSON.stringify({ error: "company_id and company_user_id required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(supabaseUrl, supabaseKey);

    // Auth check
    const { data: callerUser } = await admin
      .from("company_users").select("role")
      .eq("company_id", company_id).eq("user_id", user.id).eq("is_active", true)
      .maybeSingle();
    const { data: isNelloAdmin } = await admin.rpc("is_nello_admin", { check_user_id: user.id });

    if (!isNelloAdmin && (!callerUser || !["company_admin", "super_admin"].includes(callerUser.role))) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get collaborator data
    const { data: companyUser } = await admin
      .from("company_users").select("user_id, department, position")
      .eq("id", company_user_id).single();

    if (!companyUser) {
      return new Response(JSON.stringify({ error: "Collaborator not found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get behavioral profile
    const { data: profile } = await admin
      .from("profiles").select("full_name, disc_profile, temperament")
      .eq("id", companyUser.user_id).maybeSingle();

    // Get latest performance review
    const { data: latestReview } = await admin
      .from("company_performance_reviews")
      .select("overall_score, status, cycle_id")
      .eq("company_user_id", company_user_id)
      .eq("status", "submitted")
      .order("submitted_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    let reviewAnswers: any[] = [];
    if (latestReview) {
      const { data } = await admin
        .from("company_performance_answers")
        .select("dimension, question, score, comment_text")
        .eq("review_id", latestReview.id);
      reviewAnswers = data || [];
    }

    // Get existing PDI history
    const { data: existingPDIs } = await admin
      .from("company_pdi_plans").select("id, status, target_date")
      .eq("company_user_id", company_user_id).limit(5);

    const prompt = `Você é um especialista em desenvolvimento de pessoas. Gere um PDI (Plano de Desenvolvimento Individual) personalizado.

DADOS DO COLABORADOR:
- Nome: ${profile?.full_name || "Não informado"}
- Cargo: ${companyUser.position || "Não informado"}
- Departamento: ${companyUser.department || "Não informado"}
- Perfil DISC: ${profile?.disc_profile || "Não mapeado"}
- Temperamento: ${profile?.temperament || "Não mapeado"}
- Score Performance: ${latestReview?.overall_score ?? "Sem avaliação"}
- Pontos da avaliação: ${reviewAnswers.length > 0 ? JSON.stringify(reviewAnswers.map((a: any) => ({ dim: a.dimension, q: a.question, score: a.score, comment: a.comment_text }))) : "Sem dados"}
- PDIs anteriores: ${existingPDIs?.length || 0}

REGRAS:
- Gere exatamente 3 metas de PDI
- Para cada meta: 3 ações concretas, métrica de sucesso, prazo sugerido
- Alinhe ao perfil comportamental e aos pontos de melhoria do review
- Evite recomendações genéricas
- Não prometa resultados garantidos
- Inclua recomendação para o gestor sobre como acompanhar
- Linguagem objetiva e executiva`;

    const aiResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "Você gera PDIs estruturados para colaboradores. Responda em português brasileiro." },
          { role: "user", content: prompt },
        ],
        tools: [{
          type: "function",
          function: {
            name: "generate_pdi",
            description: "Gera PDI estruturado com metas, ações e métricas",
            parameters: {
              type: "object",
              properties: {
                goals: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: { type: "string" },
                      description: { type: "string" },
                      category: { type: "string", enum: ["skill", "behavior", "leadership", "delivery"] },
                      priority: { type: "string", enum: ["low", "medium", "high"] },
                      success_metric: { type: "string" },
                      deadline_weeks: { type: "number" },
                      actions: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            action_text: { type: "string" },
                            frequency: { type: "string" },
                            owner: { type: "string", enum: ["self", "manager"] },
                          },
                          required: ["action_text", "frequency", "owner"],
                          additionalProperties: false,
                        },
                      },
                    },
                    required: ["title", "description", "category", "priority", "success_metric", "deadline_weeks", "actions"],
                    additionalProperties: false,
                  },
                },
                manager_recommendation: { type: "string" },
              },
              required: ["goals", "manager_recommendation"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "generate_pdi" } },
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos insuficientes." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI error");
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];

    let pdiSuggestion;
    if (toolCall?.function?.arguments) {
      try { pdiSuggestion = JSON.parse(toolCall.function.arguments); }
      catch { pdiSuggestion = { goals: [], manager_recommendation: "Erro ao processar." }; }
    } else {
      pdiSuggestion = { goals: [], manager_recommendation: aiData.choices?.[0]?.message?.content || "Sem resposta." };
    }

    // Log
    await admin.from("company_ai_queries").insert({
      company_id,
      company_user_id,
      feature: "people_pdi_generator",
      question_text: `PDI generation for ${profile?.full_name || company_user_id}`,
      response_text: JSON.stringify(pdiSuggestion),
    });

    return new Response(JSON.stringify(pdiSuggestion), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("people-pdi-generator error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
