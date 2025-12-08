-- Add is_blocked field to profiles for user blocking feature
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_blocked boolean DEFAULT false;

-- Create app_settings table for maintenance mode and other settings
CREATE TABLE IF NOT EXISTS public.app_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  description text,
  updated_at timestamp with time zone DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read app_settings (needed for maintenance mode check)
CREATE POLICY "Anyone can view app_settings" 
ON public.app_settings 
FOR SELECT 
USING (true);

-- Only admins can manage app_settings
CREATE POLICY "Admins can manage app_settings" 
ON public.app_settings 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert default maintenance mode setting
INSERT INTO public.app_settings (key, value, description)
VALUES ('maintenance_mode', '{"enabled": false}'::jsonb, 'System maintenance mode toggle')
ON CONFLICT (key) DO NOTHING;

-- Add index for quick lookups
CREATE INDEX IF NOT EXISTS idx_app_settings_key ON public.app_settings(key);