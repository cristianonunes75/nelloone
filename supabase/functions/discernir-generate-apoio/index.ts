import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface IdentityData {
  disc?: { D: number; I: number; S: number; C: number };
  temperamentos?: { type: string; scores: Record<string, number> };
  enneagram?: { type: number; wing?: number };
  mapaEssencia?: Record<string, unknown>;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.error("No authorization header");
      return new Response(JSON.stringify({ error: "Não autorizado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error("Auth error:", userError);
      return new Response(JSON.stringify({ error: "Não autorizado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { artifact_type = "individual", couple_id, parish_id } = await req.json();
    console.log(`Generating Apoio de Escuta for user ${user.id}, type: ${artifact_type}`);

    // 1. Verify consent - for individual, check individual consent; for conjugal, check conjugal
    const { data: consent, error: consentError } = await supabase
      .from("discernir_consents")
      .select("*")
      .eq("user_id", user.id)
      .eq("consent_type", artifact_type === "individual" ? "individual" : "conjugal")
      .eq("is_active", true)
      .is("revoked_at", null)
      .maybeSingle();

    if (consentError || !consent) {
      console.error("Consent not found:", consentError);
      return new Response(JSON.stringify({ error: "Consentimento não encontrado. Por favor, aceite os termos antes de continuar." }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2. Try to get couple info - but this is OPTIONAL for individual type
    let coupleData = null;
    let resolvedParishId = parish_id || null;
    
    const { data: coupleResult } = await supabase
      .from("discernir_couples")
      .select("id, parish_id")
      .or(`spouse_a_user_id.eq.${user.id},spouse_b_user_id.eq.${user.id}`)
      .eq("status", "active")
      .maybeSingle();

    if (coupleResult) {
      coupleData = coupleResult;
      resolvedParishId = coupleResult.parish_id;
    }

    // For conjugal type, couple is required
    if (artifact_type === "conjugal" && !coupleData) {
      console.error("Couple required for conjugal type but not found");
      return new Response(JSON.stringify({ error: "Casal não encontrado. Para gerar o apoio conjugal, é necessário estar vinculado a um casal." }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // If no parish_id found, try to get from priest or use a default
    if (!resolvedParishId) {
      // Try to get from any priest that has access
      const { data: priestAccess } = await supabase
        .from("discernir_priests")
        .select("parish_id")
        .limit(1)
        .maybeSingle();
      
      if (priestAccess?.parish_id) {
        resolvedParishId = priestAccess.parish_id;
      }
    }

    // If still no parish_id, we need to create or find a default parish for the pilot
    if (!resolvedParishId) {
      // Check if there's any parish in the system
      const { data: anyParish } = await supabase
        .from("discernir_parishes")
        .select("id")
        .limit(1)
        .maybeSingle();

      if (anyParish) {
        resolvedParishId = anyParish.id;
      } else {
        console.error("No parish found in the system");
        return new Response(JSON.stringify({ error: "Nenhuma paróquia configurada. Entre em contato com o administrador." }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    console.log(`Using parish_id: ${resolvedParishId}, couple_id: ${coupleData?.id || 'none'}`);

    // 3. Fetch IDENTITY data - user_tests with result_data
    const { data: userTests, error: testsError } = await supabase
      .from("user_tests")
      .select(`
        id,
        test_id,
        status,
        result_data,
        tests:test_id (name)
      `)
      .eq("user_id", user.id)
      .eq("status", "completed");

    if (testsError) {
      console.error("Error fetching tests:", testsError);
      return new Response(JSON.stringify({ error: "Erro ao buscar dados do Identity" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if user has any completed tests
    if (!userTests || userTests.length === 0) {
      console.log("User has no completed tests");
      return new Response(JSON.stringify({ 
        error: "Você ainda não completou nenhum teste do Identity. Complete pelo menos um teste para gerar o Apoio de Escuta." 
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 4. Also fetch mapa_essencia for richer context
    const { data: mapaEssencia } = await supabase
      .from("mapa_essencia")
      .select("sections, raw_content")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    // 5. Fetch profile info
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, birth_date")
      .eq("id", user.id)
      .maybeSingle();

    // 6. Build identity context for AI
    const identityData: IdentityData = {};
    
    for (const test of userTests || []) {
      const testName = (test.tests as any)?.name?.toLowerCase() || "";
      if (testName.includes("disc") && test.result_data) {
        identityData.disc = test.result_data as any;
      } else if (testName.includes("temperamento") && test.result_data) {
        identityData.temperamentos = test.result_data as any;
      } else if (testName.includes("eneagrama") && test.result_data) {
        identityData.enneagram = test.result_data as any;
      }
    }

    if (mapaEssencia?.sections) {
      identityData.mapaEssencia = mapaEssencia.sections as Record<string, unknown>;
    }

    console.log("Identity data collected:", Object.keys(identityData));

    // 7. Generate Apoio de Escuta using Lovable AI
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY not configured");
      return new Response(JSON.stringify({ error: "Configuração de IA não encontrada" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const systemPrompt = `Você é um assistente pastoral especializado em apoiar a escuta de pessoas e casais.
    
REGRAS INEGOCIÁVEIS:
- NUNCA diagnosticar pessoas ou casais
- NUNCA fazer julgamentos morais
- NUNCA usar linguagem psicológica técnica
- NUNCA dar conclusões fechadas
- NUNCA recomendar funções ou cargos
- SEMPRE usar linguagem neutra e acolhedora
- SEMPRE lembrar que isso é APOIO À ESCUTA, não avaliação

Você vai receber dados do sistema IDENTITY sobre uma pessoa e deve gerar um "Apoio de Escuta" pastoral.

O resultado deve ser um JSON com as seguintes seções (todas em português brasileiro):
{
  "current_moment": "Descrição breve e acolhedora do momento atual da pessoa (2-3 frases)",
  "responsibility_relation": "Como a pessoa tende a se relacionar com responsabilidades (2-3 frases neutras)",
  "fatigue_signals": ["Sinal 1 de possível cansaço", "Sinal 2"],
  "family_situation": "Observação geral sobre equilíbrio família-serviço",
  "suggested_questions": ["Pergunta aberta 1 para conversa", "Pergunta 2", "Pergunta 3"],
  "care_pathways": ["Caminho de cuidado 1", "Caminho 2"]
}

IMPORTANTE: Use sempre o disclaimer mental: "Este apoio não descreve a pessoa. Apenas ajuda a escutar melhor o momento."`;

    const userPrompt = `Gere o Apoio de Escuta para esta pessoa com base nos dados do IDENTITY:

Nome: ${profile?.full_name || "Não informado"}

Dados IDENTITY disponíveis:
${JSON.stringify(identityData, null, 2)}

Lembre-se: 
- NÃO diagnostique
- NÃO julgue
- Use linguagem pastoral e acolhedora
- Foque no MOMENTO, não na personalidade fixa

Retorne APENAS o JSON válido, sem texto adicional.`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI error:", aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Limite de requisições excedido. Tente novamente mais tarde." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos de IA esgotados." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ error: "Erro na geração do Apoio de Escuta" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices?.[0]?.message?.content || "";
    console.log("AI response received");

    // Parse JSON from AI response
    let apoioData;
    try {
      // Try to extract JSON from the response
      const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        apoioData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in AI response");
      }
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError, aiContent);
      // Fallback to placeholder data
      apoioData = {
        current_moment: "Este é um tempo de transição e crescimento.",
        responsibility_relation: "A pessoa demonstra cuidado com suas responsabilidades.",
        fatigue_signals: ["Atenção ao ritmo de atividades"],
        family_situation: "Momento de atenção ao equilíbrio familiar.",
        suggested_questions: [
          "Como você tem se sentido neste momento?",
          "O que tem sido mais desafiador ultimamente?",
          "Como está o tempo dedicado à família?"
        ],
        care_pathways: [
          "Conversa pastoral de acolhimento",
          "Tempo de oração pessoal"
        ]
      };
    }

    // 8. Invalidate previous apoio_escuta records
    await supabase
      .from("discernir_apoio_escuta")
      .update({ is_valid: false })
      .eq("user_id", user.id)
      .eq("artifact_type", artifact_type);

    // 9. Save new Apoio de Escuta
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // Valid for 30 days

    const { data: newApoio, error: insertError } = await supabase
      .from("discernir_apoio_escuta")
      .insert({
        user_id: user.id,
        couple_id: coupleData?.id || null,
        parish_id: resolvedParishId,
        artifact_type,
        current_moment: apoioData.current_moment,
        responsibility_relation: apoioData.responsibility_relation,
        fatigue_signals: apoioData.fatigue_signals,
        family_situation: apoioData.family_situation,
        suggested_questions: apoioData.suggested_questions,
        care_pathways: apoioData.care_pathways,
        generated_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString(),
        identity_data_snapshot_at: new Date().toISOString(),
        is_valid: true,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error saving Apoio de Escuta:", insertError);
      return new Response(JSON.stringify({ error: "Erro ao salvar Apoio de Escuta" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Apoio de Escuta generated successfully:", newApoio.id);

    return new Response(JSON.stringify({ 
      success: true, 
      apoio: newApoio,
      message: "Apoio de Escuta gerado com sucesso" 
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(JSON.stringify({ error: "Erro interno do servidor" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
