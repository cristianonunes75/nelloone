-- Efficient lookup of auth.users by email (indexed)
-- Used by business-check-existing-user edge function
CREATE OR REPLACE FUNCTION public.get_auth_user_by_email(lookup_email text)
RETURNS TABLE(id uuid, email text)
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT au.id, au.email::text
  FROM auth.users au
  WHERE lower(au.email) = lower(lookup_email)
  LIMIT 1;
$$;

-- Only allow service role to call this function
REVOKE ALL ON FUNCTION public.get_auth_user_by_email(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_auth_user_by_email(text) FROM authenticated;
REVOKE ALL ON FUNCTION public.get_auth_user_by_email(text) FROM anon;
