-- Create function to trigger insights calculation when journey is completed
CREATE OR REPLACE FUNCTION public.trigger_business_insights_calculation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_company_id uuid;
BEGIN
  -- Only proceed if journey_status changed to 'completed'
  IF NEW.journey_status = 'completed' AND (OLD.journey_status IS NULL OR OLD.journey_status != 'completed') THEN
    
    -- Check if user belongs to a company with sharing enabled
    SELECT cu.company_id INTO v_company_id
    FROM public.company_users cu
    WHERE cu.user_id = NEW.id
      AND cu.is_active = true
      AND cu.share_report_with_company = true
    LIMIT 1;
    
    -- If user is in a company with sharing, log that insights should be recalculated
    IF v_company_id IS NOT NULL THEN
      -- Insert a record to track that insights need recalculation
      INSERT INTO public.company_audit_logs (company_id, action, details)
      VALUES (
        v_company_id, 
        'journey_completed_trigger', 
        jsonb_build_object(
          'user_id', NEW.id,
          'triggered_at', now(),
          'requires_insights_recalc', true
        )
      );
      
      -- Log for observability
      RAISE NOTICE 'Journey completed for user % in company %. Insights recalculation queued.', NEW.id, v_company_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger on profiles table
DROP TRIGGER IF EXISTS on_journey_completed_calculate_insights ON public.profiles;
CREATE TRIGGER on_journey_completed_calculate_insights
  AFTER UPDATE OF journey_status ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_business_insights_calculation();

-- Add comment for documentation
COMMENT ON FUNCTION public.trigger_business_insights_calculation() IS 'Queues insights recalculation when a user completes their journey and shares with company';