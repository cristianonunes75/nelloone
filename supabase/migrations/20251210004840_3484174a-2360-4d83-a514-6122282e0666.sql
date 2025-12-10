-- Drop the existing overly permissive profile policy
DROP POLICY IF EXISTS "Authenticated users can view allowed profiles" ON public.profiles;

-- Create restrictive policy: Only profile owner and admins can view profiles
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (has_role(auth.uid(), 'admin'));