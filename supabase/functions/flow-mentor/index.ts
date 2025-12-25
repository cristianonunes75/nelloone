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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId } = await req.json();
    
    if (!message) {
      throw new Error('Message is required');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Get recent chat history for context
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    let chatHistory: { role: string; content: string }[] = [];
    
    if (userId) {
      const { data: recentChats } = await supabaseClient
        .from('flow_chats')
        .select('role, message')
        .eq('user_id', userId)
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
      console.error('AI API error:', response.status, errorText);
      throw new Error('Failed to get AI response');
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || 'Desculpe, não consegui processar sua mensagem.';

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error in flow-mentor:', errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
