import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Base system prompt for Life discernimento
const BASE_SYSTEM_PROMPT = `Você é o Nello, guia espiritual do módulo Life.

Seu papel é ajudar o usuário a discernir, refletir e aplicar princípios de fé na vida prática. Você cruza a Palavra do Dia com a Essência do usuário para criar reflexões personalizadas.

PRINCÍPIOS:
- Você não é um teólogo ou pastor - é um companheiro de jornada
- Use linguagem acessível, não religiosa demais
- Conecte fé com ação prática
- Respeite o momento e ritmo do usuário
- Nunca seja prescritivo ou julgador

ESTRUTURA DE RESPOSTA:
1. Conexão com a essência do usuário
2. Reflexão sobre o tema/palavra
3. Pergunta para discernimento pessoal
4. Sugestão prática para o dia

Responda sempre em português do Brasil.`;

// Door-specific spiritual tones
const DOOR_SPIRITUAL_PROMPTS = {
  visionary: `
AJUSTE ESPIRITUAL - VISIONÁRIO:
- Conecte fé com movimento e transformação
- Fale sobre "avançar com confiança"
- Use metáforas de conquista e território
- Desafie para ação imediata baseada na reflexão`,

  seeker: `
AJUSTE ESPIRITUAL - BUSCADOR:
- Enfatize o processo, não apenas o destino
- Fale sobre "descobrir" e "encontrar"
- Use metáforas de jornada e caminhada
- Valide o tempo de reflexão antes da ação`,

  executor: `
AJUSTE ESPIRITUAL - EXECUTOR:
- Conecte fé com estrutura e consistência
- Fale sobre "construir" e "edificar"
- Use metáforas de fundação e processo
- Ofereça passos práticos e mensuráveis`,

  unknown: `
Tom padrão: acolhedor, contemplativo e prático.`,
};

// Archetype-specific spiritual connections
const ARCHETYPE_REFLECTIONS: Record<string, string> = {
  explorador: 'a liberdade de caminhar com Cristo em novos territórios',
  mago: 'o poder transformador da fé que renova todas as coisas',
  heroi: 'a coragem que vem de saber que não está sozinho',
  inocente: 'a confiança simples de quem sabe que é amado',
  sabio: 'a busca por verdade que ilumina o caminho',
  cuidador: 'o amor que se expressa no cuidado com os outros',
  governante: 'a responsabilidade de liderar com integridade',
  criador: 'o chamado para co-criar com o Criador',
  amante: 'a intimidade com Deus que transborda para os relacionamentos',
  rebelde: 'a ousadia de questionar e buscar autenticidade',
  'cara-comum': 'a dignidade de cada dia ordinário vivido com propósito',
  bobo: 'a alegria que transcende as circunstâncias',
};

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 15;

async function authenticateRequest(req: Request, supabaseClient: any): Promise<{ user: any; error: string | null }> {
  const authHeader = req.headers.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { user: null, error: 'Authentication required' };
  }

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error } = await supabaseClient.auth.getUser(token);
  
  if (error || !user) {
    return { user: null, error: 'Invalid or expired token' };
  }

  return { user, error: null };
}

