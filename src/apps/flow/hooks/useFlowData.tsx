import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface FlowIdea {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: 'backlog' | 'chosen' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface FlowFocus {
  id: string;
  user_id: string;
  idea_id: string | null;
  goal_description: string | null;
  is_active: boolean;
  created_at: string;
}

export interface FlowOffer {
  id: string;
  user_id: string;
  idea_id: string | null;
  audience: string | null;
  problem: string | null;
  promise: string | null;
  format: string | null;
  price_suggested: number | null;
  status: 'draft' | 'active' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface FlowTask {
  id: string;
  user_id: string;
  description: string;
  week_ref: string;
  done: boolean;
  created_at: string;
}

export interface FlowCheckin {
  id: string;
  user_id: string;
  week_ref: string;
  what_worked: string | null;
  what_not: string | null;
  adjustments: string | null;
  created_at: string;
}

export function useFlowData() {
  const { user } = useAuth();
  const [ideas, setIdeas] = useState<FlowIdea[]>([]);
  const [focus, setFocus] = useState<FlowFocus | null>(null);
  const [offer, setOffer] = useState<FlowOffer | null>(null);
  const [tasks, setTasks] = useState<FlowTask[]>([]);
  const [checkins, setCheckins] = useState<FlowCheckin[]>([]);
  const [loading, setLoading] = useState(true);

  const getCurrentWeek = () => {
    const now = new Date();
    const year = now.getFullYear();
    const week = Math.ceil(((now.getTime() - new Date(year, 0, 1).getTime()) / 86400000 + 1) / 7);
    return `${year}-W${week.toString().padStart(2, '0')}`;
  };

  const fetchAll = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [ideasRes, focusRes, offerRes, tasksRes, checkinsRes] = await Promise.all([
        supabase.from('flow_ideas').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('flow_focus').select('*').eq('user_id', user.id).eq('is_active', true).maybeSingle(),
        supabase.from('flow_offers').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1).maybeSingle(),
        supabase.from('flow_tasks').select('*').eq('user_id', user.id).eq('week_ref', getCurrentWeek()).order('created_at', { ascending: true }),
        supabase.from('flow_checkins').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
      ]);

      if (ideasRes.data) setIdeas(ideasRes.data as FlowIdea[]);
      if (focusRes.data) setFocus(focusRes.data as FlowFocus);
      if (offerRes.data) setOffer(offerRes.data as FlowOffer);
      if (tasksRes.data) setTasks(tasksRes.data as FlowTask[]);
      if (checkinsRes.data) setCheckins(checkinsRes.data as FlowCheckin[]);
    } catch (error) {
      console.error('Error fetching flow data:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Ideas CRUD
  const addIdea = async (title: string, description?: string) => {
    if (!user) return null;
    const { data, error } = await supabase
      .from('flow_ideas')
      .insert({ user_id: user.id, title, description })
      .select()
      .single();
    if (error) throw error;
    setIdeas(prev => [data as FlowIdea, ...prev]);
    return data as FlowIdea;
  };

  const updateIdea = async (id: string, updates: Partial<FlowIdea>) => {
    const { data, error } = await supabase
      .from('flow_ideas')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    setIdeas(prev => prev.map(i => i.id === id ? data as FlowIdea : i));
    return data as FlowIdea;
  };

  const deleteIdea = async (id: string) => {
    const { error } = await supabase.from('flow_ideas').delete().eq('id', id);
    if (error) throw error;
    setIdeas(prev => prev.filter(i => i.id !== id));
  };

  const setIdeaAsFocus = async (ideaId: string) => {
    if (!user) return null;
    
    // Deactivate current focus
    if (focus) {
      await supabase.from('flow_focus').update({ is_active: false }).eq('id', focus.id);
    }
    
    // Update idea status
    await updateIdea(ideaId, { status: 'chosen' });
    
    // Create new focus
    const { data, error } = await supabase
      .from('flow_focus')
      .insert({ user_id: user.id, idea_id: ideaId, is_active: true })
      .select()
      .single();
    if (error) throw error;
    setFocus(data as FlowFocus);
    return data as FlowFocus;
  };

  // Offer CRUD
  const saveOffer = async (offerData: Partial<FlowOffer>) => {
    if (!user) return null;
    
    if (offer) {
      const { data, error } = await supabase
        .from('flow_offers')
        .update(offerData)
        .eq('id', offer.id)
        .select()
        .single();
      if (error) throw error;
      setOffer(data as FlowOffer);
      return data as FlowOffer;
    } else {
      const { data, error } = await supabase
        .from('flow_offers')
        .insert({ user_id: user.id, ...offerData })
        .select()
        .single();
      if (error) throw error;
      setOffer(data as FlowOffer);
      return data as FlowOffer;
    }
  };

  // Tasks CRUD
  const addTask = async (description: string) => {
    if (!user) return null;
    const { data, error } = await supabase
      .from('flow_tasks')
      .insert({ user_id: user.id, description, week_ref: getCurrentWeek() })
      .select()
      .single();
    if (error) throw error;
    setTasks(prev => [...prev, data as FlowTask]);
    return data as FlowTask;
  };

  const toggleTask = async (id: string, done: boolean) => {
    const { data, error } = await supabase
      .from('flow_tasks')
      .update({ done })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    setTasks(prev => prev.map(t => t.id === id ? data as FlowTask : t));
    return data as FlowTask;
  };

  const deleteTask = async (id: string) => {
    const { error } = await supabase.from('flow_tasks').delete().eq('id', id);
    if (error) throw error;
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  // Check-ins
  const saveCheckin = async (data: { what_worked: string; what_not: string; adjustments: string }) => {
    if (!user) return null;
    const { data: checkin, error } = await supabase
      .from('flow_checkins')
      .insert({ user_id: user.id, week_ref: getCurrentWeek(), ...data })
      .select()
      .single();
    if (error) throw error;
    setCheckins(prev => [checkin as FlowCheckin, ...prev]);
    return checkin as FlowCheckin;
  };

  const chosenIdea = ideas.find(i => i.status === 'chosen');

  return {
    ideas,
    focus,
    offer,
    tasks,
    checkins,
    chosenIdea,
    loading,
    getCurrentWeek,
    refetch: fetchAll,
    // Ideas
    addIdea,
    updateIdea,
    deleteIdea,
    setIdeaAsFocus,
    // Offer
    saveOffer,
    // Tasks
    addTask,
    toggleTask,
    deleteTask,
    // Check-ins
    saveCheckin,
  };
}
