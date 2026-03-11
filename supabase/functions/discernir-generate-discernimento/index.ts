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

    console.log(`[DISC] Iniciando para user ${user.id}`);

    const { data: mapa, error: mapaError } = await supabase
      .from("mapa_essencia")
      .select("sections, raw_content, version, created_at")
      .eq("user_id", user.id)
      .single();

    if (mapaError || !mapa) {
      console.error("[DISC] mapa_essencia not found:", mapaError);
      return new Response(JSON.stringify({ error: "Código da Essência não encontrado." }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`[DISC] mapa found, sections type: ${typeof mapa.sections}, isArray: ${Array.isArray(mapa.sections)}`);

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .maybeSingle();

    const userName = profile?.full_name || "Peregrino";

    const sectionsArray = Array.isArray(mapa.sections) ? mapa.sections as any[] : [];
    console.log(`[DISC] sectionsArray length: ${sectionsArray.length}`);

    const resumo = sectionsArray.find((s: any) => s.id === "resumo_executivo") || sectionsArray[0] || {};
    const contextText = [
      resumo.quem_voce_e,
      resumo.maior_forca,
      resumo.maior_risco,
      resumo.tensao_central,
      resumo.frase_sintese,
      resumo.direcao_90_dias,
      ...(Array.isArray(resumo.tres_forcas_centrais) ? resumo.tres_forcas_centrais : []),
    ].filter(Boolean).join("\n");

    console.log(`[DISC] contextText: "${contextText.slice(0, 100)}"`);

    const prompt = `Você é um assistente de discernimento espiritual cristão. Gere um Perfil de Discernimento Espiritual para ${userName}.

PERFIL:
${contextText || "Pessoa em busca de discernimento espiritual"}

Retorne APENAS JSON válido sem markdown:
{"apresentacao":"texto 2-3 frases sobre a pessoa","tendencias_personalidade":["item1","item2","item3"],"tensoes_interiores":["item1","item2","item3"],"riscos_espirituais":["item1","item2","item3"],"potenciais_vocacao":["item1","item2","item3"],"perguntas_direcao":["p1","p2","p3","p4","p5"]}`;

    // 5. Chamar IA via OpenRouter
    const lovableApiKey = Deno.env.get("OPENROUTER_API_KEY");
    console.log(`[DISC] lovableApiKey present: ${!!lovableApiKey}`);
    console.log(`[DISC] contextText length: ${contextText.length}`);

    let aiResponse: any = null;

    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${lovableApiKey}`,
        },
        body: JSON.stringify({
          model: "google/gemini-2.0-flash",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          max_tokens: 1500,
        }),
      });
      console.log(`[DISC] gateway status: ${res.status}`);
      const data = await res.json();
      if (!res.ok) {
        console.error(`[DISC] gateway error body:`, JSON.stringify(data));
      } else {
        const text = data?.choices?.[0]?.message?.content || "";
        console.log(`[DISC] response text length: ${text.length}, preview: "${text.slice(0, 100)}"`);
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.apresentacao) {
            aiResponse = parsed;
            console.log(`[DISC] parsed keys: ${Object.keys(aiResponse).join(", ")}`);
          } else {
            console.error(`[DISC] parsed but missing apresentacao. Keys: ${Object.keys(parsed).join(", ")}`);
          }
        } else {
          console.error(`[DISC] no JSON in response: "${text.slice(0, 300)}"`);
        }
      }
    } catch (e: any) {
      console.error(`[DISC] gateway exception: ${e.message || e}`);
    }

    if (!aiResponse) {
      console.error("[DISC] IA falhou.");
      return new Response(JSON.stringify({ error: "Erro ao gerar relatório. Tente novamente." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const relatorioTexto = `PERFIL DE DISCERNIMENTO ESPIRITUAL\n${userName}\n\nAPRESENTAÇÃO\n${aiResponse.apresentacao}`;

    const { data: existing } = await supabase
      .from("discernimento_espiritual")
      .select("id, version")
      .eq("user_id", user.id)
      .maybeSingle();

    const newVersion = (existing?.version || 0) + 1;

    const { data: saved, error: saveError } = await supabase
      .from("discernimento_espiritual")
      .upsert({
        user_id: user.id,
        dados_base_codigo: { mapa_version: mapa.version },
        apresentacao: aiResponse.apresentacao || "",
        tendencias_personalidade: aiResponse.tendencias_personalidade || [],
        tensoes_interiores: aiResponse.tensoes_interiores || [],
        riscos_espirituais: aiResponse.riscos_espirituais || [],
        potenciais_vocacao: aiResponse.potenciais_vocacao || [],
        perguntas_direcao: aiResponse.perguntas_direcao || [],
        relatorio_texto: relatorioTexto,
        generated_at: new Date().toISOString(),
        version: newVersion,
        generation_metadata: { model: "gemini", generated_at: new Date().toISOString() },
      }, { onConflict: "user_id" })
      .select()
      .single();

    if (saveError) {
      console.error("[DISC] Save error:", saveError);
      return new Response(JSON.stringify({ error: "Erro ao salvar" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`[DISC] Sucesso! user ${user.id}, versão ${newVersion}`);
    return new Response(JSON.stringify({ success: true, data: saved }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error("[DISC] Unexpected error:", error?.message || error);
    return new Response(JSON.stringify({ error: "Erro interno" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
