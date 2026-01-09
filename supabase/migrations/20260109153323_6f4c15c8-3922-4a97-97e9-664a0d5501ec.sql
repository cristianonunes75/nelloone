-- =============================================
-- CORREÇÃO DA POLÍTICA relatorio_conjuge (nomes corretos)
-- =============================================

DROP POLICY IF EXISTS "Public access via token" ON relatorio_conjuge;
DROP POLICY IF EXISTS "Public access via valid token" ON relatorio_conjuge;

CREATE POLICY "Public access via valid token" ON relatorio_conjuge
  FOR SELECT USING (
    user_id = auth.uid()
    OR public.has_role(auth.uid(), 'admin')
    OR (
      public_token IS NOT NULL 
      AND is_public_active = true
      AND public_token_expires_at > now()
    )
  );