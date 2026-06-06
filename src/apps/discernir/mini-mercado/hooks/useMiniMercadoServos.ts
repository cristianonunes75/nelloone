import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { MMServo, MMTeam, MMServoKind } from '../types';

export interface NewServoInput {
  name: string;
  nickname?: string | null;
  phone?: string | null;
  team_id?: string | null;
  kind?: MMServoKind;
  is_quick_add?: boolean;
}

export function useMiniMercadoServos(eventId: string | null) {
  const qc = useQueryClient();

  const servosQuery = useQuery({
    queryKey: ['mm', 'servos', eventId],
    enabled: !!eventId,
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('mm_servos')
        .select('*')
        .eq('event_id', eventId)
        .order('name', { ascending: true });
      if (error) throw error;
      return (data || []) as MMServo[];
    },
  });

  const teamsQuery = useQuery({
    queryKey: ['mm', 'teams', eventId],
    enabled: !!eventId,
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('mm_teams')
        .select('*')
        .eq('event_id', eventId)
        .order('name', { ascending: true });
      if (error) throw error;
      return (data || []) as MMTeam[];
    },
  });

  const invalidateServos = () =>
    qc.invalidateQueries({ queryKey: ['mm', 'servos', eventId] });
  const invalidateTeams = () =>
    qc.invalidateQueries({ queryKey: ['mm', 'teams', eventId] });

  const addServo = async (input: NewServoInput): Promise<MMServo> => {
    const { data, error } = await (supabase as any)
      .from('mm_servos')
      .insert({
        event_id: eventId,
        name: input.name.trim(),
        nickname: input.nickname?.trim() || null,
        phone: input.phone?.trim() || null,
        team_id: input.team_id || null,
        kind: input.kind || 'individual',
        is_quick_add: input.is_quick_add ?? false,
      })
      .select()
      .single();
    if (error) throw error;
    await invalidateServos();
    return data as MMServo;
  };

  const updateServo = async (id: string, patch: Partial<MMServo>) => {
    const { error } = await (supabase as any)
      .from('mm_servos')
      .update(patch)
      .eq('id', id);
    if (error) throw error;
    await invalidateServos();
  };

  const addTeam = async (name: string): Promise<MMTeam> => {
    const { data, error } = await (supabase as any)
      .from('mm_teams')
      .insert({ event_id: eventId, name: name.trim() })
      .select()
      .single();
    if (error) throw error;
    await invalidateTeams();
    return data as MMTeam;
  };

  const teamName = (teamId: string | null): string => {
    if (!teamId) return '';
    return teamsQuery.data?.find((t) => t.id === teamId)?.name ?? '';
  };

  return {
    servos: servosQuery.data ?? [],
    teams: teamsQuery.data ?? [],
    isLoading: servosQuery.isLoading || teamsQuery.isLoading,
    addServo,
    updateServo,
    addTeam,
    teamName,
  };
}
