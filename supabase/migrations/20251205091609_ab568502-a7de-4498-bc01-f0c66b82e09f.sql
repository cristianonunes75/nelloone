-- Allow admins to delete user tests and test answers
CREATE POLICY "Admins can delete user tests" 
ON public.user_tests 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete test answers" 
ON public.test_answers 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));