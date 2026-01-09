import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { cardType, typeDescription, language = "pt" } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompts: Record<string, string> = {
      pt: `Você é o Nello, o guia espiritual e coach de autoconhecimento do NELLO ONE.
O NELLO ONE é uma plataforma de autoconhecimento baseada em ciência e fé cristã, que ajuda pessoas a descobrirem sua essência através de testes de personalidade e análises profundas.

Seu papel é gerar conteúdo para cards de redes sociais da marca. O conteúdo deve ser:
- Profundo, mas acessível
- Inspirador e reflexivo
- Alinhado com valores cristãos (sem ser forçado ou invasivo)
- Focado em autoconhecimento, identidade e propósito
- Elegante e sofisticado no tom

IMPORTANTE: Responda APENAS com um JSON válido, sem markdown, sem explicações adicionais.`,
      
      en: `You are Nello, the spiritual guide and self-knowledge coach of NELLO ONE.
NELLO ONE is a self-knowledge platform based on science and Christian faith, helping people discover their essence through personality tests and deep analysis.

Your role is to generate content for the brand's social media cards. The content should be:
- Deep yet accessible
- Inspiring and reflective
- Aligned with Christian values (without being forced or invasive)
- Focused on self-knowledge, identity and purpose
- Elegant and sophisticated in tone

IMPORTANT: Respond ONLY with valid JSON, no markdown, no additional explanations.`
    };

    const userPromptTemplates: Record<string, (cardType: string, typeDescription: string) => string> = {
      pt: (cardType: string, typeDescription: string) => `Gere conteúdo para um card do tipo: ${cardType}
Descrição: ${typeDescription}

Responda com um JSON contendo os campos relevantes para este tipo de card:
- title: Título principal (máximo 8 palavras)
- subtitle: Categoria ou subtítulo (2-3 palavras)
- content: Texto principal (máximo 30 palavras)
${cardType === "quote" ? `- scripture: Uma passagem bíblica relevante (máximo 15 palavras)
- scriptureRef: Referência bíblica (ex: "João 8:32")` : ""}
${cardType === "cta" ? `- cta: Texto do botão de ação (2-4 palavras)` : ""}
- caption: Uma legenda completa para a postagem no Instagram/LinkedIn com:
  * Texto envolvente relacionado ao tema do card (3-4 parágrafos curtos)
  * 2-3 perguntas reflexivas para engajamento
  * Uma chamada para ação
  * 5-8 hashtags relevantes (ex: #autoconhecimento #nelloone #proposito)
  * Emojis adequados ao tom (use com moderação)

Responda SOMENTE com o JSON, sem código markdown ou explicações.`,

      en: (cardType: string, typeDescription: string) => `Generate content for a ${cardType} card.
Description: ${typeDescription}

Respond with a JSON containing the relevant fields for this card type:
- title: Main title (maximum 8 words)
- subtitle: Category or subtitle (2-3 words)
- content: Main text (maximum 30 words)
${cardType === "quote" ? `- scripture: A relevant biblical passage (maximum 15 words)
- scriptureRef: Biblical reference (e.g., "John 8:32")` : ""}
${cardType === "cta" ? `- cta: Call-to-action button text (2-4 words)` : ""}
- caption: A complete caption for Instagram/LinkedIn post with:
  * Engaging text related to the card theme (3-4 short paragraphs)
  * 2-3 reflective questions for engagement
  * A call to action
  * 5-8 relevant hashtags (e.g., #selfknowledge #nelloone #purpose)
  * Appropriate emojis (use sparingly)

Respond ONLY with JSON, no markdown code or explanations.`
    };

    const systemPrompt = systemPrompts[language] || systemPrompts.pt;
    const userPrompt = (userPromptTemplates[language] || userPromptTemplates.pt)(cardType, typeDescription);

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
          { role: "user", content: userPrompt }
        ],
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required. Add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || "";
    
    console.log("AI Response:", aiResponse);

    // Parse the JSON response, handling potential markdown code blocks
    let suggestion;
    try {
      // Remove markdown code blocks if present
      let cleanedResponse = aiResponse.trim();
      if (cleanedResponse.startsWith("```json")) {
        cleanedResponse = cleanedResponse.slice(7);
      } else if (cleanedResponse.startsWith("```")) {
        cleanedResponse = cleanedResponse.slice(3);
      }
      if (cleanedResponse.endsWith("```")) {
        cleanedResponse = cleanedResponse.slice(0, -3);
      }
      cleanedResponse = cleanedResponse.trim();
      
      suggestion = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error("Parse error:", parseError, "Raw response:", aiResponse);
      throw new Error("Failed to parse AI response");
    }

    return new Response(JSON.stringify(suggestion), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in nello-brand-suggestion:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
