-- Enable realtime for test_answers table to track live progress
ALTER PUBLICATION supabase_realtime ADD TABLE public.test_answers;