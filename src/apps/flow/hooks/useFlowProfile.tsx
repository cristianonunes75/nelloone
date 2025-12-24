import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface FlowProfile {
  id: string;
  user_id: string;
  monthly_goal: number;
  weekly_time_available: string | null;
  feels_dispersed: boolean;
  has_tdah: string;
  onboarding_completed: boolean;
  onboarding_step: number;
  what_brought_you: string | null;
  created_at: string;
  updated_at: string;
}

export function useFlowProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<FlowProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('flow_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching flow profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async (data: Partial<FlowProfile>) => {
    if (!user) return null;
    
    try {
      const { data: newProfile, error } = await supabase
        .from('flow_profiles')
        .insert({
          user_id: user.id,
          ...data,
        })
        .select()
        .single();

      if (error) throw error;
      setProfile(newProfile);
      return newProfile;
    } catch (error) {
      console.error('Error creating flow profile:', error);
      return null;
    }
  };

  const updateProfile = async (data: Partial<FlowProfile>) => {
    if (!user || !profile) return null;
    
    try {
      const { data: updatedProfile, error } = await supabase
        .from('flow_profiles')
        .update(data)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      setProfile(updatedProfile);
      return updatedProfile;
    } catch (error) {
      console.error('Error updating flow profile:', error);
      return null;
    }
  };

  return {
    profile,
    loading,
    createProfile,
    updateProfile,
    refetch: fetchProfile,
  };
}
