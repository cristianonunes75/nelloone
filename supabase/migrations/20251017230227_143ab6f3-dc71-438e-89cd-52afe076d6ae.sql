-- Update test price and description
UPDATE tests 
SET 
  price_brl = 29.00,
  description = 'Descubra os arquétipos que definem sua essência com base em 36 perguntas. Versão gratuita libera prévia com 12 perguntas. O plano completo revela seus 3 arquétipos dominantes com relatório personalizado.'
WHERE id = 'e1a3511e-4e79-47a1-bbf8-5f7eba91be9c';

-- Delete existing questions
DELETE FROM test_questions WHERE test_id = 'e1a3511e-4e79-47a1-bbf8-5f7eba91be9c';

-- Insert new scale-based questions with proper UUIDs
INSERT INTO test_questions (test_id, question_number, question_text, options) VALUES
-- Inocente (3)
('e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 1, 'Sinto que o mundo é um lugar bom e desejo que todos sejam felizes.', 
  '[{"value": "0", "label": "Discordo totalmente", "archetype": "Inocente"}, {"value": "1", "label": "Discordo", "archetype": "Inocente"}, {"value": "2", "label": "Neutro", "archetype": "Inocente"}, {"value": "3", "label": "Concordo", "archetype": "Inocente"}, {"value": "4", "label": "Concordo totalmente", "archetype": "Inocente"}]'),
('e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 2, 'Acredito que confiar nas pessoas torna a vida mais leve.', 
  '[{"value": "0", "label": "Discordo totalmente", "archetype": "Inocente"}, {"value": "1", "label": "Discordo", "archetype": "Inocente"}, {"value": "2", "label": "Neutro", "archetype": "Inocente"}, {"value": "3", "label": "Concordo", "archetype": "Inocente"}, {"value": "4", "label": "Concordo totalmente", "archetype": "Inocente"}]'),
('e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 3, 'Prefiro manter a paz do que entrar em conflitos.', 
  '[{"value": "0", "label": "Discordo totalmente", "archetype": "Inocente"}, {"value": "1", "label": "Discordo", "archetype": "Inocente"}, {"value": "2", "label": "Neutro", "archetype": "Inocente"}, {"value": "3", "label": "Concordo", "archetype": "Inocente"}, {"value": "4", "label": "Concordo totalmente", "archetype": "Inocente"}]'),
-- Explorador (3)
('e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 4, 'Sinto necessidade de sair da rotina e explorar coisas novas.', 
  '[{"value": "0", "label": "Discordo totalmente", "archetype": "Explorador"}, {"value": "1", "label": "Discordo", "archetype": "Explorador"}, {"value": "2", "label": "Neutro", "archetype": "Explorador"}, {"value": "3", "label": "Concordo", "archetype": "Explorador"}, {"value": "4", "label": "Concordo totalmente", "archetype": "Explorador"}]'),
('e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 5, 'Gosto de viajar, conhecer lugares e experimentar a liberdade.', 
  '[{"value": "0", "label": "Discordo totalmente", "archetype": "Explorador"}, {"value": "1", "label": "Discordo", "archetype": "Explorador"}, {"value": "2", "label": "Neutro", "archetype": "Explorador"}, {"value": "3", "label": "Concordo", "archetype": "Explorador"}, {"value": "4", "label": "Concordo totalmente", "archetype": "Explorador"}]'),
('e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 6, 'Busco sempre ser fiel a mim mesmo, mesmo que isso me isole.', 
  '[{"value": "0", "label": "Discordo totalmente", "archetype": "Explorador"}, {"value": "1", "label": "Discordo", "archetype": "Explorador"}, {"value": "2", "label": "Neutro", "archetype": "Explorador"}, {"value": "3", "label": "Concordo", "archetype": "Explorador"}, {"value": "4", "label": "Concordo totalmente", "archetype": "Explorador"}]'),
-- Sábio (3)
('e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 7, 'Sou movido pela busca do conhecimento e da verdade.', 
  '[{"value": "0", "label": "Discordo totalmente", "archetype": "Sábio"}, {"value": "1", "label": "Discordo", "archetype": "Sábio"}, {"value": "2", "label": "Neutro", "archetype": "Sábio"}, {"value": "3", "label": "Concordo", "archetype": "Sábio"}, {"value": "4", "label": "Concordo totalmente", "archetype": "Sábio"}]'),
('e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 8, 'Prefiro entender antes de julgar.', 
  '[{"value": "0", "label": "Discordo totalmente", "archetype": "Sábio"}, {"value": "1", "label": "Discordo", "archetype": "Sábio"}, {"value": "2", "label": "Neutro", "archetype": "Sábio"}, {"value": "3", "label": "Concordo", "archetype": "Sábio"}, {"value": "4", "label": "Concordo totalmente", "archetype": "Sábio"}]'),
