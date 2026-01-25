
-- Corrigir política RLS de test_questions para dar acesso com journey_completed_tests >= 5
-- Isso alinha a RLS com a lógica do frontend (hasCompletedArquetipos)

DROP POLICY IF EXISTS "Users can view purchased or free test questions" ON public.test_questions;

CREATE POLICY "Users can view purchased or free test questions"
  ON public.test_questions FOR SELECT
  USING (
    -- Admin tem acesso total
    has_role(auth.uid(), 'admin'::app_role) 
    OR
    -- Teste ativo E (grátis OU comprado OU usuário completou 5+ testes)
    (EXISTS (
      SELECT 1 FROM tests t
      WHERE t.id = test_questions.test_id
      AND t.active = true
      AND (
        -- Teste grátis e usuário autenticado
        (t.is_free = true AND auth.uid() IS NOT NULL)
        OR
        -- Comprou o teste específico
        (EXISTS (
          SELECT 1 FROM test_purchases tp
          WHERE tp.user_id = auth.uid()
          AND tp.test_id = t.id
          AND tp.payment_status IN ('succeeded', 'completed')
        ))
        OR
        -- Comprou pacote (journey/combo/etc)
        (EXISTS (
          SELECT 1 FROM test_purchases tp
          WHERE tp.user_id = auth.uid()
          AND tp.purchase_category IN ('journey', 'combo', 'nello_one', 'jornada_completa')
          AND tp.payment_status IN ('succeeded', 'completed')
        ))
        OR
        -- Completou 5+ testes (desbloqueia acesso total)
        (EXISTS (
          SELECT 1 FROM profiles p
          WHERE p.id = auth.uid()
          AND p.journey_completed_tests >= 5
        ))
      )
    ))
    OR
    -- Hiring assessments
    (EXISTS (
      SELECT 1
      FROM hiring_assessments ha
      JOIN tests t ON (
        (ha.test_type = 'disc' AND t.type = 'disc') OR
        (ha.test_type = 'temperamentos' AND t.type = 'temperamentos')
      )
      WHERE t.id = test_questions.test_id
      AND ha.status IN ('pending', 'in_progress')
    ))
  );

COMMENT ON POLICY "Users can view purchased or free test questions" ON public.test_questions IS 
  'Permite visualizar perguntas de: testes grátis, testes comprados, pacotes completos, usuários com 5+ testes completos, ou hiring assessments';
