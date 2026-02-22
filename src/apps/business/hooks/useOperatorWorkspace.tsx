import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Json } from '@/integrations/supabase/types';

interface OperatorWorkspace {
  id: string;
  user_id: string;
  professional_profile_id: string | null;
  display_name: string;
  status: string;
  operator_status: string | null;
  settings: Json;
  created_at: string;
  updated_at: string;
}

interface OperatorMethodology {
  id: string;
  operator_id: string;
  name: string;
  description: string | null;
  stages: Json;
  meeting_frequency: string | null;
  recurring_questions: Json;
  rituals: Json;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

interface OperatorTask {
  id: string;
  operator_id: string;
  client_id: string;
  relationship_id: string | null;
  title: string;
  description: string | null;
  due_date: string | null;
  status: string;
  priority: string;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

interface OperatorReflection {
  id: string;
  operator_id: string;
  client_id: string;
  relationship_id: string | null;
  reflection_type: string;
  title: string;
  content: string | null;
  session_id: string | null;
  created_at: string;
}

interface ClientOperatorRelationship {
  id: string;
  operator_id: string;
  client_id: string;
  relationship_started_at: string;
  relationship_ended_at: string | null;
  methodology_name: string | null;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface OperatorContextType {
  workspace: OperatorWorkspace | null;
  isOperator: boolean;
  isLoading: boolean;
  needsOnboarding: boolean;
  methodologies: OperatorMethodology[];
  createWorkspace: (data: { display_name: string }) => Promise<OperatorWorkspace | null>;
  refetch: () => Promise<void>;
}

const OperatorContext = createContext<OperatorContextType | undefined>(undefined);

export function OperatorProvider({ children }: { children: ReactNode }) {
  const { user, isLoading: authLoading } = useAuth();
  const [workspace, setWorkspace] = useState<OperatorWorkspace | null>(null);
  const [methodologies, setMethodologies] = useState<OperatorMethodology[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWorkspace = useCallback(async () => {
    if (!user?.id) {
      setWorkspace(null);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('operator_workspaces')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching operator workspace:', error);
      }

      setWorkspace(data as OperatorWorkspace | null);

      // Fetch methodologies if workspace exists
      if (data) {
        const { data: methData } = await supabase
          .from('operator_methodologies')
          .select('*')
          .eq('operator_id', data.id)
          .order('created_at');
        
        setMethodologies((methData || []) as OperatorMethodology[]);
      }
    } catch (err) {
      console.error('Error in fetchWorkspace:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!authLoading) {
      fetchWorkspace();
    }
  }, [authLoading, fetchWorkspace]);

  const createWorkspace = async (data: { display_name: string }): Promise<OperatorWorkspace | null> => {
    if (!user?.id) return null;

    try {
      const { data: newWorkspace, error } = await supabase
        .from('operator_workspaces')
        .insert({
          user_id: user.id,
          display_name: data.display_name,
          operator_status: 'standard',
        })
        .select()
        .single();

      if (error) throw error;
      
      const ws = newWorkspace as OperatorWorkspace;
      setWorkspace(ws);
      return ws;
    } catch (err) {
      console.error('Error creating workspace:', err);
      return null;
    }
  };

  const value: OperatorContextType = {
    workspace,
    isOperator: !!workspace,
    isLoading: authLoading || isLoading,
    needsOnboarding: !!user && !workspace && !isLoading && !authLoading,
    methodologies,
    createWorkspace,
    refetch: fetchWorkspace,
  };

  return (
    <OperatorContext.Provider value={value}>
      {children}
    </OperatorContext.Provider>
  );
}

export function useOperatorWorkspace() {
  const context = useContext(OperatorContext);
  if (context === undefined) {
    throw new Error('useOperatorWorkspace must be used within an OperatorProvider');
  }
  return context;
}

// Hook for operator tasks
export function useOperatorTasks(clientId?: string) {
  const { workspace } = useOperatorWorkspace();
  const [tasks, setTasks] = useState<OperatorTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    if (!workspace?.id) {
      setTasks([]);
      setIsLoading(false);
      return;
    }

    try {
      let query = supabase
        .from('operator_tasks')
        .select('*')
        .eq('operator_id', workspace.id)
        .order('created_at', { ascending: false });

      if (clientId) {
        query = query.eq('client_id', clientId);
      }

      const { data, error } = await query;
      if (error) throw error;
      setTasks((data || []) as OperatorTask[]);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    } finally {
      setIsLoading(false);
    }
  }, [workspace?.id, clientId]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const createTask = async (data: Partial<OperatorTask>) => {
    if (!workspace?.id) return null;
    try {
      const { data: newTask, error } = await supabase
        .from('operator_tasks')
        .insert({
          operator_id: workspace.id,
          client_id: data.client_id!,
          title: data.title || '',
          description: data.description,
          due_date: data.due_date,
          priority: data.priority || 'normal',
          relationship_id: data.relationship_id,
        })
        .select()
        .single();
      if (error) throw error;
      const task = newTask as OperatorTask;
      setTasks(prev => [task, ...prev]);
      return task;
    } catch (err) {
      console.error('Error creating task:', err);
      return null;
    }
  };

  const updateTask = async (id: string, data: Partial<OperatorTask>) => {
    try {
      const updateData: Record<string, unknown> = {};
      if (data.title !== undefined) updateData.title = data.title;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.status !== undefined) updateData.status = data.status;
      if (data.priority !== undefined) updateData.priority = data.priority;
      if (data.due_date !== undefined) updateData.due_date = data.due_date;
      if (data.status === 'completed') updateData.completed_at = new Date().toISOString();

      const { error } = await supabase
        .from('operator_tasks')
        .update(updateData)
        .eq('id', id);
      if (error) throw error;
      setTasks(prev => prev.map(t => t.id === id ? { ...t, ...data } as OperatorTask : t));
      return true;
    } catch (err) {
      console.error('Error updating task:', err);
      return false;
    }
  };

