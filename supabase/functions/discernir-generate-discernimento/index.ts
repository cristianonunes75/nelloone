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

    console.log(`[DISCERNIMENTO] Iniciando geração para user ${user.id}`);

    // 1. Buscar Código da Essência (mapa_essencia)
    const { data: mapa, error: mapaError } = await supabase
      .from("mapa_essencia")
      .select("sections, raw_content, version, created_at")
      .eq("user_id", user.id)
      .single();

    if (mapaError || !mapa) {
      return new Response(JSON.stringify({ error: "Código da Essência não encontrado. Gere seu Código da Essência no Identity primeiro." }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2. Buscar resultados de testes do Identity para contexto adicional
    const { data: testResults } = await supabase
      .from("test_results")
      .select("test_type, result_data, created_at")
      .eq("user_id", user.id)
      .in("test_type", ["disc", "temperamentos", "arquetipos", "inteligencias_multiplas", "linguagens_amor", "eneagrama", "mbti"]);

    // 3. Buscar perfil do usuário
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();

    const userName = profile?.full_name || "Peregrino";

    // 4. Montar contexto para a IA
    // sections é um array de objetos — extrair campos de texto relevantes
    const sectionsArray = Array.isArray(mapa.sections) ? mapa.sections : [];
    const sectionsText = sectionsArray.map((s: any) => {
      const fields = ['title', 'quem_voce_e', 'maior_forca', 'maior_risco', 'tensao_central',
        'direcao_90_dias', 'frase_sintese', 'content', 'summary', 'description'];
      const parts: string[] = [];
      if (s.title) parts.push(`[${s.title}]`);
      for (const f of fields) {
        if (s[f] && f !== 'title') parts.push(s[f]);
      }
      // arrays dentro da seção
      for (const key of Object.keys(s)) {
        if (Array.isArray(s[key])) {
          const items = s[key].map((item: any) =>
            typeof item === 'string' ? item : (item.content || item.title || JSON.stringify(item))
          );
          parts.push(...items);
        }
      }
      return parts.join(' | ');
    }).filter(Boolean).join('\n\n');

    const testsContext = (testResults || []).map(t => ({
      tipo: t.test_type,
      resultado: t.result_data,
    }));

    const prompt = `Você é um assistente de discernimento espiritual cristão.
Com base no Código da Essência de ${userName} (perfil de autoconhecimento profundo), gere um Perfil de Discernimento Espiritual estruturado.

IMPORTANTE:
- Linguagem contemplativa, acolhedora e espiritual
- Nunca diagnosticar, nunca julgar
- Baseado exclusivamente nos dados abaixo — cite traços específicos do perfil
- Sem referências a marcas ou sistemas específicos
- Máximo 3 pontos por seção (exceto perguntas: exatamente 5)

CÓDIGO DA ESSÊNCIA DE ${userName.toUpperCase()} (seções do relatório de autoconhecimento):
${sectionsText}

RESULTADOS DOS TESTES COMPLEMENTARES:
${JSON.stringify(testsContext, null, 2)}

Retorne APENAS um JSON válido com esta estrutura exata:
{
  "apresentacao": "Texto introdutório personalizado de 2-3 frases para ${userName}",
  "tendencias_personalidade": [
    "Tendência humana observada 1",
    "Tendência humana observada 2",
    "Tendência humana observada 3"
  ],
  "tensoes_interiores": [
    "Tensão interior provável 1",
    "Tensão interior provável 2",
    "Tensão interior provável 3"
  ],
  "riscos_espirituais": [
    "Risco espiritual baseado no perfil 1",
    "Risco espiritual baseado no perfil 2",
    "Risco espiritual baseado no perfil 3"
  ],
  "potenciais_vocacao": [
    "Potencial de vocação ou dom observado 1",
    "Potencial de vocação ou dom observado 2",
    "Potencial de vocação ou dom observado 3"
  ],
  "perguntas_direcao": [
    "Pergunta para direção espiritual 1",
    "Pergunta para direção espiritual 2",
    "Pergunta para direção espiritual 3",
    "Pergunta para direção espiritual 4",
    "Pergunta para direção espiritual 5"
  ]
}`;

    // 5. Chamar Gemini via OpenAI-compatible endpoint
    const geminiApiKey = Deno.env.get("GEMINI_API_KEY") || Deno.env.get("OPENAI_API_KEY");
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");

    let aiResponse: any = null;

    // Tentar Gemini primeiro, fallback para OpenAI
    try {
      const geminiKey = Deno.env.get("GEMINI_API_KEY");
      if (geminiKey) {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { temperature: 0.7, maxOutputTokens: 2000 },
            }),
          }
        );
        const geminiData = await res.json();
        const text = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "";
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          aiResponse = JSON.parse(jsonMatch[0]);
        }
      }
    } catch (e) {
      console.error("[DISCERNIMENTO] Gemini error:", e);
    }

    // Fallback: OpenAI
    if (!aiResponse && openaiApiKey) {
      try {
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${openaiApiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            response_format: { type: "json_object" },
          }),
        });
        const openaiData = await res.json();
        const text = openaiData?.choices?.[0]?.message?.content || "{}";
        aiResponse = JSON.parse(text);
      } catch (e) {
        console.error("[DISCERNIMENTO] OpenAI error:", e);
      }
    }

    if (!aiResponse) {
      return new Response(JSON.stringify({ error: "Erro ao gerar relatório. Tente novamente." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 6. Montar texto completo para PDF
    const relatorioTexto = `PERFIL DE DISCERNIMENTO ESPIRITUAL
${userName}

⚠️ Este documento é um instrumento de reflexão espiritual. Ele não substitui acompanhamento pastoral, direção espiritual ou discernimento pessoal diante de Deus.

---

APRESENTAÇÃO

${aiResponse.apresentacao}

Este documento não define sua identidade. Ele traduz tendências humanas observadas no seu Código da Essência em pontos de reflexão espiritual. Seu objetivo é ajudar conversas de discernimento com diretor espiritual.

---

1. TENDÊNCIAS DA PERSONALIDADE
${(aiResponse.tendencias_personalidade || []).map((t: string) => `• ${t}`).join("\n")}

---

2. TENSÕES INTERIORES PROVÁVEIS
${(aiResponse.tensoes_interiores || []).map((t: string) => `• ${t}`).join("\n")}

---

3. RISCOS ESPIRITUAIS
${(aiResponse.riscos_espirituais || []).map((t: string) => `• ${t}`).join("\n")}

---

4. POTENCIAIS DE VOCAÇÃO
${(aiResponse.potenciais_vocacao || []).map((t: string) => `• ${t}`).join("\n")}

---

5. PERGUNTAS PARA DIREÇÃO ESPIRITUAL
${(aiResponse.perguntas_direcao || []).map((t: string, i: number) => `${i + 1}. ${t}`).join("\n")}

---

Gerado em: ${new Date().toLocaleDateString("pt-BR")}
Baseado no Código da Essência — Nello One`;

    // 7. Salvar no banco (upsert)
    const dadosBase = {
      mapa_sections: mapaSections,
      mapa_version: mapa.version,
      mapa_created_at: mapa.created_at,
      tests_snapshot: testsContext,
    };

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
        dados_base_codigo: dadosBase,
        apresentacao: aiResponse.apresentacao,
        tendencias_personalidade: aiResponse.tendencias_personalidade || [],
        tensoes_interiores: aiResponse.tensoes_interiores || [],
        riscos_espirituais: aiResponse.riscos_espirituais || [],
        potenciais_vocacao: aiResponse.potenciais_vocacao || [],
        perguntas_direcao: aiResponse.perguntas_direcao || [],
        relatorio_texto: relatorioTexto,
        generated_at: new Date().toISOString(),
        version: newVersion,
        generation_metadata: {
          model: "gemini-2.0-flash",
          generated_at: new Date().toISOString(),
          mapa_version: mapa.version,
        },
      }, { onConflict: "user_id" })
      .select()
      .single();

    if (saveError) {
      console.error("[DISCERNIMENTO] Save error:", saveError);
      return new Response(JSON.stringify({ error: "Erro ao salvar relatório" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`[DISCERNIMENTO] Gerado com sucesso para user ${user.id}, versão ${newVersion}`);

    return new Response(JSON.stringify({ success: true, data: saved }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("[DISCERNIMENTO] Unexpected error:", error);
    return new Response(JSON.stringify({ error: "Erro interno" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
