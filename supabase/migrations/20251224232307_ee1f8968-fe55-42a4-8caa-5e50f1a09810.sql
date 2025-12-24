-- Nello Flow Database Schema

-- Flow Profiles (extends auth.users)
CREATE TABLE public.flow_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  monthly_goal NUMERIC DEFAULT 0,
  weekly_time_available TEXT,
  feels_dispersed BOOLEAN DEFAULT false,
  has_tdah TEXT DEFAULT 'not_answered',
  onboarding_completed BOOLEAN DEFAULT false,
  onboarding_step INTEGER DEFAULT 1,
  what_brought_you TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Flow Ideas
CREATE TABLE public.flow_ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'backlog' CHECK (status IN ('backlog', 'chosen', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Flow Focus (current focus for user)
CREATE TABLE public.flow_focus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  idea_id UUID REFERENCES public.flow_ideas(id) ON DELETE SET NULL,
  goal_description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Flow Offers
CREATE TABLE public.flow_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  idea_id UUID REFERENCES public.flow_ideas(id) ON DELETE SET NULL,
  audience TEXT,
  problem TEXT,
  promise TEXT,
  format TEXT,
  price_suggested NUMERIC,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Flow Tasks (weekly action plan)
CREATE TABLE public.flow_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  description TEXT NOT NULL,
  week_ref TEXT NOT NULL,
  done BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Flow Check-ins (weekly review)
CREATE TABLE public.flow_checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  week_ref TEXT NOT NULL,
  what_worked TEXT,
  what_not TEXT,
  adjustments TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Flow Chats (AI mentor conversations)
CREATE TABLE public.flow_chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Flow Subscriptions (track subscription status)
CREATE TABLE public.flow_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  status TEXT DEFAULT 'inactive' CHECK (status IN ('inactive', 'active', 'cancelled', 'past_due')),
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.flow_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flow_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flow_focus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flow_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flow_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flow_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flow_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flow_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for flow_profiles
CREATE POLICY "Users can view own profile" ON public.flow_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.flow_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.flow_profiles FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for flow_ideas
CREATE POLICY "Users can view own ideas" ON public.flow_ideas FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own ideas" ON public.flow_ideas FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own ideas" ON public.flow_ideas FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own ideas" ON public.flow_ideas FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for flow_focus
CREATE POLICY "Users can view own focus" ON public.flow_focus FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own focus" ON public.flow_focus FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own focus" ON public.flow_focus FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for flow_offers
CREATE POLICY "Users can view own offers" ON public.flow_offers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own offers" ON public.flow_offers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own offers" ON public.flow_offers FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for flow_tasks
CREATE POLICY "Users can view own tasks" ON public.flow_tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tasks" ON public.flow_tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tasks" ON public.flow_tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own tasks" ON public.flow_tasks FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for flow_checkins
CREATE POLICY "Users can view own checkins" ON public.flow_checkins FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own checkins" ON public.flow_checkins FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own checkins" ON public.flow_checkins FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for flow_chats
CREATE POLICY "Users can view own chats" ON public.flow_chats FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own chats" ON public.flow_chats FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for flow_subscriptions
CREATE POLICY "Users can view own subscription" ON public.flow_subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own subscription" ON public.flow_subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own subscription" ON public.flow_subscriptions FOR UPDATE USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_flow_profiles_updated_at BEFORE UPDATE ON public.flow_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_flow_ideas_updated_at BEFORE UPDATE ON public.flow_ideas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_flow_offers_updated_at BEFORE UPDATE ON public.flow_offers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_flow_subscriptions_updated_at BEFORE UPDATE ON public.flow_subscriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();