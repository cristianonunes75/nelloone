-- Create user_consents table for LGPD compliance
CREATE TABLE public.user_consents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  consent_version TEXT NOT NULL DEFAULT '1.0',
  accepted_terms BOOLEAN NOT NULL DEFAULT false,
  accepted_privacy BOOLEAN NOT NULL DEFAULT false,
  consent_type TEXT NOT NULL DEFAULT 'signup',
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for efficient lookups
CREATE INDEX idx_user_consents_user_id ON public.user_consents(user_id);
CREATE INDEX idx_user_consents_version ON public.user_consents(consent_version);

-- Enable RLS
ALTER TABLE public.user_consents ENABLE ROW LEVEL SECURITY;

-- Users can view their own consents
CREATE POLICY "Users can view their own consents"
ON public.user_consents
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own consents
CREATE POLICY "Users can create their own consents"
ON public.user_consents
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Admins can view all consents for audit purposes
CREATE POLICY "Admins can view all consents"
ON public.user_consents
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_user_consents_updated_at
BEFORE UPDATE ON public.user_consents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add comment for documentation
COMMENT ON TABLE public.user_consents IS 'Stores explicit user consent records for LGPD compliance with versioning';