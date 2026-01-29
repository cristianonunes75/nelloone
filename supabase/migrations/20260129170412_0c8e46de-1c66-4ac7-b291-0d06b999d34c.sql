-- Drop all remaining policies on admin_permissions
DROP POLICY IF EXISTS "Admins manage permissions" ON admin_permissions;
DROP POLICY IF EXISTS "Admins view all permissions" ON admin_permissions;
DROP POLICY IF EXISTS "View own permissions" ON admin_permissions;