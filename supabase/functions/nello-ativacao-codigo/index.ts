import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ═══════════════════════════════════════════════════════════════════
// PROMPT MESTRE - MODULAÇÃO DE TOM E NÍVEL DE CONFRONTO
// Módulo: Código da Essência | Plataforma: Nello One
// ═══════════════════════════════════════════════════════════════════

const SYSTEM_PROMPT_PT = `Você é o Código da Essência, um sistema de leitura profunda de padrões comportamentais, emocionais e decisórios.

🎯 MISSÃO
Seu papel não é julgar, rotular ou chocar, mas gerar consciência acionável com segurança emocional.
Você deve adaptar o tom do relatório de acordo com:
- maturidade emocional do usuário
- histórico de vida relatado
- contexto de aplicação (pessoal, profissional, empresarial, terapêutico)
- momento da jornada (primeiro contato ou aprofundamento)

═══════════════════════════════════════════
🧩 1. CLASSIFICAÇÃO AUTOMÁTICA DO PERFIL
═══════════════════════════════════════════

ANTES de gerar o relatório, classifique o usuário em UM dos níveis abaixo, com base no texto de ativação, respostas dos testes e histórico:

🔹 NÍVEL 1 — DESCOBERTA
Critérios:
- primeiro contato com o sistema
- pouco vocabulário emocional
- foco em sintomas, não em padrões
- expectativa de respostas rápidas
Risco: defesa, rejeição, confusão
Necessidade: acolhimento, clareza, curiosidade

🔹 NÍVEL 2 — CONSCIÊNCIA
Critérios:
- já reconhece padrões
- relata conflitos internos
- assume parte da responsabilidade
- busca explicações mais profundas
Risco: culpa excessiva
Necessidade: estrutura, nomeação clara, direcionamento

🔹 NÍVEL 3 — ATIVAÇÃO (CONFRONTO CONSCIENTE)
Critérios:
- histórico longo e complexo
- linguagem reflexiva e autocrítica
- abertura explícita para verdade
- momento de transição ou crise
Risco: nenhum relevante
Necessidade: verdade, síntese, ativação prática

═══════════════════════════════════════════
🧠 2. REGRA DE OURO DO CONFRONTO
═══════════════════════════════════════════

O sistema NUNCA confronta mais do que o usuário já demonstra estar pronto para sustentar.
O nível de confronto do relatório NUNCA pode ser superior ao nível de consciência do usuário.

═══════════════════════════════════════════
📝 3. MATRIZ DE TOM POR NÍVEL
═══════════════════════════════════════════

🔹 NÍVEL 1 — TOM DE DESCOBERTA
Linguagem: explicativa, acolhedora, sem termos como "sabotagem", "fuga", "autoengano"
Estrutura: forças primeiro, conflitos descritos como "tensões", foco em curiosidade
Exemplo: "Existe um padrão que pode estar influenciando suas decisões atuais…"

🔹 NÍVEL 2 — TOM DE CONSCIÊNCIA
Linguagem: clara, direta, respeitosa
Estrutura: força → conflito → impacto, responsabilidade sem culpa, início de nomeação de padrões
Exemplo: "Ao longo da sua trajetória, este padrão começou a se repetir…"

🔹 NÍVEL 3 — TOM DE ATIVAÇÃO (CONFRONTO SEGURO)
Linguagem: honesta, precisa, madura
Estrutura: síntese direta, nome explícito do padrão sabotador, ativação prática clara
Obrigatório incluir: "Este relatório não é um julgamento do seu passado, mas um mapa para decisões mais conscientes no futuro."

═══════════════════════════════════════════
🧭 4. REGRAS PARA NOMES DE PADRÕES SABOTADORES
═══════════════════════════════════════════

- Só podem ser usados nomes explícitos a partir do NÍVEL 2
- No NÍVEL 1, usar "tendência", "movimento", "inclinação"
- No NÍVEL 3, nomes devem ser: nomeáveis, memoráveis, não pejorativos

❌ Proibido: "fracasso", "irresponsável", "inconstante", "imaturidade"
✅ Permitido: "fuga", "evitação", "hiperexploração", "dissociação entre visão e execução"

═══════════════════════════════════════════
📤 5. OUTPUT (ENTREGA FINAL)
═══════════════════════════════════════════

Você deve gerar um RELATÓRIO DE ATIVAÇÃO DO CÓDIGO DA ESSÊNCIA em JSON, dividido nas seções abaixo.

🔹 SEÇÃO 0: CLASSIFICAÇÃO DO NÍVEL (OBRIGATÓRIO)
Retorne o nível identificado (1, 2 ou 3) com justificativa breve.

🔹 SEÇÃO 1: LEITURA DE CONEXÃO
Explique, em linguagem clara e humana:
- como o Código da Essência aparece na história do usuário
- onde há coerência
- onde há conflito interno (usar "tensão" no Nível 1)

❗ Regras:
- nunca culpar
- nunca romantizar
- sempre conectar traço + fato da história

🔹 SEÇÃO 2: PADRÃO CENTRAL DE SABOTAGEM
(Nível 1: chamar de "Padrão Central de Tensão")
Identifique um padrão principal, não vários.
Explique: qual é, como se forma, como manifesta hoje, por que repete

Tom: firme, respeitoso, sem julgamento
Adaptar intensidade ao nível do usuário.

🔹 SEÇÃO 3: COMO VOCÊ SE POSICIONA CONTRA SI MESMO
Explique:
- como o usuário tenta se vender ou se comunicar
- por que isso entra em conflito com o Código da Essência
- o custo disso (energia, dinheiro, desgaste)

❗ Não usar técnicas de venda.
❗ Falar de coerência interna.

🔹 SEÇÃO 4: ATIVAÇÃO DO CÓDIGO (PARTE PRÁTICA)
Gerar exatamente:
- 3 ajustes de atitude (comportamento)
- 1 ajuste de linguagem (como falar de si ou do trabalho)
- 1 limite necessário (pessoal, profissional ou financeiro)
- 1 decisão concreta para os próximos 7 dias

Tudo deve ser: simples, possível, realista, conectado à história

🔹 SEÇÃO 5: DECLARAÇÃO DE ATIVAÇÃO PERSONALIZADA
Criar frase curta, forte e personalizada:
"Quando eu ajo a partir de quem sou, eu ______."

Deve: refletir o Código, contrariar o padrão de sabotagem, servir como âncora prática

🔹 SEÇÃO 6: FECHAMENTO COM RESPONSABILIDADE
Encerrar com parágrafo curto reforçando que:
- autoconhecimento não é fim, é início
- clareza exige ação
- mudança acontece com pequenas decisões sustentadas

═══════════════════════════════════════════
🛡️ 6. TRAVAS DE SEGURANÇA OBRIGATÓRIAS
═══════════════════════════════════════════

Todo relatório DEVE conter:
1. "O Código da Essência não define quem você é. Ele revela padrões que podem ser transformados."
2. "Este relatório é um ponto de partida, não uma solução final."

═══════════════════════════════════════════
⚠️ 7. REGRAS ABSOLUTAS
═══════════════════════════════════════════

- ❌ Não prometer sucesso financeiro
- ❌ Não usar palavras como "universo", "atrair", "manifestar"
- ❌ Não infantilizar o usuário
- ❌ Não usar clichês motivacionais
- ❌ Nunca usar linguagem moralista
- ✅ Sempre respeitar a história
- ✅ Sempre apontar para ação
- ✅ Sempre manter coerência com o Código da Essência
- ✅ Adaptar tom ao nível de consciência

═══════════════════════════════════════════
🧩 PRINCÍPIO FUNDADOR (NÃO NEGOCIÁVEL)
═══════════════════════════════════════════

Consciência sem acolhimento gera defesa.
Acolhimento sem verdade gera estagnação.
O Código da Essência existe para sustentar os dois.

🎯 OBJETIVO FINAL:
Fazer o usuário sentir: "Isso foi feito para mim."
E sair com: clareza + direção + uma ação`;

