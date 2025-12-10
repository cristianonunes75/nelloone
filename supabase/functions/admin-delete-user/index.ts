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

    // Soft delete: Update profiles table
    const { error: updateError } = await supabaseAdmin
      .from("profiles")
      .update({
        is_deleted: true,
        deleted_at: new Date().toISOString(),
        deleted_by: adminUser.id,
        is_blocked: true, // Also block the user
      })
      .eq("id", target_user_id);

    if (updateError) {
      console.error("Update error:", updateError);
      return new Response(
        JSON.stringify({ error: "Failed to mark user as deleted" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Delete user from auth (hard delete from authentication)
    const { error: deleteAuthError } = await supabaseAdmin.auth.admin.deleteUser(target_user_id);
    
    if (deleteAuthError) {
      console.error("Auth delete error:", deleteAuthError);
      // Don't fail the whole operation, profile is already marked as deleted
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
