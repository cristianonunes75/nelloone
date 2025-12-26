import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// System prompts refinados - mais direto, menos abstrato, mais confrontador
const SYSTEM_PROMPT_PT = `Você é Miguel, mentor do Nello One.

Sua missão: transformar resultados de testes em um relatório que faça o usuário pensar:
"Isso me expõe. Isso me guia. Isso é sobre MIM."

ESTILO OBRIGATÓRIO:
- Direto e objetivo (reduza textos em 40%)
- Personalizado com base nos resultados reais
- Confrontador com amor: mostre sombras sem rodeios
- Prático: sempre dê exemplos do dia a dia
- Sem jargões: nada de "essência", "facetas", "síntese simbólica"
- Frases curtas e impactantes

CADA BLOCO DEVE RESPONDER:
1. O que isso diz sobre mim? (específico, não genérico)
2. Onde isso me fortalece? (exemplo prático)
3. Onde isso me limita? (sombra concreta)
4. O que faço com isso agora? (ação clara)

CONFRONTO AMOROSO (obrigatório em cada seção):
- Cite um padrão limitante provável
- Uma verdade desconfortável mas libertadora
- Um alerta sobre ficar no automático
Tom: firme, respeitoso, encorajador

REGRAS DE NOMENCLATURA:
- NUNCA use "Linguagens do Amor" ou "Love Languages" - use "Estilos de Conexão Afetiva"
- NUNCA use "MBTI" ou "Myers-Briggs" - use "Nello 16 Personality"

Responda APENAS em JSON válido. Sem texto fora do JSON.`;

const SYSTEM_PROMPT_EN = `You are Miguel, mentor of Nello One.

Your mission: transform test results into a report that makes the user think:
"This exposes me. This guides me. This is about ME."

MANDATORY STYLE:
- Direct and objective (reduce text by 40%)
- Personalized based on actual results
- Loving confrontation: show shadows without sugarcoating
- Practical: always give real-life examples
- No jargon: nothing like "essence", "facets", "symbolic synthesis"
- Short, impactful sentences

EACH BLOCK MUST ANSWER:
1. What does this say about me? (specific, not generic)
2. Where does this strengthen me? (practical example)
3. Where does this limit me? (concrete shadow)
4. What do I do with this now? (clear action)

LOVING CONFRONTATION (mandatory in each section):
- Cite a probable limiting pattern
- An uncomfortable but liberating truth
- A warning about staying on autopilot
Tone: firm, respectful, encouraging

NAMING RULES:
- NEVER use "Love Languages" - use "Affection Connection Styles"
- NEVER use "MBTI" or "Myers-Briggs" - use "Nello 16 Personality"

Respond ONLY in valid JSON. No text outside JSON.`;

const SYSTEM_PROMPT_PT_PT = `Tu és o Miguel, mentor do Nello One.

A tua missão: transformar resultados de testes num relatório que faça o utilizador pensar:
"Isto expõe-me. Isto guia-me. Isto é sobre MIM."

ESTILO OBRIGATÓRIO:
- Direto e objetivo (reduz textos em 40%)
- Personalizado com base nos resultados reais
- Confrontador com amor: mostra sombras sem rodeios
- Prático: dá sempre exemplos do dia a dia
- Sem jargões: nada de "essência", "facetas", "síntese simbólica"
- Frases curtas e impactantes

CADA BLOCO DEVE RESPONDER:
1. O que isto diz sobre mim? (específico, não genérico)
2. Onde isto me fortalece? (exemplo prático)
3. Onde isto me limita? (sombra concreta)
4. O que faço com isto agora? (ação clara)

CONFRONTO AMOROSO (obrigatório em cada secção):
- Cita um padrão limitante provável
- Uma verdade desconfortável mas libertadora
- Um alerta sobre ficar no automático
Tom: firme, respeitoso, encorajador

REGRAS DE NOMENCLATURA:
- NUNCA uses "Linguagens do Amor" ou "Love Languages" - usa "Estilos de Conexão Afetiva"
- NUNCA uses "MBTI" ou "Myers-Briggs" - usa "Nello 16 Personality"

Responde APENAS em JSON válido. Sem texto fora do JSON.`;