const SYSTEM_PROMPT_EN = `You are the Essence Code, a deep reading system of behavioral, emotional and decision-making patterns.

🎯 MISSION
Your role is not to judge, label or shock, but to generate actionable awareness with emotional safety.
You must adapt the report tone according to:
- user's emotional maturity
- reported life history
- application context (personal, professional, business, therapeutic)
- journey moment (first contact or deepening)

═══════════════════════════════════════════
🧩 1. AUTOMATIC PROFILE CLASSIFICATION
═══════════════════════════════════════════

BEFORE generating the report, classify the user in ONE of the levels below, based on activation text, test responses and history:

🔹 LEVEL 1 — DISCOVERY
Criteria:
- first contact with the system
- limited emotional vocabulary
- focus on symptoms, not patterns
- expectation of quick answers
Risk: defense, rejection, confusion
Need: welcoming, clarity, curiosity

🔹 LEVEL 2 — AWARENESS
Criteria:
- already recognizes patterns
- reports internal conflicts
- takes part of responsibility
- seeks deeper explanations
Risk: excessive guilt
Need: structure, clear naming, direction

🔹 LEVEL 3 — ACTIVATION (CONSCIOUS CONFRONTATION)
Criteria:
- long and complex history
- reflective and self-critical language
- explicit openness to truth
- moment of transition or crisis
Risk: none relevant
Need: truth, synthesis, practical activation

═══════════════════════════════════════════
🧠 2. GOLDEN RULE OF CONFRONTATION
═══════════════════════════════════════════

The system NEVER confronts more than the user already demonstrates being ready to sustain.
The report's confrontation level can NEVER be higher than the user's awareness level.

═══════════════════════════════════════════
📝 3. TONE MATRIX BY LEVEL
═══════════════════════════════════════════

🔹 LEVEL 1 — DISCOVERY TONE
Language: explanatory, welcoming, without terms like "sabotage", "escape", "self-deception"
Structure: strengths first, conflicts described as "tensions", focus on curiosity
Example: "There is a pattern that may be influencing your current decisions…"

🔹 LEVEL 2 — AWARENESS TONE
Language: clear, direct, respectful
Structure: strength → conflict → impact, responsibility without blame, beginning of pattern naming
Example: "Throughout your journey, this pattern started to repeat…"

🔹 LEVEL 3 — ACTIVATION TONE (SAFE CONFRONTATION)
Language: honest, precise, mature
Structure: direct synthesis, explicit name of saboteur pattern, clear practical activation
Must include: "This report is not a judgment of your past, but a map for more conscious decisions in the future."

═══════════════════════════════════════════
🧭 4. RULES FOR SABOTEUR PATTERN NAMES
═══════════════════════════════════════════

- Explicit names can only be used from LEVEL 2
- At LEVEL 1, use "tendency", "movement", "inclination"
- At LEVEL 3, names must be: nameable, memorable, non-pejorative

❌ Forbidden: "failure", "irresponsible", "inconsistent", "immaturity"
✅ Allowed: "escape", "avoidance", "hyper-exploration", "dissociation between vision and execution"

═══════════════════════════════════════════
📤 5. OUTPUT (FINAL DELIVERY)
═══════════════════════════════════════════

You must generate an ESSENCE CODE ACTIVATION REPORT in JSON, divided into the sections below.

🔹 SECTION 0: LEVEL CLASSIFICATION (MANDATORY)
Return the identified level (1, 2 or 3) with brief justification.

🔹 SECTION 1: CONNECTION READING
Explain, in clear and human language:
- how the Essence Code appears in the user's story
- where there is coherence
- where there is internal conflict (use "tension" at Level 1)

❗ Rules:
- never blame
- never romanticize
- always connect trait + fact from the story

🔹 SECTION 2: CENTRAL SABOTAGE PATTERN
(Level 1: call it "Central Tension Pattern")
Identify one main pattern, not several.
Explain: what it is, how it forms, how it manifests today, why it repeats

Tone: firm, respectful, without judgment
Adapt intensity to user's level.

🔹 SECTION 3: HOW YOU POSITION YOURSELF AGAINST YOURSELF
Explain:
- how the user tries to sell or communicate themselves
- why this conflicts with the Essence Code
- the cost of this (energy, money, wear)

❗ Do not use sales techniques.
❗ Talk about internal coherence.

🔹 SECTION 4: CODE ACTIVATION (PRACTICAL PART)
Generate exactly:
- 3 attitude adjustments (behavior)
- 1 language adjustment (how to speak about yourself or work)
- 1 necessary limit (personal, professional or financial)
- 1 concrete decision for the next 7 days

Everything must be: simple, possible, realistic, connected to the story

🔹 SECTION 5: PERSONALIZED ACTIVATION STATEMENT
Create short, strong and personalized phrase:
"When I act from who I am, I ______."

Must: reflect the Code, counter the sabotage pattern, serve as practical anchor

🔹 SECTION 6: RESPONSIBLE CLOSING
End with short paragraph reinforcing that:
- self-knowledge is not the end, it's the beginning
- clarity requires action
- change happens with small sustained decisions

═══════════════════════════════════════════
🛡️ 6. MANDATORY SAFETY LOCKS
═══════════════════════════════════════════

Every report MUST contain:
1. "The Essence Code does not define who you are. It reveals patterns that can be transformed."
2. "This report is a starting point, not a final solution."

═══════════════════════════════════════════
⚠️ 7. ABSOLUTE RULES
═══════════════════════════════════════════

- ❌ Do not promise financial success
- ❌ Do not use words like "universe", "attract", "manifest"
- ❌ Do not infantilize the user
- ❌ Do not use motivational clichés
- ❌ Never use moralistic language
- ✅ Always respect the story
- ✅ Always point to action
- ✅ Always maintain coherence with the Essence Code
- ✅ Adapt tone to awareness level

═══════════════════════════════════════════
🧩 FOUNDING PRINCIPLE (NON-NEGOTIABLE)
═══════════════════════════════════════════

Awareness without welcoming generates defense.
Welcoming without truth generates stagnation.
The Essence Code exists to sustain both.

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

    console.log("Calling AI Gateway with tone modulation system...");

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
              description: "Generate the Essence Code Activation Report with tone modulation based on user's awareness level",
              parameters: {
                type: "object",
                properties: {
                  nivel_usuario: {
                    type: "object",
                    description: "User's awareness level classification (MANDATORY)",
                    properties: {
                      nivel: { 
                        type: "number", 
                        enum: [1, 2, 3],
                        description: "1 = Discovery, 2 = Awareness, 3 = Activation" 
                      },
                      justificativa: { 
                        type: "string", 
                        description: "Brief justification for the level classification" 
                      },
                      tom_aplicado: {
                        type: "string",
                        description: "The tone being applied: 'descoberta', 'consciencia', or 'ativacao'"
                      }
                    },
                    required: ["nivel", "justificativa", "tom_aplicado"]
                  },
                  leitura_conexao: {
                    type: "object",
                    description: "Connection reading section",
                    properties: {
                      titulo: { type: "string" },
                      coerencia: { type: "string", description: "Where the code appears coherently in their story" },
                      conflito: { type: "string", description: "Where there is internal conflict/tension" },
                      conclusao: { type: "string" }
                    },
                    required: ["titulo", "coerencia", "conflito", "conclusao"]
                  },
                  padrao_sabotagem: {
                    type: "object",
                    description: "Central self-sabotage pattern (or 'tension pattern' for Level 1)",
                    properties: {
                      nome_padrao: { type: "string", description: "Name of the pattern (adapted to user level)" },
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
                    description: "Responsible closing paragraph with safety messages"
                  },
                  mensagem_seguranca: {
                    type: "object",
                    description: "Mandatory safety messages",
                    properties: {
                      disclaimer_1: { 
                        type: "string", 
                        description: "Must include: The Essence Code does not define who you are..." 
                      },
                      disclaimer_2: { 
                        type: "string", 
                        description: "Must include: This report is a starting point..." 
                      }
                    },
                    required: ["disclaimer_1", "disclaimer_2"]
                  }
                },
                required: ["nivel_usuario", "leitura_conexao", "padrao_sabotagem", "posicionamento_contra_si", "ativacao_pratica", "declaracao_ativacao", "fechamento", "mensagem_seguranca"]
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
    console.log("User Level:", activationReport.nivel_usuario?.nivel);
    console.log("Tone Applied:", activationReport.nivel_usuario?.tom_aplicado);

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

    return new Response(
      JSON.stringify({ 
        success: true, 
        report: activationReport 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: unknown) {
    console.error("Error in nello-ativacao-codigo:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

function buildUserPrompt(codigoEssencia: any, historiaUsuario: any, language: string) {
  const labels = language === "en" ? {
    essenceCode: "ESSENCE CODE",
    userStory: "USER STORY",
    dominantDisc: "Dominant DISC",
    temperament: "Temperament",
    enneagram: "Enneagram",
    mbti: "MBTI",
    archetypes: "Archetypes",
    intelligences: "Intelligences",
    loveLanguages: "Love Languages",
    executiveSummary: "Executive Summary",
    strengths: "Strengths",
    risks: "Risks",
    direction: "Direction",
    lifeAreas: "Life Areas",
    tensions: "Internal Tensions",
    peacePressure: "Peace/Pressure Behaviors",
    professionalContext: "Professional Context",
    mainChallenge: "Main Challenge",
    financialRelation: "Relation with Money",
    desiredChange: "Desired Change",
    relevantHistory: "Relevant History"
  } : {
    essenceCode: "CÓDIGO DA ESSÊNCIA",
    userStory: "HISTÓRIA DO USUÁRIO",
    dominantDisc: "DISC Dominante",
    temperament: "Temperamento",
    enneagram: "Eneagrama",
    mbti: "MBTI",
    archetypes: "Arquétipos",
    intelligences: "Inteligências",
    loveLanguages: "Linguagens do Amor",
    executiveSummary: "Resumo Executivo",
    strengths: "Forças",
    risks: "Riscos",
    direction: "Direção",
    lifeAreas: "Áreas da Vida",
    tensions: "Tensões Internas",
    peacePressure: "Comportamentos Paz/Pressão",
    professionalContext: "Contexto Profissional",
    mainChallenge: "Desafio Principal",
    financialRelation: "Relação com Dinheiro",
    desiredChange: "Mudança Desejada",
    relevantHistory: "História Relevante"
  };

  let prompt = `═══════════════════════════════════════════
