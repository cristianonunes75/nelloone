-- Create table for reusable ideal profile templates
CREATE TABLE public.ideal_profile_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  profile JSONB NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.ideal_profile_templates ENABLE ROW LEVEL SECURITY;

-- Company members can view templates
CREATE POLICY "Company members can view templates"
ON public.ideal_profile_templates
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.company_users
    WHERE company_users.company_id = ideal_profile_templates.company_id
      AND company_users.user_id = auth.uid()
      AND company_users.is_active = true
  )
);

-- Company admins can manage templates
CREATE POLICY "Company admins can manage templates"
ON public.ideal_profile_templates
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.company_users
    WHERE company_users.company_id = ideal_profile_templates.company_id
      AND company_users.user_id = auth.uid()
      AND company_users.role IN ('company_admin', 'super_admin')
      AND company_users.is_active = true
  )
);

-- Create index for faster lookups
CREATE INDEX idx_profile_templates_company ON public.ideal_profile_templates(company_id);

-- Add trigger for updated_at
CREATE TRIGGER update_ideal_profile_templates_updated_at
BEFORE UPDATE ON public.ideal_profile_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();