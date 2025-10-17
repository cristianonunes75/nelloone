-- Script para garantir que o sistema de múltiplas roles funcione corretamente
-- e adicionar a role admin de volta para usuários que precisam

-- Primeiro, vamos garantir que não há constraint impedindo múltiplas roles
-- (a constraint UNIQUE(user_id, role) já permite isso)

-- Função auxiliar para adicionar role sem duplicar
CREATE OR REPLACE FUNCTION public.add_user_role(_user_id uuid, _role app_role)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (_user_id, _role)
  ON CONFLICT (user_id, role) DO NOTHING;
END;
$$;

-- Função auxiliar para remover role
CREATE OR REPLACE FUNCTION public.remove_user_role(_user_id uuid, _role app_role)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.user_roles
  WHERE user_id = _user_id AND role = _role;
END;
$$;

-- Função para obter todas as roles de um usuário
CREATE OR REPLACE FUNCTION public.get_user_roles(_user_id uuid)
RETURNS TABLE(role app_role)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  ORDER BY 
    CASE role
      WHEN 'admin' THEN 1
      WHEN 'fotografo' THEN 2
      WHEN 'cliente' THEN 3
    END
$$;