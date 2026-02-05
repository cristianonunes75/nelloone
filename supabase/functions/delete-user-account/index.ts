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
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabaseUser = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    
    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabaseUser.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { userId } = await req.json();
    
    // Security check: user can only delete their own account
    if (userId !== user.id) {
      console.error(`Security violation: User ${user.id} tried to delete account ${userId}`);
      return new Response(
        JSON.stringify({ error: "Forbidden" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create admin client for operations that require elevated privileges
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    console.log(`Starting account deletion for user: ${userId}`);

    // Delete user data in order (respecting foreign key constraints)
    const tablesToDelete = [
      "ai_conversation_messages",
      "ai_conversations",
      "crossing_invites",
      "crossing_reports",
      "user_crossings",
      "payment_intents",
      "subscription_events",
      "user_coupons",
      "mapa_essencia",
      "codigo_essencia",
      "test_responses",
      "user_tests",
      "user_roles",
      "profiles",
    ];

    for (const table of tablesToDelete) {
      const { error } = await supabaseAdmin
        .from(table)
        .delete()
        .eq("user_id", userId);
      
      if (error) {
        console.warn(`Warning deleting from ${table}:`, error.message);
        // Continue with other tables even if one fails
      } else {
        console.log(`Deleted data from ${table}`);
      }
    }

    // Log the deletion for audit purposes
    await supabaseAdmin
      .from("account_deletion_logs")
      .insert({
        user_id: userId,
        user_email: user.email,
        status: "completed",
        ip_address: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip"),
        user_agent: req.headers.get("user-agent"),
      });

    // Delete the user from auth
    const { error: deleteUserError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    
    if (deleteUserError) {
      console.error("Error deleting auth user:", deleteUserError);
      // Update log to reflect partial deletion
      await supabaseAdmin
        .from("account_deletion_logs")
        .update({ status: "partial_auth_error" })
        .eq("user_id", userId)
        .order("deleted_at", { ascending: false })
        .limit(1);
      
      return new Response(
        JSON.stringify({ error: "Failed to delete auth account", details: deleteUserError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Account deletion completed for user: ${userId}`);

    return new Response(
      JSON.stringify({ success: true, message: "Account deleted successfully" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Error in delete-user-account:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: "Internal server error", details: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