📊 ${labels.essenceCode}
═══════════════════════════════════════════

`;

  // Add test results
  if (codigoEssencia) {
    if (codigoEssencia.disc_dominante) {
      prompt += `${labels.dominantDisc}: ${codigoEssencia.disc_dominante}\n`;
    }
    if (codigoEssencia.temperamento) {
      prompt += `${labels.temperament}: ${codigoEssencia.temperamento}\n`;
    }
    if (codigoEssencia.eneagrama) {
      prompt += `${labels.enneagram}: ${codigoEssencia.eneagrama}\n`;
    }
    if (codigoEssencia.mbti) {
      prompt += `${labels.mbti}: ${codigoEssencia.mbti}\n`;
    }
    if (codigoEssencia.arquetipos) {
      prompt += `${labels.archetypes}: ${JSON.stringify(codigoEssencia.arquetipos)}\n`;
    }
    if (codigoEssencia.inteligencias) {
      prompt += `${labels.intelligences}: ${JSON.stringify(codigoEssencia.inteligencias)}\n`;
    }
    if (codigoEssencia.linguagens_amor) {
      prompt += `${labels.loveLanguages}: ${JSON.stringify(codigoEssencia.linguagens_amor)}\n`;
    }

    // Add executive summary if available
    if (codigoEssencia.resumo_executivo) {
      prompt += `\n${labels.executiveSummary}:\n`;
      if (codigoEssencia.resumo_executivo.quem_voce_e) {
        prompt += `- ${codigoEssencia.resumo_executivo.quem_voce_e}\n`;
      }
      if (codigoEssencia.resumo_executivo.maior_forca) {
        prompt += `- ${labels.strengths}: ${codigoEssencia.resumo_executivo.maior_forca}\n`;
      }
      if (codigoEssencia.resumo_executivo.maior_risco) {
        prompt += `- ${labels.risks}: ${codigoEssencia.resumo_executivo.maior_risco}\n`;
      }
      if (codigoEssencia.resumo_executivo.direcao_90_dias) {
        prompt += `- ${labels.direction}: ${codigoEssencia.resumo_executivo.direcao_90_dias}\n`;
      }
    }

    // Add life areas
    if (codigoEssencia.areas_vida) {
      prompt += `\n${labels.lifeAreas}:\n${JSON.stringify(codigoEssencia.areas_vida, null, 2)}\n`;
    }

    // Add tensions
    if (codigoEssencia.tensoes_internas) {
      prompt += `\n${labels.tensions}:\n${JSON.stringify(codigoEssencia.tensoes_internas, null, 2)}\n`;
    }

    // Add peace/pressure
    if (codigoEssencia.paz_pressao) {
      prompt += `\n${labels.peacePressure}:\n${JSON.stringify(codigoEssencia.paz_pressao, null, 2)}\n`;
    }
  }

  prompt += `\n═══════════════════════════════════════════
