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
- phone = primeiro telefone da pessoa, formato brasileiro (ex.: "61 98103-0157"). Se nao houver, deixe vazio.
- birth_date e wedding_date = datas no formato dd/mm quando aparecerem (geralmente a direita). Se incerto, deixe vazio.
- role = "coordenador", "encontreiro", "dirigente" ou "diretor_espiritual" conforme o bloco/secao.

NOME DA EQUIPE: normalize para Title Case legivel mantendo acentos (ex.: "Cafe e Mini Mercado" -> "Café e Mini Mercado", "LITURGIA E VIGILIA" -> "Liturgia e Vigília").

Extraia TODAS as pessoas que encontrar (de todas as equipes, da Dirigente em diante). Responda SEMPRE chamando a função extract_roster.`;

const TOOL = {
  type: "function",
  function: {
    name: "extract_roster",
    description: "Devolve as equipes e as pessoas extraidas do quadrante do retiro",
    parameters: {
      type: "object",
      properties: {
        teams: {
          type: "array",
          description: "Equipes do retiro, da Dirigente em diante",
          items: {
            type: "object",
            properties: {
              name: { type: "string", description: "Nome da equipe em Title Case" },
              people: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string", description: "Nome completo" },
                    nickname: { type: "string", description: "Apelido / como e chamado" },
                    phone: { type: "string", description: "Telefone principal" },
                    birth_date: { type: "string", description: "dd/mm" },
                    wedding_date: { type: "string", description: "dd/mm" },
                    kind: {
                      type: "string",
                      enum: ["casal", "jovem", "individual", "padre"],
                    },
                    role: { type: "string", description: "coordenador|encontreiro|dirigente|diretor_espiritual" },
                    spouse_name: { type: "string", description: "Nome completo do conjuge, se casal" },
                  },
                  required: ["name"],
                },
              },
            },
            required: ["name", "people"],
          },
        },
      },
      required: ["teams"],
    },
  },
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

    // Valida usuario logado
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

    const apiKey = Deno.env.get("OPENROUTER_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Serviço de IA indisponível (sem chave)." }), {
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

    const aiResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userContent },
        ],
        tools: [TOOL],
        tool_choice: { type: "function", function: { name: "extract_roster" } },
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
    const toolCall = aiResult?.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall || toolCall.function?.name !== "extract_roster") {
      console.error("[mm-import] sem tool_call", JSON.stringify(aiResult)?.slice(0, 500));
      return new Response(JSON.stringify({ error: "Não consegui identificar a lista no arquivo." }), {
        status: 422,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let parsed: any;
    try {
      parsed = JSON.parse(toolCall.function.arguments);
    } catch (_e) {
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
