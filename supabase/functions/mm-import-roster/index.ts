import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Voce extrai a lista de trabalhadores (escala/quadrante) de um retiro catolico (ECC, Segue-me, Vem e similares) a partir de texto e/ou imagens.

REGRA DE CORTE (muito importante):
- Comece a extrair SOMENTE a partir da secao que inicia em "DIRIGENTE ECC" (o dirigente da paroquia/encontro local) e tudo que vem DEPOIS.
- IGNORE totalmente o que vem antes: capa, oracoes, convites, e as listas nacionais (ex.: "DIRIGENTES DO ECC ECC BRASIL", "CASAL SECRETARIA NACIONAL", "CASAL ASSESSOR ...").

ESTRUTURA:
- O documento e dividido em EQUIPES. O titulo da equipe vem em MAIUSCULAS (ex.: "CAFE E MINI MERCADO", "COMPRAS", "ORDEM", "LITURGIA E VIGILIA", "SECRETARIA", "COZINHA", "ACOLHIDA", "CIRCULOS", "COORDENACAO GERAL", "SALA"). Tambem existem casais de funcao (ex.: "CASAL FICHAS", "CASAL FINANCAS", "CASAL MONTAGEM", "CASAL PALESTRA", "CASAL POS-ENCONTRO") — cada um e uma equipe com 1 casal.
- Dentro de cada equipe ha blocos "COORDENADORES" e "ENCONTREIROS". As pessoas dos DOIS blocos pertencem aquela equipe.

PESSOAS:
- Casais: o titular (homem) costuma vir marcado com "*". A esposa vem logo na linha seguinte. Cada pessoa do casal e UMA pessoa separada na saida.
- Para cada pessoa do casal, defina kind = "casal" e preencha spouse_name com o nome completo do conjuge.
- Pessoa sozinha (jovem, solteiro) -> kind = "individual" ou "jovem". Padre / Diretor Espiritual -> kind = "padre" (sem conjuge).
- nickname = o apelido/nome de tratamento (geralmente em MAIUSCULAS ao lado do nome, ex.: FELIPE, INGRID).
- phone = primeiro telefone da pessoa, formato brasileiro (ex.: "61 98103-0157"). Se nao houver, "".
- birth_date e wedding_date = datas no formato dd/mm quando aparecerem. Se incerto, "".
- role = "coordenador", "encontreiro", "dirigente" ou "diretor_espiritual" conforme o bloco/secao.

NOME DA EQUIPE: normalize para Title Case legivel mantendo acentos (ex.: "LITURGIA E VIGILIA" -> "Liturgia e Vigília").

SAIDA: responda APENAS com um JSON valido, sem markdown, sem comentarios, exatamente neste formato:
{"teams":[{"name":"Nome da Equipe","people":[{"name":"Nome Completo","nickname":"","phone":"","birth_date":"","wedding_date":"","kind":"casal","role":"encontreiro","spouse_name":""}]}]}

Extraia TODAS as pessoas que encontrar (de todas as equipes, da Dirigente em diante).`;

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

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Não autorizado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { text, images, movementHint } = await req.json();
    const hasText = typeof text === "string" && text.trim().length > 0;
    const hasImages = Array.isArray(images) && images.length > 0;
    if (!hasText && !hasImages) {
      return new Response(JSON.stringify({ error: "Envie texto ou imagens para importar" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!lovableApiKey) {
      return new Response(JSON.stringify({ error: "Serviço de IA indisponível." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userContent: any[] = [
      {
        type: "text",
        text: `Extraia o quadrante de trabalhadores deste retiro${
          movementHint ? ` (movimento: ${movementHint})` : ""
        }. Lembre: comece em "DIRIGENTE ECC" e ignore capas e listas nacionais.${
          hasText ? `\n\nCONTEUDO:\n${String(text).slice(0, 120000)}` : ""
        }`,
      },
    ];
    if (hasImages) {
      for (const url of images.slice(0, 15)) {
        userContent.push({ type: "image_url", image_url: { url } });
      }
    }

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userContent },
        ],
        max_tokens: 8000,
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("[mm-import] gateway error", aiResponse.status, errText);
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Muitas requisições. Tente em instantes." }), {
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
      return new Response(JSON.stringify({ error: "Falha na leitura do arquivo." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiResult = await aiResponse.json();
    const content: string = aiResult?.choices?.[0]?.message?.content || "";
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("[mm-import] sem JSON na resposta:", content.slice(0, 400));
      return new Response(JSON.stringify({ error: "Não consegui identificar a lista no arquivo." }), {
        status: 422,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let parsed: any;
    try {
      parsed = JSON.parse(jsonMatch[0]);
    } catch (_e) {
      console.error("[mm-import] JSON invalido:", jsonMatch[0].slice(0, 400));
      return new Response(JSON.stringify({ error: "Resposta da IA inválida." }), {
        status: 422,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const teams = Array.isArray(parsed?.teams) ? parsed.teams : [];
    const totalPeople = teams.reduce(
      (acc: number, t: any) => acc + (Array.isArray(t.people) ? t.people.length : 0),
      0
    );
    console.log(`[mm-import] user ${user.id}: ${teams.length} equipes, ${totalPeople} pessoas`);

    return new Response(JSON.stringify({ success: true, teams }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("[mm-import] erro:", error?.message || error);
    return new Response(JSON.stringify({ error: "Erro interno na importação." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
