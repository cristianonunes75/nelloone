-- Create policy that allows company admins and super_admins to manage applications
CREATE POLICY "Company team can manage applications" ON job_applications
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM company_users cu
    WHERE cu.company_id = job_applications.company_id
    AND cu.user_id = auth.uid()
    AND cu.role IN ('company_admin', 'super_admin')
    AND cu.is_active = true
  )
  OR EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM company_users cu
    WHERE cu.company_id = job_applications.company_id
    AND cu.user_id = auth.uid()
    AND cu.role IN ('company_admin', 'super_admin')
    AND cu.is_active = true
  )
  OR EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);