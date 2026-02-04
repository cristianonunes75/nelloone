-- ═══════════════════════════════════════════════════════════════════════════
-- SECURITY FIX: Remove admin access to sensitive psychological data
-- Tables: mapa_essencia, user_tests, test_answers
-- Risk: HIGH - Admins could view user's Código da Essência and test data
-- ═══════════════════════════════════════════════════════════════════════════

-- 1. MAPA_ESSENCIA: Remove all admin policies for sensitive content access
DROP POLICY IF EXISTS "Admins can view all mapas" ON public.mapa_essencia;
DROP POLICY IF EXISTS "Admins can update mapa for any user" ON public.mapa_essencia;
DROP POLICY IF EXISTS "Admins can delete any mapa" ON public.mapa_essencia;
DROP POLICY IF EXISTS "Admins can insert mapa for any user" ON public.mapa_essencia;

-- 2. USER_TESTS: Remove admin ALL policy
DROP POLICY IF EXISTS "Admins can manage all user_tests" ON public.user_tests;

-- 3. TEST_ANSWERS: Remove admin policies
DROP POLICY IF EXISTS "Admins can manage all test_answers" ON public.test_answers;
DROP POLICY IF EXISTS "Admins can delete test answers" ON public.test_answers;

-- 4. Create admin_profiles_view for safe admin access to user metadata only
DROP VIEW IF EXISTS public.admin_profiles_view;
CREATE VIEW public.admin_profiles_view AS
SELECT 
  p.id,
  p.full_name,
  p.created_at,
  p.journey_status,
  p.journey_completed_tests,
  p.journey_total_tests,
  p.phone IS NOT NULL AS has_phone,
  m.id IS NOT NULL AS has_mapa,
  m.version AS mapa_version,
  m.created_at AS mapa_created_at,
  m.updated_at AS mapa_updated_at
FROM public.profiles p
LEFT JOIN public.mapa_essencia m ON m.user_id = p.id;

GRANT SELECT ON public.admin_profiles_view TO authenticated;

-- 5. Add comments documenting the security fix
COMMENT ON TABLE public.mapa_essencia IS 'Stores user Código da Essência reports. SECURITY: RLS restricts access to owner only. No admin access allowed.';
COMMENT ON TABLE public.user_tests IS 'Stores user test instances. SECURITY: RLS restricts access to owner only.';
COMMENT ON TABLE public.test_answers IS 'Stores individual test answers. SECURITY: RLS restricts access via owns_user_test function.';

-- 6. Log this security change
INSERT INTO public.audit_logs (action, table_name, new_data)
VALUES (
  'security_fix_admin_data_access',
  'mapa_essencia,user_tests,test_answers',
  jsonb_build_object(
    'change', 'Removed admin RLS policies to prevent access to sensitive psychological data',
    'reason', 'LGPD compliance and user privacy protection',
    'date', now(),
    'policies_removed', ARRAY[
      'Admins can view all mapas',
      'Admins can update mapa for any user', 
      'Admins can delete any mapa',
      'Admins can insert mapa for any user',
      'Admins can manage all user_tests',
      'Admins can manage all test_answers',
      'Admins can delete test answers'
    ]
  )
);