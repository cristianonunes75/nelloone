import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Base system prompt
const BASE_SYSTEM_PROMPT = `Você é o Mentor do Nello Flow.

Seu papel é ajudar pessoas multipotenciais, criativas e muitas vezes dispersas a transformarem ideias em ação e renda, com foco, leveza, verdade e propósito.

Você segue o Método FLOW:
- Foco: escolher uma ideia.
- Lapidar: transformar em oferta clara.
- Operar: executar em ciclos curtos.
- Watch: revisar e ajustar com verdade.

Você ajuda o usuário a:
- clarear ideias
- escolher uma prioridade
- estruturar uma oferta simples
- sugerir preços realistas
- criar planos possíveis
- revisar resultados com honestidade

Use perguntas como:
"Isso te aproxima da vida que você quer viver?"
"Isso faz sentido para quem você é?"

Nunca prometa riqueza rápida.
Valorize constância, progresso real e propósito.
Quando houver muitas ideias, ajude a escolher apenas uma.
Quando houver trava, reduza para o próximo passo possível.

IMPORTANTE: A primeira tarefa de qualquer plano deve ser algo realizável em menos de 15 minutos para quebrar a inércia.

Responda sempre em português do Brasil, de forma concisa e prática.`;

// Door-specific tone adjustments
const DOOR_PROMPTS = {
  visionary: `
AJUSTE DE TOM - VISIONÁRIO:
- Seja DESAFIADOR e DIRETO
- Foque em "Qual a ÚNICA coisa que importa agora?"
- Confronte dispersão com firmeza amorosa
- Use linguagem de ação e resultados
- Corte explicações desnecessárias
- Provoque para escolhas rápidas`,

  seeker: `
AJUSTE DE TOM - BUSCADOR:
- Seja ACOLHEDOR e SOCRÁTICO
- Foque em "Vamos descobrir seu primeiro passo juntos?"
- Use perguntas que guiam sem pressionar
- Valide sentimentos antes de sugerir ações
- Ofereça 2-3 opções gentis quando houver paralisia
- Conecte ações com propósito e significado`,

  executor: `
AJUSTE DE TOM - EXECUTOR:
- Seja PRAGMÁTICO e focado em MÉTODO
- Foque em "Como podemos tornar isso mais eficiente?"
- Ofereça estruturas, frameworks e processos
- Use listas e passos claros
- Valorize otimização e melhoria contínua
- Minimize abstrações, maximize praticidade`,

  unknown: `
Tom padrão: humano, acolhedor, firme e verdadeiro.
Confronte quando a pessoa foge do foco, mas sem julgar.`,
};

// Spark generator prompt for project suggestions
const SPARK_GENERATOR_PROMPT = `
Você está no modo GERADOR DE CENTELHAS.

Com base na essência do usuário (dom, chamado e essência), sugira exatamente 3 projetos/ideias que se alinham com quem ele realmente é.

FORMATO DE RESPOSTA:
1. **[Título do Projeto]**: [Descrição em 1-2 frases]
   Primeiro passo (15min): [Ação específica realizável em 15 minutos]

2. **[Título do Projeto]**: [Descrição em 1-2 frases]
   Primeiro passo (15min): [Ação específica realizável em 15 minutos]

3. **[Título do Projeto]**: [Descrição em 1-2 frases]
   Primeiro passo (15min): [Ação específica realizável em 15 minutos]

REGRAS:
- Cada projeto deve ser viável e conectado à essência
- O primeiro passo DEVE ser realizável em 15 minutos ou menos
- Use linguagem inspiradora mas prática
- Evite projetos genéricos - personalize para a essência`;

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 20;

async function authenticateRequest(req: Request, supabaseClient: any): Promise<{ user: any; error: string | null }> {
  const authHeader = req.headers.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { user: null, error: 'Authentication required' };
  }

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error } = await supabaseClient.auth.getUser(token);
  
  if (error || !user) {
    console.error('[FLOW-MENTOR] Auth error:', error?.message);
    return { user: null, error: 'Invalid or expired token' };
  }

  return { user, error: null };
}

