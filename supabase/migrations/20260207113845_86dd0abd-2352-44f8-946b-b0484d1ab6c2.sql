-- Tabela para armazenar contexto adicional dos relatórios
CREATE TABLE public.report_context (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  report_type TEXT NOT NULL CHECK (report_type IN ('parceiro', 'pai_para_filho', 'filho_para_pai', 'para_gestor', 'para_equipe')),
  user_age INTEGER,
  other_person_age INTEGER,
  relationship_stage TEXT,
  special_context TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, report_type)
);

-- Enable RLS
ALTER TABLE public.report_context ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own report context"
  ON public.report_context FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own report context"
  ON public.report_context FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own report context"
  ON public.report_context FOR UPDATE
  USING (auth.uid() = user_id);

-- Trigger para updated_at
CREATE TRIGGER update_report_context_updated_at
  BEFORE UPDATE ON public.report_context
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Index para busca rápida
CREATE INDEX idx_report_context_user_type ON public.report_context(user_id, report_type);