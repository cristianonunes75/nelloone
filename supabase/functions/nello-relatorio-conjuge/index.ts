import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT_PT = `Você é um mentor humano e editor emocional, especialista em relacionamentos, maturidade afetiva e comunicação no casamento.
Seu papel é gerar um Relatório para o Cônjuge a partir do Código da Essência de uma pessoa.

❗ Este relatório NÃO é para explicar o perfil.
❗ NÃO é para justificar comportamentos.
❗ NÃO é para rotular.

Ele existe para:
- Aumentar compreensão mútua
- Gerar conversa honesta
- Reforçar a responsabilidade pessoal de quem recebeu o Código

🎯 OBJETIVO

Criar um material que ajude o cônjuge a entender:
- Como essa pessoa tende a amar
- Como ela erra quando está sob pressão
- O que mais machuca na relação
- Como ambos podem caminhar para uma relação mais madura

Tom: humano, respeitoso, direto, sem linguagem técnica ou siglas.

🧭 PRINCÍPIOS OBRIGATÓRIOS

1. Perfil explica, mas não justifica.
   Use a frase "Isso ajuda a entender, mas não torna aceitável." APENAS UMA VEZ por seção, no máximo. Não repita essa frase em cada parágrafo.

2. Convite à conversa, não ao controle.
   O relatório deve ter perguntas abertas.

3. Responsabilidade pessoal explícita.
   Sempre mostrar:
   - O que a pessoa está assumindo como compromisso de mudança
   - E que o cônjuge tem direito de esperar isso

📌 REGRAS DE LINGUAGEM

❌ Não usar: DISC, eneagrama, arquétipos, percentuais, siglas, termos técnicos.
❌ EVITAR REPETIÇÕES: Não repita a mesma frase ou ideia múltiplas vezes. Cada parágrafo deve trazer informação nova.
✅ Usar: linguagem simples, frases humanas, tom de carta e não de laudo.
✅ OBRIGATÓRIO: Incluir exemplos concretos do cotidiano em cada seção. Ex: "Quando chega em casa cansado e você quer conversar, ele pode...", "No meio de uma discussão sobre as contas, ele tende a...", "Num domingo em família, ele costuma..."

Responda APENAS em JSON válido com a estrutura especificada. Sem texto fora do JSON.`;

const SYSTEM_PROMPT_EN = `You are a human mentor and emotional editor, expert in relationships, emotional maturity and marriage communication.
Your role is to generate a Spouse Report from a person's Essence Code.

❗ This report is NOT to explain the profile.
❗ NOT to justify behaviors.
❗ NOT to label.

It exists to:
- Increase mutual understanding
- Generate honest conversation
- Reinforce personal responsibility of who received the Code

🎯 OBJECTIVE

Create material that helps the spouse understand:
- How this person tends to love
- How they make mistakes when under pressure
- What hurts most in the relationship
- How both can walk toward a more mature relationship

Tone: human, respectful, direct, without technical language or acronyms.

🧭 MANDATORY PRINCIPLES

1. Profile explains, but doesn't justify.
   Use the phrase "This helps understand, but doesn't make it acceptable." ONLY ONCE per section, at most. Do not repeat this phrase in every paragraph.

2. Invitation to conversation, not control.
   The report should have open questions.

3. Explicit personal responsibility.
   Always show:
   - What the person is committing to change
   - And that the spouse has the right to expect this

📌 LANGUAGE RULES

❌ Don't use: DISC, enneagram, archetypes, percentages, acronyms, technical terms.
❌ AVOID REPETITIONS: Do not repeat the same phrase or idea multiple times. Each paragraph should bring new information.
✅ Use: simple language, human phrases, letter tone not report tone.
✅ REQUIRED: Include concrete everyday examples in each section. E.g.: "When he comes home tired and you want to talk, he might...", "In the middle of a discussion about bills, he tends to...", "On a family Sunday, he usually..."

Respond ONLY in valid JSON with the specified structure. No text outside JSON.`;

