import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// System prompts for Código da Essência generation - 3 Layers Structure
const SYSTEM_PROMPT_PT = `Você é Miguel, o guia do Nello One.
Sua missão é transformar os resultados dos testes do usuário em um Código da Essência organizado em três camadas:
síntese rápida, relatório profundo e integração prática.

O tom deve ser:
humano, empático, respeitoso, profundo e claro.
Sem jargões técnicos.
Sem promessas milagrosas.
Não use hífens.

IMPORTANTE - RESTRIÇÕES DE NOMENCLATURA:
- NUNCA use os termos "Linguagens do Amor", "Love Languages" ou "5 Love Languages" - use "Estilos de Conexão Afetiva"
- NUNCA use o termo "MBTI" ou "Myers-Briggs" - use "Nello 16 Personality" ou "Perfil de Personalidade Nello 16"
- Esses termos são marcas registradas e não devem ser usados

Você deve responder SEMPRE em JSON, no formato exato solicitado.
Não adicione texto fora do JSON.
Não explique o que está fazendo.
Apenas retorne o JSON estruturado.`;

const SYSTEM_PROMPT_EN = `You are Miguel, the guide of Nello One.
Your mission is to transform the user's test results into an Essence Code organized in three layers:
quick synthesis, deep report, and practical integration.

The tone should be:
human, empathetic, respectful, deep, and clear.
No technical jargon.
No miracle promises.
Do not use hyphens.

IMPORTANT - NAMING RESTRICTIONS:
- NEVER use the terms "Love Languages", "5 Love Languages" or "Linguagens do Amor" - use "Affection Connection Styles"
- NEVER use the terms "MBTI" or "Myers-Briggs" - use "Nello 16 Personality" or "Nello 16 Personality Profile"
- These are trademarked terms and must not be used

You must ALWAYS respond in JSON, in the exact format requested.
Do not add text outside the JSON.
Do not explain what you are doing.
Just return the structured JSON.`;

const SYSTEM_PROMPT_PT_PT = `Tu és o Miguel, o guia do Nello One.
A tua missão é transformar os resultados dos testes do utilizador num Código da Essência organizado em três camadas:
síntese rápida, relatório profundo e integração prática.

O tom deve ser:
humano, empático, respeitoso, profundo e claro.
Sem jargões técnicos.
Sem promessas milagrosas.
Não uses hífens.

IMPORTANTE - RESTRIÇÕES DE NOMENCLATURA:
- NUNCA uses os termos "Linguagens do Amor", "Love Languages" ou "5 Love Languages" - usa "Estilos de Conexão Afetiva"
- NUNCA uses o termo "MBTI" ou "Myers-Briggs" - usa "Nello 16 Personality" ou "Perfil de Personalidade Nello 16"
- Esses termos são marcas registadas e não devem ser usados

Deves responder SEMPRE em JSON, no formato exato solicitado.
Não adiciones texto fora do JSON.
Não expliques o que estás a fazer.
Apenas retorna o JSON estruturado.`;

