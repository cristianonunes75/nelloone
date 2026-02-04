import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
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
      return new Response(JSON.stringify({ error: "Não autorizado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Generating Cruzamento for user ${user.id}`);

    // 1. Verify conjugal consent
    const { data: consent } = await supabase
      .from("discernir_consents")
      .select("*")
      .eq("user_id", user.id)
      .eq("consent_type", "conjugal")
      .eq("is_active", true)
      .is("revoked_at", null)
      .maybeSingle();

    if (!consent) {
      return new Response(JSON.stringify({ error: "Consentimento conjugal não encontrado" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2. Get couple info
    const { data: couple, error: coupleError } = await supabase
      .from("discernir_couples")
      .select("*")
      .or(`spouse_a_user_id.eq.${user.id},spouse_b_user_id.eq.${user.id}`)
      .eq("status", "active")
      .maybeSingle();

    if (coupleError || !couple) {
      return new Response(JSON.stringify({ error: "Casal não encontrado" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const spouseAId = couple.spouse_a_user_id;
    const spouseBId = couple.spouse_b_user_id;

    if (!spouseAId || !spouseBId) {
      return new Response(JSON.stringify({ error: "Casal incompleto - ambos os cônjuges precisam estar cadastrados" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 3. Verify both have conjugal consent
    const { data: bothConsents } = await supabase
      .from("discernir_consents")
      .select("user_id")
      .in("user_id", [spouseAId, spouseBId])
      .eq("consent_type", "conjugal")
      .eq("is_active", true)
      .is("revoked_at", null);

    if (!bothConsents || bothConsents.length < 2) {
      return new Response(JSON.stringify({ error: "Ambos os cônjuges precisam dar consentimento conjugal" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 4. Fetch IDENTITY data for both spouses
    const fetchIdentityData = async (userId: string) => {
      const { data: tests } = await supabase
        .from("user_tests")
        .select("test_id, result_data, tests:test_id (name)")
        .eq("user_id", userId)
        .eq("status", "completed");

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", userId)
        .maybeSingle();

      const { data: mapa } = await supabase
        .from("mapa_essencia")
        .select("sections")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      const identityData: Record<string, unknown> = {};
      for (const test of tests || []) {
        const testName = (test.tests as any)?.name?.toLowerCase() || "";
        if (testName.includes("disc")) identityData.disc = test.result_data;
        if (testName.includes("temperamento")) identityData.temperamentos = test.result_data;
        if (testName.includes("eneagrama")) identityData.enneagram = test.result_data;
      }
      if (mapa?.sections) identityData.mapaEssencia = mapa.sections;

      return { name: profile?.full_name || "Cônjuge", data: identityData };
    };

    const spouseA = await fetchIdentityData(spouseAId);
    const spouseB = await fetchIdentityData(spouseBId);

    console.log("Identity data collected for both spouses");

    // 5. Generate Cruzamento using Lovable AI
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "Configuração de IA não encontrada" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const systemPrompt = `Você é um assistente pastoral especializado em apoiar a escuta de casais.

REGRAS INEGOCIÁVEIS DO CRUZAMENTO ESSENCIAL DE PROTEÇÃO:
- NUNCA avaliar compatibilidade
- NUNCA diagnosticar desalinhamento
- NUNCA analisar personalidades
- NUNCA dar conclusões sobre maturidade conjugal
- NUNCA comparar os cônjuges
- SEMPRE focar em PROTEÇÃO do casal
- SEMPRE usar linguagem acolhedora e esperançosa

OS 3 ÚNICOS EIXOS PERMITIDOS:

1. RITMO DO CASAL (❤️)
- Tempo, energia, descanso, carga de atividades
- Linguagem: "Hoje vocês podem estar vivendo ritmos diferentes, o que pede conversa e cuidado."

2. FAMÍLIA X SERVIÇO (🏠)
- Impacto do serviço no lar, risco de inversão de prioridades
- Linguagem: "Talvez este seja um tempo de proteger mais o casal antes de assumir novas demandas."

3. FORMA DE DECIDIR JUNTOS (🤝)
- Diálogo, escuta mútua, tomada de decisão compartilhada
- Linguagem: "Esse ponto pode ser conversado juntos, com calma, na presença de Deus."

Retorne um JSON com:
{
  "rhythm_axis": {
    "observation": "Observação sobre o ritmo do casal (2-3 frases)",
    "attention_points": ["Ponto 1", "Ponto 2"],
    "suggestion": "Sugestão de cuidado"
  },
  "family_service_axis": {
    "observation": "Observação sobre equilíbrio família-serviço (2-3 frases)",
    "attention_points": ["Ponto 1", "Ponto 2"],
    "suggestion": "Sugestão de proteção"
  },
  "decision_axis": {
    "observation": "Observação sobre decisões em conjunto (2-3 frases)",
    "attention_points": ["Ponto 1", "Ponto 2"],
    "suggestion": "Sugestão de diálogo"
  },
  "overall_care_note": "Nota geral de cuidado pastoral (2-3 frases acolhedoras)"
}`;

    const userPrompt = `Gere o Cruzamento Essencial de Proteção para este casal:

${spouseA.name}:
${JSON.stringify(spouseA.data, null, 2)}

${spouseB.name}:
${JSON.stringify(spouseB.data, null, 2)}

Lembre-se:
- Foque em PROTEÇÃO, não avaliação
- Use os 3 eixos permitidos
- Linguagem pastoral e acolhedora

Retorne APENAS o JSON válido.`;

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
        return new Response(JSON.stringify({ error: "Limite de requisições excedido" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ error: "Erro na geração do Cruzamento" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices?.[0]?.message?.content || "";

    let cruzamentoData;
    try {
      const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cruzamentoData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found");
      }
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
      cruzamentoData = {
        rhythm_axis: {
          observation: "Este é um tempo para observar o ritmo de vida do casal.",
          attention_points: ["Atenção ao descanso conjunto"],
          suggestion: "Reservem tempo para estar juntos sem compromissos."
        },
        family_service_axis: {
          observation: "O equilíbrio entre família e serviço merece atenção.",
          attention_points: ["Proteger o tempo em família"],
          suggestion: "Conversem sobre prioridades neste momento."
        },
        decision_axis: {
          observation: "As decisões importantes pedem diálogo e oração.",
          attention_points: ["Escuta mútua"],
          suggestion: "Dediquem tempo para conversar com calma."
        },
        overall_care_note: "Este casal está em um momento que pede cuidado e atenção mútua. Que Deus os abençoe nesta jornada."
      };
    }

    // 6. Invalidate previous cruzamento
    await supabase
      .from("discernir_apoio_escuta")
      .update({ is_valid: false })
      .eq("couple_id", couple.id)
      .eq("artifact_type", "conjugal");

    // 7. Save cruzamento
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const { data: newCruzamento, error: insertError } = await supabase
      .from("discernir_apoio_escuta")
      .insert({
        user_id: user.id,
        couple_id: couple.id,
        parish_id: couple.parish_id,
        artifact_type: "conjugal",
        rhythm_axis: cruzamentoData.rhythm_axis,
        family_service_axis: cruzamentoData.family_service_axis,
        decision_axis: cruzamentoData.decision_axis,
        current_moment: cruzamentoData.overall_care_note,
        generated_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString(),
        identity_data_snapshot_at: new Date().toISOString(),
        is_valid: true,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error saving Cruzamento:", insertError);
      return new Response(JSON.stringify({ error: "Erro ao salvar Cruzamento" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Cruzamento generated successfully:", newCruzamento.id);

    return new Response(JSON.stringify({ 
      success: true, 
      cruzamento: newCruzamento,
      message: "Cruzamento Essencial gerado com sucesso" 
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
