-- Add is_founder flag to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_founder boolean DEFAULT false;

-- Create founder_feedback table
CREATE TABLE public.founder_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  tipo text NOT NULL CHECK (tipo IN ('bug', 'melhoria', 'duvida')),
  titulo text NOT NULL,
  descricao text NOT NULL,
  status text NOT NULL DEFAULT 'novo' CHECK (status IN ('novo', 'em_analise', 'resolvido')),
  url_context text NULL,
  device_info text NULL
);

-- Enable RLS on founder_feedback
ALTER TABLE public.founder_feedback ENABLE ROW LEVEL SECURITY;

-- RLS policies for founder_feedback
CREATE POLICY "Founders can insert their own feedback"
ON public.founder_feedback
FOR INSERT
WITH CHECK (auth.uid() = user_id AND EXISTS (
  SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_founder = true
));

CREATE POLICY "Users can view their own feedback"
ON public.founder_feedback
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all feedback"
ON public.founder_feedback
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update feedback status"
ON public.founder_feedback
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create coupons table for internal management
CREATE TABLE IF NOT EXISTS public.coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  stripe_coupon_id text NULL,
  discount_type text NOT NULL DEFAULT 'percentual' CHECK (discount_type IN ('percentual', 'fixed')),
  discount_value numeric NOT NULL CHECK (discount_value >= 0 AND discount_value <= 100),
  allowed_product_type text NULL CHECK (allowed_product_type IN ('fundadores', 'jornada', 'codigo_essencia', NULL)),
  max_uses integer NULL,
  times_used integer DEFAULT 0,
  is_active boolean DEFAULT true,
  expires_at timestamptz NULL,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES public.profiles(id)
);

-- Enable RLS on coupons
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- RLS policies for coupons
CREATE POLICY "Admins can manage coupons"
ON public.coupons
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can read active coupons for validation"
ON public.coupons
FOR SELECT
USING (is_active = true);