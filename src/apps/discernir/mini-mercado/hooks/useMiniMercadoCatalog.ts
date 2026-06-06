import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { MMProduct } from '../types';

export function useMiniMercadoCatalog(eventId: string | null, onlyActive = false) {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ['mm', 'products', eventId, onlyActive],
    enabled: !!eventId,
    queryFn: async () => {
      let q = (supabase as any)
        .from('mm_products')
        .select('*')
        .eq('event_id', eventId)
        .order('sort_order', { ascending: true })
        .order('name', { ascending: true });
      if (onlyActive) q = q.eq('is_active', true);
      const { data, error } = await q;
      if (error) throw error;
      return (data || []) as MMProduct[];
    },
  });

  const invalidate = () =>
    qc.invalidateQueries({ queryKey: ['mm', 'products', eventId] });

  const addProduct = async (name: string, priceCents: number) => {
    const { error } = await (supabase as any)
      .from('mm_products')
      .insert({ event_id: eventId, name: name.trim(), price_cents: priceCents });
    if (error) throw error;
    await invalidate();
  };

  const updateProduct = async (id: string, patch: Partial<MMProduct>) => {
    const { error } = await (supabase as any)
      .from('mm_products')
      .update(patch)
      .eq('id', id);
    if (error) throw error;
    await invalidate();
  };

  // Copia o catalogo de outro evento (botao "copiar do retiro anterior").
  const copyFromEvent = async (sourceEventId: string) => {
    const { data, error } = await (supabase as any)
      .from('mm_products')
      .select('name, price_cents, sort_order')
      .eq('event_id', sourceEventId);
    if (error) throw error;
    const rows = (data || []).map((p: any) => ({
      event_id: eventId,
      name: p.name,
      price_cents: p.price_cents,
      sort_order: p.sort_order ?? 0,
    }));
    if (rows.length === 0) return 0;
    const { error: insErr } = await (supabase as any)
      .from('mm_products')
      .upsert(rows, { onConflict: 'event_id,name', ignoreDuplicates: true });
    if (insErr) throw insErr;
    await invalidate();
    return rows.length;
  };

  return {
    products: query.data ?? [],
    isLoading: query.isLoading,
    addProduct,
    updateProduct,
    copyFromEvent,
  };
}
