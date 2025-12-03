-- Criar 5 testes PT-PT faltantes

-- 1. Arquétipos com Propósito PT-PT
INSERT INTO tests (name, type, description, questions_count, estimated_minutes, price_brl, is_free, icon, language, active)
VALUES (
  'Arquétipos com Propósito',
  'arquetipos_proposito',
  'Descobre qual energia arquetípica guia a tua presença no mundo através de 36 perguntas intuitivas que revelam os teus arquétipos dominantes.',
  36, 15, 0.00, true, 'Sparkles', 'pt-pt', true
);

-- 2. DISC PT-PT
INSERT INTO tests (name, type, description, questions_count, estimated_minutes, price_brl, is_free, icon, language, active, stripe_price_id)
VALUES (
  'DISC',
  'disc',
  'Este teste identifica o teu perfil comportamental natural. A metodologia DISC revela como reages, decides, comunicas e contribuis em diferentes contextos da vida e do trabalho.',
  28, 12, 17.90, false, 'Target', 'pt-pt', true, 'price_1SZUnqDjhZZxZELMtU9tUMFm'
);

-- 3. Temperamentos PT-PT
INSERT INTO tests (name, type, description, questions_count, estimated_minutes, price_brl, is_free, icon, language, active, stripe_price_id)
VALUES (
  'Temperamentos',
  'temperamentos',
  'Base tradicional (São Tomás de Aquino) adaptada ao português europeu.',
  32, 10, 24.90, false, 'Thermometer', 'pt-pt', true, 'price_1SZUnqDjhZZxZELMtU9tUMFm'
);

-- 4. Inteligências Múltiplas PT-PT
INSERT INTO tests (name, type, description, questions_count, estimated_minutes, price_brl, is_free, icon, language, active)
VALUES (
  'Inteligências Múltiplas',
  'inteligencias_multiplas',
  'Cada pessoa tem uma combinação única de talentos e formas de pensar. O teste das Inteligências Múltiplas mostra quais áreas da tua mente têm mais energia — e como usá-las no trabalho, na vocação e na vida.',
  40, 12, 27.90, false, 'Lightbulb', 'pt-pt', true
);

-- 5. Eneagrama Essencial PT-PT
INSERT INTO tests (name, type, description, questions_count, estimated_minutes, price_brl, is_free, icon, language, active, stripe_price_id)
VALUES (
  'Eneagrama Essencial',
  'eneagrama',
  'O Eneagrama revela as nove formas essenciais de ver o mundo. Cada tipo expressa um dom e um desafio. Descobrir o teu é compreender o caminho da transformação interior.',
  45, 12, 44.90, false, 'Compass', 'pt-pt', true, 'price_1SNBLhDjhZZxZELMhSvpHn8X'
);