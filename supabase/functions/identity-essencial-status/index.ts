import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/**
 * Verifica o status do Identity Essencial de um usuário
 * Usado pelo DISCERNIR para verificar se pode gerar o Apoio de Escuta
 * 
 * Retorna:
 * - is_complete: boolean - se a jornada está completa
 * - tests_status: objeto com status de cada teste
 * - can_generate_apoio: boolean - se pode gerar o apoio de escuta
 * - synthesis: resumo da síntese (se disponível)
 */

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

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Não autorizado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Optionally check for a specific user_id (for priests checking on users)
    const { user_id: targetUserId } = await req.json().catch(() => ({}));
    const checkUserId = targetUserId || user.id;

    // If checking another user, verify priest access consent
    if (targetUserId && targetUserId !== user.id) {
      const { data: priest, error: priestError } = await supabase
        .from("discernir_priests")
        .select("id, parish_id")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .maybeSingle();

      if (priestError || !priest) {
        return new Response(JSON.stringify({ error: "Acesso não autorizado" }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Verify consent from target user
      const { data: consent } = await supabase
        .from("discernir_consents")
        .select("id")
        .eq("user_id", targetUserId)
        .eq("consent_type", "priest_access")
        .eq("is_active", true)
        .is("revoked_at", null)
        .maybeSingle();

      if (!consent) {
        return new Response(JSON.stringify({ 
          error: "Usuário não autorizou acesso pastoral",
          has_consent: false 
        }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // 1. Check Identity Essencial status
    const { data: essencialData } = await supabase
      .from("identity_essencial")
      .select("*")
      .eq("user_id", checkUserId)
      .maybeSingle();

    // 2. If no record, check if user has completed tests in main Identity
    if (!essencialData) {
      const { data: completionCheck } = await supabase.rpc('check_identity_essencial_completion', {
        p_user_id: checkUserId
      });

      const allComplete = completionCheck?.all_complete || false;

      return new Response(JSON.stringify({
        is_complete: false,
        needs_initialization: true,
        tests_status: completionCheck || {
          disc_complete: false,
          temperamentos_complete: false,
          estilos_conexao_complete: false,
          all_complete: false,
        },
        can_generate_apoio: false,
        can_reuse_data: allComplete,
        message: allComplete 
          ? "Dados do Identity podem ser reaproveitados. Inicie o Identity Essencial para continuar."
          : "Complete o Identity Essencial para gerar o Apoio de Escuta.",
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 3. Get latest synthesis if available
    let synthesis = null;
    if (essencialData.status === 'completed') {
      const { data: synthData } = await supabase
        .from("identity_essencial_synthesis")
        .select("rhythm_state, user_message, pastoral_message, pastoral_questions, generated_at, expires_at, is_valid")
        .eq("user_id", checkUserId)
        .eq("is_valid", true)
        .order("generated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (synthData) {
        synthesis = {
          rhythm_state: synthData.rhythm_state,
          pastoral_message: synthData.pastoral_message,
          pastoral_questions: synthData.pastoral_questions,
          generated_at: synthData.generated_at,
          expires_at: synthData.expires_at,
          is_valid: synthData.is_valid && new Date(synthData.expires_at) > new Date(),
        };
      }
    }

    const isComplete = essencialData.status === 'completed';

    return new Response(JSON.stringify({
      is_complete: isComplete,
      needs_initialization: false,
      tests_status: {
        disc_complete: essencialData.disc_status === 'completed',
        temperamentos_complete: essencialData.temperamentos_status === 'completed',
        estilos_conexao_complete: essencialData.estilos_conexao_status === 'completed',
        has_rhythm_declaration: essencialData.rhythm_declaration !== null,
        all_complete: isComplete,
      },
      completion_source: essencialData.completion_source,
      can_generate_apoio: isComplete,
      synthesis: synthesis,
      message: isComplete 
        ? "Identity Essencial completo. Apoio de Escuta disponível."
        : "Complete o Identity Essencial para gerar o Apoio de Escuta.",
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(JSON.stringify({ error: "Erro interno" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
