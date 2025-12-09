-- Add purchase_category and test_slug columns to test_purchases table
-- purchase_category: "jornada_completa", "test_avulso", "codigo_essencia"
-- test_slug: only populated when purchase_category = "test_avulso"

ALTER TABLE public.test_purchases
ADD COLUMN IF NOT EXISTS purchase_category text DEFAULT 'test_avulso';

ALTER TABLE public.test_purchases
ADD COLUMN IF NOT EXISTS test_slug text NULL;

ALTER TABLE public.test_purchases
ADD COLUMN IF NOT EXISTS currency text DEFAULT 'BRL';

ALTER TABLE public.test_purchases
ADD COLUMN IF NOT EXISTS purchase_origin text DEFAULT 'web';

-- Add admin permissions for UPDATE and DELETE on test_purchases
CREATE POLICY "Admins can update purchases" 
ON public.test_purchases 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete purchases" 
ON public.test_purchases 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add comment for documentation
COMMENT ON COLUMN public.test_purchases.purchase_category IS 'Category: jornada_completa, test_avulso, codigo_essencia';
COMMENT ON COLUMN public.test_purchases.test_slug IS 'Test slug when purchase_category is test_avulso';