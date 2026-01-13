import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Helper function to encode ArrayBuffer to base64 without stack overflow
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunkSize = 0x8000; // 32KB chunks to avoid call stack issues
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode.apply(null, Array.from(chunk));
  }
  return btoa(binary);
}

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
    
    // Use proper base64 encoding that handles large files without stack overflow
    const pdfBuffer = await pdfResponse.arrayBuffer();
    const pdfBase64 = arrayBufferToBase64(pdfBuffer);

    console.log("PDF size (bytes):", pdfBuffer.byteLength, "Base64 length:", pdfBase64.length);

    // Call AI to analyze the PDF using the most powerful model for document analysis
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          {
            role: "system",
            content: `Você é um especialista em análise de currículos profissionais. Sua tarefa é extrair TODAS as informações estruturadas de currículos em PDF, mesmo que o texto seja difícil de ler ou esteja em formatos diversos.

REGRAS DE EXTRAÇÃO:
1. Analise TODO o documento cuidadosamente, página por página
2. Extraia informações mesmo que estejam em formatos não convencionais
3. Se encontrar informações parciais, ainda assim extraia o que conseguir
4. Preste atenção especial a:
   - Cabeçalhos e informações de contato no topo
   - Seções de experiência profissional
   - Formação acadêmica e cursos
   - Habilidades técnicas e comportamentais
   - Idiomas e certificações

5. Para experiências profissionais, capture:
   - Nome da empresa/empregador
   - Cargo/função exercida
   - Período (datas de início e fim)
   - Atividades e responsabilidades

6. Normalize telefones brasileiros no formato (XX) XXXXX-XXXX
7. Extraia emails mesmo que estejam parcialmente visíveis
8. Identifique a cidade/estado do candidato

IMPORTANTE: SEMPRE responda usando a função extract_resume_data com os dados encontrados. Se algum campo não estiver disponível, simplesmente não o inclua.`
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analise este currículo em PDF e extraia TODAS as informações estruturadas disponíveis. Seja minucioso e capture todos os detalhes, incluindo experiências profissionais, formação, habilidades e informações de contato."
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
              description: "Extrai dados estruturados de um currículo profissional",
              parameters: {
                type: "object",
                properties: {
                  personal_info: {
                    type: "object",
                    description: "Informações pessoais do candidato",
                    properties: {
                      full_name: { type: "string", description: "Nome completo do candidato" },
                      email: { type: "string", description: "Email de contato" },
                      phone: { type: "string", description: "Telefone de contato" },
                      city: { type: "string", description: "Cidade onde reside" },
                      state: { type: "string", description: "Estado (UF)" },
                      neighborhood: { type: "string", description: "Bairro" },
                      address: { type: "string", description: "Endereço completo se disponível" },
                      linkedin: { type: "string", description: "URL do perfil LinkedIn" },
                      portfolio: { type: "string", description: "URL do portfólio ou site pessoal" },
                      github: { type: "string", description: "URL do perfil GitHub" },
                      birth_date: { type: "string", description: "Data de nascimento" },
                      age: { type: "string", description: "Idade" },
                      marital_status: { type: "string", description: "Estado civil" },
                      nationality: { type: "string", description: "Nacionalidade" }
                    }
                  },
                  professional_objective: {
                    type: "string",
                    description: "Objetivo profissional ou cargo desejado pelo candidato"
                  },
                  professional_summary: {
                    type: "string",
                    description: "Resumo profissional, perfil ou apresentação do candidato"
                  },
                  work_experience: {
                    type: "array",
                    description: "Histórico de experiências profissionais",
                    items: {
                      type: "object",
                      properties: {
                        company: { type: "string", description: "Nome da empresa ou empregador" },
                        position: { type: "string", description: "Cargo ou função exercida" },
                        start_date: { type: "string", description: "Data de início (MM/AAAA ou AAAA)" },
                        end_date: { type: "string", description: "Data de término ou 'Atual' se ainda empregado" },
                        is_current: { type: "boolean", description: "Se é o emprego atual" },
                        description: { type: "string", description: "Descrição das atividades e responsabilidades" },
                        achievements: { 
                          type: "array", 
                          items: { type: "string" },
                          description: "Principais conquistas, resultados ou realizações"
                        },
                        location: { type: "string", description: "Localização do trabalho (cidade/remoto)" }
                      }
                    }
                  },
                  education: {
                    type: "array",
                    description: "Formação acadêmica",
                    items: {
                      type: "object",
                      properties: {
                        institution: { type: "string", description: "Nome da instituição de ensino" },
                        course: { type: "string", description: "Nome do curso" },
                        degree: { type: "string", description: "Tipo de formação (Ensino Médio, Técnico, Graduação, Pós-graduação, MBA, Mestrado, Doutorado)" },
                        field_of_study: { type: "string", description: "Área de estudo" },
                        start_date: { type: "string", description: "Data de início" },
                        end_date: { type: "string", description: "Data de conclusão ou previsão" },
                        status: { type: "string", description: "Status: Completo, Em andamento, Trancado, Incompleto" }
                      }
                    }
                  },
                  courses_certifications: {
                    type: "array",
                    description: "Cursos livres, treinamentos e certificações",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string", description: "Nome do curso ou certificação" },
                        institution: { type: "string", description: "Instituição que ofereceu" },
                        date: { type: "string", description: "Data de conclusão" },
                        hours: { type: "string", description: "Carga horária" },
                        credential_id: { type: "string", description: "ID ou código da credencial/certificado" }
                      }
                    }
                  },
                  skills: {
                    type: "object",
                    description: "Habilidades e competências do candidato",
                    properties: {
                      technical: { 
                        type: "array", 
                        items: { type: "string" },
                        description: "Habilidades técnicas: ferramentas, softwares, tecnologias, metodologias"
                      },
                      soft: { 
                        type: "array", 
                        items: { type: "string" },
                        description: "Habilidades comportamentais e interpessoais"
                      }
                    }
                  },
                  languages: {
                    type: "array",
                    description: "Idiomas que o candidato domina",
                    items: {
                      type: "object",
                      properties: {
                        language: { type: "string", description: "Nome do idioma" },
                        level: { type: "string", description: "Nível: Básico, Intermediário, Avançado, Fluente, Nativo" }
                      }
                    }
                  },
                  additional_info: {
                    type: "string",
                    description: "Informações adicionais como disponibilidade, pretensão salarial, CNH, etc"
                  },
                  references: {
                    type: "array",
                    description: "Referências profissionais",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string", description: "Nome da referência" },
                        position: { type: "string", description: "Cargo" },
                        company: { type: "string", description: "Empresa" },
                        contact: { type: "string", description: "Contato (telefone ou email)" }
                      }
                    }
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
      
      throw new Error(`AI analysis failed: ${aiResponse.status} - ${errorText}`);
    }

    const aiResult = await aiResponse.json();
    console.log("AI response received successfully");

    // Extract the function call result
    const toolCall = aiResult.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall || toolCall.function.name !== "extract_resume_data") {
      console.error("No valid tool call in response:", JSON.stringify(aiResult, null, 2));
      
      await supabase
        .from("job_applications")
        .update({ extraction_status: "failed" })
        .eq("id", application_id);
      
      return new Response(
        JSON.stringify({ 
          error: "Could not extract data from resume", 
          details: "AI did not return structured data. The PDF may be image-based or have an unusual format." 
        }),
        { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let extractedData;
    try {
      extractedData = JSON.parse(toolCall.function.arguments);
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      await supabase
        .from("job_applications")
        .update({ extraction_status: "failed" })
        .eq("id", application_id);
      
      return new Response(
        JSON.stringify({ error: "Failed to parse extracted data" }),
        { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Extracted resume data:", JSON.stringify(extractedData, null, 2));

    // Update job application with extracted data
    const updateData: Record<string, unknown> = {
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
