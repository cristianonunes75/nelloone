
-- Fix the check_identity_essencial_completion function to use correct enum value
CREATE OR REPLACE FUNCTION public.check_identity_essencial_completion(p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_disc_complete BOOLEAN := false;
  v_temp_complete BOOLEAN := false;
  v_estilos_complete BOOLEAN := false;
  v_result JSONB;
BEGIN
  -- Verificar DISC
  SELECT EXISTS (
    SELECT 1 FROM user_tests ut
    JOIN tests t ON t.id = ut.test_id
    WHERE ut.user_id = p_user_id
    AND ut.status = 'completed'
    AND t.type = 'disc'
  ) INTO v_disc_complete;
  
  -- Verificar Temperamentos
  SELECT EXISTS (
    SELECT 1 FROM user_tests ut
    JOIN tests t ON t.id = ut.test_id
    WHERE ut.user_id = p_user_id
    AND ut.status = 'completed'
    AND t.type = 'temperamentos'
  ) INTO v_temp_complete;
  
  -- Verificar Estilos de Conexão (o tipo correto é linguagens_amor no enum)
  SELECT EXISTS (
    SELECT 1 FROM user_tests ut
    JOIN tests t ON t.id = ut.test_id
    WHERE ut.user_id = p_user_id
    AND ut.status = 'completed'
    AND t.type = 'linguagens_amor'
  ) INTO v_estilos_complete;
  
  v_result := jsonb_build_object(
    'disc_complete', v_disc_complete,
    'temperamentos_complete', v_temp_complete,
    'estilos_conexao_complete', v_estilos_complete,
    'all_complete', (v_disc_complete AND v_temp_complete AND v_estilos_complete)
  );
  
  RETURN v_result;
END;
$$;
