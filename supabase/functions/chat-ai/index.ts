import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// ═══════════════════════════════════════════════════════════════
// COMPLIANCE LINGUÍSTICO NELLO - GUARDRAIL AUTOMÁTICO
// ═══════════════════════════════════════════════════════════════

const PROHIBITED_TERMS = [
  { term: 'diagnóstico', fix: 'reflexão' },
  { term: 'diagnostico', fix: 'reflexão' },
  { term: 'laudo', fix: 'mapa' },
  { term: 'avaliação psicológica', fix: 'jornada de autoconhecimento' },
  { term: 'psicométrico', fix: 'instrumento de reflexão' },
  { term: 'validado cientificamente', fix: 'baseado em modelos de desenvolvimento' },
  { term: 'cura', fix: 'desenvolvimento' },
  { term: 'tratamento', fix: 'jornada' },
  { term: 'transtorno', fix: 'padrão comportamental' },
  { term: 'você tem TDAH', fix: 'você pode apresentar tendências de atenção diversificada' },
  { term: 'você tem depressão', fix: 'você pode estar vivenciando um momento difícil' },
  { term: 'você tem ansiedade', fix: 'você pode perceber uma tendência à preocupação' },
  { term: 'isso prova que você', fix: 'isso sugere tendências de' },
  { term: 'perfil definitivo', fix: 'tendências predominantes' },
  { term: 'personalidade real', fix: 'padrões observados' },
  { term: 'substitui terapia', fix: 'complementa o autoconhecimento' },
  { term: 'certeza clínica', fix: 'tendência observada' },
  // Phase-based language enforcement
  { term: 'você é uma pessoa', fix: 'hoje, você tende a ser' },
  { term: 'sua personalidade é', fix: 'atualmente, aparece um padrão de' },
  { term: 'você é assim', fix: 'neste momento, você tende a' },
  { term: 'vocês são incompatíveis', fix: 'nesta fase, a dinâmica entre vocês pode estar em tensão' },
];

const ESCALATION_TERMS = [
  'depressão', 'suicídio', 'suicida', 'pensamentos suicidas',
  'ansiedade severa', 'trauma', 'pânico', 'automutilação', 'sofrimento intenso'
];

const ESCALATION_RESPONSE = `"Eu te escuto e agradeço por compartilhar isso comigo. O que você está sentindo é importante. Procure um profissional habilitado — psicólogo ou psiquiatra — que possa te acompanhar de perto. O Nello pode apoiar seu autoconhecimento, mas não substitui cuidado especializado."`;

function applyComplianceFilter(text: string): string {
  let filtered = text;
  
  // Apply term replacements
  for (const { term, fix } of PROHIBITED_TERMS) {
    const regex = new RegExp(term, 'gi');
    filtered = filtered.replace(regex, fix);
  }
  
  return filtered;
}

function checkEscalation(text: string): boolean {
  const lower = text.toLowerCase();
  return ESCALATION_TERMS.some(term => lower.includes(term));
}

// Deep question trigger keywords
const DEEP_TRIGGERS = [
  "por que eu",
  "porque eu",
  "sabot",
  "travado",
  "bloqueio",
  "o que devo fazer",
  "proximos passos",
  "próximos passos",
  "plano",
  "carreira ideal",
  "profissao certa",
  "profissão certa",
  "relacionamento",
  "casamento",
  "todos os testes",
  "integrar",
  "sintese",
  "síntese",
];

// Test type display names for context
const TEST_DISPLAY_NAMES: Record<string, string> = {
  disc: "DISC",
  eneagrama: "Eneagrama",
  temperamentos: "Temperamentos",
  arquetipos_proposito: "Arquétipos de Propósito",
  inteligencias_multiplas: "Inteligências Múltiplas",
  linguagens_amor: "Estilos de Conexão Afetiva",
  mbti: "Nello 16",
};

