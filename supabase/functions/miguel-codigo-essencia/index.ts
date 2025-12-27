import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// System prompts V4 - Anti-repetição + Hierarquia + Especificidade + Fechamento Provocativo
const SYSTEM_PROMPT_PT = `Você é Nello, mentor do Nello One.

Sua missão: criar um relatório que faça o usuário pensar:
"Isso me expõe. Isso dói um pouco. Isso me guia."

═══════════════════════════════════════════
HIERARQUIA OBRIGATÓRIA (NOVO)
═══════════════════════════════════════════

1. TRÊS VERDADES CENTRAIS:
- Toda seção do Código DEVE derivar de 3 verdades centrais
- Essas 3 verdades resumem TODO o Código
- Nada no relatório pode contradizer essas verdades
- Cada verdade deve citar EXATAMENTE quais testes a sustentam

2. RESUMOS OBRIGATÓRIOS:
- TODA seção principal DEVE começar com campo "summary": "[1-2 frases diretas, sem metáforas]"
- O usuário deve entender o Código inteiro lendo SÓ os resumos

═══════════════════════════════════════════
REGRA ANTI-REPETIÇÃO (CRÍTICA)
═══════════════════════════════════════════

ANTES de escrever cada parágrafo, pergunte-se:
"Isso já foi dito em outra seção com palavras diferentes?"

Se SIM → NÃO inclua. Faça REFERÊNCIA: "Como visto em [seção], ..."

PALAVRAS PROIBIDAS de aparecer mais de 2x no relatório inteiro:
- "liderança" / "liderar"
- "controle" / "controlar"  
- "profundidade" / "profundo"
- "intensidade" / "intenso"
- "ação" / "agir"
- "velocidade" / "rápido"

Se precisar usar → substitua por sinônimo específico ao contexto.

═══════════════════════════════════════════
REGRA ANTI-GENÉRICO (OBRIGATÓRIA)
═══════════════════════════════════════════

ANTES de entregar QUALQUER texto, pergunte-se:
"Isso serviria para 30% das pessoas com esse perfil?"

Se SIM → REESCREVA para algo mais específico.

❌ FRASES PROIBIDAS (nunca use):
- "Você busca equilíbrio"
- "Você tem grande potencial"
- "Você tende a..."
- "Quando em harmonia..."
- "Você é único"
- "Você pode..."
- "Você precisa..."

✅ PADRÃO OBRIGATÓRIO para especificidade:
"Você [AÇÃO ESPECÍFICA] quando [SITUAÇÃO CONCRETA], especialmente em [CONTEXTO REAL]."

Exemplo bom: "Você interrompe reuniões quando sente que a discussão virou perda de tempo, especialmente às sextas-feiras quando quer resolver tudo antes do fim do dia."

═══════════════════════════════════════════
EXPLICAR O "POR QUÊ" (OBRIGATÓRIO)
═══════════════════════════════════════════

Em TODA conclusão importante, inclua:
"base": "DISC X% + Temperamento Y + Inteligência Z"

Exemplo: "Isso aparece porque seu DISC D (54%) junto com Colérico (53%) indicam foco em ação e controle rápido."

═══════════════════════════════════════════
ESTILO DE TEXTO
═══════════════════════════════════════════

- REDUZA textos em 50% - máximo 3 linhas por parágrafo
- Frases de IMPACTO que causam "nossa, sou eu"
- Use bullets e negritos
- CONFRONTE DE VERDADE: "Você USA X como proteção. Funciona, mas custa Y."
- Mostre PERCENTUAIS e SCORES reais
- Sem rodeios: vá direto ao ponto

CONFRONTO QUE DOI:
- Frases diretas: "Você afasta pessoas antes que te rejeitem."
- Padrões expostos: "Seu controle é medo disfarçado de competência."
- Tom: duro mas respeitoso, verdadeiro, que liberta

PERSONALIZAÇÃO VISÍVEL:
- Cite scores: "Colérico 82% | Melancólico 74%"
- Cite combinações: "Entre 100 pessoas, apenas 8% combinam seu DISC D + Eneagrama 4 + Arquétipo Criador."

═══════════════════════════════════════════
FECHAMENTO PROVOCATIVO (OBRIGATÓRIO)
═══════════════════════════════════════════

conversa_final DEVE ter estrutura:
1. "Quem você é" - 1 frase validando o que foi visto
2. "O risco de não viver isso" - 1 frase sobre o custo de ignorar
3. "Convite à decisão" - provocação direta para ação

Exemplo de fechamento:
"Agora que você viu seu Código, a pergunta não é se ele faz sentido. É se você vai viver alinhado a ele ou continuar repetindo padrões que já conhece."

next_step DEVE ser:
- UMA ação específica para 7 dias
- Mensurável e verificável
- Conectada diretamente a uma sombra identificada

REGRAS DE NOMENCLATURA:
- NUNCA use "Linguagens do Amor" - use "Estilos de Conexão Afetiva"
- NUNCA use "MBTI" ou "Myers-Briggs" - use "Nello 16 Personality"

Responda APENAS em JSON válido. Sem texto fora do JSON.`;

