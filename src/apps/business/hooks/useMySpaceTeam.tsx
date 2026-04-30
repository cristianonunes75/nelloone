import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { extractEssenceSnapshot, type EssenceSnapshot } from '../lib/essenceLens';

export type TeamMemberSoftRow = {
  user_id: string;
  full_name: string;
  job_title: string | null;
  is_self: boolean;
  is_private: boolean;
  has_essence_code: boolean;
  essence_visual_data: unknown;
  snapshot: EssenceSnapshot;
};

export function useMySpaceTeam(companyId: string | null | undefined) {
  const [rows, setRows] = useState<TeamMemberSoftRow[]>([]);
  const [self, setSelf] = useState<TeamMemberSoftRow | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!companyId) {
      setRows([]);
      setSelf(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: rpcError } = await (supabase.rpc as unknown as (
        name: string,
        args: { p_company_id: string },
      ) => Promise<{ data: Array<Omit<TeamMemberSoftRow, 'snapshot'>> | null; error: { message: string } | null }>)(
        'get_company_team_for_member',
        { p_company_id: companyId },
      );
      if (rpcError) throw new Error(rpcError.message);
      const enriched: TeamMemberSoftRow[] = (data || []).map((r) => ({
        ...r,
        snapshot: extractEssenceSnapshot(r.essence_visual_data),
      }));
      setRows(enriched);
      setSelf(enriched.find((r) => r.is_self) || null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar equipe');
      setRows([]);
      setSelf(null);
    } finally {
      setIsLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { rows, self, isLoading, error, refetch };
}