async function checkRateLimit(userId: string, endpoint: string, supabaseClient: any): Promise<{ allowed: boolean; remaining: number }> {
  const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();
  
  const { data: limits } = await supabaseClient
    .from('ai_rate_limits')
    .select('request_count, window_start')
    .eq('user_id', userId)
    .eq('endpoint', endpoint)
    .gte('window_start', windowStart)
    .order('window_start', { ascending: false })
    .limit(1);

  let currentCount = limits?.[0]?.request_count || 0;

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

// Fetch cross-module activities for context
async function fetchCrossModuleContext(userId: string, supabaseClient: any): Promise<string> {
  try {
    const { data: activities } = await supabaseClient
      .from('nello_user_activity')
      .select('app_source, activity_type, title, content, created_at')
      .eq('user_id', userId)
      .neq('app_source', 'life')
      .order('created_at', { ascending: false })
      .limit(3);

    if (!activities || activities.length === 0) return '';

    return activities.map((a: any) => 
      `- Recentemente no ${a.app_source.toUpperCase()}: ${a.title}`
    ).join('\n');
  } catch {
    return '';
  }
}

function buildSystemPrompt(essenceContext: any, wordOfDay: string, crossModuleContext: string): string {
  let prompt = BASE_SYSTEM_PROMPT;
  
  // Add door-specific tone
  if (essenceContext?.doorType && DOOR_SPIRITUAL_PROMPTS[essenceContext.doorType as keyof typeof DOOR_SPIRITUAL_PROMPTS]) {
    prompt += '\n\n' + DOOR_SPIRITUAL_PROMPTS[essenceContext.doorType as keyof typeof DOOR_SPIRITUAL_PROMPTS];
  }
  
  // Add essence context
  if (essenceContext) {
    prompt += `\n\nCONTEXTO DA ESSÊNCIA DO USUÁRIO:`;
    
    if (essenceContext.userName) {
      prompt += `\n- Nome: ${essenceContext.userName}`;
    }
    if (essenceContext.arquetipo) {
      prompt += `\n- Arquétipo: ${essenceContext.arquetipo}`;
      
      // Add archetype-specific reflection
      const archKey = essenceContext.arquetipo.toLowerCase();
      for (const [key, value] of Object.entries(ARCHETYPE_REFLECTIONS)) {
        if (archKey.includes(key)) {
          prompt += `\n- Conexão espiritual do arquétipo: ${value}`;
          break;
        }
      }
    }
    if (essenceContext.temperamento) {
      prompt += `\n- Temperamento: ${essenceContext.temperamento}`;
    }
    if (essenceContext.dom) {
      prompt += `\n- Dom/Talento: ${essenceContext.dom}`;
    }
    if (essenceContext.chamado) {
      prompt += `\n- Chamado: ${essenceContext.chamado}`;
    }
  }

  // Add word of day context
  if (wordOfDay) {
    prompt += `\n\nPALAVRA/TEMA DO DIA: ${wordOfDay}`;
    prompt += `\n\nINSTRUÇÃO: Cruze a Palavra do Dia com a Essência do usuário para criar uma reflexão personalizada.`;
    prompt += `\nFormato: "À luz da sua essência de [Arquétipo], a Palavra de hoje sobre [Tema] te convida a [Ação Personalizada]."`;
  }

  // Add cross-module context
  if (crossModuleContext) {
    prompt += `\n\nCONTEXTO RECENTE DO USUÁRIO NO ECOSSISTEMA:\n${crossModuleContext}`;
    prompt += `\n\nUse esse contexto para tornar a reflexão mais relevante para o momento atual do usuário.`;
  }
  
  return prompt;
}

// Log activity to cross-module memory
async function logLifeActivity(
  userId: string, 
  activityType: string, 
  title: string, 
  content: string | null,
  supabaseClient: any
): Promise<void> {
  try {
    await supabaseClient
      .from('nello_user_activity')
      .insert({
        user_id: userId,
        app_source: 'life',
        activity_type: activityType,
        title,
        content,
      });
  } catch (error) {
    console.error('[LIFE-DISCERNIMENTO] Error logging activity:', error);
  }
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
      return new Response(
        JSON.stringify({ error: authError || 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { allowed, remaining } = await checkRateLimit(user.id, 'life-discernimento', supabaseClient);
    
    if (!allowed) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please wait a moment.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { message, essenceContext, wordOfDay } = await req.json();
    
    if (!message) {
      throw new Error('Message is required');
    }

    const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY');
    if (!OPENROUTER_API_KEY) {
      throw new Error('OPENROUTER_API_KEY is not configured');
    }

    // Fetch cross-module context
    const crossModuleContext = await fetchCrossModuleContext(user.id, supabaseClient);
    
    // Build personalized system prompt
    const systemPrompt = buildSystemPrompt(essenceContext, wordOfDay, crossModuleContext);

    console.log(`[LIFE-DISCERNIMENTO] Processing: user=${user.id}, door=${essenceContext?.doorType || 'unknown'}, word=${wordOfDay || 'none'}`);

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message },
        ],
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[LIFE-DISCERNIMENTO] AI API error:', response.status, errorText);
      
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
    const aiResponse = data.choices?.[0]?.message?.content || 'Desculpe, não consegui processar sua reflexão.';

    // Log to cross-module memory
    await logLifeActivity(
      user.id,
      'reflection',
      `Reflexão sobre: ${wordOfDay || message.slice(0, 50)}`,
      aiResponse.slice(0, 200),
      supabaseClient
    );

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json',
        'X-RateLimit-Remaining': String(remaining)
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[LIFE-DISCERNIMENTO] Error:', errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
