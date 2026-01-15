-- Table to track which apps each user is registered in
CREATE TABLE public.user_app_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  app_name TEXT NOT NULL CHECK (app_name IN ('one', 'life', 'flow', 'business')),
  registered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_accessed_at TIMESTAMPTZ,
  UNIQUE(user_id, app_name)
);

-- Enable RLS
ALTER TABLE public.user_app_registrations ENABLE ROW LEVEL SECURITY;

-- Users can view their own app registrations
CREATE POLICY "Users can view their own app registrations"
ON public.user_app_registrations
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own app registrations
CREATE POLICY "Users can insert their own app registrations"
ON public.user_app_registrations
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own app registrations (last_accessed_at)
CREATE POLICY "Users can update their own app registrations"
ON public.user_app_registrations
FOR UPDATE
USING (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX idx_user_app_registrations_user_id ON public.user_app_registrations(user_id);
CREATE INDEX idx_user_app_registrations_app_name ON public.user_app_registrations(app_name);

-- Table for cross-app tokens (for all users, not just admins)
CREATE TABLE public.cross_app_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  token TEXT NOT NULL UNIQUE,
  target_app TEXT NOT NULL CHECK (target_app IN ('one', 'life', 'flow', 'business')),
  target_path TEXT DEFAULT '/',
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '30 seconds'),
  used_at TIMESTAMPTZ,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.cross_app_tokens ENABLE ROW LEVEL SECURITY;

-- Only service role can insert/update tokens (via edge function)
-- No direct user access - all operations go through edge function

-- Create index for token lookups
CREATE INDEX idx_cross_app_tokens_token ON public.cross_app_tokens(token);
CREATE INDEX idx_cross_app_tokens_user_id ON public.cross_app_tokens(user_id);

-- Migrate existing Nello One users to user_app_registrations
-- This registers all existing profiles as Nello One users
INSERT INTO public.user_app_registrations (user_id, app_name, registered_at)
SELECT id, 'one', created_at
FROM public.profiles
ON CONFLICT (user_id, app_name) DO NOTHING;