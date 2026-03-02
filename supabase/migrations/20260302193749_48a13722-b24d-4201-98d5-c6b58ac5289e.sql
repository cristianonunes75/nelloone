
-- 1. INSERT/UPDATE policies para discernir_apoio_escuta
CREATE POLICY "Users can insert own apoio escuta"
  ON discernir_apoio_escuta FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own apoio escuta"
  ON discernir_apoio_escuta FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- 2. INSERT policy para discernir_access_logs (padres)
CREATE POLICY "Priests can insert access logs"
  ON discernir_access_logs FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM discernir_priests
      WHERE id = discernir_access_logs.priest_id
      AND user_id = auth.uid()
    )
  );

-- 3. SELECT em discernir_parishes para casais
CREATE POLICY "Couples can view their parish"
  ON discernir_parishes FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM discernir_couples
      WHERE parish_id = discernir_parishes.id
      AND (spouse_a_user_id = auth.uid() OR spouse_b_user_id = auth.uid())
    )
  );

-- 4. INSERT em discernir_couples (sistema/convite)
CREATE POLICY "System can create couples"
  ON discernir_couples FOR INSERT
  TO authenticated
  WITH CHECK (
    spouse_a_user_id = auth.uid() OR spouse_b_user_id = auth.uid()
  );
