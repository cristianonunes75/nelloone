-- Update MBTI test names and descriptions for all languages

-- Update PT-BR version
UPDATE public.tests 
SET 
  name = 'Nello 16 Personality Map',
  description = 'Descubra seu perfil psicológico em 4 letras e entenda como seu comportamento molda suas relações, decisões e resultados.'
WHERE type = 'mbti' AND language = 'pt';

-- Update EN version
UPDATE public.tests 
SET 
  name = 'Nello 16 Personality Map',
  description = 'Discover your 4-letter psychological type and understand how it shapes your relationships, decisions and results.'
WHERE type = 'mbti' AND language = 'en';

-- Update PT-PT version (if exists)
UPDATE public.tests 
SET 
  name = 'Mapa das 16 Personalidades Nello',
  description = 'Descubra o seu perfil psicológico em 4 letras e compreenda como o seu comportamento influencia relações, decisões e resultados.'
WHERE type = 'mbti' AND language = 'pt-pt';

-- Insert PT-PT version if it doesn't exist
INSERT INTO public.tests (type, name, description, questions_count, estimated_minutes, active, is_free, price_brl, language)
SELECT 
  'mbti',
  'Mapa das 16 Personalidades Nello',
  'Descubra o seu perfil psicológico em 4 letras e compreenda como o seu comportamento influencia relações, decisões e resultados.',
  24,
  15,
  true,
  false,
  197.00,
  'pt-pt'
WHERE NOT EXISTS (
  SELECT 1 FROM public.tests WHERE type = 'mbti' AND language = 'pt-pt'
);