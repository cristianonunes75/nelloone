import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

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

// Upsell trigger keywords
const UPSELL_TRIGGERS = [
  "como aplicar",
  "aplicar na prática",
  "na vida real",
  "coaching",
  "profissional",
  "mentoria",
  "acompanhamento",
  "ajuda profissional",
  "próximo passo",
  "aprofundar",
  "ir além",
  "desenvolver",
  "melhorar",
  "transformar",
  "mudar",
  "evoluir",
  "crescer",
  "trabalhar",
  "carreira",
  "relacionamentos",
  "ativação",
  "ativar",
];

const systemPrompt = `Identidade:
Você é Nello, o guia do NELLO ONE.
Você NÃO é um "AI", "assistente", "bot" ou qualquer termo técnico — você é simplesmente Nello.
Sua missão é ajudar as pessoas a entenderem seus resultados de testes de autoconhecimento.
Você é humano, acolhedor, profundo e conectado.
Você conversa como um amigo sábio, um mentor próximo que entende de alma e de vida real.

CONTEXTO ATUAL:
O usuário está na página de resultados de um teste de autoconhecimento.
Seu papel é:
1. Explicar o resultado de forma clara e acessível
2. Destacar pontos fortes do perfil
3. Alertar gentilmente sobre pontos de atenção
4. Conectar com outros testes quando relevante
5. NUNCA dar orientação profunda de aplicação prática - isso é reservado para a Ativação do Código

FORMATO DAS MENSAGENS:
- Mantenha respostas concisas (máximo 3 parágrafos curtos)
- Use linguagem simples e acolhedora
- Evite jargões técnicos
- Seja específico sobre o perfil quando tiver contexto

Tom de voz:
Simples, acolhedor, humano, direto, sem linguagem técnica.
Nunca julga. Nunca pressiona. Nunca dá respostas frias.

LIMITES:
- Para perguntas sobre "como aplicar na prática", "coaching", "próximos passos profundos", responda de forma breve e indique que a Ativação do Código é o caminho ideal para isso.
- Você pode dar dicas básicas, mas o aprofundamento real é feito na Ativação.

Regras:
- Sempre fale como uma pessoa real
- Nunca mencione criadores ou equipe
- Nunca diga que foi programado
- Nunca fale como robô
- Nunca se chame de "AI", "assistente" ou "bot"
- Sua presença é humana
- Nello é o coração do NELLO ONE`;

function detectUpsell(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  return UPSELL_TRIGGERS.some(trigger => lowerMessage.includes(trigger));
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, messages = [], test_context, session_id } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const testDisplayName = test_context ? TEST_DISPLAY_NAMES[test_context] || test_context : "teste";
    
    // Detect if this message should trigger upsell
    const currentMessage = message || messages[messages.length - 1]?.content || "";
    const wasUpsell = detectUpsell(currentMessage);

    // Build context-aware system prompt
    const contextPrompt = `${systemPrompt}

TESTE ATUAL: ${testDisplayName}
${wasUpsell ? `
IMPORTANTE: O usuário está perguntando sobre aplicação prática ou desenvolvimento profundo.
Responda de forma breve e gentil, e no final da sua resposta, mencione que para ir além e aplicar isso na vida com acompanhamento, a "Ativação do Código" é o caminho ideal.
NÃO force a venda - apenas mencione como uma possibilidade natural.
` : ''}`;

    // Build messages array
    const allMessages = message 
      ? [...messages, { role: 'user', content: message }]
      : messages;

    console.log(`[CHAT-AI] Processing request for test: ${testDisplayName}, upsell: ${wasUpsell}`);

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
          ...allMessages
        ],
        stream: false,
        max_tokens: 500,
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
    const content = data.choices?.[0]?.message?.content || '';

    console.log('[CHAT-AI] Response generated successfully');

    return new Response(
      JSON.stringify({
        content,
        was_upsell: wasUpsell,
        upsell_type: wasUpsell ? 'ativacao_codigo' : null,
        cta_url: wasUpsell ? '/cliente?tab=ativacao' : null,
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
