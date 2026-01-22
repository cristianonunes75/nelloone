-- Tabela de Templates de Redes Sociais
CREATE TABLE public.social_media_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product TEXT NOT NULL CHECK (product IN ('identity', 'life', 'flow', 'business', 'praxis')),
  content_type TEXT NOT NULL,
  format TEXT NOT NULL,
  title TEXT,
  description TEXT,
  colors JSONB DEFAULT '{}',
  background_image_url TEXT,
  is_default BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de Posts Salvos/Agendados
CREATE TABLE public.social_media_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product TEXT NOT NULL CHECK (product IN ('identity', 'life', 'flow', 'business', 'praxis')),
  content_type TEXT NOT NULL,
  format TEXT NOT NULL,
  copy TEXT NOT NULL,
  title TEXT,
  subtitle TEXT,
  scripture TEXT,
  scripture_ref TEXT,
  cta_text TEXT,
  theme TEXT DEFAULT 'light',
  background_image_url TEXT,
  image_opacity NUMERIC DEFAULT 0.3,
  generated_image_url TEXT,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  published_at TIMESTAMP WITH TIME ZONE,
  platforms JSONB DEFAULT '[]',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'failed')),
  ai_generated BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de Histórico de Publicações
CREATE TABLE public.post_publish_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES public.social_media_posts(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT DEFAULT 'success',
  error_message TEXT,
  engagement_metrics JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Índices
CREATE INDEX idx_social_media_posts_product ON public.social_media_posts(product);
CREATE INDEX idx_social_media_posts_status ON public.social_media_posts(status);
CREATE INDEX idx_social_media_posts_scheduled_at ON public.social_media_posts(scheduled_at);
CREATE INDEX idx_social_media_posts_created_by ON public.social_media_posts(created_by);
CREATE INDEX idx_social_media_templates_product ON public.social_media_templates(product);

-- Enable RLS
ALTER TABLE public.social_media_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_media_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_publish_history ENABLE ROW LEVEL SECURITY;

-- Policies for templates (admins can manage, all authenticated can view)
CREATE POLICY "Admins can manage templates"
ON public.social_media_templates
FOR ALL
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authenticated users can view templates"
ON public.social_media_templates
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Policies for posts (admins can manage all, users can manage their own)
CREATE POLICY "Admins can manage all posts"
ON public.social_media_posts
FOR ALL
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view their own posts"
ON public.social_media_posts
FOR SELECT
USING (auth.uid() = created_by);

-- Policies for publish history (admins only)
CREATE POLICY "Admins can manage publish history"
ON public.post_publish_history
FOR ALL
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_social_media_templates_updated_at
BEFORE UPDATE ON public.social_media_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_social_media_posts_updated_at
BEFORE UPDATE ON public.social_media_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();