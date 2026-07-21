import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { image_url, candidate_id, company_id } = await req.json();
    
    if (!image_url || !candidate_id) {
      return new Response(
        JSON.stringify({ error: "image_url and candidate_id are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Scanning attachment for candidate:", candidate_id);
    console.log("Image URL:", image_url);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Call AI to analyze the image
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are an expert at extracting behavioral assessment data from screenshots.
You will analyze images of DISC and Temperament test results and extract the data.

For DISC tests, look for:
- D (Dominância/Dominance) percentage
- I (Influência/Influence) percentage  
- S (Estabilidade/Stability) percentage
- C (Conformidade/Conformity) percentage

For Temperament tests, look for:
- Sanguíneo/Sanguine percentage or ranking
- Colérico/Choleric percentage or ranking
- Melancólico/Melancholic percentage or ranking
- Fleumático/Phlegmatic percentage or ranking

Extract whatever data you can find. If you see percentages, use them. If you see rankings (1st, 2nd, 3rd, 4th), convert to approximate percentages (1st=40%, 2nd=30%, 3rd=20%, 4th=10%).

IMPORTANT: Always respond using the extract_assessment_data function.`
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this behavioral assessment result image and extract the DISC and/or Temperament data. Extract all visible percentages or scores."
              },
              {
                type: "image_url",
                image_url: { url: image_url }
              }
            ]
          }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "extract_assessment_data",
              description: "Extract DISC and Temperament assessment data from an image",
              parameters: {
                type: "object",
                properties: {
                  disc: {
                    type: "object",
                    description: "DISC profile data if found",
                    properties: {
                      D: { type: "number", description: "Dominance percentage (0-100)" },
                      I: { type: "number", description: "Influence percentage (0-100)" },
                      S: { type: "number", description: "Stability percentage (0-100)" },
                      C: { type: "number", description: "Conformity percentage (0-100)" },
                      found: { type: "boolean", description: "Whether DISC data was found" }
                    },
                    required: ["found"]
                  },
                  temperament: {
                    type: "object",
                    description: "Temperament profile data if found",
                    properties: {
                      sanguineo: { type: "number", description: "Sanguine percentage (0-100)" },
                      colerico: { type: "number", description: "Choleric percentage (0-100)" },
                      melancolico: { type: "number", description: "Melancholic percentage (0-100)" },
                      fleumatico: { type: "number", description: "Phlegmatic percentage (0-100)" },
                      found: { type: "boolean", description: "Whether temperament data was found" }
                    },
                    required: ["found"]
                  },
                  raw_text: {
                    type: "string",
                    description: "Any relevant text extracted from the image"
                  }
                },
                required: ["disc", "temperament"]
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "extract_assessment_data" } }
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add more credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI analysis failed: ${aiResponse.status}`);
    }

    const aiResult = await aiResponse.json();
    console.log("AI response:", JSON.stringify(aiResult, null, 2));

    // Extract the function call result
    const toolCall = aiResult.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall || toolCall.function.name !== "extract_assessment_data") {
      console.error("No valid tool call in response");
      return new Response(
        JSON.stringify({ error: "Could not extract data from image", details: "AI did not return structured data" }),
        { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const extractedData = JSON.parse(toolCall.function.arguments);
    console.log("Extracted data:", extractedData);

    // Update assessments with extracted data
    const updates: { disc?: boolean; temperament?: boolean } = {};

    // Update DISC assessment if data found
    if (extractedData.disc?.found && (extractedData.disc.D || extractedData.disc.I || extractedData.disc.S || extractedData.disc.C)) {
      const discScores = {
        D: extractedData.disc.D || 0,
        I: extractedData.disc.I || 0,
        S: extractedData.disc.S || 0,
        C: extractedData.disc.C || 0,
      };

      // Determine primary and secondary profiles
      const sorted = Object.entries(discScores).sort(([,a], [,b]) => b - a);
      const primary = sorted[0][0];
      const secondary = sorted[1][0];

      const discResultData = {
        scores: discScores,
        percentages: discScores,
        primary,
        secondary,
        imported_from_scan: true,
        scanned_at: new Date().toISOString(),
      };

      // Check if assessment exists
      const { data: existingDisc } = await supabase
        .from("hiring_assessments")
        .select("id")
        .eq("candidate_id", candidate_id)
        .eq("test_type", "disc")
        .single();

      if (existingDisc) {
        await supabase
          .from("hiring_assessments")
          .update({
            result_data: discResultData,
            status: "completed",
            completed_at: new Date().toISOString(),
          })
          .eq("id", existingDisc.id);
      } else {
        await supabase
          .from("hiring_assessments")
          .insert({
            candidate_id,
            test_type: "disc",
            status: "completed",
            result_data: discResultData,
            completed_at: new Date().toISOString(),
          });
      }

      updates.disc = true;
      console.log("Updated DISC assessment with scores:", discScores);
    }

    // Update Temperament assessment if data found
    if (extractedData.temperament?.found && (extractedData.temperament.sanguineo || extractedData.temperament.colerico || extractedData.temperament.melancolico || extractedData.temperament.fleumatico)) {
      const tempScores = {
        sanguineo: extractedData.temperament.sanguineo || 0,
        colerico: extractedData.temperament.colerico || 0,
        melancolico: extractedData.temperament.melancolico || 0,
        fleumatico: extractedData.temperament.fleumatico || 0,
      };

      // Determine primary and secondary
      const sorted = Object.entries(tempScores).sort(([,a], [,b]) => b - a);
      const primary = { temperament: sorted[0][0], percentage: sorted[0][1] };
      const secondary = { temperament: sorted[1][0], percentage: sorted[1][1] };

      const tempResultData = {
        scores: tempScores,
        primary,
        secondary,
        imported_from_scan: true,
        scanned_at: new Date().toISOString(),
      };

      // Check if assessment exists
      const { data: existingTemp } = await supabase
        .from("hiring_assessments")
        .select("id")
        .eq("candidate_id", candidate_id)
        .eq("test_type", "temperamentos")
        .single();

      if (existingTemp) {
        await supabase
          .from("hiring_assessments")
          .update({
            result_data: tempResultData,
            status: "completed",
            completed_at: new Date().toISOString(),
          })
          .eq("id", existingTemp.id);
      } else {
        await supabase
          .from("hiring_assessments")
          .insert({
            candidate_id,
            test_type: "temperamentos",
            status: "completed",
            result_data: tempResultData,
            completed_at: new Date().toISOString(),
          });
      }

      updates.temperament = true;
      console.log("Updated Temperament assessment with scores:", tempScores);
    }

    // Update candidate status if both tests now complete
    if (updates.disc || updates.temperament) {
      const { data: allAssessments } = await supabase
        .from("hiring_assessments")
        .select("test_type, status")
        .eq("candidate_id", candidate_id);

      const discComplete = allAssessments?.find(a => a.test_type === "disc" && a.status === "completed");
      const tempComplete = allAssessments?.find(a => a.test_type === "temperamentos" && a.status === "completed");

      if (discComplete && tempComplete) {
        await supabase
          .from("hiring_candidates")
          .update({ status: "completed" })
          .eq("id", candidate_id);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        extracted: extractedData,
        updates,
        message: updates.disc || updates.temperament 
          ? `Dados extraídos com sucesso! ${updates.disc ? 'DISC' : ''}${updates.disc && updates.temperament ? ' e ' : ''}${updates.temperament ? 'Temperamentos' : ''} atualizado(s).`
          : "Nenhum dado de avaliação encontrado na imagem."
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Error in business-scan-attachment:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
