import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import type { MMEvent, MMOperatorEvent, MMRole } from '../types';

const ACTIVE_KEY = 'mm_active_event';

interface MiniMercadoContextType {
  events: MMOperatorEvent[];
  isLoading: boolean;
  activeEventId: string | null;
  activeEvent: MMEvent | null;
  activeRole: MMRole | null;
  activeOperatorId: string | null;
  setActiveEventId: (id: string | null) => void;
  refetch: () => void;
}

const MiniMercadoContext = createContext<MiniMercadoContextType | undefined>(undefined);

export function MiniMercadoProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [activeEventId, setActiveEventIdState] = useState<string | null>(
    () => localStorage.getItem(ACTIVE_KEY)
  );

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['mm', 'my-events', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('mm_operators')
        .select('id, role, is_active, event:mm_events(*)')
        .eq('user_id', user!.id)
        .eq('is_active', true);
      if (error) throw error;
      return ((data || []) as any[])
        .filter((o) => o.event)
        .sort((a, b) => (b.event.created_at || '').localeCompare(a.event.created_at || '')) as MMOperatorEvent[];
    },
  });

  const setActiveEventId = useCallback((id: string | null) => {
    setActiveEventIdState(id);
    if (id) localStorage.setItem(ACTIVE_KEY, id);
    else localStorage.removeItem(ACTIVE_KEY);
  }, []);

  // Mantem a selecao coerente: 1 evento -> seleciona; selecao invalida -> limpa.
  useEffect(() => {
    if (isLoading) return;
    const exists = activeEventId && events.some((e) => e.event.id === activeEventId);
    if (exists) return;
    if (events.length === 1) setActiveEventId(events[0].event.id);
    else if (activeEventId) setActiveEventId(null);
  }, [isLoading, events, activeEventId, setActiveEventId]);

  const activeOp = events.find((e) => e.event.id === activeEventId) || null;

  return (
    <MiniMercadoContext.Provider
      value={{
        events,
        isLoading,
        activeEventId,
        activeEvent: activeOp?.event ?? null,
        activeRole: activeOp?.role ?? null,
        activeOperatorId: activeOp?.id ?? null,
        setActiveEventId,
        refetch: () => qc.invalidateQueries({ queryKey: ['mm', 'my-events'] }),
      }}
    >
      {children}
    </MiniMercadoContext.Provider>
  );
}

export function useMiniMercado() {
  const ctx = useContext(MiniMercadoContext);
  if (!ctx) throw new Error('useMiniMercado deve estar dentro de MiniMercadoProvider');
  return ctx;
}
