-- Remove duplicate hiring_assessments keeping only the one with most answers
-- First, identify and delete empty duplicates

-- Delete duplicate hiring_answers that point to assessments we'll remove
DELETE FROM hiring_answers
WHERE assessment_id IN (
  SELECT ha.id 
  FROM hiring_assessments ha
  WHERE ha.id NOT IN (
    -- Keep the assessment with most answers for each (candidate_id, test_type)
    SELECT DISTINCT ON (candidate_id, test_type) ha2.id
    FROM hiring_assessments ha2
    LEFT JOIN (
      SELECT assessment_id, COUNT(*) as answer_count
      FROM hiring_answers
      GROUP BY assessment_id
    ) ans ON ans.assessment_id = ha2.id
    ORDER BY ha2.candidate_id, ha2.test_type, COALESCE(ans.answer_count, 0) DESC, ha2.created_at ASC
  )
);

-- Now delete the duplicate assessments themselves
DELETE FROM hiring_assessments 
WHERE id NOT IN (
  SELECT DISTINCT ON (candidate_id, test_type) ha.id
  FROM hiring_assessments ha
  LEFT JOIN (
    SELECT assessment_id, COUNT(*) as answer_count
    FROM hiring_answers
    GROUP BY assessment_id
  ) ans ON ans.assessment_id = ha.id
  ORDER BY ha.candidate_id, ha.test_type, COALESCE(ans.answer_count, 0) DESC, ha.created_at ASC
);

-- Add unique constraint to prevent future duplicates
ALTER TABLE hiring_assessments 
DROP CONSTRAINT IF EXISTS hiring_assessments_candidate_test_unique;

ALTER TABLE hiring_assessments 
ADD CONSTRAINT hiring_assessments_candidate_test_unique 
UNIQUE (candidate_id, test_type);