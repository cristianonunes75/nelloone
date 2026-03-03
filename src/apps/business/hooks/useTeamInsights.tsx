/**
 * Hook for fetching and managing Team Insights.
 * Calls the business-team-insights edge function and logs access for LGPD.
 */

import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useBusinessAuth } from './useBusinessAuth';
import { toast } from 'sonner';

export interface EssenceCodeInsights {
  total_with_journey_complete: number;
  total_with_essence_code: number;
  completion_rate: number;
}

export interface TeamInsightsData {
  total_members: number;
  completed_assessments: number;
  temperament_distribution: Record<string, number>;
  disc_distribution: Record<string, number>;
  enneagram_distribution: Record<string, number>;
  team_strengths: string[];
  team_growth_areas: string[];
  communication_styles: Record<string, number>;
  conflict_risk_areas: string[];
  leadership_potential_indicators: string[];
  team_building_suggestions: string[];
  management_recommendations: string[];
  essence_code?: EssenceCodeInsights;
}

export interface HealthAlert {
  id: string;
  alert_type: string;
  severity: string;
  title: string;
  description: string | null;
  status: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export function useTeamInsights() {
  const { company } = useBusinessAuth();
  const [insights, setInsights] = useState<TeamInsightsData | null>(null);
  const [alerts, setAlerts] = useState<HealthAlert[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastCalculated, setLastCalculated] = useState<string | null>(null);

  const fetchInsights = useCallback(async () => {
    if (!company?.id) return;
    setIsLoading(true);

    try {
      // First try cached insights
      const { data: cached } = await supabase
        .from('company_team_insights')
        .select('*')
        .eq('company_id', company.id)
        .maybeSingle();

      if (cached) {
        const cachedData: TeamInsightsData = {
          total_members: cached.total_members || 0,
          completed_assessments: cached.completed_assessments || 0,
          temperament_distribution: (cached.temperament_distribution as Record<string, number>) || {},
          disc_distribution: (cached.disc_distribution as Record<string, number>) || {},
          enneagram_distribution: (cached.enneagram_distribution as Record<string, number>) || {},
          team_strengths: (cached.team_strengths as string[]) || [],
          team_growth_areas: (cached.team_growth_areas as string[]) || [],
          communication_styles: (cached.communication_styles as Record<string, number>) || {},
          conflict_risk_areas: (cached.conflict_risk_areas as string[]) || [],
          leadership_potential_indicators: (cached.leadership_potential_indicators as string[]) || [],
          team_building_suggestions: (cached.team_building_suggestions as string[]) || [],
          management_recommendations: (cached.management_recommendations as string[]) || [],
        };
        // essence_code may be stored in the cached record if the edge function populated it
        const rawEssence = (cached as Record<string, unknown>).essence_code;
        if (rawEssence && typeof rawEssence === 'object') {
          cachedData.essence_code = rawEssence as EssenceCodeInsights;
        }
        setInsights(cachedData);
        setLastCalculated(cached.last_calculated_at);
      }

      // Fetch health alerts
      const { data: alertsData } = await supabase
        .from('business_health_alerts')
        .select('*')
        .eq('company_id', company.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(10);

      setAlerts((alertsData || []) as HealthAlert[]);
    } catch (err) {
      console.error('Error fetching insights:', err);
    } finally {
      setIsLoading(false);
    }
  }, [company?.id]);

  const recalculateInsights = useCallback(async () => {
    if (!company?.id) return;
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('business-team-insights', {
        body: { company_id: company.id },
      });

      if (error) throw error;

      if (data?.insights) {
        setInsights(data.insights);
        setLastCalculated(new Date().toISOString());
        toast.success('Insights atualizados');
      }
    } catch (err) {
      console.error('Error recalculating insights:', err);
      toast.error('Erro ao calcular insights');
    } finally {
      setIsLoading(false);
    }
  }, [company?.id]);

  return {
    insights,
    alerts,
    isLoading,
    lastCalculated,
    fetchInsights,
    recalculateInsights,
  };
}
