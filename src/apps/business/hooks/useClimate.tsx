import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useBusinessAuth } from './useBusinessAuth';
import { toast } from 'sonner';

export interface ClimateCycle {
  id: string;
  company_id: string;
  created_by: string;
  title: string;
  start_date: string;
  end_date: string | null;
  status: 'draft' | 'active' | 'closed';
  overall_score: number | null;
  dimension_scores: Record<string, number>;
  total_responses: number;
  created_at: string;
}

export const DIMENSION_LABELS: Record<string, string> = {
  lideranca: 'Liderança',
  comunicacao: 'Comunicação',
  reconhecimento: 'Reconhecimento',
  cultura: 'Cultura',
  crescimento: 'Crescimento',
  carga_trabalho: 'Carga de Trabalho',
};

export function getClimateClassification(score: number | null): { label: string; color: string } {
  if (score === null) return { label: '—', color: 'text-muted-foreground' };
  if (score >= 4) return { label: 'Saudável', color: 'text-green-500' };
  if (score >= 3) return { label: 'Atenção', color: 'text-amber-500' };
  return { label: 'Risco', color: 'text-red-500' };
}

export function useClimate() {
  const { company } = useBusinessAuth();
  const [cycles, setCycles] = useState<ClimateCycle[]>([]);
  const [activeCycle, setActiveCycle] = useState<ClimateCycle | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCycles = useCallback(async () => {
    if (!company?.id) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('company_climate_cycles')
        .select('*')
        .eq('company_id', company.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      const typed = (data || []) as unknown as ClimateCycle[];
      setCycles(typed);
      setActiveCycle(typed.find(c => c.status === 'active') || typed.find(c => c.status === 'closed') || null);
    } catch (err) {
      console.error('Error fetching climate cycles:', err);
    } finally {
      setIsLoading(false);
    }
  }, [company?.id]);

  const createCycle = useCallback(async (title: string, endDate?: string) => {
    if (!company?.id) return null;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('company_climate_cycles')
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
      toast.success('Ciclo de clima criado');
      await fetchCycles();
      return data;
    } catch (err) {
      console.error('Error creating climate cycle:', err);
      toast.error('Erro ao criar ciclo de clima');
      return null;
    }
  }, [company?.id, fetchCycles]);

  const activateCycle = useCallback(async (cycleId: string) => {
    try {
      const { error } = await supabase
        .from('company_climate_cycles')
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
        .from('company_climate_cycles')
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

  return { cycles, activeCycle, isLoading, fetchCycles, createCycle, activateCycle, closeCycle };
}
