import { createContext, useContext, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export type EccRole = 'owner' | 'editor' | 'viewer' | null;

interface BibliotecaAccessContextType {
  role: EccRole;
  hasAccess: boolean;
  canEdit: boolean;
  isOwner: boolean;
  isLoading: boolean;
}

const Ctx = createContext<BibliotecaAccessContextType | undefined>(undefined);

export function BibliotecaAccessProvider({ children }: { children: ReactNode }) {
  const { user, isLoading: authLoading } = useAuth();

  const { data: role = null, isLoading } = useQuery<EccRole>({
    queryKey: ['ecc', 'my-access', user?.id],
    enabled: !!user,
    queryFn: async () => {
      // Vincula convites feitos por email a este user
      await (supabase as any).rpc('ecc_claim_access');
      const email = (user!.email || '').toLowerCase();
      const { data } = await (supabase as any)
        .from('ecc_access')
        .select('role')
        .or(`user_id.eq.${user!.id},email.eq.${email}`)
        .limit(1)
        .maybeSingle();
      return (data?.role as EccRole) ?? null;
    },
  });

  const value: BibliotecaAccessContextType = {
    role,
    hasAccess: !!role,
    canEdit: role === 'owner' || role === 'editor',
    isOwner: role === 'owner',
    isLoading: authLoading || isLoading,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useBibliotecaAccess() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useBibliotecaAccess deve estar dentro de BibliotecaAccessProvider');
  return ctx;
}
