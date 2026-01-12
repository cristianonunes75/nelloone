-- Add policy to allow users to create their own companies
CREATE POLICY "Users can create their own company"
ON public.companies
FOR INSERT
WITH CHECK (created_by = auth.uid());

-- Add policy to allow users to create their own company subscriptions
CREATE POLICY "Users can create subscription for their company"
ON public.company_subscriptions
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.companies
    WHERE companies.id = company_subscriptions.company_id
    AND companies.created_by = auth.uid()
  )
  OR EXISTS (
    SELECT 1 FROM public.company_users
    WHERE company_users.company_id = company_subscriptions.company_id
    AND company_users.user_id = auth.uid()
    AND company_users.role IN ('company_admin', 'super_admin')
  )
  OR is_nello_admin(auth.uid())
);