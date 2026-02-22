/**
 * Client and Session management hooks for Nello Praxis.
 * 
 * MIGRATED (v2): Sessions now use operator_sessions table.
 * Milestones now use operator_milestones table.
 * Legacy client_sessions/client_milestones are read-only.
 * 
 * See: /docs/praxis/DOMAIN_MIGRATION.md
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useOperatorWorkspace } from './useOperatorWorkspace';
import { toast } from 'sonner';
import { Json } from '@/integrations/supabase/types';

export interface PraxisClient {
  id: string;
  professional_id: string;
  client_user_id: string | null;
  name: string;
  email: string | null;
  phone: string | null;
  photo_url: string | null;
  notes: string | null;
  status: string;
  session_rate: number | null;
  currency: string;
  total_sessions: number;
  last_session_at: string | null;
  consent_given: boolean;
  consent_given_at: string | null;
  tags: string[];
  metadata: Json;
  created_at: string;
  updated_at: string;
}

export interface ClientSession {
  id: string;
  client_id: string;
  operator_id: string;
  title: string;
  session_date: string;
  duration_minutes: number;
  session_type: string;
  status: string;
  objectives: string | null;
  notes: string | null;
  insights: string | null;
  tasks_for_client: string | null;
  attention_points: string | null;
  tags: string[];
  ai_suggestions: Json | null;
  ai_generated_at: string | null;
  session_rate: number | null;
  currency: string;
  payment_status: string;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface OperatorMilestone {
  id: string;
  operator_id: string;
  client_id: string;
  relationship_id: string | null;
  session_id: string | null;
  title: string;
  description: string | null;
  milestone_type: string;
  milestone_date: string;
  created_at: string;
}

export function usePraxisClients() {
  const { workspace } = useOperatorWorkspace();
  const [clients, setClients] = useState<PraxisClient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const operatorId = workspace?.id;

  const fetchClients = useCallback(async () => {
    if (!operatorId) {
      setClients([]);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('professional_clients')
        .select('*')
        .eq('professional_id', operatorId)
        .order('name');

      if (error) throw error;
      setClients((data || []) as PraxisClient[]);
    } catch (err) {
      console.error('Error fetching clients:', err);
      toast.error('Erro ao carregar clientes');
    } finally {
      setIsLoading(false);
    }
  }, [operatorId]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const createClient = async (data: Partial<PraxisClient>): Promise<PraxisClient | null> => {
    if (!operatorId) return null;

    try {
      const { data: newClient, error } = await supabase
        .from('professional_clients')
        .insert({
          professional_id: operatorId,
          name: data.name || '',
          email: data.email,
          phone: data.phone,
          notes: data.notes,
          session_rate: data.session_rate,
          tags: data.tags || [],
        })
        .select()
        .single();

      if (error) throw error;
      
      const client = newClient as PraxisClient;
      setClients(prev => [...prev, client]);
      toast.success('Cliente adicionado com sucesso');
      return client;
    } catch (err) {
      console.error('Error creating client:', err);
      toast.error('Erro ao criar cliente');
      return null;
    }
  };

  const updateClient = async (id: string, data: Partial<PraxisClient>): Promise<boolean> => {
    try {
      const updateData: Record<string, unknown> = {};
      if (data.name !== undefined) updateData.name = data.name;
      if (data.email !== undefined) updateData.email = data.email;
      if (data.phone !== undefined) updateData.phone = data.phone;
      if (data.notes !== undefined) updateData.notes = data.notes;
      if (data.session_rate !== undefined) updateData.session_rate = data.session_rate;
      if (data.status !== undefined) updateData.status = data.status;

      const { error } = await supabase
        .from('professional_clients')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
      
      setClients(prev => prev.map(c => c.id === id ? { ...c, ...data } as PraxisClient : c));
      toast.success('Cliente atualizado');
      return true;
    } catch (err) {
      console.error('Error updating client:', err);
      toast.error('Erro ao atualizar cliente');
      return false;
    }
  };

  const deleteClient = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('professional_clients')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setClients(prev => prev.filter(c => c.id !== id));
      toast.success('Cliente removido');
      return true;
    } catch (err) {
      console.error('Error deleting client:', err);
      toast.error('Erro ao remover cliente');
      return false;
    }
  };

  const activeClients = clients.filter(c => c.status === 'active');
  const archivedClients = clients.filter(c => c.status === 'archived');

  return {
    clients,
    activeClients,
    archivedClients,
    isLoading,
    refetch: fetchClients,
    createClient,
    updateClient,
    deleteClient,
  };
}

/**
 * Sessions hook - NOW USES operator_sessions table
 */