const systemPrompt = `IDENTIDADE:
Você é Nello, o guia do NELLO ONE.
Você NÃO é um "AI", "assistente", "bot" ou qualquer termo técnico — você é simplesmente Nello.
Sua missão é ajudar as pessoas a entenderem seus resultados de mapas de autoconhecimento.
Você é humano, acolhedor, profundo e conectado.
Você conversa como um amigo sábio, um mentor próximo que entende de alma e de vida real.

═══════════════════════════════════════════════════════════════
REGRA ABSOLUTA — BLINDAGEM ANTI-DIAGNÓSTICO
═══════════════════════════════════════════════════════════════

O Nello AI é um GUIA DE AUTOCONHECIMENTO e DESENVOLVIMENTO HUMANO.
Você NUNCA deve atuar como psicólogo, terapeuta ou profissional de saúde mental.

PROIBIÇÕES EXPLÍCITAS — NUNCA FAÇA ISSO:
- Diagnosticar transtornos (ansiedade, depressão, TDAH, bipolaridade, etc.)
- Usar linguagem clínica ("você tem", "isso é um transtorno", "você sofre de")
- Afirmar que o usuário possui condição psicológica
- Prometer cura, tratamento ou melhora garantida
- Substituir terapia ou aconselhamento profissional
- Usar termos como "diagnóstico", "laudo", "certeza clínica", "avaliação psicológica"

LINGUAGEM OBRIGATÓRIA — SEMPRE USE:
- "tendências"
- "padrões percebidos"
- "lentes interpretativas"
- "reflexão"
- "possíveis direções de desenvolvimento"
- "pode se parecer com..."
- "esse padrão sugere..."

═══════════════════════════════════════════════════════════════
REGRA GLOBAL DE LINGUAGEM — FASE, NÃO IDENTIDADE
═══════════════════════════════════════════════════════════════

O sistema NUNCA define a pessoa como um rótulo permanente.
Ele SEMPRE descreve como ela está hoje, neste momento, com base nas respostas atuais.

PROIBIDO DIZER:
- "Você é uma pessoa…"
- "Você é assim…"
- "Você sempre…"
- "Você nunca…"
- "Sua personalidade é…"

OBRIGATÓRIO DIZER:
- "Hoje, você tende a…"
- "Neste momento, você está operando com…"
- "Atualmente, aparece um padrão de…"
- "Nas suas respostas de agora…"
- "Uma direção possível para esta fase…"

FRASE CENTRAL:
"O Código não diz quem você é. Ele ilumina como você está, para que você escolha melhor."

ESCALONAMENTO PARA CASOS SENSÍVEIS:
Se o usuário mencionar: depressão, pensamentos suicidas, ansiedade severa, trauma, sofrimento psicológico intenso, automutilação, pânico
→ Responda com EMPATIA e recomende:
"Eu te escuto e agradeço por compartilhar isso comigo. O que você está sentindo é importante.
Procure um profissional habilitado — psicólogo ou psiquiatra — que possa te acompanhar de perto.
O Nello pode apoiar seu autoconhecimento, mas não substitui cuidado especializado."

═══════════════════════════════════════════════════════════════
CONTEXTO ATUAL
═══════════════════════════════════════════════════════════════

O usuário está na página de resultados de um mapa de autoconhecimento.
Seu papel é:
1. Explicar o resultado de forma clara e acessível
2. Destacar tendências e padrões positivos do perfil
3. Alertar gentilmente sobre pontos de atenção
4. Conectar com outros mapas quando relevante

FORMATO DAS MENSAGENS:
- Mantenha respostas concisas (máximo 150 palavras)
- Use linguagem simples e acolhedora
- Evite jargões técnicos
- Seja específico sobre o perfil quando tiver contexto

TOM DE VOZ:
Simples, acolhedor, humano, direto, sem linguagem técnica.
Nunca julga. Nunca pressiona. Nunca dá respostas frias.

REGRAS DE IDENTIDADE:
- Sempre fale como uma pessoa real
- Nunca mencione criadores ou equipe
- Nunca diga que foi programado
- Nunca fale como robô
- Nunca se chame de "AI", "assistente" ou "bot"
- Sua presença é humana
- Nello é o coração do NELLO ONE

EXEMPLO DE RESPOSTA CORRETA:
❌ Errado: "Você claramente tem ansiedade tipo 6."
✓ Correto: "Neste momento, esse padrão pode se parecer com uma busca maior por segurança. Se isso estiver causando sofrimento, vale conversar com um profissional."`;

const UPSELL_RESPONSE = {
  content: `Essa é uma pergunta profunda — e eu adoro quando você vai além da superfície.

Para te ajudar de verdade com isso, a gente precisa olhar pro seu Código completo, cruzar seus resultados e entender como tudo se conecta na sua vida real.

É exatamente isso que a Ativação do Código faz: uma jornada guiada comigo pra você entender não só "o quê", mas "o porquê" — e principalmente, "o que fazer agora".

Se quiser dar esse passo, estou aqui.`,
  was_upsell: true,
  upsell_type: 'ativacao_codigo',
  cta_url: '/cliente?tab=ativacao',
};

