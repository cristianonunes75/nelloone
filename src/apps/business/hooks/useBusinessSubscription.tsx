import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useBusinessAuth } from './useBusinessAuth';
import { toast } from 'sonner';

export interface BusinessSubscription {
  subscribed: boolean;
  status: 'trial' | 'active' | 'cancelled' | 'past_due';
  tier: 'trial' | 'starter' | 'growth' | 'enterprise' | 'corporate';
  maxCollaborators: number;
  currentCollaborators: number;
  subscriptionEnd: string | null;
  seatsTotal: number;
  seatsUsed: number;
  seatsAvailable: number;
}

export const BUSINESS_TIERS = {
  trial: {
    name: 'Trial',
    pricePerMonth: 0,
    maxCollaborators: 10,
    features: ['Até 10 colaboradores', '14 dias grátis', 'Insights básicos'],
  },
  starter: {
    name: 'Starter',
    pricePerMonth: 97,
    maxCollaborators: 10,
    features: ['Até 10 colaboradores', 'Insights de equipe', 'Relatórios básicos'],
  },
  growth: {
    name: 'Growth',
    pricePerMonth: 247,
    maxCollaborators: 30,
    features: ['Até 30 colaboradores', 'Insights avançados', 'Relatórios completos', 'Suporte prioritário'],
  },
  enterprise: {
    name: 'Enterprise',
    pricePerMonth: 497,
    maxCollaborators: 100,
    features: ['Até 100 colaboradores', 'Insights ilimitados', 'API de integração', 'Gerente de conta dedicado'],
  },
} as const;

export function useBusinessSubscription() {
  const { company, isCompanyAdmin } = useBusinessAuth();
  const [subscription, setSubscription] = useState<BusinessSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const checkSubscription = useCallback(async ({ silent = false }: { silent?: boolean } = {}) => {
    if (!company?.id) return;
    
    if (!silent) {
      setIsLoading(true);
    }
    try {
      const { data, error } = await supabase.functions.invoke('business-check-subscription', {
        body: { companyId: company.id },
      });

      if (error) throw error;

      setSubscription({
        subscribed: data.subscribed,
        status: data.status,
        tier: data.tier,
        maxCollaborators: data.maxCollaborators,
        currentCollaborators: data.currentCollaborators,
        subscriptionEnd: data.subscriptionEnd,
        seatsTotal: data.maxCollaborators,
        seatsUsed: data.currentCollaborators,
        seatsAvailable: Math.max(0, data.maxCollaborators - data.currentCollaborators),
      });
    } catch (error: any) {
      console.error('Error checking subscription:', error);
      // Set default trial state on error
      setSubscription({
        subscribed: false,
        status: 'trial',
        tier: 'trial',
        maxCollaborators: 10,
        currentCollaborators: 0,
        subscriptionEnd: null,
        seatsTotal: 10,
        seatsUsed: 0,
        seatsAvailable: 10,
      });
    } finally {
      if (!silent) {
        setIsLoading(false);
      }
    }
  }, [company?.id]);

  const startCheckout = async (tier: 'starter' | 'growth' | 'enterprise') => {
    if (!company?.id || !isCompanyAdmin) {
      toast.error('Apenas administradores podem gerenciar assinaturas');
      return;
    }

    setIsCheckingOut(true);
    try {
      const { data, error } = await supabase.functions.invoke('business-checkout', {
        body: { tier, companyId: company.id },
      });

      if (error) throw error;
      
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error: any) {
      console.error('Error starting checkout:', error);
      toast.error('Erro ao iniciar checkout. Tente novamente.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  const openCustomerPortal = async () => {
    if (!company?.id || !isCompanyAdmin) {
      toast.error('Apenas administradores podem gerenciar assinaturas');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('business-customer-portal', {
        body: { companyId: company.id },
      });

      if (error) throw error;
      
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error: any) {
      console.error('Error opening customer portal:', error);
      toast.error('Erro ao abrir portal. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Check subscription on mount and when company changes
  useEffect(() => {
    checkSubscription();
  }, [checkSubscription]);

  // Auto-refresh subscription status periodically
  useEffect(() => {
    if (!company?.id) return;

    const interval = setInterval(() => {
      checkSubscription({ silent: true });
    }, 60000);

    return () => clearInterval(interval);
  }, [company?.id, checkSubscription]);

  // Check for subscription success in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('subscription') === 'success') {
      toast.success('Assinatura ativada com sucesso!');
      checkSubscription();
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname);
    } else if (params.get('subscription') === 'cancelled') {
      toast.info('Checkout cancelado');
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [checkSubscription]);

  const canAddCollaborators = subscription 
    ? subscription.currentCollaborators < subscription.maxCollaborators
    : true;

  const remainingSlots = subscription
    ? subscription.maxCollaborators - subscription.currentCollaborators
    : 10;

  return {
    subscription,
    isLoading,
    isCheckingOut,
    checkSubscription,
    startCheckout,
    openCustomerPortal,
    canAddCollaborators,
    remainingSlots,
    tiers: BUSINESS_TIERS,
  };
}
