-- Allow admins to read all user_tests (needed for live test monitor)
CREATE POLICY "Admins can view all user tests"
ON public.user_tests
FOR SELECT
USING (public.is_admin_user(auth.uid()));

-- Allow admins to read all test_answers (needed for live test monitor progress)
CREATE POLICY "Admins can view all test answers"
ON public.test_answers
FOR SELECT
USING (public.is_admin_user(auth.uid()));