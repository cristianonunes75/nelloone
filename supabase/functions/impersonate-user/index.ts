import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

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
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Create admin client with service role
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    
    // Create user client to verify auth
    const supabaseUser = createClient(supabaseUrl, supabaseAnonKey);

    // Get the authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    // Verify the admin user
    const token = authHeader.replace("Bearer ", "");
    const { data: { user: adminUser }, error: authError } = await supabaseUser.auth.getUser(token);
    
    if (authError || !adminUser) {
      throw new Error("Unauthorized");
    }

    // Check if user is admin
    const { data: roleData } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", adminUser.id)
      .eq("role", "admin")
      .single();

    if (!roleData) {
      throw new Error("Admin access required");
    }

    const { action, targetUserId, sessionToken } = await req.json();

    if (action === "create") {
      // Validate target user exists and is not admin
      const { data: targetRoles } = await supabaseAdmin
        .from("user_roles")
        .select("role")
        .eq("user_id", targetUserId);

      if (targetRoles?.some(r => r.role === "admin")) {
        throw new Error("Cannot impersonate admin users");
      }

      // Create impersonation session
      const newSessionToken = crypto.randomUUID();
      
      const { data: session, error: sessionError } = await supabaseAdmin
        .from("impersonation_sessions")
        .insert({
          admin_id: adminUser.id,
          target_user_id: targetUserId,
          session_token: newSessionToken,
          ip_address: req.headers.get("x-forwarded-for") || "unknown",
          user_agent: req.headers.get("user-agent") || "unknown",
        })
        .select()
        .single();

      if (sessionError) {
        console.error("Error creating session:", sessionError);
        throw new Error("Failed to create impersonation session");
      }

      // Log the action
      await supabaseAdmin.rpc("log_audit", {
        p_action: "impersonate_start",
        p_table_name: "impersonation_sessions",
        p_record_id: session.id,
        p_new_data: { admin_id: adminUser.id, target_user_id: targetUserId },
      });

      console.log(`Admin ${adminUser.id} started impersonating user ${targetUserId}`);

      return new Response(
        JSON.stringify({ 
          success: true, 
          sessionToken: newSessionToken,
          message: "Impersonation session created"
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "validate") {
      // Validate an impersonation session token
      const { data: session, error } = await supabaseAdmin
        .from("impersonation_sessions")
        .select("*, profiles:target_user_id(full_name)")
        .eq("session_token", sessionToken)
        .eq("is_active", true)
        .single();

      if (error || !session) {
        return new Response(
          JSON.stringify({ valid: false }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ 
          valid: true, 
          targetUserId: session.target_user_id,
          adminId: session.admin_id
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "end") {
      // End an impersonation session
      const { error } = await supabaseAdmin
        .from("impersonation_sessions")
        .update({ 
          is_active: false,
          ended_at: new Date().toISOString()
        })
        .eq("session_token", sessionToken)
        .eq("admin_id", adminUser.id);

      if (error) {
        throw new Error("Failed to end session");
      }

      console.log(`Admin ${adminUser.id} ended impersonation session`);

      return new Response(
        JSON.stringify({ success: true, message: "Session ended" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    throw new Error("Invalid action");

  } catch (error) {
    console.error("Impersonation error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 400, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
