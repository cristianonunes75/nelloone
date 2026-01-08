-- Create support_tickets table
CREATE TABLE public.support_tickets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'suporte',
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'novo',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create support_replies table
CREATE TABLE public.support_replies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id UUID NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_admin BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_replies ENABLE ROW LEVEL SECURITY;

-- RLS policies for support_tickets
-- Anyone can insert (create ticket)
CREATE POLICY "Anyone can create support tickets" 
ON public.support_tickets 
FOR INSERT 
WITH CHECK (true);

-- Users can view their own tickets
CREATE POLICY "Users can view their own tickets" 
ON public.support_tickets 
FOR SELECT 
USING (auth.uid() = user_id OR auth.uid() IS NULL);

-- Admins can view all tickets
CREATE POLICY "Admins can view all tickets" 
ON public.support_tickets 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can update tickets
CREATE POLICY "Admins can update tickets" 
ON public.support_tickets 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

-- RLS policies for support_replies
-- Anyone can view replies for their tickets
CREATE POLICY "Users can view replies for their tickets" 
ON public.support_replies 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.support_tickets 
    WHERE id = ticket_id AND (user_id = auth.uid() OR auth.uid() IS NULL)
  )
);

-- Admins can view all replies
CREATE POLICY "Admins can view all replies" 
ON public.support_replies 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can insert replies
CREATE POLICY "Admins can insert replies" 
ON public.support_replies 
FOR INSERT 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create trigger for updated_at
CREATE TRIGGER update_support_tickets_updated_at
BEFORE UPDATE ON public.support_tickets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_support_tickets_status ON public.support_tickets(status);
CREATE INDEX idx_support_tickets_created_at ON public.support_tickets(created_at DESC);
CREATE INDEX idx_support_replies_ticket_id ON public.support_replies(ticket_id);