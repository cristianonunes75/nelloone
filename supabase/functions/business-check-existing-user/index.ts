import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CheckUserRequest {
  email: string;
  company_id: string;
}

interface CheckUserResponse {
  exists: boolean;
  has_completed_tests: boolean;
  completed_tests_count: number;
  has_essence_code: boolean;
  first_name: string | null;
  already_in_company: boolean;
  already_invited: boolean;
}

const logStep = (step: string, details?: Record<string, unknown>) => {
  console.log(`[business-check-existing-user] ${step}`, details ? JSON.stringify(details) : '');
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase configuration");
    }

    // Create admin client for full access
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    
    // Verify the calling user is authenticated
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create user client to verify auth
    const supabaseUser = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY") || "", {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await supabaseUser.auth.getUser();
    if (authError || !user) {
      logStep("Auth failed", { error: authError?.message });
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body: CheckUserRequest = await req.json();
    const { email, company_id } = body;

    if (!email || !company_id) {
      return new Response(JSON.stringify({ error: "Missing email or company_id" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    logStep("Checking user", { email, company_id, requested_by: user.id });

    // Verify caller is admin of the company
    const { data: callerRole, error: roleError } = await supabaseAdmin
      .from("company_users")
      .select("role")
      .eq("company_id", company_id)
      .eq("user_id", user.id)
      .eq("is_active", true)
      .maybeSingle();

    if (roleError || !callerRole) {
      logStep("Caller not authorized", { error: roleError?.message });
      return new Response(JSON.stringify({ error: "Not authorized for this company" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!["super_admin", "company_admin"].includes(callerRole.role)) {
      return new Response(JSON.stringify({ error: "Insufficient permissions" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if email exists in auth.users - using admin client
    const { data: authUsers, error: authUsersError } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });

    if (authUsersError) {
      logStep("Error listing users", { error: authUsersError.message });
      throw authUsersError;
    }

    const emailLower = email.toLowerCase().trim();
    const existingAuthUser = authUsers.users.find(
      (u) => u.email?.toLowerCase() === emailLower
    );

    if (!existingAuthUser) {
      // User doesn't exist in the system
      logStep("User not found", { email });
      
      // Check if there's a pending invite
      const { data: pendingInvite } = await supabaseAdmin
        .from("company_invites")
        .select("id")
        .eq("email", emailLower)
        .eq("company_id", company_id)
        .eq("status", "pending")
        .maybeSingle();
      
      const response: CheckUserResponse = {
        exists: false,
        has_completed_tests: false,
        completed_tests_count: 0,
        has_essence_code: false,
        first_name: null,
        already_in_company: false,
        already_invited: !!pendingInvite,
      };

      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    logStep("User found in auth", { userId: existingAuthUser.id });

    // User exists - get their profile and test data
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("full_name")
      .eq("id", existingAuthUser.id)
      .maybeSingle();

    // Count completed tests
    const { data: userTests, error: testsError } = await supabaseAdmin
      .from("user_tests")
      .select("test_type")
      .eq("user_id", existingAuthUser.id)
      .eq("status", "completed");

    if (testsError) {
      logStep("Error fetching tests", { error: testsError.message });
    }

    const completedTestsCount = userTests?.length || 0;

    // Check if they have the essence code (mapa_essencia)
    const { data: mapaEssencia } = await supabaseAdmin
      .from("mapa_essencia")
      .select("id")
      .eq("user_id", existingAuthUser.id)
      .maybeSingle();

    const hasEssenceCode = !!mapaEssencia;

    // Check if user is already in this company
    const { data: existingMembership } = await supabaseAdmin
      .from("company_users")
      .select("id, is_active")
      .eq("company_id", company_id)
      .eq("user_id", existingAuthUser.id)
      .maybeSingle();

    // Check if there's a pending invite for this email to this company
    const { data: pendingInvite } = await supabaseAdmin
      .from("company_invites")
      .select("id")
      .eq("email", emailLower)
      .eq("company_id", company_id)
      .eq("status", "pending")
      .maybeSingle();

    // Extract first name
    let firstName: string | null = null;
    if (profile?.full_name) {
      firstName = profile.full_name.split(" ")[0];
    }

    const response: CheckUserResponse = {
      exists: true,
      has_completed_tests: completedTestsCount > 0,
      completed_tests_count: completedTestsCount,
      has_essence_code: hasEssenceCode,
      first_name: firstName,
      already_in_company: !!existingMembership?.is_active,
      already_invited: !!pendingInvite,
    };

    logStep("Check complete", { 
      exists: response.exists, 
      testsCount: response.completed_tests_count,
      alreadyInCompany: response.already_in_company 
    });

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[business-check-existing-user] Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
