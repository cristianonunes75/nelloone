import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// System prompts V2 - mais visual, direto, confrontador com amor
const SYSTEM_PROMPT_PT = `Você é Nello, mentor do Nello One.

Sua missão: criar um relatório VISUAL e CONFRONTADOR que faça o usuário pensar:
"Isso me expõe. Isso me guia. Isso é sobre MIM."

ESTILO OBRIGATÓRIO:
- REDUZA textos em 40% - menos é mais
- Use frases CURTAS e IMPACTANTES (máximo 2 linhas)
- SEMPRE personalize com dados reais dos testes
- CONFRONTE com amor: mostre sombras SEM rodeios
- Seja ESPECÍFICO, não genérico
- Nada de jargões: "essência", "facetas", "síntese simbólica"

BLOCOS DE IMPACTO RÁPIDO (obrigatório na síntese):
- 🔥 Essência em uma frase
- ⚠️ Seu maior risco  
- 🧭 Seu chamado
- 💎 Seu maior dom hoje

CONFRONTO AMOROSO (obrigatório em cada seção):
- Cite um padrão limitante CONCRETO
- Uma verdade desconfortável mas libertadora
- Tom: firme, respeitoso, encorajador

REGRAS DE NOMENCLATURA:
- NUNCA use "Linguagens do Amor" - use "Estilos de Conexão Afetiva"
- NUNCA use "MBTI" ou "Myers-Briggs" - use "Nello 16 Personality"

Responda APENAS em JSON válido. Sem texto fora do JSON.`;

const SYSTEM_PROMPT_EN = `You are Nello, mentor of Nello One.

Your mission: create a VISUAL and CONFRONTATIONAL report that makes the user think:
"This exposes me. This guides me. This is about ME."

MANDATORY STYLE:
- REDUCE text by 40% - less is more
- Use SHORT, IMPACTFUL sentences (max 2 lines)
- ALWAYS personalize with actual test data
- CONFRONT with love: show shadows WITHOUT sugarcoating
- Be SPECIFIC, not generic
- No jargon: "essence", "facets", "symbolic synthesis"

QUICK IMPACT BLOCKS (mandatory in synthesis):
- 🔥 Essence in one phrase
- ⚠️ Your biggest risk
- 🧭 Your calling
- 💎 Your greatest gift today

LOVING CONFRONTATION (mandatory in each section):
- Cite a CONCRETE limiting pattern
- An uncomfortable but liberating truth
- Tone: firm, respectful, encouraging

NAMING RULES:
- NEVER use "Love Languages" - use "Affection Connection Styles"
- NEVER use "MBTI" or "Myers-Briggs" - use "Nello 16 Personality"

Respond ONLY in valid JSON. No text outside JSON.`;