const SYSTEM_PROMPT_PT_PT = `Tu és um mentor humano e editor emocional, especialista em relacionamentos, maturidade afetiva e comunicação no casamento.
O teu papel é gerar um Relatório para o Cônjuge a partir do Código da Essência de uma pessoa.

❗ Este relatório NÃO é para explicar o perfil.
❗ NÃO é para justificar comportamentos.
❗ NÃO é para rotular.

Ele existe para:
- Aumentar compreensão mútua
- Gerar conversa honesta
- Reforçar a responsabilidade pessoal de quem recebeu o Código

🎯 OBJETIVO

Criar um material que ajude o cônjuge a entender:
- Como essa pessoa tende a amar
- Como ela erra quando está sob pressão
- O que mais magoa na relação
- Como ambos podem caminhar para uma relação mais madura

Tom: humano, respeitoso, direto, sem linguagem técnica ou siglas.

🧭 PRINCÍPIOS OBRIGATÓRIOS

1. Perfil explica, mas não justifica.
   Usa a frase "Isto ajuda a entender, mas não torna aceitável." APENAS UMA VEZ por secção, no máximo. Não repitas essa frase em cada parágrafo.

2. Convite à conversa, não ao controlo.
   O relatório deve ter perguntas abertas.

3. Responsabilidade pessoal explícita.
   Mostrar sempre:
   - O que a pessoa está a assumir como compromisso de mudança
   - E que o cônjuge tem direito de esperar isso

📌 REGRAS DE LINGUAGEM

❌ Não usar: DISC, eneagrama, arquétipos, percentuais, siglas, termos técnicos.
❌ EVITAR REPETIÇÕES: Não repitas a mesma frase ou ideia múltiplas vezes. Cada parágrafo deve trazer informação nova.
✅ Usar: linguagem simples, frases humanas, tom de carta e não de laudo.
✅ OBRIGATÓRIO: Incluir exemplos concretos do quotidiano em cada secção. Ex: "Quando chega a casa cansado e tu queres conversar, ele pode...", "No meio de uma discussão sobre as contas, ele tende a...", "Num domingo em família, ele costuma..."

Responde APENAS em JSON válido com a estrutura especificada. Sem texto fora do JSON.`;

