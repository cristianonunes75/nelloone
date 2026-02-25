CREATE TABLE public.filme_identidade_cache (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  script jsonb NOT NULL,
  audio_base64 text NOT NULL,
  music_base64 text,
  gender text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.filme_identidade_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own film cache"
  ON public.filme_identidade_cache
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own film cache"
  ON public.filme_identidade_cache
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own film cache"
  ON public.filme_identidade_cache
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all film caches"
  ON public.filme_identidade_cache
  FOR SELECT
  USING (public.is_admin_user(auth.uid()));