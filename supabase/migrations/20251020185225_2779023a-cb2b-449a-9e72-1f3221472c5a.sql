-- Create pricing_plans table
CREATE TABLE public.pricing_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  price_split TEXT,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_popular BOOLEAN NOT NULL DEFAULT false,
  active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  promo_text TEXT,
  remaining_spots INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pricing_plans ENABLE ROW LEVEL SECURITY;

-- Policy for public to view active plans
CREATE POLICY "Anyone can view active pricing plans"
ON public.pricing_plans
FOR SELECT
USING (active = true);

-- Policy for admins to manage all plans
CREATE POLICY "Admins can manage pricing plans"
ON public.pricing_plans
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger to update updated_at
CREATE TRIGGER update_pricing_plans_updated_at
  BEFORE UPDATE ON public.pricing_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial plans
INSERT INTO public.pricing_plans (name, price, original_price, features, is_popular, display_order) VALUES
(
  'Teste Individual',
  19,
  49,
  '["1 teste de personalidade à escolha", "Relatório em PDF personalizado", "Análise detalhada e visual"]'::jsonb,
  false,
  1
),
(
  'Pacote Testes',
  59,
  149,
  '["8 testes completos de personalidade", "Todos os relatórios em PDF", "Análise integrada dos resultados", "Suporte via WhatsApp"]'::jsonb,
  false,
  2
),
(
  'Essentia Completo',
  197,
  497,
  '["8 testes completos de personalidade", "Todos os relatórios em PDF", "Sessão fotográfica profissional", "Consultoria de imagem personalizada", "Edição premium de todas as fotos", "Mockups para redes sociais", "Orientação de legendas por arquétipo", "Suporte prioritário via WhatsApp"]'::jsonb,
  true,
  3
);

-- Update the Essentia Completo plan with price split
UPDATE public.pricing_plans 
SET price_split = 'ou 3x de R$ 69'
WHERE name = 'Essentia Completo';