-- Add is_featured column to testimonials table for featured testimonials
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false;

-- Create index for faster queries on featured testimonials
CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON public.testimonials (is_featured, status, created_at DESC);

-- Add response tracking columns
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS response_sent_at timestamp with time zone;
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS response_sent_by uuid;