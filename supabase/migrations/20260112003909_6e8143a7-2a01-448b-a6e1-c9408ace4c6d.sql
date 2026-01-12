-- Add policies for admins to INSERT and UPDATE mapa_essencia on behalf of users (for impersonation)
CREATE POLICY "Admins can insert mapa for any user"
ON public.mapa_essencia
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update mapa for any user"
ON public.mapa_essencia
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));