-- Add can_manage_leads permission to admin_permissions table
ALTER TABLE public.admin_permissions 
ADD COLUMN IF NOT EXISTS can_manage_leads boolean DEFAULT false;

-- Create leads table
CREATE TABLE public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  phone text,
  email text,
  instagram_handle text,
  source text NOT NULL DEFAULT 'outro',
  status text NOT NULL DEFAULT 'novo',
  owner_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  value_estimate numeric DEFAULT 0,
  notes text,
  next_action text,
  next_action_date timestamptz,
  lost_reason text,
  associated_purchase_id uuid REFERENCES public.test_purchases(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create lead_activities table
CREATE TABLE public.lead_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  type text NOT NULL,
  summary text,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create sales_playbook table for editable content
CREATE TABLE public.sales_playbook (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key text UNIQUE NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  order_index integer DEFAULT 0,
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_playbook ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX idx_leads_status ON public.leads(status);
CREATE INDEX idx_leads_owner ON public.leads(owner_user_id);
CREATE INDEX idx_leads_next_action_date ON public.leads(next_action_date);
CREATE INDEX idx_lead_activities_lead_id ON public.lead_activities(lead_id);

-- Trigger for updated_at on leads
CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for updated_at on sales_playbook
CREATE TRIGGER update_sales_playbook_updated_at
  BEFORE UPDATE ON public.sales_playbook
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies for leads
CREATE POLICY "Admins with lead permission can view leads"
  ON public.leads FOR SELECT
  TO authenticated
  USING (public.has_admin_permission(auth.uid(), 'view_reports') OR public.has_admin_permission(auth.uid(), 'manage_users'));

CREATE POLICY "Admins with lead permission can insert leads"
  ON public.leads FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin_user(auth.uid()));

CREATE POLICY "Admins with lead permission can update leads"
  ON public.leads FOR UPDATE
  TO authenticated
  USING (public.is_admin_user(auth.uid()));

-- RLS Policies for lead_activities
CREATE POLICY "Admins can view lead activities"
  ON public.lead_activities FOR SELECT
  TO authenticated
  USING (public.is_admin_user(auth.uid()));

CREATE POLICY "Admins can insert lead activities"
  ON public.lead_activities FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin_user(auth.uid()));

-- RLS Policies for sales_playbook
CREATE POLICY "Admins can view playbook"
  ON public.sales_playbook FOR SELECT
  TO authenticated
  USING (public.is_admin_user(auth.uid()));

CREATE POLICY "Super admins can update playbook"
  ON public.sales_playbook FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_permissions
      WHERE user_id = auth.uid() AND permission_level = 'super_admin'
    )
  );

CREATE POLICY "Super admins can insert playbook"
  ON public.sales_playbook FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_permissions
      WHERE user_id = auth.uid() AND permission_level = 'super_admin'
    )
  );

-- Insert default playbook content
INSERT INTO public.sales_playbook (section_key, title, content, order_index) VALUES
('discurso_base', 'Discurso Base do Identity', E'## O que é o Identity?\n\nO Identity é um processo de autoconhecimento profundo que revela seu Código da Essência — uma combinação única de 4 pilares que mostram quem você realmente é.\n\n### Pontos-chave:\n- **Não é teste de personalidade comum** — é um mapa completo da sua essência\n- **Baseado em 4 pilares científicos** — DISC, Temperamentos, Eneagrama e mais\n- **Relatório personalizado com IA** — análise profunda e contextualizada\n- **Ativações práticas** — não para na teoria, você aplica no dia a dia', 1),
('qualificacao', 'Perguntas de Qualificação', E'## Antes de apresentar o Identity:\n\n1. **O que te trouxe até aqui?** (entender a dor)\n2. **Você já fez algum teste de personalidade antes?** (nível de consciência)\n3. **O que você espera descobrir sobre si mesmo?** (expectativa)\n4. **Tem alguma decisão importante pela frente?** (urgência)\n5. **Está buscando isso para você ou para sua empresa?** (B2C vs B2B)', 2),
('objecoes', 'Objeções Comuns e Respostas', E'## Principais objeções:\n\n### "É caro"\n**Resposta:** "Entendo. Quanto você já gastou em cursos e mentorias que não funcionaram porque não consideravam quem você realmente é? O Identity é a base que faz todo o resto funcionar."\n\n### "Já fiz vários testes"\n**Resposta:** "Perfeito, então você vai perceber a diferença. O Identity não é um teste isolado — ele cruza 4 metodologias e gera um relatório único com IA que nenhum outro sistema oferece."\n\n### "Preciso pensar"\n**Resposta:** "Claro. Posso perguntar: o que especificamente você precisa avaliar? Assim consigo te ajudar a tomar a melhor decisão."', 3),
('nao_prometer', 'O que NÃO Prometer', E'## Nunca diga:\n\n❌ "Vai resolver todos seus problemas"\n❌ "Garante sucesso profissional"\n❌ "Substitui terapia ou coaching"\n❌ "Resultado imediato"\n❌ "Serve para diagnosticar transtornos"\n\n## Sempre deixe claro:\n\n✅ É uma ferramenta de autoconhecimento\n✅ Os resultados dependem do engajamento\n✅ É complementar a outros processos\n✅ Requer reflexão e aplicação prática', 4),
('precos', 'Regras de Preço e Exceções', E'## Política de Preços:\n\n### Preço cheio:\n- Identity Completo: R$ 297\n- Combo Identity + Ativação: R$ 497\n\n### Descontos permitidos:\n- Cupom ativo de campanha (verificar no Admin)\n- Indicação de cliente ativo: 10% off\n- Pacote empresa (5+): consultar CEO\n\n### NUNCA:\n- Dar desconto "porque sim"\n- Prometer preço especial sem aprovação\n- Negociar parcelamento fora do padrão', 5);

-- Update existing super_admin permissions to include can_manage_leads
UPDATE public.admin_permissions
SET can_manage_leads = true
WHERE permission_level = 'super_admin';