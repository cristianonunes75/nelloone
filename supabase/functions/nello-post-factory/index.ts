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
    const { 
      product, 
      cardType, 
      format, 
      language = "pt",
      toneOfVoice,
      productDescription 
    } = await req.json();
    
    const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
    if (!OPENROUTER_API_KEY) {
      throw new Error("OPENROUTER_API_KEY is not configured");
    }

    const productNames: Record<string, Record<string, string>> = {
      pt: {
        identity: "Nello Identity - Código da Essência",
        life: "Nello Life - Jornada de Vida",
        flow: "Nello Flow - Inteligência Adaptativa",
        business: "Nello Business - Inteligência Empresarial",
        praxis: "Nello Praxis - Prática Integrada"
      },
      en: {
        identity: "Nello Identity - Essence Code",
        life: "Nello Life - Life Journey",
        flow: "Nello Flow - Adaptive Intelligence",
        business: "Nello Business - Business Intelligence",
        praxis: "Nello Praxis - Integrated Practice"
      }
    };

    const typeDescriptions: Record<string, Record<string, string>> = {
      pt: {
        institutional: "Um card institucional apresentando a marca e seus valores",
        educational: "Um card educativo com insights sobre autoconhecimento e desenvolvimento",
        quote: "Uma reflexão profunda com passagem bíblica inspiradora",
        cta: "Um card com chamada para ação convincente",
        feature: "Um card destacando uma funcionalidade ou benefício específico"
      },
      en: {
        institutional: "An institutional card presenting the brand and its values",
        educational: "An educational card with insights on self-knowledge and development",
        quote: "A deep reflection with an inspiring biblical passage",
        cta: "A card with a compelling call to action",
        feature: "A card highlighting a specific feature or benefit"
      }
    };

    const systemPrompts: Record<string, string> = {
      pt: `Você é um especialista em marketing para o ecossistema Nello One.
      
Produto: ${productNames.pt[product] || product}
${productDescription ? `Descrição: ${productDescription}` : ""}
${toneOfVoice ? `Tom de voz: ${toneOfVoice}` : ""}

O Nello One é uma plataforma de autoconhecimento baseada em ciência e fé cristã, com múltiplos produtos:
- Identity: Testes de personalidade e Código da Essência
- Life: Planejamento de vida e propósito
- Flow: Produtividade e alta performance
- Business: Gestão de equipes e liderança
- Praxis: Aplicação prática do autoconhecimento

Gere conteúdo criativo, persuasivo e alinhado com a identidade do produto.

IMPORTANTE: Responda APENAS com um JSON válido, sem markdown, sem explicações adicionais.`,
      
      en: `You are a marketing expert for the Nello One ecosystem.
      
Product: ${productNames.en[product] || product}
${productDescription ? `Description: ${productDescription}` : ""}
${toneOfVoice ? `Tone of voice: ${toneOfVoice}` : ""}

Nello One is a self-knowledge platform based on science and Christian faith, with multiple products:
- Identity: Personality tests and Essence Code
- Life: Life planning and purpose
- Flow: Productivity and high performance
- Business: Team management and leadership
- Praxis: Practical application of self-knowledge

Generate creative, persuasive content aligned with the product identity.

IMPORTANT: Respond ONLY with valid JSON, no markdown, no additional explanations.`
    };

    const userPrompts: Record<string, string> = {
      pt: `Gere conteúdo para um card de ${format} do tipo: ${cardType}
Descrição do tipo: ${typeDescriptions.pt[cardType]}

Responda com um JSON contendo:
- title: Título principal (máximo 8 palavras, impactante)
- subtitle: Categoria ou subtítulo (2-3 palavras)
- content: Texto principal (máximo 30 palavras, engajante)
${cardType === "quote" ? `- scripture: Uma passagem bíblica relevante (máximo 15 palavras)
- scriptureRef: Referência bíblica (ex: "João 8:32")` : ""}
${cardType === "cta" || cardType === "feature" ? `- cta: Texto do botão de ação (2-4 palavras, ação clara)` : ""}
- caption: Legenda completa para Instagram/LinkedIn com:
  * 3-4 parágrafos curtos envolventes
  * 2 perguntas reflexivas
  * Chamada para ação
  * 5-8 hashtags relevantes (#nelloone #${product} etc)
  * Emojis com moderação

Responda SOMENTE com o JSON, sem código markdown.`,

      en: `Generate content for a ${format} card of type: ${cardType}
Type description: ${typeDescriptions.en[cardType]}

Respond with a JSON containing:
- title: Main title (maximum 8 words, impactful)
- subtitle: Category or subtitle (2-3 words)
- content: Main text (maximum 30 words, engaging)
${cardType === "quote" ? `- scripture: A relevant biblical passage (maximum 15 words)
- scriptureRef: Biblical reference (e.g., "John 8:32")` : ""}
${cardType === "cta" || cardType === "feature" ? `- cta: Call-to-action button text (2-4 words, clear action)` : ""}
- caption: Complete caption for Instagram/LinkedIn with:
  * 3-4 short engaging paragraphs
  * 2 reflective questions
  * Call to action
  * 5-8 relevant hashtags (#nelloone #${product} etc)
  * Emojis in moderation

Respond ONLY with JSON, no markdown code.`
    };

    const systemPrompt = systemPrompts[language] || systemPrompts.pt;
    const userPrompt = userPrompts[language] || userPrompts.pt;

    console.log("Generating copy for:", { product, cardType, format, language });

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.85,
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

    // Parse the JSON response
    let suggestion;
    try {
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
    console.error("Error in nello-post-factory:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
