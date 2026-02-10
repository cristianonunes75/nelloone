
-- Create affiliate marketing materials table
CREATE TABLE public.affiliate_marketing_materials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL DEFAULT 'copy', -- 'copy', 'image', 'file'
  category TEXT NOT NULL DEFAULT 'general', -- 'whatsapp', 'instagram', 'linkedin', 'banner', 'general'
  content TEXT NOT NULL, -- copy text or storage URL
  file_name TEXT, -- original file name for downloads
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.affiliate_marketing_materials ENABLE ROW LEVEL SECURITY;

-- Admins can do everything
CREATE POLICY "Admins full access to marketing materials"
ON public.affiliate_marketing_materials
FOR ALL
USING (public.is_admin_user(auth.uid()));

-- Authenticated affiliates can read active materials
CREATE POLICY "Active affiliates can read active materials"
ON public.affiliate_marketing_materials
FOR SELECT
USING (
  is_active = true
  AND EXISTS (
    SELECT 1 FROM public.affiliates
    WHERE user_id = auth.uid() AND is_active = true
  )
);

-- Updated_at trigger
CREATE TRIGGER update_affiliate_marketing_materials_updated_at
BEFORE UPDATE ON public.affiliate_marketing_materials
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for affiliate assets
INSERT INTO storage.buckets (id, name, public) VALUES ('affiliate-assets', 'affiliate-assets', true);

-- Storage policies
CREATE POLICY "Anyone can read affiliate assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'affiliate-assets');

CREATE POLICY "Admins can upload affiliate assets"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'affiliate-assets' AND public.is_admin_user(auth.uid()));

CREATE POLICY "Admins can update affiliate assets"
ON storage.objects FOR UPDATE
USING (bucket_id = 'affiliate-assets' AND public.is_admin_user(auth.uid()));

CREATE POLICY "Admins can delete affiliate assets"
ON storage.objects FOR DELETE
USING (bucket_id = 'affiliate-assets' AND public.is_admin_user(auth.uid()));
