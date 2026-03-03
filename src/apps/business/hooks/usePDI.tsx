import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useBusinessAuth } from './useBusinessAuth';
import { toast } from 'sonner';

export interface PDIPlan {
  id: string;
  company_id: string;
  company_user_id: string;
  created_by: string;
  status: 'active' | 'completed' | 'paused';
  start_date: string;
  target_date: string | null;
  created_at: string;
}

export interface PDIGoal {
  id: string;
  pdi_plan_id: string;
  title: string;
  description: string | null;
  category: 'skill' | 'behavior' | 'leadership' | 'delivery';
  priority: 'low' | 'medium' | 'high';
  success_metric: string | null;
  deadline: string | null;
  status: 'not_started' | 'in_progress' | 'completed';
  created_at: string;
}

export interface PDIAction {
  id: string;
  pdi_goal_id: string;
  action_text: string;
  frequency: string | null;
  owner: 'self' | 'manager';
  due_date: string | null;
  status: 'not_started' | 'in_progress' | 'completed';
  created_at: string;
}

export interface PDICheckin {
  id: string;
  pdi_plan_id: string;
  checkin_date: string;
  progress_notes: string | null;
  blockers: string | null;
  next_steps: string | null;
  mood_score: number | null;
  created_at: string;
}

export function usePDI() {
  const { company } = useBusinessAuth();
  const [plans, setPlans] = useState<PDIPlan[]>([]);
  const [goals, setGoals] = useState<PDIGoal[]>([]);
  const [checkins, setCheckins] = useState<PDICheckin[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPlans = useCallback(async () => {
    if (!company?.id) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('company_pdi_plans')
        .select('*')
        .eq('company_id', company.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setPlans((data || []) as unknown as PDIPlan[]);
    } catch (err) {
      console.error('Error fetching PDI plans:', err);
    } finally {
      setIsLoading(false);
    }
  }, [company?.id]);

  const createPlan = useCallback(async (companyUserId: string, targetDate?: string) => {
    if (!company?.id) return null;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('company_pdi_plans')
        .insert({
          company_id: company.id,
          company_user_id: companyUserId,
          created_by: user.id,
          target_date: targetDate || null,
          status: 'active',
        })
        .select()
        .single();
      if (error) throw error;
      toast.success('PDI criado');
      await fetchPlans();
      return data;
    } catch (err) {
      console.error('Error creating PDI:', err);
      toast.error('Erro ao criar PDI');
      return null;
    }
  }, [company?.id, fetchPlans]);

  const fetchGoals = useCallback(async (planId: string) => {
    try {
      const { data, error } = await supabase
        .from('company_pdi_goals')
        .select('*')
        .eq('pdi_plan_id', planId)
        .order('created_at');
      if (error) throw error;
      setGoals((data || []) as unknown as PDIGoal[]);
    } catch (err) {
      console.error('Error fetching goals:', err);
    }
  }, []);

  const addGoal = useCallback(async (planId: string, goal: { title: string; description?: string; category: string; priority: string; success_metric?: string; deadline?: string }) => {
    try {
      const { error } = await supabase
        .from('company_pdi_goals')
        .insert({
          pdi_plan_id: planId,
          title: goal.title,
          description: goal.description || null,
          category: goal.category,
          priority: goal.priority,
          success_metric: goal.success_metric || null,
          deadline: goal.deadline || null,
          status: 'not_started',
        });
      if (error) throw error;
      toast.success('Meta adicionada');
      await fetchGoals(planId);
    } catch (err) {
      console.error('Error adding goal:', err);
      toast.error('Erro ao adicionar meta');
    }
  }, [fetchGoals]);

  const updateGoalStatus = useCallback(async (goalId: string, status: string, planId: string) => {
    try {
      const { error } = await supabase
        .from('company_pdi_goals')
        .update({ status })
        .eq('id', goalId);
      if (error) throw error;
      await fetchGoals(planId);
    } catch (err) {
      console.error('Error updating goal:', err);
    }
  }, [fetchGoals]);

  const fetchCheckins = useCallback(async (planId: string) => {
    try {
      const { data, error } = await supabase
        .from('company_pdi_checkins')
        .select('*')
        .eq('pdi_plan_id', planId)
        .order('checkin_date', { ascending: false });
      if (error) throw error;
      setCheckins((data || []) as unknown as PDICheckin[]);
    } catch (err) {
      console.error('Error fetching checkins:', err);
    }
  }, []);

  const addCheckin = useCallback(async (planId: string, data: { progress_notes?: string; blockers?: string; next_steps?: string; mood_score?: number }) => {
    try {
      const { error } = await supabase
        .from('company_pdi_checkins')
        .insert({
          pdi_plan_id: planId,
          progress_notes: data.progress_notes || null,
          blockers: data.blockers || null,
          next_steps: data.next_steps || null,
          mood_score: data.mood_score || null,
        });
      if (error) throw error;
      toast.success('Check-in registrado');
      await fetchCheckins(planId);
    } catch (err) {
      console.error('Error adding checkin:', err);
      toast.error('Erro ao registrar check-in');
    }
  }, [fetchCheckins]);

  const activePlans = plans.filter(p => p.status === 'active');
  const completedGoals = goals.filter(g => g.status === 'completed').length;
  const totalGoals = goals.length;
  const progressPct = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

  return {
    plans, goals, checkins, isLoading, activePlans,
    completedGoals, totalGoals, progressPct,
    fetchPlans, createPlan, fetchGoals, addGoal, updateGoalStatus,
    fetchCheckins, addCheckin,
  };
}
