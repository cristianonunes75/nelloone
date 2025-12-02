-- Atualizar os testes existentes de "Linguagens do Amor" para "Estilos de Conexão Afetiva"
-- Mantendo o mesmo type para compatibilidade

-- 1. Atualizar PT-BR
UPDATE tests 
SET 
  name = 'Mapa dos Estilos de Conexão Afetiva',
  description = 'Descubra como você se conecta emocionalmente com os outros. Este teste revela seu estilo primário de conexão afetiva e como cultivar relacionamentos mais profundos.'
WHERE type::text = 'linguagens_amor' AND language = 'pt';

-- 2. Atualizar EN
UPDATE tests 
SET 
  name = 'Affection Connection Styles',
  description = 'Discover how you emotionally connect with others. This test reveals your primary affection connection style and how to cultivate deeper relationships.'
WHERE type::text = 'linguagens_amor' AND language = 'en';

-- 3. Criar registro para PT-PT se não existir
INSERT INTO tests (name, description, type, questions_count, estimated_minutes, icon, is_free, price_brl, active, language)
SELECT 
  'Mapa dos Estilos de Conexão Afetiva',
  'Descobre como te conectas emocionalmente com os outros. Este teste revela o teu estilo primário de conexão afetiva e como cultivar relacionamentos mais profundos.',
  'linguagens_amor',
  30,
  10,
  'Heart',
  false,
  127.00,
  true,
  'pt-pt'
WHERE NOT EXISTS (
  SELECT 1 FROM tests WHERE type::text = 'linguagens_amor' AND language = 'pt-pt'
);