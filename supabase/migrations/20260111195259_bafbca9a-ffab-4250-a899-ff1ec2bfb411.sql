-- Table to track imported user data and consent
CREATE TABLE public.company_user_imports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  source_type TEXT NOT NULL DEFAULT 'invite',
  tests_imported JSONB DEFAULT '[]'::jsonb,
  import_consented_at TIMESTAMPTZ,
  imported_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT company_user_imports_user_company_unique UNIQUE (company_id, user_id)
);

-- Table to store AI consultation history
CREATE TABLE public.company_ai_consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  requested_by UUID NOT NULL,
  consultation_type TEXT NOT NULL,
  context JSONB NOT NULL DEFAULT '{}'::jsonb,
  ai_response TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add import_requested column to company_invites
ALTER TABLE public.company_invites 
ADD COLUMN IF NOT EXISTS import_requested BOOLEAN DEFAULT false;

-- Enable RLS
ALTER TABLE public.company_user_imports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_ai_consultations ENABLE ROW LEVEL SECURITY;

-- RLS for company_user_imports: company admins can manage (using correct enum values)
CREATE POLICY "Company admins can view imports" 
ON public.company_user_imports 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.company_users cu
    WHERE cu.company_id = company_user_imports.company_id
    AND cu.user_id = auth.uid()
    AND cu.role IN ('super_admin', 'company_admin')
    AND cu.is_active = true
  )
);

CREATE POLICY "Company admins can insert imports" 
ON public.company_user_imports 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.company_users cu
    WHERE cu.company_id = company_user_imports.company_id
    AND cu.user_id = auth.uid()
    AND cu.role IN ('super_admin', 'company_admin')
    AND cu.is_active = true
  )
);

CREATE POLICY "Company admins can update imports" 
ON public.company_user_imports 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.company_users cu
    WHERE cu.company_id = company_user_imports.company_id
    AND cu.user_id = auth.uid()
    AND cu.role IN ('super_admin', 'company_admin')
    AND cu.is_active = true
  )
);

-- RLS for company_ai_consultations: company members can view, admins can insert
CREATE POLICY "Company members can view consultations" 
ON public.company_ai_consultations 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.company_users cu
    WHERE cu.company_id = company_ai_consultations.company_id
    AND cu.user_id = auth.uid()
    AND cu.is_active = true
  )
);

CREATE POLICY "Company admins can insert consultations" 
ON public.company_ai_consultations 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.company_users cu
    WHERE cu.company_id = company_ai_consultations.company_id
    AND cu.user_id = auth.uid()
    AND cu.role IN ('super_admin', 'company_admin')
    AND cu.is_active = true
  )
);

CREATE POLICY "Users can update rating on own consultations" 
ON public.company_ai_consultations 
FOR UPDATE 
USING (requested_by = auth.uid());

-- Indexes for performance
CREATE INDEX idx_company_user_imports_company ON public.company_user_imports(company_id);
CREATE INDEX idx_company_user_imports_user ON public.company_user_imports(user_id);
CREATE INDEX idx_company_ai_consultations_company ON public.company_ai_consultations(company_id);
CREATE INDEX idx_company_ai_consultations_type ON public.company_ai_consultations(consultation_type);