-- Inserir o teste Arquétipos com Propósito
INSERT INTO tests (
  name,
  description,
  type,
  questions_count,
  estimated_minutes,
  is_free,
  price_brl,
  active,
  icon
) VALUES (
  'Arquétipos com Propósito',
  'Descubra seu arquétipo dominante e desbloqueie sua essência visual e emocional. Este teste revela os padrões comportamentais e emocionais que moldam sua identidade.',
  'arquetipos_proposito',
  12,
  10,
  true,
  0,
  true,
  'Sparkles'
) ON CONFLICT DO NOTHING;

-- Inserir as 12 perguntas da versão gratuita
-- Os arquétipos principais: Governante, Amante, Criador, Inocente, Sábio, Explorador, Rebelde, Mago, Herói, Prestativo, Bobo da Corte, Homem Comum

-- Pergunta 1: Como você toma decisões importantes?
INSERT INTO test_questions (test_id, question_number, question_text, options)
SELECT id, 1, 
  'Como você toma decisões importantes na sua vida?',
  jsonb_build_array(
    jsonb_build_object('text', 'Analiso todos os dados e busco a solução mais lógica', 'archetype', 'Governante', 'value', 'A'),
    jsonb_build_object('text', 'Sigo meu coração e o que me faz sentir bem', 'archetype', 'Amante', 'value', 'B'),
    jsonb_build_object('text', 'Imagino possibilidades criativas e inovadoras', 'archetype', 'Criador', 'value', 'C'),
    jsonb_build_object('text', 'Confio que tudo vai dar certo naturalmente', 'archetype', 'Inocente', 'value', 'D')
  )
FROM tests WHERE type = 'arquetipos_proposito';

-- Pergunta 2: O que mais te motiva?
INSERT INTO test_questions (test_id, question_number, question_text, options)
SELECT id, 2,
  'O que mais te motiva no dia a dia?',
  jsonb_build_array(
    jsonb_build_object('text', 'Conquistar objetivos e ter controle sobre resultados', 'archetype', 'Governante', 'value', 'A'),
    jsonb_build_object('text', 'Viver experiências intensas e conexões profundas', 'archetype', 'Amante', 'value', 'B'),
    jsonb_build_object('text', 'Expressar minha criatividade e deixar minha marca', 'archetype', 'Criador', 'value', 'C'),
    jsonb_build_object('text', 'Aproveitar a simplicidade e a alegria de cada momento', 'archetype', 'Inocente', 'value', 'D')
  )
FROM tests WHERE type = 'arquetipos_proposito';

-- Pergunta 3: Como você lida com desafios?
INSERT INTO test_questions (test_id, question_number, question_text, options)
SELECT id, 3,
  'Quando enfrenta um grande desafio, qual é sua primeira reação?',
  jsonb_build_array(
    jsonb_build_object('text', 'Traço um plano estratégico e assumo a liderança', 'archetype', 'Herói', 'value', 'A'),
    jsonb_build_object('text', 'Busco apoio e conexão com pessoas queridas', 'archetype', 'Prestativo', 'value', 'B'),
    jsonb_build_object('text', 'Vejo como uma oportunidade de aprender e crescer', 'archetype', 'Sábio', 'value', 'C'),
    jsonb_build_object('text', 'Prefiro encontrar uma forma não convencional de resolver', 'archetype', 'Rebelde', 'value', 'D')
  )
FROM tests WHERE type = 'arquetipos_proposito';

-- Pergunta 4: Qual ambiente te inspira mais?
INSERT INTO test_questions (test_id, question_number, question_text, options)
SELECT id, 4,
  'Em qual ambiente você se sente mais inspirado?',
  jsonb_build_array(
    jsonb_build_object('text', 'Em ambientes organizados onde tenho controle', 'archetype', 'Governante', 'value', 'A'),
    jsonb_build_object('text', 'Em lugares bonitos e sensorialmente agradáveis', 'archetype', 'Amante', 'value', 'B'),
    jsonb_build_object('text', 'Em espaços criativos onde posso experimentar', 'archetype', 'Criador', 'value', 'C'),
    jsonb_build_object('text', 'Em lugares novos e desconhecidos', 'archetype', 'Explorador', 'value', 'D')
  )
FROM tests WHERE type = 'arquetipos_proposito';

-- Pergunta 5: Como as pessoas te descrevem?
INSERT INTO test_questions (test_id, question_number, question_text, options)
SELECT id, 5,
  'Como as pessoas próximas costumam te descrever?',
  jsonb_build_array(
    jsonb_build_object('text', 'Responsável, organizado e confiável', 'archetype', 'Governante', 'value', 'A'),
    jsonb_build_object('text', 'Apaixonado, intenso e envolvente', 'archetype', 'Amante', 'value', 'B'),
    jsonb_build_object('text', 'Original, criativo e único', 'archetype', 'Criador', 'value', 'C'),
    jsonb_build_object('text', 'Divertido, leve e espontâneo', 'archetype', 'Bobo da Corte', 'value', 'D')
  )
FROM tests WHERE type = 'arquetipos_proposito';