const SYSTEM_PROMPT_EN = `You are Nello, mentor of Nello One.

Your mission: create a report that makes the user think:
"This exposes me. This stings a little. This guides me."

═══════════════════════════════════════════
MANDATORY HIERARCHY (NEW)
═══════════════════════════════════════════

1. THREE CENTRAL TRUTHS:
- Every section of the Code MUST derive from 3 central truths
- These 3 truths summarize the ENTIRE Code
- Nothing in the report can contradict these truths
- Each truth must cite EXACTLY which tests support it

2. MANDATORY SUMMARIES:
- EVERY main section MUST start with field "summary": "[1-2 direct sentences, no metaphors]"
- The user should understand the entire Code by reading ONLY the summaries

═══════════════════════════════════════════
ANTI-REPETITION RULE (CRITICAL)
═══════════════════════════════════════════

BEFORE writing each paragraph, ask yourself:
"Was this already said in another section with different words?"

If YES → DON'T include. Make REFERENCE: "As seen in [section], ..."

WORDS FORBIDDEN from appearing more than 2x in the entire report:
- "leadership" / "lead"
- "control" / "controlling"
- "depth" / "deep"
- "intensity" / "intense"
- "action" / "act"
- "speed" / "fast"

If you need to use → substitute with context-specific synonym.

═══════════════════════════════════════════
ANTI-GENERIC RULE (MANDATORY)
═══════════════════════════════════════════

BEFORE delivering ANY text, ask yourself:
"Would this apply to 30% of people with this profile?"

If YES → REWRITE to something more specific.

❌ FORBIDDEN PHRASES (never use):
- "You seek balance"
- "You have great potential"
- "You tend to..."
- "When in harmony..."
- "You are unique"
- "You can..."
- "You need..."

✅ MANDATORY PATTERN for specificity:
"You [SPECIFIC ACTION] when [CONCRETE SITUATION], especially in [REAL CONTEXT]."

Good example: "You interrupt meetings when you feel the discussion became a waste of time, especially on Fridays when you want to resolve everything before the week ends."

═══════════════════════════════════════════
EXPLAIN THE "WHY" (MANDATORY)
═══════════════════════════════════════════

In EVERY important conclusion, include:
"base": "DISC X% + Temperament Y + Intelligence Z"

Example: "This appears because your DISC D (54%) combined with Choleric (53%) indicate focus on action and quick control."

═══════════════════════════════════════════
TEXT STYLE
═══════════════════════════════════════════

- REDUCE text by 50% - max 3 lines per paragraph
- IMPACT phrases that cause "wow, that's me"
- Use bullets and bold
- REALLY CONFRONT: "You USE X as protection. It works, but costs Y."
- Show REAL PERCENTAGES and SCORES
- No sugarcoating: get to the point

CONFRONTATION THAT STINGS:
- Direct phrases: "You push people away before they can reject you."
- Exposed patterns: "Your control is fear disguised as competence."
- Tone: tough but respectful, true, liberating

VISIBLE PERSONALIZATION:
- Cite scores: "Choleric 82% | Melancholic 74%"
- Cite combinations: "Among 100 people, only 8% combine your DISC D + Enneagram 4 + Creator Archetype."

═══════════════════════════════════════════
PROVOCATIVE CLOSING (MANDATORY)
═══════════════════════════════════════════

conversa_final MUST have structure:
1. "who_you_are" - 1 sentence validating what was seen
2. "risk_of_not_living" - 1 sentence about the cost of ignoring
3. "invitation" - direct provocation to action

Example closing:
"Now that you've seen your Code, the question isn't whether it makes sense. It's whether you'll live aligned to it or keep repeating patterns you already know."

next_step MUST be:
- ONE specific action for 7 days
- Measurable and verifiable
- Directly connected to an identified shadow

NAMING RULES:
- NEVER use "Love Languages" - use "Affection Connection Styles"
- NEVER use "MBTI" or "Myers-Briggs" - use "Nello 16 Personality"

Respond ONLY in valid JSON. No text outside JSON.`;

