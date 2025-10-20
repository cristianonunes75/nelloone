-- Update DISC test with new question count and timing
UPDATE tests 
SET 
  questions_count = 28,
  estimated_minutes = 12,
  description = 'Este teste identifica o seu perfil comportamental natural. A metodologia DISC revela como você reage, decide, comunica e contribui em diferentes contextos da vida e do trabalho.'
WHERE id = '7c533b3e-2ae8-4fd5-98b8-1d60b4f60559';

-- Delete existing DISC questions
DELETE FROM test_questions WHERE test_id = '7c533b3e-2ae8-4fd5-98b8-1d60b4f60559';

-- Insert all 28 DISC questions
INSERT INTO test_questions (test_id, question_number, question_text, options) VALUES
('7c533b3e-2ae8-4fd5-98b8-1d60b4f60559', 1, 'Diante de um novo desafio, você tende a:', 
 '[{"text":"Assumir o comando imediatamente","value":"D"},{"text":"Motivar as pessoas ao seu redor","value":"I"},{"text":"Esperar o momento certo para agir","value":"S"},{"text":"Analisar todos os detalhes antes de decidir","value":"C"}]'),

('7c533b3e-2ae8-4fd5-98b8-1d60b4f60559', 2, 'Quando precisa tomar uma decisão difícil:', 
 '[{"text":"Decide rápido, confia na própria intuição","value":"D"},{"text":"Consulta outras pessoas e compartilha ideias","value":"I"},{"text":"Prefere manter a harmonia e evitar conflitos","value":"S"},{"text":"Analisa dados e opções antes de agir","value":"C"}]'),

('7c533b3e-2ae8-4fd5-98b8-1d60b4f60559', 3, 'Quando trabalha em grupo, você tende a:', 
 '[{"text":"Tomar a liderança naturalmente","value":"D"},{"text":"Incentivar o grupo com entusiasmo","value":"I"},{"text":"Dar apoio aos colegas e evitar disputas","value":"S"},{"text":"Organizar processos e revisar detalhes","value":"C"}]'),

('7c533b3e-2ae8-4fd5-98b8-1d60b4f60559', 4, 'Em momentos de pressão, você costuma:', 
 '[{"text":"Focar no resultado e agir com firmeza","value":"D"},{"text":"Tentar manter o clima leve e otimista","value":"I"},{"text":"Manter a calma e seguir o plano","value":"S"},{"text":"Rever o processo para evitar erros","value":"C"}]'),

('7c533b3e-2ae8-4fd5-98b8-1d60b4f60559', 5, 'Sua principal motivação é:', 
 '[{"text":"Vencer desafios e conquistar metas","value":"D"},{"text":"Ser reconhecido e influenciar positivamente","value":"I"},{"text":"Ter estabilidade e boas relações","value":"S"},{"text":"Fazer as coisas com excelência e segurança","value":"C"}]'),

('7c533b3e-2ae8-4fd5-98b8-1d60b4f60559', 6, 'Como você reage a mudanças inesperadas?', 
 '[{"text":"Adapta-se e assume o controle","value":"D"},{"text":"Busca motivar o grupo e ver o lado positivo","value":"I"},{"text":"Prefere rotina e previsibilidade","value":"S"},{"text":"Quer entender todas as variáveis antes de agir","value":"C"}]'),

('7c533b3e-2ae8-4fd5-98b8-1d60b4f60559', 7, 'O que as pessoas mais valorizam em você?', 
 '[{"text":"Coragem e assertividade","value":"D"},{"text":"Entusiasmo e boa comunicação","value":"I"},{"text":"Calma e paciência","value":"S"},{"text":"Confiabilidade e precisão","value":"C"}]'),

('7c533b3e-2ae8-4fd5-98b8-1d60b4f60559', 8, 'Quando algo dá errado, sua reação natural é:', 
 '[{"text":"Resolver imediatamente","value":"D"},{"text":"Conversar para aliviar o clima","value":"I"},{"text":"Manter a serenidade e buscar soluções com calma","value":"S"},{"text":"Revisar o que poderia ter sido feito melhor","value":"C"}]'),

