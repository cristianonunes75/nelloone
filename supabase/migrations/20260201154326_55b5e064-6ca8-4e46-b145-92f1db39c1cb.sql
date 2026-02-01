-- Create table for admin notification settings
CREATE TABLE public.admin_notification_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  notify_email BOOLEAN NOT NULL DEFAULT true,
  notify_whatsapp BOOLEAN NOT NULL DEFAULT false,
  notify_push BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(admin_user_id, event_type)
);

-- Create table for admin notification contacts (where to send)
CREATE TABLE public.admin_notification_contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  email_override TEXT,
  whatsapp_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table to log all notifications sent
CREATE TABLE public.admin_notification_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  channel TEXT NOT NULL, -- 'email', 'whatsapp', 'push'
  recipient TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'sent', 'failed'
  error_message TEXT,
  payload JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_notification_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_notification_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_notification_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for settings - only admins can manage their own settings
CREATE POLICY "Admins can view own notification settings"
  ON public.admin_notification_settings
  FOR SELECT
  USING (admin_user_id = auth.uid() AND public.is_admin_user(auth.uid()));

CREATE POLICY "Admins can insert own notification settings"
  ON public.admin_notification_settings
  FOR INSERT
  WITH CHECK (admin_user_id = auth.uid() AND public.is_admin_user(auth.uid()));

CREATE POLICY "Admins can update own notification settings"
  ON public.admin_notification_settings
  FOR UPDATE
  USING (admin_user_id = auth.uid() AND public.is_admin_user(auth.uid()));

CREATE POLICY "Admins can delete own notification settings"
  ON public.admin_notification_settings
  FOR DELETE
  USING (admin_user_id = auth.uid() AND public.is_admin_user(auth.uid()));

-- RLS Policies for contacts
CREATE POLICY "Admins can view own notification contacts"
  ON public.admin_notification_contacts
  FOR SELECT
  USING (admin_user_id = auth.uid() AND public.is_admin_user(auth.uid()));

CREATE POLICY "Admins can insert own notification contacts"
  ON public.admin_notification_contacts
  FOR INSERT
  WITH CHECK (admin_user_id = auth.uid() AND public.is_admin_user(auth.uid()));

CREATE POLICY "Admins can update own notification contacts"
  ON public.admin_notification_contacts
  FOR UPDATE
  USING (admin_user_id = auth.uid() AND public.is_admin_user(auth.uid()));

-- RLS Policies for logs - admins can view all logs
CREATE POLICY "Admins can view notification logs"
  ON public.admin_notification_logs
  FOR SELECT
  USING (public.is_admin_user(auth.uid()));

-- Triggers for updated_at
CREATE TRIGGER update_admin_notification_settings_updated_at
  BEFORE UPDATE ON public.admin_notification_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_admin_notification_contacts_updated_at
  BEFORE UPDATE ON public.admin_notification_contacts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default settings for existing super_admin (if any)
-- This will be populated via the UI when admin configures preferences