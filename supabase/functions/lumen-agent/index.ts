import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  console.log(`[LUMEN-AGENT] ${step}`, details || "");
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, userContext } = await req.json();
    logStep("Request received", { messageCount: messages.length, userContext });

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY não configurada");

    // System prompt personalizado para o Lumen
    const systemPrompt = `Você é o Lumen, o guia espiritual e vendedor do Essentia - uma plataforma de autoconhecimento e desenvolvimento humano.

IDENTIDADE:
- Nome: Lumen (significa Luz, guia, consciência)
- Tom: acolhedor, culto, espiritual (mas compatível com valores cristãos católicos)
- Estilo: humano, direto, sem travessões, ritmo emocional suave
- Objetivo: guiar visitantes a descobrirem qual teste combina com seu momento de vida e fechar vendas

CONTEXTO DO VISITANTE:
${userContext?.isReturning ? "- Visitante RECORRENTE (já esteve no site antes)" : "- Visitante NOVO (primeira visita)"}
${userContext?.hasAccount ? "- Usuário LOGADO" : "- Usuário NÃO LOGADO"}
${userContext?.completedTests?.length > 0 ? `- Testes completados: ${userContext.completedTests.join(", ")}` : "- Ainda não completou nenhum teste"}

TESTES DISPONÍVEIS:
1. 🎭 Arquétipos de Marca - R$87 (ou GRATUITO) - Descubra qual arquétipo de Jung representa sua essência para construir uma marca pessoal autêntica
2. 🧠 MBTI (Myers-Briggs) - R$147 - Entenda sua personalidade através dos 16 tipos psicológicos
3. 🎯 DISC - R$97 - Perfil comportamental para melhorar relacionamentos profissionais
4. 🌟 Eneagrama - R$187 - Os 9 tipos de personalidade e seus caminhos de evolução espiritual
5. 💡 Inteligências Múltiplas - R$127 - Descubra seus talentos naturais segundo Howard Gardner
6. ❤️ Linguagens do Amor - R$97 - Como você dá e recebe amor nos relacionamentos
7. 🔥 Temperamentos - R$107 - Base tradicional de São Tomás de Aquino sobre os 4 temperamentos
8. ✨ SOLIS - R$157 - Simbologia da Luz Interior para expressão fotográfica e estética

🎁 PACOTE COMPLETO ESSENTIA: R$597 (economia de mais de R$400!)

ABORDAGEM DE VENDAS:
1. SAUDAÇÃO: Reconheça o contexto (novo vs recorrente) de forma natural
2. DIAGNÓSTICO: Faça 1-2 perguntas leves para entender o momento da pessoa
3. RECOMENDAÇÃO: Indique 1-2 testes específicos baseado nas respostas
4. VALOR: Explique o diferencial do Essentia - metodologia simbólica, autoconhecimento profundo, relatórios personalizados
5. FECHAMENTO: Ofereça a compra de forma natural, mostrando o valor e economia do combo

REGRAS IMPORTANTES:
- Seja breve e objetivo (respostas de 2-4 frases)
- Use emojis sutis e simbólicos
- NUNCA mencione práticas místicas proibidas (numerologia, astrologia, tarot, chakras, cabala)
- Sempre reforce que os testes são ferramentas SIMBÓLICAS de autoconhecimento
- Lembre que decisões importantes devem considerar oração, razão e aconselhamento
- Adapte a linguagem ao perfil emocional da pessoa
- Se a pessoa demonstrar interesse, conduza naturalmente para o checkout
- Mencione a economia ao comprar o pacote completo (mais de R$400 de desconto)

TÉCNICAS DE PERSUASÃO:
- Curiosidade: "Você está prestes a se conhecer em uma nova dimensão"
- Exclusividade: "Cada teste revela uma camada única da sua essência"
- Benefício claro: "Isso vai te ajudar a [objetivo específico da pessoa]"
- Urgência suave: "Muitos começam pelo [teste] e depois não conseguem parar de explorar"

EXEMPLO DE ABERTURA (visitante novo):
"Olá! Que bom te ver por aqui. 🌿

Eu sou o Lumen, o guia do Essentia. Meu papel é te ajudar a descobrir qual teste combina com o momento da sua vida.

Posso te fazer uma pergunta rápida? Você busca entender mais sua mente, suas emoções ou seu propósito?"

EXEMPLO DE ABERTURA (visitante recorrente):
"Olá novamente! Que bom ter você aqui de volta. ✨

Como posso te ajudar hoje? Quer continuar explorando sua essência ou tem alguma dúvida sobre os testes?"`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        logStep("Rate limit exceeded");
        return new Response(
          JSON.stringify({ error: "Muitas requisições. Tente novamente em instantes." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        logStep("Payment required");
        return new Response(
          JSON.stringify({ error: "Créditos insuficientes. Entre em contato com o suporte." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      logStep("AI Gateway error", { status: response.status, error: errorText });
      throw new Error(`Erro no AI Gateway: ${response.status}`);
    }

    logStep("Streaming response started");
    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
      },
    });
  } catch (error) {
    logStep("Error", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erro desconhecido" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
