-- Drop the old unique constraint on section only
ALTER TABLE public.home_content 
DROP CONSTRAINT IF EXISTS home_content_section_key;

-- Drop old index if exists
DROP INDEX IF EXISTS home_content_section_key;

-- Add language column if not exists (may have been added in failed migration)
ALTER TABLE public.home_content 
ADD COLUMN IF NOT EXISTS language TEXT NOT NULL DEFAULT 'pt';

-- Create unique index for section+language combination
DROP INDEX IF EXISTS idx_home_content_section_language;
CREATE UNIQUE INDEX idx_home_content_section_language 
ON public.home_content(section, language);

-- Duplicate existing PT content to EN
INSERT INTO public.home_content (section, title, content, language, updated_by)
SELECT section, title, content, 'en', updated_by 
FROM public.home_content 
WHERE language = 'pt'
ON CONFLICT (section, language) DO NOTHING;

-- Duplicate existing PT content to PT-PT
INSERT INTO public.home_content (section, title, content, language, updated_by)
SELECT section, title, content, 'pt-pt', updated_by 
FROM public.home_content 
WHERE language = 'pt'
ON CONFLICT (section, language) DO NOTHING;