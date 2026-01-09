-- Create engagement_campaigns table for campaign history
CREATE TABLE public.engagement_campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  objective TEXT NOT NULL,
  coupon_id UUID REFERENCES public.coupons(id),
  coupon_code TEXT,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  cta TEXT,
  whatsapp_version TEXT,
  recipients_count INTEGER NOT NULL DEFAULT 0,
  sent_count INTEGER NOT NULL DEFAULT 0,
  failed_count INTEGER NOT NULL DEFAULT 0,
  opened_count INTEGER NOT NULL DEFAULT 0,
  clicked_count INTEGER NOT NULL DEFAULT 0,
  converted_count INTEGER NOT NULL DEFAULT 0,
  recipient_ids UUID[] DEFAULT '{}',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.engagement_campaigns ENABLE ROW LEVEL SECURITY;

-- Only admins can manage campaigns
CREATE POLICY "Admins can manage engagement campaigns"
ON public.engagement_campaigns
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Create index for faster queries
CREATE INDEX idx_engagement_campaigns_created_at ON public.engagement_campaigns(created_at DESC);

COMMENT ON TABLE public.engagement_campaigns IS 'Stores history of engagement campaigns sent to users';