-- Pergunta 6: Qual é seu maior medo?
INSERT INTO test_questions (test_id, question_number, question_text, options)
SELECT id, 6,
  'Qual é seu maior medo?',
  jsonb_build_array(
    jsonb_build_object('text', 'Perder o controle ou ser caótico', 'archetype', 'Governante', 'value', 'A'),
    jsonb_build_object('text', 'Ficar sozinho ou não ser amado', 'archetype', 'Amante', 'value', 'B'),
    jsonb_build_object('text', 'Não realizar meu potencial criativo', 'archetype', 'Criador', 'value', 'C'),
    jsonb_build_object('text', 'Ficar preso em uma rotina monótona', 'archetype', 'Explorador', 'value', 'D')
  )
FROM tests WHERE type = 'arquetipos_proposito';

-- Pergunta 7: Como você prefere passar seu tempo livre?
INSERT INTO test_questions (test_id, question_number, question_text, options)
SELECT id, 7,
  'Como você prefere passar seu tempo livre?',
  jsonb_build_array(
    jsonb_build_object('text', 'Planejando projetos e organizando minha vida', 'archetype', 'Governante', 'value', 'A'),
    jsonb_build_object('text', 'Curtindo momentos especiais com quem amo', 'archetype', 'Amante', 'value', 'B'),
    jsonb_build_object('text', 'Criando algo novo - arte, música, conteúdo', 'archetype', 'Criador', 'value', 'C'),
    jsonb_build_object('text', 'Estudando e expandindo meu conhecimento', 'archetype', 'Sábio', 'value', 'D')
  )
FROM tests WHERE type = 'arquetipos_proposito';

-- Pergunta 8: Qual sua relação com mudanças?
INSERT INTO test_questions (test_id, question_number, question_text, options)
SELECT id, 8,
  'Como você lida com mudanças inesperadas?',
  jsonb_build_array(
    jsonb_build_object('text', 'Prefiro estabilidade e previsibilidade', 'archetype', 'Homem Comum', 'value', 'A'),
    jsonb_build_object('text', 'Vejo como chance de transformação profunda', 'archetype', 'Mago', 'value', 'B'),
    jsonb_build_object('text', 'Encaro como uma aventura emocionante', 'archetype', 'Explorador', 'value', 'C'),
    jsonb_build_object('text', 'Desafio as regras e crio meu próprio caminho', 'archetype', 'Rebelde', 'value', 'D')
  )
FROM tests WHERE type = 'arquetipos_proposito';

-- Pergunta 9: Qual seu estilo de comunicação?
INSERT INTO test_questions (test_id, question_number, question_text, options)
SELECT id, 9,
  'Como você se comunica com os outros?',
  jsonb_build_array(
    jsonb_build_object('text', 'De forma direta, clara e objetiva', 'archetype', 'Governante', 'value', 'A'),
    jsonb_build_object('text', 'Com emoção, intensidade e proximidade', 'archetype', 'Amante', 'value', 'B'),
    jsonb_build_object('text', 'De forma original e expressiva', 'archetype', 'Criador', 'value', 'C'),
    jsonb_build_object('text', 'Com humor e leveza', 'archetype', 'Bobo da Corte', 'value', 'D')
  )
FROM tests WHERE type = 'arquetipos_proposito';

-- Pergunta 10: O que te deixa realizado?
INSERT INTO test_questions (test_id, question_number, question_text, options)
SELECT id, 10,
  'O que te traz verdadeira realização?',
  jsonb_build_array(
    jsonb_build_object('text', 'Alcançar metas e ver resultados concretos', 'archetype', 'Herói', 'value', 'A'),
    jsonb_build_object('text', 'Ajudar e fazer diferença na vida dos outros', 'archetype', 'Prestativo', 'value', 'B'),
    jsonb_build_object('text', 'Criar algo único que expressa minha visão', 'archetype', 'Criador', 'value', 'C'),
    jsonb_build_object('text', 'Viver experiências autênticas e verdadeiras', 'archetype', 'Explorador', 'value', 'D')
  )
FROM tests WHERE type = 'arquetipos_proposito';

-- Pergunta 11: Como você se vê no mundo?
INSERT INTO test_questions (test_id, question_number, question_text, options)
SELECT id, 11,
  'Como você se vê em relação ao mundo?',
  jsonb_build_array(
    jsonb_build_object('text', 'Como alguém que deve liderar e organizar', 'archetype', 'Governante', 'value', 'A'),
    jsonb_build_object('text', 'Como alguém que conecta e une pessoas', 'archetype', 'Amante', 'value', 'B'),
    jsonb_build_object('text', 'Como alguém que transforma e renova', 'archetype', 'Mago', 'value', 'C'),
    jsonb_build_object('text', 'Como parte de algo maior que eu', 'archetype', 'Homem Comum', 'value', 'D')
  )
FROM tests WHERE type = 'arquetipos_proposito';

-- Pergunta 12: Qual legado você quer deixar?
INSERT INTO test_questions (test_id, question_number, question_text, options)
SELECT id, 12,
  'Qual legado você quer deixar no mundo?',
  jsonb_build_array(
    jsonb_build_object('text', 'Estruturas e sistemas que perdurem', 'archetype', 'Governante', 'value', 'A'),
    jsonb_build_object('text', 'Relações profundas e amor verdadeiro', 'archetype', 'Amante', 'value', 'B'),
    jsonb_build_object('text', 'Obras criativas que inspirem outros', 'archetype', 'Criador', 'value', 'C'),
    jsonb_build_object('text', 'Conhecimento e sabedoria compartilhados', 'archetype', 'Sábio', 'value', 'D')
  )
FROM tests WHERE type = 'arquetipos_proposito';