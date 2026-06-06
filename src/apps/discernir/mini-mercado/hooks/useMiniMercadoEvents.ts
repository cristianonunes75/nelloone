import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import type { MMEvent } from '../types';

export interface CreateEventInput {
  name: string;
  movement?: string | null;
  starts_on?: string | null;
  ends_on?: string | null;
  pix_key?: string | null;
  pix_key_type?: MMEvent['pix_key_type'];
  pix_merchant_name?: string | null;
}

export function useMiniMercadoEvents() {
  const { user } = useAuth();

  const createEvent = async (input: CreateEventInput): Promise<MMEvent> => {
    if (!user) throw new Error('Voce precisa estar logado');
    const { data, error } = await (supabase as any)
      .from('mm_events')
      .insert({ ...input, owner_id: user.id })
      .select()
      .single();
    if (error) throw error;
    return data as MMEvent;
  };

  // Entra num retiro pelo codigo e devolve o id do evento.
  const joinEvent = async (joinCode: string): Promise<string> => {
    const { data, error } = await (supabase as any).rpc('mm_join_event', {
      p_join_code: joinCode,
    });
    if (error) throw error;
    return data as string;
  };

  return { createEvent, joinEvent };
}
