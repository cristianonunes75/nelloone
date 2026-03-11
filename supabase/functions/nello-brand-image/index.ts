import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const imagePresets: Record<string, string> = {
  silhouette: "Person silhouette against warm golden sunset light, contemplative pose looking at horizon, seen from behind, no visible face, minimalist composition, warm cream and gold tones",
  hands: "Human hands in contemplative gesture, writing in leather journal, holding warm coffee cup, prayer hands, close-up macro shot, no face visible, warm soft lighting, cream and earth tones",
  nature: "Misty forest path at sunrise, single tree in golden field, calm water reflection at dawn, peaceful mountain vista, warm atmospheric lighting, serene mood, minimal composition",
  abstract: "Abstract light rays through window, soft ethereal gradients, golden hour glow, dreamy atmosphere, warm cream and gold color palette, minimalist spiritual aesthetic"
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { style, customPrompt, language = "pt" } = await req.json();
    
    const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
    if (!OPENROUTER_API_KEY) {
      throw new Error("OPENROUTER_API_KEY is not configured");
    }

    // Get base prompt from preset or use custom
    const basePrompt = imagePresets[style] || imagePresets.silhouette;
    const additionalContext = customPrompt ? `. Scene context: ${customPrompt}` : "";
    
    // Safety prompt to ensure no faces
    const safetyInstructions = `
CRITICAL REQUIREMENTS:
- Do NOT show any faces or facial features
- If humans are present, show them from behind, in silhouette, or focus on hands/body only
- Style: elegant, minimalist, warm tones (cream, gold, earth)
- Mood: introspective, peaceful, spiritual, meaningful
- Brand aesthetic: sophisticated Christian self-knowledge platform
`;

    const fullPrompt = `${basePrompt}${additionalContext}

${safetyInstructions}

Ultra high resolution, professional photography quality, 16:9 aspect ratio suitable for social media cards.`;

    console.log("Generating image with prompt:", fullPrompt);

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview",
        messages: [
          {
            role: "user",
            content: fullPrompt
          }
        ],
        modalities: ["image", "text"]
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
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log("AI Response received");

    // Extract the image from the response
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    
    if (!imageUrl) {
      console.error("No image in response:", JSON.stringify(data));
      throw new Error("No image generated");
    }

    return new Response(JSON.stringify({ 
      imageUrl,
      style,
      message: language === "pt" ? "Imagem gerada com sucesso!" : "Image generated successfully!"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in nello-brand-image:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
