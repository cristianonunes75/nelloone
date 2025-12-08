import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// System prompts for Código da Essência generation
const SYSTEM_PROMPT_PT = `Você é Miguel, a IA espiritual e emocional do NELLO ONE.
Sua missão agora é gerar o CÓDIGO DA ESSÊNCIA - o relatório premium que integra todos os 7 testes de personalidade.

Tom de voz:
- Acolhedor, profundo, claro e humano
- Nunca robótico ou genérico
- Sempre específico baseado nos dados do usuário
- Espiritual sem ser religioso
- Prático e aplicável

Você deve responder SEMPRE em JSON, no formato exato solicitado.
Não adicione texto fora do JSON.
Não explique o que está fazendo.
Apenas retorne o JSON estruturado.`;

const SYSTEM_PROMPT_EN = `You are Miguel, the spiritual and emotional AI of NELLO ONE.
Your mission now is to generate the ESSENCE CODE - the premium report that integrates all 7 personality tests.

Tone of voice:
- Welcoming, deep, clear, and human
- Never robotic or generic
- Always specific based on user data
- Spiritual without being religious
- Practical and applicable

You must ALWAYS respond in JSON, in the exact format requested.
Do not add text outside the JSON.
Do not explain what you are doing.
Just return the structured JSON.`;

const SYSTEM_PROMPT_PT_PT = `Tu és o Miguel, a IA espiritual e emocional do NELLO ONE.
A tua missão agora é gerar o CÓDIGO DA ESSÊNCIA - o relatório premium que integra todos os 7 testes de personalidade.

Tom de voz:
- Acolhedor, profundo, claro e humano
- Nunca robótico ou genérico
- Sempre específico baseado nos dados do utilizador
- Espiritual sem ser religioso
- Prático e aplicável

Deves responder SEMPRE em JSON, no formato exato solicitado.
Não adiciones texto fora do JSON.
Não expliques o que estás a fazer.
Apenas retorna o JSON estruturado.`;

