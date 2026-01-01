-- Create table for real-time visitor tracking
CREATE TABLE public.site_visitors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL UNIQUE,
  page_path TEXT NOT NULL DEFAULT '/',
  user_agent TEXT,
  referrer TEXT,
  country TEXT,
  city TEXT,
  is_mobile BOOLEAN DEFAULT false,
  user_id UUID,
  first_seen_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_seen_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN DEFAULT true
);

-- Enable RLS
ALTER TABLE public.site_visitors ENABLE ROW LEVEL SECURITY;

-- Policies: Anyone can insert/update their own session, admins can view all
CREATE POLICY "Anyone can create visitor sessions"
ON public.site_visitors
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update their own session"
ON public.site_visitors
FOR UPDATE
USING (session_id = session_id);

CREATE POLICY "Admins can view all visitors"
ON public.site_visitors
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index for performance
CREATE INDEX idx_site_visitors_active ON public.site_visitors (is_active, last_seen_at);
CREATE INDEX idx_site_visitors_session ON public.site_visitors (session_id);

-- Enable realtime for this table
ALTER PUBLICATION supabase_realtime ADD TABLE public.site_visitors;