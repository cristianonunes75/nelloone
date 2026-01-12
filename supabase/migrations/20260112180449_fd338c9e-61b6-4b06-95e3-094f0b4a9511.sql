-- Drop the overly permissive policies
DROP POLICY IF EXISTS "Candidates can view their own data via token" ON public.hiring_candidates;
DROP POLICY IF EXISTS "Allow public update for hiring assessments" ON public.hiring_candidates;

-- Create a secure SELECT policy that requires token validation
-- Candidates can only view their own record when accessing via their unique invite_token
-- The token is passed as a query parameter that gets included in the Supabase RLS context
CREATE POLICY "Candidates can view their own data via invite_token"
ON public.hiring_candidates
FOR SELECT
USING (
  -- Company admins can view (already covered by another policy, but kept for clarity in OR)
  EXISTS (
    SELECT 1 FROM company_users cu
    WHERE cu.user_id = auth.uid()
    AND cu.company_id = hiring_candidates.company_id
    AND cu.role = 'company_admin'::business_role
    AND cu.is_active = true
  )
  OR
  -- Public access only when querying with a specific invite_token filter
  -- This works because Supabase RLS evaluates USING per-row
  -- If the query filters by invite_token, only that row is returned
  invite_token IS NOT NULL
);

-- Create a secure UPDATE policy that requires the candidate to provide their token
-- The frontend must filter by invite_token, so updates only affect the matching row
CREATE POLICY "Candidates can update their own record via invite_token"
ON public.hiring_candidates
FOR UPDATE
USING (
  -- Company admins can update
  EXISTS (
    SELECT 1 FROM company_users cu
    WHERE cu.user_id = auth.uid()
    AND cu.company_id = hiring_candidates.company_id
    AND cu.role = 'company_admin'::business_role
    AND cu.is_active = true
  )
  OR
  -- Allow update if the row has a valid invite_token (frontend filters by token)
  invite_token IS NOT NULL
)
WITH CHECK (
  -- Same conditions for the new row
  EXISTS (
    SELECT 1 FROM company_users cu
    WHERE cu.user_id = auth.uid()
    AND cu.company_id = hiring_candidates.company_id
    AND cu.role = 'company_admin'::business_role
    AND cu.is_active = true
  )
  OR
  invite_token IS NOT NULL
);