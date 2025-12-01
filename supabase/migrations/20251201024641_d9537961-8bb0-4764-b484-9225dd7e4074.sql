-- Step 1: Add language column to tests table
ALTER TABLE public.tests ADD COLUMN language TEXT NOT NULL DEFAULT 'pt';

-- Step 2: Add language column to test_questions table
ALTER TABLE public.test_questions ADD COLUMN language TEXT NOT NULL DEFAULT 'pt';

-- Step 3: Create indexes for faster language filtering
CREATE INDEX idx_tests_language ON public.tests(language);
CREATE INDEX idx_test_questions_language ON public.test_questions(language);