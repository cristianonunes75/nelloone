-- =====================================================
-- FIX 1: Protect test_questions - Only allow access to purchased tests or free tests
-- =====================================================

-- Drop the current overly permissive policy
DROP POLICY IF EXISTS "Everyone can view questions for active tests" ON public.test_questions;

-- Create a secure policy that checks for purchase or free test
CREATE POLICY "Users can view purchased or free test questions"
ON public.test_questions
FOR SELECT
USING (
  -- Admins can always view all questions
  has_role(auth.uid(), 'admin'::app_role)
  OR
  EXISTS (
    SELECT 1 FROM public.tests t
    WHERE t.id = test_questions.test_id
    AND t.active = true
    AND (
      -- Free tests are accessible to authenticated users
      (t.is_free = true AND auth.uid() IS NOT NULL)
      OR
      -- Paid tests require a successful purchase (direct test purchase)
      EXISTS (
        SELECT 1 FROM public.test_purchases tp
        WHERE tp.user_id = auth.uid()
        AND tp.test_id = t.id
        AND tp.payment_status = 'succeeded'
      )
      OR
      -- Users with journey/combo purchase can access all tests
      EXISTS (
        SELECT 1 FROM public.test_purchases tp
        WHERE tp.user_id = auth.uid()
        AND tp.purchase_category IN ('journey', 'combo', 'nello_one')
        AND tp.payment_status = 'succeeded'
      )
    )
  )
  OR
  -- Hiring candidates can access DISC and Temperamentos for their assessments
  -- Match by test type/name since hiring uses test_type field
  EXISTS (
    SELECT 1 FROM public.hiring_assessments ha
    JOIN public.tests t ON (
      (ha.test_type = 'disc' AND t.type = 'disc') OR
      (ha.test_type = 'temperamentos' AND t.type = 'temperamentos')
    )
    WHERE t.id = test_questions.test_id
    AND ha.status IN ('pending', 'in_progress')
  )
);

-- =====================================================
-- FIX 2: Strengthen profiles table - ensure no public access
-- =====================================================

-- Drop any potential public access policies
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public can view profiles" ON public.profiles;

-- Add explicit INSERT policy for profiles (for new user creation via trigger)
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- =====================================================
-- FIX 3: Restrict audit logs insertion to admins only
-- =====================================================

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "System can insert audit logs" ON public.company_audit_logs;

-- Only allow admins to insert audit logs (edge functions use service role which bypasses RLS)
CREATE POLICY "Admins can insert audit logs"
ON public.company_audit_logs
FOR INSERT
WITH CHECK (
  -- Nello admins
  has_role(auth.uid(), 'admin'::app_role)
  OR
  -- Company admins for their own company
  EXISTS (
    SELECT 1 FROM company_users cu
    WHERE cu.user_id = auth.uid()
    AND cu.company_id = company_audit_logs.company_id
    AND cu.role IN ('company_admin', 'super_admin')
    AND cu.is_active = true
  )
);