CREATE TABLE public.discernir_circle_combinations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  signature_hash TEXT NOT NULL UNIQUE,
  member_user_ids UUID[] NOT NULL,
  result_json JSONB NOT NULL,
  generated_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_discernir_circle_combinations_signature
  ON public.discernir_circle_combinations(signature_hash);

ALTER TABLE public.discernir_circle_combinations ENABLE ROW LEVEL SECURITY;

-- Helper: verifica se o usuário é padre/coordenador do Discernir
CREATE OR REPLACE FUNCTION public.is_discernir_coordinator(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.discernir_priests
    WHERE user_id = _user_id
  );
$$;

CREATE POLICY "Discernir coordinators can view circle combinations"
ON public.discernir_circle_combinations
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR public.is_discernir_coordinator(auth.uid())
);

CREATE POLICY "Discernir coordinators can insert circle combinations"
ON public.discernir_circle_combinations
FOR INSERT
TO authenticated
WITH CHECK (
  generated_by = auth.uid()
  AND (
    has_role(auth.uid(), 'admin'::app_role)
    OR public.is_discernir_coordinator(auth.uid())
  )
);

CREATE POLICY "Discernir coordinators can delete circle combinations"
ON public.discernir_circle_combinations
FOR DELETE
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR public.is_discernir_coordinator(auth.uid())
);