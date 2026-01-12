import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MINIMUM_THRESHOLD = 3; // Minimum completed journeys for anonymization

const logStep = (step: string, details?: Record<string, unknown>) => {
  console.log(`[business-calculate-insights] ${step}`, details ? JSON.stringify(details) : "");
};

interface TestResult {
  user_id: string;
  test_type: string;
  scores: Record<string, number> | null;
  primary_result: string | null;
  secondary_result: string | null;
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request body
    const body = await req.json();
    const { company_id, triggered_by } = body;

    if (!company_id) {
      throw new Error("Missing company_id");
    }

    logStep("Request received", { company_id, triggered_by });

    // Get actor ID for audit log (if authenticated request)
    let actorId: string | null = null;
    const authHeader = req.headers.get("Authorization");
    
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data: { user } } = await supabase.auth.getUser(token);
      
      if (user) {
        actorId = user.id;
        
        // Verify user has permission (company_admin or super_admin)
        const { data: companyUser } = await supabase
          .from("company_users")
          .select("role")
          .eq("user_id", user.id)
          .eq("company_id", company_id)
          .eq("is_active", true)
          .single();

        // Check if user is company admin or global admin
        const { data: isGlobalAdmin } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .eq("role", "admin")
          .single();

        if (!companyUser && !isGlobalAdmin) {
          throw new Error("User does not have permission to calculate insights");
        }

        if (companyUser && !["company_admin", "super_admin"].includes(companyUser.role)) {
          if (!isGlobalAdmin) {
            throw new Error("User does not have permission to calculate insights");
          }
        }

        logStep("User authorized", { userId: user.id, role: companyUser?.role || "admin" });
      }
    } else if (triggered_by !== "system_trigger") {
      throw new Error("Authentication required");
    }

    // Get all collaborators who share reports AND have completed journey
    const { data: eligibleUsers, error: usersError } = await supabase
      .from("company_users")
      .select(`
        user_id,
        profiles!inner(journey_status)
      `)
      .eq("company_id", company_id)
      .eq("is_active", true)
      .eq("share_report_with_company", true)
      .eq("role", "collaborator");

    if (usersError) {
      logStep("Error fetching users", { error: usersError.message });
      throw new Error("Failed to fetch collaborators");
    }

    // Filter only users with completed journey
    const completedUsers = (eligibleUsers || []).filter(
      (u: any) => u.profiles?.journey_status === "completed"
    );
    const userIds = completedUsers.map((u: any) => u.user_id);

    logStep("Found eligible users", { 
      totalSharing: eligibleUsers?.length || 0,
      completedJourneys: userIds.length 
    });

    // Check threshold
    if (userIds.length < MINIMUM_THRESHOLD) {
      logStep("Below threshold", { current: userIds.length, required: MINIMUM_THRESHOLD });
      
      // Update insights with zero data to indicate insufficient data
      await supabase
        .from("company_team_insights")
        .upsert({
          company_id,
          total_members: 0,
          completed_assessments: userIds.length,
          temperament_distribution: {},
          disc_distribution: {},
          enneagram_distribution: {},
          communication_styles: {},
          team_strengths: [],
          team_growth_areas: [],
          conflict_risk_areas: [],
          leadership_potential_indicators: [],
          team_building_suggestions: [],
          management_recommendations: [],
          calculation_member_count: userIds.length,
          last_calculated_at: new Date().toISOString(),
        }, {
          onConflict: "company_id",
        });

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Insufficient data for insights",
          completed_count: userIds.length,
          required: MINIMUM_THRESHOLD,
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Get test results for eligible users
    const { data: userTestsData, error: resultsError } = await supabase
      .from("user_tests")
      .select(`
        user_id,
        result_data,
        tests!inner(type)
      `)
      .in("user_id", userIds)
      .eq("status", "completed");

    if (resultsError) {
      logStep("Error fetching test results", { error: resultsError.message });
    }

    logStep("Fetched user tests", { count: userTestsData?.length || 0 });

    // Transform to TestResult format
    const testResults: TestResult[] = (userTestsData || []).map((ut: any) => {
      const resultData = ut.result_data as Record<string, any> || {};
      const testType = ut.tests?.type || "";

      let primaryResult: string | null = null;
      let secondaryResult: string | null = null;
      let scores: Record<string, number> | null = null;

      switch (testType) {
        case "temperamentos":
          primaryResult = typeof resultData.primary === "object" 
            ? resultData.primary?.name 
            : resultData.primary;
          secondaryResult = typeof resultData.secondary === "object"
            ? resultData.secondary?.name
            : resultData.secondary;
          scores = resultData.scores || null;
          break;
        case "disc":
          primaryResult = resultData.dominantProfile || resultData.primary || null;
          scores = resultData.scores || null;
          break;
        case "eneagrama":
          primaryResult = resultData.primaryType?.toString() || null;
          secondaryResult = resultData.wing?.toString() || null;
          scores = resultData.scores || null;
          break;
        case "estilos_conexao":
        case "linguagens_amor":
          primaryResult = typeof resultData.primary?.name === "object"
            ? resultData.primary?.name?.pt
            : resultData.primary?.name || resultData.primary || null;
          break;
        case "inteligencias_multiplas":
          primaryResult = resultData.dominant?.name || resultData.top1 || null;
          break;
        case "nello16":
          primaryResult = resultData.type || null;
          break;
        case "arquetipos_proposito":
          primaryResult = resultData.dominantArchetypes?.primary?.archetype 
            || resultData.primary?.archetype || null;
          secondaryResult = resultData.dominantArchetypes?.secondary?.archetype
            || resultData.secondary?.archetype || null;
          break;
      }

      return {
        user_id: ut.user_id,
        test_type: testType,
        scores,
        primary_result: primaryResult,
        secondary_result: secondaryResult,
      };
    });

    // Calculate aggregated insights
    const insights = calculateTeamInsights(testResults, userIds.length);

    // Get total company members for context
    const { count: totalMembers } = await supabase
      .from("company_users")
      .select("*", { count: "exact", head: true })
      .eq("company_id", company_id)
      .eq("is_active", true);

    insights.total_members = totalMembers || 0;

    // Save insights to database
    const { error: upsertError } = await supabase
      .from("company_team_insights")
      .upsert({
        company_id,
        ...insights,
        calculation_member_count: userIds.length,
        last_calculated_at: new Date().toISOString(),
      }, {
        onConflict: "company_id",
      });

    if (upsertError) {
      logStep("Error saving insights", { error: upsertError.message });
      throw new Error("Failed to save insights");
    }

    // Log audit
    await supabase.from("company_audit_logs").insert({
      company_id,
      actor_id: actorId,
      action: "insights_calculated",
      details: { 
        member_count: userIds.length,
        triggered_by: triggered_by || "manual",
      },
    });

    logStep("Insights calculated successfully", { memberCount: userIds.length });

    return new Response(
      JSON.stringify({ 
        success: true, 
        insights,
        calculated_from: userIds.length,
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    logStep("Error", { error: errorMessage });
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});

function calculateTeamInsights(results: TestResult[], memberCount: number) {
  const temperamentCounts: Record<string, number> = {};
  const discCounts: Record<string, number> = {};
  const enneagramCounts: Record<string, number> = {};
  const communicationStyles: Record<string, number> = {};
  
  const uniqueUsers = new Set<string>();

  results.forEach(result => {
    uniqueUsers.add(result.user_id);

    switch (result.test_type) {
      case "temperamentos":
        if (result.primary_result) {
          temperamentCounts[result.primary_result] = (temperamentCounts[result.primary_result] || 0) + 1;
        }
        break;
      case "disc":
        if (result.primary_result) {
          discCounts[result.primary_result] = (discCounts[result.primary_result] || 0) + 1;
        }
        break;
      case "eneagrama":
        if (result.primary_result) {
          enneagramCounts[result.primary_result] = (enneagramCounts[result.primary_result] || 0) + 1;
        }
        break;
      case "estilos_conexao":
        if (result.primary_result) {
          communicationStyles[result.primary_result] = (communicationStyles[result.primary_result] || 0) + 1;
        }
        break;
    }
  });

  // Calculate distribution percentages
  const temperamentDistribution = calculatePercentages(temperamentCounts);
  const discDistribution = calculatePercentages(discCounts);
  const enneagramDistribution = calculatePercentages(enneagramCounts);

  // Generate insights
  const teamStrengths = generateStrengths(temperamentDistribution, discDistribution);
  const teamGrowthAreas = generateGrowthAreas(temperamentDistribution, discDistribution);
  const conflictRiskAreas = generateConflictRisks(temperamentDistribution, discDistribution);
  const leadershipIndicators = generateLeadershipIndicators(discDistribution, enneagramDistribution);
  const teamBuildingSuggestions = generateTeamBuildingSuggestions(temperamentDistribution);
  const managementRecommendations = generateManagementRecommendations(discDistribution, temperamentDistribution);

  return {
    total_members: memberCount,
    completed_assessments: uniqueUsers.size,
    temperament_distribution: temperamentDistribution,
    disc_distribution: discDistribution,
    enneagram_distribution: enneagramDistribution,
    team_strengths: teamStrengths,
    team_growth_areas: teamGrowthAreas,
    communication_styles: calculatePercentages(communicationStyles),
    conflict_risk_areas: conflictRiskAreas,
    leadership_potential_indicators: leadershipIndicators,
    team_building_suggestions: teamBuildingSuggestions,
    management_recommendations: managementRecommendations,
  };
}

function calculatePercentages(counts: Record<string, number>): Record<string, number> {
  const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
  if (total === 0) return {};
  
  const percentages: Record<string, number> = {};
  for (const [key, count] of Object.entries(counts)) {
    percentages[key] = Math.round((count / total) * 100);
  }
  return percentages;
}

function generateStrengths(temperament: Record<string, number>, disc: Record<string, number>): string[] {
  const strengths: string[] = [];
  
  if ((temperament["Colérico"] || 0) > 30) {
    strengths.push("Alta capacidade de execução e liderança");
  }
  if ((temperament["Sanguíneo"] || 0) > 30) {
    strengths.push("Excelente comunicação e entusiasmo");
  }
  if ((temperament["Fleumático"] || 0) > 30) {
    strengths.push("Estabilidade e trabalho em equipe consistente");
  }
  if ((temperament["Melancólico"] || 0) > 30) {
    strengths.push("Atenção a detalhes e qualidade");
  }
  
  if ((disc["D"] || 0) > 30) {
    strengths.push("Orientação para resultados");
  }
  if ((disc["I"] || 0) > 30) {
    strengths.push("Influência e persuasão");
  }
  if ((disc["S"] || 0) > 30) {
    strengths.push("Cooperação e suporte mútuo");
  }
  if ((disc["C"] || 0) > 30) {
    strengths.push("Precisão e conformidade com padrões");
  }
  
  return strengths.length > 0 ? strengths : ["Dados insuficientes para análise"];
}

function generateGrowthAreas(temperament: Record<string, number>, disc: Record<string, number>): string[] {
  const areas: string[] = [];
  
  if ((temperament["Colérico"] || 0) < 10 && (disc["D"] || 0) < 10) {
    areas.push("Desenvolver mais assertividade na tomada de decisões");
  }
  if ((temperament["Sanguíneo"] || 0) < 10 && (disc["I"] || 0) < 10) {
    areas.push("Melhorar comunicação e networking interno");
  }
  if ((temperament["Fleumático"] || 0) < 10 && (disc["S"] || 0) < 10) {
    areas.push("Fortalecer estabilidade e processos");
  }
  if ((temperament["Melancólico"] || 0) < 10 && (disc["C"] || 0) < 10) {
    areas.push("Aumentar foco em qualidade e detalhes");
  }
  
  return areas.length > 0 ? areas : ["Equipe bem equilibrada"];
}

function generateConflictRisks(temperament: Record<string, number>, disc: Record<string, number>): string[] {
  const risks: string[] = [];
  
  if ((temperament["Colérico"] || 0) > 40) {
    risks.push("Alto índice de personalidades dominantes pode gerar conflitos de poder");
  }
  if ((disc["D"] || 0) > 40 && (disc["S"] || 0) > 30) {
    risks.push("Tensão entre perfis de ação rápida e perfis de estabilidade");
  }
  if ((temperament["Melancólico"] || 0) > 40 && (temperament["Sanguíneo"] || 0) > 30) {
    risks.push("Diferenças entre perfis detalhistas e perfis mais flexíveis");
  }
  
  return risks.length > 0 ? risks : ["Nenhum risco significativo identificado"];
}

function generateLeadershipIndicators(disc: Record<string, number>, enneagram: Record<string, number>): string[] {
  const indicators: string[] = [];
  
  if ((disc["D"] || 0) > 20) {
    indicators.push("Presença de perfis com potencial de liderança diretiva");
  }
  if ((disc["I"] || 0) > 20) {
    indicators.push("Potencial para liderança inspiracional");
  }
  if ((enneagram["8"] || 0) > 15) {
    indicators.push("Líderes naturais orientados a resultados");
  }
  if ((enneagram["3"] || 0) > 15) {
    indicators.push("Perfis orientados a conquistas e metas");
  }
  
  return indicators.length > 0 ? indicators : ["Dados insuficientes para análise de liderança"];
}

function generateTeamBuildingSuggestions(temperament: Record<string, number>): string[] {
  const suggestions: string[] = [];
  
  suggestions.push("Organizar atividades que equilibrem ação e reflexão");
  
  if ((temperament["Sanguíneo"] || 0) > 20) {
    suggestions.push("Incluir dinâmicas de grupo e interação social");
  }
  if ((temperament["Melancólico"] || 0) > 20) {
    suggestions.push("Reservar tempo para planejamento e preparação individual");
  }
  if ((temperament["Fleumático"] || 0) > 20) {
    suggestions.push("Criar ambiente de confiança e colaboração");
  }
  
  return suggestions;
}

function generateManagementRecommendations(disc: Record<string, number>, temperament: Record<string, number>): string[] {
  const recommendations: string[] = [];
  
  if ((disc["D"] || 0) > 30) {
    recommendations.push("Oferecer autonomia e desafios claros para perfis D");
  }
  if ((disc["I"] || 0) > 30) {
    recommendations.push("Criar oportunidades de reconhecimento público para perfis I");
  }
  if ((disc["S"] || 0) > 30) {
    recommendations.push("Manter consistência e comunicação clara para perfis S");
  }
  if ((disc["C"] || 0) > 30) {
    recommendations.push("Fornecer dados e tempo de análise para perfis C");
  }
  
  if ((temperament["Colérico"] || 0) > 30) {
    recommendations.push("Canalizar energia em projetos de alto impacto");
  }
  
  return recommendations.length > 0 ? recommendations : ["Aplicar gestão situacional conforme perfil individual"];
}
