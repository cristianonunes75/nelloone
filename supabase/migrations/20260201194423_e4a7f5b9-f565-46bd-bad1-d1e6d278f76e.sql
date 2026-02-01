-- Create product_prices table for centralized price management
CREATE TABLE public.product_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_key TEXT NOT NULL UNIQUE,
  product_name TEXT NOT NULL,
  price_brl NUMERIC(10,2) NOT NULL,
  price_usd NUMERIC(10,2) NOT NULL,
  price_eur NUMERIC(10,2) NOT NULL,
  stripe_price_id_brl TEXT,
  stripe_price_id_usd TEXT,
  stripe_price_id_eur TEXT,
  is_active BOOLEAN DEFAULT true,
  product_category TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.product_prices ENABLE ROW LEVEL SECURITY;

-- Admin-only access policies (using correct enum values)
CREATE POLICY "Admins can view all product prices" 
ON public.product_prices 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_permissions 
    WHERE user_id = auth.uid() 
    AND permission_level IN ('super_admin', 'suporte', 'visualizador')
  )
);

CREATE POLICY "Admins can manage product prices" 
ON public.product_prices 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_permissions 
    WHERE user_id = auth.uid() 
    AND permission_level = 'super_admin'
  )
);

-- Create trigger for updated_at
CREATE TRIGGER update_product_prices_updated_at
BEFORE UPDATE ON public.product_prices
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial price data from priceConfig.ts
INSERT INTO public.product_prices (product_key, product_name, price_brl, price_usd, price_eur, stripe_price_id_brl, stripe_price_id_usd, stripe_price_id_eur, product_category) VALUES
-- Individual tests
('arquetipos', 'Arquétipos com Propósito', 47, 19, 9.90, 'price_1SayAYDjhZZxZELM9kEZiiF4', 'price_1SZNW0DjhZZxZELMopbi37cc', 'price_1SayKNDjhZZxZELMhCJ6Na9m', 'test'),
('disc', 'DISC', 97, 47, 17.90, 'price_1SNBIuDjhZZxZELMm3qUtTON', 'price_1SZNWgDjhZZxZELMoEGJMpRt', 'price_1SZyxMDjhZZxZELMkolH98fK', 'test'),
('mbti', 'MBTI / Nello 16', 197, 57, 52.90, 'price_1SNBJEDjhZZxZELMY1CuVfIZ', 'price_1SZNWuDjhZZxZELMXezDuVOz', 'price_1SZz6TDjhZZxZELMXzDUT8kk', 'test'),
('eneagrama', 'Eneagrama', 177, 49, 44.90, 'price_1SNBLhDjhZZxZELMhSvpHn8X', 'price_1SZNX8DjhZZxZELMZhLy7W6b', 'price_1SZz5ADjhZZxZELMauUUwZSQ', 'test'),
('temperamentos', 'Temperamentos', 117, 27, 24.90, 'price_1SZUnqDjhZZxZELMtU9tUMFm', 'price_1SZNXKDjhZZxZELMhOhi8sCL', 'price_1SZyxYDjhZZxZELMATbPpg7h', 'test'),
('linguagens_amor', 'Estilos de Conexão Afetiva', 127, 17, 15.90, 'price_1SZUoWDjhZZxZELMxEJJKhDn', 'price_1SZNXYDjhZZxZELMtlzZO8Id', 'price_1SZyykDjhZZxZELM9mlhNwLh', 'test'),
('inteligencias_multiplas', 'Inteligências Múltiplas', 147, 29, 27.90, 'price_1SZUpxDjhZZxZELMAkQlFX11', 'price_1SZNXnDjhZZxZELMuGMkDImQ', 'price_1SZz0nDjhZZxZELMVagCtoXs', 'test'),
-- Premium products
('codigo_da_essencia', 'Código da Essência', 397, 97, 97, 'price_1Sc2RRDjhZZxZELMPxAnu0I5', 'price_1Sc2RfDjhZZxZELMbZP1CvLO', 'price_1Sc2TRDjhZZxZELMr66uJZZm', 'premium'),
('ativacao_codigo', 'Ativação do Código', 197, 57, 47, 'price_1Sw6EEDjhZZxZELMSmPNECig', 'price_1Sw6F6DjhZZxZELMfBW3pn5q', 'price_1Sw6FiDjhZZxZELMXDH1ACdx', 'upsell'),
-- Bundles
('jornada_completa', 'Jornada Completa', 297, 97, 89, 'price_1SeL7gDjhZZxZELMKuDFTI5t', 'price_1SZNYXDjhZZxZELMoGVJUZRP', 'price_1SZz6vDjhZZxZELMQsZuLKah', 'bundle'),
('fundadores', 'Fundadores Nello One', 197, 97, 97, 'price_1ScWglDjhZZxZELM3tQocxgu', 'price_1ScWglDjhZZxZELM3tQocxgu', 'price_1ScWglDjhZZxZELM3tQocxgu', 'bundle'),
-- Couple products
('identity_couple_premium', 'Identity Couple Premium', 997, 297, 247, 'price_1StyMcDjhZZxZELM5IVwqfhV', 'price_1SvfdXDjhZZxZELMaNDfVXox', 'price_1SvfdoDjhZZxZELMLaONPhR5', 'premium');

-- Create index for faster lookups
CREATE INDEX idx_product_prices_category ON public.product_prices(product_category);
CREATE INDEX idx_product_prices_key ON public.product_prices(product_key);