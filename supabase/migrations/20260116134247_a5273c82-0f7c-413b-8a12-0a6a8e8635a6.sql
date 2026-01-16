-- Migration: Rename 'one' app to 'identity' in the Nello ecosystem

-- Step 1: Update the CHECK constraint on user_app_registrations to include 'identity'
ALTER TABLE public.user_app_registrations 
DROP CONSTRAINT IF EXISTS user_app_registrations_app_name_check;

ALTER TABLE public.user_app_registrations 
ADD CONSTRAINT user_app_registrations_app_name_check 
CHECK (app_name IN ('identity', 'one', 'life', 'flow', 'business'));

-- Step 2: Update the CHECK constraint on cross_app_tokens to include 'identity'
ALTER TABLE public.cross_app_tokens 
DROP CONSTRAINT IF EXISTS cross_app_tokens_target_app_check;

ALTER TABLE public.cross_app_tokens 
ADD CONSTRAINT cross_app_tokens_target_app_check 
CHECK (target_app IN ('identity', 'one', 'life', 'flow', 'business'));

-- Step 3: Migrate existing 'one' records to 'identity' in user_app_registrations
UPDATE public.user_app_registrations 
SET app_name = 'identity' 
WHERE app_name = 'one';

-- Step 4: Migrate existing 'one' records to 'identity' in cross_app_tokens
UPDATE public.cross_app_tokens 
SET target_app = 'identity' 
WHERE target_app = 'one';