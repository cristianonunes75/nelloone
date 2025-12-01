-- Make the photos bucket private
UPDATE storage.buckets 
SET public = false 
WHERE id = 'photos';