export function usePraxisSessions(clientId: string | null) {
  const { workspace } = useOperatorWorkspace();
  const [sessions, setSessions] = useState<ClientSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const operatorId = workspace?.id;

  const fetchSessions = useCallback(async () => {
    if (!operatorId || !clientId) {
      setSessions([]);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('operator_sessions')
        .select('*')
        .eq('operator_id', operatorId)
        .eq('client_id', clientId)
        .order('session_date', { ascending: false });

      if (error) throw error;
      setSessions((data || []) as ClientSession[]);
    } catch (err) {
      console.error('Error fetching sessions:', err);
      toast.error('Erro ao carregar sessões');
    } finally {
      setIsLoading(false);
    }
  }, [operatorId, clientId]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const createSession = async (data: Partial<ClientSession>): Promise<ClientSession | null> => {
    if (!operatorId || !clientId) return null;

    try {
      const { data: newSession, error } = await supabase
        .from('operator_sessions')
        .insert({
          operator_id: operatorId,
          client_id: clientId,
          title: data.title || 'Nova Sessão',
          session_date: data.session_date || new Date().toISOString(),
          duration_minutes: data.duration_minutes || 60,
          session_type: data.session_type || 'coaching',
          status: data.status || 'scheduled',
          objectives: data.objectives,
          notes: data.notes,
          insights: data.insights,
          tasks_for_client: data.tasks_for_client,
          attention_points: data.attention_points,
          tags: data.tags || [],
          session_rate: data.session_rate,
        })
        .select()
        .single();

      if (error) throw error;
      
      const session = newSession as ClientSession;
      setSessions(prev => [session, ...prev]);
      toast.success('Sessão criada');
      return session;
    } catch (err) {
      console.error('Error creating session:', err);
      toast.error('Erro ao criar sessão');
      return null;
    }
  };

  const updateSession = async (id: string, data: Partial<ClientSession>): Promise<boolean> => {
    try {
      const updateData: Record<string, unknown> = {};
      if (data.title !== undefined) updateData.title = data.title;
      if (data.session_date !== undefined) updateData.session_date = data.session_date;
      if (data.duration_minutes !== undefined) updateData.duration_minutes = data.duration_minutes;
      if (data.session_type !== undefined) updateData.session_type = data.session_type;
      if (data.status !== undefined) updateData.status = data.status;
      if (data.objectives !== undefined) updateData.objectives = data.objectives;
      if (data.notes !== undefined) updateData.notes = data.notes;
      if (data.insights !== undefined) updateData.insights = data.insights;
      if (data.tasks_for_client !== undefined) updateData.tasks_for_client = data.tasks_for_client;
      if (data.attention_points !== undefined) updateData.attention_points = data.attention_points;
      if (data.tags !== undefined) updateData.tags = data.tags;

      const { error } = await supabase
        .from('operator_sessions')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
      
      setSessions(prev => prev.map(s => s.id === id ? { ...s, ...data } as ClientSession : s));
      toast.success('Sessão atualizada');
      return true;
    } catch (err) {
      console.error('Error updating session:', err);
      toast.error('Erro ao atualizar sessão');
      return false;
    }
  };

  const deleteSession = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('operator_sessions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setSessions(prev => prev.filter(s => s.id !== id));
      toast.success('Sessão removida');
      return true;
    } catch (err) {
      console.error('Error deleting session:', err);
      toast.error('Erro ao remover sessão');
      return false;
    }
  };

  // Upcoming sessions (scheduled, future date)
  const upcomingSessions = sessions.filter(
    s => s.status === 'scheduled' && new Date(s.session_date) >= new Date()
  );

  const completedSessions = sessions.filter(s => s.status === 'completed');

  return {
    sessions,
    upcomingSessions,
    completedSessions,
    isLoading,
    refetch: fetchSessions,
    createSession,
    updateSession,
    deleteSession,
  };
}

/**
 * Milestones hook - uses operator_milestones table
 */
export function usePraxisMilestones(clientId: string | null) {
  const { workspace } = useOperatorWorkspace();
  const [milestones, setMilestones] = useState<OperatorMilestone[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const operatorId = workspace?.id;

  const fetchMilestones = useCallback(async () => {
    if (!operatorId || !clientId) {
      setMilestones([]);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('operator_milestones')
        .select('*')
        .eq('operator_id', operatorId)
        .eq('client_id', clientId)
        .order('milestone_date', { ascending: false });

      if (error) throw error;
      setMilestones((data || []) as OperatorMilestone[]);
    } catch (err) {
      console.error('Error fetching milestones:', err);
    } finally {
      setIsLoading(false);
    }
  }, [operatorId, clientId]);

  useEffect(() => { fetchMilestones(); }, [fetchMilestones]);

  const createMilestone = async (data: Partial<OperatorMilestone>): Promise<OperatorMilestone | null> => {
    if (!operatorId || !clientId) return null;

    try {
      const { data: newMilestone, error } = await supabase
        .from('operator_milestones')
        .insert({
          operator_id: operatorId,
          client_id: clientId,
          title: data.title || '',
          description: data.description,
          milestone_type: data.milestone_type || 'achievement',
          milestone_date: data.milestone_date || new Date().toISOString(),
          session_id: data.session_id,
          relationship_id: data.relationship_id,
        })
        .select()
        .single();

      if (error) throw error;
      const milestone = newMilestone as OperatorMilestone;
      setMilestones(prev => [milestone, ...prev]);
      toast.success('Marco adicionado');
      return milestone;
    } catch (err) {
      console.error('Error creating milestone:', err);
      toast.error('Erro ao criar marco');
      return null;
    }
  };

  const deleteMilestone = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('operator_milestones')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setMilestones(prev => prev.filter(m => m.id !== id));
      toast.success('Marco removido');
      return true;
    } catch (err) {
      console.error('Error deleting milestone:', err);
      toast.error('Erro ao remover marco');
      return false;
    }
  };

  return {
    milestones,
    isLoading,
    refetch: fetchMilestones,
    createMilestone,
    deleteMilestone,
  };
}
