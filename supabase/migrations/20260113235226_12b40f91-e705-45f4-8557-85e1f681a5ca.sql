-- ============================================
-- NELLO ONE PRAXIS - Professional Mode Tables
-- ============================================

-- 1. Professional profiles (coaches, therapists, mentors)
CREATE TABLE public.professional_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mode TEXT NOT NULL DEFAULT 'praxis', -- 'praxis' or future modes
  business_name TEXT,
  specialty TEXT, -- coaching, therapy, mentoring, consulting
  bio TEXT,
  avatar_url TEXT,
  website TEXT,
  phone TEXT,
  settings JSONB DEFAULT '{}',
  subscription_tier TEXT DEFAULT 'solo', -- solo, pro, studio, enterprise_coach
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  subscription_status TEXT DEFAULT 'trial', -- trial, active, cancelled, past_due
  trial_ends_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '14 days'),
  current_clients INTEGER DEFAULT 0,
  max_clients INTEGER DEFAULT 30,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT unique_professional_user UNIQUE(user_id)
);

-- 2. Professional clients (1:1 relationship)
CREATE TABLE public.professional_clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  professional_id UUID NOT NULL REFERENCES public.professional_profiles(id) ON DELETE CASCADE,
  client_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- linked if client has account
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  photo_url TEXT,
  notes TEXT, -- general notes about the client
  status TEXT DEFAULT 'active', -- active, paused, completed, archived
  session_rate DECIMAL(10,2), -- default rate per session
  currency TEXT DEFAULT 'BRL',
  total_sessions INTEGER DEFAULT 0,
  last_session_at TIMESTAMP WITH TIME ZONE,
  consent_given BOOLEAN DEFAULT false,
  consent_given_at TIMESTAMP WITH TIME ZONE,
  consent_text_version TEXT,
  share_reports_with_professional BOOLEAN DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. Client sessions with rich notes
CREATE TABLE public.client_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.professional_clients(id) ON DELETE CASCADE,
  professional_id UUID NOT NULL REFERENCES public.professional_profiles(id) ON DELETE CASCADE,
  
  -- Session metadata
  title TEXT NOT NULL,
  session_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  duration_minutes INTEGER DEFAULT 60,
  session_type TEXT DEFAULT 'coaching', -- coaching, mentoring, therapy, consulting, followup
  status TEXT DEFAULT 'scheduled', -- scheduled, completed, cancelled, no_show
  
  -- Rich notes (Markdown/HTML supported)
  objectives TEXT, -- session objectives
  notes TEXT, -- professional's notes
  insights TEXT, -- key insights discovered
  tasks_for_client TEXT, -- homework/tasks
  attention_points TEXT, -- things to watch
  
  -- Tags for filtering
  tags TEXT[] DEFAULT '{}', -- emocional, performance, metas, bloqueios, progresso
  
  -- AI suggestions (stored after generation)
  ai_suggestions JSONB, -- { next_steps: [], focus_points: [], follow_up_message: "" }
  ai_generated_at TIMESTAMP WITH TIME ZONE,
  
  -- Financial
  session_rate DECIMAL(10,2),
  currency TEXT DEFAULT 'BRL',
  payment_status TEXT DEFAULT 'pending', -- pending, paid, waived
  paid_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 4. Client milestones/timeline events
CREATE TABLE public.client_milestones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.professional_clients(id) ON DELETE CASCADE,
  professional_id UUID NOT NULL REFERENCES public.professional_profiles(id) ON DELETE CASCADE,
  
  title TEXT NOT NULL,
  description TEXT,
  milestone_type TEXT DEFAULT 'achievement', -- achievement, breakthrough, goal_completed, test_completed, phase_change
  milestone_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  related_session_id UUID REFERENCES public.client_sessions(id) ON DELETE SET NULL,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 5. Professional financial records (summary)
