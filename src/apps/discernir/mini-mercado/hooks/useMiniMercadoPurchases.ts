import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { CartItem } from '../types';

export function useMiniMercadoPurchases(eventId: string | null) {
  const qc = useQueryClient();

  // Lanca uma compra: cria o cabecalho e os itens com snapshot de nome/preco.
  // O total e recalculado por trigger no banco a partir dos itens.
  const createPurchase = async (params: {
    servoId: string;
    operatorId: string | null;
    items: CartItem[];
    note?: string | null;
  }) => {
    const { servoId, operatorId, items, note } = params;
    if (!eventId) throw new Error('Sem retiro ativo');
    if (items.length === 0) throw new Error('Carrinho vazio');

    const { data: purchase, error: pErr } = await (supabase as any)
      .from('mm_purchases')
      .insert({
        event_id: eventId,
        servo_id: servoId,
        operator_id: operatorId,
        note: note || null,
      })
      .select()
      .single();
    if (pErr) throw pErr;

    const rows = items.map((it) => ({
      purchase_id: purchase.id,
      event_id: eventId,
      product_id: it.product_id,
      name_snapshot: it.name,
      price_cents_snapshot: it.price_cents,
      qty: it.qty,
      line_total_cents: it.price_cents * it.qty,
    }));

    const { error: iErr } = await (supabase as any)
      .from('mm_purchase_items')
      .insert(rows);
    if (iErr) throw iErr;

    qc.invalidateQueries({ queryKey: ['mm', 'balances', eventId] });
    qc.invalidateQueries({ queryKey: ['mm', 'purchases', eventId] });
    return purchase.id as string;
  };

  return { createPurchase };
}
