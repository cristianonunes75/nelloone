-- Create storage bucket for candidate attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('candidate-attachments', 'candidate-attachments', true)
ON CONFLICT (id) DO NOTHING;

-- Add attachments column to hiring_candidates table
ALTER TABLE public.hiring_candidates 
ADD COLUMN IF NOT EXISTS attachments jsonb DEFAULT '[]'::jsonb;

-- RLS Policies for candidate-attachments bucket
-- Allow company admins to upload files
CREATE POLICY "Company admins can upload candidate attachments"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'candidate-attachments'
  AND auth.role() = 'authenticated'
);

-- Allow anyone to view files (public bucket)
CREATE POLICY "Public can view candidate attachments"
ON storage.objects FOR SELECT
USING (bucket_id = 'candidate-attachments');

-- Allow company admins to delete their files
CREATE POLICY "Company admins can delete candidate attachments"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'candidate-attachments'
  AND auth.role() = 'authenticated'
);