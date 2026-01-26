-- Drop the existing policy and recreate with ativacao_codigo_unlocked check
DROP POLICY IF EXISTS "Users can view purchased or free test questions" ON public.test_questions;

CREATE POLICY "Users can view purchased or free test questions"
ON public.test_questions
FOR SELECT
USING (
  -- Admins can see all
  has_role(auth.uid(), 'admin'::app_role)
  OR
  -- Users can see questions if test conditions are met
  EXISTS (
    SELECT 1 FROM tests t
    WHERE t.id = test_questions.test_id
    AND t.active = true
    AND (
      -- Free tests for authenticated users
      (t.is_free = true AND auth.uid() IS NOT NULL)
      OR
      -- Individual test purchase
      EXISTS (
        SELECT 1 FROM test_purchases tp
        WHERE tp.user_id = auth.uid()
        AND tp.test_id = t.id
        AND tp.payment_status IN ('succeeded', 'completed')
      )
      OR
      -- Journey/combo/bundle purchase
      EXISTS (
        SELECT 1 FROM test_purchases tp
        WHERE tp.user_id = auth.uid()
        AND tp.purchase_category IN ('journey', 'combo', 'nello_one', 'jornada_completa')
        AND tp.payment_status IN ('succeeded', 'completed')
      )
      OR
      -- User unlocked via ativacao_codigo
      EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = auth.uid()
        AND p.ativacao_codigo_unlocked = true
      )
      OR
      -- User completed 5+ tests in journey
      EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = auth.uid()
        AND p.journey_completed_tests >= 5
      )
    )
  )
  OR
  -- Hiring assessment access (DISC and Temperamentos only)
  EXISTS (
    SELECT 1 
    FROM hiring_assessments ha
    JOIN tests t ON (
      (ha.test_type = 'disc' AND t.type = 'disc'::test_type)
      OR (ha.test_type = 'temperamentos' AND t.type = 'temperamentos'::test_type)
    )
    WHERE t.id = test_questions.test_id
    AND ha.status IN ('pending', 'in_progress')
  )
);