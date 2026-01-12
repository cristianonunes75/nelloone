import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Alert type definitions
interface AlertConfig {
  type: string;
  severity: 'critical' | 'warning' | 'positive';
  title: string;
  getDescription: (data: any) => string;
}

const ALERT_CONFIGS: Record<string, AlertConfig> = {
  trial_expiring: {
    type: 'trial_expiring',
    severity: 'critical',
    title: 'Trial expirando',
    getDescription: (data) => `Trial expira em ${data.daysLeft} dia(s)`,
  },
  no_activation: {
    type: 'no_activation',
    severity: 'critical',
    title: 'Sem ativação',
    getDescription: (data) => `${data.daysSinceCreation} dias desde cadastro, 0 jornadas completas`,
  },
  insights_not_generated: {
    type: 'insights_not_generated',
    severity: 'critical',
    title: 'Insights não gerados',
    getDescription: () => 'Colaboradores com toggle ativo, mas insights vazios',
  },
  overuse: {
    type: 'overuse',
    severity: 'critical',
    title: 'Acima do limite',
    getDescription: (data) => `${data.current} colaboradores ativos (limite: ${data.max})`,
  },
  low_sharing: {
    type: 'low_sharing',
    severity: 'warning',
    title: 'Baixa adesão ao compartilhamento',
    getDescription: (data) => `Apenas ${data.percent}% dos colaboradores com toggle ativo`,
  },
  inactive: {
    type: 'inactive',
    severity: 'warning',
    title: 'Empresa inativa',
    getDescription: (data) => `${data.daysSinceLastActivity} dias sem novos testes completados`,
  },
  well_activated: {
    type: 'well_activated',
    severity: 'positive',
    title: 'Empresa bem ativada',
    getDescription: (data) => `${data.percent}% dos colaboradores com jornada completa`,
  },
  ready_for_upsell: {
    type: 'ready_for_upsell',
    severity: 'positive',
    title: 'Pronta para upsell',
    getDescription: (data) => `Uso saudável, ${data.current}/${data.max} colaboradores`,
  },
};

