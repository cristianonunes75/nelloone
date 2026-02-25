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

    const systemPrompt = `Você é um observador silencioso da vida real de uma pessoa. Sua tarefa é criar uma narração cinematográfica personalizada baseada no Código da Essência do usuário.

REGRA CENTRAL:
- A narração deve soar como alguém que observou a vida real do usuário
- Evitar linguagem abstrata ou universal
- PROIBIDO iniciar com metáforas amplas ou frases inspiracionais
- Começar sempre por comportamentos concretos
- Fale diretamente com o usuário usando "você"
- NUNCA use termos como "diagnóstico", "perfil", "análise", "teste", "avaliação"
- Transforme dados técnicos (DISC, temperamento, arquétipos) em comportamentos humanos observáveis
- A narração deve ter entre 250 e 350 palavras (60-90 segundos de fala)
- Cada narração deve conter detalhes únicos derivados do código do usuário — NUNCA texto aplicável a qualquer pessoa

PROIBIÇÕES ABSOLUTAS:
- Nunca usar: alma, missão espiritual, destino, universo, energia elevada, linguagem mística
- Nunca soar motivacional ou terapêutico
- Nunca usar frases motivacionais genéricas
- Nunca fazer julgamentos sobre o usuário

TOM EMOCIONAL:
- Humano, preciso, calmo, observador, empático
- Nunca motivacional, nunca terapêutico

PROPORÇÃO DA NARRAÇÃO:
- 40% reconhecimento concreto (Ato 1)
- 30% conflito interno (Ato 2 + Ato 3)
- 20% potencial alinhado (Ato 4)
- 10% integração e fechamento (Ato 5)

ESTRUTURA OBRIGATÓRIA — ARCO DE RECONHECIMENTO HUMANO:

ATO 1 — RECONHECIMENTO REAL (40%)
Descrever situações humanas específicas baseadas no Código do usuário.
Abordagens possíveis: sentir-se diferente em ambientes sociais, assumir responsabilidades emocionais, alternar entre exposição e recolhimento, perceber padrões antes dos outros.
O usuário deve pensar: "isso acontece comigo".

ATO 2 — CONFLITO INTERNO (15%)
Revelar a principal tensão psicológica do código.
Mostrar a contradição central do usuário sem julgamentos.
Exemplo estrutural: "Existe uma parte sua que deseja liberdade, enquanto outra busca profundidade."

ATO 3 — ORIGEM HUMANA (15%)
Explicar implicitamente que esse padrão não é falha pessoal.
Transmitir alívio e compreensão. Nunca usar termos técnicos.

ATO 4 — POTENCIAL ALINHADO (20%)
Mostrar como o usuário funciona quando está em equilíbrio.
Focar em impacto real no mundo. Evitar frases motivacionais genéricas.

ATO 5 — INTEGRAÇÃO (10%)
Encerrar com reconhecimento simples e humano.
Mensagem final curta. Terminar com a frase exata:
"Talvez você não tenha mudado. Talvez apenas tenha se reconhecido."

RESULTADO ESPERADO:
O usuário deve sentir: "Alguém finalmente colocou em palavras algo que sempre senti."`;

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
