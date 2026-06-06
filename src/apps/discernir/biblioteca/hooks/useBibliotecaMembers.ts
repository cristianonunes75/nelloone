import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export interface EccMember {
  id: string;
  email: string;
  role: 'owner' | 'editor' | 'viewer';
  user_id: string | null;
  created_at: string;
}

export function useBibliotecaMembers() {
  const qc = useQueryClient();
  const { user } = useAuth();

  const query = useQuery({
    queryKey: ['ecc', 'members'],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('ecc_access')
        .select('*')
        .order('role', { ascending: true })
        .order('email', { ascending: true });
      if (error) throw error;
      return (data || []) as EccMember[];
    },
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ['ecc', 'members'] });

  const addMember = async (email: string, role: EccMember['role']) => {
    const { error } = await (supabase as any)
      .from('ecc_access')
      .insert({ email: email.trim().toLowerCase(), role, added_by: user?.id });
    if (error) throw error;
    await invalidate();
  };

  const updateRole = async (id: string, role: EccMember['role']) => {
    const { error } = await (supabase as any).from('ecc_access').update({ role }).eq('id', id);
    if (error) throw error;
    await invalidate();
  };

  const removeMember = async (id: string) => {
    const { error } = await (supabase as any).from('ecc_access').delete().eq('id', id);
    if (error) throw error;
    await invalidate();
  };

  return {
    members: query.data ?? [],
    isLoading: query.isLoading,
    addMember,
    updateRole,
    removeMember,
  };
}
