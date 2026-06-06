-- =============================================
-- BIBLIOTECA DE DOCUMENTOS DO ECC (privada, acesso por allowlist)
-- Prefixo ecc_. Acesso preso a uma lista que o dono gerencia.
-- =============================================

-- 1. ALLOWLIST de acesso (quem pode ver/editar a biblioteca)
CREATE TABLE IF NOT EXISTS public.ecc_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id),
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('owner', 'editor', 'viewer')),
  added_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (email)
);

-- 2. PASTAS (Geral + uma por equipe)
CREATE TABLE IF NOT EXISTS public.ecc_folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  kind TEXT NOT NULL DEFAULT 'geral' CHECK (kind IN ('geral', 'equipe', 'outro')),
  sort_order INTEGER DEFAULT 0,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. DOCUMENTOS
CREATE TABLE IF NOT EXISTS public.ecc_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  folder_id UUID REFERENCES public.ecc_folders(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  notes TEXT,                          -- anotacoes gerais do documento
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_ecc_documents_folder ON public.ecc_documents(folder_id);

-- 4. PAGINAS (foto + transcricao + nota)
CREATE TABLE IF NOT EXISTS public.ecc_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES public.ecc_documents(id) ON DELETE CASCADE,
  page_number INTEGER NOT NULL DEFAULT 1,
  image_path TEXT,                     -- caminho no bucket ecc-docs
  transcription TEXT,                  -- texto transcrito (markdown)
  notes TEXT,                          -- anotacao da pagina
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'transcribed', 'reviewed')),
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_ecc_pages_document ON public.ecc_pages(document_id);

-- Busca por texto na transcricao
CREATE INDEX IF NOT EXISTS idx_ecc_pages_transcription_trgm
  ON public.ecc_pages USING gin (to_tsvector('portuguese', coalesce(transcription, '')));

-- =============================================
-- HELPERS
-- =============================================
CREATE OR REPLACE FUNCTION public.ecc_has_access()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.ecc_access a
    WHERE a.user_id = auth.uid()
       OR lower(a.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

CREATE OR REPLACE FUNCTION public.ecc_can_edit()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.ecc_access a
    WHERE (a.user_id = auth.uid() OR lower(a.email) = lower(coalesce(auth.jwt() ->> 'email', '')))
      AND a.role IN ('owner', 'editor')
  );
$$;

CREATE OR REPLACE FUNCTION public.ecc_is_owner()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.ecc_access a
    WHERE (a.user_id = auth.uid() OR lower(a.email) = lower(coalesce(auth.jwt() ->> 'email', '')))
      AND a.role = 'owner'
  );
$$;

-- Vincula user_id ao logar (quando o email bate com um convite sem user_id)
CREATE OR REPLACE FUNCTION public.ecc_claim_access()
RETURNS VOID LANGUAGE sql SECURITY DEFINER SET search_path TO 'public' AS $$
  UPDATE public.ecc_access
  SET user_id = auth.uid()
  WHERE user_id IS NULL
    AND lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''));
$$;

-- =============================================
-- TRIGGERS updated_at
-- =============================================
CREATE TRIGGER update_ecc_folders_updated_at BEFORE UPDATE ON public.ecc_folders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_ecc_documents_updated_at BEFORE UPDATE ON public.ecc_documents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_ecc_pages_updated_at BEFORE UPDATE ON public.ecc_pages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- RLS
-- =============================================
ALTER TABLE public.ecc_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ecc_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ecc_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ecc_pages ENABLE ROW LEVEL SECURITY;

-- ecc_access: quem tem acesso ve a lista; so o dono gerencia
CREATE POLICY "ecc_access select" ON public.ecc_access FOR SELECT
  USING (public.ecc_has_access());
CREATE POLICY "ecc_access insert owner" ON public.ecc_access FOR INSERT
  WITH CHECK (public.ecc_is_owner());
CREATE POLICY "ecc_access update owner" ON public.ecc_access FOR UPDATE
  USING (public.ecc_is_owner());
CREATE POLICY "ecc_access delete owner" ON public.ecc_access FOR DELETE
  USING (public.ecc_is_owner() AND role <> 'owner');

-- folders / documents / pages: leitura p/ autorizados, escrita p/ editor+
CREATE POLICY "ecc_folders select" ON public.ecc_folders FOR SELECT USING (public.ecc_has_access());
CREATE POLICY "ecc_folders write" ON public.ecc_folders FOR ALL
  USING (public.ecc_can_edit()) WITH CHECK (public.ecc_can_edit());

CREATE POLICY "ecc_documents select" ON public.ecc_documents FOR SELECT USING (public.ecc_has_access());
CREATE POLICY "ecc_documents write" ON public.ecc_documents FOR ALL
  USING (public.ecc_can_edit()) WITH CHECK (public.ecc_can_edit());

CREATE POLICY "ecc_pages select" ON public.ecc_pages FOR SELECT USING (public.ecc_has_access());
CREATE POLICY "ecc_pages write" ON public.ecc_pages FOR ALL
  USING (public.ecc_can_edit()) WITH CHECK (public.ecc_can_edit());

-- =============================================
-- STORAGE: bucket privado ecc-docs
-- =============================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('ecc-docs', 'ecc-docs', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "ecc-docs read" ON storage.objects FOR SELECT
  USING (bucket_id = 'ecc-docs' AND public.ecc_has_access());
CREATE POLICY "ecc-docs insert" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'ecc-docs' AND public.ecc_can_edit());
CREATE POLICY "ecc-docs update" ON storage.objects FOR UPDATE
  USING (bucket_id = 'ecc-docs' AND public.ecc_can_edit());
CREATE POLICY "ecc-docs delete" ON storage.objects FOR DELETE
  USING (bucket_id = 'ecc-docs' AND public.ecc_can_edit());

-- =============================================
-- SEED: dono inicial (Cristiano)
-- =============================================
INSERT INTO public.ecc_access (email, role)
VALUES ('cristiano.cristianonunes@gmail.com', 'owner')
ON CONFLICT (email) DO UPDATE SET role = 'owner';
