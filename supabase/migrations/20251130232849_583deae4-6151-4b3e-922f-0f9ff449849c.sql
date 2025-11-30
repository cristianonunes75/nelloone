-- AI Prompts table for Miguel configuration
CREATE TABLE public.ai_prompts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  prompt_text text NOT NULL,
  description text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id)
);

-- AI Subprompts table for specialized prompts
CREATE TABLE public.ai_subprompts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_prompt_id uuid REFERENCES public.ai_prompts(id) ON DELETE CASCADE,
  name text NOT NULL,
  category text NOT NULL, -- 'guia', 'resultados', 'mapa', 'onboarding', 'acolhimento'
  prompt_text text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  priority integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Automations table for workflow automation
CREATE TABLE public.automations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  trigger_event text NOT NULL, -- 'test_completed', 'purchase_made', 'days_inactive', 'payment_failed'
  trigger_config jsonb NOT NULL DEFAULT '{}'::jsonb,
  action_type text NOT NULL, -- 'send_email', 'miguel_message', 'webhook', 'internal'
  action_config jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  execution_count integer NOT NULL DEFAULT 0,
  last_executed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Impersonation sessions for admin user simulation
CREATE TABLE public.impersonation_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid NOT NULL REFERENCES auth.users(id),
  target_user_id uuid NOT NULL REFERENCES auth.users(id),
  session_token text NOT NULL UNIQUE,
  started_at timestamptz NOT NULL DEFAULT now(),
  ended_at timestamptz,
  ip_address text,
  user_agent text,
  is_active boolean NOT NULL DEFAULT true
);

-- Enable RLS on all new tables
ALTER TABLE public.ai_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_subprompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.impersonation_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ai_prompts
CREATE POLICY "Admins can manage ai_prompts" ON public.ai_prompts
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view active prompts" ON public.ai_prompts
  FOR SELECT USING (is_active = true);

-- RLS Policies for ai_subprompts
CREATE POLICY "Admins can manage ai_subprompts" ON public.ai_subprompts
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view active subprompts" ON public.ai_subprompts
  FOR SELECT USING (is_active = true);

-- RLS Policies for automations
CREATE POLICY "Admins can manage automations" ON public.automations
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for impersonation_sessions
CREATE POLICY "Admins can manage impersonation sessions" ON public.impersonation_sessions
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Triggers for updated_at
CREATE TRIGGER update_ai_prompts_updated_at
  BEFORE UPDATE ON public.ai_prompts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ai_subprompts_updated_at
  BEFORE UPDATE ON public.ai_subprompts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_automations_updated_at
  BEFORE UPDATE ON public.automations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default Miguel prompt
INSERT INTO public.ai_prompts (name, prompt_text, description) VALUES
('miguel_base', 'Você é Miguel, o guia espiritual e emocional do Essentia. Seu tom é caloroso, acolhedor e humano - nunca robótico ou místico demais. Você ajuda os usuários em sua jornada de autoconhecimento, explicando testes, interpretando resultados e oferecendo orientação simbólica e espiritual.', 'Prompt base do Miguel - identidade e tom de voz');

-- Insert default subprompts
INSERT INTO public.ai_subprompts (parent_prompt_id, name, category, prompt_text, priority) VALUES
((SELECT id FROM public.ai_prompts WHERE name = 'miguel_base'), 'Guia de Jornada', 'guia', 'Quando guiando o usuário pela jornada, seja encorajador e explique cada etapa com clareza. Use metáforas de caminho e descoberta.', 1),
((SELECT id FROM public.ai_prompts WHERE name = 'miguel_base'), 'Interpretação de Resultados', 'resultados', 'Ao interpretar resultados de testes, seja profundo mas acessível. Conecte os insights com a vida prática do usuário.', 2),
((SELECT id FROM public.ai_prompts WHERE name = 'miguel_base'), 'Geração do Mapa', 'mapa', 'Na geração do Mapa da Essência, integre todos os resultados em uma narrativa coesa. Use linguagem simbólica e poética.', 3),
((SELECT id FROM public.ai_prompts WHERE name = 'miguel_base'), 'Onboarding', 'onboarding', 'No primeiro contato, seja acolhedor e explique a jornada que aguarda o usuário. Crie expectativa positiva.', 4),
((SELECT id FROM public.ai_prompts WHERE name = 'miguel_base'), 'Acolhimento', 'acolhimento', 'Quando o usuário expressar dificuldades ou emoções, ofereça escuta empática e palavras de conforto antes de orientações práticas.', 5);