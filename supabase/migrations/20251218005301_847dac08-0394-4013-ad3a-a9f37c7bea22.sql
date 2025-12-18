-- Create testimonials table for user feedback collection
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  test_id UUID REFERENCES public.tests(id),
  test_slug TEXT,
  display_name TEXT NOT NULL,
  content TEXT NOT NULL,
  consent_given BOOLEAN NOT NULL DEFAULT true,
  status TEXT NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  reviewed_by UUID,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Users can create their own testimonials
CREATE POLICY "Users can create their own testimonials"
ON public.testimonials
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can view their own testimonials
CREATE POLICY "Users can view their own testimonials"
ON public.testimonials
FOR SELECT
USING (auth.uid() = user_id);

-- Admins can manage all testimonials
CREATE POLICY "Admins can manage testimonials"
ON public.testimonials
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_testimonials_updated_at
BEFORE UPDATE ON public.testimonials
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();