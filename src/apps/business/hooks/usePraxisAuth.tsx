import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Json } from '@/integrations/supabase/types';

interface ProfessionalProfile {
  id: string;
  user_id: string;
  mode: string;
  business_name: string | null;
  specialty: string | null;
  bio: string | null;
  avatar_url: string | null;
  website: string | null;
  phone: string | null;
  settings: Json;
  subscription_tier: string;
  subscription_status: string;
  trial_ends_at: string | null;
  current_clients: number;
  max_clients: number;
  created_at: string;
  updated_at: string;
}

interface PraxisAuthContextType {
  professionalProfile: ProfessionalProfile | null;
  isProfessional: boolean;
  isLoading: boolean;
  needsOnboarding: boolean;
  refetch: () => Promise<void>;
  createProfile: (data: Partial<ProfessionalProfile>) => Promise<ProfessionalProfile | null>;
}

const PraxisAuthContext = createContext<PraxisAuthContextType | undefined>(undefined);

export function PraxisAuthProvider({ children }: { children: ReactNode }) {
  const { user, isLoading: authLoading } = useAuth();
  const [professionalProfile, setProfessionalProfile] = useState<ProfessionalProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (!user?.id) {
      setProfessionalProfile(null);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('professional_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching professional profile:', error);
      }

      setProfessionalProfile(data as ProfessionalProfile | null);
    } catch (err) {
      console.error('Error in fetchProfile:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!authLoading) {
      fetchProfile();
    }
  }, [authLoading, fetchProfile]);

  const createProfile = async (data: Partial<ProfessionalProfile>): Promise<ProfessionalProfile | null> => {
    if (!user?.id) return null;

    try {
      const { data: newProfile, error } = await supabase
        .from('professional_profiles')
        .insert({
          user_id: user.id,
          mode: 'praxis',
          business_name: data.business_name || null,
          specialty: data.specialty || null,
          bio: data.bio || null,
        })
        .select()
        .single();

      if (error) throw error;
      
      const profile = newProfile as ProfessionalProfile;
      setProfessionalProfile(profile);
      return profile;
    } catch (err) {
      console.error('Error creating professional profile:', err);
      return null;
    }
  };

  const value: PraxisAuthContextType = {
    professionalProfile,
    isProfessional: !!professionalProfile,
    isLoading: authLoading || isLoading,
    needsOnboarding: !!user && !professionalProfile && !isLoading && !authLoading,
    refetch: fetchProfile,
    createProfile,
  };

  return (
    <PraxisAuthContext.Provider value={value}>
      {children}
    </PraxisAuthContext.Provider>
  );
}

export function usePraxisAuth() {
  const context = useContext(PraxisAuthContext);
  if (context === undefined) {
    throw new Error('usePraxisAuth must be used within a PraxisAuthProvider');
  }
  return context;
}
