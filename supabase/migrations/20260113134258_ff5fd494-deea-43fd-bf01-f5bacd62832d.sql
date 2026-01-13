-- Drop the old policy
DROP POLICY IF EXISTS "Users can view purchased or free test questions" ON public.test_questions;

-- Create updated policy that accepts both 'succeeded' and 'completed' payment statuses
CREATE POLICY "Users can view purchased or free test questions"
ON public.test_questions
FOR SELECT
USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR (
    EXISTS (
      SELECT 1 FROM tests t
      WHERE t.id = test_questions.test_id
        AND t.active = true
        AND (
          -- Free tests for authenticated users
          (t.is_free = true AND auth.uid() IS NOT NULL)
          -- User purchased this specific test
          OR EXISTS (
            SELECT 1 FROM test_purchases tp
            WHERE tp.user_id = auth.uid()
              AND tp.test_id = t.id
              AND tp.payment_status IN ('succeeded', 'completed')
          )
          -- User has journey/combo/nello_one bundle
          OR EXISTS (
            SELECT 1 FROM test_purchases tp
            WHERE tp.user_id = auth.uid()
              AND tp.purchase_category IN ('journey', 'combo', 'nello_one', 'jornada_completa')
              AND tp.payment_status IN ('succeeded', 'completed')
          )
        )
    )
  )
  -- Hiring assessment candidates
  OR EXISTS (
    SELECT 1 FROM hiring_assessments ha
    JOIN tests t ON (
      (ha.test_type = 'disc' AND t.type = 'disc')
      OR (ha.test_type = 'temperamentos' AND t.type = 'temperamentos')
    )
    WHERE t.id = test_questions.test_id
      AND ha.status IN ('pending', 'in_progress')
  )
);