serve(async (req) => {
  console.log("business-health-check: Starting health check");

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch all companies with their subscriptions
    const { data: companies, error: companiesError } = await supabase
      .from('companies')
      .select('*');

    if (companiesError) throw companiesError;

    console.log(`business-health-check: Processing ${companies?.length || 0} companies`);

    const { data: subscriptions } = await supabase
      .from('company_subscriptions')
      .select('*');

    const { data: companyUsers } = await supabase
      .from('company_users')
      .select('company_id, user_id, is_active, share_report_with_company');

    // Get profiles with journey info
    const userIds = [...new Set((companyUsers || []).map(cu => cu.user_id))];
    
    let profiles: any[] = [];
    if (userIds.length > 0) {
      const { data } = await supabase
        .from('profiles')
        .select('id, journey_status, updated_at');
      profiles = data || [];
    }

    // Get team insights
    const { data: teamInsights } = await supabase
      .from('company_team_insights')
      .select('company_id, total_members, completed_assessments');

    // Clear old non-resolved alerts before generating new ones
    // We'll mark them as resolved if they no longer apply
    const { data: existingAlerts } = await supabase
      .from('business_health_alerts')
      .select('id, company_id, alert_type, status')
      .eq('status', 'new');

    const newAlerts: any[] = [];
    const alertsToResolve: string[] = [];
    const now = new Date();

    for (const company of (companies || [])) {
      const subscription = (subscriptions || []).find(s => s.company_id === company.id);
      const users = (companyUsers || []).filter(cu => cu.company_id === company.id);
      const activeUsers = users.filter(cu => cu.is_active);
      const sharingEnabled = users.filter(cu => cu.share_report_with_company === true);
      const insights = (teamInsights || []).find(ti => ti.company_id === company.id);

      // Get user profiles for this company
      const companyProfiles = profiles.filter(p => 
        users.some(u => u.user_id === p.id)
      );
      const completedJourneys = companyProfiles.filter(p => p.journey_status === 'completed');

      // Track which alert types apply to this company
      const activeAlertTypes: string[] = [];

      // 🔴 CRITICAL ALERTS

      // Trial expiring (≤ 3 days)
      if (subscription?.status === 'trialing' && subscription?.trial_ends_at) {
        const trialEnd = new Date(subscription.trial_ends_at);
        const daysLeft = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysLeft <= 3 && daysLeft > 0) {
          activeAlertTypes.push('trial_expiring');
          newAlerts.push({
            company_id: company.id,
            alert_type: 'trial_expiring',
            severity: 'critical',
            title: ALERT_CONFIGS.trial_expiring.title,
            description: ALERT_CONFIGS.trial_expiring.getDescription({ daysLeft }),
            metadata: { daysLeft, trialEndsAt: subscription.trial_ends_at },
          });
        }
      }

      // No activation (≥ 7 days since creation, 0 completed journeys)
      const createdAt = new Date(company.created_at);
      const daysSinceCreation = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysSinceCreation >= 7 && completedJourneys.length === 0 && activeUsers.length > 0) {
        activeAlertTypes.push('no_activation');
        newAlerts.push({
          company_id: company.id,
          alert_type: 'no_activation',
          severity: 'critical',
          title: ALERT_CONFIGS.no_activation.title,
          description: ALERT_CONFIGS.no_activation.getDescription({ daysSinceCreation }),
          metadata: { daysSinceCreation, collaborators: activeUsers.length },
        });
      }

      // Insights not generated
      if (sharingEnabled.length >= 3 && (!insights || !insights.completed_assessments)) {
        activeAlertTypes.push('insights_not_generated');
        newAlerts.push({
          company_id: company.id,
          alert_type: 'insights_not_generated',
          severity: 'critical',
          title: ALERT_CONFIGS.insights_not_generated.title,
          description: ALERT_CONFIGS.insights_not_generated.getDescription({}),
          metadata: { sharingEnabled: sharingEnabled.length },
        });
      }

      // Overuse
      const maxCollaborators = subscription?.max_collaborators || 5;
      if (activeUsers.length > maxCollaborators) {
        activeAlertTypes.push('overuse');
        newAlerts.push({
          company_id: company.id,
          alert_type: 'overuse',
          severity: 'critical',
          title: ALERT_CONFIGS.overuse.title,
          description: ALERT_CONFIGS.overuse.getDescription({ current: activeUsers.length, max: maxCollaborators }),
          metadata: { current: activeUsers.length, max: maxCollaborators },
        });
      }

      // 🟡 WARNING ALERTS

      // Low sharing (<30%)
      if (activeUsers.length > 0) {
        const sharingPercent = (sharingEnabled.length / activeUsers.length) * 100;
        if (sharingPercent < 30) {
          activeAlertTypes.push('low_sharing');
          newAlerts.push({
            company_id: company.id,
            alert_type: 'low_sharing',
            severity: 'warning',
            title: ALERT_CONFIGS.low_sharing.title,
            description: ALERT_CONFIGS.low_sharing.getDescription({ percent: Math.round(sharingPercent) }),
            metadata: { percent: sharingPercent, sharing: sharingEnabled.length, total: activeUsers.length },
          });
        }
      }

      // Inactive (14 days without new completed tests)
      const lastCompletedProfile = companyProfiles
        .filter(p => p.journey_status === 'completed')
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())[0];
      
      if (lastCompletedProfile && activeUsers.length > 0) {
        const lastActivity = new Date(lastCompletedProfile.updated_at);
        const daysSinceLastActivity = Math.floor((now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysSinceLastActivity >= 14) {
          activeAlertTypes.push('inactive');
          newAlerts.push({
            company_id: company.id,
            alert_type: 'inactive',
            severity: 'warning',
            title: ALERT_CONFIGS.inactive.title,
            description: ALERT_CONFIGS.inactive.getDescription({ daysSinceLastActivity }),
            metadata: { daysSinceLastActivity },
          });
        }
      }

      // 🟢 POSITIVE ALERTS

      // Well activated (≥60% journeys complete)
      if (activeUsers.length > 0) {
        const activationPercent = (completedJourneys.length / activeUsers.length) * 100;
        if (activationPercent >= 60) {
          activeAlertTypes.push('well_activated');
          newAlerts.push({
            company_id: company.id,
            alert_type: 'well_activated',
            severity: 'positive',
            title: ALERT_CONFIGS.well_activated.title,
            description: ALERT_CONFIGS.well_activated.getDescription({ percent: Math.round(activationPercent) }),
            metadata: { percent: activationPercent, completed: completedJourneys.length, total: activeUsers.length },
          });
        }
      }

      // Ready for upsell (limit reached, healthy usage)
      if (activeUsers.length >= maxCollaborators * 0.9 && completedJourneys.length > 0) {
        const activationPercent = (completedJourneys.length / activeUsers.length) * 100;
        if (activationPercent >= 50) {
          activeAlertTypes.push('ready_for_upsell');
          newAlerts.push({
            company_id: company.id,
            alert_type: 'ready_for_upsell',
            severity: 'positive',
            title: ALERT_CONFIGS.ready_for_upsell.title,
            description: ALERT_CONFIGS.ready_for_upsell.getDescription({ current: activeUsers.length, max: maxCollaborators }),
            metadata: { current: activeUsers.length, max: maxCollaborators, activationPercent },
          });
        }
      }

      // Mark existing alerts as resolved if they no longer apply
      const companyExistingAlerts = (existingAlerts || []).filter(a => a.company_id === company.id);
      for (const alert of companyExistingAlerts) {
        if (!activeAlertTypes.includes(alert.alert_type)) {
          alertsToResolve.push(alert.id);
        }
      }
    }

    // Resolve outdated alerts
    if (alertsToResolve.length > 0) {
      console.log(`business-health-check: Resolving ${alertsToResolve.length} outdated alerts`);
      await supabase
        .from('business_health_alerts')
        .update({ status: 'resolved', resolved_at: now.toISOString() })
        .in('id', alertsToResolve);
    }

    // Insert new alerts (avoid duplicates by checking existing)
    const uniqueNewAlerts: any[] = [];
    for (const alert of newAlerts) {
      const exists = (existingAlerts || []).some(
        ea => ea.company_id === alert.company_id && ea.alert_type === alert.alert_type && ea.status === 'new'
      );
      if (!exists) {
        uniqueNewAlerts.push(alert);
      }
    }

    if (uniqueNewAlerts.length > 0) {
      console.log(`business-health-check: Creating ${uniqueNewAlerts.length} new alerts`);
      const { error: insertError } = await supabase
        .from('business_health_alerts')
        .insert(uniqueNewAlerts);
      
      if (insertError) {
        console.error("business-health-check: Insert error", insertError);
        throw insertError;
      }
    }

    console.log(`business-health-check: Complete - ${uniqueNewAlerts.length} new, ${alertsToResolve.length} resolved`);

    return new Response(
      JSON.stringify({
        success: true,
        alertsCreated: uniqueNewAlerts.length,
        alertsResolved: alertsToResolve.length,
        companiesProcessed: companies?.length || 0,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("business-health-check: Error", error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
