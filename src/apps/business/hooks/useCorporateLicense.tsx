import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useBusinessAuth } from './useBusinessAuth';
import { toast } from 'sonner';

export interface CorporateLicense {
  seatsTotal: number;
  seatsUsed: number;
  seatsAvailable: number;
  stripeSubscriptionId: string | null;
  operatorId: string | null;
  status: string | null;
}

export function useCorporateLicense() {
  const { company, isCompanyAdmin } = useBusinessAuth();
  const [license, setLicense] = useState<CorporateLicense | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isManagingSeats, setIsManagingSeats] = useState(false);

  const fetchLicense = useCallback(async () => {
    if (!company?.id) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('company_subscriptions')
        .select('seats_total, seats_used, stripe_subscription_id, operator_id, status')
        .eq('company_id', company.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        // Also count actual active users
        const { count } = await supabase
          .from('company_users')
          .select('id', { count: 'exact', head: true })
          .eq('company_id', company.id)
          .eq('is_active', true);

        const seatsUsed = count || 0;
        const seatsTotal = data.seats_total || 10;

        setLicense({
          seatsTotal,
          seatsUsed,
          seatsAvailable: Math.max(0, seatsTotal - seatsUsed),
          stripeSubscriptionId: data.stripe_subscription_id,
          operatorId: data.operator_id,
          status: data.status,
        });
      } else {
        setLicense({
          seatsTotal: 10,
          seatsUsed: 0,
          seatsAvailable: 10,
          stripeSubscriptionId: null,
          operatorId: null,
          status: 'trial',
        });
      }
    } catch (error) {
      console.error('Error fetching license:', error);
    } finally {
      setIsLoading(false);
    }
  }, [company?.id]);

  const startCorporateCheckout = async (seats: number, operatorId?: string) => {
    if (!company?.id || !isCompanyAdmin) {
      toast.error('Apenas administradores podem gerenciar licenças');
      return;
    }

    setIsCheckingOut(true);
    try {
      const { data, error } = await supabase.functions.invoke('corporate-identity-checkout', {
        body: { companyId: company.id, seats, operatorId },
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

  const updateSeats = async (newSeats: number) => {
    if (!company?.id || !isCompanyAdmin) {
      toast.error('Apenas administradores podem gerenciar seats');
      return;
    }

    setIsManagingSeats(true);
    try {
      const { data, error } = await supabase.functions.invoke('corporate-identity-manage-seats', {
        body: { companyId: company.id, newSeats },
      });

      if (error) throw error;

      toast.success(`Seats atualizados para ${newSeats}`);
      await fetchLicense();
    } catch (error: any) {
      console.error('Error updating seats:', error);
      toast.error(error.message || 'Erro ao atualizar seats');
    } finally {
      setIsManagingSeats(false);
    }
  };

  const canInvite = license ? license.seatsUsed < license.seatsTotal : true;

  useEffect(() => {
    fetchLicense();
  }, [fetchLicense]);

  return {
    license,
    isLoading,
    isCheckingOut,
    isManagingSeats,
    canInvite,
    startCorporateCheckout,
    updateSeats,
    refetch: fetchLicense,
  };
}
