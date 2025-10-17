-- 1. Corrigir o role do usuário para admin
UPDATE public.user_roles 
SET role = 'admin'
WHERE user_id = '29fc2f70-b538-4bb1-8ae8-d3c8ea9c838a';

-- 2. Adicionar campo para identificar testes gratuitos
ALTER TABLE public.tests 
ADD COLUMN is_free BOOLEAN NOT NULL DEFAULT false;

-- 3. Adicionar campo de preço para testes pagos
ALTER TABLE public.tests 
ADD COLUMN price_brl DECIMAL(10,2) DEFAULT 29.00;

-- 4. Marcar apenas o Teste de Arquétipos como gratuito
UPDATE public.tests 
SET is_free = true, price_brl = 0
WHERE type = 'arquetipos';

-- 5. Criar tabela para gerenciar combos de testes
CREATE TABLE public.test_combos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price_brl DECIMAL(10,2) NOT NULL,
  test_count INTEGER NOT NULL,
  discount_percentage INTEGER,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.test_combos ENABLE ROW LEVEL SECURITY;

-- Todos podem ver combos ativos
CREATE POLICY "Everyone can view active combos"
ON public.test_combos FOR SELECT
USING (active = true);

-- Apenas admins podem gerenciar combos
CREATE POLICY "Admins can manage combos"
ON public.test_combos FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- 6. Criar tabela para rastrear compras de testes individuais
CREATE TABLE public.test_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  test_id UUID NOT NULL REFERENCES public.tests(id) ON DELETE CASCADE,
  price_paid DECIMAL(10,2) NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  payment_method TEXT,
  transaction_id TEXT,
  purchased_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, test_id)
);

ALTER TABLE public.test_purchases ENABLE ROW LEVEL SECURITY;

-- Usuários podem ver suas próprias compras
CREATE POLICY "Users can view their own purchases"
ON public.test_purchases FOR SELECT
USING (auth.uid() = user_id);

-- Usuários podem criar suas próprias compras
CREATE POLICY "Users can create their own purchases"
ON public.test_purchases FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Admins podem ver todas as compras
CREATE POLICY "Admins can view all purchases"
ON public.test_purchases FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- 7. Inserir combos padrão
INSERT INTO public.test_combos (name, description, price_brl, test_count, discount_percentage) VALUES
('Combo 3 Testes', 'Escolha 3 testes à sua escolha e economize R$ 28,00', 59.00, 3, 32),
('Plano Premium', 'Todos os testes + sessão fotográfica + consultoria completa', 950.00, 8, 0);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_test_combos_updated_at
BEFORE UPDATE ON public.test_combos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();