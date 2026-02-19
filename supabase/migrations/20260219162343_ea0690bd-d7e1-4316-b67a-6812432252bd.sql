-- Allow admins to read ativacao_codigo
CREATE POLICY "Admins can view all ativacao_codigo"
ON public.ativacao_codigo FOR SELECT
USING (public.is_admin_user(auth.uid()));

-- Allow admins to read ativacao_profissional
CREATE POLICY "Admins can view all ativacao_profissional"
ON public.ativacao_profissional FOR SELECT
USING (public.is_admin_user(auth.uid()));

-- Allow admins to read codigo_cruzamentos
CREATE POLICY "Admins can view all codigo_cruzamentos"
ON public.codigo_cruzamentos FOR SELECT
USING (public.is_admin_user(auth.uid()));