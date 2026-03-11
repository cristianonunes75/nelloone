-- Fix: Assign specific UUIDs to tests that were created manually in the original project.
-- Later migrations reference these tests by hardcoded UUID in test_questions INSERTs.
-- Must run after 20251017185350 (is_free/price_brl columns) and before 20251017223345 (first FK reference).
-- We delete test_questions first (no ON UPDATE CASCADE) - they will be re-inserted by later migrations.

-- Fix arquetipos_proposito UUID
DELETE FROM public.test_questions
WHERE test_id IN (
  SELECT id FROM public.tests WHERE type = 'arquetipos_proposito'
);

UPDATE public.tests
SET id = 'e1a3511e-4e79-47a1-bbf8-5f7eba91be9c'
WHERE type = 'arquetipos_proposito'
  AND id != 'e1a3511e-4e79-47a1-bbf8-5f7eba91be9c';

INSERT INTO public.tests (id, type, name, description, questions_count, estimated_minutes, is_free, price_brl, active, icon)
VALUES (
  'e1a3511e-4e79-47a1-bbf8-5f7eba91be9c',
  'arquetipos_proposito',
  'Arquétipos com Propósito',
  'Descubra seu arquétipo dominante e como sua essência influencia decisões, comunicação e estilo de vida.',
  12, 10, true, 0, true, 'Sparkles'
)
ON CONFLICT (id) DO NOTHING;

-- Fix disc UUID
DELETE FROM public.test_questions
WHERE test_id IN (
  SELECT id FROM public.tests WHERE type = 'disc'
);

UPDATE public.tests
SET id = '7c533b3e-2ae8-4fd5-98b8-1d60b4f60559'
WHERE type = 'disc'
  AND id != '7c533b3e-2ae8-4fd5-98b8-1d60b4f60559';

INSERT INTO public.tests (id, type, name, description, questions_count, estimated_minutes, is_free, price_brl, active, icon)
VALUES (
  '7c533b3e-2ae8-4fd5-98b8-1d60b4f60559',
  'disc',
  'DISC',
  'Perfil comportamental e estilo de comunicação',
  24, 10, true, 0, true, 'Target'
)
ON CONFLICT (id) DO NOTHING;
