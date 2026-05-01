import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

type DiscernirRole = 'couple' | 'priest' | 'coordinator' | null;

interface DiscernirCouple {
  id: string;
  parish_id: string;
  spouse_a_user_id: string | null;
  spouse_b_user_id: string | null;
  couple_name: string | null;
  status: string;
}

interface DiscernirPriest {
  id: string;
  parish_id: string;
  role: string;
  is_active: boolean;
}

interface DiscernirConsent {
  id: string;
  consent_type: string;
  is_active: boolean;
  granted_at: string;
}

interface DiscernirAuthContextType {
  role: DiscernirRole;
  couple: DiscernirCouple | null;
  priest: DiscernirPriest | null;
  consents: DiscernirConsent[];
  isLoading: boolean;
  hasIndividualConsent: boolean;
  hasConjugalConsent: boolean;
  hasPriestAccessConsent: boolean;
  refetchData: () => Promise<void>;
}

const DiscernirAuthContext = createContext<DiscernirAuthContextType | undefined>(undefined);

interface DiscernirAuthProviderProps {
  children: ReactNode;
}

export function DiscernirAuthProvider({ children }: DiscernirAuthProviderProps) {
  const { user, isLoading: authLoading } = useAuth();
  const [role, setRole] = useState<DiscernirRole>(null);
  const [couple, setCouple] = useState<DiscernirCouple | null>(null);
  const [priest, setPriest] = useState<DiscernirPriest | null>(null);
  const [consents, setConsents] = useState<DiscernirConsent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    if (!user) {
      setRole(null);
      setCouple(null);
      setPriest(null);
      setConsents([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      // Check if user is a priest
      const { data: priestData } = await supabase
        .from('discernir_priests')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .maybeSingle();

      if (priestData) {
        setPriest(priestData);
        setRole(priestData.role === 'coordinator' ? 'coordinator' : 'priest');
      } else {
        // Check if user is part of a couple
        const { data: coupleData } = await supabase
          .from('discernir_couples')
          .select('*')
          .or(`spouse_a_user_id.eq.${user.id},spouse_b_user_id.eq.${user.id}`)
          .eq('status', 'active')
          .maybeSingle();

        if (coupleData) {
          setCouple(coupleData);
          setRole('couple');
        }
      }

      // Fetch consents
      const { data: consentsData } = await supabase
        .from('discernir_consents')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .is('revoked_at', null);

      setConsents(consentsData || []);
    } catch (error) {
      console.error('Error fetching Discernir data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchData();
    }
  }, [user, authLoading]);

  const hasIndividualConsent = consents.some(c => c.consent_type === 'individual');
  const hasConjugalConsent = consents.some(c => c.consent_type === 'conjugal');
  const hasPriestAccessConsent = consents.some(c => c.consent_type === 'priest_access');

  return (
    <DiscernirAuthContext.Provider 
      value={{
        role,
        couple,
        priest,
        consents,
        isLoading: authLoading || isLoading,
        hasIndividualConsent,
        hasConjugalConsent,
        hasPriestAccessConsent,
        refetchData: fetchData,
      }}
    >
      {children}
    </DiscernirAuthContext.Provider>
  );
}

export function useDiscernirAuth() {
  const context = useContext(DiscernirAuthContext);
  if (context === undefined) {
    throw new Error('useDiscernirAuth must be used within a DiscernirAuthProvider');
  }
  return context;
}
