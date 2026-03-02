
-- WhatsApp Contacts
CREATE TABLE public.business_whatsapp_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  phone text NOT NULL,
  tags text[] DEFAULT '{}',
  has_consent boolean NOT NULL DEFAULT false,
  consent_given_at timestamptz,
  notes text,
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- WhatsApp Campaigns
CREATE TABLE public.business_whatsapp_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  message_template text NOT NULL,
  filter_tags text[] DEFAULT '{}',
  status text NOT NULL DEFAULT 'draft',
  total_contacts integer DEFAULT 0,
  sent_count integer DEFAULT 0,
  delivered_count integer DEFAULT 0,
  failed_count integer DEFAULT 0,
  created_by uuid NOT NULL,
  scheduled_at timestamptz,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- WhatsApp Messages (individual sends)
CREATE TABLE public.business_whatsapp_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL REFERENCES public.business_whatsapp_campaigns(id) ON DELETE CASCADE,
  contact_id uuid NOT NULL REFERENCES public.business_whatsapp_contacts(id) ON DELETE CASCADE,
  phone text NOT NULL,
  message_body text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  error_message text,
  external_id text,
  sent_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Triggers for updated_at
CREATE TRIGGER update_business_whatsapp_contacts_updated_at
  BEFORE UPDATE ON public.business_whatsapp_contacts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_business_whatsapp_campaigns_updated_at
  BEFORE UPDATE ON public.business_whatsapp_campaigns
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS
ALTER TABLE public.business_whatsapp_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_whatsapp_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_whatsapp_messages ENABLE ROW LEVEL SECURITY;

-- Contacts policies (company admin only)
CREATE POLICY "Company admins can manage whatsapp contacts"
  ON public.business_whatsapp_contacts FOR ALL
  TO authenticated
  USING (public.is_company_admin(company_id, auth.uid()))
  WITH CHECK (public.is_company_admin(company_id, auth.uid()));

-- Campaigns policies
CREATE POLICY "Company admins can manage whatsapp campaigns"
  ON public.business_whatsapp_campaigns FOR ALL
  TO authenticated
  USING (public.is_company_admin(company_id, auth.uid()))
  WITH CHECK (public.is_company_admin(company_id, auth.uid()));

-- Messages policies (via campaign -> company)
CREATE POLICY "Company admins can view whatsapp messages"
  ON public.business_whatsapp_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.business_whatsapp_campaigns c
      WHERE c.id = campaign_id
      AND public.is_company_admin(c.company_id, auth.uid())
    )
  );

CREATE POLICY "Company admins can insert whatsapp messages"
  ON public.business_whatsapp_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.business_whatsapp_campaigns c
      WHERE c.id = campaign_id
      AND public.is_company_admin(c.company_id, auth.uid())
    )
  );
