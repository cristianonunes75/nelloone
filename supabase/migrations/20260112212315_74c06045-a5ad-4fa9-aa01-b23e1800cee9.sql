-- Resetar avaliações do Paulo para pending (permitir refazer os testes)
UPDATE hiring_assessments 
SET 
  status = 'pending',
  result_data = NULL,
  started_at = NULL,
  completed_at = NULL
WHERE candidate_id = '0c61a2cd-aa11-419f-9474-0dd963788963';

-- Limpar as respostas antigas (que não foram salvas corretamente)
DELETE FROM hiring_answers 
WHERE assessment_id IN (
  SELECT id FROM hiring_assessments 
  WHERE candidate_id = '0c61a2cd-aa11-419f-9474-0dd963788963'
);