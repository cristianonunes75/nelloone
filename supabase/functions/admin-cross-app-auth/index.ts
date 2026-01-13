import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function logStep(step: string, details?: Record<string, unknown>) {
  console.log(`[CROSS-APP-AUTH] ${step}`, details ? JSON.stringify(details) : "");
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Create admin client with service role (for DB operations)
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    
    // Create user client to verify auth
    const supabaseUser = createClient(supabaseUrl, supabaseAnonKey);

    const { action, targetApp, targetPath, token } = await req.json();

    if (action === "create") {
      // Get the authorization header for create action
      const authHeader = req.headers.get("Authorization");
      if (!authHeader) {
        throw new Error("No authorization header");
      }

      // Verify the admin user
      const jwtToken = authHeader.replace("Bearer ", "");
      const { data: { user: adminUser }, error: authError } = await supabaseUser.auth.getUser(jwtToken);
      
      if (authError || !adminUser) {
        logStep("Auth failed", { error: authError?.message });
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
        logStep("Admin check failed", { userId: adminUser.id });
        throw new Error("Admin access required");
      }

      // Generate a secure random token
      const crossAppToken = crypto.randomUUID();

      // Store the token with short expiry (30 seconds)
      const { error: insertError } = await supabaseAdmin
        .from("admin_cross_app_tokens")
        .insert({
          admin_id: adminUser.id,
          token: crossAppToken,
          target_app: targetApp,
          target_path: targetPath,
          ip_address: req.headers.get("x-forwarded-for") || "unknown",
          user_agent: req.headers.get("user-agent") || "unknown",
        });

      if (insertError) {
        logStep("Insert error", { error: insertError.message });
        throw new Error("Failed to create cross-app token");
      }

      logStep("Token created", { 
        adminId: adminUser.id, 
        targetApp, 
        targetPath 
      });

      return new Response(
        JSON.stringify({ 
          success: true, 
          token: crossAppToken,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "validate") {
      if (!token) {
        return new Response(
          JSON.stringify({ valid: false, error: "No token provided" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Find the token and check if it's valid
      const { data: tokenData, error: tokenError } = await supabaseAdmin
        .from("admin_cross_app_tokens")
        .select("*")
        .eq("token", token)
        .is("used_at", null)
        .gt("expires_at", new Date().toISOString())
        .single();

      if (tokenError || !tokenData) {
        logStep("Token validation failed", { error: tokenError?.message });
        return new Response(
          JSON.stringify({ valid: false, error: "Invalid or expired token" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Mark the token as used (one-time use)
      await supabaseAdmin
        .from("admin_cross_app_tokens")
        .update({ used_at: new Date().toISOString() })
        .eq("id", tokenData.id);

      // Get admin user data for seamless transition
      const { data: adminProfile } = await supabaseAdmin
        .from("profiles")
        .select("full_name")
        .eq("id", tokenData.admin_id)
        .single();

      logStep("Token validated", { 
        adminId: tokenData.admin_id,
        targetApp: tokenData.target_app,
        targetPath: tokenData.target_path
      });

      return new Response(
        JSON.stringify({ 
          valid: true, 
          adminId: tokenData.admin_id,
          targetApp: tokenData.target_app,
          targetPath: tokenData.target_path,
          adminName: adminProfile?.full_name || "Admin",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    throw new Error("Invalid action");

  } catch (error) {
    logStep("Error", { error: error instanceof Error ? error.message : String(error) });
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
