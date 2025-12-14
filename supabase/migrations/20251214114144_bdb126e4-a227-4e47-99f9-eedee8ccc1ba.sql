-- Add payment info field to affiliates table
ALTER TABLE public.affiliates 
ADD COLUMN IF NOT EXISTS payment_info jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS payment_method text DEFAULT NULL;

COMMENT ON COLUMN public.affiliates.payment_info IS 'Payment details like PIX key, bank account, PayPal email';
COMMENT ON COLUMN public.affiliates.payment_method IS 'Preferred payment method: pix, bank_transfer, paypal';