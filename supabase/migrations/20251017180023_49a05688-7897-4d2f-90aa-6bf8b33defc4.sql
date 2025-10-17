-- Create photo_sessions table for scheduling
CREATE TABLE public.photo_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  photographer_id UUID,
  scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  location TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.photo_sessions ENABLE ROW LEVEL SECURITY;

-- Policies for photo_sessions
CREATE POLICY "Users can view their own sessions"
ON public.photo_sessions
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sessions"
ON public.photo_sessions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions"
ON public.photo_sessions
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Photographers can view assigned sessions"
ON public.photo_sessions
FOR SELECT
USING (
  auth.uid() = photographer_id OR 
  has_role(auth.uid(), 'fotografo')
);

CREATE POLICY "Photographers can update assigned sessions"
ON public.photo_sessions
FOR UPDATE
USING (
  auth.uid() = photographer_id OR 
  has_role(auth.uid(), 'fotografo')
);

CREATE POLICY "Admins can manage all sessions"
ON public.photo_sessions
FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE TRIGGER update_photo_sessions_updated_at
BEFORE UPDATE ON public.photo_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();