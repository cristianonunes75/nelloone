-- Policies for admin_permissions using security definer functions
-- SELECT: Admins can view all, users can view their own
CREATE POLICY "admin_permissions_select_policy" ON admin_permissions 
FOR SELECT TO authenticated 
USING (
  public.is_admin_user(auth.uid()) OR user_id = auth.uid()
);

-- INSERT: Only super admins can create permissions
CREATE POLICY "admin_permissions_insert_policy" ON admin_permissions 
FOR INSERT TO authenticated 
WITH CHECK (
  public.is_super_admin(auth.uid())
);

-- UPDATE: Only super admins can update permissions
CREATE POLICY "admin_permissions_update_policy" ON admin_permissions 
FOR UPDATE TO authenticated 
USING (public.is_super_admin(auth.uid()));

-- DELETE: Only super admins can delete permissions
CREATE POLICY "admin_permissions_delete_policy" ON admin_permissions 
FOR DELETE TO authenticated 
USING (public.is_super_admin(auth.uid()));