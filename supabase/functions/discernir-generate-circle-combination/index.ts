// Edge Function: discernir-generate-circle-combination (v2)
// Gera, via Lovable AI Gateway, uma leitura pastoral da combinação de
// um conjunto de membros num círculo. Agora recebe matriz de
// compatibilidade par a par e estatísticas do grupo, e a IA é obrigada
// a citar nomes e percentuais reais — proibido genérico.

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
  participant_type?: string | null;
  spouse_user_id?: string | null;
  percentages: {
    lideranca: number;
    acolhimento: number;
    comunicacao: number;
    equipe: number;
    espiritualidade: number;
    conducao: number;
  };
}

const BLOCOS = [
  "lideranca",
  "acolhimento",
  "comunicacao",
  "equipe",
  "espiritualidade",
  "conducao",
] as const;
type BlockKey = typeof BLOCOS[number];

const BLOCO_LABEL: Record<BlockKey, string> = {
  lideranca: "Liderança",
  acolhimento: "Acolhimento",
  comunicacao: "Comunicação",
  equipe: "Equipe",
  espiritualidade: "Espiritualidade",
  conducao: "Condução",
};

const ALTO = 75;
const BAIXO = 50;

const SCHEMA_VERSION = "v3";

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
  const sig =
    SCHEMA_VERSION +
    "|" +
    sorted
      .map((m) => {
        const p = m.percentages;
        return [
          m.user_id,
          m.primary_role,
          m.secondary_role || "",
          m.participant_type || "",
          m.spouse_user_id || "",
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

function pct(m: MemberInput, b: BlockKey): number {
  return Math.round(m.percentages[b] || 0);
}

function altosOf(m: MemberInput): BlockKey[] {
  return BLOCOS.filter((b) => pct(m, b) >= ALTO);
}

function baixosOf(m: MemberInput): BlockKey[] {
  return BLOCOS.filter((b) => pct(m, b) < BAIXO);
}

function pairScore(a: MemberInput, b: MemberInput): {
  score: number;
  tipo: string;
  blocos_que_se_complementam: { bloco: string; quem_supre: string }[];
  blocos_em_comum_alto: string[];
} {
  const altosA = altosOf(a);
  const altosB = altosOf(b);
  const baixosA = baixosOf(a);
  const baixosB = baixosOf(b);

  let comp = 0;
  const blocosComplementam: { bloco: string; quem_supre: string }[] = [];

  for (const blk of baixosA) {
    if (altosB.includes(blk)) {
      comp += 8;
      blocosComplementam.push({
        bloco: BLOCO_LABEL[blk],
        quem_supre: b.display_name,
      });
    } else if (pct(b, blk) >= 60) {
      comp += 4;
    }
  }
  for (const blk of baixosB) {
    if (altosA.includes(blk)) {
      comp += 8;
      blocosComplementam.push({
        bloco: BLOCO_LABEL[blk],
        quem_supre: a.display_name,
      });
    } else if (pct(a, blk) >= 60) {
      comp += 4;
    }
  }
  comp = Math.min(50, comp);

  let espirit = 0;
  const espA = pct(a, "espiritualidade");
  const espB = pct(b, "espiritualidade");
  if (espA >= 60 && espB >= 60) {
    espirit = Math.min(12, Math.round(((espA + espB) / 2 - 50) * 0.4));
  }

  const altosUnion = new Set<string>([...altosA, ...altosB]);
  const altosIntersect = altosA.filter((x) => altosB.includes(x));
  const cobertura = Math.min(
    18,
    altosUnion.size * 4 - altosIntersect.length * 2,
  );

  let distSq = 0;
  for (const blk of BLOCOS) {
    const d = pct(a, blk) - pct(b, blk);
    distSq += d * d;
  }
  const dist = Math.sqrt(distSq / BLOCOS.length);
  const distScore = Math.max(0, Math.min(20, 20 - Math.abs(dist - 22) * 0.7));

  const baixosIntersect = baixosA.filter((x) => baixosB.includes(x)).length;
  let espelho = 0;
  if (altosIntersect.length >= 2 && baixosIntersect >= 2) {
    espelho = -Math.min(
      15,
      (altosIntersect.length + baixosIntersect) * 2,
    );
  }

  const raw = comp + espirit + Math.max(0, cobertura) + distScore + espelho;
  const score = Math.max(0, Math.min(100, Math.round(raw)));

  let tipo: string;
  if (score >= 75) tipo = "complementar";
  else if (score >= 55) tipo = "bom encaixe";
  else if (score >= 40) tipo = "encaixe parcial";
  else tipo = "tensão a cuidar";

  return {
    score,
    tipo,
    blocos_que_se_complementam: blocosComplementam,
    blocos_em_comum_alto: altosIntersect.map((b) => BLOCO_LABEL[b]),
  };
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

    // Estatísticas do grupo
    const averages = {} as Record<BlockKey, number>;
    const altosCount = {} as Record<BlockKey, number>;
    for (const blk of BLOCOS) {
      let sum = 0;
      let altosN = 0;
      for (const m of members) {
        const v = pct(m, blk);
        sum += v;
        if (v >= ALTO) altosN += 1;
      }
      averages[blk] = Math.round(sum / members.length);
      altosCount[blk] = altosN;
    }
    const saturated = BLOCOS.filter((b) => altosCount[b] >= 3).map(
      (b) => BLOCO_LABEL[b],
    );
    const gaps = BLOCOS.filter((b) => altosCount[b] === 0).map(
      (b) => BLOCO_LABEL[b],
    );

    // Linhas de membros
    const memberLines = members
      .map((m) => {
        const p = m.percentages;
        const tipo = m.participant_type
          ? ` [${m.participant_type === "casal" ? "casal" : "jovem"}]`
          : "";
        return `- ${m.display_name}${tipo} | papel principal: ${m.primary_role}${
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

    // Vínculos de casal
    const couples: string[] = [];
    const seenCouple = new Set<string>();
    for (const m of members) {
      if (m.participant_type === "casal" && m.spouse_user_id) {
        const key = [m.user_id, m.spouse_user_id].sort().join(":");
        if (seenCouple.has(key)) continue;
        seenCouple.add(key);
        const sp = members.find((x) => x.user_id === m.spouse_user_id);
        if (sp) couples.push(`${m.display_name} ↔ ${sp.display_name}`);
      }
    }

    // Helper: dois membros são cônjuges (vínculo recíproco)?
    const isSpousePair = (a: MemberInput, b: MemberInput): boolean => {
      return (
        a.participant_type === "casal" &&
        b.participant_type === "casal" &&
        a.spouse_user_id === b.user_id &&
        b.spouse_user_id === a.user_id
      );
    };

    // Matriz de pares (todos contra todos) — exclui pares cônjuge↔cônjuge,
    // pois o casal é unidade indivisível e não deve ser tratado como
    // possível "match" recombinável.
    const pairMatrix: string[] = [];
    const topPairs: { ab: string; score: number; tipo: string; obs: string }[] = [];
    for (let i = 0; i < members.length; i += 1) {
      for (let j = i + 1; j < members.length; j += 1) {
        const a = members[i];
        const b = members[j];
        if (isSpousePair(a, b)) continue; // casal nunca entra como par recombinável
        const r = pairScore(a, b);
        const compl = r.blocos_que_se_complementam
          .map((x) => `${x.bloco} suprido por ${x.quem_supre}`)
          .join("; ");
        const comum = r.blocos_em_comum_alto.length
          ? ` | em comum (alto): ${r.blocos_em_comum_alto.join(", ")}`
          : "";
        pairMatrix.push(
          `- ${a.display_name} × ${b.display_name}: ${r.score}% (${r.tipo})${
            compl ? ` | complementam: ${compl}` : ""
          }${comum}`,
        );
        topPairs.push({
          ab: `${a.display_name} + ${b.display_name}`,
          score: r.score,
          tipo: r.tipo,
          obs: compl || r.blocos_em_comum_alto.join(", ") || "perfis distantes",
        });
      }
    }
    topPairs.sort((x, y) => y.score - x.score);

    const statsLines = [
      `Médias do grupo: ${BLOCOS.map((b) => `${BLOCO_LABEL[b]} ${averages[b]}%`).join(" • ")}`,
      saturated.length > 0
        ? `Blocos saturados (3+ pessoas em alta): ${saturated.join(", ")}.`
        : `Sem blocos saturados.`,
      gaps.length > 0
        ? `Lacunas (ninguém alto): ${gaps.join(", ")}.`
        : `Sem lacunas estruturais — todos os blocos têm ao menos 1 pessoa forte.`,
      couples.length > 0
        ? `Casais no círculo: ${couples.join("; ")}.`
        : `Sem casais marcados.`,
    ].join("\n");

    const systemPrompt = `Você é um auxiliar pastoral que ajuda coordenadores de círculos jovens católicos a entender como um grupo específico tende a funcionar quando reunido.

Regras inegociáveis:
- Linguagem pastoral, não-clínica, não-diagnóstica. Use "tende a", "pode ajudar", "vale cuidar". Nunca "é", "não consegue", "tem transtorno".
- Não faça juízo espiritual sobre as pessoas. Não diga quem é mais santo.
- Não invente dados além dos percentuais, papéis, vínculos e scores informados.
- Português do Brasil, tratamento "você", curto e direto.
- PROIBIDO genérico: cada frase deve citar pelo menos UM nome próprio OU UM bloco com percentual real OU um par específico (ex.: "Arthur + Rafael"). Frases que caberiam em qualquer outro círculo devem ser reescritas.
- Use os scores da matriz par a par fornecida — não invente compatibilidades.
- CASAL É UNIDADE INDIVISÍVEL: quando citar um cônjuge em "dinamicas_de_par", sempre use os DOIS nomes juntos (ex.: "Fabio e Juliana") como UM lado do par. NUNCA crie uma dinâmica entre marido e esposa entre si, e NUNCA sugira "match" ou recombinação de cônjuge com outro membro como se fossem solteiros. Os pares de cônjuge↔cônjuge já foram intencionalmente removidos da matriz.`;

    const userPrompt = `Aqui está a composição de um círculo. Para cada membro temos o papel principal, o secundário, o tipo (casal/jovem) e os 6 percentuais do Perfil de Serviço.

MEMBROS:
${memberLines}

ESTATÍSTICAS DO GRUPO:
${statsLines}

MATRIZ DE COMPATIBILIDADE PAR A PAR (já calculada — use estes números, não recalcule):
${pairMatrix.join("\n")}

PARES MAIS FORTES (use ao menos 2 destes em "dinamicas_de_par"):
${topPairs
  .slice(0, 6)
  .map(
    (p, i) =>
      `${i + 1}. ${p.ab} — ${p.score}% (${p.tipo}) — ${p.obs}`,
  )
  .join("\n")}

Gere uma leitura pastoral da combinação deste grupo, com base estritamente nos dados acima.`;

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
                        "2 a 4 pontos do que esse círculo terá de bom. Cada item deve citar nome ou bloco com %.",
                      items: { type: "string" },
                      minItems: 2,
                      maxItems: 4,
                    },
                    riscos_do_grupo: {
                      type: "array",
                      description:
                        "1 a 3 pontos cegos coletivos com referência a blocos saturados ou em lacuna (cite os blocos por nome).",
                      items: { type: "string" },
                      minItems: 1,
                      maxItems: 3,
                    },
                    quem_puxa_o_que: {
                      type: "array",
                      description:
                        "Para cada membro, qual papel concreto tende a ocupar neste círculo específico, citando o bloco mais alto da pessoa em comparação ao grupo.",
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
                    dinamicas_de_par: {
                      type: "array",
                      description:
                        "2 a 4 pares dentro do círculo que merecem destaque. Use os pares fornecidos como base. Inclua o que vigiar quando aplicável.",
                      items: {
                        type: "object",
                        properties: {
                          membros: {
                            type: "array",
                            items: { type: "string" },
                            minItems: 2,
                            maxItems: 2,
                          },
                          tipo: {
                            type: "string",
                            description:
                              "complementar, bom encaixe, espelhamento, casal, tensão a cuidar.",
                          },
                          observacao: {
                            type: "string",
                            description:
                              "1 frase explicando por que esse par funciona ou pede atenção, citando blocos com %.",
                          },
                        },
                        required: ["membros", "tipo", "observacao"],
                        additionalProperties: false,
                      },
                      minItems: 2,
                      maxItems: 4,
                    },
                    recomendacao_pratica: {
                      type: "string",
                      description:
                        "Uma frase sobre como esse círculo deveria funcionar dado o perfil somado. Cite ao menos um bloco ou nome.",
                    },
                  },
                  required: [
                    "forcas_do_grupo",
                    "riscos_do_grupo",
                    "quem_puxa_o_que",
                    "dinamicas_de_par",
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
      try {
        parsed = JSON.parse(toolCall.replace(/,\s*([}\]])/g, "$1"));
      } catch (_e) {
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

    await adminClient.from("discernir_circle_combinations").upsert(
      {
        signature_hash: signatureHash,
        member_user_ids: ids,
        result_json: parsed,
        generated_by: userId,
      },
      { onConflict: "signature_hash" },
    );

    return new Response(JSON.stringify({ result: parsed, cached: false }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
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