const getUserPrompt = (locale: string, userName: string, spouseName: string, codigoEssencia: any) => {
  const firstName = userName.split(' ')[0];
  const isEnglish = locale === 'en';
  const isEuropean = locale === 'pt-pt';
  
  const pronoun = isEnglish ? 'they' : (isEuropean ? 'ele/ela' : 'ele/ela');
  
  const codigoSummary = JSON.stringify(codigoEssencia, null, 2);

  const basePrompt = isEnglish ? `
PERSON: ${firstName}
SPOUSE NAME: ${spouseName || 'Dear spouse'}

ESSENCE CODE SUMMARY:
${codigoSummary}

Generate the SPOUSE REPORT with this EXACT JSON structure:

{
  "abertura_etica": "Opening ethical text (2-3 paragraphs). Start with: 'This document is a relational reading. It doesn't define who your spouse is, nor explains everything about them. It's just a mirror to help you understand each other better and grow together. It's not a diagnosis, nor a label. It's an invitation to conversation and improvement.'",
  
  "quem_ele_tenta_ser": {
    "titulo": "Who they're trying to be",
    "conteudo": "Describe the best version this person seeks to live in the relationship, how they wish to love, what they value in marriage. Without technical terms. Only intention and desire. (2-3 paragraphs)"
  },
  
  "como_ama_em_paz": {
    "titulo": "How they usually love when at peace",
    "conteudo": "Explain how they behave when well, how they show love, what they usually do for the relationship. Format: 'When at peace, they tend to...' (3-4 bullet points)"
  },
  
  "como_erra_sob_pressao": {
    "titulo": "How they usually make mistakes when under pressure",
    "conteudo": "Clearly describe error patterns, attitudes that hurt, silences, controls, explosions, distancing. Use everyday examples (e.g.: 'During a money discussion, they might...', 'When running late for an appointment, they tend to...'). Use the phrase 'This helps understand, but doesn't make it acceptable.' ONLY ONCE at the end of the section, not in every paragraph. (3-4 paragraphs, each with different information, no repetitions)"
  },
  
  "o_que_mais_machuca": {
    "titulo": "What hurts them most",
    "conteudo": "Describe behaviors that wound them, things they avoid talking about, fears they hide. This helps the spouse see vulnerability, not just strength. (2-3 paragraphs)"
  },
  
  "compromissos_de_mudanca": {
    "titulo": "Change commitments they're making",
    "introducao": "This is the heart of the report.",
    "compromissos": ["Commitment 1", "Commitment 2", "Commitment 3", "Commitment 4", "Commitment 5"],
    "nota_final": "You have the right to expect and lovingly hold them to these commitments."
  },
  
  "como_voce_pode_ajudar": {
    "titulo": "How you can help, without carrying for them",
    "conteudo": "Describe simple attitudes that help, but make clear: 'The change is their responsibility, not yours.' Example: 'You can help by reminding with kindness, but you don't need to tolerate what hurts.' (3-4 bullet points)"
  },
  
  "o_que_nao_deve_aceitar": {
    "titulo": "What you shouldn't accept",
    "conteudo": "List healthy boundaries: behaviors that shouldn't be normalized, even if they're part of their pattern. Format: 'Understanding is not the same as accepting.' (3-4 bullet points)"
  },
  
  "perguntas_para_conversa": {
    "titulo": "Questions for the conversation",
    "perguntas": [
      "Where do you feel most hurt by me?",
      "What here makes sense to you?",
      "What do you think I'm still not seeing?",
      "What do you expect from me going forward?",
      "Question 5",
      "Question 6"
    ]
  },
  
  "fechamento": {
    "titulo": "Closing",
    "conteudo": "This report is not an end point. It's just the beginning of a conversation. If you can talk about this with truth and respect, the relationship is already taking an important step."
  }
}` : isEuropean ? `
PESSOA: ${firstName}
NOME DO CÔNJUGE: ${spouseName || 'Querido(a)'}

RESUMO DO CÓDIGO DA ESSÊNCIA:
${codigoSummary}

Gera o RELATÓRIO PARA O CÔNJUGE com esta estrutura JSON EXATA:

{
  "abertura_etica": "Texto de abertura ética (2-3 parágrafos). Começa com: 'Este documento é uma leitura relacional. Ele não define quem o teu cônjuge é, nem explica tudo sobre ele. É apenas um espelho para vos ajudar a entenderem-se melhor e crescerem juntos. Não é diagnóstico, nem rótulo. É um convite à conversa e à melhoria.'",
  
  "quem_ele_tenta_ser": {
    "titulo": "Quem ele está a tentar ser",
    "conteudo": "Descreve a melhor versão que esta pessoa busca viver no relacionamento, como ela deseja amar, e o que ela valoriza no casamento. Sem termos técnicos. Só intenção e desejo. (2-3 parágrafos)"
  },
  
  "como_ama_em_paz": {
    "titulo": "Como ele costuma amar quando está em paz",
    "conteudo": "Explica como ele se comporta quando está bem, como demonstra amor, o que costuma fazer de bom pela relação. Formato: 'Quando está em paz, ele tende a...' (3-4 bullet points)"
  },
  
  "como_erra_sob_pressao": {
    "titulo": "Como ele costuma errar quando está sob pressão",
    "conteudo": "Descrever claramente padrões de erro, atitudes que magoam, silêncios, controlos, explosões, distanciamentos. Usa exemplos do quotidiano (ex: 'Numa discussão sobre dinheiro, ele pode...', 'Quando está atrasado para um compromisso, ele tende a...'). Usa a frase 'Isto ajuda a entender, mas não torna aceitável.' APENAS UMA VEZ no final da secção, não em cada parágrafo. (3-4 parágrafos, cada um com informação diferente, sem repetições)"
  },
  
  "o_que_mais_machuca": {
    "titulo": "O que mais o magoa",
    "conteudo": "Descrever comportamentos que o ferem, coisas que ele evita falar, medos que ele esconde. Isto ajuda o cônjuge a ver vulnerabilidade, não só força. (2-3 parágrafos)"
  },
  
  "compromissos_de_mudanca": {
    "titulo": "Compromissos de mudança que ele assume",
    "introducao": "Aqui é o coração do relatório.",
    "compromissos": ["Compromisso 1", "Compromisso 2", "Compromisso 3", "Compromisso 4", "Compromisso 5"],
    "nota_final": "Tu tens o direito de esperar e cobrar esses compromissos com amor."
  },
  
  "como_voce_pode_ajudar": {
    "titulo": "Como podes ajudar, sem carregar por ele",
    "conteudo": "Descrever atitudes simples que ajudam, mas deixando claro: 'A mudança é responsabilidade dele, não tua.' Exemplo: 'Podes ajudar lembrando com carinho, mas não precisas de tolerar o que magoa.' (3-4 bullet points)"
  },
  
  "o_que_nao_deve_aceitar": {
    "titulo": "O que não deves aceitar",
    "conteudo": "Listar limites saudáveis: comportamentos que não devem ser normalizados, mesmo que façam parte do padrão dele. Formato: 'Entender não é o mesmo que aceitar.' (3-4 bullet points)"
  },
  
  "perguntas_para_conversa": {
    "titulo": "Perguntas para a conversa",
    "perguntas": [
      "Onde tu mais te sentes ferido(a) por mim?",
      "O que aqui faz sentido para ti?",
      "O que achas que eu ainda não estou a ver?",
      "O que esperas de mim daqui para a frente?",
      "Pergunta 5",
      "Pergunta 6"
    ]
  },
  
  "fechamento": {
    "titulo": "Fechamento",
    "conteudo": "Este relatório não é um ponto final. É apenas o começo de uma conversa. Se vocês puderem falar sobre isto com verdade e respeito, o relacionamento já estará a dar um passo importante."
  }
}` : `
PESSOA: ${firstName}
NOME DO CÔNJUGE: ${spouseName || 'Querido(a)'}

RESUMO DO CÓDIGO DA ESSÊNCIA:
${codigoSummary}

Gere o RELATÓRIO PARA O CÔNJUGE com esta estrutura JSON EXATA:

{
  "abertura_etica": "Texto de abertura ética (2-3 parágrafos). Comece com: 'Este documento é uma leitura relacional. Ele não define quem seu cônjuge é, nem explica tudo sobre ele. É apenas um espelho para ajudar vocês a se entenderem melhor e crescerem juntos. Não é diagnóstico, nem rótulo. É um convite à conversa e à melhoria.'",
  
  "quem_ele_tenta_ser": {
    "titulo": "Quem ele está tentando ser",
    "conteudo": "Descreva a melhor versão que esta pessoa busca viver no relacionamento, como ela deseja amar, e o que ela valoriza no casamento. Sem termos técnicos. Só intenção e desejo. (2-3 parágrafos)"
  },
  
  "como_ama_em_paz": {
    "titulo": "Como ele costuma amar quando está em paz",
    "conteudo": "Explique como ele se comporta quando está bem, como demonstra amor, o que costuma fazer de bom pela relação. Formato: 'Quando está em paz, ele tende a...' (3-4 bullet points)"
  },
  
  "como_erra_sob_pressao": {
    "titulo": "Como ele costuma errar quando está sob pressão",
    "conteudo": "Descrever claramente padrões de erro, atitudes que machucam, silêncios, controles, explosões, distanciamentos. Use exemplos do cotidiano (ex: 'Numa discussão sobre dinheiro, ele pode...', 'Quando está atrasado para um compromisso, ele tende a...'). Use a frase 'Isso ajuda a entender, mas não torna aceitável.' APENAS UMA VEZ no final da seção, não em cada parágrafo. (3-4 parágrafos, cada um com informação diferente, sem repetições)"
  },
  
  "o_que_mais_machuca": {
    "titulo": "O que mais machuca nele",
    "conteudo": "Descrever comportamentos que o ferem, coisas que ele evita falar, medos que ele esconde. Isso ajuda o cônjuge a ver vulnerabilidade, não só força. (2-3 parágrafos)"
  },
  
  "compromissos_de_mudanca": {
    "titulo": "Compromissos de mudança que ele assume",
    "introducao": "Aqui é o coração do relatório.",
    "compromissos": ["Compromisso 1", "Compromisso 2", "Compromisso 3", "Compromisso 4", "Compromisso 5"],
    "nota_final": "Você tem o direito de esperar e cobrar esses compromissos com amor."
  },
  
  "como_voce_pode_ajudar": {
    "titulo": "Como você pode ajudar, sem carregar por ele",
    "conteudo": "Descrever atitudes simples que ajudam, mas deixando claro: 'A mudança é responsabilidade dele, não sua.' Exemplo: 'Você pode ajudar lembrando com carinho, mas não precisa tolerar o que machuca.' (3-4 bullet points)"
  },
  
  "o_que_nao_deve_aceitar": {
    "titulo": "O que você não deve aceitar",
    "conteudo": "Listar limites saudáveis: comportamentos que não devem ser normalizados, mesmo que façam parte do padrão dele. Formato: 'Entender não é o mesmo que aceitar.' (3-4 bullet points)"
  },
  
  "perguntas_para_conversa": {
    "titulo": "Perguntas para a conversa",
    "perguntas": [
      "Onde você mais se sente ferido(a) por mim?",
      "O que aqui faz sentido para você?",
      "O que você acha que eu ainda não estou vendo?",
      "O que você espera de mim daqui para frente?",
      "Pergunta 5",
      "Pergunta 6"
    ]
  },
  
  "fechamento": {
    "titulo": "Fechamento",
    "conteudo": "Este relatório não é um ponto final. É apenas o começo de uma conversa. Se vocês puderem falar sobre isso com verdade e respeito, o relacionamento já estará dando um passo importante."
  }
}`;

  return basePrompt;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, locale = 'pt', spouseName = '' } = await req.json();
    
    console.log(`[relatorio-conjuge] Starting generation for user ${userId}, locale: ${locale}`);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", userId)
      .single();

    if (profileError) {
      console.error("[relatorio-conjuge] Profile fetch error:", profileError);
      throw new Error("User profile not found");
    }

    // Fetch mapa_essencia
    const { data: mapaEssencia, error: mapaError } = await supabase
      .from("mapa_essencia")
      .select("id, sections, raw_content")
      .eq("user_id", userId)
      .single();

    if (mapaError || !mapaEssencia) {
      console.error("[relatorio-conjuge] Mapa essencia fetch error:", mapaError);
      throw new Error("Código da Essência não encontrado. Gere o Código primeiro.");
    }

    const userName = profile.full_name || "Usuário";
    
    // Select system prompt based on locale
    let systemPrompt = SYSTEM_PROMPT_PT;
    if (locale === 'en') {
      systemPrompt = SYSTEM_PROMPT_EN;
    } else if (locale === 'pt-pt') {
      systemPrompt = SYSTEM_PROMPT_PT_PT;
    }

    // Build user prompt with codigo essencia data
    const userPrompt = getUserPrompt(locale, userName, spouseName, mapaEssencia.sections);

    console.log("[relatorio-conjuge] Calling AI API...");

    // Call Lovable AI
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 8000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[relatorio-conjuge] AI API error:", response.status, errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const rawContent = aiResponse.choices?.[0]?.message?.content || "";
    
    console.log("[relatorio-conjuge] AI response received, parsing JSON...");

    // Parse JSON from response
    let parsedContent;
    try {
      // Try to extract JSON from the response
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedContent = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("[relatorio-conjuge] JSON parse error:", parseError);
      throw new Error("Failed to parse AI response as JSON");
    }

    // Check if report already exists for this user
    const { data: existingReport } = await supabase
      .from("relatorio_conjuge")
      .select("id")
      .eq("user_id", userId)
      .single();

    let savedReport;
    if (existingReport) {
      // Update existing report
      const { data, error } = await supabase
        .from("relatorio_conjuge")
        .update({
          content: parsedContent,
          raw_content: rawContent,
          mapa_essencia_id: mapaEssencia.id,
          updated_at: new Date().toISOString(),
          public_token: crypto.randomUUID(),
          public_token_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          is_public_active: true,
        })
        .eq("id", existingReport.id)
        .select()
        .single();

      if (error) throw error;
      savedReport = data;
    } else {
      // Create new report
      const { data, error } = await supabase
        .from("relatorio_conjuge")
        .insert({
          user_id: userId,
          mapa_essencia_id: mapaEssencia.id,
          content: parsedContent,
          raw_content: rawContent,
        })
        .select()
        .single();

      if (error) throw error;
      savedReport = data;
    }

    console.log("[relatorio-conjuge] Report saved successfully:", savedReport.id);

    return new Response(
      JSON.stringify({
        success: true,
        report: savedReport,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("[relatorio-conjuge] Error:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
