-- Update Eneagrama test configuration
UPDATE tests 
SET 
  description = 'O Eneagrama revela as nove formas essenciais de ver o mundo. Cada tipo expressa um dom e um desafio. Descobrir o seu é compreender o caminho da transformação interior.',
  questions_count = 45,
  estimated_minutes = 12
WHERE type = 'eneagrama';

-- Delete existing Eneagrama questions
DELETE FROM test_questions WHERE test_id = (SELECT id FROM tests WHERE type = 'eneagrama');

-- Insert Eneagrama questions (45 questions, 5 per type)
INSERT INTO test_questions (test_id, question_number, question_text, options)
SELECT 
  (SELECT id FROM tests WHERE type = 'eneagrama'),
  q.question_number,
  q.question_text,
  jsonb_build_object(
    'scale', jsonb_build_array(
      jsonb_build_object('label', 'Discordo totalmente', 'value', 1),
      jsonb_build_object('label', 'Discordo', 'value', 2),
      jsonb_build_object('label', 'Neutro', 'value', 3),
      jsonb_build_object('label', 'Concordo', 'value', 4),
      jsonb_build_object('label', 'Concordo totalmente', 'value', 5)
    ),
    'type', q.enneagram_type
  )
FROM (VALUES
  -- Tipo 1: O Reformador (questões 1-5)
  (1, 'Sinto que preciso fazer tudo com perfeição e me cobro muito quando erro.', '1'),
  (2, 'Tenho forte senso de dever e me esforço para fazer o que é certo.', '1'),
  (3, 'Costumo corrigir as pessoas quando fazem algo errado.', '1'),
  (4, 'Valorizo regras e padrões bem definidos.', '1'),
  (5, 'Sinto culpa facilmente quando não correspondo às minhas próprias expectativas.', '1'),
  
  -- Tipo 2: O Ajudante (questões 6-10)
  (6, 'Sinto-me realizado quando ajudo alguém ou sou útil para o outro.', '2'),
  (7, 'Costumo colocar as necessidades dos outros acima das minhas.', '2'),
  (8, 'Sinto-me triste quando percebo que não sou valorizado ou reconhecido por ajudar.', '2'),
  (9, 'Tenho dificuldade em dizer não para as pessoas.', '2'),
  (10, 'Sinto que preciso ser amado para me sentir seguro.', '2'),
  
  -- Tipo 3: O Realizador (questões 11-15)
  (11, 'Busco ser o melhor em tudo o que faço e valorizo resultados e reconhecimento.', '3'),
  (12, 'Sinto que preciso mostrar uma boa imagem, mesmo quando não estou bem.', '3'),
  (13, 'Sou prático e foco em metas e produtividade.', '3'),
  (14, 'Costumo esconder vulnerabilidades para manter a aparência de sucesso.', '3'),
  (15, 'Gosto de desafios e me motivo por conquistas visíveis.', '3'),
  
  -- Tipo 4: O Romântico (questões 16-20)
  (16, 'Sou emocional e profundo, valorizo autenticidade e expressão sincera.', '4'),
  (17, 'Sinto emoções intensas e costumo refletir sobre elas com profundidade.', '4'),
  (18, 'Às vezes sinto que o mundo não me entende completamente.', '4'),
  (19, 'Procuro ser diferente e especial em tudo que faço.', '4'),
  (20, 'Costumo idealizar o amor e os relacionamentos.', '4'),
  
  -- Tipo 5: O Investigador (questões 21-25)
  (21, 'Sou observador, gosto de entender como as coisas funcionam.', '5'),
  (22, 'Prefiro pensar antes de agir e valorizo meu espaço e silêncio.', '5'),
  (23, 'Sinto que preciso acumular conhecimento antes de me expor.', '5'),
  (24, 'Costumo me afastar quando me sinto emocionalmente sobrecarregado.', '5'),
  (25, 'Valorizo autonomia e não gosto de depender de ninguém.', '5'),
  
  -- Tipo 6: O Leal (questões 26-30)
  (26, 'Sinto necessidade de segurança e de ter tudo sob controle.', '6'),
  (27, 'Costumo imaginar o que pode dar errado e planejo alternativas.', '6'),
  (28, 'Procuro líderes ou pessoas de confiança para me orientar.', '6'),
  (29, 'Tenho medo de ser traído ou abandonado.', '6'),
  (30, 'Sou leal e protetor com quem amo, mesmo quando estou inseguro.', '6'),
  
  -- Tipo 7: O Entusiasta (questões 31-35)
  (31, 'Sou otimista e gosto de manter o astral leve, mesmo em dificuldades.', '7'),
  (32, 'Evito pensar em problemas ou assuntos pesados.', '7'),
  (33, 'Gosto de ter muitas opções e evitar sentir-me preso a algo.', '7'),
  (34, 'Tenho facilidade em motivar os outros e trazer alegria ao ambiente.', '7'),
  (35, 'Sinto desconforto com rotinas e tarefas repetitivas.', '7'),
  
  -- Tipo 8: O Desafiador (questões 36-40)
  (36, 'Sinto-me à vontade ao tomar decisões firmes e proteger os meus.', '8'),
  (37, 'Costumo reagir com intensidade quando sinto injustiça.', '8'),
  (38, 'Tenho presença forte e não gosto de parecer vulnerável.', '8'),
  (39, 'Sou protetor e leal com quem confio.', '8'),
  (40, 'Prefiro ser respeitado a ser amado.', '8'),
  
  -- Tipo 9: O Pacificador (questões 41-45)
  (41, 'Valorizo a paz e evito conflitos sempre que possível.', '9'),
  (42, 'Gosto de ambientes tranquilos e pessoas equilibradas.', '9'),
  (43, 'Tenho dificuldade em expressar minha opinião quando há tensão.', '9'),
  (44, 'Sinto-me mais feliz quando todos ao redor estão bem.', '9'),
  (45, 'Prefiro me adaptar a impor minha vontade.', '9')
) AS q(question_number, question_text, enneagram_type);