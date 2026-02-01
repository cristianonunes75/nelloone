import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import type { Lead, LeadActivity, LeadStatus, LeadSource, ActivityType } from '@/types/leads';

export interface UseLeadsReturn {
  leads: Lead[];
  isLoading: boolean;
  error: string | null;
  createLead: (lead: Partial<Lead>) => Promise<Lead | null>;
  updateLead: (id: string, updates: Partial<Lead>) => Promise<boolean>;
  changeLeadStatus: (id: string, newStatus: LeadStatus, lostReason?: string) => Promise<boolean>;
  addActivity: (leadId: string, type: ActivityType, summary: string) => Promise<boolean>;
  getActivities: (leadId: string) => Promise<LeadActivity[]>;
  refetch: () => Promise<void>;
}

export const useLeads = (): UseLeadsReturn => {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      
      setLeads((data || []) as Lead[]);
    } catch (err) {
      console.error('Error fetching leads:', err);
      setError('Erro ao carregar leads');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const createLead = async (lead: Partial<Lead>): Promise<Lead | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('leads')
        .insert({
          full_name: lead.full_name || '',
          phone: lead.phone || null,
          email: lead.email || null,
          instagram_handle: lead.instagram_handle || null,
          source: lead.source || 'outro',
          status: 'novo',
          owner_user_id: user.id,
          value_estimate: lead.value_estimate || 0,
          notes: lead.notes || null,
          next_action: lead.next_action || null,
          next_action_date: lead.next_action_date || null,
        })
        .select()
        .single();

      if (error) throw error;

      // Log activity for lead creation
      await supabase.from('lead_activities').insert({
        lead_id: data.id,
        type: 'created',
        summary: 'Lead criado',
        created_by: user.id,
      });

      toast.success('Lead criado com sucesso!');
      await fetchLeads();
      return data as Lead;
    } catch (err) {
      console.error('Error creating lead:', err);
      toast.error('Erro ao criar lead');
      return null;
    }
  };

  const updateLead = async (id: string, updates: Partial<Lead>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('leads')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast.success('Lead atualizado!');
      await fetchLeads();
      return true;
    } catch (err) {
      console.error('Error updating lead:', err);
      toast.error('Erro ao atualizar lead');
      return false;
    }
  };

  const changeLeadStatus = async (id: string, newStatus: LeadStatus, lostReason?: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const currentLead = leads.find(l => l.id === id);
      const oldStatus = currentLead?.status || 'novo';

      const updates: Partial<Lead> = { status: newStatus };
      if (newStatus === 'fechado_perdido' && lostReason) {
        updates.lost_reason = lostReason;
      }

      const { error } = await supabase
        .from('leads')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      // Log stage change activity
      await supabase.from('lead_activities').insert({
        lead_id: id,
        type: 'stage_change',
        summary: `Mudou de "${oldStatus}" para "${newStatus}"`,
        created_by: user.id,
      });

      await fetchLeads();
      return true;
    } catch (err) {
      console.error('Error changing lead status:', err);
      toast.error('Erro ao mudar status');
      return false;
    }
  };

  const addActivity = async (leadId: string, type: ActivityType, summary: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase.from('lead_activities').insert({
        lead_id: leadId,
        type,
        summary,
        created_by: user.id,
      });

      if (error) throw error;

      toast.success('Atividade registrada!');
      return true;
    } catch (err) {
      console.error('Error adding activity:', err);
      toast.error('Erro ao registrar atividade');
      return false;
    }
  };

  const getActivities = async (leadId: string): Promise<LeadActivity[]> => {
    try {
      const { data, error } = await supabase
        .from('lead_activities')
        .select('*')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as LeadActivity[];
    } catch (err) {
      console.error('Error fetching activities:', err);
      return [];
    }
  };

  return {
    leads,
    isLoading,
    error,
    createLead,
    updateLead,
    changeLeadStatus,
    addActivity,
    getActivities,
    refetch: fetchLeads,
  };
};
