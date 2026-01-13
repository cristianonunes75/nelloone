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
    const { resume_url, application_id, file_path } = await req.json();
    
    if (!resume_url && !file_path) {
      return new Response(
        JSON.stringify({ error: "resume_url or file_path is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!application_id) {
      return new Response(
        JSON.stringify({ error: "application_id is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Scanning resume for application:", application_id);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Update extraction status to processing
    await supabase
      .from("job_applications")
      .update({ extraction_status: "processing" })
      .eq("id", application_id);

    // Get signed URL if we have file_path (for private bucket)
    let pdfUrl = resume_url;
    if (file_path) {
      const { data: signedData, error: signedError } = await supabase.storage
        .from("resumes")
        .createSignedUrl(file_path, 3600);
      
      if (signedError) {
        console.error("Error creating signed URL:", signedError);
        throw signedError;
      }
      pdfUrl = signedData.signedUrl;
    }

    console.log("PDF URL for AI analysis:", pdfUrl);

    // Fetch the PDF content
    const pdfResponse = await fetch(pdfUrl);
    if (!pdfResponse.ok) {
      throw new Error(`Failed to fetch PDF: ${pdfResponse.status}`);
    }
    
    const pdfBuffer = await pdfResponse.arrayBuffer();
    const pdfBase64 = btoa(String.fromCharCode(...new Uint8Array(pdfBuffer)));

    // Call AI to analyze the PDF
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
            content: `Você é um especialista em análise de currículos. Sua tarefa é extrair informações estruturadas de currículos em PDF.

Extraia as seguintes informações quando disponíveis:
- Nome completo
- Email
- Telefone
- Cidade/Estado
- Bairro
- LinkedIn ou outras redes sociais
- Objetivo profissional ou cargo desejado
- Resumo profissional
- Experiências profissionais (empresa, cargo, período, descrição)
- Formação acadêmica (instituição, curso, período)
- Cursos e certificações
- Habilidades técnicas
- Idiomas
- Informações adicionais relevantes

Seja preciso e extraia apenas informações que estão claramente presentes no documento.
IMPORTANTE: Sempre responda usando a função extract_resume_data.`
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analise este currículo em PDF e extraia todas as informações estruturadas disponíveis."
              },
              {
                type: "image_url",
                image_url: { 
                  url: `data:application/pdf;base64,${pdfBase64}`
                }
              }
            ]
          }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "extract_resume_data",
              description: "Extrai dados estruturados de um currículo",
              parameters: {
                type: "object",
                properties: {
                  personal_info: {
                    type: "object",
                    description: "Informações pessoais do candidato",
                    properties: {
                      full_name: { type: "string", description: "Nome completo" },
                      email: { type: "string", description: "Email de contato" },
                      phone: { type: "string", description: "Telefone de contato" },
                      city: { type: "string", description: "Cidade" },
                      state: { type: "string", description: "Estado" },
                      neighborhood: { type: "string", description: "Bairro" },
                      linkedin: { type: "string", description: "URL do LinkedIn" },
                      portfolio: { type: "string", description: "URL do portfólio ou site pessoal" }
                    }
                  },
                  professional_objective: {
                    type: "string",
                    description: "Objetivo profissional ou cargo desejado"
                  },
                  professional_summary: {
                    type: "string",
                    description: "Resumo profissional ou sobre o candidato"
                  },
                  work_experience: {
                    type: "array",
                    description: "Experiências profissionais",
                    items: {
                      type: "object",
                      properties: {
                        company: { type: "string", description: "Nome da empresa" },
                        position: { type: "string", description: "Cargo ocupado" },
                        start_date: { type: "string", description: "Data de início (formato: MM/AAAA ou AAAA)" },
                        end_date: { type: "string", description: "Data de término ou 'Atual'" },
                        description: { type: "string", description: "Descrição das atividades" },
                        achievements: { 
                          type: "array", 
                          items: { type: "string" },
                          description: "Principais conquistas ou realizações"
                        }
                      }
                    }
                  },
                  education: {
                    type: "array",
                    description: "Formação acadêmica",
                    items: {
                      type: "object",
                      properties: {
                        institution: { type: "string", description: "Nome da instituição" },
                        course: { type: "string", description: "Nome do curso" },
                        degree: { type: "string", description: "Tipo de formação (Graduação, Pós, MBA, etc.)" },
                        start_date: { type: "string", description: "Data de início" },
                        end_date: { type: "string", description: "Data de conclusão ou previsão" },
                        status: { type: "string", description: "Status (Completo, Em andamento, Trancado)" }
                      }
                    }
                  },
                  courses_certifications: {
                    type: "array",
                    description: "Cursos e certificações",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string", description: "Nome do curso ou certificação" },
                        institution: { type: "string", description: "Instituição" },
                        date: { type: "string", description: "Data de conclusão" },
                        hours: { type: "string", description: "Carga horária" }
                      }
                    }
                  },
                  skills: {
                    type: "object",
                    description: "Habilidades do candidato",
                    properties: {
                      technical: { 
                        type: "array", 
                        items: { type: "string" },
                        description: "Habilidades técnicas (ferramentas, tecnologias, softwares)"
                      },
                      soft: { 
                        type: "array", 
                        items: { type: "string" },
                        description: "Habilidades comportamentais"
                      }
                    }
                  },
                  languages: {
                    type: "array",
                    description: "Idiomas",
                    items: {
                      type: "object",
                      properties: {
                        language: { type: "string", description: "Nome do idioma" },
                        level: { type: "string", description: "Nível de proficiência" }
                      }
                    }
                  },
                  additional_info: {
                    type: "string",
                    description: "Informações adicionais relevantes"
                  }
                },
                required: ["personal_info"]
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "extract_resume_data" } }
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errorText);
      
      // Update status to failed
      await supabase
        .from("job_applications")
        .update({ extraction_status: "failed" })
        .eq("id", application_id);
      
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
    console.log("AI response received");

    // Extract the function call result
    const toolCall = aiResult.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall || toolCall.function.name !== "extract_resume_data") {
      console.error("No valid tool call in response");
      
      await supabase
        .from("job_applications")
        .update({ extraction_status: "failed" })
        .eq("id", application_id);
      
      return new Response(
        JSON.stringify({ error: "Could not extract data from resume", details: "AI did not return structured data" }),
        { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const extractedData = JSON.parse(toolCall.function.arguments);
    console.log("Extracted resume data:", JSON.stringify(extractedData, null, 2));

    // Update job application with extracted data
    const updateData: Record<string, any> = {
      extracted_data: extractedData,
      extraction_status: "completed",
    };

    // Also update direct fields if available and not already set
    const { data: existingApp } = await supabase
      .from("job_applications")
      .select("full_name, email, phone, city, neighborhood")
      .eq("id", application_id)
      .single();

    if (extractedData.personal_info) {
      const personal = extractedData.personal_info;
      
      if (personal.full_name && !existingApp?.full_name) {
        updateData.full_name = personal.full_name;
      }
      if (personal.email && !existingApp?.email) {
        updateData.email = personal.email;
      }
      if (personal.phone && !existingApp?.phone) {
        updateData.phone = personal.phone;
      }
      if (personal.city && !existingApp?.city) {
        updateData.city = personal.city;
      }
      if (personal.neighborhood && !existingApp?.neighborhood) {
        updateData.neighborhood = personal.neighborhood;
      }
    }

    const { error: updateError } = await supabase
      .from("job_applications")
      .update(updateData)
      .eq("id", application_id);

    if (updateError) {
      console.error("Error updating application:", updateError);
      throw updateError;
    }

    console.log("Successfully updated application with extracted data");

    return new Response(
      JSON.stringify({
        success: true,
        extracted: extractedData,
        message: "Currículo analisado e dados extraídos com sucesso!"
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Error in scan-resume:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
