-- Update test_questions to use the new 3-option format
UPDATE test_questions
SET options = jsonb_build_array(
  jsonb_build_object(
    'value', 3,
    'text', 'Sim, isso parece muito comigo.',
    'archetype', (options->0->>'archetype')
  ),
  jsonb_build_object(
    'value', 2,
    'text', 'Às vezes, depende do momento.',
    'archetype', (options->0->>'archetype')
  ),
  jsonb_build_object(
    'value', 1,
    'text', 'Não muito, não me identifico.',
    'archetype', (options->0->>'archetype')
  )
)
WHERE test_id = 'e1a3511e-4e79-47a1-bbf8-5f7eba91be9c';