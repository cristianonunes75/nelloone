-- Create push_notifications_log table to store notification history
CREATE TABLE public.push_notifications_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    title TEXT NOT NULL,
    body TEXT,
    url TEXT,
    status TEXT DEFAULT 'sent',
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.push_notifications_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view notification logs
CREATE POLICY "Admins can view all notification logs"
ON public.push_notifications_log
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can insert notification logs (via edge function)
CREATE POLICY "Admins can insert notification logs"
ON public.push_notifications_log
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create index for faster queries
CREATE INDEX idx_push_notifications_log_created_at ON public.push_notifications_log(created_at DESC);

-- Enable realtime for support_tickets table for live updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.support_tickets;