('e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 9, 'Valorizar ideias e estudos é algo essencial para mim.', 
  '[{"value": "0", "label": "Discordo totalmente", "archetype": "Sábio"}, {"value": "1", "label": "Discordo", "archetype": "Sábio"}, {"value": "2", "label": "Neutro", "archetype": "Sábio"}, {"value": "3", "label": "Concordo", "archetype": "Sábio"}, {"value": "4", "label": "Concordo totalmente", "archetype": "Sábio"}]'),
-- Herói (3)
('e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 10, 'Enfrento desafios com coragem e gosto de proteger quem amo.', 
  '[{"value": "0", "label": "Discordo totalmente", "archetype": "Herói"}, {"value": "1", "label": "Discordo", "archetype": "Herói"}, {"value": "2", "label": "Neutro", "archetype": "Herói"}, {"value": "3", "label": "Concordo", "archetype": "Herói"}, {"value": "4", "label": "Concordo totalmente", "archetype": "Herói"}]'),
('e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 11, 'Gosto de me superar e buscar a excelência.', 
  '[{"value": "0", "label": "Discordo totalmente", "archetype": "Herói"}, {"value": "1", "label": "Discordo", "archetype": "Herói"}, {"value": "2", "label": "Neutro", "archetype": "Herói"}, {"value": "3", "label": "Concordo", "archetype": "Herói"}, {"value": "4", "label": "Concordo totalmente", "archetype": "Herói"}]'),
('e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 12, 'Acredito que minha força pode inspirar os outros.', 
  '[{"value": "0", "label": "Discordo totalmente", "archetype": "Herói"}, {"value": "1", "label": "Discordo", "archetype": "Herói"}, {"value": "2", "label": "Neutro", "archetype": "Herói"}, {"value": "3", "label": "Concordo", "archetype": "Herói"}, {"value": "4", "label": "Concordo totalmente", "archetype": "Herói"}]'),
-- Rebelde (3)
('e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 13, 'Questiono regras e desafio padrões desde cedo.', 
  '[{"value": "0", "label": "Discordo totalmente", "archetype": "Rebelde"}, {"value": "1", "label": "Discordo", "archetype": "Rebelde"}, {"value": "2", "label": "Neutro", "archetype": "Rebelde"}, {"value": "3", "label": "Concordo", "archetype": "Rebelde"}, {"value": "4", "label": "Concordo totalmente", "archetype": "Rebelde"}]'),
('e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 14, 'Sinto prazer em romper com sistemas injustos.', 
  '[{"value": "0", "label": "Discordo totalmente", "archetype": "Rebelde"}, {"value": "1", "label": "Discordo", "archetype": "Rebelde"}, {"value": "2", "label": "Neutro", "archetype": "Rebelde"}, {"value": "3", "label": "Concordo", "archetype": "Rebelde"}, {"value": "4", "label": "Concordo totalmente", "archetype": "Rebelde"}]'),
('e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 15, 'Me recuso a me encaixar onde não me sinto verdadeiro.', 
  '[{"value": "0", "label": "Discordo totalmente", "archetype": "Rebelde"}, {"value": "1", "label": "Discordo", "archetype": "Rebelde"}, {"value": "2", "label": "Neutro", "archetype": "Rebelde"}, {"value": "3", "label": "Concordo", "archetype": "Rebelde"}, {"value": "4", "label": "Concordo totalmente", "archetype": "Rebelde"}]'),
-- Mago (3)
('e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 16, 'Acredito em transformações profundas e misteriosas.', 
  '[{"value": "0", "label": "Discordo totalmente", "archetype": "Mago"}, {"value": "1", "label": "Discordo", "archetype": "Mago"}, {"value": "2", "label": "Neutro", "archetype": "Mago"}, {"value": "3", "label": "Concordo", "archetype": "Mago"}, {"value": "4", "label": "Concordo totalmente", "archetype": "Mago"}]'),
('e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 17, 'Sinto que tenho uma missão espiritual ou de cura.', 
  '[{"value": "0", "label": "Discordo totalmente", "archetype": "Mago"}, {"value": "1", "label": "Discordo", "archetype": "Mago"}, {"value": "2", "label": "Neutro", "archetype": "Mago"}, {"value": "3", "label": "Concordo", "archetype": "Mago"}, {"value": "4", "label": "Concordo totalmente", "archetype": "Mago"}]'),
