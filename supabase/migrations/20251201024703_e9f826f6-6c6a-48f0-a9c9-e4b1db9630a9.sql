-- Step 1: Drop the old unique constraint on type column
ALTER TABLE public.tests DROP CONSTRAINT IF EXISTS tests_type_key;

-- Step 2: Create new unique constraint on type + language combination
ALTER TABLE public.tests ADD CONSTRAINT tests_type_language_unique UNIQUE (type, language);

-- Step 3: Insert English versions of all 7 active tests
INSERT INTO public.tests (type, name, description, questions_count, estimated_minutes, is_free, price_brl, active, language, icon, stripe_price_id)
SELECT 
  type,
  CASE type
    WHEN 'arquetipos_proposito' THEN 'Archetypes Test'
    WHEN 'disc' THEN 'DISC Assessment'
    WHEN 'temperamentos' THEN 'Temperaments'
    WHEN 'linguagens_amor' THEN 'Love Languages'
    WHEN 'inteligencias_multiplas' THEN 'Multiple Intelligences'
    WHEN 'eneagrama' THEN 'Enneagram'
    WHEN 'mbti' THEN 'MBTI'
    ELSE name
  END as name,
  CASE type
    WHEN 'arquetipos_proposito' THEN 'Discover which archetypal energy guides your presence in the world through 36 intuitive questions that reveal your dominant archetypes.'
    WHEN 'disc' THEN 'This test identifies your natural behavioral profile. The DISC methodology reveals how you react, decide, communicate and contribute in different contexts of life and work.'
    WHEN 'temperamentos' THEN 'Discover your essential nature based on the traditional temperament model. Understand how your natural disposition influences your decisions and relationships.'
    WHEN 'linguagens_amor' THEN 'How do you express and receive love? Discover your primary love language and learn to communicate affection more effectively in your relationships.'
    WHEN 'inteligencias_multiplas' THEN 'Each person has a unique combination of talents and ways of thinking. This test shows which areas of your mind have more energy and how to use them in work, vocation and life.'
    WHEN 'eneagrama' THEN 'The Enneagram reveals nine essential ways of seeing the world. Each type expresses a gift and a challenge. Discovering yours means understanding the path of inner transformation.'
    WHEN 'mbti' THEN 'Discover how you perceive the world, make decisions and relate to life. This test identifies your psychological type according to Carl Jung''s type theory.'
    ELSE description
  END as description,
  questions_count,
  estimated_minutes,
  is_free,
  price_brl,
  active,
  'en' as language,
  icon,
  stripe_price_id
FROM public.tests 
WHERE language = 'pt' AND active = true;