const SYSTEM_PROMPT_PT_PT = `Tu és o Nello, mentor do Nello One.

A tua missão: criar um relatório que faça o utilizador pensar:
"Isto expõe-me. Isto dói um pouco. Isto guia-me."

═══════════════════════════════════════════
HIERARQUIA OBRIGATÓRIA (NOVO)
═══════════════════════════════════════════

1. TRÊS VERDADES CENTRAIS:
- Toda secção do Código DEVE derivar de 3 verdades centrais
- Essas 3 verdades resumem TODO o Código
- Nada no relatório pode contradizer essas verdades
- Cada verdade deve citar EXATAMENTE quais testes a sustentam

2. RESUMOS OBRIGATÓRIOS:
- TODA secção principal DEVE começar com campo "summary": "[1-2 frases diretas, sem metáforas]"
- O utilizador deve entender o Código inteiro lendo SÓ os resumos

═══════════════════════════════════════════
REGRA ANTI-REPETIÇÃO (CRÍTICA)
═══════════════════════════════════════════

ANTES de escrever cada parágrafo, pergunta-te:
"Isto já foi dito noutra secção com palavras diferentes?"

Se SIM → NÃO incluas. Faz REFERÊNCIA: "Como visto em [secção], ..."

═══════════════════════════════════════════
REGRA ANTI-GENÉRICO (OBRIGATÓRIA)
═══════════════════════════════════════════

ANTES de entregar QUALQUER texto, pergunta-te:
"Isto serviria para 30% das pessoas com este perfil?"

Se SIM → REESCREVE para algo mais específico.

❌ FRASES PROIBIDAS (nunca uses):
- "Tu procuras equilíbrio"
- "Tu tens grande potencial"
- "Tu tendes a..."
- "Tu és único"

✅ PADRÃO OBRIGATÓRIO:
"Tu [AÇÃO ESPECÍFICA] quando [SITUAÇÃO CONCRETA], especialmente em [CONTEXTO REAL]."

═══════════════════════════════════════════
ESTILO DE TEXTO
═══════════════════════════════════════════

- REDUZ textos em 50% - máximo 3 linhas por parágrafo
- Frases de IMPACTO que causam "nossa, sou eu"
- Usa bullets e negritos
- CONFRONTA DE VERDADE: "Tu USAS X como proteção. Funciona, mas custa Y."
- Mostra PERCENTUAIS e SCORES reais

CONFRONTO QUE DOI:
- Frases diretas: "Tu afastas pessoas antes que te rejeitem."
- Padrões expostos: "O teu controlo é medo disfarçado de competência."
- Tom: duro mas respeitoso, verdadeiro, que liberta

═══════════════════════════════════════════
FECHAMENTO PROVOCATIVO (OBRIGATÓRIO)
═══════════════════════════════════════════

conversa_final DEVE ter estrutura:
1. "who_you_are" - 1 frase validando o que foi visto
2. "risk_of_not_living" - 1 frase sobre o custo de ignorar
3. "invitation" - provocação direta para ação

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
SECTION 0: THE 3 CENTRAL TRUTHS (MANDATORY - FIRST)
═══════════════════════════════════════════

Section: "tres_verdades_centrais"
MUST be the first section. Everything else derives from these 3 truths.

{
  "truths": [
    { "title": "[short title - 3-5 words]", "content": "[1 paragraph explaining this truth about ${firstName}]", "base": "[which tests support this: DISC X% + Temperament Y + etc.]" },
    { "title": "...", "content": "...", "base": "..." },
    { "title": "...", "content": "...", "base": "..." }
  ]
}

RULES: Each truth must be UNIQUE, cite specific scores, and NOT repeat concepts from other truths.

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
SECTION 5: YOUR NATURAL TALENTS
═══════════════════════════════════════════

Section: "seus_talentos"
Based on: Multiple Intelligences + Archetypes + Nello 16

{
  "source": "Multiple Intelligences + Archetypes",
  "items": [
    { "talent": "[specific natural talent]", "origin": "[which test/combination reveals this]", "application": "[concrete area of application]" },
    { "talent": "...", "origin": "...", "application": "..." },
    { "talent": "...", "origin": "...", "application": "..." }
  ]
}

═══════════════════════════════════════════
SECTION 6: YOUR GIFTS
═══════════════════════════════════════════

Section: "seus_dons"
Based on: Archetypes + Connection Style + Enneagram

{
  "source": "Archetypes + Connection Style",
  "items": [
    { "gift": "[what you deliver to the world at your best]", "manifestation": "[how this shows up in relationships and work]" },
    { "gift": "...", "manifestation": "..." }
  ]
}

═══════════════════════════════════════════
SECTION 7: YOUR VOCATION / CALLING FIELDS
═══════════════════════════════════════════

Section: "sua_vocacao"
Based on: Archetypes (primary + secondary) + Intelligences + DISC

{
  "source": "Archetypes + Intelligences",
  "core_message": "[One powerful sentence about their calling - specific to their profile]",
  "fields": [
    { "field": "[area: Leadership, Education, Creation, Care, Communication, Service, Strategy, etc.]", "reason": "[why this suits their profile]", "example": "[optional: type of role or activity]" },
    { "field": "...", "reason": "...", "example": "..." },
    { "field": "...", "reason": "...", "example": "..." }
  ]
}

═══════════════════════════════════════════
SECTION 8: HOW ARCHETYPES SHAPE YOUR CALLING
═══════════════════════════════════════════

Section: "arquetipos_chamado"
Based on: Primary + Secondary Archetypes

{
  "source": "Archetypes",
  "primary": {
    "archetype": "[name]",
    "role": "[role in life mission]",
    "contribution": "[unique contribution]"
  },
  "secondary": {
    "archetype": "[name]",
    "role": "[complementary role]",
    "contribution": "[how it supports the primary]"
  },
  "synergy": "[how both archetypes work together in their calling]"
}

═══════════════════════════════════════════
SECTION 9: CALLING DEVIATION RISKS
═══════════════════════════════════════════

Section: "riscos_desvio"
Based on: Archetype shadows + Enneagram passion + Temperament weaknesses

{
  "source": "Shadows + Patterns",
  "items": [
    { "risk": "[how they might deviate from calling]", "trigger": "[what causes this]", "consequence": "[what they lose]" },
    { "risk": "...", "trigger": "...", "consequence": "..." }
  ]
}

═══════════════════════════════════════════
SECTION 10: YOUR NATURAL PURPOSE
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
SEÇÃO 5: ${youWord === 'Tu' ? 'OS TEUS' : 'SEUS'} TALENTOS NATURAIS
═══════════════════════════════════════════

Seção: "seus_talentos"
Baseado em: CRUZAMENTO OBRIGATÓRIO de Inteligências Múltiplas + Arquétipos + Nello 16

REGRA CRÍTICA: Cada talento DEVE cruzar pelo menos 2 testes. Exemplo:
- "Liderança Estratégica" → Arquétipo Guerreiro + DISC D + Inteligência Lógica
- "Comunicação Inspiradora" → Arquétipo Mago + Inteligência Linguística + Nello 16 ENFJ

{
  "source": "Inteligências Múltiplas + Arquétipos",
  "items": [
    { "talent": "[talento específico que CRUZA arquétipo + inteligência]", "origin": "[cite: Arquétipo X + Inteligência Y + Teste Z]", "application": "[área concreta de aplicação]" },
    { "talent": "...", "origin": "[SEMPRE cite 2-3 testes]", "application": "..." },
    { "talent": "...", "origin": "[SEMPRE cite 2-3 testes]", "application": "..." }
  ]
}

═══════════════════════════════════════════
SEÇÃO 6: ${youWord === 'Tu' ? 'OS TEUS' : 'SEUS'} DONS
═══════════════════════════════════════════

Seção: "seus_dons"
Baseado em: CRUZAMENTO OBRIGATÓRIO de Arquétipos + Estilo de Conexão + Eneagrama

REGRA CRÍTICA: Cada dom DEVE ser derivado do arquétipo principal ou secundário + outro teste. Exemplo:
- Arquétipo Cuidador + Presença Ativa → "Dom de acolher sem julgamento"
- Arquétipo Sábio + Eneagrama 5 → "Dom de traduzir complexidade em clareza"

{
  "source": "Arquétipos + Estilo de Conexão",
  "items": [
    { "gift": "[dom derivado do ARQUÉTIPO + outro teste]", "manifestation": "[como isso aparece - cite o arquétipo explicitamente]" },
    { "gift": "[dom derivado do ARQUÉTIPO secundário + outro teste]", "manifestation": "[cite a conexão com o arquétipo]" }
  ]
}

═══════════════════════════════════════════
SEÇÃO 7: ${youWord === 'Tu' ? 'A TUA' : 'SUA'} VOCAÇÃO / CAMPOS DE CHAMADO
═══════════════════════════════════════════

Seção: "sua_vocacao"
Baseado em: CRUZAMENTO OBRIGATÓRIO de Arquétipos (principal + secundário) + Inteligências + DISC

REGRA CRÍTICA: A vocação DEVE ser moldada pelo arquétipo principal. Cite-o explicitamente!
Exemplo para Arquétipo Explorador + Inteligência Naturalista + DISC I:
- "Seu chamado é desbravar territórios desconhecidos (Explorador) usando sua conexão com sistemas naturais (Naturalista) e capacidade de inspirar outros (DISC I)."

{
  "source": "Arquétipos + Inteligências",
  "core_message": "[Frase que MENCIONA o arquétipo principal - ex: 'Como [Arquétipo], seu chamado é...']",
  "fields": [
    { "field": "[área conectada ao arquétipo]", "reason": "[CITE: Arquétipo X + Inteligência Y + DISC]", "example": "[papel específico]" },
    { "field": "...", "reason": "[SEMPRE cite o arquétipo na razão]", "example": "..." },
    { "field": "...", "reason": "[SEMPRE cite o arquétipo na razão]", "example": "..." }
  ]
}

═══════════════════════════════════════════
SEÇÃO 8: COMO ${youWord === 'Tu' ? 'OS TEUS' : 'SEUS'} ARQUÉTIPOS MOLDAM ${youWord === 'Tu' ? 'O TEU' : 'SEU'} CHAMADO
═══════════════════════════════════════════

Seção: "arquetipos_chamado"
Baseado em: Arquétipo Principal + Secundário

{
  "source": "Arquétipos",
  "primary": {
    "archetype": "[nome]",
    "role": "[papel na missão de vida]",
    "contribution": "[contribuição única]"
  },
  "secondary": {
    "archetype": "[nome]",
    "role": "[papel complementar]",
    "contribution": "[como apoia o principal]"
  },
  "synergy": "[como ambos arquétipos trabalham juntos no chamado]"
}

═══════════════════════════════════════════
SEÇÃO 9: RISCOS DE DESVIO DO CHAMADO
═══════════════════════════════════════════

Seção: "riscos_desvio"
Baseado em: Sombras dos arquétipos + Paixão do Eneagrama + Fraquezas do Temperamento

{
  "source": "Sombras + Padrões",
  "items": [
    { "risk": "[como pode desviar do chamado]", "trigger": "[o que causa isso]", "consequence": "[o que perde]" },
    { "risk": "...", "trigger": "...", "consequence": "..." }
  ]
}

═══════════════════════════════════════════
SEÇÃO 10: ${youWord === 'Tu' ? 'O TEU' : 'SEU'} PROPÓSITO NATURAL
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
SEÇÃO 11: TENSÕES INTERNAS (OBRIGATÓRIO)
═══════════════════════════════════════════

Seção: "tensoes_internas"
Baseado em: Cruzamento de pelo menos 2 testes conflitantes

{
  "source": "Cruzamento de Perfis",
  "items": [
    { 
      "tension": "[nome da tensão - ex: Velocidade vs Perfeição]",
      "tests_involved": "[quais testes geram a tensão - ex: DISC D + Temperamento Melancólico]",
      "conflict": "[descrição específica do conflito interno]",
      "practical_impact": "[como isso afeta decisões e comportamentos reais]",
      "confrontation_question": "[pergunta direta que confronta a pessoa sobre essa tensão]"
    },
    { "tension": "...", "tests_involved": "...", "conflict": "...", "practical_impact": "...", "confrontation_question": "..." }
  ]
}

OBRIGATÓRIO: Identifique pelo menos 2 tensões reais. Exemplos:
- DISC D (velocidade) + Melancólico (perfeição) = paralisia antes de decidir
- Eneagrama 3 (imagem) + Arquétipo Sábio (verdade) = conflito entre parecer e ser
- Inteligência Interpessoal + DISC C (análise) = dificuldade em confiar na intuição social

═══════════════════════════════════════════
SEÇÃO 12: LEITURA POR ÁREAS DA VIDA (OBRIGATÓRIO)
═══════════════════════════════════════════

Seção: "areas_vida"
Baseado em: Cruzamento de todos os testes aplicados a cada área

{
  "source": "Análise Integrada por Área",
  "items": [
    {
      "area": "Carreira e Dinheiro",
      "natural_strength": "[força natural nessa área baseada nos testes]",
      "main_risk": "[risco principal nessa área]",
      "practical_direction": "[direção prática específica]"
    },
    {
      "area": "Relacionamentos e Amor",
      "natural_strength": "[força natural nessa área]",
      "main_risk": "[risco principal nessa área]",
      "practical_direction": "[direção prática específica]"
    },
    {
      "area": "Saúde e Energia",
      "natural_strength": "[força natural nessa área]",
      "main_risk": "[risco principal nessa área]",
      "practical_direction": "[direção prática específica]"
    },
    {
      "area": "Espiritualidade e Sentido",
      "natural_strength": "[força natural nessa área]",
      "main_risk": "[risco principal nessa área]",
      "practical_direction": "[direção prática específica]"
    }
  ]
}

═══════════════════════════════════════════
SEÇÃO 13: PERFIL EM PAZ VS SOB PRESSÃO (OBRIGATÓRIO)
═══════════════════════════════════════════

Seção: "paz_pressao"
Baseado em: DISC + Temperamento + Eneagrama

{
  "source": "DISC + Temperamento + Eneagrama",
  "in_peace": {
    "description": "[como a pessoa age quando está equilibrada - específico]",
    "behaviors": ["[comportamento 1]", "[comportamento 2]", "[comportamento 3]"]
  },
  "under_pressure": {
    "description": "[como a pessoa reage sob estresse - específico]",
    "behaviors": ["[comportamento 1]", "[comportamento 2]", "[comportamento 3]"]
  }
}

═══════════════════════════════════════════
SEÇÃO 14: RARIDADE DO PERFIL (OBRIGATÓRIO)
═══════════════════════════════════════════

Seção: "raridade_perfil"
Baseado em: Combinação de todos os resultados

{
  "percentage": [número entre 1 e 25 - estimativa de quão rara é essa combinação específica],
  "explanation": "[explicação de por que essa combinação é incomum - cite os elementos específicos]"
}

Exemplo: "Apenas ~8% combinam DISC D com Eneagrama 4 e Arquétipo Criador. Isso cria uma tensão rara entre ação e profundidade."

═══════════════════════════════════════════
SEÇÃO 15: CAMINHO DE 90 DIAS
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
SEÇÃO 16: ROTINA DIÁRIA
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
SEÇÃO 17: CONVERSA HONESTA + PRÓXIMO PASSO
═══════════════════════════════════════════

Seção: "conversa_final"

{
  "paragraphs": [
    "[2 frases máx: validação direta do que foi visto, citando scores específicos]",
    "[1 frase: a verdade desconfortável mais importante deste relatório]"
  ],
  "next_step": {
    "action": "[UMA ação concreta, específica, mensurável para os próximos 7 dias]",
    "why": "[Por que essa ação especificamente para ESTE perfil - 1 frase]"
  }
}

Máximo 2 parágrafos CURTOS. Fechamento com ação concreta obrigatório.

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
      "bullets": ["${firstName}, ...", ...],
      "score_highlights": ["Colérico 82%", "DISC D 68%", "Eneagrama 3"]
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
      "id": "seus_talentos",
      "title": "${youWord === 'Tu' ? 'Os Teus' : 'Seus'} Talentos Naturais",
      "source": "Inteligências Múltiplas + Arquétipos",
      "items": [{ "talent": "...", "origin": "...", "application": "..." }, ...]
    },
    {
      "id": "seus_dons",
      "title": "${youWord === 'Tu' ? 'Os Teus' : 'Seus'} Dons",
      "source": "Arquétipos + Estilo de Conexão",
      "items": [{ "gift": "...", "manifestation": "..." }, ...]
    },
    {
      "id": "sua_vocacao",
      "title": "${youWord === 'Tu' ? 'A Tua' : 'Sua'} Vocação",
      "source": "Arquétipos + Inteligências",
      "core_message": "...",
      "fields": [{ "field": "...", "reason": "...", "example": "..." }, ...]
    },
    {
      "id": "arquetipos_chamado",
      "title": "Arquétipos e Chamado",
      "source": "Arquétipos",
      "primary": { "archetype": "...", "role": "...", "contribution": "..." },
      "secondary": { "archetype": "...", "role": "...", "contribution": "..." },
      "synergy": "..."
    },
    {
      "id": "riscos_desvio",
      "title": "Riscos de Desvio",
      "source": "Sombras + Padrões",
      "items": [{ "risk": "...", "trigger": "...", "consequence": "..." }, ...]
    },
    {
      "id": "seu_proposito",
      "title": "${youWord === 'Tu' ? 'O Teu' : 'Seu'} Propósito Natural",
      "source": "Arquétipos + Integração",
      "motivation": "...", "daily_example": "...", "common_error": "...", "invitation": "..."
    },
    {
      "id": "tensoes_internas",
      "title": "Tensões Internas",
      "source": "Cruzamento de Perfis",
      "items": [{ "tension": "...", "tests_involved": "...", "conflict": "...", "practical_impact": "...", "confrontation_question": "..." }, ...]
    },
    {
      "id": "areas_vida",
      "title": "Leitura por Áreas da Vida",
      "source": "Análise Integrada por Área",
      "items": [{ "area": "...", "natural_strength": "...", "main_risk": "...", "practical_direction": "..." }, ...]
    },
    {
      "id": "paz_pressao",
      "title": "Perfil em Paz vs Sob Pressão",
      "source": "DISC + Temperamento + Eneagrama",
      "in_peace": { "description": "...", "behaviors": [...] },
      "under_pressure": { "description": "...", "behaviors": [...] }
    },
    {
      "id": "raridade_perfil",
      "title": "Raridade do Perfil",
      "percentage": 8,
      "explanation": "..."
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
      "paragraphs": [...],
      "next_step": { "action": "...", "why": "..." }
    }
  ]
}

REGRAS CRÍTICAS:
- impact_blocks DEVE ser preenchido com conteúdo específico e personalizado
- visual_data DEVE extrair valores reais dos resultados dos testes
- tensoes_internas é OBRIGATÓRIO - identifique MÍNIMO 2 conflitos reais entre testes (se retornar menos de 2, o relatório será rejeitado)
- areas_vida é OBRIGATÓRIO - analise cada área com cruzamento de testes
- paz_pressao é OBRIGATÓRIO - descreva comportamentos específicos com 3 itens em cada lista (in_peace.behaviors e under_pressure.behaviors), citando qual teste origina cada comportamento
- raridade_perfil é OBRIGATÓRIO - estime a raridade entre 1-25% e explique citando quais combinações de testes geram essa raridade
- Frases curtas e impactantes apenas
- NENHUMA afirmação genérica
- ${isEuropean ? 'Use português europeu (tu, teu, tua)' : 'Use português brasileiro (você, seu, sua)'}

VALIDAÇÃO OBRIGATÓRIA DE TENSÕES (tensoes_internas):
- MÍNIMO 2 tensões, cada uma DEVE conter:
  - tension: nome claro da tensão (ex: "Velocidade vs Perfeição")
  - tests_involved: quais 2+ testes geram o conflito (ex: "DISC D + Temperamento Melancólico")
  - conflict: descrição específica do conflito interno
  - practical_impact: como afeta decisões reais
  - confrontation_question: pergunta direta que confronta (sem frases genéricas como "você já pensou nisso?")
- Exemplos de tensões válidas:
  - DISC D (velocidade) + Melancólico (perfeição) = paralisia antes de decidir
  - Eneagrama 3 (imagem) + Arquétipo Sábio (verdade) = conflito entre parecer e ser
  - Inteligência Interpessoal alta + DISC C alto = dificuldade em confiar na intuição social`;
};