CREATE TABLE public.professional_financial_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  professional_id UUID NOT NULL REFERENCES public.professional_profiles(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.professional_clients(id) ON DELETE SET NULL,
  session_id UUID REFERENCES public.client_sessions(id) ON DELETE SET NULL,
  
  record_type TEXT NOT NULL, -- session_payment, package, refund, other
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'BRL',
  status TEXT DEFAULT 'pending', -- pending, paid, overdue, cancelled
  due_date DATE,
  paid_at TIMESTAMP WITH TIME ZONE,
  
  description TEXT,
  invoice_number TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 6. Session packages (for clients who buy bundles)
CREATE TABLE public.client_session_packages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.professional_clients(id) ON DELETE CASCADE,
  professional_id UUID NOT NULL REFERENCES public.professional_profiles(id) ON DELETE CASCADE,
  
  package_name TEXT NOT NULL, -- e.g., "Pacote 10 Sessões"
  total_sessions INTEGER NOT NULL,
  sessions_used INTEGER DEFAULT 0,
  price_total DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'BRL',
  payment_status TEXT DEFAULT 'pending', -- pending, paid, partial
  
  starts_at DATE,
  expires_at DATE,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.professional_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_financial_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_session_packages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for professional_profiles
CREATE POLICY "Users can view their own professional profile"
  ON public.professional_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own professional profile"
  ON public.professional_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own professional profile"
  ON public.professional_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for professional_clients
CREATE POLICY "Professionals can view their own clients"
  ON public.professional_clients FOR SELECT
  USING (professional_id IN (SELECT id FROM public.professional_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Professionals can create clients"
  ON public.professional_clients FOR INSERT
  WITH CHECK (professional_id IN (SELECT id FROM public.professional_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Professionals can update their clients"
  ON public.professional_clients FOR UPDATE
  USING (professional_id IN (SELECT id FROM public.professional_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Professionals can delete their clients"
  ON public.professional_clients FOR DELETE
  USING (professional_id IN (SELECT id FROM public.professional_profiles WHERE user_id = auth.uid()));

-- RLS Policies for client_sessions
CREATE POLICY "Professionals can view their sessions"
  ON public.client_sessions FOR SELECT
  USING (professional_id IN (SELECT id FROM public.professional_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Professionals can create sessions"
  ON public.client_sessions FOR INSERT
  WITH CHECK (professional_id IN (SELECT id FROM public.professional_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Professionals can update their sessions"
  ON public.client_sessions FOR UPDATE
  USING (professional_id IN (SELECT id FROM public.professional_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Professionals can delete their sessions"
  ON public.client_sessions FOR DELETE
  USING (professional_id IN (SELECT id FROM public.professional_profiles WHERE user_id = auth.uid()));

-- RLS Policies for client_milestones
CREATE POLICY "Professionals can view their client milestones"
  ON public.client_milestones FOR SELECT
  USING (professional_id IN (SELECT id FROM public.professional_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Professionals can create client milestones"
  ON public.client_milestones FOR INSERT
  WITH CHECK (professional_id IN (SELECT id FROM public.professional_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Professionals can update their client milestones"
  ON public.client_milestones FOR UPDATE
  USING (professional_id IN (SELECT id FROM public.professional_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Professionals can delete their client milestones"
  ON public.client_milestones FOR DELETE
  USING (professional_id IN (SELECT id FROM public.professional_profiles WHERE user_id = auth.uid()));

-- RLS Policies for financial records
CREATE POLICY "Professionals can view their financial records"
  ON public.professional_financial_records FOR SELECT
  USING (professional_id IN (SELECT id FROM public.professional_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Professionals can create financial records"
  ON public.professional_financial_records FOR INSERT
  WITH CHECK (professional_id IN (SELECT id FROM public.professional_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Professionals can update their financial records"
  ON public.professional_financial_records FOR UPDATE
  USING (professional_id IN (SELECT id FROM public.professional_profiles WHERE user_id = auth.uid()));

-- RLS Policies for session packages
CREATE POLICY "Professionals can view their session packages"
  ON public.client_session_packages FOR SELECT
  USING (professional_id IN (SELECT id FROM public.professional_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Professionals can create session packages"
  ON public.client_session_packages FOR INSERT
  WITH CHECK (professional_id IN (SELECT id FROM public.professional_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Professionals can update their session packages"
  ON public.client_session_packages FOR UPDATE
  USING (professional_id IN (SELECT id FROM public.professional_profiles WHERE user_id = auth.uid()));

-- Indexes for performance
CREATE INDEX idx_professional_profiles_user ON public.professional_profiles(user_id);
CREATE INDEX idx_professional_clients_professional ON public.professional_clients(professional_id);
CREATE INDEX idx_professional_clients_status ON public.professional_clients(status);
CREATE INDEX idx_client_sessions_client ON public.client_sessions(client_id);
CREATE INDEX idx_client_sessions_professional ON public.client_sessions(professional_id);
CREATE INDEX idx_client_sessions_date ON public.client_sessions(session_date);
CREATE INDEX idx_client_sessions_status ON public.client_sessions(status);
CREATE INDEX idx_client_milestones_client ON public.client_milestones(client_id);
CREATE INDEX idx_financial_records_professional ON public.professional_financial_records(professional_id);
CREATE INDEX idx_session_packages_client ON public.client_session_packages(client_id);

-- Trigger for updating timestamps
CREATE TRIGGER update_professional_profiles_updated_at
  BEFORE UPDATE ON public.professional_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_professional_clients_updated_at
  BEFORE UPDATE ON public.professional_clients
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_client_sessions_updated_at
  BEFORE UPDATE ON public.client_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_financial_records_updated_at
  BEFORE UPDATE ON public.professional_financial_records
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_session_packages_updated_at
  BEFORE UPDATE ON public.client_session_packages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();