-- Este script permite você tornar um usuário específico admin
-- Substitua o email abaixo pelo seu email de cadastro

-- Primeiro, vamos ver seu user_id (procure pelo seu email)
-- Depois execute a atualização da role

-- IMPORTANTE: Execute este comando APÓS criar sua conta
-- Substitua 'seu-email@exemplo.com' pelo email que você usou no cadastro

-- Para atualizar, use este comando no SQL Editor do backend:
-- UPDATE public.user_roles 
-- SET role = 'admin'
-- WHERE user_id = (SELECT id FROM auth.users WHERE email = 'seu-email@exemplo.com');

-- Por segurança, vou criar uma view para facilitar ver os usuários e suas roles
CREATE OR REPLACE VIEW public.users_with_roles AS
SELECT 
  au.id,
  au.email,
  p.full_name,
  ur.role,
  p.created_at
FROM auth.users au
LEFT JOIN public.profiles p ON p.id = au.id
LEFT JOIN public.user_roles ur ON ur.user_id = au.id
ORDER BY p.created_at DESC;

-- Permissão para admins verem esta view
GRANT SELECT ON public.users_with_roles TO authenticated;