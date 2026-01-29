-- Drop all existing policies on admin_permissions
DROP POLICY IF EXISTS "Super admins can manage permissions" ON public.admin_permissions;
DROP POLICY IF EXISTS "Super admins can view all permissions" ON public.admin_permissions;
DROP POLICY IF EXISTS "Users can view their own permissions" ON public.admin_permissions;

-- Recreate is_super_admin to check user_roles table instead (no recursion)
CREATE OR REPLACE FUNCTION public.is_super_admin(_user_id uuid)
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

-- Create simple, non-recursive policies
-- Policy 1: Users can view their own permissions
CREATE POLICY "View own permissions"
ON public.admin_permissions
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Policy 2: Admins (from user_roles) can view all permissions
CREATE POLICY "Admins view all permissions"
ON public.admin_permissions
FOR SELECT
TO authenticated
USING (public.is_admin_user(auth.uid()));

-- Policy 3: Admins can manage all permissions
CREATE POLICY "Admins manage permissions"
ON public.admin_permissions
FOR ALL
TO authenticated
USING (public.is_admin_user(auth.uid()))
WITH CHECK (public.is_admin_user(auth.uid()));