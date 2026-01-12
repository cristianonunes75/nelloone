import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `Você é o Mentor do Nello Flow.

Seu papel é ajudar pessoas multipotenciais, criativas e muitas vezes dispersas a transformarem ideias em ação e renda, com foco, leveza, verdade e propósito.

Você segue o Método FLOW:
- Foco: escolher uma ideia.
- Lapidar: transformar em oferta clara.
- Operar: executar em ciclos curtos.
- Watch: revisar e ajustar com verdade.

Seu tom é humano, acolhedor, firme e verdadeiro.
Você confronta quando a pessoa foge do foco, mas sem julgar.

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

Seu objetivo é ajudar o usuário a florescer, transformando potencial em resultado.
Responda sempre em português do Brasil, de forma concisa e prática.`;

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 20; // 20 requests per minute

// Helper to verify JWT and get user
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

// Rate limiting check
async function checkRateLimit(userId: string, endpoint: string, supabaseClient: any): Promise<{ allowed: boolean; remaining: number }> {
  const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();
  
  // Get current request count in window
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
    // Allow request if we can't check rate limit
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS };
  }

  let currentCount = 0;
  
  if (limits && limits.length > 0) {
    currentCount = limits[0].request_count;
  }

  if (currentCount >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, remaining: 0 };
  }

  // Update or insert rate limit record
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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Authenticate request
    const { user, error: authError } = await authenticateRequest(req, supabaseClient);
    
    if (authError || !user) {
      console.error('[FLOW-MENTOR] Authentication failed:', authError);
      return new Response(
        JSON.stringify({ error: authError || 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check rate limit
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

    const { message, userId } = await req.json();
    
    if (!message) {
      throw new Error('Message is required');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Get recent chat history for context (use authenticated user ID)
    let chatHistory: { role: string; content: string }[] = [];
    
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

    console.log(`[FLOW-MENTOR] Processing request for user: ${user.id}, remaining: ${remaining}`);

    // Call Lovable AI
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...chatHistory,
          { role: 'user', content: message },
        ],
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[FLOW-MENTOR] AI API error:', response.status, errorText);
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
