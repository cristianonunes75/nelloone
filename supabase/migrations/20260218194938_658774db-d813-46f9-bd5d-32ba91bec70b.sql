
-- Create a trigger function that fires when hiring_candidates status changes to 'completed'
-- Uses pg_net to call the edge function asynchronously
CREATE OR REPLACE FUNCTION public.notify_hiring_assessment_complete()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Only fire when status changes TO 'completed'
  IF NEW.status = 'completed' AND (OLD.status IS DISTINCT FROM 'completed') THEN
    PERFORM net.http_post(
      url := current_setting('app.settings.supabase_url', true) || '/functions/v1/business-assessment-complete-notify',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.settings.supabase_anon_key', true)
      ),
      body := jsonb_build_object('candidateId', NEW.id)
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Create the trigger on hiring_candidates
DROP TRIGGER IF EXISTS trg_notify_hiring_complete ON public.hiring_candidates;
CREATE TRIGGER trg_notify_hiring_complete
  AFTER UPDATE ON public.hiring_candidates
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_hiring_assessment_complete();