// User prompt template for generating the Código da Essência - 3 Layers Structure
const getUserPrompt = (locale: string, results: any, userName: string) => {
  // Define sections based on the 3-layer structure
  const sections = [
    // LAYER 1 - Essential Synthesis
    { id: "sintese_essencial", title: locale === 'en' ? "Synthesis of Your Essence" : "Síntese da Sua Essência" },
    // LAYER 2 - Deep Report
    { id: "resumo_essencia", title: locale === 'en' ? "Summary of Your Essence" : "Resumo da Sua Essência" },
    { id: "matriz_essencial", title: locale === 'en' ? "Your Essential Matrix" : "Sua Matriz Essencial" },
    { id: "padroes_comportamento", title: locale === 'en' ? "Behavior Patterns" : "Padrões de Comportamento" },
    { id: "talentos_dons", title: locale === 'en' ? "Talents and Natural Gifts" : "Talentos e Dons Naturais" },
    { id: "dores_raizes", title: locale === 'en' ? "Root Pains and Challenges" : "Dores Raízes e Desafios" },
    { id: "proposito_natural", title: locale === 'en' ? "Your Natural Purpose" : "Seu Propósito Natural" },
    // LAYER 3 - Practical Integration
    { id: "caminho_maturidade", title: locale === 'en' ? "90-Day Maturity Path" : "Caminho de Maturidade de 90 Dias" },
    { id: "rotina_autoconsciencia", title: locale === 'en' ? "Self-Awareness Routine" : "Rotina de Autoconsciência" },
    // Closing
    { id: "conversa_coracao", title: locale === 'en' ? "A Conversation from the Heart" : "Uma Conversa do Coração" },
  ];

  if (locale === 'en') {
    return `Here are the consolidated results of ${userName}'s personality tests in JSON format:

${JSON.stringify(results, null, 2)}

AVAILABLE DATA:
- Name: ${userName}
- Nello 16 Personality
- DISC Profile
- Temperaments
- Predominant and secondary Archetypes
- Top Multiple Intelligences
- Affection Connection Styles
- Main behavioral patterns identified

Use everything in an integrated way, not as a list.

THE ESSENCE CODE SHOULD BE ORGANIZED IN 3 LAYERS:

🧩 LAYER 1 — ESSENTIAL SYNTHESIS

Goal: Give the user a quick and memorable portrait of who they are.

Instructions:
- Create a short block with the title "Synthesis of Your Essence"
- 4 to 6 bullet points, starting with: "You are someone who..."
- Simple, direct, human phrases
- Integrate: action, emotion, relationship, talents, and search for meaning
- Nothing technical

Example tone:
- You are someone who leads through action and initiative.
- You are someone who learns by doing and adapts quickly.
- You are someone who seeks depth in connections.
- You are someone who gets frustrated with superficiality.
- You are someone who flourishes when uniting results and purpose.

🧩 LAYER 2 — DEEP REPORT

Goal: Develop the complete narrative of the user's essence.

Write a structured text with the following blocks:
1. resumo_essencia - Summary of Your Essence
2. matriz_essencial - Your Essential Matrix
3. padroes_comportamento - Behavior Patterns (3 main patterns)
4. talentos_dons - Talents and Natural Gifts (3 talents)
5. dores_raizes - Root Pains and Challenges (3 pains)
6. proposito_natural - Your Natural Purpose

In each block:
- Integrate archetypes, personality, DISC, temperaments, intelligences, and affective style
- Show strengths and internal tensions as something human
- Use expressions like: "tends to", "points to", "there is a search", "it is common that you feel"
- Avoid absolute tone
- Tone: deep, but accessible

🧩 LAYER 3 — PRACTICAL INTEGRATION

Goal: Help the user bring their essence to real life.

Divide into:

🔹 caminho_maturidade - 90-Day Maturity Path
- Month 1, 2, and 3
- Each month with:
  - Main focus
  - Simple practice
  - Reflection question
- Integrate the main traits of the profile

🔹 rotina_autoconsciencia - Self-Awareness Routine
Divide into:
- Morning
- Afternoon
- Night
With brief practices linked to the user's profile.

🧩 HUMAN CLOSING

conversa_coracao - A Conversation from the Heart

Goal: Close the Essence Code with validation and humanity.

Instructions:
- Write 3 to 4 paragraphs that:
- Start with something like: "Before anything, something needs to be clear"
- Clearly affirm that: this is not generic, there is substance and coherence, there is something real here about who the person is
- Integrate: archetypes as life role, intelligences as way of learning and creating, affective style as way of loving and connecting
- Bring internal tensions as richness, not a problem
- End with: validation, encouragement, invitation to consciousness
- Tone: human, warm, true
- Call the user by their first name
- Do not use hyphens

Respond in JSON with the following structure:

{
  "language": "en",
  "userName": "${userName}",
  "generatedAt": "[current timestamp]",
  "sections": [
    {
      "id": "sintese_essencial",
      "title": "Synthesis of Your Essence",
      "bullets": ["You are someone who...", "You are someone who...", ...]
    },
    {
      "id": "resumo_essencia",
      "title": "Summary of Your Essence",
      "paragraphs": ["paragraph 1", "paragraph 2", "paragraph 3"]
    },
    {
      "id": "matriz_essencial",
      "title": "Your Essential Matrix",
      "paragraphs": ["paragraph 1", "paragraph 2"]
    },
    {
      "id": "padroes_comportamento",
      "title": "Behavior Patterns",
      "paragraphs": ["paragraph 1", "paragraph 2", "paragraph 3"]
    },
    {
      "id": "talentos_dons",
      "title": "Talents and Natural Gifts",
      "paragraphs": ["paragraph 1", "paragraph 2", "paragraph 3"]
    },
    {
      "id": "dores_raizes",
      "title": "Root Pains and Challenges",
      "paragraphs": ["paragraph 1", "paragraph 2", "paragraph 3"]
    },
    {
      "id": "proposito_natural",
      "title": "Your Natural Purpose",
      "paragraphs": ["paragraph 1", "paragraph 2"]
    },
    {
      "id": "caminho_maturidade",
      "title": "90-Day Maturity Path",
      "months": [
        {
          "month": 1,
          "focus": "Main focus",
          "practice": "Simple practice",
          "question": "Reflection question"
        },
        {
          "month": 2,
          "focus": "Main focus",
          "practice": "Simple practice",
          "question": "Reflection question"
        },
        {
          "month": 3,
          "focus": "Main focus",
          "practice": "Simple practice",
          "question": "Reflection question"
        }
      ]
    },
    {
      "id": "rotina_autoconsciencia",
      "title": "Self-Awareness Routine",
      "routine": {
        "morning": "Morning practice",
        "afternoon": "Afternoon practice",
        "night": "Night practice"
      }
    },
    {
      "id": "conversa_coracao",
      "title": "A Conversation from the Heart",
      "paragraphs": ["paragraph 1", "paragraph 2", "paragraph 3", "paragraph 4"]
    }
  ]
}

RULES:
- The sintese_essencial section must have 4-6 bullets starting with "You are someone who..."
- Each report section must have 2-4 meaningful paragraphs
- conversa_coracao must have 3-4 paragraphs
- Be specific and reference actual test results
- Every section MUST cross-reference multiple tests
- Use warm, human, deep language
- Make content actionable and practical
- The conversa_coracao should make the user think "This spoke about ME. It's not generic."
- Do not use generic statements - personalize everything
- Do not use hyphens`;
  }

  const isEuropean = locale === 'pt-pt';
  const youWord = isEuropean ? 'tu' : 'você';
  const yourWord = isEuropean ? 'sua' : 'sua';
  const haveWord = isEuropean ? 'tens' : 'tem';

  return `Aqui estão os resultados consolidados dos testes de personalidade de ${userName} em formato JSON:

${JSON.stringify(results, null, 2)}

DADOS DISPONÍVEIS:
- Nome: ${userName}
- Nello 16 Personality
- Perfil DISC
- Temperamentos
- Arquétipos predominantes e secundários
- Inteligências Múltiplas mais altas
- Estilos de Conexão Afetiva
- Principais padrões comportamentais identificados

Use tudo de forma integrada, não como lista.

O CÓDIGO DA ESSÊNCIA DEVE SER ORGANIZADO EM 3 CAMADAS:

🧩 CAMADA 1 — SÍNTESE ESSENCIAL

🎯 Objetivo: Dar ao usuário um retrato rápido e memorável de quem ele é.

✍️ Instruções:
- Crie um bloco curto com o título "Síntese da Sua Essência"
- 4 a 6 pontos em bullet, começando com: "${youWord.charAt(0).toUpperCase() + youWord.slice(1)} é alguém que..."
- Frases simples, diretas, humanas
- Integrar: ação, emoção, relação, talentos e busca de sentido
- Nada técnico

🧾 Exemplo de tom:
- ${youWord.charAt(0).toUpperCase() + youWord.slice(1)} é alguém que lidera pela ação e iniciativa.
- ${youWord.charAt(0).toUpperCase() + youWord.slice(1)} é alguém que aprende fazendo e se adapta rápido.
- ${youWord.charAt(0).toUpperCase() + youWord.slice(1)} é alguém que busca profundidade nas conexões.
- ${youWord.charAt(0).toUpperCase() + youWord.slice(1)} é alguém que se frustra com superficialidade.
- ${youWord.charAt(0).toUpperCase() + youWord.slice(1)} é alguém que floresce quando une resultado e propósito.

🧩 CAMADA 2 — RELATÓRIO PROFUNDO

🎯 Objetivo: Desenvolver a narrativa completa da essência do usuário.

Escreva um texto estruturado com os blocos:
1. resumo_essencia - Resumo da Sua Essência
2. matriz_essencial - Sua Matriz Essencial
3. padroes_comportamento - Padrões de Comportamento (3 padrões principais)
4. talentos_dons - Talentos e Dons Naturais (3 talentos)
5. dores_raizes - Dores Raízes e Desafios (3 dores)
6. proposito_natural - Seu Propósito Natural

Em cada bloco:
- Integre arquétipos, personalidade, DISC, temperamentos, inteligências e estilo afetivo
- Mostre forças e tensões internas como algo humano
- Use expressões como: "tende a", "aponta para", "há uma busca", "é comum que ${youWord} sinta"
- Evite tom absoluto
- Tom: profundo, mas acessível

🧩 CAMADA 3 — INTEGRAÇÃO PRÁTICA

🎯 Objetivo: Ajudar o usuário a trazer a essência para a vida real.

Divida em:

🔹 caminho_maturidade - Caminho de Maturidade de 90 Dias
- Mês 1, 2 e 3
- Cada mês com:
  - Foco principal
  - Prática simples
  - Pergunta de reflexão
- Integre os principais traços do perfil

🔹 rotina_autoconsciencia - Rotina de Autoconsciência
Divida em:
- Manhã
- Tarde
- Noite
Com práticas breves ligadas ao perfil do usuário.

🧩 FECHAMENTO HUMANO

conversa_coracao - Uma Conversa do Coração

🎯 Objetivo: Fechar o Código da Essência com validação e humanidade.

✍️ Instruções:
- Escreva 3 a 4 parágrafos que:
- Comecem com algo como: "Antes de tudo, é importante dizer uma coisa"
- Afirme claramente que: isso não é genérico, há substância e coerência, há algo real aqui sobre quem a pessoa é
- Integre: arquétipos como papel de vida, inteligências como forma de aprender e criar, estilo afetivo como forma de amar e se conectar
- Traga as tensões internas como riqueza, não problema
- Termine com: validação, encorajamento, convite à consciência
- Tom: humano, caloroso, verdadeiro
- Chame o usuário pelo primeiro nome
- Não use hífens

Responda em JSON com a seguinte estrutura:

{
  "language": "${locale}",
  "userName": "${userName}",
  "generatedAt": "[timestamp atual]",
  "sections": [
    {
      "id": "sintese_essencial",
      "title": "Síntese da Sua Essência",
      "bullets": ["${youWord.charAt(0).toUpperCase() + youWord.slice(1)} é alguém que...", "${youWord.charAt(0).toUpperCase() + youWord.slice(1)} é alguém que...", ...]
    },
    {
      "id": "resumo_essencia",
      "title": "Resumo da Sua Essência",
      "paragraphs": ["parágrafo 1", "parágrafo 2", "parágrafo 3"]
    },
    {
      "id": "matriz_essencial",
      "title": "Sua Matriz Essencial",
      "paragraphs": ["parágrafo 1", "parágrafo 2"]
    },
    {
      "id": "padroes_comportamento",
      "title": "Padrões de Comportamento",
      "paragraphs": ["parágrafo 1", "parágrafo 2", "parágrafo 3"]
    },
    {
      "id": "talentos_dons",
      "title": "Talentos e Dons Naturais",
      "paragraphs": ["parágrafo 1", "parágrafo 2", "parágrafo 3"]
    },
    {
      "id": "dores_raizes",
      "title": "Dores Raízes e Desafios",
      "paragraphs": ["parágrafo 1", "parágrafo 2", "parágrafo 3"]
    },
    {
      "id": "proposito_natural",
      "title": "Seu Propósito Natural",
      "paragraphs": ["parágrafo 1", "parágrafo 2"]
    },
    {
      "id": "caminho_maturidade",
      "title": "Caminho de Maturidade de 90 Dias",
      "months": [
        {
          "month": 1,
          "focus": "Foco principal",
          "practice": "Prática simples",
          "question": "Pergunta de reflexão"
        },
        {
          "month": 2,
          "focus": "Foco principal",
          "practice": "Prática simples",
          "question": "Pergunta de reflexão"
        },
        {
          "month": 3,
          "focus": "Foco principal",
          "practice": "Prática simples",
          "question": "Pergunta de reflexão"
        }
      ]
    },
    {
      "id": "rotina_autoconsciencia",
      "title": "Rotina de Autoconsciência",
      "routine": {
        "morning": "Prática da manhã",
        "afternoon": "Prática da tarde",
        "night": "Prática da noite"
      }
    },
    {
      "id": "conversa_coracao",
      "title": "Uma Conversa do Coração",
      "paragraphs": ["parágrafo 1", "parágrafo 2", "parágrafo 3", "parágrafo 4"]
    }
  ]
}

REGRAS:
- A seção sintese_essencial deve ter 4-6 bullets começando com "${youWord.charAt(0).toUpperCase() + youWord.slice(1)} é alguém que..."
- Cada seção do relatório deve ter 2-4 parágrafos significativos
- conversa_coracao deve ter 3-4 parágrafos
- Seja específico e referencie os resultados reais dos testes
- Cada seção DEVE cruzar múltiplos testes
- Use linguagem acolhedora, humana e profunda
- Torne o conteúdo aplicável e prático
- O conversa_coracao deve fazer o usuário pensar "Isso falou de mim. Não é genérico."
- Não use frases genéricas - personalize tudo
- Não use hífens
- ${isEuropean ? 'Use português europeu (tu, teu, tua)' : 'Use português brasileiro (você, seu, sua)'}`;
};

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_id, locale = 'pt-br' } = await req.json();

    if (!user_id) {
      return new Response(
        JSON.stringify({ error: "user_id is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1. Validate user has completed the journey
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("journey_status, full_name")
      .eq("id", user_id)
      .single();

    if (profileError) {
      console.error("Error fetching profile:", profileError);
      return new Response(
        JSON.stringify({ error: "user_not_found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check journey status (allow both new field and legacy check)
    let journeyCompleted = profile.journey_status === 'completed';
    
    // Fallback: check user_tests directly
    if (!journeyCompleted) {
      const { data: completedTests, error: testsError } = await supabase
        .from("user_tests")
        .select("test_id, status, tests(type)")
        .eq("user_id", user_id)
        .eq("status", "completed");

      if (!testsError && completedTests) {
        const completedTypes = new Set(completedTests.map(t => (t.tests as any)?.type));
        const requiredTypes = ['arquetipos_proposito', 'inteligencias_multiplas', 'linguagens_amor', 'mbti', 'disc', 'eneagrama', 'temperamentos'];
        journeyCompleted = requiredTypes.every(type => 
          completedTypes.has(type) || 
          (type === 'linguagens_amor' && completedTypes.has('estilos_conexao')) ||
          (type === 'mbti' && completedTypes.has('nello16'))
        );
      }
    }

    if (!journeyCompleted) {
      return new Response(
        JSON.stringify({ error: "journey_not_completed" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2. Collect all test results
    const { data: userTests, error: userTestsError } = await supabase
      .from("user_tests")
      .select("test_id, status, result_data, tests(type, name)")
      .eq("user_id", user_id)
      .eq("status", "completed");

    if (userTestsError) {
      console.error("Error fetching user tests:", userTestsError);
      return new Response(
        JSON.stringify({ error: "failed_to_fetch_results" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build consolidated results object with copyright-safe names
    const testNameMapping: Record<string, string> = {
      'linguagens_amor': 'Estilos de Conexão Afetiva',
      'mbti': 'Nello 16 Personality',
      'disc': 'DISC',
      'eneagrama': 'Eneagrama',
      'temperamentos': 'Temperamentos',
      'inteligencias_multiplas': 'Inteligências Múltiplas',
      'arquetipos_proposito': 'Arquétipos com Propósito',
      'arquetipos': 'Arquétipos',
    };

    const testKeyMapping: Record<string, string> = {
      'linguagens_amor': 'estilos_conexao_afetiva',
      'mbti': 'nello16_personality',
    };

    const results: Record<string, any> = {};
    
    userTests?.forEach(ut => {
      const testType = (ut.tests as any)?.type;
      
      if (testType && ut.result_data) {
        // Use mapped key and name to avoid copyright terms
        const mappedKey = testKeyMapping[testType] || testType;
        const mappedName = testNameMapping[testType] || (ut.tests as any)?.name;
        const resultData = ut.result_data as any;
        
        results[mappedKey] = {
          testName: mappedName,
          ...extractKeyResults(testType, resultData)
        };
      }
    });

    const userName = profile.full_name || (locale === 'en' ? 'Traveler' : 'Viajante');

    // 3. Call AI to generate the Código da Essência
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "ai_not_configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Select system prompt based on locale
    let systemPrompt = SYSTEM_PROMPT_PT;
    if (locale === 'en') {
      systemPrompt = SYSTEM_PROMPT_EN;
    } else if (locale === 'pt-pt') {
      systemPrompt = SYSTEM_PROMPT_PT_PT;
    }

    const userPrompt = getUserPrompt(locale, results, userName);

    console.log("Calling AI to generate Código da Essência for user:", user_id);

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
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 8000,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI API error:", aiResponse.status, errorText);
      return new Response(
        JSON.stringify({ error: "ai_generation_failed", details: errorText }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiData = await aiResponse.json();
    const generatedContent = aiData.choices?.[0]?.message?.content;

    if (!generatedContent) {
      return new Response(
        JSON.stringify({ error: "empty_ai_response" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse the JSON from AI response
    let parsedReport;
    try {
      // Clean the response if it has markdown code blocks
      let cleanContent = generatedContent.trim();
      if (cleanContent.startsWith("```json")) {
        cleanContent = cleanContent.replace(/^```json\n?/, "").replace(/\n?```$/, "");
      } else if (cleanContent.startsWith("```")) {
        cleanContent = cleanContent.replace(/^```\n?/, "").replace(/\n?```$/, "");
      }
      
      parsedReport = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", parseError);
      console.log("Raw AI response:", generatedContent);
      return new Response(
        JSON.stringify({ error: "invalid_ai_response", raw: generatedContent }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 4. Save the report to mapa_essencia table
    const { error: saveError } = await supabase
      .from("mapa_essencia")
      .upsert({
        user_id,
        sections: parsedReport.sections || parsedReport,
        raw_content: generatedContent,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id'
      });

    if (saveError) {
      console.error("Error saving report:", saveError);
      // Don't fail - still return the generated report
    }

    console.log("Successfully generated Código da Essência for user:", user_id);

    return new Response(
      JSON.stringify(parsedReport),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in miguel-codigo-essencia:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

/**
 * Mapping from internal MBTI-style codes to Nello proprietary display codes
 */
const NELLO_16_CODE_MAP: Record<string, string> = {
  INTJ: "N1-EA", INTP: "N2-AA", ENTJ: "N3-AO", ENTP: "N4-VI",
  INFJ: "N5-CP", INFP: "N6-PI", ENFJ: "N7-MI", ENFP: "N8-IC",
  ISTJ: "N9-GP", ISFJ: "N10-PC", ESTJ: "N11-GE", ESFJ: "N12-AF",
  ISTP: "N13-AV", ISFP: "N14-AE", ESTP: "N15-AT", ESFP: "N16-AP",
};

/**
 * Extracts key results from each test type for the consolidated summary
 */
function extractKeyResults(testType: string, resultData: any): any {
  switch (testType) {
    case 'arquetipos_proposito':
    case 'arquetipos':
      // Handle multiple data structures for archetypes
      const primaryArchetype = resultData.primary?.archetype || resultData.archetype || resultData.arquetipo || resultData.dominante || resultData.dominant;
      const secondaryArchetype = resultData.secondary?.archetype || resultData.secondary || resultData.secundario;
      return {
        dominantArchetype: primaryArchetype,
        secondaryArchetype: secondaryArchetype,
        archetypeOfEssence: resultData.essenceArchetype || resultData.arquetipoEssencia,
        description: resultData.primary?.description || resultData.description || resultData.descricao,
        strengths: resultData.primary?.strengths || resultData.strengths || resultData.forcas,
        challenges: resultData.primary?.challenges || resultData.challenges || resultData.desafios,
      };

    case 'disc':
      return {
        dominantProfile: resultData.dominant || resultData.dominante,
        scores: resultData.scores || resultData.pontuacoes,
        description: resultData.description || resultData.descricao,
        strengths: resultData.strengths || resultData.forcas,
        challenges: resultData.challenges || resultData.desafios,
      };

    case 'mbti':
    case 'nello16':
      // Convert MBTI code to Nello code for display
      const internalType = resultData.type || resultData.tipo || resultData.personalityType;
      const nelloCode = NELLO_16_CODE_MAP[internalType] || internalType;
      return {
        personalityType: nelloCode,
        internalType: internalType, // Keep internal reference if needed
        dimensions: resultData.dimensions || resultData.dimensoes,
        description: resultData.description || resultData.descricao,
        strengths: resultData.strengths || resultData.forcas,
        challenges: resultData.challenges || resultData.desafios,
      };

    case 'eneagrama':
      return {
        type: resultData.type || resultData.tipo,
        wing: resultData.wing || resultData.asa,
        description: resultData.description || resultData.descricao,
        passion: resultData.passion || resultData.paixao,
        virtue: resultData.virtue || resultData.virtude,
        fear: resultData.fear || resultData.medo,
        desire: resultData.desire || resultData.desejo,
      };

    case 'temperamentos':
      // Handle both object and string formats
      const primaryTemp = resultData.primary?.name || resultData.primary?.temperament || resultData.dominant || resultData.dominante;
      const secondaryTemp = resultData.secondary?.name || resultData.secondary?.temperament || resultData.secondary || resultData.secundario;
      return {
        dominantTemperament: primaryTemp,
        secondaryTemperament: secondaryTemp,
        description: resultData.description || resultData.interpretation || resultData.descricao,
        strengths: resultData.strengths || resultData.forcas,
        challenges: resultData.challenges || resultData.desafios,
      };

    case 'inteligencias_multiplas':
      // Handle multiple data structures for multiple intelligences
      const topIntelligences = resultData.dominant?.name 
        ? [resultData.dominant.name, resultData.secondary?.name, resultData.tertiary?.name].filter(Boolean)
        : resultData.top || resultData.principais || [];
      return {
        topIntelligences: topIntelligences,
        dominantIntelligence: resultData.dominant?.name || resultData.dominant || topIntelligences[0],
        secondaryIntelligence: resultData.secondary?.name || resultData.secondary || topIntelligences[1],
        scores: resultData.scores || resultData.pontuacoes,
        description: resultData.dominant?.description || resultData.description || resultData.descricao,
        learningStyle: resultData.learningStyle || resultData.estiloAprendizagem,
      };

    case 'linguagens_amor':
    case 'estilos_conexao':
      // Map old style names to new proprietary names
      const STYLE_NAME_MAP: Record<string, string> = {
        'Palavras de Afirmação': 'Expressão Verbal',
        'Words of Affirmation': 'Verbal Expression',
        'Tempo de Qualidade': 'Presença Ativa',
        'Quality Time': 'Active Presence',
        'Presentes': 'Gestos Simbólicos',
        'Presentes e Gestos Simbólicos': 'Gestos Simbólicos',
        'Receiving Gifts': 'Symbolic Gestures',
        'Atos de Serviço': 'Cuidado Prático',
        'Acts of Service': 'Practical Care',
        'Toque Físico': 'Conexão Física',
        'Physical Touch': 'Physical Connection',
      };
      
      // Handle multiple data structures for affection connection styles
      let rawPrimaryStyle = resultData.primary?.name || resultData.primary?.style || resultData.dominant || resultData.dominante;
      let rawSecondaryStyle = resultData.secondary?.name || resultData.secondary?.style || resultData.secondary || resultData.secundario;
      
      // Handle object format (with .pt)
      if (typeof rawPrimaryStyle === 'object' && rawPrimaryStyle?.pt) {
        rawPrimaryStyle = rawPrimaryStyle.pt;
      }
      if (typeof rawSecondaryStyle === 'object' && rawSecondaryStyle?.pt) {
        rawSecondaryStyle = rawSecondaryStyle.pt;
      }
      
      // Map old names to new names
      const primaryStyleMapped = STYLE_NAME_MAP[rawPrimaryStyle] || rawPrimaryStyle;
      const secondaryStyleMapped = STYLE_NAME_MAP[rawSecondaryStyle] || rawSecondaryStyle;
      
      return {
        dominantStyle: primaryStyleMapped,
        secondaryStyle: secondaryStyleMapped,
        scores: resultData.scores || resultData.pontuacoes,
        description: resultData.primary?.description || resultData.description || resultData.descricao,
        interpretation: resultData.interpretation || resultData.interpretacao,
      };

    default:
      return resultData;
  }
}
