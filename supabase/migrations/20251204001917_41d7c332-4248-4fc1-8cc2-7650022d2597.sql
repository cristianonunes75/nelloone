-- Ativar todas as versões EN dos testes
UPDATE tests 
SET active = true 
WHERE language = 'en' AND active = false;