const SYSTEM_PROMPT_PT_PT = `Tu és o Nello, mentor do Nello One.

A tua missão: criar um relatório VISUAL e CONFRONTADOR que faça o utilizador pensar:
"Isto expõe-me. Isto guia-me. Isto é sobre MIM."

ESTILO OBRIGATÓRIO:
- REDUZ textos em 40% - menos é mais
- Usa frases CURTAS e IMPACTANTES (máximo 2 linhas)
- SEMPRE personaliza com dados reais dos testes
- CONFRONTA com amor: mostra sombras SEM rodeios
- Sê ESPECÍFICO, não genérico
- Nada de jargões: "essência", "facetas", "síntese simbólica"

BLOCOS DE IMPACTO RÁPIDO (obrigatório na síntese):
- 🔥 Essência numa frase
- ⚠️ O teu maior risco
- 🧭 O teu chamado
- 💎 O teu maior dom hoje

CONFRONTO AMOROSO (obrigatório em cada secção):
- Cita um padrão limitante CONCRETO
- Uma verdade desconfortável mas libertadora
- Tom: firme, respeitoso, encorajador

REGRAS DE NOMENCLATURA:
- NUNCA uses "Linguagens do Amor" - usa "Estilos de Conexão Afetiva"
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

GENERATE THE ESSENCE CODE WITH THIS EXACT STRUCTURE:

═══════════════════════════════════════════
SECTION 1: ESSENTIAL PORTRAIT + DATA VISUALIZATION
═══════════════════════════════════════════

Section: "retrato_essencial"
Include these exact fields:

1. "impact_blocks" (MANDATORY - Quick impact blocks):
{
  "essence": "${firstName}, [one phrase that captures their core - specific based on results]",
  "risk": "[their biggest risk based on shadow patterns]",
  "calling": "[their natural calling based on archetypes + purpose]",
  "gift": "[their greatest gift today based on intelligences + strengths]"
}

2. "visual_data" (for charts - extract from results):
{
  "disc": { "D": [score], "I": [score], "S": [score], "C": [score], "dominant": "[letter]" },
  "temperament": { "primary": "[name]", "secondary": "[name]", "scores": {...} },
  "intelligences": { "top": ["top1", "top2", "top3"], "scores": {...} },
  "connection_style": { "primary": "[name]", "secondary": "[name]", "scores": {...} },
  "enneagram": { "type": "[number]", "wing": "[number]" },
  "nello16": { "code": "[4 letters]", "name": "[personality name]" },
  "archetypes": { "primary": "[name]", "secondary": "[name]" }
}

3. "bullets" - 5 direct statements starting with "${firstName}," mixing strength + shadow:
Example: "${firstName}, you lead through action, but steamroll emotions under pressure."

═══════════════════════════════════════════
SECTION 2: HOW YOU FUNCTION
═══════════════════════════════════════════

Section: "como_voce_funciona"
Based on: DISC + Temperament

{
  "source": "DISC + Temperament",
  "mirror": "[2 sentences max - what this reveals]",
  "strength": "[practical example when at best]",
  "shadow": "[concrete behavior when on autopilot]",
  "invitation": "[one clear action]"
}

═══════════════════════════════════════════
SECTION 3: YOUR NATURAL STRENGTHS
═══════════════════════════════════════════

Section: "suas_forcas"
Based on: Multiple Intelligences + Nello 16

{
  "source": "Multiple Intelligences + Nello 16",
  "items": [
    { "talent": "[specific talent]", "example": "[how it shows up]", "warning": "[how it can trap you]" },
    { "talent": "...", "example": "...", "warning": "..." },
    { "talent": "...", "example": "...", "warning": "..." }
  ]
}

═══════════════════════════════════════════
SECTION 4: YOUR SHADOWS AND BLOCKS
═══════════════════════════════════════════

Section: "suas_sombras"
Based on: Enneagram + Temperament

{
  "source": "Enneagram + Temperament",
  "items": [
    { "pattern": "[limiting pattern]", "situation": "[when it appears]", "exit": "[way out]" },
    { "pattern": "...", "situation": "...", "exit": "..." },
    { "pattern": "...", "situation": "...", "exit": "..." }
  ]
}

═══════════════════════════════════════════
SECTION 5: YOUR NATURAL PURPOSE
═══════════════════════════════════════════

Section: "seu_proposito"
Based on: Archetypes + All tests

{
  "source": "Archetypes + Integration",
  "motivation": "[what drives you - core motivation]",
  "daily_example": "[how this shows up in daily life]",
  "common_error": "[where you err living this purpose]",
  "invitation": "[the clear invitation]"
}

═══════════════════════════════════════════
SECTION 6: 90-DAY PATH
═══════════════════════════════════════════

Section: "plano_90_dias"

{
  "months": [
    { "month": 1, "focus": "[connected to one shadow]", "practice": "[specific, measurable]", "check": "[question to evaluate]" },
    { "month": 2, "focus": "...", "practice": "...", "check": "..." },
    { "month": 3, "focus": "...", "practice": "...", "check": "..." }
  ]
}

Make it SPECIFIC to ${firstName}'s profile!

═══════════════════════════════════════════
SECTION 7: DAILY ROUTINE
═══════════════════════════════════════════

Section: "rotina_diaria"

{
  "source": "Temperament + Connection Style",
  "morning": "[specific practice]",
  "afternoon": "[adjustment reminder]",
  "night": "[reflection question]"
}

Personalized to profile. NOT generic.

═══════════════════════════════════════════
SECTION 8: HONEST CONVERSATION
═══════════════════════════════════════════

Section: "conversa_final"

{
  "paragraphs": [
    "Before anything, ${firstName}, this needs to be clear: [validation of what you saw]",
    "[Reference specific results: Your DISC shows... Your Enneagram reveals...]",
    "[This is a mirror, not a label. The invitation is consciousness.]"
  ]
}

Max 3 short paragraphs. Human, direct, encouraging.

═══════════════════════════════════════════
FINAL JSON STRUCTURE
═══════════════════════════════════════════

{
  "language": "en",
  "userName": "${firstName}",
  "generatedAt": "[ISO timestamp]",
  "sections": [
    {
      "id": "retrato_essencial",
      "title": "Your Essential Portrait",
      "impact_blocks": { "essence": "...", "risk": "...", "calling": "...", "gift": "..." },
      "visual_data": { "disc": {...}, "temperament": {...}, ... },
      "bullets": ["${firstName}, ...", ...]
    },
    {
      "id": "como_voce_funciona",
      "title": "How You Function",
      "source": "DISC + Temperament",
      "mirror": "...", "strength": "...", "shadow": "...", "invitation": "..."
    },
    {
      "id": "suas_forcas",
      "title": "Your Natural Strengths",
      "source": "Multiple Intelligences + Nello 16",
      "items": [...]
    },
    {
      "id": "suas_sombras",
      "title": "Your Shadows and Blocks",
      "source": "Enneagram + Temperament",
      "items": [...]
    },
    {
      "id": "seu_proposito",
      "title": "Your Natural Purpose",
      "source": "Archetypes + Integration",
      "motivation": "...", "daily_example": "...", "common_error": "...", "invitation": "..."
    },
    {
      "id": "plano_90_dias",
      "title": "90-Day Path",
      "months": [...]
    },
    {
      "id": "rotina_diaria",
      "title": "Your Daily Routine",
      "source": "Temperament + Connection Style",
      "morning": "...", "afternoon": "...", "night": "..."
    },
    {
      "id": "conversa_final",
      "title": "An Honest Conversation",
      "paragraphs": [...]
    }
  ]
}

CRITICAL RULES:
- impact_blocks MUST be filled with specific, personalized content
- visual_data MUST extract actual values from test results
- Short, impactful sentences only
- NO generic statements`;
  }

  // Portuguese (BR and PT)
  return `USUÁRIO: ${firstName}
RESULTADOS DOS TESTES:
${resultsJson}

GERE O CÓDIGO DA ESSÊNCIA COM ESTA ESTRUTURA EXATA:

═══════════════════════════════════════════
SEÇÃO 1: RETRATO ESSENCIAL + DADOS VISUAIS
═══════════════════════════════════════════

Seção: "retrato_essencial"
Inclua estes campos exatos:

1. "impact_blocks" (OBRIGATÓRIO - Blocos de impacto):
{
  "essence": "${firstName}, [uma frase que captura a essência - específica baseada nos resultados]",
  "risk": "[o maior risco baseado nos padrões de sombra]",
  "calling": "[o chamado natural baseado em arquétipos + propósito]",
  "gift": "[o maior dom hoje baseado em inteligências + forças]"
}

2. "visual_data" (para gráficos - extraia dos resultados):
{
  "disc": { "D": [score], "I": [score], "S": [score], "C": [score], "dominant": "[letra]" },
  "temperament": { "primary": "[nome]", "secondary": "[nome]", "scores": {...} },
  "intelligences": { "top": ["top1", "top2", "top3"], "scores": {...} },
  "connection_style": { "primary": "[nome]", "secondary": "[nome]", "scores": {...} },
  "enneagram": { "type": "[número]", "wing": "[número]" },
  "nello16": { "code": "[4 letras]", "name": "[nome personalidade]" },
  "archetypes": { "primary": "[nome]", "secondary": "[nome]" }
}

3. "bullets" - 5 afirmações diretas começando com "${firstName}," misturando força + sombra:
Exemplo: "${firstName}, ${youWord.toLowerCase()} lidera pela ação, mas atropela emoções sob pressão."

═══════════════════════════════════════════
SEÇÃO 2: COMO ${youWord.toUpperCase()} FUNCIONA
═══════════════════════════════════════════

Seção: "como_voce_funciona"
Baseado em: DISC + Temperamento

{
  "source": "DISC + Temperamento",
  "mirror": "[máximo 2 frases - o que isso revela]",
  "strength": "[exemplo prático quando no melhor]",
  "shadow": "[comportamento concreto no automático]",
  "invitation": "[uma ação clara]"
}

═══════════════════════════════════════════
SEÇÃO 3: ${youWord === 'Tu' ? 'AS TUAS' : 'SUAS'} FORÇAS NATURAIS
═══════════════════════════════════════════

Seção: "suas_forcas"
Baseado em: Inteligências Múltiplas + Nello 16

{
  "source": "Inteligências Múltiplas + Nello 16",
  "items": [
    { "talent": "[talento específico]", "example": "[como aparece]", "warning": "[como pode virar armadilha]" },
    { "talent": "...", "example": "...", "warning": "..." },
    { "talent": "...", "example": "...", "warning": "..." }
  ]
}

═══════════════════════════════════════════
SEÇÃO 4: ${youWord === 'Tu' ? 'AS TUAS' : 'SUAS'} SOMBRAS E BLOQUEIOS
═══════════════════════════════════════════

Seção: "suas_sombras"
Baseado em: Eneagrama + Temperamento

{
  "source": "Eneagrama + Temperamento",
  "items": [
    { "pattern": "[padrão limitante]", "situation": "[quando aparece]", "exit": "[caminho de saída]" },
    { "pattern": "...", "situation": "...", "exit": "..." },
    { "pattern": "...", "situation": "...", "exit": "..." }
  ]
}

═══════════════════════════════════════════
SEÇÃO 5: ${youWord === 'Tu' ? 'O TEU' : 'SEU'} PROPÓSITO NATURAL
═══════════════════════════════════════════

Seção: "seu_proposito"
Baseado em: Arquétipos + Todos os testes

{
  "source": "Arquétipos + Integração",
  "motivation": "[o que te move - motivação central]",
  "daily_example": "[como aparece no dia a dia]",
  "common_error": "[onde ${youWord.toLowerCase()} erra vivendo esse propósito]",
  "invitation": "[o convite claro]"
}

═══════════════════════════════════════════
SEÇÃO 6: CAMINHO DE 90 DIAS
═══════════════════════════════════════════

Seção: "plano_90_dias"

{
  "months": [
    { "month": 1, "focus": "[conectado a uma sombra]", "practice": "[específica, mensurável]", "check": "[pergunta para avaliar]" },
    { "month": 2, "focus": "...", "practice": "...", "check": "..." },
    { "month": 3, "focus": "...", "practice": "...", "check": "..." }
  ]
}

Faça ESPECÍFICO para o perfil de ${firstName}!

═══════════════════════════════════════════
SEÇÃO 7: ROTINA DIÁRIA
═══════════════════════════════════════════

Seção: "rotina_diaria"

{
  "source": "Temperamento + Estilo de Conexão",
  "morning": "[prática específica]",
  "afternoon": "[lembrete de ajuste]",
  "night": "[pergunta de reflexão]"
}

Personalizado ao perfil. NÃO genérico.

═══════════════════════════════════════════
SEÇÃO 8: CONVERSA HONESTA
═══════════════════════════════════════════

Seção: "conversa_final"

{
  "paragraphs": [
    "Antes de tudo, ${firstName}, precisa ficar claro: [validação do que foi visto]",
    "[Referencie resultados específicos: ${youWord === 'Tu' ? 'O teu' : 'Seu'} DISC mostra... ${youWord === 'Tu' ? 'O teu' : 'Seu'} Eneagrama revela...]",
    "[Isso é um espelho, não um rótulo. O convite é consciência.]"
  ]
}

Máximo 3 parágrafos curtos. Humano, direto, encorajador.

═══════════════════════════════════════════
ESTRUTURA JSON FINAL
═══════════════════════════════════════════

{
  "language": "${locale}",
  "userName": "${firstName}",
  "generatedAt": "[ISO timestamp]",
  "sections": [
    {
      "id": "retrato_essencial",
      "title": "${youWord === 'Tu' ? 'O Teu Retrato' : 'Seu Retrato'} Essencial",
      "impact_blocks": { "essence": "...", "risk": "...", "calling": "...", "gift": "..." },
      "visual_data": { "disc": {...}, "temperament": {...}, ... },
      "bullets": ["${firstName}, ...", ...]
    },
    {
      "id": "como_voce_funciona",
      "title": "Como ${youWord} Funciona",
      "source": "DISC + Temperamento",
      "mirror": "...", "strength": "...", "shadow": "...", "invitation": "..."
    },
    {
      "id": "suas_forcas",
      "title": "${youWord === 'Tu' ? 'As Tuas' : 'Suas'} Forças Naturais",
      "source": "Inteligências Múltiplas + Nello 16",
      "items": [...]
    },
    {
      "id": "suas_sombras",
      "title": "${youWord === 'Tu' ? 'As Tuas' : 'Suas'} Sombras e Bloqueios",
      "source": "Eneagrama + Temperamento",
      "items": [...]
    },
    {
      "id": "seu_proposito",
      "title": "${youWord === 'Tu' ? 'O Teu' : 'Seu'} Propósito Natural",
      "source": "Arquétipos + Integração",
      "motivation": "...", "daily_example": "...", "common_error": "...", "invitation": "..."
    },
    {
      "id": "plano_90_dias",
      "title": "Caminho de 90 Dias",
      "months": [...]
    },
    {
      "id": "rotina_diaria",
      "title": "${youWord === 'Tu' ? 'A Tua' : 'Sua'} Rotina Diária",
      "source": "Temperamento + Estilo de Conexão",
      "morning": "...", "afternoon": "...", "night": "..."
    },
    {
      "id": "conversa_final",
      "title": "Uma Conversa Honesta",
      "paragraphs": [...]
    }
  ]
}

REGRAS CRÍTICAS:
- impact_blocks DEVE ser preenchido com conteúdo específico e personalizado
- visual_data DEVE extrair valores reais dos resultados dos testes
- Frases curtas e impactantes apenas
- NENHUMA afirmação genérica
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
