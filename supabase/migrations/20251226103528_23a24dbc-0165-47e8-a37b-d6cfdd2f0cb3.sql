-- Criar tabela para progresso do plano de 7 dias dos testes
CREATE TABLE public.test_evolution_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  test_type TEXT NOT NULL,
  day_number INTEGER NOT NULL CHECK (day_number >= 1 AND day_number <= 7),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, test_type, day_number)
);

-- Enable RLS
ALTER TABLE public.test_evolution_progress ENABLE ROW LEVEL SECURITY;

-- Users can view their own progress
CREATE POLICY "Users can view their own progress"
ON public.test_evolution_progress
FOR SELECT
USING (auth.uid() = user_id);

-- Users can create their own progress
CREATE POLICY "Users can create their own progress"
ON public.test_evolution_progress
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own progress
CREATE POLICY "Users can update their own progress"
ON public.test_evolution_progress
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own progress
CREATE POLICY "Users can delete their own progress"
ON public.test_evolution_progress
FOR DELETE
USING (auth.uid() = user_id);

-- Admins can view all progress
CREATE POLICY "Admins can view all progress"
ON public.test_evolution_progress
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));