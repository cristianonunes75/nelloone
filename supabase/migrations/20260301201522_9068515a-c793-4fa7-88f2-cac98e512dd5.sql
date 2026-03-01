
-- Table: discernir_circle_profile_questions
CREATE TABLE public.discernir_circle_profile_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  version text NOT NULL DEFAULT 'v1',
  order_index int NOT NULL,
  block text NOT NULL CHECK (block IN ('lideranca','acolhimento','comunicacao','equipe','espiritualidade','conducao')),
  prompt text NOT NULL,
  is_active boolean NOT NULL DEFAULT true
);

ALTER TABLE public.discernir_circle_profile_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read questions"
  ON public.discernir_circle_profile_questions FOR SELECT
  TO authenticated, anon
  USING (true);

-- Table: discernir_circle_profiles
CREATE TABLE public.discernir_circle_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  version text NOT NULL DEFAULT 'v1',
  status text NOT NULL DEFAULT 'completed' CHECK (status IN ('draft','completed')),
  answers jsonb NOT NULL,
  scores jsonb NOT NULL,
  percentages jsonb NOT NULL,
  ranking jsonb NOT NULL,
  primary_role text NOT NULL,
  secondary_role text,
  tertiary_role text,
  notes text
);

ALTER TABLE public.discernir_circle_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profiles"
  ON public.discernir_circle_profiles FOR SELECT
  TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Users can insert own profiles"
  ON public.discernir_circle_profiles FOR INSERT
  TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own profiles"
  ON public.discernir_circle_profiles FOR UPDATE
  TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own profiles"
  ON public.discernir_circle_profiles FOR DELETE
  TO authenticated USING (user_id = auth.uid());

-- Trigger for updated_at
CREATE TRIGGER update_discernir_circle_profiles_updated_at
  BEFORE UPDATE ON public.discernir_circle_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed questions v1
INSERT INTO public.discernir_circle_profile_questions (version, order_index, block, prompt) VALUES
('v1', 1, 'lideranca', 'Quando o grupo fica em silêncio, eu costumo puxar a conversa.'),
('v1', 2, 'lideranca', 'Sinto facilidade em organizar pessoas e atividades.'),
('v1', 3, 'lideranca', 'Assumo responsabilidades mesmo quando ninguém pede.'),
('v1', 4, 'lideranca', 'Consigo tomar decisões mesmo sem ter todas as respostas.'),
('v1', 5, 'lideranca', 'Pessoas costumam procurar minha opinião antes de agir.'),
('v1', 6, 'lideranca', 'Gosto de motivar pessoas quando percebo desânimo.'),
('v1', 7, 'lideranca', 'Consigo manter o grupo focado quando dispersa.'),
('v1', 8, 'lideranca', 'Tenho facilidade para conduzir momentos em grupo.'),
('v1', 9, 'acolhimento', 'Percebo rapidamente quando alguém está deslocado.'),
('v1', 10, 'acolhimento', 'Escuto mais do que falo em conversas profundas.'),
('v1', 11, 'acolhimento', 'Pessoas se sentem à vontade para compartilhar comigo.'),
('v1', 12, 'acolhimento', 'Tenho paciência com quem pensa diferente de mim.'),
('v1', 13, 'acolhimento', 'Evito julgamentos rápidos sobre atitudes dos outros.'),
('v1', 14, 'acolhimento', 'Consigo acolher alguém mesmo sem concordar com ele.'),
('v1', 15, 'acolhimento', 'Prefiro compreender antes de aconselhar.'),
('v1', 16, 'acolhimento', 'Sinto alegria em cuidar das pessoas do grupo.'),
('v1', 17, 'comunicacao', 'Consigo explicar ideias de forma simples.'),
('v1', 18, 'comunicacao', 'Tenho facilidade para conversar com pessoas tímidas.'),
('v1', 19, 'comunicacao', 'Uso exemplos da vida real para ajudar alguém a entender algo.'),
('v1', 20, 'comunicacao', 'Sei equilibrar leveza e seriedade nas conversas.'),
('v1', 21, 'comunicacao', 'Percebo quando o grupo está entediado ou desconectado.'),
('v1', 22, 'comunicacao', 'Gosto de estimular participação de todos.'),
('v1', 23, 'comunicacao', 'Consigo fazer perguntas que ajudam os outros a refletir.'),
('v1', 24, 'comunicacao', 'Sei respeitar o tempo de cada pessoa se expressar.'),
('v1', 25, 'equipe', 'Consigo dividir liderança sem precisar controlar tudo.'),
('v1', 26, 'equipe', 'Aceito sugestões mesmo quando penso diferente.'),
('v1', 27, 'equipe', 'Tenho facilidade em trabalhar em dupla.'),
('v1', 28, 'equipe', 'Consigo apoiar sem precisar aparecer.'),
('v1', 29, 'equipe', 'Confio no processo do grupo, mesmo sem resultados imediatos.'),
('v1', 30, 'equipe', 'Valorizo mais o crescimento do grupo do que o meu destaque pessoal.'),
('v1', 31, 'espiritualidade', 'Rezo pelas pessoas que acompanho.'),
('v1', 32, 'espiritualidade', 'Busco ouvir antes de ensinar.'),
('v1', 33, 'espiritualidade', 'Entendo que conduzir é servir, não controlar.'),
('v1', 34, 'espiritualidade', 'Procuro agir com humildade mesmo quando estou certo.'),
('v1', 35, 'espiritualidade', 'Confio que Deus age mesmo quando não vejo resultados.'),
('v1', 36, 'espiritualidade', 'Sinto responsabilidade espiritual ao cuidar de jovens.'),
('v1', 37, 'espiritualidade', 'Tento ser testemunho mais pelas atitudes do que pelas palavras.'),
('v1', 38, 'espiritualidade', 'Reconheço minhas limitações diante da missão.'),
('v1', 39, 'conducao', 'Tenho facilidade em animar ambientes.'),
('v1', 40, 'conducao', 'Consigo trazer calma quando há tensão.'),
('v1', 41, 'conducao', 'Percebo quando é hora de falar ou silenciar.'),
('v1', 42, 'conducao', 'Sei equilibrar firmeza e carinho.'),
('v1', 43, 'conducao', 'Prefiro inspirar do que impor.'),
('v1', 44, 'conducao', 'Gosto de ver outras pessoas crescendo mais do que eu.');
