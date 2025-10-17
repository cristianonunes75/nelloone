-- Update test description and ensure correct pricing
UPDATE tests 
SET 
  description = 'Descubra quais arquétipos influenciam sua imagem, decisões e comunicação. Uma jornada de autoconhecimento baseada nos 12 arquétipos universais. Responda 12 perguntas gratuitamente e desbloqueie o resultado completo por R$ 29,00.',
  price_brl = 29.00,
  questions_count = 36
WHERE id = 'e1a3511e-4e79-47a1-bbf8-5f7eba91be9c';

-- Delete existing questions
DELETE FROM test_questions WHERE test_id = 'e1a3511e-4e79-47a1-bbf8-5f7eba91be9c';

-- Insert the 12 free initial questions
INSERT INTO test_questions (id, test_id, question_number, question_text, options) VALUES
('a1111111-1111-1111-1111-111111111111', 'e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 1, 'Gosto de cuidar dos outros e me sinto bem ao ajudar.', '[
  {"text": "Discordo totalmente", "value": 0, "archetype": "Prestativo"},
  {"text": "Discordo", "value": 1, "archetype": "Prestativo"},
  {"text": "Neutro", "value": 2, "archetype": "Prestativo"},
  {"text": "Concordo", "value": 3, "archetype": "Prestativo"},
  {"text": "Concordo totalmente", "value": 4, "archetype": "Prestativo"}
]'),
('a2222222-2222-2222-2222-222222222222', 'e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 2, 'Tenho facilidade de fazer as pessoas rirem.', '[
  {"text": "Discordo totalmente", "value": 0, "archetype": "Bobo da Corte"},
  {"text": "Discordo", "value": 1, "archetype": "Bobo da Corte"},
  {"text": "Neutro", "value": 2, "archetype": "Bobo da Corte"},
  {"text": "Concordo", "value": 3, "archetype": "Bobo da Corte"},
  {"text": "Concordo totalmente", "value": 4, "archetype": "Bobo da Corte"}
]'),
('a3333333-3333-3333-3333-333333333333', 'e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 3, 'Costumo buscar o sentido das coisas e tenho uma fé firme.', '[
  {"text": "Discordo totalmente", "value": 0, "archetype": "Inocente"},
  {"text": "Discordo", "value": 1, "archetype": "Inocente"},
  {"text": "Neutro", "value": 2, "archetype": "Inocente"},
  {"text": "Concordo", "value": 3, "archetype": "Inocente"},
  {"text": "Concordo totalmente", "value": 4, "archetype": "Inocente"}
]'),
('a4444444-4444-4444-4444-444444444444', 'e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 4, 'Sinto necessidade de romper padrões e criar algo novo.', '[
  {"text": "Discordo totalmente", "value": 0, "archetype": "Criador"},
  {"text": "Discordo", "value": 1, "archetype": "Criador"},
  {"text": "Neutro", "value": 2, "archetype": "Criador"},
  {"text": "Concordo", "value": 3, "archetype": "Criador"},
  {"text": "Concordo totalmente", "value": 4, "archetype": "Criador"}
]'),
('a5555555-5555-5555-5555-555555555555', 'e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 5, 'Tenho um lado rebelde e já questionei autoridades.', '[
  {"text": "Discordo totalmente", "value": 0, "archetype": "Rebelde"},
  {"text": "Discordo", "value": 1, "archetype": "Rebelde"},
  {"text": "Neutro", "value": 2, "archetype": "Rebelde"},
  {"text": "Concordo", "value": 3, "archetype": "Rebelde"},
  {"text": "Concordo totalmente", "value": 4, "archetype": "Rebelde"}
]'),
('a6666666-6666-6666-6666-666666666666', 'e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 6, 'Sou leal, protetor e gosto de pertencer a algo maior.', '[
  {"text": "Discordo totalmente", "value": 0, "archetype": "Homem Comum"},
  {"text": "Discordo", "value": 1, "archetype": "Homem Comum"},
  {"text": "Neutro", "value": 2, "archetype": "Homem Comum"},
  {"text": "Concordo", "value": 3, "archetype": "Homem Comum"},
  {"text": "Concordo totalmente", "value": 4, "archetype": "Homem Comum"}
]'),
('a7777777-7777-7777-7777-777777777777', 'e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 7, 'Me vejo como uma pessoa forte, que lidera naturalmente.', '[
  {"text": "Discordo totalmente", "value": 0, "archetype": "Governante"},
  {"text": "Discordo", "value": 1, "archetype": "Governante"},
  {"text": "Neutro", "value": 2, "archetype": "Governante"},
  {"text": "Concordo", "value": 3, "archetype": "Governante"},
  {"text": "Concordo totalmente", "value": 4, "archetype": "Governante"}
]'),
('a8888888-8888-8888-8888-888888888888', 'e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 8, 'Gosto de mergulhar no invisível e descobrir verdades ocultas.', '[
  {"text": "Discordo totalmente", "value": 0, "archetype": "Sábio"},
  {"text": "Discordo", "value": 1, "archetype": "Sábio"},
  {"text": "Neutro", "value": 2, "archetype": "Sábio"},
  {"text": "Concordo", "value": 3, "archetype": "Sábio"},
  {"text": "Concordo totalmente", "value": 4, "archetype": "Sábio"}
]'),
('a9999999-9999-9999-9999-999999999999', 'e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 9, 'Amo desafios e não aceito a mediocridade facilmente.', '[
  {"text": "Discordo totalmente", "value": 0, "archetype": "Herói"},
  {"text": "Discordo", "value": 1, "archetype": "Herói"},
  {"text": "Neutro", "value": 2, "archetype": "Herói"},
  {"text": "Concordo", "value": 3, "archetype": "Herói"},
  {"text": "Concordo totalmente", "value": 4, "archetype": "Herói"}
]'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 10, 'Acredito que tudo pode ser melhorado com beleza e sensibilidade.', '[
  {"text": "Discordo totalmente", "value": 0, "archetype": "Criador"},
  {"text": "Discordo", "value": 1, "archetype": "Criador"},
  {"text": "Neutro", "value": 2, "archetype": "Criador"},
  {"text": "Concordo", "value": 3, "archetype": "Criador"},
  {"text": "Concordo totalmente", "value": 4, "archetype": "Criador"}
]'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 11, 'Costumo olhar a vida de forma prática e com senso de realidade.', '[
  {"text": "Discordo totalmente", "value": 0, "archetype": "Homem Comum"},
  {"text": "Discordo", "value": 1, "archetype": "Homem Comum"},
  {"text": "Neutro", "value": 2, "archetype": "Homem Comum"},
  {"text": "Concordo", "value": 3, "archetype": "Homem Comum"},
  {"text": "Concordo totalmente", "value": 4, "archetype": "Homem Comum"}
]'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 12, 'Sou movido por emoção, conexão e intensidade nos vínculos.', '[
  {"text": "Discordo totalmente", "value": 0, "archetype": "Amante"},
  {"text": "Discordo", "value": 1, "archetype": "Amante"},
  {"text": "Neutro", "value": 2, "archetype": "Amante"},
  {"text": "Concordo", "value": 3, "archetype": "Amante"},
  {"text": "Concordo totalmente", "value": 4, "archetype": "Amante"}
]'),

-- Insert the 24 paid questions
('b1111111-1111-1111-1111-111111111111', 'e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 13, 'Tenho facilidade em criar novas ideias e soluções únicas.', '[
  {"text": "Discordo totalmente", "value": 0, "archetype": "Criador"},
  {"text": "Discordo", "value": 1, "archetype": "Criador"},
  {"text": "Neutro", "value": 2, "archetype": "Criador"},
  {"text": "Concordo", "value": 3, "archetype": "Criador"},
  {"text": "Concordo totalmente", "value": 4, "archetype": "Criador"}
]'),
('b2222222-2222-2222-2222-222222222222', 'e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 14, 'Preciso de liberdade e me sinto sufocado com controle.', '[
  {"text": "Discordo totalmente", "value": 0, "archetype": "Explorador"},
  {"text": "Discordo", "value": 1, "archetype": "Explorador"},
  {"text": "Neutro", "value": 2, "archetype": "Explorador"},
  {"text": "Concordo", "value": 3, "archetype": "Explorador"},
  {"text": "Concordo totalmente", "value": 4, "archetype": "Explorador"}
]'),
('b3333333-3333-3333-3333-333333333333', 'e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 15, 'Me destaco por ser um bom conselheiro, mesmo em silêncio.', '[
  {"text": "Discordo totalmente", "value": 0, "archetype": "Sábio"},
  {"text": "Discordo", "value": 1, "archetype": "Sábio"},
  {"text": "Neutro", "value": 2, "archetype": "Sábio"},
  {"text": "Concordo", "value": 3, "archetype": "Sábio"},
  {"text": "Concordo totalmente", "value": 4, "archetype": "Sábio"}
]'),
('b4444444-4444-4444-4444-444444444444', 'e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 16, 'Costumo ajudar os outros antes de pensar em mim.', '[
  {"text": "Discordo totalmente", "value": 0, "archetype": "Prestativo"},
  {"text": "Discordo", "value": 1, "archetype": "Prestativo"},
  {"text": "Neutro", "value": 2, "archetype": "Prestativo"},
  {"text": "Concordo", "value": 3, "archetype": "Prestativo"},
  {"text": "Concordo totalmente", "value": 4, "archetype": "Prestativo"}
]'),
('b5555555-5555-5555-5555-555555555555', 'e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 17, 'Busco transformar as situações, mesmo quando são difíceis.', '[
  {"text": "Discordo totalmente", "value": 0, "archetype": "Mago"},
  {"text": "Discordo", "value": 1, "archetype": "Mago"},
  {"text": "Neutro", "value": 2, "archetype": "Mago"},
  {"text": "Concordo", "value": 3, "archetype": "Mago"},
  {"text": "Concordo totalmente", "value": 4, "archetype": "Mago"}
]'),
('b6666666-6666-6666-6666-666666666666', 'e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 18, 'Tenho uma fé firme e confio na providência.', '[
  {"text": "Discordo totalmente", "value": 0, "archetype": "Inocente"},
  {"text": "Discordo", "value": 1, "archetype": "Inocente"},
  {"text": "Neutro", "value": 2, "archetype": "Inocente"},
  {"text": "Concordo", "value": 3, "archetype": "Inocente"},
  {"text": "Concordo totalmente", "value": 4, "archetype": "Inocente"}
]'),
('b7777777-7777-7777-7777-777777777777', 'e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 19, 'Penso rápido, tenho senso de humor e sou leve nas relações.', '[
  {"text": "Discordo totalmente", "value": 0, "archetype": "Bobo da Corte"},
  {"text": "Discordo", "value": 1, "archetype": "Bobo da Corte"},
  {"text": "Neutro", "value": 2, "archetype": "Bobo da Corte"},
  {"text": "Concordo", "value": 3, "archetype": "Bobo da Corte"},
  {"text": "Concordo totalmente", "value": 4, "archetype": "Bobo da Corte"}
]'),
('b8888888-8888-8888-8888-888888888888', 'e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 20, 'Não gosto de injustiça, mesmo que isso cause conflitos.', '[
  {"text": "Discordo totalmente", "value": 0, "archetype": "Herói"},
  {"text": "Discordo", "value": 1, "archetype": "Herói"},
  {"text": "Neutro", "value": 2, "archetype": "Herói"},
  {"text": "Concordo", "value": 3, "archetype": "Herói"},
  {"text": "Concordo totalmente", "value": 4, "archetype": "Herói"}
]'),
('b9999999-9999-9999-9999-999999999999', 'e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 21, 'Admiro o que é belo e bem feito.', '[
  {"text": "Discordo totalmente", "value": 0, "archetype": "Amante"},
  {"text": "Discordo", "value": 1, "archetype": "Amante"},
  {"text": "Neutro", "value": 2, "archetype": "Amante"},
  {"text": "Concordo", "value": 3, "archetype": "Amante"},
  {"text": "Concordo totalmente", "value": 4, "archetype": "Amante"}
]'),
('baaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 22, 'Gosto de estabilidade e praticidade no meu dia a dia.', '[
  {"text": "Discordo totalmente", "value": 0, "archetype": "Homem Comum"},
  {"text": "Discordo", "value": 1, "archetype": "Homem Comum"},
  {"text": "Neutro", "value": 2, "archetype": "Homem Comum"},
  {"text": "Concordo", "value": 3, "archetype": "Homem Comum"},
  {"text": "Concordo totalmente", "value": 4, "archetype": "Homem Comum"}
]'),
('bbbbbbbb-1111-1111-1111-bbbbbbbbbbbb', 'e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 23, 'Sinto que minha missão é cuidar e acolher.', '[
  {"text": "Discordo totalmente", "value": 0, "archetype": "Prestativo"},
  {"text": "Discordo", "value": 1, "archetype": "Prestativo"},
  {"text": "Neutro", "value": 2, "archetype": "Prestativo"},
  {"text": "Concordo", "value": 3, "archetype": "Prestativo"},
  {"text": "Concordo totalmente", "value": 4, "archetype": "Prestativo"}
]'),
('cccccccc-1111-1111-1111-cccccccccccc', 'e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 24, 'Tenho iniciativa para liderar projetos com coragem.', '[
  {"text": "Discordo totalmente", "value": 0, "archetype": "Governante"},
  {"text": "Discordo", "value": 1, "archetype": "Governante"},
  {"text": "Neutro", "value": 2, "archetype": "Governante"},
  {"text": "Concordo", "value": 3, "archetype": "Governante"},
  {"text": "Concordo totalmente", "value": 4, "archetype": "Governante"}
]'),
('dddddddd-1111-1111-1111-dddddddddddd', 'e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 25, 'Já fui chamado de sonhador ou espiritual demais.', '[
  {"text": "Discordo totalmente", "value": 0, "archetype": "Mago"},
  {"text": "Discordo", "value": 1, "archetype": "Mago"},
  {"text": "Neutro", "value": 2, "archetype": "Mago"},
  {"text": "Concordo", "value": 3, "archetype": "Mago"},
  {"text": "Concordo totalmente", "value": 4, "archetype": "Mago"}
]'),
('eeeeeeee-1111-1111-1111-eeeeeeeeeeee', 'e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 26, 'Evito regras que não fazem sentido para mim.', '[
  {"text": "Discordo totalmente", "value": 0, "archetype": "Rebelde"},
  {"text": "Discordo", "value": 1, "archetype": "Rebelde"},
  {"text": "Neutro", "value": 2, "archetype": "Rebelde"},
  {"text": "Concordo", "value": 3, "archetype": "Rebelde"},
  {"text": "Concordo totalmente", "value": 4, "archetype": "Rebelde"}
]'),
('ffffffff-1111-1111-1111-ffffffffffff', 'e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 27, 'Tenho empatia natural e atraio pessoas em sofrimento.', '[
  {"text": "Discordo totalmente", "value": 0, "archetype": "Prestativo"},
  {"text": "Discordo", "value": 1, "archetype": "Prestativo"},
  {"text": "Neutro", "value": 2, "archetype": "Prestativo"},
  {"text": "Concordo", "value": 3, "archetype": "Prestativo"},
  {"text": "Concordo totalmente", "value": 4, "archetype": "Prestativo"}
]'),
('11111111-2222-2222-2222-111111111111', 'e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 28, 'Gosto de resolver conflitos e unir pessoas.', '[
  {"text": "Discordo totalmente", "value": 0, "archetype": "Homem Comum"},
  {"text": "Discordo", "value": 1, "archetype": "Homem Comum"},
  {"text": "Neutro", "value": 2, "archetype": "Homem Comum"},
  {"text": "Concordo", "value": 3, "archetype": "Homem Comum"},
  {"text": "Concordo totalmente", "value": 4, "archetype": "Homem Comum"}
]'),
('22222222-2222-2222-2222-222222222222', 'e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 29, 'Consigo identificar padrões e prever consequências.', '[
  {"text": "Discordo totalmente", "value": 0, "archetype": "Sábio"},
  {"text": "Discordo", "value": 1, "archetype": "Sábio"},
  {"text": "Neutro", "value": 2, "archetype": "Sábio"},
  {"text": "Concordo", "value": 3, "archetype": "Sábio"},
  {"text": "Concordo totalmente", "value": 4, "archetype": "Sábio"}
]'),
('33333333-2222-2222-2222-333333333333', 'e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 30, 'Preciso sentir que estou crescendo constantemente.', '[
  {"text": "Discordo totalmente", "value": 0, "archetype": "Explorador"},
  {"text": "Discordo", "value": 1, "archetype": "Explorador"},
  {"text": "Neutro", "value": 2, "archetype": "Explorador"},
  {"text": "Concordo", "value": 3, "archetype": "Explorador"},
  {"text": "Concordo totalmente", "value": 4, "archetype": "Explorador"}
]'),
('44444444-2222-2222-2222-444444444444', 'e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 31, 'Aprecio a ordem, disciplina e respeito à hierarquia.', '[
  {"text": "Discordo totalmente", "value": 0, "archetype": "Governante"},
  {"text": "Discordo", "value": 1, "archetype": "Governante"},
  {"text": "Neutro", "value": 2, "archetype": "Governante"},
  {"text": "Concordo", "value": 3, "archetype": "Governante"},
  {"text": "Concordo totalmente", "value": 4, "archetype": "Governante"}
]'),
('55555555-2222-2222-2222-555555555555', 'e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 32, 'Prefiro o silêncio à exposição.', '[
  {"text": "Discordo totalmente", "value": 0, "archetype": "Sábio"},
  {"text": "Discordo", "value": 1, "archetype": "Sábio"},
  {"text": "Neutro", "value": 2, "archetype": "Sábio"},
  {"text": "Concordo", "value": 3, "archetype": "Sábio"},
  {"text": "Concordo totalmente", "value": 4, "archetype": "Sábio"}
]'),
('66666666-2222-2222-2222-666666666666', 'e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 33, 'Me sinto bem ao guiar e inspirar outras pessoas.', '[
  {"text": "Discordo totalmente", "value": 0, "archetype": "Herói"},
  {"text": "Discordo", "value": 1, "archetype": "Herói"},
  {"text": "Neutro", "value": 2, "archetype": "Herói"},
  {"text": "Concordo", "value": 3, "archetype": "Herói"},
  {"text": "Concordo totalmente", "value": 4, "archetype": "Herói"}
]'),
('77777777-2222-2222-2222-777777777777', 'e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 34, 'Aprecio conforto, beleza e conexão com o sagrado.', '[
  {"text": "Discordo totalmente", "value": 0, "archetype": "Amante"},
  {"text": "Discordo", "value": 1, "archetype": "Amante"},
  {"text": "Neutro", "value": 2, "archetype": "Amante"},
  {"text": "Concordo", "value": 3, "archetype": "Amante"},
  {"text": "Concordo totalmente", "value": 4, "archetype": "Amante"}
]'),
('88888888-2222-2222-2222-888888888888', 'e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 35, 'Tenho medo de ser traído ou abandonado.', '[
  {"text": "Discordo totalmente", "value": 0, "archetype": "Amante"},
  {"text": "Discordo", "value": 1, "archetype": "Amante"},
  {"text": "Neutro", "value": 2, "archetype": "Amante"},
  {"text": "Concordo", "value": 3, "archetype": "Amante"},
  {"text": "Concordo totalmente", "value": 4, "archetype": "Amante"}
]'),
('99999999-2222-2222-2222-999999999999', 'e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 36, 'Questiono regras e desafio padrões desde cedo.', '[
  {"text": "Discordo totalmente", "value": 0, "archetype": "Rebelde"},
  {"text": "Discordo", "value": 1, "archetype": "Rebelde"},
  {"text": "Neutro", "value": 2, "archetype": "Rebelde"},
  {"text": "Concordo", "value": 3, "archetype": "Rebelde"},
  {"text": "Concordo totalmente", "value": 4, "archetype": "Rebelde"}
]');