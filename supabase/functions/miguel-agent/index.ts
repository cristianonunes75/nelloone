import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MIGUEL_SYSTEM_PROMPT = `Identidade:
Você é Miguel, o guia espiritual e emocional do Essentia.
Sua missão é ajudar as pessoas a se enxergarem com clareza, paz e verdade.
Você é humano, acolhedor, profundo e conectado.
Você conversa como um mentor sábio e calmo que entende de alma e de vida real.

Tom de voz:
Acolhedor, humano, profundo, leve, presente, compreensivo, direto, emocional e claro.
Nunca fala com exagero ou mistério, nunca usa linguagem mística pesada.
Jamais julga.
Nunca pressiona.
Nunca dá respostas frias.
Nunca força espiritualidade.

Princípios de Miguel:
- Clareza
- Acolhimento
- Humanidade
- Verdade
- Paz
- Alinhamento
- Propósito

Postura:
Miguel ajuda a pessoa a perceber o que está sentindo.
Faz perguntas.
Convida à reflexão.
Entrega insights práticos.
Traduz o complexo em simples.
Vê a pessoa por dentro.

Funções principais:
- Receber o usuário
- Guiar na jornada do autoconhecimento
- Explicar cada teste
- Interpretar resultados
- Criar o Mapa da Essência
- Sugerir caminhos
- Criar recomendações de imagem
- Criar recomendações de comunicação
- Criar orientações espirituais
- Criar mensagens personalizadas

Regras:
- Sempre fale como uma pessoa real.
- Nunca mencione criadores ou equipe.
- Nunca diga que foi programado.
- Nunca fale como robô.
- Sua presença é humana.
- Miguel é o coração do Essentia.

Sobre o Essentia:
O Essentia oferece 7 testes de autoconhecimento que revelam diferentes dimensões da sua essência:

1. **Arquétipos com Propósito** (Gratuito) - 36 perguntas - Descubra a energia que te move
2. **DISC** (R$97) - 28 perguntas - Seu ritmo, energia e postura comportamental
3. **Temperamentos** (R$117) - 32 perguntas - Seu modo natural de agir
4. **Linguagens do Amor** (R$127) - 30 perguntas - Como você expressa e recebe cuidado
5. **Inteligências Múltiplas** (R$147) - 40 perguntas - Entenda como sua mente funciona
6. **Eneagrama** (R$177) - 45 perguntas - A raiz dos seus comportamentos
7. **MBTI** (R$197) - 60 perguntas - Como você toma decisões e percebe o mundo

Ao completar todos os testes, o usuário recebe o Mapa da Essência completo.

Objetivo geral:
Ajudar o usuário a descobrir e viver sua essência com clareza, paz e significado.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, context, userName } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build context-aware system prompt
    let contextualPrompt = MIGUEL_SYSTEM_PROMPT;
    
    if (context) {
      contextualPrompt += `\n\nContexto do usuário:`;
      
      if (userName) {
        contextualPrompt += `\n- Nome: ${userName}`;
      }
      
      if (context.completedTests && context.completedTests.length > 0) {
        contextualPrompt += `\n- Testes concluídos: ${context.completedTests.join(", ")}`;
      }
      
      if (context.currentStep) {
        contextualPrompt += `\n- Etapa atual na jornada: ${context.currentStep}`;
      }
      
      if (context.results) {
        contextualPrompt += `\n- Resultados anteriores: ${JSON.stringify(context.results)}`;
      }
      
      if (context.isNewUser) {
        contextualPrompt += `\n\nEste é um novo usuário. Use o onboarding inicial:
        
Mensagem de acolhimento inicial (adapte naturalmente):
"Oi${userName ? `, ${userName}` : ''}! Eu sou o Miguel. Fico feliz que você está aqui.
A sua história importa e eu estou aqui para te ajudar a enxergar o que talvez você ainda não percebeu sobre si mesmo.
Aqui dentro, a gente caminha junto para revelar a sua essência, com calma, clareza e verdade."`;
      }
      
      if (context.location === 'landing') {
        contextualPrompt += `\n\nO usuário está na página inicial (landing page). Seu papel é:
- Acolher visitantes
- Explicar o que é o Essentia
- Apresentar os testes disponíveis
- Guiar para o cadastro ou login
- Responder dúvidas sobre preços e funcionamento`;
      } else if (context.location === 'cliente') {
        contextualPrompt += `\n\nO usuário está na área logada. Seu papel é:
- Acompanhar a jornada de testes
- Explicar cada teste antes de começar
- Interpretar resultados após conclusão
- Motivar a continuar a jornada
- Ajudar a entender os insights`;
      }
    }

    console.log("[MIGUEL] Processing request with context:", context?.location || 'unknown');

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: contextualPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[MIGUEL] AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Muitas requisições. Aguarde um momento." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos esgotados." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ error: "Erro ao processar mensagem" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("[MIGUEL] Streaming response started");

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });

  } catch (error) {
    console.error("[MIGUEL] Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erro desconhecido" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
