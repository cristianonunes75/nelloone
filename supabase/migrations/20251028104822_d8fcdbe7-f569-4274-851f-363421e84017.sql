-- Marcar o teste de Arquétipos como teste gratuito (com modelo freemium)
-- Apenas este teste terá preview de 5 perguntas grátis
UPDATE tests 
SET is_free = true 
WHERE type = 'arquetipos_proposito';

-- Garantir que todos os outros testes sejam pagos
UPDATE tests 
SET is_free = false 
WHERE type != 'arquetipos_proposito';