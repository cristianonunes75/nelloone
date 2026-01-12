-- =====================================================
-- PROTECT AI PROMPTS - Remove public access
-- =====================================================

-- Drop public access policies from ai_prompts
DROP POLICY IF EXISTS "Anyone can view active prompts" ON public.ai_prompts;

-- Drop public access policies from ai_subprompts  
DROP POLICY IF EXISTS "Anyone can view active subprompts" ON public.ai_subprompts;

-- =====================================================
-- CREATE RATE LIMITING TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.ai_rate_limits (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  endpoint text NOT NULL,
  request_count integer NOT NULL DEFAULT 1,
  window_start timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create index for efficient lookups
CREATE INDEX IF NOT EXISTS idx_ai_rate_limits_user_endpoint 
ON public.ai_rate_limits(user_id, endpoint, window_start);

-- Enable RLS
ALTER TABLE public.ai_rate_limits ENABLE ROW LEVEL SECURITY;

-- Only allow authenticated users to manage their own rate limit records
CREATE POLICY "Users can view their own rate limits"
ON public.ai_rate_limits
FOR SELECT
USING (auth.uid() = user_id);

-- Service role will handle inserts/updates (bypasses RLS)
-- No public insert policy needed

-- =====================================================
-- GRANT AUTHENTICATED USERS ACCESS TO AI PROMPTS (read-only, via edge functions)
-- =====================================================

-- Authenticated users can view active prompts (for edge function use)
CREATE POLICY "Authenticated users can view active prompts"
ON public.ai_prompts
FOR SELECT
USING (
  auth.uid() IS NOT NULL
  AND is_active = true
);

-- Authenticated users can view active subprompts (for edge function use)
CREATE POLICY "Authenticated users can view active subprompts"
ON public.ai_subprompts
FOR SELECT
USING (
  auth.uid() IS NOT NULL
  AND is_active = true
);