('e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 18, 'Tenho uma força intuitiva que me guia em escolhas.', 
  '[{"value": "0", "label": "Discordo totalmente", "archetype": "Mago"}, {"value": "1", "label": "Discordo", "archetype": "Mago"}, {"value": "2", "label": "Neutro", "archetype": "Mago"}, {"value": "3", "label": "Concordo", "archetype": "Mago"}, {"value": "4", "label": "Concordo totalmente", "archetype": "Mago"}]'),
-- Homem Comum (3)
('e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 19, 'Valorizo a simplicidade e me identifico com pessoas comuns.', 
  '[{"value": "0", "label": "Discordo totalmente", "archetype": "Homem Comum"}, {"value": "1", "label": "Discordo", "archetype": "Homem Comum"}, {"value": "2", "label": "Neutro", "archetype": "Homem Comum"}, {"value": "3", "label": "Concordo", "archetype": "Homem Comum"}, {"value": "4", "label": "Concordo totalmente", "archetype": "Homem Comum"}]'),
('e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 20, 'Evito me destacar, prefiro o coletivo ao individualismo.', 
  '[{"value": "0", "label": "Discordo totalmente", "archetype": "Homem Comum"}, {"value": "1", "label": "Discordo", "archetype": "Homem Comum"}, {"value": "2", "label": "Neutro", "archetype": "Homem Comum"}, {"value": "3", "label": "Concordo", "archetype": "Homem Comum"}, {"value": "4", "label": "Concordo totalmente", "archetype": "Homem Comum"}]'),
('e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 21, 'Gosto de fazer parte de grupos onde me sinto pertencente.', 
  '[{"value": "0", "label": "Discordo totalmente", "archetype": "Homem Comum"}, {"value": "1", "label": "Discordo", "archetype": "Homem Comum"}, {"value": "2", "label": "Neutro", "archetype": "Homem Comum"}, {"value": "3", "label": "Concordo", "archetype": "Homem Comum"}, {"value": "4", "label": "Concordo totalmente", "archetype": "Homem Comum"}]'),
-- Amante (3)
('e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 22, 'Demonstro afeto com facilidade e me entrego ao amor.', 
  '[{"value": "0", "label": "Discordo totalmente", "archetype": "Amante"}, {"value": "1", "label": "Discordo", "archetype": "Amante"}, {"value": "2", "label": "Neutro", "archetype": "Amante"}, {"value": "3", "label": "Concordo", "archetype": "Amante"}, {"value": "4", "label": "Concordo totalmente", "archetype": "Amante"}]'),
('e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 23, 'Beleza, sensualidade e conexão emocional são importantes para mim.', 
  '[{"value": "0", "label": "Discordo totalmente", "archetype": "Amante"}, {"value": "1", "label": "Discordo", "archetype": "Amante"}, {"value": "2", "label": "Neutro", "archetype": "Amante"}, {"value": "3", "label": "Concordo", "archetype": "Amante"}, {"value": "4", "label": "Concordo totalmente", "archetype": "Amante"}]'),
('e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 24, 'Busco relações profundas, intensas e verdadeiras.', 
  '[{"value": "0", "label": "Discordo totalmente", "archetype": "Amante"}, {"value": "1", "label": "Discordo", "archetype": "Amante"}, {"value": "2", "label": "Neutro", "archetype": "Amante"}, {"value": "3", "label": "Concordo", "archetype": "Amante"}, {"value": "4", "label": "Concordo totalmente", "archetype": "Amante"}]'),
-- Bobo da Corte (3)
('e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 25, 'Uso o humor como forma de leveza e aproximação.', 
  '[{"value": "0", "label": "Discordo totalmente", "archetype": "Bobo da Corte"}, {"value": "1", "label": "Discordo", "archetype": "Bobo da Corte"}, {"value": "2", "label": "Neutro", "archetype": "Bobo da Corte"}, {"value": "3", "label": "Concordo", "archetype": "Bobo da Corte"}, {"value": "4", "label": "Concordo totalmente", "archetype": "Bobo da Corte"}]'),
('e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 26, 'Faço as pessoas rirem mesmo nos momentos difíceis.', 
  '[{"value": "0", "label": "Discordo totalmente", "archetype": "Bobo da Corte"}, {"value": "1", "label": "Discordo", "archetype": "Bobo da Corte"}, {"value": "2", "label": "Neutro", "archetype": "Bobo da Corte"}, {"value": "3", "label": "Concordo", "archetype": "Bobo da Corte"}, {"value": "4", "label": "Concordo totalmente", "archetype": "Bobo da Corte"}]'),