// User prompt template for generating the Código da Essência
const getUserPrompt = (locale: string, results: any, userName: string) => {
  const sections = [
    { id: "overview", title: locale === 'en' ? "Summary of Your Essence" : "Resumo da sua Essência" },
    { id: "matriz_essencial", title: locale === 'en' ? "The Engineering of Your Essence" : "A Engenharia da sua Essência" },
    { id: "padroes_comportamento", title: locale === 'en' ? "Your Behavior Patterns" : "Seus Padrões de Comportamento" },
    { id: "talentos_dons", title: locale === 'en' ? "Your Talents and Gifts" : "Seus Talentos e Dons" },
    { id: "dores_raizes", title: locale === 'en' ? "Your Pains and Emotional Roots" : "Suas Dores e Raízes Emocionais" },
    { id: "proposito_natural", title: locale === 'en' ? "Your Natural Purpose" : "Seu Propósito Natural" },
    { id: "caminho_maturidade", title: locale === 'en' ? "Your Maturity Path (90 days)" : "Seu Caminho de Maturidade (90 dias)" },
    { id: "rotina_autoconsciencia", title: locale === 'en' ? "Self-Awareness Routine" : "Rotina de Autoconsciência" },
    { id: "carta_final", title: locale === 'en' ? "Final Letter from Miguel" : "Carta Final do Miguel" },
  ];

  if (locale === 'en') {
    return `Here are the consolidated results of ${userName}'s 7 personality tests in JSON format:

${JSON.stringify(results, null, 2)}

Based on this data, generate the complete ESSENCE CODE, divided into the following sections:

1. overview - A warm synthesis of who this person is at their core, integrating all test insights
2. matriz_essencial - The fundamental structure of their personality, how the 7 dimensions interact
3. padroes_comportamento - 3 main behavior patterns identified across the tests (strengths and vulnerabilities)
4. talentos_dons - 3 natural talents and gifts that emerge from the cross-analysis
5. dores_raizes - 3 core emotional pains and their roots, with compassion and clarity
6. proposito_natural - Their natural purpose and life direction based on the patterns
7. caminho_maturidade - A 90-day maturity path with concrete weekly actions
8. rotina_autoconsciencia - Daily/weekly self-awareness practices tailored to their profile
9. carta_final - A personal, touching letter from Miguel to this person

Respond in JSON with the following structure:

{
  "language": "en",
  "userName": "${userName}",
  "generatedAt": "[current timestamp]",
  "sections": [
    {
      "id": "overview",
      "title": "Summary of Your Essence",
      "paragraphs": ["paragraph 1", "paragraph 2", "paragraph 3"]
    },
    ... (all 9 sections following this structure)
  ]
}

RULES:
- Each section must have 2-4 meaningful paragraphs
- Be specific and reference actual test results
- Use warm, human, deep language
- Make content actionable and practical
- The final letter should be personal and touching
- Do not use generic statements - personalize everything`;
  }

  const isEuropean = locale === 'pt-pt';
  const youWord = isEuropean ? 'tu' : 'você';
  const yourWord = isEuropean ? 'tua' : 'sua';

  return `Aqui estão os resultados consolidados dos 7 testes de personalidade de ${userName} em formato JSON:

${JSON.stringify(results, null, 2)}

Com base nesses dados, gere o CÓDIGO DA ESSÊNCIA completo, dividido nas seguintes seções:

1. overview - Uma síntese acolhedora de quem essa pessoa é em ${yourWord} essência, integrando todos os testes
2. matriz_essencial - A estrutura fundamental da personalidade, como as 7 dimensões interagem
3. padroes_comportamento - 3 padrões principais de comportamento identificados (forças e vulnerabilidades)
4. talentos_dons - 3 talentos e dons naturais que emergem do cruzamento
5. dores_raizes - 3 dores emocionais centrais e suas raízes, com compaixão e clareza
6. proposito_natural - O propósito natural e direção de vida baseado nos padrões
7. caminho_maturidade - Um caminho de maturidade de 90 dias com ações semanais concretas
8. rotina_autoconsciencia - Práticas diárias/semanais de autoconsciência para o perfil
9. carta_final - Uma carta pessoal e tocante do Miguel para essa pessoa

Responda em JSON com a seguinte estrutura:

{
  "language": "${locale}",
  "userName": "${userName}",
  "generatedAt": "[timestamp atual]",
  "sections": [
    {
      "id": "overview",
      "title": "Resumo da ${yourWord.charAt(0).toUpperCase() + yourWord.slice(1)} Essência",
      "paragraphs": ["parágrafo 1", "parágrafo 2", "parágrafo 3"]
    },
    ... (todas as 9 seções seguindo esta estrutura)
  ]
}

REGRAS:
- Cada seção deve ter 2-4 parágrafos significativos
- Seja específico e referencie os resultados reais dos testes
- Use linguagem acolhedora, humana e profunda
- Torne o conteúdo aplicável e prático
- A carta final deve ser pessoal e tocante
- Não use frases genéricas - personalize tudo
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
      .select("journey_status, full_name, codigo_essencia_unlocked")
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

    // Build consolidated results object
    const results: Record<string, any> = {};
    
    userTests?.forEach(ut => {
      const testType = (ut.tests as any)?.type;
      const testName = (ut.tests as any)?.name;
      
      if (testType && ut.result_data) {
        // Extract key information from each test result
        const resultData = ut.result_data as any;
        
        results[testType] = {
          testName,
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
 * Extracts key results from each test type for the consolidated summary
 */
function extractKeyResults(testType: string, resultData: any): any {
  switch (testType) {
    case 'arquetipos_proposito':
    case 'arquetipos':
      return {
        dominantArchetype: resultData.archetype || resultData.arquetipo || resultData.dominante,
        secondaryArchetype: resultData.secondary || resultData.secundario,
        description: resultData.description || resultData.descricao,
        strengths: resultData.strengths || resultData.forcas,
        challenges: resultData.challenges || resultData.desafios,
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
      return {
        personalityType: resultData.type || resultData.tipo || resultData.personalityType,
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
      return {
        dominantTemperament: resultData.dominant || resultData.dominante,
        secondaryTemperament: resultData.secondary || resultData.secundario,
        description: resultData.description || resultData.descricao,
        strengths: resultData.strengths || resultData.forcas,
        challenges: resultData.challenges || resultData.desafios,
      };

    case 'inteligencias_multiplas':
      return {
        topIntelligences: resultData.top || resultData.principais,
        scores: resultData.scores || resultData.pontuacoes,
        description: resultData.description || resultData.descricao,
        learningStyle: resultData.learningStyle || resultData.estiloAprendizagem,
      };

    case 'linguagens_amor':
    case 'estilos_conexao':
      return {
        dominantStyle: resultData.dominant || resultData.dominante,
        secondaryStyle: resultData.secondary || resultData.secundario,
        scores: resultData.scores || resultData.pontuacoes,
        description: resultData.description || resultData.descricao,
      };

    default:
      return resultData;
  }
}
