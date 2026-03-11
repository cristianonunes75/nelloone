import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import JSZip from "https://esm.sh/jszip@3.10.1";

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

// Helper function to extract text from Word documents (.docx)
async function extractTextFromWord(buffer: ArrayBuffer, mimeType: string): Promise<string> {
  try {
    if (mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      // .docx files are ZIP archives containing XML
      const zip = new JSZip();
      const contents = await zip.loadAsync(buffer);
      
      // Get the main document content
      const documentXml = await contents.file("word/document.xml")?.async("string");
      
      if (!documentXml) {
        console.log("No document.xml found in docx");
        return "";
      }
      
      // Extract text from XML, removing tags
      // This regex extracts text between <w:t> tags (Word text elements)
      const textMatches = documentXml.match(/<w:t[^>]*>([^<]*)<\/w:t>/g) || [];
      const texts: string[] = [];
      
      for (const match of textMatches) {
        const textContent = match.replace(/<w:t[^>]*>/, "").replace(/<\/w:t>/, "");
        if (textContent) {
          texts.push(textContent);
        }
      }
      
      // Also handle paragraph breaks
      let result = documentXml;
      result = result.replace(/<\/w:p>/g, "\n");
      result = result.replace(/<[^>]+>/g, "");
      result = result.replace(/\s+/g, " ").trim();
      
      // Decode XML entities
      result = result.replace(/&amp;/g, "&");
      result = result.replace(/&lt;/g, "<");
      result = result.replace(/&gt;/g, ">");
      result = result.replace(/&quot;/g, '"');
      result = result.replace(/&apos;/g, "'");
      
      return result;
    } else if (mimeType === "application/msword") {
      // .doc files are binary format - harder to parse
      // We'll try to extract ASCII text from the binary
      const bytes = new Uint8Array(buffer);
      let text = "";
      let currentWord = "";
      
      for (let i = 0; i < bytes.length; i++) {
        const char = bytes[i];
        // Check if it's a printable ASCII character
        if (char >= 32 && char <= 126) {
          currentWord += String.fromCharCode(char);
        } else if (char === 10 || char === 13) {
          if (currentWord.length > 2) {
            text += currentWord + "\n";
          }
          currentWord = "";
        } else {
          if (currentWord.length > 2) {
            text += currentWord + " ";
          }
          currentWord = "";
        }
      }
      
      if (currentWord.length > 2) {
        text += currentWord;
      }
      
      // Clean up the extracted text
      text = text.replace(/\s+/g, " ").trim();
      
      return text;
    }
    
    return "";
  } catch (error) {
    console.error("Error extracting text from Word document:", error);
    return "";
  }
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

    const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
    if (!OPENROUTER_API_KEY) {
      throw new Error("OPENROUTER_API_KEY is not configured");
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
    let fileUrl = resume_url;
    if (file_path) {
      const { data: signedData, error: signedError } = await supabase.storage
        .from("resumes")
        .createSignedUrl(file_path, 3600);
      
      if (signedError) {
        console.error("Error creating signed URL:", signedError);
        throw signedError;
      }
      fileUrl = signedData.signedUrl;
    }

    console.log("File URL for AI analysis:", fileUrl);

    // Fetch the file content
    const fileResponse = await fetch(fileUrl);
    if (!fileResponse.ok) {
      throw new Error(`Failed to fetch file: ${fileResponse.status}`);
    }
    
    // Determine file type from URL or content-type
    const contentType = fileResponse.headers.get("content-type") || "";
    const urlLower = (file_path || resume_url || "").toLowerCase();
    
    let mimeType = "application/pdf";
    let isWordDocument = false;
    
    if (urlLower.endsWith(".jpg") || urlLower.endsWith(".jpeg") || contentType.includes("image/jpeg")) {
      mimeType = "image/jpeg";
    } else if (urlLower.endsWith(".png") || contentType.includes("image/png")) {
      mimeType = "image/png";
    } else if (urlLower.endsWith(".gif") || contentType.includes("image/gif")) {
      mimeType = "image/gif";
    } else if (urlLower.endsWith(".webp") || contentType.includes("image/webp")) {
      mimeType = "image/webp";
    } else if (urlLower.endsWith(".pdf") || contentType.includes("application/pdf")) {
      mimeType = "application/pdf";
    } else if (urlLower.endsWith(".docx") || contentType.includes("application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {
      mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      isWordDocument = true;
    } else if (urlLower.endsWith(".doc") || contentType.includes("application/msword")) {
      mimeType = "application/msword";
      isWordDocument = true;
    }
    
    console.log("Detected MIME type:", mimeType, "Is Word document:", isWordDocument);
    
    // Use proper base64 encoding that handles large files without stack overflow
    const fileBuffer = await fileResponse.arrayBuffer();
    
    // For Word documents, extract text content
    let extractedTextContent = "";
    if (isWordDocument) {
      console.log("Processing Word document, extracting text...");
      extractedTextContent = await extractTextFromWord(fileBuffer, mimeType);
      console.log("Extracted text length:", extractedTextContent.length);
    }
    
    const fileBase64 = arrayBufferToBase64(fileBuffer);

    console.log("File size (bytes):", fileBuffer.byteLength, "Base64 length:", fileBase64.length);

    // Call AI to analyze the resume using the most powerful model for document analysis
    // For Word documents, send extracted text; for images/PDFs, send as base64
    const userContent = isWordDocument
      ? [
          {
            type: "text",
            text: `Analise este currículo e extraia TODAS as informações estruturadas disponíveis. Seja minucioso e capture todos os detalhes, incluindo experiências profissionais, formação, habilidades e informações de contato.

CONTEÚDO DO CURRÍCULO (extraído de arquivo Word):
---
${extractedTextContent}
---

Por favor, extraia todos os dados estruturados deste currículo.`
          }
        ]
      : [
          {
            type: "text",
            text: "Analise este currículo e extraia TODAS as informações estruturadas disponíveis. Seja minucioso e capture todos os detalhes, incluindo experiências profissionais, formação, habilidades e informações de contato. O arquivo pode ser um PDF ou uma imagem de um currículo."
          },
          {
            type: "image_url",
            image_url: { 
              url: `data:${mimeType};base64,${fileBase64}`
            }
          }
        ];
    
    const aiResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          {
            role: "system",
            content: `Você é um especialista em análise de currículos profissionais. Sua tarefa é extrair TODAS as informações estruturadas de currículos em PDF, imagem ou texto extraído de documento Word, mesmo que o texto seja difícil de ler ou esteja em formatos diversos.

REGRAS DE EXTRAÇÃO:
1. Analise TODO o documento/texto cuidadosamente
2. Extraia informações mesmo que estejam em formatos não convencionais
3. Se encontrar informações parciais, ainda assim extraia o que conseguir
4. Preste atenção especial a:
   - Cabeçalhos e informações de contato no topo
   - Seções de experiência profissional
   - Formação acadêmica e cursos
   - Habilidades técnicas e comportamentais
   - Idiomas e certificações
   - FOTO DO CANDIDATO (se houver uma foto/imagem do rosto no currículo - apenas para PDFs/imagens)

5. Para experiências profissionais, capture:
   - Nome da empresa/empregador
   - Cargo/função exercida
   - Período (datas de início e fim)
   - Atividades e responsabilidades

6. Normalize telefones brasileiros no formato (XX) XXXXX-XXXX
7. Extraia emails mesmo que estejam parcialmente visíveis
8. Identifique a cidade/estado do candidato
9. FOTO: Se o currículo contiver uma foto do candidato (apenas para PDFs/imagens), SEMPRE indique has_photo como true e descreva a localização da foto no documento

IMPORTANTE: SEMPRE responda usando a função extract_resume_data com os dados encontrados. Se algum campo não estiver disponível, simplesmente não o inclua.`
          },
          {
            role: "user",
            content: userContent
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
                  },
                  photo_info: {
                    type: "object",
                    description: "Informações sobre a foto do candidato no currículo",
                    properties: {
                      has_photo: { type: "boolean", description: "Se o currículo contém uma foto do candidato" },
                      photo_location: { type: "string", description: "Localização da foto no documento (ex: canto superior esquerdo, lado direito do cabeçalho)" },
                      photo_description: { type: "string", description: "Breve descrição da foto (ex: foto 3x4, foto profissional, foto casual)" }
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

    // If photo detected, extract it using AI image generation/crop
    let candidatePhotoUrl: string | null = null;
    
    if (extractedData.photo_info?.has_photo) {
      console.log("Photo detected in resume, attempting to extract...");
      console.log("Photo location:", extractedData.photo_info.photo_location);
      
      try {
        // Use AI to extract/crop just the photo from the resume
        const photoExtractionResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-pro",
            messages: [
              {
                role: "system",
                content: `Você é um especialista em extração de imagens. Sua tarefa é identificar e descrever EXATAMENTE onde está a foto do candidato no currículo para que possamos recortá-la.

Retorne as coordenadas aproximadas da foto como porcentagem do documento:
- top: distância do topo (0-100%)
- left: distância da esquerda (0-100%)  
- width: largura da foto (0-100%)
- height: altura da foto (0-100%)

Exemplo: uma foto 3x4 no canto superior esquerdo típico seria aproximadamente:
{ "top": 5, "left": 5, "width": 15, "height": 20 }`
              },
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text: `Localize a foto do candidato neste currículo. A foto está localizada em: ${extractedData.photo_info.photo_location}. Retorne as coordenadas como JSON.`
                  },
                  {
                    type: "image_url",
                    image_url: { 
                      url: `data:${mimeType};base64,${fileBase64}`
                    }
                  }
                ]
              }
            ],
            tools: [
              {
                type: "function",
                function: {
                  name: "extract_photo_coordinates",
                  description: "Extrai as coordenadas da foto do candidato",
                  parameters: {
                    type: "object",
                    properties: {
                      top: { type: "number", description: "Distância do topo em porcentagem (0-100)" },
                      left: { type: "number", description: "Distância da esquerda em porcentagem (0-100)" },
                      width: { type: "number", description: "Largura da foto em porcentagem (0-100)" },
                      height: { type: "number", description: "Altura da foto em porcentagem (0-100)" },
                      confidence: { type: "string", description: "Nível de confiança: high, medium, low" }
                    },
                    required: ["top", "left", "width", "height"]
                  }
                }
              }
            ],
            tool_choice: { type: "function", function: { name: "extract_photo_coordinates" } }
          }),
        });

        if (photoExtractionResponse.ok) {
          const photoResult = await photoExtractionResponse.json();
          const photoToolCall = photoResult.choices?.[0]?.message?.tool_calls?.[0];
          
          if (photoToolCall) {
            const photoCoords = JSON.parse(photoToolCall.function.arguments);
            console.log("Photo coordinates extracted:", photoCoords);
            
            // Store the original resume as the photo source for now
            // In a more advanced implementation, we could use canvas to crop
            // For now, we save the photo info in extracted_data and use the resume as reference
            
            // Store photo metadata in extracted data
            extractedData.photo_info.coordinates = photoCoords;
            
            // If this is already an image (not PDF), we can use it directly as the photo
            if (mimeType.startsWith("image/")) {
              // For images, save a copy as the candidate photo
              const photoFileName = `candidate-photos/${application_id}-photo.${mimeType.split("/")[1]}`;
              
              const photoBytes = new Uint8Array(fileBuffer);
              const { error: uploadError } = await supabase.storage
                .from("resumes")
                .upload(photoFileName, photoBytes, {
                  contentType: mimeType,
                  upsert: true
                });
              
              if (!uploadError) {
                const { data: publicUrlData } = supabase.storage
                  .from("resumes")
                  .getPublicUrl(photoFileName);
                
                candidatePhotoUrl = publicUrlData.publicUrl;
                console.log("Candidate photo saved:", candidatePhotoUrl);
              } else {
                console.error("Error uploading candidate photo:", uploadError);
              }
            } else {
              // For PDFs, we note that there's a photo but can't easily extract it
              // The photo coordinates are stored for potential future use
              console.log("Photo detected in PDF - coordinates stored for reference");
            }
          }
        }
      } catch (photoError) {
        console.error("Error extracting photo:", photoError);
        // Don't fail the whole extraction just because photo extraction failed
      }
    }

    // Update job application with extracted data
    const updateData: Record<string, unknown> = {
      extracted_data: extractedData,
      extraction_status: "completed",
    };

    // Add photo URL if extracted
    if (candidatePhotoUrl) {
      updateData.candidate_photo_url = candidatePhotoUrl;
    }

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
        candidate_photo_url: candidatePhotoUrl,
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
