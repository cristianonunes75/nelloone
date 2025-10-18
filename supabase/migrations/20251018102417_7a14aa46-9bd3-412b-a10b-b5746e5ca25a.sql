-- Fix 1: Restrict photographer access to only assigned clients
DROP POLICY IF EXISTS "Fotografos can view cliente profiles" ON profiles;

CREATE POLICY "Photographers see assigned client profiles"
ON profiles FOR SELECT
USING (
  auth.uid() = id OR
  has_role(auth.uid(), 'admin'::app_role) OR
  (
    has_role(auth.uid(), 'fotografo'::app_role) AND
    (
      EXISTS (
        SELECT 1 FROM photo_sessions ps
        WHERE ps.user_id = profiles.id
        AND ps.photographer_id = auth.uid()
      ) OR
      EXISTS (
        SELECT 1 FROM photo_galleries pg
        WHERE pg.client_id = profiles.id
        AND pg.photographer_id = auth.uid()
      )
    )
  )
);

-- Fix 2: Protect audit logs from tampering
CREATE POLICY "No direct audit log modifications"
ON audit_logs FOR INSERT
WITH CHECK (false);

CREATE POLICY "No audit log updates"
ON audit_logs FOR UPDATE
USING (false);

CREATE POLICY "No audit log deletions"
ON audit_logs FOR DELETE
USING (false);

-- Fix 3: Add storage policies for photos bucket
CREATE POLICY "Users can upload their own photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can access their own photos"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'photos' AND (
    auth.uid()::text = (storage.foldername(name))[1] OR
    has_role(auth.uid(), 'admin'::app_role) OR
    (
      has_role(auth.uid(), 'fotografo'::app_role) AND
      EXISTS (
        SELECT 1 FROM photo_galleries pg
        WHERE pg.photographer_id = auth.uid()
        AND (storage.foldername(name))[1] = pg.client_id::text
      )
    )
  )
);

CREATE POLICY "Users can update their own photos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'photos' AND (
    auth.uid()::text = (storage.foldername(name))[1] OR
    has_role(auth.uid(), 'admin'::app_role)
  )
);

-- Fix 4: Add unique constraint on transaction_id for webhook idempotency
ALTER TABLE test_purchases 
ADD CONSTRAINT unique_transaction_id UNIQUE (transaction_id);