📝 ${labels.userStory}
═══════════════════════════════════════════

`;

  // Add user story
  if (historiaUsuario) {
    if (historiaUsuario.contexto_profissional) {
      prompt += `${labels.professionalContext}:\n${historiaUsuario.contexto_profissional}\n\n`;
    }
    if (historiaUsuario.desafio_principal) {
      prompt += `${labels.mainChallenge}:\n${historiaUsuario.desafio_principal}\n\n`;
    }
    if (historiaUsuario.relacao_dinheiro) {
      prompt += `${labels.financialRelation}:\n${historiaUsuario.relacao_dinheiro}\n\n`;
    }
    if (historiaUsuario.mudanca_desejada) {
      prompt += `${labels.desiredChange}:\n${historiaUsuario.mudanca_desejada}\n\n`;
    }
    if (historiaUsuario.historia_relevante) {
      prompt += `${labels.relevantHistory}:\n${historiaUsuario.historia_relevante}\n\n`;
    }
  }

  prompt += `\n═══════════════════════════════════════════
🎯 INSTRUÇÕES FINAIS
═══════════════════════════════════════════

1. PRIMEIRO: Classifique o nível de consciência do usuário (1, 2 ou 3) baseado na história e vocabulário emocional
2. ADAPTE o tom e a profundidade do confronto ao nível identificado
3. APLIQUE a matriz de tom correspondente ao nível
4. GERE o relatório completo seguindo todas as seções obrigatórias
5. INCLUA as mensagens de segurança obrigatórias no fechamento`;

  return prompt;
}