('7c533b3e-2ae8-4fd5-98b8-1d60b4f60559', 9, 'Ao lidar com pessoas novas, você:', 
 '[{"text":"Se impõe com confiança","value":"D"},{"text":"Se conecta rapidamente e cria empatia","value":"I"},{"text":"Observa antes de se abrir","value":"S"},{"text":"Mantém discrição até sentir confiança","value":"C"}]'),

('7c533b3e-2ae8-4fd5-98b8-1d60b4f60559', 10, 'Quando um projeto atrasa, você tende a:', 
 '[{"text":"Pressionar para resolver rápido","value":"D"},{"text":"Animar o grupo para manter o ritmo","value":"I"},{"text":"Oferecer ajuda para não sobrecarregar ninguém","value":"S"},{"text":"Revisar as causas com método","value":"C"}]'),

('7c533b3e-2ae8-4fd5-98b8-1d60b4f60559', 11, 'Como você costuma se comunicar?', 
 '[{"text":"Direto e objetivo","value":"D"},{"text":"Entusiasmado e persuasivo","value":"I"},{"text":"Gentil e cuidadoso","value":"S"},{"text":"Formal e estruturado","value":"C"}]'),

('7c533b3e-2ae8-4fd5-98b8-1d60b4f60559', 12, 'Em situações de conflito, você tende a:', 
 '[{"text":"Enfrentar sem medo","value":"D"},{"text":"Buscar conciliação com humor","value":"I"},{"text":"Evitar discussão e ceder se necessário","value":"S"},{"text":"Esperar esfriar antes de reagir","value":"C"}]'),

('7c533b3e-2ae8-4fd5-98b8-1d60b4f60559', 13, 'Quando precisa delegar algo, você:', 
 '[{"text":"Dá instruções rápidas e claras","value":"D"},{"text":"Incentiva e confia na criatividade da pessoa","value":"I"},{"text":"Explica com calma e oferece suporte","value":"S"},{"text":"Define regras e verifica o processo","value":"C"}]'),

('7c533b3e-2ae8-4fd5-98b8-1d60b4f60559', 14, 'O que mais te incomoda em um ambiente de trabalho?', 
 '[{"text":"Falta de ação","value":"D"},{"text":"Pessoas desmotivadas","value":"I"},{"text":"Conflitos e instabilidade","value":"S"},{"text":"Desorganização e erros","value":"C"}]'),

('7c533b3e-2ae8-4fd5-98b8-1d60b4f60559', 15, 'Quando algo precisa ser feito, você prefere:', 
 '[{"text":"Agir e ajustar no caminho","value":"D"},{"text":"Chamar os outros e fazer junto","value":"I"},{"text":"Planejar com antecedência","value":"S"},{"text":"Seguir o método exato","value":"C"}]'),

('7c533b3e-2ae8-4fd5-98b8-1d60b4f60559', 16, 'Como você reage a críticas?', 
 '[{"text":"Defende seu ponto e segue em frente","value":"D"},{"text":"Leva com leveza, mas prefere elogios","value":"I"},{"text":"Reflete e tenta entender o motivo","value":"S"},{"text":"Analisa friamente para corrigir o erro","value":"C"}]'),

('7c533b3e-2ae8-4fd5-98b8-1d60b4f60559', 17, 'Em projetos longos, você:', 
 '[{"text":"Quer ver progresso constante","value":"D"},{"text":"Gosta de celebrar pequenas conquistas","value":"I"},{"text":"Mantém o ritmo de forma estável","value":"S"},{"text":"Segue o planejamento fielmente","value":"C"}]'),

('7c533b3e-2ae8-4fd5-98b8-1d60b4f60559', 18, 'Quando há incerteza, você prefere:', 
 '[{"text":"Tomar decisão rapidamente","value":"D"},{"text":"Ouvir opiniões e motivar o grupo","value":"I"},{"text":"Esperar até que tudo esteja mais claro","value":"S"},{"text":"Pesquisar e buscar dados concretos","value":"C"}]'),

