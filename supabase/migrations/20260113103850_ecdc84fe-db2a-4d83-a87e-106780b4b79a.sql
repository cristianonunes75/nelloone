-- Expand company access to job applications to include collaborators
DO $$
BEGIN
  -- Drop policy if exists to allow recreation
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'job_applications'
      AND policyname = 'Company team can manage applications'
  ) THEN
    EXECUTE 'DROP POLICY "Company team can manage applications" ON public.job_applications';
  END IF;
END $$;

CREATE POLICY "Company team can manage applications" ON public.job_applications
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.company_users cu
    WHERE cu.company_id = job_applications.company_id
      AND cu.user_id = auth.uid()
      AND cu.role IN ('company_admin', 'super_admin', 'collaborator')
      AND cu.is_active = true
  )
  OR EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.company_users cu
    WHERE cu.company_id = job_applications.company_id
      AND cu.user_id = auth.uid()
      AND cu.role IN ('company_admin', 'super_admin', 'collaborator')
      AND cu.is_active = true
  )
  OR EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
  )
);
