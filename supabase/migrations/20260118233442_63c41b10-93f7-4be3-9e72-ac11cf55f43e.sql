-- Create table for cross-module activity tracking (Ecosystem Memory)
CREATE TABLE public.nello_user_activity (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  app_source TEXT NOT NULL, -- 'identity', 'life', 'flow', 'business', 'praxis'
  activity_type TEXT NOT NULL, -- 'insight', 'action', 'milestone', 'chat', 'reflection'
  title TEXT NOT NULL,
  content TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.nello_user_activity ENABLE ROW LEVEL SECURITY;

-- Users can only see their own activities
CREATE POLICY "Users can view own activities" 
ON public.nello_user_activity 
FOR SELECT 
USING (auth.uid() = user_id);

-- Users can create their own activities
CREATE POLICY "Users can create own activities" 
ON public.nello_user_activity 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_nello_user_activity_user_app ON public.nello_user_activity(user_id, app_source);
CREATE INDEX idx_nello_user_activity_created ON public.nello_user_activity(user_id, created_at DESC);

-- Create view for unified user profile data (for AI context)
CREATE OR REPLACE VIEW public.nello_user_profile_summary AS
SELECT 
  p.id as user_id,
  p.full_name,
  -- Extract primary essence data from mapa_essencia
  me.sections as essence_sections,
  me.created_at as essence_created_at,
  -- Get last activities from each app
  (
    SELECT jsonb_agg(
      jsonb_build_object(
        'app_source', a.app_source,
        'activity_type', a.activity_type,
        'title', a.title,
        'content', a.content,
        'created_at', a.created_at
      ) ORDER BY a.created_at DESC
    )
    FROM (
      SELECT DISTINCT ON (app_source) *
      FROM public.nello_user_activity
      WHERE user_id = p.id
      ORDER BY app_source, created_at DESC
    ) a
  ) as last_activities
FROM public.profiles p
LEFT JOIN public.mapa_essencia me ON me.user_id = p.id;

-- Grant access to authenticated users for the view
GRANT SELECT ON public.nello_user_profile_summary TO authenticated;