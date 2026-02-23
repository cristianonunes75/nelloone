-- Add sharing fields to mapa_essencia
ALTER TABLE public.mapa_essencia 
ADD COLUMN is_shared_with_professionals boolean NOT NULL DEFAULT false,
ADD COLUMN shared_at timestamp with time zone;

-- RLS policy: operators linked to the user (via professional_clients or client_operator_relationships) can view shared mapas
CREATE POLICY "Operators can view shared mapa_essencia"
ON public.mapa_essencia
FOR SELECT
TO authenticated
USING (
  is_shared_with_professionals = true
  AND (
    -- Via professional_clients table
    EXISTS (
      SELECT 1 FROM public.professional_clients pc
      JOIN public.operator_workspaces ow ON ow.id = pc.professional_id
      WHERE pc.client_user_id = mapa_essencia.user_id
      AND ow.user_id = auth.uid()
      AND pc.status = 'active'
    )
    OR
    -- Via client_operator_relationships table
    EXISTS (
      SELECT 1 FROM public.client_operator_relationships cor
      JOIN public.operator_workspaces ow ON ow.id = cor.operator_id
      JOIN public.professional_clients pc ON pc.id = cor.client_id
      WHERE pc.client_user_id = mapa_essencia.user_id
      AND ow.user_id = auth.uid()
      AND cor.status = 'active'
    )
  )
);