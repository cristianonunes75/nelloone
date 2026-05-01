// Edge Function: discernir-generate-circle-combination
// Gera, via Lovable AI Gateway, uma leitura pastoral da combinação de
// um conjunto de membros num círculo (forças, riscos, papel concreto
// de cada um, recomendação prática). Linguagem não-clínica.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface MemberInput {
  user_id: string;
  display_name: string;
  primary_role: string;
  secondary_role: string | null;
  percentages: {
    lideranca: number;
    acolhimento: number;
    comunicacao: number;
    equipe: number;
    espiritualidade: number;
    conducao: number;
  };
}

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function buildSignature(members: MemberInput[]): {
  hash: Promise<string>;
  ids: string[];
} {
  const sorted = [...members].sort((a, b) =>
    a.user_id.localeCompare(b.user_id),
  );
  const sig = sorted
    .map((m) => {
      const p = m.percentages;
      return [
        m.user_id,
        m.primary_role,
        m.secondary_role || "",
        Math.round(p.lideranca),
        Math.round(p.acolhimento),
        Math.round(p.comunicacao),
        Math.round(p.equipe),
        Math.round(p.espiritualidade),
        Math.round(p.conducao),
      ].join(":");
    })
    .join("|");
  return { hash: sha256Hex(sig), ids: sorted.map((m) => m.user_id) };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get(
      "SUPABASE_SERVICE_ROLE_KEY",
    )!;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "LOVABLE_API_KEY not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Verifica usuário
    const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = userData.user.id;

    // Service role para checar coordenador e gravar cache
    const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data: isAdmin } = await adminClient.rpc("has_role", {
      _user_id: userId,
      _role: "admin",
    });
    let allowed = !!isAdmin;
    if (!allowed) {
      const { data: priest } = await adminClient
        .from("discernir_priests")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();
      allowed = !!priest;
    }
    if (!allowed) {
      return new Response(
        JSON.stringify({ error: "Apenas coordenação do Discernir." }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const body = await req.json();
    const members = body.members as MemberInput[];
    const force = !!body.force;

    if (!Array.isArray(members) || members.length < 2 || members.length > 12) {
      return new Response(
        JSON.stringify({
          error: "members deve ter entre 2 e 12 participantes.",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const { hash, ids } = buildSignature(members);
    const signatureHash = await hash;

    // Cache
    if (!force) {
      const { data: cached } = await adminClient
        .from("discernir_circle_combinations")
        .select("result_json, created_at")
        .eq("signature_hash", signatureHash)
        .maybeSingle();
      if (cached) {
        return new Response(
          JSON.stringify({
            result: cached.result_json,
            cached: true,
            created_at: cached.created_at,
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
    }

    // Monta prompt
    const memberLines = members
      .map((m) => {
        const p = m.percentages;
        return `- ${m.display_name} | papel principal: ${m.primary_role}${
          m.secondary_role ? ` | secundário: ${m.secondary_role}` : ""
        } | Liderança ${Math.round(p.lideranca)}% • Acolhimento ${Math.round(
          p.acolhimento,
        )}% • Comunicação ${Math.round(p.comunicacao)}% • Equipe ${Math.round(
          p.equipe,
        )}% • Espiritualidade ${Math.round(
          p.espiritualidade,
        )}% • Condução ${Math.round(p.conducao)}%`;
      })
      .join("\n");

    const systemPrompt = `Você é um auxiliar pastoral que ajuda coordenadores de círculos jovens católicos a entender como um grupo específico tende a funcionar quando reunido.

Regras inegociáveis:
- Linguagem pastoral, não-clínica, não-diagnóstica. Use "tende a", "pode ajudar", "vale cuidar". Nunca "é", "não consegue", "tem transtorno".
- Não faça juízo espiritual sobre as pessoas. Não diga quem é mais santo.
- Não invente dados além dos percentuais e papéis informados.
- Português do Brasil, tratamento "você", curto e direto.
- Cada frase deve nascer da combinação real do grupo, não de clichês.`;

    const userPrompt = `Aqui está a composição de um círculo. Para cada membro temos o papel principal, o secundário e os 6 percentuais do Perfil de Serviço.

${memberLines}

Gere uma leitura pastoral da combinação deste grupo, com base nos dados acima.`;

    const aiResp = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "leitura_combinacao_circulo",
                description:
                  "Devolve a leitura pastoral da combinação do círculo.",
                parameters: {
                  type: "object",
                  properties: {
                    forcas_do_grupo: {
                      type: "array",
                      description:
                        "2 a 3 pontos do que esse círculo, juntos, terá de bom.",
                      items: { type: "string" },
                      minItems: 2,
                      maxItems: 4,
                    },
                    riscos_do_grupo: {
                      type: "array",
                      description:
                        "1 a 2 pontos cegos coletivos (ex.: 'ninguém com Espiritualidade alta').",
                      items: { type: "string" },
                      minItems: 1,
                      maxItems: 3,
                    },
                    quem_puxa_o_que: {
                      type: "array",
                      description:
                        "Para cada membro, qual papel concreto tende a ocupar neste círculo específico.",
                      items: {
                        type: "object",
                        properties: {
                          nome: { type: "string" },
                          papel_no_grupo: { type: "string" },
                        },
                        required: ["nome", "papel_no_grupo"],
                        additionalProperties: false,
                      },
                    },
                    recomendacao_pratica: {
                      type: "string",
                      description:
                        "Uma frase sobre como esse círculo deveria funcionar dado o perfil somado.",
                    },
                  },
                  required: [
                    "forcas_do_grupo",
                    "riscos_do_grupo",
                    "quem_puxa_o_que",
                    "recomendacao_pratica",
                  ],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: {
            type: "function",
            function: { name: "leitura_combinacao_circulo" },
          },
        }),
      },
    );

    if (aiResp.status === 429) {
      return new Response(
        JSON.stringify({
          error: "Limite de uso da IA atingido. Tente novamente em instantes.",
        }),
        {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }
    if (aiResp.status === 402) {
      return new Response(
        JSON.stringify({
          error:
            "Créditos de IA esgotados. Adicione créditos em Configurações > Workspace > Uso.",
        }),
        {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }
    if (!aiResp.ok) {
      const txt = await aiResp.text();
      console.error("AI gateway error:", aiResp.status, txt);
      return new Response(
        JSON.stringify({ error: "Falha ao gerar leitura por IA." }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const aiJson = await aiResp.json();
    const toolCall =
      aiJson?.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    if (!toolCall) {
      console.error("No tool call in response", JSON.stringify(aiJson));
      return new Response(
        JSON.stringify({ error: "Resposta da IA sem estrutura esperada." }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(toolCall);
    } catch {
      // tenta reparo simples
      try {
        parsed = JSON.parse(toolCall.replace(/,\s*([}\]])/g, "$1"));
      } catch (e) {
        console.error("Failed to parse tool args", toolCall);
        return new Response(
          JSON.stringify({ error: "Resposta inválida da IA." }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
    }

    // Salva no cache (upsert por signature_hash)
    await adminClient.from("discernir_circle_combinations").upsert(
      {
        signature_hash: signatureHash,
        member_user_ids: ids,
        result_json: parsed,
        generated_by: userId,
      },
      { onConflict: "signature_hash" },
    );

    return new Response(
      JSON.stringify({ result: parsed, cached: false }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("circle-combination error:", e);
    return new Response(
      JSON.stringify({
        error: e instanceof Error ? e.message : "Erro desconhecido",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