('7c533b3e-2ae8-4fd5-98b8-1d60b4f60559', 19, 'Seu estilo de liderança é mais:', 
 '[{"text":"Forte e direto","value":"D"},{"text":"Inspirador e positivo","value":"I"},{"text":"Calmo e protetor","value":"S"},{"text":"Planejado e detalhado","value":"C"}]'),

('7c533b3e-2ae8-4fd5-98b8-1d60b4f60559', 20, 'Em novas situações sociais, você:', 
 '[{"text":"Se apresenta com segurança","value":"D"},{"text":"Cria conexões e conversa com facilidade","value":"I"},{"text":"Observa e se adapta aos poucos","value":"S"},{"text":"Age com cautela e discrição","value":"C"}]'),

('7c533b3e-2ae8-4fd5-98b8-1d60b4f60559', 21, 'O que te motiva no dia a dia?', 
 '[{"text":"Conquistar resultados","value":"D"},{"text":"Ser reconhecido e se conectar","value":"I"},{"text":"Ter estabilidade e bons relacionamentos","value":"S"},{"text":"Fazer as coisas com excelência","value":"C"}]'),

('7c533b3e-2ae8-4fd5-98b8-1d60b4f60559', 22, 'Quando alguém não cumpre o combinado:', 
 '[{"text":"Confronta diretamente","value":"D"},{"text":"Tenta entender o motivo e conversar","value":"I"},{"text":"Evita brigas e prefere contornar","value":"S"},{"text":"Fica frustrado e revisa o processo","value":"C"}]'),

('7c533b3e-2ae8-4fd5-98b8-1d60b4f60559', 23, 'Como você enxerga autoridade?', 
 '[{"text":"Como algo que se conquista pela ação","value":"D"},{"text":"Como carisma e conexão","value":"I"},{"text":"Como respeito mútuo e equilíbrio","value":"S"},{"text":"Como competência e conhecimento","value":"C"}]'),

('7c533b3e-2ae8-4fd5-98b8-1d60b4f60559', 24, 'Em momentos de crise, você tende a:', 
 '[{"text":"Tomar decisões rápidas","value":"D"},{"text":"Motivar o grupo a não desistir","value":"I"},{"text":"Manter a serenidade e apoiar os outros","value":"S"},{"text":"Analisar o cenário antes de agir","value":"C"}]'),

('7c533b3e-2ae8-4fd5-98b8-1d60b4f60559', 25, 'Qual palavra melhor define sua forma de agir?', 
 '[{"text":"Determinação","value":"D"},{"text":"Entusiasmo","value":"I"},{"text":"Paciência","value":"S"},{"text":"Precisão","value":"C"}]'),

('7c533b3e-2ae8-4fd5-98b8-1d60b4f60559', 26, 'Quando há divergências em equipe, você:', 
 '[{"text":"Toma o controle e decide","value":"D"},{"text":"Age como mediador leve e empático","value":"I"},{"text":"Evita discussões e busca consenso","value":"S"},{"text":"Tenta resolver de forma racional","value":"C"}]'),

('7c533b3e-2ae8-4fd5-98b8-1d60b4f60559', 27, 'Você se considera uma pessoa:', 
 '[{"text":"Prática e objetiva","value":"D"},{"text":"Comunicativa e inspiradora","value":"I"},{"text":"Confiável e calma","value":"S"},{"text":"Organizada e criteriosa","value":"C"}]'),

('7c533b3e-2ae8-4fd5-98b8-1d60b4f60559', 28, 'Quando está prestes a começar algo novo:', 
 '[{"text":"Quer ver resultados logo","value":"D"},{"text":"Sente empolgação e quer envolver outros","value":"I"},{"text":"Prefere estabilidade e planejamento","value":"S"},{"text":"Busca entender tudo antes de agir","value":"C"}]');