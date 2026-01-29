-- Drop any remaining "authenticated users" policies on admin_permissions
DROP POLICY IF EXISTS "Enable update for authenticated users" ON admin_permissions;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON admin_permissions;
DROP POLICY IF EXISTS "Enable select for authenticated users" ON admin_permissions;
DROP POLICY IF EXISTS "Enable read for authenticated users" ON admin_permissions;