// Tipos do modulo Mini Mercado. As tabelas mm_* ainda nao estao no types.ts gerado
// do Supabase, entao acessamos via supabase.from('mm_*' as any) e tipamos aqui a mao.

export type MMEventStatus = 'open' | 'closing' | 'closed' | 'archived';
export type MMRole = 'gestor' | 'caixa';
export type MMServoKind = 'casal' | 'jovem' | 'individual' | 'padre';

export interface MMEvent {
  id: string;
  owner_id: string;
  movement: string | null;
  name: string;
  starts_on: string | null;
  ends_on: string | null;
  pix_key: string | null;
  pix_key_type: 'cpf' | 'cnpj' | 'email' | 'phone' | 'random' | null;
  pix_merchant_name: string | null;
  pix_merchant_city: string | null;
  status: MMEventStatus;
  join_code: string;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface MMOperator {
  id: string;
  event_id: string;
  user_id: string;
  role: MMRole;
  is_active: boolean;
}

export interface MMOperatorEvent {
  id: string;
  role: MMRole;
  is_active: boolean;
  event: MMEvent;
}

export interface MMTeam {
  id: string;
  event_id: string;
  name: string;
}

export interface MMServo {
  id: string;
  event_id: string;
  team_id: string | null;
  name: string;
  nickname: string | null;
  phone: string | null;
  kind: MMServoKind;
  spouse_servo_id: string | null;
  birth_date: string | null;
  wedding_date: string | null;
  is_quick_add: boolean;
}

export interface MMProduct {
  id: string;
  event_id: string;
  name: string;
  price_cents: number;
  is_active: boolean;
  sort_order: number;
}

export interface MMServoBalance {
  event_id: string;
  servo_id: string;
  name: string;
  nickname: string | null;
  team_id: string | null;
  spouse_servo_id: string | null;
  total_cents: number;
  purchase_count: number;
}

// Item no carrinho (antes de salvar). price_cents e o snapshot capturado na hora.
export interface CartItem {
  key: string;
  product_id: string | null;
  name: string;
  price_cents: number;
  qty: number;
}
