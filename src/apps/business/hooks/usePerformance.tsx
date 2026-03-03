import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useBusinessAuth } from './useBusinessAuth';
import { toast } from 'sonner';

export interface PerformanceCycle {
  id: string;
  company_id: string;
  created_by: string;
  title: string;
  review_type: '90' | '180' | '360';
  start_date: string;
  end_date: string | null;
  status: 'draft' | 'active' | 'closed';
  created_at: string;
}

export interface PerformanceReview {
  id: string;
  cycle_id: string;
  company_user_id: string;
  reviewer_company_user_id: string | null;
  template_id: string | null;
  status: 'pending' | 'submitted' | 'closed';
  overall_score: number | null;
  is_anonymous: boolean;
  created_at: string;
  submitted_at: string | null;
}

export interface PerformanceAnswer {
  id: string;
  review_id: string;
  dimension: 'competence' | 'goal' | 'values';
  question: string;
  score: number | null;
  comment_text: string | null;
  created_at: string;
}

export function usePerformance() {
  const { company } = useBusinessAuth();
  const [cycles, setCycles] = useState<PerformanceCycle[]>([]);
  const [activeCycle, setActiveCycle] = useState<PerformanceCycle | null>(null);
  const [reviews, setReviews] = useState<PerformanceReview[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCycles = useCallback(async () => {
    if (!company?.id) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('company_performance_cycles')
        .select('*')
        .eq('company_id', company.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      const typed = (data || []) as unknown as PerformanceCycle[];
      setCycles(typed);
      setActiveCycle(typed.find(c => c.status === 'active') || typed.find(c => c.status === 'closed') || null);
    } catch (err) {
      console.error('Error fetching performance cycles:', err);
    } finally {
      setIsLoading(false);
    }
  }, [company?.id]);

  const createCycle = useCallback(async (title: string, reviewType: string, endDate?: string) => {
    if (!company?.id) return null;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('company_performance_cycles')
        .insert({
          company_id: company.id,
          created_by: user.id,
          title,
          review_type: reviewType,
          end_date: endDate || null,
          status: 'draft',
        })
        .select()
        .single();

      if (error) throw error;
      toast.success('Ciclo de performance criado');
      await fetchCycles();
      return data;
    } catch (err) {
      console.error('Error creating performance cycle:', err);
      toast.error('Erro ao criar ciclo');
      return null;
    }
  }, [company?.id, fetchCycles]);

  const activateCycle = useCallback(async (cycleId: string) => {
    try {
      const { error } = await supabase
        .from('company_performance_cycles')
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
        .from('company_performance_cycles')
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

  const fetchReviews = useCallback(async (cycleId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('company_performance_reviews')
        .select('*')
        .eq('cycle_id', cycleId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setReviews((data || []) as unknown as PerformanceReview[]);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createReview = useCallback(async (cycleId: string, companyUserId: string, reviewerCompanyUserId: string) => {
    try {
      const { error } = await supabase
        .from('company_performance_reviews')
        .insert({
          cycle_id: cycleId,
          company_user_id: companyUserId,
          reviewer_company_user_id: reviewerCompanyUserId,
          status: 'pending',
        });
      if (error) throw error;
      toast.success('Avaliação criada');
      await fetchReviews(cycleId);
    } catch (err) {
      console.error('Error creating review:', err);
      toast.error('Erro ao criar avaliação');
    }
  }, [fetchReviews]);

  const submitAnswers = useCallback(async (reviewId: string, answers: Array<{ dimension: string; question: string; score: number; comment_text?: string }>) => {
    try {
      const inserts = answers.map(a => ({
        review_id: reviewId,
        dimension: a.dimension,
        question: a.question,
        score: a.score,
        comment_text: a.comment_text || null,
      }));
      const { error: ansErr } = await supabase
        .from('company_performance_answers')
        .insert(inserts);
      if (ansErr) throw ansErr;

      const { error: upErr } = await supabase
        .from('company_performance_reviews')
        .update({ status: 'submitted', submitted_at: new Date().toISOString() })
        .eq('id', reviewId);
      if (upErr) throw upErr;

      // Recalculate score via RPC
      await supabase.rpc('recalculate_review_score', { _review_id: reviewId });

      toast.success('Avaliação enviada');
    } catch (err) {
      console.error('Error submitting answers:', err);
      toast.error('Erro ao enviar avaliação');
    }
  }, []);

  return {
    cycles, activeCycle, reviews, isLoading,
    fetchCycles, createCycle, activateCycle, closeCycle,
    fetchReviews, createReview, submitAnswers,
  };
}
