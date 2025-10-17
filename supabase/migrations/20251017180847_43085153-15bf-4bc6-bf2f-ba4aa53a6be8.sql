-- Create storage bucket for photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'photos',
  'photos',
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
);

-- Storage policies for photos bucket
CREATE POLICY "Anyone can view photos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'photos');

CREATE POLICY "Photographers can upload photos"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'photos' AND
  has_role(auth.uid(), 'fotografo')
);

CREATE POLICY "Photographers can update their photos"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'photos' AND
  has_role(auth.uid(), 'fotografo')
);

CREATE POLICY "Photographers can delete their photos"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'photos' AND
  has_role(auth.uid(), 'fotografo')
);

CREATE POLICY "Admins can manage all photos"
ON storage.objects
FOR ALL
USING (
  bucket_id = 'photos' AND
  has_role(auth.uid(), 'admin')
);

-- Create photo_galleries table
CREATE TABLE public.photo_galleries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  photographer_id UUID NOT NULL,
  client_id UUID,
  session_id UUID REFERENCES public.photo_sessions(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'published', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.photo_galleries ENABLE ROW LEVEL SECURITY;

-- Policies for photo_galleries
CREATE POLICY "Photographers can view their galleries"
ON public.photo_galleries
FOR SELECT
USING (auth.uid() = photographer_id);

CREATE POLICY "Clients can view their galleries"
ON public.photo_galleries
FOR SELECT
USING (auth.uid() = client_id);

CREATE POLICY "Photographers can create galleries"
ON public.photo_galleries
FOR INSERT
WITH CHECK (auth.uid() = photographer_id AND has_role(auth.uid(), 'fotografo'));

CREATE POLICY "Photographers can update their galleries"
ON public.photo_galleries
FOR UPDATE
USING (auth.uid() = photographer_id);

CREATE POLICY "Admins can manage all galleries"
ON public.photo_galleries
FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- Create gallery_photos table
CREATE TABLE public.gallery_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  gallery_id UUID NOT NULL REFERENCES public.photo_galleries(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  thumbnail_path TEXT,
  title TEXT,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.gallery_photos ENABLE ROW LEVEL SECURITY;

-- Policies for gallery_photos
CREATE POLICY "Users can view photos of galleries they have access to"
ON public.gallery_photos
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.photo_galleries
    WHERE photo_galleries.id = gallery_photos.gallery_id
    AND (
      photo_galleries.photographer_id = auth.uid() OR
      photo_galleries.client_id = auth.uid() OR
      has_role(auth.uid(), 'admin')
    )
  )
);

CREATE POLICY "Photographers can manage photos in their galleries"
ON public.gallery_photos
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.photo_galleries
    WHERE photo_galleries.id = gallery_photos.gallery_id
    AND photo_galleries.photographer_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage all gallery photos"
ON public.gallery_photos
FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- Triggers for updated_at
CREATE TRIGGER update_photo_galleries_updated_at
BEFORE UPDATE ON public.photo_galleries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create AI conversations table
CREATE TABLE public.ai_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their conversations"
ON public.ai_conversations
FOR ALL
USING (auth.uid() = user_id);

-- Create AI messages table
CREATE TABLE public.ai_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.ai_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage messages in their conversations"
ON public.ai_messages
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.ai_conversations
    WHERE ai_conversations.id = ai_messages.conversation_id
    AND ai_conversations.user_id = auth.uid()
  )
);

CREATE TRIGGER update_ai_conversations_updated_at
BEFORE UPDATE ON public.ai_conversations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();