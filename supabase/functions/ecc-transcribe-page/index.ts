import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Voce transcreve fielmente paginas de documentos (livro do ECC) a partir de uma foto.

REGRAS:
- Transcreva 100% do texto da pagina, EXATAMENTE como esta, em portugues.
- NAO resuma, NAO interprete, NAO invente nada. Se algo estiver ilegivel, marque com [ilegivel].
- Preserve a estrutura usando Markdown: titulos com #, subtitulos com ##, listas com - ou numeros, e negrito quando o original destacar.
- Mantenha a ordem de leitura. Ignore numeros de pagina soltos no rodape se forem so paginacao.
- Responda APENAS com a transcricao em Markdown, sem comentarios seus, sem cercar em blocos de codigo.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Não autorizado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Não autorizado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // So quem tem acesso a biblioteca pode transcrever
    const email = (user.email || "").toLowerCase();
    const { data: access } = await supabase
      .from("ecc_access")
      .select("id, role")
      .or(`user_id.eq.${user.id},email.eq.${email}`)
      .limit(1)
      .maybeSingle();
    if (!access || !["owner", "editor"].includes((access as any).role)) {
      return new Response(JSON.stringify({ error: "Sem permissão para transcrever." }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { image } = await req.json();
    if (!image || typeof image !== "string") {
      return new Response(JSON.stringify({ error: "Envie a imagem da página." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!lovableApiKey) {
      return new Response(JSON.stringify({ error: "Serviço de IA indisponível." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: [
              { type: "text", text: "Transcreva fielmente esta página em Markdown." },
              { type: "image_url", image_url: { url: image } },
            ],
          },
        ],
        max_tokens: 8000,
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("[ecc-transcribe] gateway error", aiResponse.status, errText);
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Muitas requisições. Tente em instantes." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos de IA esgotados." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: "Falha ao transcrever a página." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiResult = await aiResponse.json();
    let transcription: string = aiResult?.choices?.[0]?.message?.content || "";
    // Remove cercas de codigo se a IA tiver envolvido
    transcription = transcription.replace(/^```(?:markdown)?\s*/i, "").replace(/\s*```\s*$/i, "").trim();

    if (!transcription) {
      return new Response(JSON.stringify({ error: "Não consegui ler a página." }), {
        status: 422,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`[ecc-transcribe] user ${user.id}: ${transcription.length} chars`);
    return new Response(JSON.stringify({ success: true, transcription }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("[ecc-transcribe] erro:", error?.message || error);
    return new Response(JSON.stringify({ error: "Erro interno na transcrição." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
