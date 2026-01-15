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

      // Verify the user
      const jwtToken = authHeader.replace("Bearer ", "");
      const { data: { user }, error: authError } = await supabaseUser.auth.getUser(jwtToken);
      
      if (authError || !user) {
        logStep("Auth failed", { error: authError?.message });
        throw new Error("Unauthorized");
      }

      // Check if user has access to the target app
      const { data: targetAppAccess, error: accessError } = await supabaseAdmin
        .from("user_app_registrations")
        .select("id")
        .eq("user_id", user.id)
        .eq("app_name", targetApp)
        .single();

      if (accessError || !targetAppAccess) {
        logStep("Target app access check failed", { userId: user.id, targetApp });
        throw new Error("No access to target app");
      }

      // Generate a secure random token
      const crossAppToken = crypto.randomUUID();

      // Store the token with short expiry (30 seconds)
      const { error: insertError } = await supabaseAdmin
        .from("cross_app_tokens")
        .insert({
          user_id: user.id,
          token: crossAppToken,
          target_app: targetApp,
          target_path: targetPath || "/",
          ip_address: req.headers.get("x-forwarded-for") || "unknown",
          user_agent: req.headers.get("user-agent") || "unknown",
        });

      if (insertError) {
        logStep("Insert error", { error: insertError.message });
        throw new Error("Failed to create cross-app token");
      }

      // Update last_accessed_at for source app
      const sourceApp = req.headers.get("x-source-app");
      if (sourceApp) {
        await supabaseAdmin
          .from("user_app_registrations")
          .update({ last_accessed_at: new Date().toISOString() })
          .eq("user_id", user.id)
          .eq("app_name", sourceApp);
      }

      logStep("Token created", { 
        userId: user.id, 
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
        .from("cross_app_tokens")
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
        .from("cross_app_tokens")
        .update({ used_at: new Date().toISOString() })
        .eq("id", tokenData.id);

      // Update last_accessed_at for target app
      await supabaseAdmin
        .from("user_app_registrations")
        .update({ last_accessed_at: new Date().toISOString() })
        .eq("user_id", tokenData.user_id)
        .eq("app_name", tokenData.target_app);

      // Get user data for seamless transition
      const { data: userProfile } = await supabaseAdmin
        .from("profiles")
        .select("full_name")
        .eq("id", tokenData.user_id)
        .single();

      logStep("Token validated", { 
        userId: tokenData.user_id,
        targetApp: tokenData.target_app,
        targetPath: tokenData.target_path
      });

      return new Response(
        JSON.stringify({ 
          valid: true, 
          userId: tokenData.user_id,
          targetApp: tokenData.target_app,
          targetPath: tokenData.target_path,
          userName: userProfile?.full_name || "User",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "check-access") {
      // Get the authorization header
      const authHeader = req.headers.get("Authorization");
      if (!authHeader) {
        throw new Error("No authorization header");
      }

      // Verify the user
      const jwtToken = authHeader.replace("Bearer ", "");
      const { data: { user }, error: authError } = await supabaseUser.auth.getUser(jwtToken);
      
      if (authError || !user) {
        logStep("Auth failed for check-access", { error: authError?.message });
        throw new Error("Unauthorized");
      }

      // Get all apps user is registered in
      const { data: registrations, error: regError } = await supabaseAdmin
        .from("user_app_registrations")
        .select("app_name")
        .eq("user_id", user.id);

      if (regError) {
        logStep("Failed to fetch registrations", { error: regError.message });
        throw new Error("Failed to fetch app registrations");
      }

      const registeredApps = registrations?.map(r => r.app_name) || [];

      logStep("Access check completed", { 
        userId: user.id,
        registeredApps
      });

      return new Response(
        JSON.stringify({ 
          success: true,
          registeredApps,
          hasCrossAppAccess: registeredApps.length > 1
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
