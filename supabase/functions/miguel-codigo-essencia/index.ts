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

IMPORTANTE - RESTRIÇÕES DE NOMENCLATURA:
- NUNCA use os termos "Linguagens do Amor", "Love Languages" ou "5 Love Languages" - use "Estilos de Conexão Afetiva"
- NUNCA use o termo "MBTI" ou "Myers-Briggs" - use "Nello 16 Personality" ou "Perfil de Personalidade Nello 16"
- Esses termos são marcas registradas e não devem ser usados

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

IMPORTANT - NAMING RESTRICTIONS:
- NEVER use the terms "Love Languages", "5 Love Languages" or "Linguagens do Amor" - use "Affection Connection Styles"
- NEVER use the terms "MBTI" or "Myers-Briggs" - use "Nello 16 Personality" or "Nello 16 Personality Profile"
- These are trademarked terms and must not be used

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

IMPORTANTE - RESTRIÇÕES DE NOMENCLATURA:
- NUNCA uses os termos "Linguagens do Amor", "Love Languages" ou "5 Love Languages" - usa "Estilos de Conexão Afetiva"
- NUNCA uses o termo "MBTI" ou "Myers-Briggs" - usa "Nello 16 Personality" ou "Perfil de Personalidade Nello 16"
- Esses termos são marcas registadas e não devem ser usados

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

THE 7 TESTS THAT MUST BE ANALYZED AND CROSS-REFERENCED:
1. Arquétipos com Propósito (Archetypes) - Reveals the symbolic energy that drives the person
2. DISC - Reveals behavioral profile and communication style
3. Nello 16 Personality - Reveals cognitive functions and decision-making style
4. Eneagrama (Enneagram) - Reveals core motivation, fear, and desire
5. Temperamentos (Temperaments) - Reveals the biological/emotional base of reactions
6. Inteligências Múltiplas (Multiple Intelligences) - Reveals natural cognitive strengths
7. Estilos de Conexão Afetiva (Affection Connection Styles) - Reveals how the person gives and receives love

CRITICAL INSTRUCTION: You MUST reference and cross-analyze ALL 7 tests in EVERY section. Each section should show how the different tests interact, complement, or create tension with each other. This is NOT a summary of individual tests - it's a SYNTHESIS that reveals patterns only visible when crossing all dimensions.

Based on this data, generate the complete ESSENCE CODE, divided into the following sections:

1. overview - A warm synthesis of who this person is at their core. MUST mention insights from ALL 7 tests and how they form a coherent whole.
2. matriz_essencial - The fundamental structure of their personality. Show specifically how the 7 dimensions interact with each other (e.g., "Your Archetype X combined with Enneagram type Y creates a unique pattern of...").
3. padroes_comportamento - 3 main behavior patterns identified by CROSSING the tests. Each pattern should reference at least 3 different tests.
4. talentos_dons - 3 natural talents that emerge from cross-analysis. Each talent should be supported by evidence from multiple tests.
5. dores_raizes - 3 core emotional pains. Show how different tests reveal the same root from different angles.
6. proposito_natural - Their natural purpose based on the intersection of Archetype + Intelligences + Enneagram + DISC.
7. caminho_maturidade - A 90-day maturity path with actions that address insights from ALL tests.
8. rotina_autoconsciencia - Practices tailored to their complete profile (all 7 dimensions).
9. carta_final - A personal letter that weaves together the most important revelations from all tests.

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
- Be specific and reference actual test results BY NAME (e.g., "Your DISC profile of D combined with...")
- Every section MUST cross-reference at least 3 different tests
- Use warm, human, deep language
- Make content actionable and practical
- The final letter should be personal and touching
- Do not use generic statements - personalize everything based on the specific test results`;
  }

  const isEuropean = locale === 'pt-pt';
  const youWord = isEuropean ? 'tu' : 'você';
  const yourWord = isEuropean ? 'tua' : 'sua';
  const haveWord = isEuropean ? 'tens' : 'tem';

  return `Aqui estão os resultados consolidados dos 7 testes de personalidade de ${userName} em formato JSON:

${JSON.stringify(results, null, 2)}

OS 7 TESTES QUE DEVEM SER ANALISADOS E CRUZADOS:
1. Arquétipos com Propósito - Revela a energia simbólica que move a pessoa
2. DISC - Revela o perfil comportamental e estilo de comunicação
3. Nello 16 Personality - Revela funções cognitivas e estilo de tomada de decisão
4. Eneagrama - Revela motivação central, medo e desejo
5. Temperamentos - Revela a base biológica/emocional das reações
6. Inteligências Múltiplas - Revela forças cognitivas naturais
7. Estilos de Conexão Afetiva - Revela como a pessoa dá e recebe amor

INSTRUÇÃO CRÍTICA: ${youWord.charAt(0).toUpperCase() + youWord.slice(1)} DEVE referenciar e cruzar TODOS os 7 testes em CADA seção. Cada seção deve mostrar como os diferentes testes interagem, se complementam ou criam tensões entre si. Isso NÃO é um resumo de testes individuais - é uma SÍNTESE que revela padrões só visíveis quando cruzamos todas as dimensões.

Com base nesses dados, gere o CÓDIGO DA ESSÊNCIA completo, dividido nas seguintes seções:

1. overview - Uma síntese acolhedora de quem essa pessoa é em ${yourWord} essência. DEVE mencionar insights de TODOS os 7 testes e como formam um todo coerente.
2. matriz_essencial - A estrutura fundamental da personalidade. Mostre especificamente como as 7 dimensões interagem (ex: "Seu Arquétipo X combinado com Eneagrama tipo Y cria um padrão único de...").
3. padroes_comportamento - 3 padrões principais de comportamento identificados CRUZANDO os testes. Cada padrão deve referenciar pelo menos 3 testes diferentes.
4. talentos_dons - 3 talentos naturais que emergem do cruzamento. Cada talento deve ser sustentado por evidências de múltiplos testes.
5. dores_raizes - 3 dores emocionais centrais. Mostre como diferentes testes revelam a mesma raiz de ângulos diferentes.
6. proposito_natural - O propósito natural baseado na interseção de Arquétipo + Inteligências + Eneagrama + DISC.
7. caminho_maturidade - Um caminho de maturidade de 90 dias com ações que endereçam insights de TODOS os testes.
8. rotina_autoconsciencia - Práticas personalizadas para o perfil completo (todas as 7 dimensões).
9. carta_final - Uma carta pessoal que tece as revelações mais importantes de todos os testes.

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
- Seja específico e referencie os resultados reais dos testes PELO NOME (ex: "Seu perfil DISC de D combinado com...")
- Cada seção DEVE cruzar pelo menos 3 testes diferentes
- Use linguagem acolhedora, humana e profunda
- Torne o conteúdo aplicável e prático
- A carta final deve ser pessoal e tocante
- Não use frases genéricas - personalize tudo com base nos resultados específicos
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
