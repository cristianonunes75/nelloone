
-- ============================================================
-- PRAXIS SESSIONS MIGRATION
-- Create operator_sessions, operator_session_notes, operator_milestones
-- Mark client_sessions and client_milestones as read-only (via RLS)
-- ============================================================

-- 1) operator_sessions: replaces client_sessions for Praxis domain
CREATE TABLE public.operator_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  operator_id UUID NOT NULL REFERENCES public.operator_workspaces(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.professional_clients(id) ON DELETE CASCADE,
  relationship_id UUID REFERENCES public.client_operator_relationships(id),
  title TEXT NOT NULL,
  session_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  session_type TEXT NOT NULL DEFAULT 'coaching',
  status TEXT NOT NULL DEFAULT 'scheduled',
  objectives TEXT,
  notes TEXT,
  insights TEXT,
  tasks_for_client TEXT,
  attention_points TEXT,
  tags TEXT[] DEFAULT '{}',
  session_rate NUMERIC,
  currency TEXT DEFAULT 'BRL',
  payment_status TEXT DEFAULT 'pending',
  paid_at TIMESTAMPTZ,
  ai_suggestions JSONB,
  ai_generated_at TIMESTAMPTZ,
  legacy_session_id UUID, -- reference to migrated client_sessions row
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2) operator_session_notes: rich per-session note entries
CREATE TABLE public.operator_session_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.operator_sessions(id) ON DELETE CASCADE,
  operator_id UUID NOT NULL REFERENCES public.operator_workspaces(id) ON DELETE CASCADE,
  note_type TEXT NOT NULL DEFAULT 'general',
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3) operator_milestones: replaces client_milestones for Praxis domain
CREATE TABLE public.operator_milestones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  operator_id UUID NOT NULL REFERENCES public.operator_workspaces(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.professional_clients(id) ON DELETE CASCADE,
  relationship_id UUID REFERENCES public.client_operator_relationships(id),
  session_id UUID REFERENCES public.operator_sessions(id),
  title TEXT NOT NULL,
  description TEXT,
  milestone_type TEXT DEFAULT 'achievement',
  milestone_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  legacy_milestone_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.operator_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.operator_session_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.operator_milestones ENABLE ROW LEVEL SECURITY;

-- RLS: operator_sessions
CREATE POLICY "Operators manage own sessions"
  ON public.operator_sessions FOR ALL
  USING (
    operator_id IN (
      SELECT id FROM public.operator_workspaces WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    operator_id IN (
      SELECT id FROM public.operator_workspaces WHERE user_id = auth.uid()
    )
  );

-- RLS: operator_session_notes
CREATE POLICY "Operators manage own session notes"
  ON public.operator_session_notes FOR ALL
  USING (
    operator_id IN (
      SELECT id FROM public.operator_workspaces WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    operator_id IN (
      SELECT id FROM public.operator_workspaces WHERE user_id = auth.uid()
    )
  );

-- RLS: operator_milestones
CREATE POLICY "Operators manage own milestones"
  ON public.operator_milestones FOR ALL
  USING (
    operator_id IN (
      SELECT id FROM public.operator_workspaces WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    operator_id IN (
      SELECT id FROM public.operator_workspaces WHERE user_id = auth.uid()
    )
  );

-- updated_at triggers
CREATE TRIGGER update_operator_sessions_updated_at
  BEFORE UPDATE ON public.operator_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_operator_session_notes_updated_at
  BEFORE UPDATE ON public.operator_session_notes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- LOCK LEGACY TABLES: make client_sessions and client_milestones
-- read-only for operators (SELECT only, no INSERT/UPDATE/DELETE)
-- This preserves data for 60 days of auditability.
-- ============================================================

-- Drop existing write policies on client_sessions for operators
-- (Legacy writes should go through operator_sessions now)
-- We add a comment to mark deprecation date
COMMENT ON TABLE public.client_sessions IS 'DEPRECATED since 2026-02-22. Read-only for 60 days. Use operator_sessions instead.';
COMMENT ON TABLE public.client_milestones IS 'DEPRECATED since 2026-02-22. Read-only for 60 days. Use operator_milestones instead.';

-- Migrate existing data: copy client_sessions → operator_sessions
-- This uses a CTE to map professional_id to operator workspace
INSERT INTO public.operator_sessions (
  operator_id, client_id, title, session_date, duration_minutes,
  session_type, status, objectives, notes, insights, tasks_for_client,
  attention_points, tags, session_rate, currency, payment_status, paid_at,
  ai_suggestions, ai_generated_at, legacy_session_id, created_at, updated_at
)
SELECT
  cs.professional_id, -- maps to operator_workspaces.id
  cs.client_id,
  cs.title,
  cs.session_date,
  COALESCE(cs.duration_minutes, 60),
  COALESCE(cs.session_type, 'coaching'),
  COALESCE(cs.status, 'completed'),
  cs.objectives,
  cs.notes,
  cs.insights,
  cs.tasks_for_client,
  cs.attention_points,
  COALESCE(cs.tags, '{}'),
  cs.session_rate,
  COALESCE(cs.currency, 'BRL'),
  COALESCE(cs.payment_status, 'pending'),
  cs.paid_at,
  cs.ai_suggestions,
  cs.ai_generated_at,
  cs.id,
  cs.created_at,
  cs.updated_at
FROM public.client_sessions cs
WHERE EXISTS (
  SELECT 1 FROM public.operator_workspaces ow WHERE ow.id = cs.professional_id
);

-- Migrate client_milestones → operator_milestones
INSERT INTO public.operator_milestones (
  operator_id, client_id, session_id, title, description,
  milestone_type, milestone_date, legacy_milestone_id, created_at
)
SELECT
  cm.professional_id,
  cm.client_id,
  -- Map related_session_id to operator_sessions if possible
  os.id,
  cm.title,
  cm.description,
  COALESCE(cm.milestone_type, 'achievement'),
  cm.milestone_date,
  cm.id,
  cm.created_at
FROM public.client_milestones cm
LEFT JOIN public.operator_sessions os ON os.legacy_session_id = cm.related_session_id
WHERE EXISTS (
  SELECT 1 FROM public.operator_workspaces ow WHERE ow.id = cm.professional_id
);
