-- Add unique constraint for hiring_answers to enable upsert
ALTER TABLE public.hiring_answers
ADD CONSTRAINT hiring_answers_assessment_question_unique 
UNIQUE (assessment_id, question_number);