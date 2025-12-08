-- Drop existing SELECT policies and recreate as PERMISSIVE with auth requirement
-- This ensures unauthenticated users cannot access the profiles table

-- First, drop the existing SELECT policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Photographers see assigned client profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Create a single comprehensive PERMISSIVE policy for SELECT that requires authentication
-- This policy combines all valid access patterns into one, ensuring no public access
CREATE POLICY "Authenticated users can view allowed profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (
  -- Users can view their own profile
  auth.uid() = id
  OR 
  -- Admins can view all profiles
  has_role(auth.uid(), 'admin'::app_role)
  OR 
  -- Photographers can view profiles of their assigned clients
  (
    has_role(auth.uid(), 'fotografo'::app_role) 
    AND (
      EXISTS (
        SELECT 1 FROM photo_sessions ps
        WHERE ps.user_id = profiles.id AND ps.photographer_id = auth.uid()
      )
      OR EXISTS (
        SELECT 1 FROM photo_galleries pg
        WHERE pg.client_id = profiles.id AND pg.photographer_id = auth.uid()
      )
    )
  )
);