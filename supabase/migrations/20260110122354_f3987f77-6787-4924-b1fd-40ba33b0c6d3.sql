-- =====================================================
-- CONTEXTUAL REPORTS SYSTEM - Unified table for all relationship reports
-- Replaces relatorio_conjuge with a scalable solution
-- =====================================================

-- Create enum for report types
DO $$ BEGIN
    CREATE TYPE report_type_enum AS ENUM (
        'parceiro',
        'pai_para_filho',
        'filho_para_pai',
        'para_gestor',
        'para_equipe'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create the unified contextual reports table
CREATE TABLE IF NOT EXISTS public.relatorios_contextuais (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    mapa_essencia_id UUID REFERENCES public.mapa_essencia(id) ON DELETE SET NULL,
    
    -- Report type using enum
    report_type TEXT NOT NULL CHECK (report_type IN (
        'parceiro',
        'pai_para_filho',
        'filho_para_pai',
        'para_gestor',
        'para_equipe'
    )),
    
    -- Recipient name (optional personalization)
    recipient_name TEXT,
    
    -- AI-generated content
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    raw_content TEXT,
    
    -- Public sharing functionality
    public_token UUID DEFAULT gen_random_uuid(),
    public_token_expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
    is_public_active BOOLEAN DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Ensure one report per type per user
    UNIQUE(user_id, report_type)
);

-- Enable RLS
ALTER TABLE public.relatorios_contextuais ENABLE ROW LEVEL SECURITY;

-- Users can view their own reports
CREATE POLICY "Users can view their own contextual reports"
    ON public.relatorios_contextuais
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own reports
CREATE POLICY "Users can insert their own contextual reports"
    ON public.relatorios_contextuais
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own reports
CREATE POLICY "Users can update their own contextual reports"
    ON public.relatorios_contextuais
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Users can delete their own reports
CREATE POLICY "Users can delete their own contextual reports"
    ON public.relatorios_contextuais
    FOR DELETE
    USING (auth.uid() = user_id);

-- Public access via token for sharing
CREATE POLICY "Anyone can view public contextual reports by token"
    ON public.relatorios_contextuais
    FOR SELECT
    USING (
        is_public_active = true 
        AND public_token IS NOT NULL 
        AND (public_token_expires_at IS NULL OR public_token_expires_at > NOW())
    );

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_relatorios_contextuais_user_type 
    ON public.relatorios_contextuais(user_id, report_type);

CREATE INDEX IF NOT EXISTS idx_relatorios_contextuais_public_token 
    ON public.relatorios_contextuais(public_token) 
    WHERE is_public_active = true;

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_relatorios_contextuais_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_relatorios_contextuais_updated_at_trigger ON public.relatorios_contextuais;
CREATE TRIGGER update_relatorios_contextuais_updated_at_trigger
    BEFORE UPDATE ON public.relatorios_contextuais
    FOR EACH ROW
    EXECUTE FUNCTION update_relatorios_contextuais_updated_at();

-- Migrate existing data from relatorio_conjuge to new table
INSERT INTO public.relatorios_contextuais (
    user_id,
    mapa_essencia_id,
    report_type,
    recipient_name,
    content,
    raw_content,
    public_token,
    public_token_expires_at,
    is_public_active,
    created_at,
    updated_at
)
SELECT 
    user_id,
    mapa_essencia_id,
    'parceiro' as report_type,
    NULL as recipient_name, -- relatorio_conjuge doesn't have this field stored
    content,
    raw_content,
    public_token,
    public_token_expires_at,
    is_public_active,
    created_at,
    updated_at
FROM public.relatorio_conjuge
ON CONFLICT (user_id, report_type) DO UPDATE SET
    content = EXCLUDED.content,
    raw_content = EXCLUDED.raw_content,
    public_token = EXCLUDED.public_token,
    public_token_expires_at = EXCLUDED.public_token_expires_at,
    is_public_active = EXCLUDED.is_public_active,
    updated_at = EXCLUDED.updated_at;

-- Enable realtime for the new table
ALTER PUBLICATION supabase_realtime ADD TABLE public.relatorios_contextuais;