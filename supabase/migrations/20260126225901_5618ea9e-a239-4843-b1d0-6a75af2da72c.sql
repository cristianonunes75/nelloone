-- Update allowed_product_type constraint to support new monetization products
-- Remove old constraint and add new one with expanded values
ALTER TABLE public.coupons DROP CONSTRAINT IF EXISTS coupons_allowed_product_type_check;

-- Allow more product types including comma-separated lists for multi-product coupons
-- Since we now support comma-separated values, we just need to ensure it's a text field (no constraint needed)
-- The validation is done in the edge function

COMMENT ON COLUMN public.coupons.allowed_product_type IS 'Product restriction for coupon. Values: null (all), "all", single product type, or comma-separated list (e.g. "nello_couple,activation_individual,identity_couple_premium")';