-- Adicionar role admin de volta para o usuário atual
-- Este script adiciona a role admin para todos os usuários que possuem role de fotografo
-- mas não possuem role de admin

-- Primeiro, vamos identificar o usuário atual através de seu profile
-- e adicionar a role admin se ele não tiver

DO $$
DECLARE
  current_user_id uuid;
BEGIN
  -- Pegar o primeiro usuário que tem role de fotografo mas não tem admin
  SELECT DISTINCT ur.user_id INTO current_user_id
  FROM user_roles ur
  WHERE ur.role = 'fotografo'
  AND NOT EXISTS (
    SELECT 1 FROM user_roles ur2 
    WHERE ur2.user_id = ur.user_id 
    AND ur2.role = 'admin'
  )
  LIMIT 1;

  -- Se encontrou um usuário, adicionar role admin
  IF current_user_id IS NOT NULL THEN
    INSERT INTO user_roles (user_id, role)
    VALUES (current_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
    
    RAISE NOTICE 'Role admin adicionada para o usuário %', current_user_id;
  ELSE
    RAISE NOTICE 'Nenhum usuário encontrado que precise de role admin';
  END IF;
END $$;