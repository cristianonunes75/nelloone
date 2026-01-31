-- ============================================
-- HARDENING RLS: Identity Security Migration (FIXED)
-- ============================================

-- 1. FIX PERMISSIVE "Service role has full access" policy on ativacao_codigo
DROP POLICY IF EXISTS "Service role has full access" ON public.ativacao_codigo;

-- 2. Ensure user_tests has proper RLS
ALTER TABLE public.user_tests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own tests" ON public.user_tests;
DROP POLICY IF EXISTS "Users can insert their own tests" ON public.user_tests;
DROP POLICY IF EXISTS "Users can update their own tests" ON public.user_tests;
DROP POLICY IF EXISTS "Admins can manage all tests" ON public.user_tests;

CREATE POLICY "Users can view their own tests" 
ON public.user_tests FOR SELECT TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tests" 
ON public.user_tests FOR INSERT TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tests" 
ON public.user_tests FOR UPDATE TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all user_tests" 
ON public.user_tests FOR ALL TO authenticated 
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 3. Secure test_answers via user_test_id relationship
ALTER TABLE public.test_answers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own answers" ON public.test_answers;
DROP POLICY IF EXISTS "Users can insert their own answers" ON public.test_answers;
DROP POLICY IF EXISTS "Admins can view all answers" ON public.test_answers;
DROP POLICY IF EXISTS "Admins can manage all test_answers" ON public.test_answers;

-- Create helper function for test_answers access
CREATE OR REPLACE FUNCTION public.owns_user_test(_user_test_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_tests
    WHERE id = _user_test_id AND user_id = auth.uid()
  )
$$;

CREATE POLICY "Users can view their own answers" 
ON public.test_answers FOR SELECT TO authenticated 
USING (public.owns_user_test(user_test_id));

CREATE POLICY "Users can insert their own answers" 
ON public.test_answers FOR INSERT TO authenticated 
WITH CHECK (public.owns_user_test(user_test_id));

CREATE POLICY "Admins can manage all test_answers" 
ON public.test_answers FOR ALL TO authenticated 
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 4. Secure relatorios_contextuais
DROP POLICY IF EXISTS "Public access via token" ON public.relatorios_contextuais;
DROP POLICY IF EXISTS "Users can view their own reports" ON public.relatorios_contextuais;
DROP POLICY IF EXISTS "Users can insert their own reports" ON public.relatorios_contextuais;
DROP POLICY IF EXISTS "Users can update their own reports" ON public.relatorios_contextuais;
DROP POLICY IF EXISTS "Admins can manage all relatorios" ON public.relatorios_contextuais;

CREATE POLICY "Users can view their own reports" 
ON public.relatorios_contextuais FOR SELECT TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Public token access for shared reports" 
ON public.relatorios_contextuais FOR SELECT TO anon, authenticated 
USING (is_public_active = true AND (public_token_expires_at IS NULL OR public_token_expires_at > now()));

CREATE POLICY "Users can insert their own reports" 
ON public.relatorios_contextuais FOR INSERT TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reports" 
ON public.relatorios_contextuais FOR UPDATE TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all relatorios" 
ON public.relatorios_contextuais FOR ALL TO authenticated 
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 5. Secure relatorio_conjuge
ALTER TABLE public.relatorio_conjuge ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own spouse report" ON public.relatorio_conjuge;
DROP POLICY IF EXISTS "Users can insert their own spouse report" ON public.relatorio_conjuge;
DROP POLICY IF EXISTS "Public token access" ON public.relatorio_conjuge;
DROP POLICY IF EXISTS "Public token access for spouse reports" ON public.relatorio_conjuge;
DROP POLICY IF EXISTS "Users can update their own spouse report" ON public.relatorio_conjuge;
DROP POLICY IF EXISTS "Admins can manage all spouse reports" ON public.relatorio_conjuge;

CREATE POLICY "Users can view their own spouse report" 
ON public.relatorio_conjuge FOR SELECT TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Public token access for spouse reports" 
ON public.relatorio_conjuge FOR SELECT TO anon, authenticated 
USING (is_public_active = true AND (public_token_expires_at IS NULL OR public_token_expires_at > now()));

CREATE POLICY "Users can insert their own spouse report" 
ON public.relatorio_conjuge FOR INSERT TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own spouse report" 
ON public.relatorio_conjuge FOR UPDATE TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all spouse reports" 
ON public.relatorio_conjuge FOR ALL TO authenticated 
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 6. Secure test_purchases
ALTER TABLE public.test_purchases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own purchases" ON public.test_purchases;
DROP POLICY IF EXISTS "Users can insert purchases" ON public.test_purchases;
DROP POLICY IF EXISTS "Admins can manage purchases" ON public.test_purchases;
DROP POLICY IF EXISTS "Admins can manage all purchases" ON public.test_purchases;
DROP POLICY IF EXISTS "Service role can insert purchases" ON public.test_purchases;

CREATE POLICY "Users can view their own purchases" 
ON public.test_purchases FOR SELECT TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all purchases" 
ON public.test_purchases FOR ALL TO authenticated 
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 7. Fix ativacao_profissional DELETE policy
DROP POLICY IF EXISTS "Users can delete their own professional activation" ON public.ativacao_profissional;

CREATE POLICY "Users can delete their own professional activation" 
ON public.ativacao_profissional FOR DELETE TO authenticated 
USING (auth.uid() = user_id);

-- 8. Secure audit_logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "System can insert audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Authenticated users can insert audit logs" ON public.audit_logs;

CREATE POLICY "Admins can view audit logs" 
ON public.audit_logs FOR SELECT TO authenticated 
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can insert own audit logs" 
ON public.audit_logs FOR INSERT TO authenticated 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- 9. Fix function search_path security
CREATE OR REPLACE FUNCTION public.update_relatorios_contextuais_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$;

-- 10. Ensure mapa_essencia DELETE is restricted
DROP POLICY IF EXISTS "Users can delete their own mapa" ON public.mapa_essencia;
DROP POLICY IF EXISTS "Admins can delete any mapa" ON public.mapa_essencia;

CREATE POLICY "Users can delete their own mapa" 
ON public.mapa_essencia FOR DELETE TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can delete any mapa" 
ON public.mapa_essencia FOR DELETE TO authenticated 
USING (public.has_role(auth.uid(), 'admin'::app_role));