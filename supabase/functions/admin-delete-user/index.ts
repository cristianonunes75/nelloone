import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase client with user's token
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Client for verifying user
    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Admin client for operations
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Get the current user
    const { data: { user: adminUser }, error: authError } = await supabaseAuth.auth.getUser();
    if (authError || !adminUser) {
      console.error("Auth error:", authError);
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if user is admin
    const { data: isAdmin, error: roleError } = await supabaseAdmin.rpc("has_role", {
      _user_id: adminUser.id,
      _role: "admin",
    });

    if (roleError || !isAdmin) {
      console.error("Role check error:", roleError);
      return new Response(
        JSON.stringify({ error: "Only admins can delete users" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse request body
    const { target_user_id } = await req.json();

    if (!target_user_id) {
      return new Response(
        JSON.stringify({ error: "target_user_id is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Prevent self-deletion
    if (target_user_id === adminUser.id) {
      return new Response(
        JSON.stringify({ error: "Você não pode deletar a própria conta de administrador" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if target user is also an admin
    const { data: targetIsAdmin } = await supabaseAdmin.rpc("has_role", {
      _user_id: target_user_id,
      _role: "admin",
    });

    if (targetIsAdmin) {
      return new Response(
        JSON.stringify({ error: "Não é permitido deletar outro administrador" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get target user info for logging
    const { data: targetProfile } = await supabaseAdmin
      .from("profiles")
      .select("full_name")
      .eq("id", target_user_id)
      .single();

    console.log(`Starting deletion of user ${target_user_id} (${targetProfile?.full_name})`);

    // Delete related data in proper order (respecting foreign keys)
    
    // 1. Delete test_answers (depends on user_tests)
    const { data: userTests } = await supabaseAdmin
      .from("user_tests")
      .select("id")
      .eq("user_id", target_user_id);
    
    if (userTests && userTests.length > 0) {
      const userTestIds = userTests.map(t => t.id);
      const { error: answersError } = await supabaseAdmin
        .from("test_answers")
        .delete()
        .in("user_test_id", userTestIds);
      
      if (answersError) console.error("Error deleting test_answers:", answersError);
      else console.log(`Deleted test answers for ${userTestIds.length} user tests`);
    }

    // 2. Delete user_tests
    const { error: testsError } = await supabaseAdmin
      .from("user_tests")
      .delete()
      .eq("user_id", target_user_id);
    
    if (testsError) console.error("Error deleting user_tests:", testsError);
    else console.log("Deleted user_tests");

    // 3. Delete test_purchases
    const { error: purchasesError } = await supabaseAdmin
      .from("test_purchases")
      .delete()
      .eq("user_id", target_user_id);
    
    if (purchasesError) console.error("Error deleting test_purchases:", purchasesError);
    else console.log("Deleted test_purchases");

    // 4. Delete ai_messages (depends on ai_conversations)
    const { data: conversations } = await supabaseAdmin
      .from("ai_conversations")
      .select("id")
      .eq("user_id", target_user_id);
    
    if (conversations && conversations.length > 0) {
      const conversationIds = conversations.map(c => c.id);
      const { error: messagesError } = await supabaseAdmin
        .from("ai_messages")
        .delete()
        .in("conversation_id", conversationIds);
      
      if (messagesError) console.error("Error deleting ai_messages:", messagesError);
      else console.log(`Deleted ai_messages for ${conversationIds.length} conversations`);
    }

    // 5. Delete ai_conversations
    const { error: conversationsError } = await supabaseAdmin
      .from("ai_conversations")
      .delete()
      .eq("user_id", target_user_id);
    
    if (conversationsError) console.error("Error deleting ai_conversations:", conversationsError);
    else console.log("Deleted ai_conversations");

    // 6. Delete mapa_essencia
    const { error: mapaError } = await supabaseAdmin
      .from("mapa_essencia")
      .delete()
      .eq("user_id", target_user_id);
    
    if (mapaError) console.error("Error deleting mapa_essencia:", mapaError);
    else console.log("Deleted mapa_essencia");

    // 7. Delete founder_feedback
    const { error: feedbackError } = await supabaseAdmin
      .from("founder_feedback")
      .delete()
      .eq("user_id", target_user_id);
    
    if (feedbackError) console.error("Error deleting founder_feedback:", feedbackError);
    else console.log("Deleted founder_feedback");

    // 8. Delete photo_sessions
    const { error: sessionsError } = await supabaseAdmin
      .from("photo_sessions")
      .delete()
      .eq("user_id", target_user_id);
    
    if (sessionsError) console.error("Error deleting photo_sessions:", sessionsError);
    else console.log("Deleted photo_sessions");

    // 9. Delete impersonation_sessions (as target_user_id OR admin_id)
    const { error: impersonateError } = await supabaseAdmin
      .from("impersonation_sessions")
      .delete()
      .or(`target_user_id.eq.${target_user_id},admin_id.eq.${target_user_id}`);
    
    if (impersonateError) console.error("Error deleting impersonation_sessions:", impersonateError);
    else console.log("Deleted impersonation_sessions");

    // 10. Delete user_roles
    const { error: rolesError } = await supabaseAdmin
      .from("user_roles")
      .delete()
      .eq("user_id", target_user_id);
    
    if (rolesError) console.error("Error deleting user_roles:", rolesError);
    else console.log("Deleted user_roles");

    // 11. Delete additional tables for complete cleanup
    const additionalTables = [
      "identity_essencial",
      "codigo_essencia",
      "relatorios_contextuais",
      "relatorio_conjuge",
      "ativacao_codigo",
      "ativacao_profissional",
    ];

    for (const table of additionalTables) {
      const { error } = await supabaseAdmin
        .from(table)
        .delete()
        .eq("user_id", target_user_id);
      if (error) console.error(`Error deleting ${table}:`, error.message);
      else console.log(`Deleted ${table}`);
    }

    // 12. Delete codigo_cruzamentos (user can be user_a or user_b)
    const { error: cruzamentosError } = await supabaseAdmin
      .from("codigo_cruzamentos")
      .delete()
      .or(`user_a_id.eq.${target_user_id},user_b_id.eq.${target_user_id}`);
    if (cruzamentosError) console.error("Error deleting codigo_cruzamentos:", cruzamentosError);
    else console.log("Deleted codigo_cruzamentos");

    // 13. Hard delete profile (permanent removal)
    const { error: deleteProfileError } = await supabaseAdmin
      .from("profiles")
      .delete()
      .eq("id", target_user_id);

    if (deleteProfileError) {
      console.error("Delete profile error:", deleteProfileError);
      return new Response(
        JSON.stringify({ error: "Failed to delete user profile" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    console.log("Deleted profile permanently");

    // 12. Delete user from auth (hard delete from authentication)
    const { error: deleteAuthError } = await supabaseAdmin.auth.admin.deleteUser(target_user_id);
    
    if (deleteAuthError) {
      console.error("Auth delete error:", deleteAuthError);
      return new Response(
        JSON.stringify({ error: `Falha ao deletar usuário da autenticação: ${deleteAuthError.message}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Log the action to audit_logs
    await supabaseAdmin.rpc("log_audit", {
      p_action: "DELETE_USER",
      p_table_name: "profiles",
      p_record_id: target_user_id,
      p_old_data: null,
      p_new_data: {
        target_user_id,
        target_user_name: targetProfile?.full_name || "Unknown",
        deleted_by: adminUser.id,
        deleted_at: new Date().toISOString(),
        deleted_data: ["test_answers", "user_tests", "test_purchases", "ai_messages", "ai_conversations", "mapa_essencia", "founder_feedback", "photo_sessions", "user_roles", "identity_essencial", "codigo_essencia", "relatorios_contextuais", "relatorio_conjuge", "ativacao_codigo", "ativacao_profissional", "codigo_cruzamentos", "profiles"]
      },
    });

    console.log(`User ${target_user_id} deleted by admin ${adminUser.id}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Usuário deletado com sucesso",
        deleted_user_id: target_user_id
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in admin-delete-user:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
