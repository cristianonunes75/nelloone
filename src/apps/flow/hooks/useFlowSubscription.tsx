import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface SubscriptionStatus {
  subscribed: boolean;
  status: 'active' | 'inactive' | 'loading';
  subscription_end?: string;
  subscription_id?: string;
}

export function useFlowSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionStatus>({
    subscribed: false,
    status: 'loading',
  });
  const [loading, setLoading] = useState(true);

  const checkSubscription = useCallback(async () => {
    if (!user) {
      setSubscription({ subscribed: false, status: 'inactive' });
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('flow-check-subscription');
      
      if (error) {
        console.error('Error checking subscription:', error);
        setSubscription({ subscribed: false, status: 'inactive' });
      } else if (data) {
        setSubscription({
          subscribed: data.subscribed,
          status: data.status,
          subscription_end: data.subscription_end,
          subscription_id: data.subscription_id,
        });
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
      setSubscription({ subscribed: false, status: 'inactive' });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    checkSubscription();
  }, [checkSubscription]);

  // Refresh every minute
  useEffect(() => {
    const interval = setInterval(checkSubscription, 60000);
    return () => clearInterval(interval);
  }, [checkSubscription]);

  const startCheckout = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('flow-checkout');
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error starting checkout:', error);
      throw error;
    }
  };

  const openPortal = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('flow-customer-portal');
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error opening portal:', error);
      throw error;
    }
  };

  return {
    subscription,
    loading,
    checkSubscription,
    startCheckout,
    openPortal,
    isSubscribed: subscription.subscribed,
  };
}