  return { tasks, isLoading, refetch: fetchTasks, createTask, updateTask };
}

// Hook for operator reflections
export function useOperatorReflections(clientId?: string) {
  const { workspace } = useOperatorWorkspace();
  const [reflections, setReflections] = useState<OperatorReflection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReflections = useCallback(async () => {
    if (!workspace?.id) {
      setReflections([]);
      setIsLoading(false);
      return;
    }

    try {
      let query = supabase
        .from('operator_reflections')
        .select('*')
        .eq('operator_id', workspace.id)
        .order('created_at', { ascending: false });

      if (clientId) {
        query = query.eq('client_id', clientId);
      }

      const { data, error } = await query;
      if (error) throw error;
      setReflections((data || []) as OperatorReflection[]);
    } catch (err) {
      console.error('Error fetching reflections:', err);
    } finally {
      setIsLoading(false);
    }
  }, [workspace?.id, clientId]);

  useEffect(() => { fetchReflections(); }, [fetchReflections]);

  const createReflection = async (data: Partial<OperatorReflection>) => {
    if (!workspace?.id) return null;
    try {
      const { data: newRef, error } = await supabase
        .from('operator_reflections')
        .insert({
          operator_id: workspace.id,
          client_id: data.client_id!,
          title: data.title || '',
          content: data.content,
          reflection_type: data.reflection_type || 'checkpoint',
          relationship_id: data.relationship_id,
          session_id: data.session_id,
        })
        .select()
        .single();
      if (error) throw error;
      const ref = newRef as OperatorReflection;
      setReflections(prev => [ref, ...prev]);
      return ref;
    } catch (err) {
      console.error('Error creating reflection:', err);
      return null;
    }
  };

  return { reflections, isLoading, refetch: fetchReflections, createReflection };
}

// Hook for client-operator relationships
export function useOperatorRelationships() {
  const { workspace } = useOperatorWorkspace();
  const [relationships, setRelationships] = useState<ClientOperatorRelationship[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRelationships = useCallback(async () => {
    if (!workspace?.id) {
      setRelationships([]);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('client_operator_relationships')
        .select('*')
        .eq('operator_id', workspace.id)
        .order('relationship_started_at', { ascending: false });

      if (error) throw error;
      setRelationships((data || []) as ClientOperatorRelationship[]);
    } catch (err) {
      console.error('Error fetching relationships:', err);
    } finally {
      setIsLoading(false);
    }
  }, [workspace?.id]);

  useEffect(() => { fetchRelationships(); }, [fetchRelationships]);

  const createRelationship = async (data: { client_id: string; methodology_name?: string }) => {
    if (!workspace?.id) return null;
    try {
      const { data: newRel, error } = await supabase
        .from('client_operator_relationships')
        .insert({
          operator_id: workspace.id,
          client_id: data.client_id,
          methodology_name: data.methodology_name,
        })
        .select()
        .single();
      if (error) throw error;
      const rel = newRel as ClientOperatorRelationship;
      setRelationships(prev => [rel, ...prev]);
      return rel;
    } catch (err) {
      console.error('Error creating relationship:', err);
      return null;
    }
  };

  return { relationships, isLoading, refetch: fetchRelationships, createRelationship };
}

export type { OperatorWorkspace, OperatorMethodology, OperatorTask, OperatorReflection, ClientOperatorRelationship };
