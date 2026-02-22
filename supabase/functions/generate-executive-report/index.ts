import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Authenticate caller
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const anonClient = createClient(
      supabaseUrl,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { authorization: authHeader } } }
    );
    const { data: { user }, error: authError } = await anonClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { company_id } = await req.json();
    if (!company_id) {
      return new Response(JSON.stringify({ error: "company_id required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify admin access
    const { data: companyUser } = await supabase
      .from("company_users")
      .select("role")
      .eq("company_id", company_id)
      .eq("user_id", user.id)
      .eq("is_active", true)
      .maybeSingle();

    const isAdmin = companyUser?.role === "company_admin" || companyUser?.role === "super_admin";
    
    // Also check nello admin
    const { data: nelloAdmin } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!isAdmin && !nelloAdmin) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get company info
    const { data: company } = await supabase
      .from("companies")
      .select("name, slug, industry, employee_count_range")
      .eq("id", company_id)
      .single();

    // Get aggregated insights (no individual data)
    const { data: insights } = await supabase
      .from("company_team_insights")
      .select("*")
      .eq("company_id", company_id)
      .maybeSingle();

    // Get subscription info
    const { data: subscription } = await supabase
      .from("company_subscriptions")
      .select("status, plan_tier, seats_total, seats_used")
      .eq("company_id", company_id)
      .maybeSingle();

    // Build executive report data (aggregated only, no PII)
    const reportData = {
      company_name: company?.name || "Empresa",
      industry: company?.industry,
      generated_at: new Date().toISOString(),
      branding: "Identity Corporate",
      summary: {
        total_members: insights?.total_members || 0,
        completed_assessments: insights?.completed_assessments || 0,
        adoption_rate: insights?.total_members
          ? Math.round(((insights?.completed_assessments || 0) / insights.total_members) * 100)
          : 0,
      },
      behavioral_profile: {
        disc_distribution: insights?.disc_distribution || {},
        temperament_distribution: insights?.temperament_distribution || {},
        communication_styles: insights?.communication_styles || {},
      },
      organizational_health: {
        team_strengths: insights?.team_strengths || [],
        growth_areas: insights?.team_growth_areas || [],
        conflict_risk_areas: insights?.conflict_risk_areas || [],
        leadership_potential: insights?.leadership_potential_indicators || [],
      },
      recommendations: {
        management: insights?.management_recommendations || [],
        team_building: insights?.team_building_suggestions || [],
      },
      license_info: {
        status: subscription?.status || "trial",
        plan: subscription?.plan_tier || "standard",
        seats_total: subscription?.seats_total || 0,
        seats_used: subscription?.seats_used || 0,
      },
    };

    // Create a shareable report record
    const publicToken = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 day expiry

    const { data: report, error: insertError } = await supabase
      .from("company_executive_reports")
      .insert({
        company_id,
        generated_by: user.id,
        title: `Relatório Executivo - ${company?.name || "Empresa"}`,
        report_data: reportData,
        public_token: publicToken,
        is_public_active: true,
        public_expires_at: expiresAt.toISOString(),
      })
      .select("id, public_token")
      .single();

    if (insertError) throw insertError;

    // Log to audit
    await supabase.from("company_audit_logs").insert({
      company_id,
      actor_id: user.id,
      action: "executive_report_generated",
      details: { report_id: report.id, public_token: publicToken },
    });

    return new Response(
      JSON.stringify({
        reportId: report.id,
        publicToken: report.public_token,
        reportData,
        message: "Executive report generated successfully",
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error generating executive report:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
