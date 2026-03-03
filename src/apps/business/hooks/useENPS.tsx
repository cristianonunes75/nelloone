import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useBusinessAuth } from './useBusinessAuth';
import { toast } from 'sonner';

export interface ENPSCycle {
  id: string;
  company_id: string;
  created_by: string;
  title: string;
  start_date: string;
  end_date: string | null;
  status: 'draft' | 'active' | 'closed';
  enps_score: number | null;
  promoters_count: number;
  neutrals_count: number;
  detractors_count: number;
  total_responses: number;
  created_at: string;
}

export interface ENPSResponse {
  id: string;
  cycle_id: string;
  company_user_id: string | null;
  score: number;
  comment: string | null;
  anonymous: boolean;
  created_at: string;
}

export function useENPS() {
  const { company } = useBusinessAuth();
  const [cycles, setCycles] = useState<ENPSCycle[]>([]);
  const [activeCycle, setActiveCycle] = useState<ENPSCycle | null>(null);
  const [responses, setResponses] = useState<ENPSResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCycles = useCallback(async () => {
    if (!company?.id) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('company_enps_cycles')
        .select('*')
        .eq('company_id', company.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      const typed = (data || []) as unknown as ENPSCycle[];
      setCycles(typed);
      const active = typed.find(c => c.status === 'active') || null;
      setActiveCycle(active);
    } catch (err) {
      console.error('Error fetching eNPS cycles:', err);
    } finally {
      setIsLoading(false);
    }
  }, [company?.id]);

  const fetchResponses = useCallback(async (cycleId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('company_enps_responses')
        .select('*')
        .eq('cycle_id', cycleId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setResponses((data || []) as unknown as ENPSResponse[]);
    } catch (err) {
      console.error('Error fetching eNPS responses:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createCycle = useCallback(async (title: string, endDate?: string) => {
    if (!company?.id) return null;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('company_enps_cycles')
        .insert({
          company_id: company.id,
          created_by: user.id,
          title,
          end_date: endDate || null,
          status: 'draft',
        })
        .select()
        .single();

      if (error) throw error;
      toast.success('Ciclo eNPS criado');
      await fetchCycles();
      return data;
    } catch (err) {
      console.error('Error creating eNPS cycle:', err);
      toast.error('Erro ao criar ciclo eNPS');
      return null;
    }
  }, [company?.id, fetchCycles]);

  const activateCycle = useCallback(async (cycleId: string) => {
    try {
      const { error } = await supabase
        .from('company_enps_cycles')
        .update({ status: 'active' })
        .eq('id', cycleId);

      if (error) throw error;
      toast.success('Ciclo ativado');
      await fetchCycles();
    } catch (err) {
      console.error('Error activating cycle:', err);
      toast.error('Erro ao ativar ciclo');
    }
  }, [fetchCycles]);

  const closeCycle = useCallback(async (cycleId: string) => {
    try {
      const { error } = await supabase
        .from('company_enps_cycles')
        .update({ status: 'closed' })
        .eq('id', cycleId);

      if (error) throw error;
      toast.success('Ciclo encerrado');
      await fetchCycles();
    } catch (err) {
      console.error('Error closing cycle:', err);
      toast.error('Erro ao encerrar ciclo');
    }
  }, [fetchCycles]);

  return {
    cycles,
    activeCycle,
    responses,
    isLoading,
    fetchCycles,
    fetchResponses,
    createCycle,
    activateCycle,
    closeCycle,
  };
}
