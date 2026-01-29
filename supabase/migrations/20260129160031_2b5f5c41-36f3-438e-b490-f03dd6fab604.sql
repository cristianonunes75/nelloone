-- Drop the existing problematic policies
DROP POLICY IF EXISTS "Super admins can manage permissions" ON public.admin_permissions;
DROP POLICY IF EXISTS "Super admins can view all permissions" ON public.admin_permissions;

-- Create a security definer function to check if user is super admin
-- This bypasses RLS and prevents infinite recursion
CREATE OR REPLACE FUNCTION public.is_super_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_permissions
    WHERE user_id = _user_id
      AND permission_level = 'super_admin'::admin_permission_level
  )
$$;

-- Create a function to check if user has admin role
CREATE OR REPLACE FUNCTION public.is_admin_user(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = 'admin'
  )
$$;

-- Recreate RLS policies using the security definer function
CREATE POLICY "Users can view their own permissions"
ON public.admin_permissions
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Super admins can view all permissions"
ON public.admin_permissions
FOR SELECT
TO authenticated
USING (public.is_super_admin(auth.uid()) OR public.is_admin_user(auth.uid()));

CREATE POLICY "Super admins can manage permissions"
ON public.admin_permissions
FOR ALL
TO authenticated
USING (public.is_super_admin(auth.uid()) OR public.is_admin_user(auth.uid()))
WITH CHECK (public.is_super_admin(auth.uid()) OR public.is_admin_user(auth.uid()));