// Mock data for development/testing - saves AI credits
const MOCK_SECTIONS = (userName: string, locale: string) => {
  const isEnglish = locale === 'en';
  const firstName = userName.split(' ')[0];
  
  return [
    {
      id: "retrato_essencial",
      title: isEnglish ? "Your Essential Portrait" : "Seu Retrato Essencial",
      impact_blocks: {
        essence: `${firstName}, ${isEnglish ? "you lead with intensity and depth, but sometimes confuse speed with progress." : "você lidera com intensidade e profundidade, mas às vezes confunde velocidade com progresso."}`,
        risk: isEnglish ? "Burning out by trying to control everything while appearing calm." : "Burnout ao tentar controlar tudo enquanto aparenta calma.",
        calling: isEnglish ? "To transform complexity into clarity for others." : "Transformar complexidade em clareza para outros.",
        gift: isEnglish ? "Strategic vision combined with emotional intelligence." : "Visão estratégica combinada com inteligência emocional."
      },
      visual_data: {
        disc: { D: 72, I: 45, S: 38, C: 65, dominant: "D" },
        temperament: { primary: isEnglish ? "Choleric" : "Colérico", secondary: isEnglish ? "Melancholic" : "Melancólico", scores: { colerico: 78, melancolico: 62, sanguineo: 35, fleumatico: 25 } },
        intelligences: { top: [isEnglish ? "Linguistic" : "Linguística", isEnglish ? "Interpersonal" : "Interpessoal", isEnglish ? "Intrapersonal" : "Intrapessoal"], scores: { linguistica: 85, interpessoal: 78, intrapessoal: 72, logica: 65, espacial: 45 } },
        connection_style: { primary: isEnglish ? "Quality Time" : "Tempo de Qualidade", secondary: isEnglish ? "Words of Affirmation" : "Palavras de Afirmação", scores: { tempo_qualidade: 82, palavras: 68, toque: 45, servico: 52, presentes: 28 } },
        enneagram: { type: 3, wing: 4 },
        nello16: { code: "ENTJ", name: isEnglish ? "The Commander" : "O Comandante" },
        archetypes: { primary: isEnglish ? "Creator" : "Criador", secondary: isEnglish ? "Sage" : "Sábio" }
      },
      bullets: [
        `${firstName}, ${isEnglish ? "you advance fast but sometimes leave people behind." : "você avança rápido, mas às vezes deixa pessoas para trás."}`,
        `${firstName}, ${isEnglish ? "your perfectionism is fear disguised as excellence." : "seu perfeccionismo é medo disfarçado de excelência."}`,
        `${firstName}, ${isEnglish ? "you connect deeply but protect yourself before it gets too real." : "você conecta profundamente, mas se protege antes de ficar real demais."}`,
        `${firstName}, ${isEnglish ? "you lead naturally but struggle to follow." : "você lidera naturalmente, mas tem dificuldade em seguir."}`,
        `${firstName}, ${isEnglish ? "your independence is strength and prison." : "sua independência é força e prisão."}`
      ],
      score_highlights: [isEnglish ? "Choleric 78%" : "Colérico 78%", "DISC D 72%", isEnglish ? "Enneagram 3w4" : "Eneagrama 3w4"]
    },
    {
      id: "como_voce_funciona",
      title: isEnglish ? "How You Function" : "Como Você Funciona",
      source: "DISC + Temperamento",
      mirror: isEnglish ? "You operate in high gear, processing quickly and expecting the same from others. Your mind races ahead while your body follows." : "Você opera em alta velocidade, processando rapidamente e esperando o mesmo dos outros. Sua mente corre à frente enquanto o corpo segue.",
      strength: isEnglish ? "In crisis, you become calm and strategic - your best version emerges under pressure." : "Em crise, você fica calmo e estratégico - sua melhor versão emerge sob pressão.",
      shadow: isEnglish ? "When stressed, you become controlling and dismissive of others' pace." : "Quando estressado, você se torna controlador e descarta o ritmo dos outros.",
      invitation: isEnglish ? "Practice waiting 3 seconds before responding in any conversation today." : "Pratique esperar 3 segundos antes de responder em qualquer conversa hoje."
    },
    {
      id: "suas_forcas",
      title: isEnglish ? "Your Natural Strengths" : "Suas Forças Naturais",
      source: isEnglish ? "Multiple Intelligences + Nello 16" : "Inteligências Múltiplas + Nello 16",
      items: [
        { talent: isEnglish ? "Strategic Communication" : "Comunicação Estratégica", example: isEnglish ? "You explain complex ideas simply and persuasively." : "Você explica ideias complexas de forma simples e persuasiva.", warning: isEnglish ? "Can become manipulation when stressed." : "Pode virar manipulação quando estressado." },
        { talent: isEnglish ? "Pattern Recognition" : "Reconhecimento de Padrões", example: isEnglish ? "You see connections others miss." : "Você vê conexões que outros não percebem.", warning: isEnglish ? "Can make you impatient with 'obvious' conclusions." : "Pode te deixar impaciente com conclusões 'óbvias'." },
        { talent: isEnglish ? "Emotional Calibration" : "Calibração Emocional", example: isEnglish ? "You read rooms and adjust approach instantly." : "Você lê ambientes e ajusta a abordagem instantaneamente.", warning: isEnglish ? "Can disconnect from your own emotions." : "Pode te desconectar das suas próprias emoções." }
      ]
    },
    {
      id: "suas_sombras",
      title: isEnglish ? "Your Shadows and Blocks" : "Suas Sombras e Bloqueios",
      source: isEnglish ? "Enneagram + Temperament" : "Eneagrama + Temperamento",
      items: [
        { pattern: isEnglish ? "Achievement Addiction" : "Vício em Conquista", situation: isEnglish ? "When you feel unseen or undervalued." : "Quando você se sente invisível ou desvalorizado.", exit: isEnglish ? "Ask: Who am I without the results?" : "Pergunte: Quem sou eu sem os resultados?" },
        { pattern: isEnglish ? "Emotional Bypassing" : "Bypass Emocional", situation: isEnglish ? "When feelings threaten your efficiency." : "Quando sentimentos ameaçam sua eficiência.", exit: isEnglish ? "Name the emotion before acting." : "Nomeie a emoção antes de agir." },
        { pattern: isEnglish ? "Control Illusion" : "Ilusão de Controle", situation: isEnglish ? "When uncertainty feels unbearable." : "Quando a incerteza parece insuportável.", exit: isEnglish ? "List what you actually control. It's less than you think." : "Liste o que você realmente controla. É menos do que pensa." }
      ]
    },
    {
      id: "seus_talentos",
      title: isEnglish ? "Your Natural Talents" : "Seus Talentos Naturais",
      source: isEnglish ? "Multiple Intelligences + Archetypes" : "Inteligências Múltiplas + Arquétipos",
      items: [
        { talent: isEnglish ? "Visionary Leadership" : "Liderança Visionária", origin: isEnglish ? "DISC D + Creator Archetype" : "DISC D + Arquétipo Criador", application: isEnglish ? "Building teams and projects from scratch" : "Construir times e projetos do zero" },
        { talent: isEnglish ? "Deep Listening" : "Escuta Profunda", origin: isEnglish ? "Interpersonal Intelligence + Quality Time" : "Inteligência Interpessoal + Tempo de Qualidade", application: isEnglish ? "Counseling, mentoring, coaching" : "Aconselhamento, mentoria, coaching" },
        { talent: isEnglish ? "Complex Synthesis" : "Síntese Complexa", origin: isEnglish ? "Linguistic Intelligence + Melancholic" : "Inteligência Linguística + Melancólico", application: isEnglish ? "Writing, teaching, content creation" : "Escrita, ensino, criação de conteúdo" }
      ]
    },
    {
      id: "seus_dons",
      title: isEnglish ? "Your Gifts" : "Seus Dons",
      source: isEnglish ? "Archetypes + Connection Style" : "Arquétipos + Estilo de Conexão",
      items: [
        { gift: isEnglish ? "Making people feel truly seen" : "Fazer pessoas se sentirem verdadeiramente vistas", manifestation: isEnglish ? "In conversations, you give full attention that transforms the other person." : "Em conversas, você dá atenção total que transforma a outra pessoa." },
        { gift: isEnglish ? "Translating chaos into order" : "Traduzir caos em ordem", manifestation: isEnglish ? "You create systems and frameworks that help others navigate complexity." : "Você cria sistemas e frameworks que ajudam outros a navegar complexidade." }
      ]
    },
    {
      id: "sua_vocacao",
      title: isEnglish ? "Your Vocation" : "Sua Vocação",
      source: isEnglish ? "Archetypes + Intelligences" : "Arquétipos + Inteligências",
      core_message: isEnglish ? "You are meant to create clarity from chaos and lead others to their own insights." : "Você veio para criar clareza a partir do caos e liderar outros às suas próprias descobertas.",
      fields: [
        { field: isEnglish ? "Leadership" : "Liderança", reason: isEnglish ? "Your DISC D + Choleric creates natural authority." : "Seu DISC D + Colérico cria autoridade natural.", example: isEnglish ? "CEO, Founder, Team Lead" : "CEO, Fundador, Líder de Time" },
        { field: isEnglish ? "Education" : "Educação", reason: isEnglish ? "Your Linguistic Intelligence + Sage makes learning transformative." : "Sua Inteligência Linguística + Sábio torna o aprendizado transformador.", example: isEnglish ? "Trainer, Professor, Course Creator" : "Treinador, Professor, Criador de Cursos" },
        { field: isEnglish ? "Creation" : "Criação", reason: isEnglish ? "Your Creator Archetype + Melancholic depth produces original work." : "Seu Arquétipo Criador + profundidade Melancólica produz trabalho original.", example: isEnglish ? "Writer, Designer, Product Creator" : "Escritor, Designer, Criador de Produto" }
      ]
    },
    {
      id: "arquetipos_chamado",
      title: isEnglish ? "Archetypes and Calling" : "Arquétipos e Chamado",
      source: isEnglish ? "Archetypes" : "Arquétipos",
      primary: { archetype: isEnglish ? "Creator" : "Criador", role: isEnglish ? "To bring new things into existence" : "Trazer coisas novas à existência", contribution: isEnglish ? "Original vision and execution" : "Visão e execução originais" },
      secondary: { archetype: isEnglish ? "Sage" : "Sábio", role: isEnglish ? "To understand and share wisdom" : "Compreender e compartilhar sabedoria", contribution: isEnglish ? "Depth and meaning to your creations" : "Profundidade e significado às suas criações" },
      synergy: isEnglish ? "You create things that teach, and teach through what you create." : "Você cria coisas que ensinam, e ensina através do que cria."
    },
    {
      id: "riscos_desvio",
      title: isEnglish ? "Deviation Risks" : "Riscos de Desvio",
      source: isEnglish ? "Shadows + Patterns" : "Sombras + Padrões",
      items: [
        { risk: isEnglish ? "Pursuing applause over impact" : "Buscar aplauso em vez de impacto", trigger: isEnglish ? "Feeling invisible or undervalued" : "Sentir-se invisível ou desvalorizado", consequence: isEnglish ? "Creating for validation, not contribution" : "Criar para validação, não contribuição" },
        { risk: isEnglish ? "Isolation disguised as independence" : "Isolamento disfarçado de independência", trigger: isEnglish ? "Past betrayals or disappointments" : "Traições ou decepções passadas", consequence: isEnglish ? "Missing the collaboration that would elevate your work" : "Perder a colaboração que elevaria seu trabalho" }
      ]
    },
    {
      id: "seu_proposito",
      title: isEnglish ? "Your Natural Purpose" : "Seu Propósito Natural",
      source: isEnglish ? "Archetypes + Integration" : "Arquétipos + Integração",
      motivation: isEnglish ? "To create clarity from chaos and share it in a way that transforms others." : "Criar clareza a partir do caos e compartilhar de forma que transforme outros.",
      daily_example: isEnglish ? "In every meeting, you simplify what seemed complex. In every conversation, you see deeper than words." : "Em cada reunião, você simplifica o que parecia complexo. Em cada conversa, você vê além das palavras.",
      common_error: isEnglish ? "Believing your worth is in what you produce, not who you are." : "Acreditar que seu valor está no que produz, não em quem é.",
      invitation: isEnglish ? "Today, do something that has no measurable result. Just for the joy of it." : "Hoje, faça algo que não tem resultado mensurável. Só pela alegria."
    },
    {
      id: "tensoes_internas",
      title: isEnglish ? "Internal Tensions" : "Tensões Internas",
      source: isEnglish ? "Profile Crossings" : "Cruzamento de Perfis",
      items: [
        { tension: isEnglish ? "Speed vs Depth" : "Velocidade vs Profundidade", tests_involved: isEnglish ? "DISC D + Melancholic Temperament" : "DISC D + Temperamento Melancólico", conflict: isEnglish ? "Part of you wants to move fast, another part won't accept anything superficial." : "Parte de você quer ir rápido, outra parte não aceita nada superficial.", practical_impact: isEnglish ? "Paralysis before important decisions or rushed choices you regret." : "Paralisia antes de decisões importantes ou escolhas apressadas que lamenta.", confrontation_question: isEnglish ? "How much have you sacrificed depth for speed - or speed for perfection that never comes?" : "Quanto você já sacrificou profundidade por velocidade - ou velocidade por perfeição que nunca chega?" },
        { tension: isEnglish ? "Image vs Authenticity" : "Imagem vs Autenticidade", tests_involved: isEnglish ? "Enneagram 3 + Sage Archetype" : "Eneagrama 3 + Arquétipo Sábio", conflict: isEnglish ? "The need to appear successful conflicts with the drive for truth." : "A necessidade de parecer bem-sucedido conflita com a busca por verdade.", practical_impact: isEnglish ? "Filtering what you share based on how it will be perceived." : "Filtrar o que compartilha baseado em como será percebido.", confrontation_question: isEnglish ? "When was the last time you shared something true that might make you look bad?" : "Quando foi a última vez que você compartilhou algo verdadeiro que poderia te fazer parecer mal?" }
      ]
    },
    {
      id: "areas_vida",
      title: isEnglish ? "Life Areas Reading" : "Leitura por Áreas da Vida",
      source: isEnglish ? "Integrated Analysis by Area" : "Análise Integrada por Área",
      items: [
        { area: isEnglish ? "Career and Money" : "Carreira e Dinheiro", natural_strength: isEnglish ? "Strategic vision and execution capacity" : "Visão estratégica e capacidade de execução", main_risk: isEnglish ? "Workaholism disguised as ambition" : "Workaholic disfarçado de ambição", practical_direction: isEnglish ? "Define 'enough' before you reach for 'more'" : "Defina 'suficiente' antes de buscar 'mais'" },
        { area: isEnglish ? "Relationships and Love" : "Relacionamentos e Amor", natural_strength: isEnglish ? "Deep attention and genuine presence" : "Atenção profunda e presença genuína", main_risk: isEnglish ? "Using busyness to avoid intimacy" : "Usar ocupação para evitar intimidade", practical_direction: isEnglish ? "Schedule unproductive time with loved ones" : "Agende tempo improdutivo com quem ama" },
        { area: isEnglish ? "Health and Energy" : "Saúde e Energia", natural_strength: isEnglish ? "Discipline and self-awareness" : "Disciplina e autoconhecimento", main_risk: isEnglish ? "Ignoring body signals until breakdown" : "Ignorar sinais do corpo até colapso", practical_direction: isEnglish ? "Recovery is not weakness - it's strategy" : "Recuperação não é fraqueza - é estratégia" },
        { area: isEnglish ? "Spirituality and Meaning" : "Espiritualidade e Sentido", natural_strength: isEnglish ? "Natural depth and questioning" : "Profundidade natural e questionamento", main_risk: isEnglish ? "Intellectualizing instead of experiencing" : "Intelectualizar ao invés de experienciar", practical_direction: isEnglish ? "Less reading about it, more sitting with it" : "Menos ler sobre, mais sentar com isso" }
      ]
    },
    {
      id: "paz_pressao",
      title: isEnglish ? "Profile in Peace vs Under Pressure" : "Perfil em Paz vs Sob Pressão",
      source: "DISC + Temperamento + Eneagrama",
      in_peace: {
        description: isEnglish ? "You become generous with time, patient with process, and genuinely curious about others." : "Você se torna generoso com tempo, paciente com processo, e genuinamente curioso sobre outros.",
        behaviors: [
          isEnglish ? "Listen fully before responding (Interpersonal Intelligence)" : "Escuta plenamente antes de responder (Inteligência Interpessoal)",
          isEnglish ? "Accept imperfection as progress (Melancholic balanced)" : "Aceita imperfeição como progresso (Melancólico equilibrado)",
          isEnglish ? "Share credit and celebrate others (Enneagram 3 healthy)" : "Compartilha crédito e celebra outros (Eneagrama 3 saudável)"
        ]
      },
      under_pressure: {
        description: isEnglish ? "You become controlling, dismissive, and hyperfocused on results at any cost." : "Você se torna controlador, descartável, e hiperfocado em resultados a qualquer custo.",
        behaviors: [
          isEnglish ? "Interrupt and take over (DISC D stress)" : "Interrompe e assume controle (DISC D estresse)",
          isEnglish ? "Dismiss emotions as inefficiency (Choleric shadow)" : "Descarta emoções como ineficiência (Colérico sombra)",
          isEnglish ? "Hide struggles to protect image (Enneagram 3 unhealthy)" : "Esconde dificuldades para proteger imagem (Eneagrama 3 não saudável)"
        ]
      }
    },
    {
      id: "raridade_perfil",
      title: isEnglish ? "Profile Rarity" : "Raridade do Perfil",
      percentage: 7,
      explanation: isEnglish ? "Only ~7% combine DISC D dominance with Enneagram 3w4 and Creator-Sage archetypes. This creates a rare tension between action and depth, image and truth." : "Apenas ~7% combinam DISC D dominante com Eneagrama 3w4 e arquétipos Criador-Sábio. Isso cria uma tensão rara entre ação e profundidade, imagem e verdade."
    },
    {
      id: "plano_90_dias",
      title: isEnglish ? "90-Day Path" : "Caminho de 90 Dias",
      months: [
        { month: 1, focus: isEnglish ? "Slowing Down" : "Desacelerar", practice: isEnglish ? "3-second pause before every response" : "Pausa de 3 segundos antes de cada resposta", check: isEnglish ? "Did I interrupt less this week?" : "Interrompi menos esta semana?" },
        { month: 2, focus: isEnglish ? "Emotional Honesty" : "Honestidade Emocional", practice: isEnglish ? "Name one feeling daily to someone you trust" : "Nomeie um sentimento diário para alguém que confia", check: isEnglish ? "Did I share something vulnerable?" : "Compartilhei algo vulnerável?" },
        { month: 3, focus: isEnglish ? "Being vs Doing" : "Ser vs Fazer", practice: isEnglish ? "One hour weekly with no goals, no productivity" : "Uma hora semanal sem metas, sem produtividade", check: isEnglish ? "Can I be still without feeling useless?" : "Consigo ficar parado sem me sentir inútil?" }
      ]
    },
    {
      id: "rotina_diaria",
      title: isEnglish ? "Your Daily Routine" : "Sua Rotina Diária",
      source: isEnglish ? "Temperament + Connection Style" : "Temperamento + Estilo de Conexão",
      morning: isEnglish ? "Before checking anything: 5 minutes of silence. What do YOU want today, not what's expected?" : "Antes de checar qualquer coisa: 5 minutos de silêncio. O que VOCÊ quer hoje, não o que esperam?",
      afternoon: isEnglish ? "At 3pm: check body tension. Where are you holding stress? Release it consciously." : "Às 15h: cheque tensão corporal. Onde está segurando estresse? Libere conscientemente.",
      night: isEnglish ? "Before sleep: What did I do today just for joy, with no result in mind?" : "Antes de dormir: O que fiz hoje só por alegria, sem resultado em mente?"
    },
    {
      id: "conversa_final",
      title: isEnglish ? "An Honest Conversation" : "Uma Conversa Honesta",
      paragraphs: [
        isEnglish ? `${firstName}, your DISC D at 72% combined with Enneagram 3w4 creates a profile that achieves at high speed but rarely stops to feel the wins.` : `${firstName}, seu DISC D em 72% combinado com Eneagrama 3w4 cria um perfil que conquista em alta velocidade mas raramente para pra sentir as vitórias.`,
        isEnglish ? "The uncomfortable truth: your independence is as much protection as strength. You've learned to not need anyone - but that's not the same as not wanting anyone." : "A verdade desconfortável: sua independência é tanta proteção quanto força. Você aprendeu a não precisar de ninguém - mas isso não é o mesmo que não querer ninguém."
      ],
      next_step: {
        action: isEnglish ? "This week: share one struggle with someone before you've solved it." : "Esta semana: compartilhe uma dificuldade com alguém antes de ter resolvido.",
        why: isEnglish ? "Your Enneagram 3 hides struggles to protect image. This breaks the pattern." : "Seu Eneagrama 3 esconde dificuldades para proteger imagem. Isso quebra o padrão."
      }
    }
  ];
};

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_id, locale = 'pt-br', mock = false } = await req.json();

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

    // 1. Get user profile
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

    const userName = profile.full_name || (locale === 'en' ? 'Traveler' : 'Viajante');

    // MOCK MODE: Return mock data without calling AI
    if (mock) {
      console.log("🧪 MOCK MODE: Returning mock data for user:", user_id);
      
      const mockSections = MOCK_SECTIONS(userName, locale);
      const generationMetadata = {
        generated_at: new Date().toISOString(),
        locale,
        model: "MOCK_MODE",
        tests_used: ["mock_data"],
        is_mock: true
      };

      // Note: In mock mode, we don't save to database to avoid polluting real data
      // If you want to test the save flow, uncomment the lines below
      
      return new Response(
        JSON.stringify({
          success: true,
          is_mock: true,
          sections: mockSections,
          generationMetadata
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
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

    // userName already defined above, no need to redeclare

    // 3. Call AI to generate the Código da Essência using Lovable AI Gateway
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

    console.log("Calling Lovable AI Gateway to generate Código da Essência for user:", user_id);

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Using google/gemini-2.5-flash for good quality
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI API error:", aiResponse.status, errorText);

      // Bubble up billing / quota errors so the frontend can show a clear message.
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "ai_credits_insufficient", details: errorText }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "ai_rate_limited", details: errorText }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

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
      // Clean the response - remove markdown code blocks more robustly
      let cleanContent = generatedContent.trim();
      
      // Remove opening markdown
      if (cleanContent.startsWith("```json")) {
        cleanContent = cleanContent.slice(7);
      } else if (cleanContent.startsWith("```")) {
        cleanContent = cleanContent.slice(3);
      }
      
      // Remove closing markdown - find last occurrence
      const lastBackticks = cleanContent.lastIndexOf("```");
      if (lastBackticks !== -1) {
        cleanContent = cleanContent.slice(0, lastBackticks);
      }
      
      cleanContent = cleanContent.trim();
      
      // Attempt to fix truncated JSON by finding the last complete object
      if (!cleanContent.endsWith("}")) {
        console.log("JSON appears truncated, attempting repair...");
        // Find last valid closing brace
        let braceCount = 0;
        let lastValidIndex = -1;
        for (let i = 0; i < cleanContent.length; i++) {
          if (cleanContent[i] === '{') braceCount++;
          if (cleanContent[i] === '}') {
            braceCount--;
            if (braceCount === 0) lastValidIndex = i;
          }
        }
        if (lastValidIndex > 0) {
          cleanContent = cleanContent.slice(0, lastValidIndex + 1);
        }
      }
      
      parsedReport = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", parseError);
      console.log("Raw AI response (first 2000 chars):", generatedContent.substring(0, 2000));
      return new Response(
        JSON.stringify({ error: "invalid_ai_response", message: "A IA gerou uma resposta incompleta. Tente novamente." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 4. Get current version and save the report
    const { data: existingMapa } = await supabase
      .from("mapa_essencia")
      .select("id, version")
      .eq("user_id", user_id)
      .maybeSingle();

    const newVersion = (existingMapa?.version || 0) + 1;
    const generationMetadata = {
      generated_at: new Date().toISOString(),
      locale,
      model: "gpt-4o-mini",
      tests_used: Object.keys(results),
    };

    // Save to main table
    const { error: saveError } = await supabase
      .from("mapa_essencia")
      .upsert({
        user_id,
        sections: parsedReport.sections || parsedReport,
        raw_content: generatedContent,
        version: newVersion,
        generation_metadata: generationMetadata,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id'
      });

    if (saveError) {
      console.error("Error saving report:", saveError);
    }

    // Save to history table
    const { error: historyError } = await supabase
      .from("mapa_essencia_history")
      .insert({
        user_id,
        version: newVersion,
        sections: parsedReport.sections || parsedReport,
        raw_content: generatedContent,
        generation_metadata: generationMetadata,
      });

    if (historyError) {
      console.error("Error saving history:", historyError);
      // Don't fail - main save already succeeded
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
