import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface UsageLimit {
  used: number;
  limit: number;
  remaining: number;
  isPremium: boolean;
  resetDate?: string;
}

interface FeatureUsageState {
  life_discernments: UsageLimit;
  flow_sparks: UsageLimit;
  [key: string]: UsageLimit;
}

const DEFAULT_LIMITS = {
  life_discernments: { free: 3, premium: Infinity },
  flow_sparks: { free: 1, premium: Infinity },
};

export function useFeatureUsage() {
  const { user } = useAuth();
  const [usage, setUsage] = useState<FeatureUsageState>({
    life_discernments: { used: 0, limit: 3, remaining: 3, isPremium: false },
    flow_sparks: { used: 0, limit: 1, remaining: 1, isPremium: false },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [subscriptions, setSubscriptions] = useState<{
    life: boolean;
    flow: boolean;
  }>({ life: false, flow: false });

  // Check subscriptions status
  const checkSubscriptions = useCallback(async () => {
    if (!user) return;

    try {
      // Check Flow subscription
      const { data: flowData } = await supabase.functions.invoke('flow-check-subscription');
      const hasFlowSub = flowData?.subscribed || false;

      // For Life, check if there's an active subscription (we'll add this edge function)
      // For now, assume no premium until we create the function
      const hasLifeSub = false;

      setSubscriptions({
        life: hasLifeSub,
        flow: hasFlowSub,
      });
    } catch (error) {
      console.error('Error checking subscriptions:', error);
    }
  }, [user]);

  // Fetch current usage from database
  const fetchUsage = useCallback(async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      // Get usage from the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data, error } = await supabase
        .from('nello_user_activity')
        .select('activity_type, app_source, created_at')
        .eq('user_id', user.id)
        .gte('created_at', thirtyDaysAgo.toISOString());

      if (error) throw error;

      // Count usage by feature
      const lifeDiscernments = data?.filter(
        a => a.app_source === 'life' && a.activity_type === 'discernment'
      ).length || 0;

      const flowSparks = data?.filter(
        a => a.app_source === 'flow' && a.activity_type === 'spark_generated'
      ).length || 0;

      // Update usage state
      const lifeLimit = subscriptions.life ? Infinity : DEFAULT_LIMITS.life_discernments.free;
      const flowLimit = subscriptions.flow ? Infinity : DEFAULT_LIMITS.flow_sparks.free;

      setUsage({
        life_discernments: {
          used: lifeDiscernments,
          limit: lifeLimit,
          remaining: Math.max(0, lifeLimit - lifeDiscernments),
          isPremium: subscriptions.life,
          resetDate: getResetDate(),
        },
        flow_sparks: {
          used: flowSparks,
          limit: flowLimit,
          remaining: Math.max(0, flowLimit - flowSparks),
          isPremium: subscriptions.flow,
        },
      });
    } catch (error) {
      console.error('Error fetching usage:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, subscriptions]);

  // Get the next reset date (first of next month)
  const getResetDate = (): string => {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    return nextMonth.toISOString();
  };

  // Track usage of a feature
  const trackUsage = useCallback(async (
    feature: 'life_discernments' | 'flow_sparks',
    metadata?: Record<string, any>
  ): Promise<boolean> => {
    if (!user?.id) return false;

    const currentUsage = usage[feature];
    
    // Check if user has remaining uses or is premium
    if (!currentUsage.isPremium && currentUsage.remaining <= 0) {
      return false; // No remaining uses
    }

    try {
      // Log the activity
      const appSource = feature === 'life_discernments' ? 'life' : 'flow';
      const activityType = feature === 'life_discernments' ? 'discernment' : 'spark_generated';

      await supabase.from('nello_user_activity').insert({
        user_id: user.id,
        app_source: appSource,
        activity_type: activityType,
        title: `${activityType} used`,
        metadata: metadata || {},
      });

      // Update local state
      setUsage(prev => ({
        ...prev,
        [feature]: {
          ...prev[feature],
          used: prev[feature].used + 1,
          remaining: Math.max(0, prev[feature].remaining - 1),
        },
      }));

      return true;
    } catch (error) {
      console.error('Error tracking usage:', error);
      return false;
    }
  }, [user?.id, usage]);

  // Check if a feature can be used
  const canUseFeature = useCallback((feature: 'life_discernments' | 'flow_sparks'): boolean => {
    const currentUsage = usage[feature];
    return currentUsage.isPremium || currentUsage.remaining > 0;
  }, [usage]);

  // Effect to load initial data
  useEffect(() => {
    if (user?.id) {
      checkSubscriptions().then(() => fetchUsage());
    } else {
      setIsLoading(false);
    }
  }, [user?.id, checkSubscriptions, fetchUsage]);

  // Refresh usage when subscriptions change
  useEffect(() => {
    if (user?.id) {
      fetchUsage();
    }
  }, [subscriptions, fetchUsage, user?.id]);

  return {
    usage,
    isLoading,
    subscriptions,
    trackUsage,
    canUseFeature,
    refreshUsage: fetchUsage,
    refreshSubscriptions: checkSubscriptions,
  };
}
