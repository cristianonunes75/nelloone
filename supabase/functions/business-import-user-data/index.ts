import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ImportRequest {
  candidate_id: string;
  email: string;
  company_id: string;
}

interface ImportResult {
  success: boolean;
  imported_tests: string[];
  message: string;
  user_id?: string;
}

const logStep = (step: string, details?: Record<string, unknown>) => {
  console.log(`[business-import-user-data] ${step}`, details ? JSON.stringify(details) : '');
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

    const body: ImportRequest = await req.json();
    const { candidate_id, email, company_id } = body;

    if (!candidate_id || !email || !company_id) {
      return new Response(JSON.stringify({ error: "Missing candidate_id, email or company_id" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    logStep("Starting import", { candidate_id, email, company_id, requested_by: user.id });

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

    // Find the user by email
    const { data: authUsers, error: authUsersError } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });

    if (authUsersError) {
      logStep("Error listing users", { error: authUsersError.message });
      throw authUsersError;
    }

    const emailLower = email.toLowerCase().trim();
    const existingUser = authUsers.users.find(
      (u) => u.email?.toLowerCase() === emailLower
    );

    if (!existingUser) {
      logStep("User not found", { email });
      const result: ImportResult = {
        success: false,
        imported_tests: [],
        message: "Usuário não encontrado no sistema",
      };
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    logStep("User found", { userId: existingUser.id });

    // Get the user's completed tests (DISC and Temperamentos)
    const { data: userTests, error: testsError } = await supabaseAdmin
      .from("user_tests")
      .select(`
        id,
        test_id,
        result_data,
        completed_at,
        tests!inner (
          type
        )
      `)
      .eq("user_id", existingUser.id)
      .eq("status", "completed");

    if (testsError) {
      logStep("Error fetching user tests", { error: testsError.message });
      throw testsError;
    }

    // Filter for DISC and Temperamentos tests only
    const relevantTests = userTests?.filter(test => {
      const testsData = test.tests as unknown as { type: string };
      const testType = testsData?.type;
      return testType === "disc" || testType === "temperamentos";
    }) || [];

    if (relevantTests.length === 0) {
      logStep("No completed tests found for user");
      const result: ImportResult = {
        success: false,
        imported_tests: [],
        message: "Usuário não possui testes DISC ou Temperamentos completos para importar",
        user_id: existingUser.id,
      };
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    logStep("Found completed tests", { count: relevantTests.length, types: relevantTests.map(t => (t.tests as unknown as { type: string })?.type) });

    // Get the candidate's assessments
    const { data: candidateAssessments, error: assessmentsError } = await supabaseAdmin
      .from("hiring_assessments")
      .select("id, test_type")
      .eq("candidate_id", candidate_id);

    if (assessmentsError) {
      logStep("Error fetching assessments", { error: assessmentsError.message });
      throw assessmentsError;
    }

    const importedTests: string[] = [];

    // Import each test
    for (const userTest of relevantTests) {
      const testsData = userTest.tests as unknown as { type: string };
      const testType = testsData?.type;
      const assessment = candidateAssessments?.find(a => a.test_type === testType);

      if (assessment) {
        // Update existing assessment with imported data
        const { error: updateError } = await supabaseAdmin
          .from("hiring_assessments")
          .update({
            status: "completed",
            result_data: userTest.result_data,
            completed_at: new Date().toISOString(),
            imported_from_user_id: existingUser.id,
            original_completed_at: userTest.completed_at,
          })
          .eq("id", assessment.id);

        if (updateError) {
          logStep("Error updating assessment", { test_type: testType, error: updateError.message });
          continue;
        }

        importedTests.push(testType);
        logStep("Imported test", { test_type: testType, assessment_id: assessment.id });
      }
    }

    // Update candidate status if all assessments are now complete
    if (importedTests.length > 0) {
      const { data: allAssessments } = await supabaseAdmin
        .from("hiring_assessments")
        .select("status")
        .eq("candidate_id", candidate_id);

      const allCompleted = allAssessments?.every(a => a.status === "completed");

      if (allCompleted) {
        await supabaseAdmin
          .from("hiring_candidates")
          .update({ status: "completed" })
          .eq("id", candidate_id);

        logStep("Updated candidate status to completed");
      }

      // Record import in audit log
      await supabaseAdmin
        .from("company_audit_logs")
        .insert({
          company_id,
          user_id: user.id,
          action: "import_candidate_data",
          details: {
            candidate_id,
            imported_from_user_id: existingUser.id,
            imported_tests: importedTests,
          },
        });
    }

    const testNames: Record<string, string> = {
      disc: "DISC",
      temperamentos: "Temperamentos",
    };

    const result: ImportResult = {
      success: importedTests.length > 0,
      imported_tests: importedTests,
      message: importedTests.length > 0 
        ? `Importado com sucesso: ${importedTests.map(t => testNames[t] || t).join(", ")}`
        : "Nenhum teste compatível encontrado para importar",
      user_id: existingUser.id,
    };

    logStep("Import completed", { importedTests });

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[business-import-user-data] Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
