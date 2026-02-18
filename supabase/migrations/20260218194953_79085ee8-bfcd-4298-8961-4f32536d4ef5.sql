
-- Remove the trigger since we can't configure pg_net app settings
DROP TRIGGER IF EXISTS trg_notify_hiring_complete ON public.hiring_candidates;
DROP FUNCTION IF EXISTS public.notify_hiring_assessment_complete();
