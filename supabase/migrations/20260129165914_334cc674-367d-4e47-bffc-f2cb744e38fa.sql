-- Drop old/problematic RLS policies from admin_permissions
DROP POLICY IF EXISTS "admin_permissions_select" ON admin_permissions;
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON admin_permissions;

-- Create proper RLS policies using SECURITY DEFINER functions to avoid recursion
CREATE POLICY "Super admins can view all permissions"
ON admin_permissions
FOR SELECT
TO authenticated
USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Super admins can manage permissions"
ON admin_permissions
FOR ALL
TO authenticated
USING (public.is_super_admin(auth.uid()))
WITH CHECK (public.is_super_admin(auth.uid()));