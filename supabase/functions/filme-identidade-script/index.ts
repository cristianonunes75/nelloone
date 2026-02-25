import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sections, userName } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Build context from user's Código da Essência
    let essenceContext = "";
    if (sections && Array.isArray(sections)) {
      for (const section of sections) {
        if (section.content) {
          const content = typeof section.content === "string"
            ? section.content
            : JSON.stringify(section.content);
          if (content.length > 10) {
            essenceContext += `\n### ${section.title || section.id}:\n${content.slice(0, 500)}\n`;
          }
        }
      }
    }

    const systemPrompt = `Você é um roteirista de documentários pessoais. Sua tarefa é criar uma narração cinematográfica profunda e personalizada sobre a identidade de uma pessoa, baseada nos dados do seu Código da Essência.

REGRAS ABSOLUTAS:
- A narração deve soar como um documentário sobre a vida do usuário
- Fale diretamente com o usuário usando "você"
- NUNCA use termos como "diagnóstico", "perfil", "análise", "teste", "avaliação"
- Use linguagem poética, humana, profunda e acolhedora
- Transforme dados técnicos (DISC, temperamento, arquétipos) em narrativa humana
- O usuário deve sentir que alguém contou SUA história
- A narração deve ter entre 250 e 350 palavras (60-90 segundos de fala)
- Mencione padrões reais e comportamentos específicos do código
- Termine com a frase exata: "Você não acabou de descobrir quem é. Você apenas se lembrou."

ESTRUTURA DA NARRAÇÃO:
1. Abertura: reconhecimento de algo que o usuário sempre sentiu (15%)
2. Infância/Origens: como seus padrões se formaram (20%)
3. Conflitos: tensões internas que viveu (20%)
4. Forças: o que move essa pessoa de verdade (25%)
5. Integração: como tudo se conecta (15%)
6. Fechamento: a frase final obrigatória (5%)`;

    const userPrompt = `Crie o roteiro do Filme da Identidade para "${userName}".

DADOS DO CÓDIGO DA ESSÊNCIA:
${essenceContext || "Dados não disponíveis - crie uma narração genérica mas profunda."}

Responda APENAS usando a ferramenta fornecida.`;

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
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "generate_film_script",
              description: "Generate a personalized film script with narration, scenes and keywords",
              parameters: {
                type: "object",
                properties: {
                  narration: {
                    type: "string",
                    description: "Full narration text in Portuguese, 250-350 words, ending with the mandatory closing line",
                  },
                  scenes: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        imagePrompt: {
                          type: "string",
                          description: "Detailed prompt in English for generating a cinematic, emotional image for this scene. Describe a photorealistic, documentary-style scene. Include lighting, mood, composition.",
                        },
                        keyword: {
                          type: "string",
                          description: "One single Portuguese word that captures this moment (e.g., Coragem, Silêncio, Movimento, Propósito, Direção, Verdade)",
                        },
                      },
                      required: ["imagePrompt", "keyword"],
                      additionalProperties: false,
                    },
                    description: "Array of 6 scenes for the film, each with an image prompt and keyword",
                  },
                },
                required: ["narration", "scenes"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "generate_film_script" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Muitas solicitações. Tente novamente em alguns minutos." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos insuficientes." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall?.function?.arguments) {
      throw new Error("No tool call response from AI");
    }

    const script = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(script), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("filme-identidade-script error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
