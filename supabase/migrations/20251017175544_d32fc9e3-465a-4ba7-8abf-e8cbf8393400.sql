-- Create enum for test types
CREATE TYPE public.test_type AS ENUM (
  'disc',
  'mbti',
  'arquetipos',
  'inteligencias_multiplas',
  'linguagens_amor',
  'temperamentos',
  'eneagrama',
  'solis'
);

-- Create enum for test status
CREATE TYPE public.test_status AS ENUM (
  'not_started',
  'in_progress',
  'completed'
);

-- Create tests table (defines available tests)
CREATE TABLE public.tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type test_type NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  questions_count INTEGER NOT NULL,
  estimated_minutes INTEGER NOT NULL,
  icon TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create user_tests table (tracks user progress)
CREATE TABLE public.user_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  test_id UUID NOT NULL REFERENCES public.tests(id) ON DELETE CASCADE,
  status test_status NOT NULL DEFAULT 'not_started',
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  result_data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, test_id)
);

-- Create test_questions table
CREATE TABLE public.test_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id UUID NOT NULL REFERENCES public.tests(id) ON DELETE CASCADE,
  question_number INTEGER NOT NULL,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(test_id, question_number)
);

-- Create test_answers table
CREATE TABLE public.test_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_test_id UUID NOT NULL REFERENCES public.user_tests(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.test_questions(id) ON DELETE CASCADE,
  answer JSONB NOT NULL,
  answered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_test_id, question_id)
);

-- Enable RLS
ALTER TABLE public.tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_answers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tests (public read)
CREATE POLICY "Everyone can view active tests"
  ON public.tests FOR SELECT
  USING (active = true);

CREATE POLICY "Admins can manage tests"
  ON public.tests FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for user_tests
CREATE POLICY "Users can view their own tests"
  ON public.user_tests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own test records"
  ON public.user_tests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tests"
  ON public.user_tests FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all user tests"
  ON public.user_tests FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for test_questions (public read for active tests)
CREATE POLICY "Everyone can view questions for active tests"
  ON public.test_questions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.tests
      WHERE tests.id = test_questions.test_id
      AND tests.active = true
    )
  );

CREATE POLICY "Admins can manage questions"
  ON public.test_questions FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for test_answers
CREATE POLICY "Users can view their own answers"
  ON public.test_answers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_tests
      WHERE user_tests.id = test_answers.user_test_id
      AND user_tests.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own answers"
  ON public.test_answers FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_tests
      WHERE user_tests.id = test_answers.user_test_id
      AND user_tests.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own answers"
  ON public.test_answers FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_tests
      WHERE user_tests.id = test_answers.user_test_id
      AND user_tests.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all answers"
  ON public.test_answers FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Trigger for updated_at on user_tests
CREATE TRIGGER update_user_tests_updated_at
  BEFORE UPDATE ON public.user_tests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert the 8 tests
INSERT INTO public.tests (type, name, description, questions_count, estimated_minutes, icon) VALUES
  ('disc', 'DISC', 'Perfil comportamental e estilo de comunicação', 24, 10, 'Target'),
  ('mbti', 'MBTI', 'Tipos psicológicos e preferências cognitivas', 60, 15, 'Brain'),
  ('arquetipos', 'Arquétipos de Marca', 'Padrões simbólicos para comunicação e branding pessoal', 36, 12, 'Star'),
  ('inteligencias_multiplas', 'Inteligências Múltiplas', 'Reconheça seus talentos únicos (Howard Gardner)', 40, 12, 'Lightbulb'),
  ('linguagens_amor', 'Linguagens do Amor', 'Comunicação afetiva e relacional (Gary Chapman)', 30, 10, 'Heart'),
  ('temperamentos', 'Temperamentos', 'Base tradicional (São Tomás de Aquino)', 28, 10, 'Thermometer'),
  ('eneagrama', 'Eneagrama', 'Motivações profundas com abordagem psicológica', 45, 15, 'Compass'),
  ('solis', 'SOLIS', 'Simbologia da Luz Interior e de Estilo — expressão fotográfica', 32, 12, 'Cross');