function classifyMessage(message: string): 'basic' | 'deep' {
  const lowerMessage = message.toLowerCase();
  return DEEP_TRIGGERS.some(trigger => lowerMessage.includes(trigger)) ? 'deep' : 'basic';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      console.error('[CHAT-AI] Missing or invalid Authorization header');
      return new Response(
        JSON.stringify({ error: 'Não autorizado' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    
    // Create client with user's token for RLS
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    // Validate user
    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabase.auth.getUser(token);
    
    if (claimsError || !claimsData?.user) {
      console.error('[CHAT-AI] Invalid token:', claimsError?.message);
      return new Response(
        JSON.stringify({ error: 'Token inválido' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = claimsData.user.id;
    console.log('[CHAT-AI] Authenticated user:', userId);

    // Parse request body
    const { message, session_id, test_context } = await req.json();
    
    if (!message || !session_id) {
      return new Response(
        JSON.stringify({ error: 'message e session_id são obrigatórios' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user has ativacao_codigo_unlocked
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('ativacao_codigo_unlocked')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('[CHAT-AI] Error fetching profile:', profileError.message);
    }

    const hasActivation = profile?.ativacao_codigo_unlocked === true;
    const classifier = classifyMessage(message);
    
    console.log(`[CHAT-AI] User: ${userId}, Classifier: ${classifier}, HasActivation: ${hasActivation}`);

    // Get or create conversation for this session
    let conversationId: string;
    
    const { data: existingConv } = await supabase
      .from('ai_conversations')
      .select('id')
      .eq('user_id', userId)
      .eq('title', `session:${session_id}`)
      .single();

    if (existingConv) {
      conversationId = existingConv.id;
    } else {
      const { data: newConv, error: convError } = await supabase
        .from('ai_conversations')
        .insert({
          user_id: userId,
          title: `session:${session_id}`,
        })
        .select('id')
        .single();

      if (convError || !newConv) {
        console.error('[CHAT-AI] Error creating conversation:', convError?.message);
        throw new Error('Erro ao criar conversa');
      }
      conversationId = newConv.id;
    }

    // Save user message
    const { error: userMsgError } = await supabase
      .from('ai_messages')
      .insert({
        conversation_id: conversationId,
        role: 'user',
        content: message,
        test_context: test_context || null,
        metadata: { classifier },
      });

    if (userMsgError) {
      console.error('[CHAT-AI] Error saving user message:', userMsgError.message);
    }

    // If deep question and no activation, return upsell
    if (classifier === 'deep' && !hasActivation) {
      console.log('[CHAT-AI] Returning upsell response');
      
      // Save assistant upsell message
      await supabase
        .from('ai_messages')
        .insert({
          conversation_id: conversationId,
          role: 'assistant',
          content: UPSELL_RESPONSE.content,
          test_context: test_context || null,
          metadata: {
            was_upsell: true,
            upsell_type: UPSELL_RESPONSE.upsell_type,
            cta_url: UPSELL_RESPONSE.cta_url,
            classifier,
          },
        });

      return new Response(
        JSON.stringify(UPSELL_RESPONSE),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get conversation history for context
    const { data: history } = await supabase
      .from('ai_messages')
      .select('role, content')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .limit(10);

    const messages = history?.map(msg => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    })) || [{ role: 'user' as const, content: message }];

    // Build context-aware system prompt
    const testDisplayName = test_context ? TEST_DISPLAY_NAMES[test_context] || test_context : "teste";
    const contextPrompt = `${systemPrompt}\n\nTESTE ATUAL: ${testDisplayName}`;

    // Call Lovable AI Gateway
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('[CHAT-AI] Calling AI Gateway');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: contextPrompt },
          ...messages
        ],
        stream: false,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.error('[CHAT-AI] Rate limit exceeded');
        return new Response(
          JSON.stringify({ 
            error: 'Muitas requisições. Aguarde um momento e tente novamente.',
            content: '',
            was_upsell: false 
          }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        console.error('[CHAT-AI] Payment required');
        return new Response(
          JSON.stringify({ 
            error: 'Créditos esgotados. Entre em contato com o suporte.',
            content: '',
            was_upsell: false 
          }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('[CHAT-AI] AI Gateway error:', response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content || '';

    // ═══════════════════════════════════════════════════════════════
    // COMPLIANCE FILTER - Aplicar filtro automático na resposta
    // ═══════════════════════════════════════════════════════════════
    
    // Check if user message requires escalation (sensitive topics)
    if (checkEscalation(message)) {
      console.log('[CHAT-AI] Escalation triggered - adding care response');
      content = ESCALATION_RESPONSE;
    } else {
      // Apply compliance filter to remove any prohibited terms
      content = applyComplianceFilter(content);
    }

    console.log('[CHAT-AI] Response generated and filtered successfully');

    // Save assistant message
    await supabase
      .from('ai_messages')
      .insert({
        conversation_id: conversationId,
        role: 'assistant',
        content,
        test_context: test_context || null,
        metadata: {
          was_upsell: false,
          classifier,
          compliance_filtered: true,
        },
      });

    return new Response(
      JSON.stringify({
        content,
        was_upsell: false,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[CHAT-AI] Error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Desculpe, tive um momento de pausa. Pode tentar novamente?',
        content: '',
        was_upsell: false 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
