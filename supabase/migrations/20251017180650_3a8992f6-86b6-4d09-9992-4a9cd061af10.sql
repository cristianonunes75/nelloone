-- Fix photo_sessions security issue
-- Drop overly permissive policies
DROP POLICY IF EXISTS "Photographers can view assigned sessions" ON public.photo_sessions;
DROP POLICY IF EXISTS "Photographers can update assigned sessions" ON public.photo_sessions;

-- Recreate policies with proper restrictions
-- Photographers can ONLY view sessions where they are specifically assigned
CREATE POLICY "Photographers can view assigned sessions"
ON public.photo_sessions
FOR SELECT
USING (auth.uid() = photographer_id);

-- Photographers can ONLY update sessions where they are specifically assigned
CREATE POLICY "Photographers can update assigned sessions"
ON public.photo_sessions
FOR UPDATE
USING (auth.uid() = photographer_id);