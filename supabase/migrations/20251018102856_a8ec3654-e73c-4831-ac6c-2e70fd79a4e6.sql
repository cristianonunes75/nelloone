-- Secure photo storage with proper RLS policies

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can upload photos" ON storage.objects;
DROP POLICY IF EXISTS "Photographers access assigned photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own photos" ON storage.objects;

-- Allow users to upload their own photos
CREATE POLICY "Users can upload photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow photographers and admins to read assigned photos
CREATE POLICY "Photographers access assigned photos"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'photos' AND (
    -- Owner can always access their own photos
    auth.uid()::text = (storage.foldername(name))[1] OR
    -- Admins can access all photos
    has_role(auth.uid(), 'admin'::app_role) OR
    -- Photographers can access photos of their assigned clients
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

-- Allow users to update their own photos
CREATE POLICY "Users can update their own photos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own photos
CREATE POLICY "Users can delete their own photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);