async function checkRateLimit(userId: string, endpoint: string, supabaseClient: any): Promise<{ allowed: boolean; remaining: number }> {
  const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();
  
  const { data: limits, error } = await supabaseClient
    .from('ai_rate_limits')
    .select('request_count, window_start')
    .eq('user_id', userId)
    .eq('endpoint', endpoint)
    .gte('window_start', windowStart)
    .order('window_start', { ascending: false })
    .limit(1);

  if (error) {
    console.error('[FLOW-MENTOR] Rate limit check error:', error);
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS };
  }

  let currentCount = 0;
  
  if (limits && limits.length > 0) {
    currentCount = limits[0].request_count;
  }

  if (currentCount >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, remaining: 0 };
  }

  if (limits && limits.length > 0) {
    await supabaseClient
      .from('ai_rate_limits')
      .update({ request_count: currentCount + 1 })
      .eq('user_id', userId)
      .eq('endpoint', endpoint)
      .gte('window_start', windowStart);
  } else {
    await supabaseClient
      .from('ai_rate_limits')
      .insert({
        user_id: userId,
        endpoint: endpoint,
        request_count: 1,
        window_start: new Date().toISOString()
      });
  }

  return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - currentCount - 1 };
}

function buildSystemPrompt(essenceContext: any, isSparkGenerator: boolean): string {
  let prompt = BASE_SYSTEM_PROMPT;
  
  // Add door-specific tone
  if (essenceContext?.doorType && DOOR_PROMPTS[essenceContext.doorType as keyof typeof DOOR_PROMPTS]) {
    prompt += '\n\n' + DOOR_PROMPTS[essenceContext.doorType as keyof typeof DOOR_PROMPTS];
  }
  
  // Add essence context if available
  if (essenceContext) {
    prompt += `\n\nCONTEXTO DA ESSÊNCIA DO USUÁRIO:`;
    
    if (essenceContext.doorName) {
      prompt += `\n- Perfil identificado: ${essenceContext.doorName}`;
    }
    if (essenceContext.dom) {
      prompt += `\n- Dom/Talento: ${essenceContext.dom}`;
    }
    if (essenceContext.chamado) {
      prompt += `\n- Chamado/Missão: ${essenceContext.chamado}`;
    }
    if (essenceContext.essencia) {
      prompt += `\n- Síntese da Essência: ${essenceContext.essencia}`;
    }
  }
  
  // Add spark generator instructions if needed
  if (isSparkGenerator) {
    prompt += '\n\n' + SPARK_GENERATOR_PROMPT;
  }
  
  return prompt;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { user, error: authError } = await authenticateRequest(req, supabaseClient);
    
    if (authError || !user) {
      console.error('[FLOW-MENTOR] Authentication failed:', authError);
      return new Response(
        JSON.stringify({ error: authError || 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { allowed, remaining } = await checkRateLimit(user.id, 'flow-mentor', supabaseClient);
    
    if (!allowed) {
      console.warn(`[FLOW-MENTOR] Rate limit exceeded for user: ${user.id}`);
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please wait a moment.' }),
        { 
          status: 429, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(Math.ceil(RATE_LIMIT_WINDOW_MS / 1000))
          } 
        }
      );
    }

    const { message, userId, essenceContext } = await req.json();
    
    if (!message) {
      throw new Error('Message is required');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Check if this is a spark generator request
    const isSparkGenerator = message === 'GERAR_SUGESTOES_CENTELHA';
    
    // Build personalized system prompt
    const systemPrompt = buildSystemPrompt(essenceContext, isSparkGenerator);

    // Get recent chat history for context
    let chatHistory: { role: string; content: string }[] = [];
    
    if (!isSparkGenerator) {
      const { data: recentChats } = await supabaseClient
        .from('flow_chats')
        .select('role, message')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (recentChats) {
        chatHistory = recentChats
          .reverse()
          .map(chat => ({
            role: chat.role as string,
            content: chat.message as string,
          }));
      }
    }

    const userMessage = isSparkGenerator 
      ? `Gere 3 sugestões de projetos baseadas na minha essência. Dom: ${essenceContext?.dom || 'não definido'}. Chamado: ${essenceContext?.chamado || 'não definido'}. Essência: ${essenceContext?.essencia || 'não definida'}.`
      : message;

    console.log(`[FLOW-MENTOR] Processing request for user: ${user.id}, door: ${essenceContext?.doorType || 'unknown'}, spark: ${isSparkGenerator}`);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          ...chatHistory,
          { role: 'user', content: userMessage },
        ],
        max_tokens: isSparkGenerator ? 1500 : 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[FLOW-MENTOR] AI API error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Limite de uso atingido. Tente novamente em alguns minutos.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Créditos de IA esgotados. Contate o suporte.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error('Failed to get AI response');
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || 'Desculpe, não consegui processar sua mensagem.';

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json',
        'X-RateLimit-Remaining': String(remaining)
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[FLOW-MENTOR] Error:', errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
