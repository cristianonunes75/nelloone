-- Create table for home page content management
CREATE TABLE IF NOT EXISTS public.home_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section TEXT NOT NULL UNIQUE,
  title TEXT,
  content JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.home_content ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view home content"
  ON public.home_content
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage home content"
  ON public.home_content
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert initial content for About section
INSERT INTO public.home_content (section, title, content) VALUES
('about', 'O que é o Essentia?', jsonb_build_object(
  'paragraphs', jsonb_build_array(
    'Antes de ser visto, você precisa se enxergar. O Essentia nasceu desse princípio: unir autoconhecimento, fé e imagem para revelar a beleza da verdade que habita em cada pessoa.',
    'O Essentia é uma experiência de revelação interior. Um encontro entre alma e imagem, onde a fotografia se torna espelho daquilo que você carrega de mais autêntico.',
    'Combinamos 8 testes de personalidade, consultoria de imagem e fotografia sensível para expressar sua essência, sua missão e o propósito que o move.',
    'O resultado é uma imagem viva, coerente e inspiradora. Ela reflete a sua identidade mais profunda e comunica sem palavras aquilo que Deus já escreveu em você.',
    'Inspirado por valores cristãos, o Essentia acolhe todos que buscam propósito, verdade e presença com sentido. Quando a imagem e a alma se encontram, o olhar se torna oração.'
  ),
  'location', 'Atendemos exclusivamente em Brasília-DF, garantindo qualidade e excelência em cada detalhe.'
));

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION update_home_content_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER home_content_updated_at
  BEFORE UPDATE ON public.home_content
  FOR EACH ROW
  EXECUTE FUNCTION update_home_content_timestamp();