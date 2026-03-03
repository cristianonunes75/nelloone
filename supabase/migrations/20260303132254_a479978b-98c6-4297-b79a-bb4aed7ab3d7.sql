
-- Re-create triggers for automatic score recalculation
-- These functions exist but triggers were not persisted

CREATE OR REPLACE TRIGGER trigger_recalculate_enps_score
  AFTER INSERT OR UPDATE OR DELETE ON public.company_enps_responses
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_recalculate_enps();

CREATE OR REPLACE TRIGGER trigger_recalculate_climate_scores
  AFTER INSERT OR UPDATE OR DELETE ON public.company_climate_responses
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_recalculate_climate();

-- Add CHECK constraints for score validation
ALTER TABLE public.company_enps_responses
  ADD CONSTRAINT chk_enps_score_range CHECK (score >= 0 AND score <= 10);

ALTER TABLE public.company_climate_responses
  ADD CONSTRAINT chk_climate_score_range CHECK (score >= 1 AND score <= 5);
