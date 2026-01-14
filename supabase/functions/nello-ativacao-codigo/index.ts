import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ═══════════════════════════════════════════════════════════════════
// PROMPT MESTRE - ATIVAÇÃO DO CÓDIGO DA ESSÊNCIA (IA)
// ═══════════════════════════════════════════════════════════════════

const SYSTEM_PROMPT_PT = `Você é um analista de autoconhecimento aplicado, especializado em conectar padrões de personalidade, história de vida e tomada de decisão prática, com foco em posicionamento pessoal, comunicação e relação com dinheiro.

Você não é terapeuta, não é coach motivacional e não faz promessas irreais.

Seu papel é traduzir autoconhecimento em clareza acionável, com linguagem humana, respeitosa e direta.

Você evita frases genéricas, espiritualidade vazia e jargões de marketing.

Tudo deve ser ancorado na realidade da história do usuário.

═══════════════════════════════════════════
📤 OUTPUT (ENTREGA FINAL)
═══════════════════════════════════════════

Você deve gerar um RELATÓRIO DE ATIVAÇÃO DO CÓDIGO DA ESSÊNCIA em JSON, dividido exatamente nas seções abaixo.

═══════════════════════════════════════════
🔹 1. LEITURA DE CONEXÃO (Reconhecimento)
═══════════════════════════════════════════

Explique, em linguagem clara e humana:
- como o Código da Essência aparece na história do usuário
- onde há coerência
- onde há conflito interno

Exemplo de tom:
"Pelo seu Código da Essência, você tende a…
Na sua história, isso aparece quando…"

❗ Regras:
- nunca culpar
- nunca romantizar
- sempre conectar traço + fato da história

═══════════════════════════════════════════
🔹 2. PADRÃO CENTRAL DE SABOTAGEM
═══════════════════════════════════════════

Identifique um padrão principal, não vários.

Explique:
- qual é o padrão
- como ele se forma
- como ele se manifesta hoje
- por que ele se repete

Tom: firme, respeitoso, sem julgamento

═══════════════════════════════════════════
🔹 3. COMO VOCÊ SE POSICIONA CONTRA SI MESMO
═══════════════════════════════════════════

Explique:
- como o usuário tenta se vender ou se comunicar
- por que isso entra em conflito com o Código da Essência
- o custo disso (energia, dinheiro, desgaste)

❗ Não usar técnicas de venda.
❗ Falar de coerência interna.

═══════════════════════════════════════════
🔹 4. ATIVAÇÃO DO CÓDIGO (PARTE PRÁTICA)
═══════════════════════════════════════════

Gerar exatamente:
- 3 ajustes de atitude (comportamento)
- 1 ajuste de linguagem (como falar de si ou do trabalho)
- 1 limite necessário (pessoal, profissional ou financeiro)
- 1 decisão concreta para os próximos 7 dias

Tudo deve ser:
- simples
- possível
- realista
- conectado à história do usuário

═══════════════════════════════════════════
🔹 5. DECLARAÇÃO DE ATIVAÇÃO PERSONALIZADA
═══════════════════════════════════════════

Criar uma frase curta, forte e personalizada, no formato:

"Quando eu ajo a partir de quem sou, eu ______."

Essa frase deve:
- refletir o Código da Essência
- contrariar o padrão de sabotagem
- servir como âncora prática (não mística)

═══════════════════════════════════════════
🔹 6. FECHAMENTO COM RESPONSABILIDADE
═══════════════════════════════════════════

Encerrar com um parágrafo curto reforçando que:
- autoconhecimento não é fim, é início
- clareza exige ação
- mudança acontece com pequenas decisões sustentadas

Tom: adulto, calmo, encorajador

═══════════════════════════════════════════
⚠️ REGRAS ABSOLUTAS
═══════════════════════════════════════════

- ❌ Não prometer sucesso financeiro
- ❌ Não usar palavras como "universo", "atrair", "manifestar"
- ❌ Não infantilizar o usuário
- ❌ Não usar clichês motivacionais
- ✅ Sempre respeitar a história
- ✅ Sempre apontar para ação
- ✅ Sempre manter coerência com o Código da Essência

🎯 OBJETIVO FINAL:
Fazer o usuário sentir: "Isso foi feito para mim."
E sair com: clareza + direção + uma ação`;

