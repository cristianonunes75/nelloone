-- Create affiliates table for founder affiliates
CREATE TABLE public.affiliates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  affiliate_code TEXT UNIQUE NOT NULL,
  commission_percent NUMERIC NOT NULL DEFAULT 10,
  total_earnings NUMERIC NOT NULL DEFAULT 0,
  total_sales INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Track affiliate referrals/commissions
CREATE TABLE public.affiliate_referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID REFERENCES public.affiliates(id) ON DELETE CASCADE NOT NULL,
  purchase_id UUID REFERENCES public.test_purchases(id) ON DELETE CASCADE,
  referred_user_id UUID NOT NULL,
  commission_amount NUMERIC NOT NULL DEFAULT 0,
  sale_amount NUMERIC NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'BRL',
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  paid_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_referrals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for affiliates
CREATE POLICY "Admins can manage affiliates"
ON public.affiliates FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view their own affiliate data"
ON public.affiliates FOR SELECT
USING (auth.uid() = user_id);

-- RLS Policies for affiliate_referrals
CREATE POLICY "Admins can manage referrals"
ON public.affiliate_referrals FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Affiliates can view their own referrals"
ON public.affiliate_referrals FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.affiliates
  WHERE affiliates.id = affiliate_referrals.affiliate_id
  AND affiliates.user_id = auth.uid()
));

-- Add affiliate_code column to test_purchases to track referrals
ALTER TABLE public.test_purchases 
ADD COLUMN affiliate_code TEXT;

-- Create index for faster lookups
CREATE INDEX idx_affiliates_code ON public.affiliates(affiliate_code);
CREATE INDEX idx_referrals_affiliate ON public.affiliate_referrals(affiliate_id);
CREATE INDEX idx_purchases_affiliate ON public.test_purchases(affiliate_code);