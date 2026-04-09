-- Track Hotmart purchases for audit and deduplication
CREATE TABLE IF NOT EXISTS public.hotmart_purchases (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  name text,
  transaction_id text NOT NULL,
  product_id text,
  amount numeric DEFAULT 0,
  event_type text NOT NULL,
  raw_payload jsonb,
  user_id uuid REFERENCES auth.users(id),
  processed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Index for deduplication by transaction
CREATE UNIQUE INDEX IF NOT EXISTS idx_hotmart_purchases_transaction
  ON public.hotmart_purchases(transaction_id);

-- Index for lookup by email
CREATE INDEX IF NOT EXISTS idx_hotmart_purchases_email
  ON public.hotmart_purchases(email);

-- RLS: only service role can access (webhook uses service key)
ALTER TABLE public.hotmart_purchases ENABLE ROW LEVEL SECURITY;

-- No public policies — only service_role can read/write