const SYSTEM_PROMPT_EN = `You are an applied self-knowledge analyst, specialized in connecting personality patterns, life history and practical decision-making, with focus on personal positioning, communication and relationship with money.

You are not a therapist, not a motivational coach and do not make unrealistic promises.

Your role is to translate self-knowledge into actionable clarity, with human, respectful and direct language.

You avoid generic phrases, empty spirituality and marketing jargon.

Everything must be anchored in the reality of the user's story.

═══════════════════════════════════════════
📤 OUTPUT (FINAL DELIVERY)
═══════════════════════════════════════════

You must generate an ESSENCE CODE ACTIVATION REPORT in JSON, divided exactly into the sections below.

═══════════════════════════════════════════
🔹 1. CONNECTION READING (Recognition)
═══════════════════════════════════════════

Explain, in clear and human language:
- how the Essence Code appears in the user's story
- where there is coherence
- where there is internal conflict

Example tone:
"According to your Essence Code, you tend to…
In your story, this appears when…"

❗ Rules:
- never blame
- never romanticize
- always connect trait + fact from the story

═══════════════════════════════════════════
🔹 2. CENTRAL SELF-SABOTAGE PATTERN
═══════════════════════════════════════════

Identify one main pattern, not several.

Explain:
- what the pattern is
- how it forms
- how it manifests today
- why it repeats

Tone: firm, respectful, without judgment

═══════════════════════════════════════════
🔹 3. HOW YOU POSITION YOURSELF AGAINST YOURSELF
═══════════════════════════════════════════

Explain:
- how the user tries to sell or communicate themselves
- why this conflicts with the Essence Code
- the cost of this (energy, money, wear)

❗ Do not use sales techniques.
❗ Talk about internal coherence.

═══════════════════════════════════════════
🔹 4. CODE ACTIVATION (PRACTICAL PART)
═══════════════════════════════════════════

Generate exactly:
- 3 attitude adjustments (behavior)
- 1 language adjustment (how to speak about yourself or work)
- 1 necessary limit (personal, professional or financial)
- 1 concrete decision for the next 7 days

Everything must be:
- simple
- possible
- realistic
- connected to the user's story

═══════════════════════════════════════════
🔹 5. PERSONALIZED ACTIVATION STATEMENT
═══════════════════════════════════════════

Create a short, strong and personalized phrase, in the format:

"When I act from who I am, I ______."

This phrase must:
- reflect the Essence Code
- counter the self-sabotage pattern
- serve as a practical anchor (not mystical)

═══════════════════════════════════════════
🔹 6. RESPONSIBLE CLOSING
═══════════════════════════════════════════

End with a short paragraph reinforcing that:
- self-knowledge is not the end, it's the beginning
- clarity requires action
- change happens with small sustained decisions

Tone: adult, calm, encouraging

═══════════════════════════════════════════
⚠️ ABSOLUTE RULES
═══════════════════════════════════════════

- ❌ Do not promise financial success
- ❌ Do not use words like "universe", "attract", "manifest"
- ❌ Do not infantilize the user
- ❌ Do not use motivational clichés
- ✅ Always respect the story
- ✅ Always point to action
- ✅ Always maintain coherence with the Essence Code

🎯 FINAL OBJECTIVE:
Make the user feel: "This was made for me."
And leave with: clarity + direction + one action`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, codigoEssencia, historiaUsuario, language = "pt" } = await req.json();
    
    console.log("=== ATIVAÇÃO DO CÓDIGO DA ESSÊNCIA ===");
    console.log("User ID:", userId);
    console.log("Language:", language);
    console.log("História recebida:", Object.keys(historiaUsuario || {}));

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Build the user prompt with all data
    const userPrompt = buildUserPrompt(codigoEssencia, historiaUsuario, language);
    const systemPrompt = language === "en" ? SYSTEM_PROMPT_EN : SYSTEM_PROMPT_PT;

    console.log("Calling AI Gateway...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "generate_activation_report",
              description: "Generate the Essence Code Activation Report with all sections",
              parameters: {
                type: "object",
                properties: {
                  leitura_conexao: {
                    type: "object",
                    description: "Connection reading section",
                    properties: {
                      titulo: { type: "string" },
                      coerencia: { type: "string", description: "Where the code appears coherently in their story" },
                      conflito: { type: "string", description: "Where there is internal conflict" },
                      conclusao: { type: "string" }
                    },
                    required: ["titulo", "coerencia", "conflito", "conclusao"]
                  },
                  padrao_sabotagem: {
                    type: "object",
                    description: "Central self-sabotage pattern",
                    properties: {
                      nome_padrao: { type: "string", description: "Name of the pattern" },
                      como_se_forma: { type: "string" },
                      como_manifesta_hoje: { type: "string" },
                      porque_repete: { type: "string" }
                    },
                    required: ["nome_padrao", "como_se_forma", "como_manifesta_hoje", "porque_repete"]
                  },
                  posicionamento_contra_si: {
                    type: "object",
                    description: "How user positions against themselves",
                    properties: {
                      como_tenta_se_vender: { type: "string" },
                      conflito_com_essencia: { type: "string" },
                      custo: { type: "string", description: "The cost in energy, money, wear" }
                    },
                    required: ["como_tenta_se_vender", "conflito_com_essencia", "custo"]
                  },
                  ativacao_pratica: {
                    type: "object",
                    description: "Practical activation steps",
                    properties: {
                      ajustes_atitude: {
                        type: "array",
                        items: { type: "string" },
                        minItems: 3,
                        maxItems: 3,
                        description: "Exactly 3 attitude adjustments"
                      },
                      ajuste_linguagem: { type: "string", description: "1 language adjustment" },
                      limite_necessario: { type: "string", description: "1 necessary limit" },
                      decisao_7_dias: {
                        type: "object",
                        properties: {
                          acao: { type: "string", description: "The concrete action" },
                          porque: { type: "string", description: "Why this action matters" }
                        },
                        required: ["acao", "porque"]
                      }
                    },
                    required: ["ajustes_atitude", "ajuste_linguagem", "limite_necessario", "decisao_7_dias"]
                  },
                  declaracao_ativacao: {
                    type: "string",
                    description: "Personalized activation statement in format: 'When I act from who I am, I ______'"
                  },
                  fechamento: {
                    type: "string",
                    description: "Responsible closing paragraph"
                  }
                },
                required: ["leitura_conexao", "padrao_sabotagem", "posicionamento_contra_si", "ativacao_pratica", "declaracao_ativacao", "fechamento"]
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "generate_activation_report" } }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    console.log("AI Response received");

    // Extract the tool call result
    const toolCall = aiResponse.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall || toolCall.function.name !== "generate_activation_report") {
      throw new Error("Invalid AI response format");
    }

    const activationReport = JSON.parse(toolCall.function.arguments);
    console.log("Activation report parsed successfully");

    // Save to database
    const { error: saveError } = await supabaseClient
      .from("ativacao_codigo")
      .upsert({
        user_id: userId,
        historia_usuario: historiaUsuario,
        relatorio: activationReport,
        language,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, { onConflict: "user_id" });

    if (saveError) {
      console.error("Error saving activation:", saveError);
    } else {
      console.log("Activation report saved to database");
    }

    return new Response(JSON.stringify({ 
      success: true, 
      report: activationReport 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Activation error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function buildUserPrompt(codigoEssencia: any, historiaUsuario: any, language: string): string {
  const labels = language === "en" ? {
    codigo: "ESSENCE CODE",
    arquetipos: "Primary archetypes",
    tracos: "Central behavioral traits",
    forcas: "Natural strengths",
    riscos: "Risk/sabotage patterns",
    emocoes: "Relevant emotional tendencies",
    historia: "USER STORY",
    profissional: "Professional and financial history",
    sabotagem: "Where they feel they sabotage themselves today",
    venda: "Difficulty selling or positioning themselves",
    mudanca: "What they want to change now"
  } : {
    codigo: "CÓDIGO DA ESSÊNCIA DO USUÁRIO",
    arquetipos: "Arquétipos predominantes",
    tracos: "Traços comportamentais centrais",
    forcas: "Pontos de força naturais",
    riscos: "Padrões de risco ou sabotagem",
    emocoes: "Tendências emocionais relevantes",
    historia: "HISTÓRIA DO USUÁRIO",
    profissional: "História profissional e financeira",
    sabotagem: "Onde sente que se sabota hoje",
    venda: "Dificuldade em se vender ou se posicionar",
    mudanca: "O que deseja mudar agora"
  };

  return `
═══════════════════════════════════════════
📥 ${labels.codigo}
═══════════════════════════════════════════

• ${labels.arquetipos}: ${codigoEssencia.arquetipos || "Não informado"}
• ${labels.tracos}: ${codigoEssencia.tracos || "Não informado"}
• ${labels.forcas}: ${codigoEssencia.forcas || "Não informado"}
• ${labels.riscos}: ${codigoEssencia.riscos || "Não informado"}
• ${labels.emocoes}: ${codigoEssencia.emocoes || "Não informado"}

═══════════════════════════════════════════
📥 ${labels.historia}
═══════════════════════════════════════════

${labels.profissional}:
${historiaUsuario.historia_profissional || "Não informado"}

${labels.sabotagem}:
${historiaUsuario.sabotagem_atual || "Não informado"}

${labels.venda}:
${historiaUsuario.dificuldade_venda || "Não informado"}

${labels.mudanca}:
${historiaUsuario.desejo_mudanca || "Não informado"}

═══════════════════════════════════════════

Gere o relatório de ativação completo usando a função generate_activation_report.
`;
}
