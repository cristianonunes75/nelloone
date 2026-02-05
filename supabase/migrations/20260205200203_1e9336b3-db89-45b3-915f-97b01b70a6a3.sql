-- =====================================================
-- ADDITIONAL SECURITY FIXES
-- Enable RLS on hiring_candidates and add proper policies
-- =====================================================

-- 1. Enable RLS on hiring_candidates (if not already enabled)
ALTER TABLE public.hiring_candidates ENABLE ROW LEVEL SECURITY;

-- 2. Add policy for company admins to view their company's candidates
CREATE POLICY "Company admins can view their company candidates"
ON public.hiring_candidates FOR SELECT
TO authenticated
USING (
  is_company_admin(company_id, auth.uid()) 
  OR is_nello_admin(auth.uid())
);

-- 3. Add policy for company admins to update their company's candidates
CREATE POLICY "Company admins can update their company candidates"
ON public.hiring_candidates FOR UPDATE
TO authenticated
USING (
  is_company_admin(company_id, auth.uid()) 
  OR is_nello_admin(auth.uid())
)
WITH CHECK (
  is_company_admin(company_id, auth.uid()) 
  OR is_nello_admin(auth.uid())
);

-- 4. Add policy for company admins to insert candidates
CREATE POLICY "Company admins can insert candidates"
ON public.hiring_candidates FOR INSERT
TO authenticated
WITH CHECK (
  is_company_admin(company_id, auth.uid()) 
  OR is_nello_admin(auth.uid())
);

-- 5. Add policy for company admins to delete candidates
CREATE POLICY "Company admins can delete their company candidates"
ON public.hiring_candidates FOR DELETE
TO authenticated
USING (
  is_company_admin(company_id, auth.uid()) 
  OR is_nello_admin(auth.uid())
);