('e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 27, 'Gosto de quebrar o gelo e provocar sorrisos.', 
  '[{"value": "0", "label": "Discordo totalmente", "archetype": "Bobo da Corte"}, {"value": "1", "label": "Discordo", "archetype": "Bobo da Corte"}, {"value": "2", "label": "Neutro", "archetype": "Bobo da Corte"}, {"value": "3", "label": "Concordo", "archetype": "Bobo da Corte"}, {"value": "4", "label": "Concordo totalmente", "archetype": "Bobo da Corte"}]'),
-- Prestativo (3)
('e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 28, 'Me realizo cuidando dos outros.', 
  '[{"value": "0", "label": "Discordo totalmente", "archetype": "Prestativo"}, {"value": "1", "label": "Discordo", "archetype": "Prestativo"}, {"value": "2", "label": "Neutro", "archetype": "Prestativo"}, {"value": "3", "label": "Concordo", "archetype": "Prestativo"}, {"value": "4", "label": "Concordo totalmente", "archetype": "Prestativo"}]'),
('e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 29, 'Sinto empatia natural por quem está sofrendo.', 
  '[{"value": "0", "label": "Discordo totalmente", "archetype": "Prestativo"}, {"value": "1", "label": "Discordo", "archetype": "Prestativo"}, {"value": "2", "label": "Neutro", "archetype": "Prestativo"}, {"value": "3", "label": "Concordo", "archetype": "Prestativo"}, {"value": "4", "label": "Concordo totalmente", "archetype": "Prestativo"}]'),
('e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 30, 'Tenho vocação para servir e ajudar.', 
  '[{"value": "0", "label": "Discordo totalmente", "archetype": "Prestativo"}, {"value": "1", "label": "Discordo", "archetype": "Prestativo"}, {"value": "2", "label": "Neutro", "archetype": "Prestativo"}, {"value": "3", "label": "Concordo", "archetype": "Prestativo"}, {"value": "4", "label": "Concordo totalmente", "archetype": "Prestativo"}]'),
-- Criador (3)
('e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 31, 'Tenho uma mente criativa que precisa se expressar.', 
  '[{"value": "0", "label": "Discordo totalmente", "archetype": "Criador"}, {"value": "1", "label": "Discordo", "archetype": "Criador"}, {"value": "2", "label": "Neutro", "archetype": "Criador"}, {"value": "3", "label": "Concordo", "archetype": "Criador"}, {"value": "4", "label": "Concordo totalmente", "archetype": "Criador"}]'),
('e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 32, 'Gosto de fazer coisas com as mãos, criar, inventar.', 
  '[{"value": "0", "label": "Discordo totalmente", "archetype": "Criador"}, {"value": "1", "label": "Discordo", "archetype": "Criador"}, {"value": "2", "label": "Neutro", "archetype": "Criador"}, {"value": "3", "label": "Concordo", "archetype": "Criador"}, {"value": "4", "label": "Concordo totalmente", "archetype": "Criador"}]'),
('e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 33, 'Tenho ideias originais e vejo beleza onde outros não veem.', 
  '[{"value": "0", "label": "Discordo totalmente", "archetype": "Criador"}, {"value": "1", "label": "Discordo", "archetype": "Criador"}, {"value": "2", "label": "Neutro", "archetype": "Criador"}, {"value": "3", "label": "Concordo", "archetype": "Criador"}, {"value": "4", "label": "Concordo totalmente", "archetype": "Criador"}]'),
-- Governante (3)
('e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 34, 'Gosto de ter o controle e liderar com responsabilidade.', 
  '[{"value": "0", "label": "Discordo totalmente", "archetype": "Governante"}, {"value": "1", "label": "Discordo", "archetype": "Governante"}, {"value": "2", "label": "Neutro", "archetype": "Governante"}, {"value": "3", "label": "Concordo", "archetype": "Governante"}, {"value": "4", "label": "Concordo totalmente", "archetype": "Governante"}]'),
('e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 35, 'Me sinto chamado a organizar, estruturar e influenciar.', 
  '[{"value": "0", "label": "Discordo totalmente", "archetype": "Governante"}, {"value": "1", "label": "Discordo", "archetype": "Governante"}, {"value": "2", "label": "Neutro", "archetype": "Governante"}, {"value": "3", "label": "Concordo", "archetype": "Governante"}, {"value": "4", "label": "Concordo totalmente", "archetype": "Governante"}]'),
('e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 36, 'Busco estabilidade, poder e justiça em tudo o que faço.', 
  '[{"value": "0", "label": "Discordo totalmente", "archetype": "Governante"}, {"value": "1", "label": "Discordo", "archetype": "Governante"}, {"value": "2", "label": "Neutro", "archetype": "Governante"}, {"value": "3", "label": "Concordo", "archetype": "Governante"}, {"value": "4", "label": "Concordo totalmente", "archetype": "Governante"}]');