// User prompt refinado - mais estruturado e exigente
const getUserPrompt = (locale: string, results: any, userName: string) => {
  const isEuropean = locale === 'pt-pt';
  const isEnglish = locale === 'en';
  
  const youWord = isEuropean ? 'Tu' : isEnglish ? 'You' : 'Você';
  const yourWord = isEuropean ? 'teu' : isEnglish ? 'your' : 'seu';
  
  const firstName = userName.split(' ')[0];

  const resultsJson = JSON.stringify(results, null, 2);

  if (isEnglish) {
    return `USER: ${firstName}
TEST RESULTS:
${resultsJson}

GENERATE THE ESSENCE CODE IN 3 LAYERS:

═══════════════════════════════════════════
LAYER 1 — WHO YOU ARE (Quick Portrait)
═══════════════════════════════════════════

Section: "quem_voce_e" (Who You Are)
- 5 bullets maximum, each starting with: "${firstName},"
- Direct, specific, based on real results
- Mix: strength + shadow in the same sentence
- Example: "${firstName}, you lead through action and results, but you tend to steamroll emotions when under pressure."

Format for each bullet - MANDATORY to reference test:
"${firstName}, [observation based on DISC/Temperament/Enneagram/etc]"

═══════════════════════════════════════════
LAYER 2 — DEEP ANALYSIS
═══════════════════════════════════════════

Each section MUST follow this structure:
🪞 What this reveals (2 sentences max)
🌟 Your strength when at your best (practical example)
⚠️ Your shadow when on autopilot (concrete behavior)
🎯 Your practical invitation (one clear action)

SECTIONS:

1. "como_voce_funciona" (How You Function)
Based on: DISC + Temperament
- How you make decisions
- How you react under pressure
- Where you excel vs where you sabotage yourself

2. "suas_forcas" (Your Natural Strengths)
Based on: Multiple Intelligences + Nello 16
- 3 specific talents (not generic)
- Practical example of each
- Warning: how each can become a trap

3. "suas_sombras" (Your Shadows and Blocks)
Based on: Enneagram + Temperament
- 3 clear limiting patterns
- Concrete situations where they appear
- Path out of each

4. "seu_proposito" (Your Natural Purpose)
Based on: Archetypes + All tests combined
Structure:
- What moves you (core motivation)
- How this appears daily (practical examples)
- Where you tend to err living this purpose
- The clear invitation

═══════════════════════════════════════════
LAYER 3 — PRACTICAL APPLICATION
═══════════════════════════════════════════

5. "plano_90_dias" (90-Day Path)
3 months. Each month:
- FOCUS: directly connected to one shadow
- PRACTICE: specific and measurable (not "reflect more")
- CHECK: concrete question to evaluate progress

Make it SPECIFIC to ${firstName}'s profile, not generic.

6. "rotina_diaria" (Daily Routine)
Based on temperament and connection style:
- Morning: one specific practice
- Afternoon: one adjustment reminder
- Night: one reflection (direct question)

Personalized to profile. Nothing generic.

═══════════════════════════════════════════
CLOSING — HONEST CONVERSATION
═══════════════════════════════════════════

7. "conversa_final" (Final Conversation)
Maximum 3 short paragraphs:
- Start: "Before anything, ${firstName}, this needs to be clear:"
- Middle: Validate what you saw, be specific. "Your DISC shows... Your Enneagram reveals... Your temperament indicates..."
- End: This is a mirror, not a label. The invitation is consciousness, not comfort.

Tone: human, direct, encouraging without being generic.

═══════════════════════════════════════════
JSON STRUCTURE
═══════════════════════════════════════════

{
  "language": "en",
  "userName": "${firstName}",
  "generatedAt": "[timestamp]",
  "sections": [
    {
      "id": "quem_voce_e",
      "title": "Who You Are",
      "bullets": ["${firstName}, ...", "${firstName}, ...", ...]
    },
    {
      "id": "como_voce_funciona",
      "title": "How You Function",
      "source": "DISC + Temperament",
      "mirror": "What this reveals...",
      "strength": "Your strength when at your best...",
      "shadow": "Your shadow when on autopilot...",
      "invitation": "Your practical invitation..."
    },
    {
      "id": "suas_forcas",
      "title": "Your Natural Strengths",
      "source": "Multiple Intelligences + Nello 16",
      "items": [
        { "talent": "...", "example": "...", "warning": "..." },
        { "talent": "...", "example": "...", "warning": "..." },
        { "talent": "...", "example": "...", "warning": "..." }
      ]
    },
    {
      "id": "suas_sombras",
      "title": "Your Shadows and Blocks",
      "source": "Enneagram + Temperament",
      "items": [
        { "pattern": "...", "situation": "...", "exit": "..." },
        { "pattern": "...", "situation": "...", "exit": "..." },
        { "pattern": "...", "situation": "...", "exit": "..." }
      ]
    },
    {
      "id": "seu_proposito",
      "title": "Your Natural Purpose",
      "source": "Archetypes + Integration",
      "motivation": "...",
      "daily_example": "...",
      "common_error": "...",
      "invitation": "..."
    },
    {
      "id": "plano_90_dias",
      "title": "90-Day Path",
      "months": [
        { "month": 1, "focus": "...", "practice": "...", "check": "..." },
        { "month": 2, "focus": "...", "practice": "...", "check": "..." },
        { "month": 3, "focus": "...", "practice": "...", "check": "..." }
      ]
    },
    {
      "id": "rotina_diaria",
      "title": "Your Daily Routine",
      "source": "Temperament + Connection Style",
      "morning": "...",
      "afternoon": "...",
      "night": "..."
    },
    {
      "id": "conversa_final",
      "title": "An Honest Conversation",
      "paragraphs": ["Before anything, ${firstName}...", "...", "..."]
    }
  ]
}

CRITICAL RULES:
- Every section MUST reference which test it comes from
- No generic statements that would fit anyone
- Bullets with name: "${firstName}, you..."
- Confrontational but loving tone
- Short, impactful sentences
- NO hyphens in the text`;
  }

  // Portuguese (BR and PT)
  return `USUÁRIO: ${firstName}
RESULTADOS DOS TESTES:
${resultsJson}

GERE O CÓDIGO DA ESSÊNCIA EM 3 CAMADAS:

═══════════════════════════════════════════
CAMADA 1 — QUEM ${youWord.toUpperCase()} É (Retrato Rápido)
═══════════════════════════════════════════

Seção: "quem_voce_e" (Quem ${youWord} É)
- Máximo 5 bullets, cada um começando com: "${firstName},"
- Direto, específico, baseado nos resultados reais
- Misture: força + sombra na mesma frase
- Exemplo: "${firstName}, ${youWord.toLowerCase()} lidera pela ação e resultados, mas tende a atropelar emoções quando está sob pressão."

Formato para cada bullet - OBRIGATÓRIO referenciar teste:
"${firstName}, [observação baseada no DISC/Temperamento/Eneagrama/etc]"

═══════════════════════════════════════════
CAMADA 2 — ANÁLISE PROFUNDA
═══════════════════════════════════════════

Cada seção DEVE seguir esta estrutura:
🪞 O que isso revela (máximo 2 frases)
🌟 ${youWord === 'Tu' ? 'Tua' : 'Sua'} força quando vive no melhor (exemplo prático)
⚠️ ${youWord === 'Tu' ? 'Tua' : 'Sua'} sombra quando age no automático (comportamento concreto)
🎯 ${youWord === 'Tu' ? 'Teu' : 'Seu'} convite prático (uma ação clara)

SEÇÕES:

1. "como_voce_funciona" (Como ${youWord} Funciona)
Baseado em: DISC + Temperamento
- Como ${youWord.toLowerCase()} toma decisões
- Como ${youWord.toLowerCase()} reage sob pressão
- Onde ${youWord.toLowerCase()} brilha vs onde ${youWord.toLowerCase()} se sabota

2. "suas_forcas" (${youWord === 'Tu' ? 'As Tuas' : 'Suas'} Forças Naturais)
Baseado em: Inteligências Múltiplas + Nello 16
- 3 talentos específicos (não genéricos)
- Exemplo prático de cada
- Alerta: como cada um pode virar armadilha

3. "suas_sombras" (${youWord === 'Tu' ? 'As Tuas' : 'Suas'} Sombras e Bloqueios)
Baseado em: Eneagrama + Temperamento
- 3 padrões limitantes claros
- Situações concretas onde aparecem
- Caminho de saída de cada um

4. "seu_proposito" (${youWord === 'Tu' ? 'O Teu' : 'Seu'} Propósito Natural)
Baseado em: Arquétipos + Integração de todos os testes
Estrutura:
- O que ${youWord.toLowerCase() === 'tu' ? 'te' : 'o'} move (motivação central)
- Como isso aparece no dia a dia (exemplos práticos)
- Onde ${youWord.toLowerCase()} tende a errar vivendo esse propósito
- O convite claro

═══════════════════════════════════════════
CAMADA 3 — APLICAÇÃO PRÁTICA
═══════════════════════════════════════════

5. "plano_90_dias" (Caminho de 90 Dias)
3 meses. Cada mês:
- FOCO: conectado diretamente a uma sombra
- PRÁTICA: específica e mensurável (não "refletir mais")
- CHECK: pergunta concreta para avaliar progresso

Faça ESPECÍFICO para o perfil de ${firstName}, não genérico.

6. "rotina_diaria" (Rotina Diária)
Baseado em temperamento e estilo de conexão:
- Manhã: uma prática específica
- Tarde: um lembrete de ajuste
- Noite: uma reflexão (pergunta direta)

Personalizado ao perfil. Nada genérico.

═══════════════════════════════════════════
FECHAMENTO — CONVERSA HONESTA
═══════════════════════════════════════════

7. "conversa_final" (Conversa Final)
Máximo 3 parágrafos curtos:
- Início: "Antes de tudo, ${firstName}, precisa ficar claro:"
- Meio: Valide o que viu, seja específico. "${youWord === 'Tu' ? 'O teu' : 'Seu'} DISC mostra... ${youWord === 'Tu' ? 'O teu' : 'Seu'} Eneagrama revela... ${youWord === 'Tu' ? 'O teu' : 'Seu'} temperamento indica..."
- Fim: Isso é um espelho, não um rótulo. O convite é consciência, não conforto.

Tom: humano, direto, encorajador sem ser genérico.

═══════════════════════════════════════════
ESTRUTURA JSON
═══════════════════════════════════════════

{
  "language": "${locale}",
  "userName": "${firstName}",
  "generatedAt": "[timestamp]",
  "sections": [
    {
      "id": "quem_voce_e",
      "title": "Quem ${youWord} É",
      "bullets": ["${firstName}, ...", "${firstName}, ...", ...]
    },
    {
      "id": "como_voce_funciona",
      "title": "Como ${youWord} Funciona",
      "source": "DISC + Temperamento",
      "mirror": "O que isso revela...",
      "strength": "${youWord === 'Tu' ? 'Tua' : 'Sua'} força quando vive no melhor...",
      "shadow": "${youWord === 'Tu' ? 'Tua' : 'Sua'} sombra quando age no automático...",
      "invitation": "${youWord === 'Tu' ? 'Teu' : 'Seu'} convite prático..."
    },
    {
      "id": "suas_forcas",
      "title": "${youWord === 'Tu' ? 'As Tuas' : 'Suas'} Forças Naturais",
      "source": "Inteligências Múltiplas + Nello 16",
      "items": [
        { "talent": "...", "example": "...", "warning": "..." },
        { "talent": "...", "example": "...", "warning": "..." },
        { "talent": "...", "example": "...", "warning": "..." }
      ]
    },
    {
      "id": "suas_sombras",
      "title": "${youWord === 'Tu' ? 'As Tuas' : 'Suas'} Sombras e Bloqueios",
      "source": "Eneagrama + Temperamento",
      "items": [
        { "pattern": "...", "situation": "...", "exit": "..." },
        { "pattern": "...", "situation": "...", "exit": "..." },
        { "pattern": "...", "situation": "...", "exit": "..." }
      ]
    },
    {
      "id": "seu_proposito",
      "title": "${youWord === 'Tu' ? 'O Teu' : 'Seu'} Propósito Natural",
      "source": "Arquétipos + Integração",
      "motivation": "...",
      "daily_example": "...",
      "common_error": "...",
      "invitation": "..."
    },
    {
      "id": "plano_90_dias",
      "title": "Caminho de 90 Dias",
      "months": [
        { "month": 1, "focus": "...", "practice": "...", "check": "..." },
        { "month": 2, "focus": "...", "practice": "...", "check": "..." },
        { "month": 3, "focus": "...", "practice": "...", "check": "..." }
      ]
    },
    {
      "id": "rotina_diaria",
      "title": "${youWord === 'Tu' ? 'A Tua' : 'Sua'} Rotina Diária",
      "source": "Temperamento + Estilo de Conexão",
      "morning": "...",
      "afternoon": "...",
      "night": "..."
    },
    {
      "id": "conversa_final",
      "title": "Uma Conversa Honesta",
      "paragraphs": ["Antes de tudo, ${firstName}...", "...", "..."]
    }
  ]
}

REGRAS CRÍTICAS:
- Cada seção DEVE referenciar de qual teste vem
- Nenhuma frase genérica que serviria para qualquer pessoa
- Bullets com nome: "${firstName}, ${youWord.toLowerCase()}..."
- Tom confrontador mas amoroso
- Frases curtas e impactantes
- NÃO use hífens no texto
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
        model: "google/gemini-2.5-pro",
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
