
-- 1. Add 'operator' to app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'operator';

-- 2. Operator Workspaces (extends professional_profiles with operator-specific data)
CREATE TABLE public.operator_workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  professional_profile_id UUID REFERENCES public.professional_profiles(id) ON DELETE SET NULL,
  display_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  operator_status TEXT DEFAULT 'standard',
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- 3. Client-Operator Relationships
CREATE TABLE public.client_operator_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operator_id UUID NOT NULL REFERENCES public.operator_workspaces(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.professional_clients(id) ON DELETE CASCADE,
  relationship_started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  relationship_ended_at TIMESTAMPTZ,
  methodology_name TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(operator_id, client_id)
);

-- 4. Operator Methodologies
CREATE TABLE public.operator_methodologies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operator_id UUID NOT NULL REFERENCES public.operator_workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  stages JSONB DEFAULT '[]',
  meeting_frequency TEXT,
  recurring_questions JSONB DEFAULT '[]',
  rituals JSONB DEFAULT '[]',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Operator Tasks (personalized tasks for clients)
CREATE TABLE public.operator_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operator_id UUID NOT NULL REFERENCES public.operator_workspaces(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.professional_clients(id) ON DELETE CASCADE,
  relationship_id UUID REFERENCES public.client_operator_relationships(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Operator Reflections / Checkpoints
CREATE TABLE public.operator_reflections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operator_id UUID NOT NULL REFERENCES public.operator_workspaces(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.professional_clients(id) ON DELETE CASCADE,
  relationship_id UUID REFERENCES public.client_operator_relationships(id) ON DELETE SET NULL,
  reflection_type TEXT NOT NULL DEFAULT 'checkpoint' CHECK (reflection_type IN ('checkpoint', 'observation', 'insight', 'milestone')),
  title TEXT NOT NULL,
  content TEXT,
  session_id UUID REFERENCES public.client_sessions(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.operator_workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_operator_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.operator_methodologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.operator_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.operator_reflections ENABLE ROW LEVEL SECURITY;

-- RLS: operator_workspaces - operators see their own workspace
CREATE POLICY "Operators manage own workspace"
ON public.operator_workspaces FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Admins can view all workspaces
CREATE POLICY "Admins view all workspaces"
ON public.operator_workspaces FOR SELECT
TO authenticated
USING (public.is_admin_user(auth.uid()));

-- RLS: client_operator_relationships
CREATE POLICY "Operators manage own relationships"
ON public.client_operator_relationships FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.operator_workspaces
    WHERE id = client_operator_relationships.operator_id
    AND user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.operator_workspaces
    WHERE id = client_operator_relationships.operator_id
    AND user_id = auth.uid()
  )
);

-- RLS: operator_methodologies
CREATE POLICY "Operators manage own methodologies"
ON public.operator_methodologies FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.operator_workspaces
    WHERE id = operator_methodologies.operator_id
    AND user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.operator_workspaces
    WHERE id = operator_methodologies.operator_id
    AND user_id = auth.uid()
  )
);

-- RLS: operator_tasks
CREATE POLICY "Operators manage own tasks"
ON public.operator_tasks FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.operator_workspaces
    WHERE id = operator_tasks.operator_id
    AND user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.operator_workspaces
    WHERE id = operator_tasks.operator_id
    AND user_id = auth.uid()
  )
);

-- RLS: operator_reflections
CREATE POLICY "Operators manage own reflections"
ON public.operator_reflections FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.operator_workspaces
    WHERE id = operator_reflections.operator_id
    AND user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.operator_workspaces
    WHERE id = operator_reflections.operator_id
    AND user_id = auth.uid()
  )
);

-- Triggers for updated_at
CREATE TRIGGER update_operator_workspaces_updated_at
  BEFORE UPDATE ON public.operator_workspaces
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_client_operator_relationships_updated_at
  BEFORE UPDATE ON public.client_operator_relationships
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_operator_methodologies_updated_at
  BEFORE UPDATE ON public.operator_methodologies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_operator_tasks_updated_at
  BEFORE UPDATE ON public.operator_tasks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes
CREATE INDEX idx_operator_workspaces_user_id ON public.operator_workspaces(user_id);
CREATE INDEX idx_client_operator_rel_operator ON public.client_operator_relationships(operator_id);
CREATE INDEX idx_client_operator_rel_client ON public.client_operator_relationships(client_id);
CREATE INDEX idx_operator_tasks_client ON public.operator_tasks(client_id);
CREATE INDEX idx_operator_tasks_status ON public.operator_tasks(status);
CREATE INDEX idx_operator_reflections_client ON public.operator_reflections(client_id);
CREATE INDEX idx_operator_methodologies_operator ON public.operator_methodologies(operator_id);
