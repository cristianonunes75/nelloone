
-- Drop unique constraint to allow multiple versions of same test type
ALTER TABLE tests DROP CONSTRAINT IF EXISTS tests_type_language_unique;

-- Deactivate V1
UPDATE tests SET active = false WHERE id = '1a441c16-0ba3-47ce-8d54-32b7f40d8cb9';

-- Create V2
INSERT INTO tests (id, name, type, description, active, test_version, questions_count, estimated_minutes, icon, is_free, language, price_brl)
VALUES (
  'b2e7f3a1-9c4d-4e8b-a1f6-3d5e7c9b2a4f',
  'Eneagrama Identity V2',
  'eneagrama',
  'O Eneagrama revela as nove formas essenciais de ver o mundo. Cada tipo expressa um dom e um desafio. Descobrir o seu é compreender o caminho da transformação interior.',
  true,
  'v2',
  72,
  12,
  'Compass',
  false,
  'pt',
  177.00
);
