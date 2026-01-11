-- 1. Create security definer function to check if user is company admin
CREATE OR REPLACE FUNCTION public.is_company_admin(check_company_id uuid, check_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.company_users
    WHERE company_id = check_company_id
      AND user_id = check_user_id
      AND role IN ('company_admin', 'super_admin')
      AND is_active = true
  )
$$;

-- 2. Create security definer function to check if user is a Nello One admin
CREATE OR REPLACE FUNCTION public.is_nello_admin(check_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = check_user_id
      AND role = 'admin'
  )
$$;

-- 3. Create security definer function to get user's company_id
CREATE OR REPLACE FUNCTION public.get_user_company_id(check_user_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT company_id
  FROM public.company_users
  WHERE user_id = check_user_id
    AND is_active = true
  LIMIT 1
$$;

-- 4. Drop existing problematic policies
DROP POLICY IF EXISTS "Company admins can manage members" ON public.company_users;
DROP POLICY IF EXISTS "Company members can view fellow members basic info" ON public.company_users;

-- 5. Create new policies using security definer functions
-- Policy for inserting (company creation or admin adding members)
CREATE POLICY "Users can insert their own company_user record"
ON public.company_users
FOR INSERT
WITH CHECK (
  user_id = auth.uid()
  OR public.is_nello_admin(auth.uid())
);

-- Policy for selecting (members can view company colleagues)
CREATE POLICY "Members can view company members"
ON public.company_users
FOR SELECT
USING (
  user_id = auth.uid()
  OR company_id = public.get_user_company_id(auth.uid())
  OR public.is_nello_admin(auth.uid())
);

-- Policy for updating (admins can update, users can update their own)
CREATE POLICY "Admins can update company members"
ON public.company_users
FOR UPDATE
USING (
  user_id = auth.uid()
  OR public.is_company_admin(company_id, auth.uid())
  OR public.is_nello_admin(auth.uid())
);

-- Policy for deleting (only admins)
CREATE POLICY "Admins can delete company members"
ON public.company_users
FOR DELETE
USING (
  public.is_company_admin(company_id, auth.uid())
  OR public.is_nello_admin(auth.uid())
);