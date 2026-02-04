-- Remove remaining admin policies from user_tests
DROP POLICY IF EXISTS "Admins can view all user tests" ON public.user_tests;
DROP POLICY IF EXISTS "Admins can delete user tests" ON public.user_tests;

-- Log this additional fix
INSERT INTO public.audit_logs (action, table_name, new_data)
VALUES (
  'security_fix_user_tests_admin_access',
  'user_tests',
  jsonb_build_object(
    'change', 'Removed remaining admin RLS policies from user_tests',
    'policies_removed', ARRAY['Admins can view all user tests', 'Admins can delete user tests'],
    'date', now()
  )
);