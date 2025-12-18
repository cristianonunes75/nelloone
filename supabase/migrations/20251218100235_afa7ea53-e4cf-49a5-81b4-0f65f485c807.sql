-- Fix RLS policies for profiles table - ensure PERMISSIVE policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Recreate as PERMISSIVE policies (default, but being explicit)
CREATE POLICY "Users can view their own profile" ON public.profiles
FOR SELECT TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can update their own profile" ON public.profiles
FOR UPDATE TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Fix RLS policies for test_purchases table
DROP POLICY IF EXISTS "Users can view their own purchases" ON public.test_purchases;
DROP POLICY IF EXISTS "Admins can view all purchases" ON public.test_purchases;
DROP POLICY IF EXISTS "Admins can update purchases" ON public.test_purchases;
DROP POLICY IF EXISTS "Admins can delete purchases" ON public.test_purchases;
DROP POLICY IF EXISTS "Users can create their own purchases" ON public.test_purchases;

CREATE POLICY "Users can view their own purchases" ON public.test_purchases
FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all purchases" ON public.test_purchases
FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update purchases" ON public.test_purchases
FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete purchases" ON public.test_purchases
FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can create their own purchases" ON public.test_purchases
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Fix RLS policies for user_tests table  
DROP POLICY IF EXISTS "Users can view their own tests" ON public.user_tests;
DROP POLICY IF EXISTS "Admins can view all user tests" ON public.user_tests;
DROP POLICY IF EXISTS "Users can create their own test records" ON public.user_tests;
DROP POLICY IF EXISTS "Users can update their own tests" ON public.user_tests;
DROP POLICY IF EXISTS "Admins can delete user tests" ON public.user_tests;

CREATE POLICY "Users can view their own tests" ON public.user_tests
FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all user tests" ON public.user_tests
FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can create their own test records" ON public.user_tests
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tests" ON public.user_tests
FOR UPDATE TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can delete user tests" ON public.user_tests
FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Fix RLS policies for test_answers table
DROP POLICY IF EXISTS "Users can view their own answers" ON public.test_answers;
DROP POLICY IF EXISTS "Admins can view all answers" ON public.test_answers;
DROP POLICY IF EXISTS "Users can create their own answers" ON public.test_answers;
DROP POLICY IF EXISTS "Users can update their own answers" ON public.test_answers;
DROP POLICY IF EXISTS "Admins can delete test answers" ON public.test_answers;

CREATE POLICY "Users can view their own answers" ON public.test_answers
FOR SELECT TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.user_tests 
  WHERE user_tests.id = test_answers.user_test_id 
  AND user_tests.user_id = auth.uid()
));

CREATE POLICY "Admins can view all answers" ON public.test_answers
FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can create their own answers" ON public.test_answers
FOR INSERT TO authenticated
WITH CHECK (EXISTS (
  SELECT 1 FROM public.user_tests 
  WHERE user_tests.id = test_answers.user_test_id 
  AND user_tests.user_id = auth.uid()
));

CREATE POLICY "Users can update their own answers" ON public.test_answers
FOR UPDATE TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.user_tests 
  WHERE user_tests.id = test_answers.user_test_id 
  AND user_tests.user_id = auth.uid()
));

CREATE POLICY "Admins can delete test answers" ON public.test_answers
FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Fix RLS policies for mapa_essencia table
DROP POLICY IF EXISTS "Users can view their own mapa" ON public.mapa_essencia;
DROP POLICY IF EXISTS "Admins can view all mapas" ON public.mapa_essencia;
DROP POLICY IF EXISTS "Users can create their own mapa" ON public.mapa_essencia;
DROP POLICY IF EXISTS "Users can update their own mapa" ON public.mapa_essencia;

CREATE POLICY "Users can view their own mapa" ON public.mapa_essencia
FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all mapas" ON public.mapa_essencia
FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can create their own mapa" ON public.mapa_essencia
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own mapa" ON public.mapa_essencia
FOR UPDATE TO authenticated
USING (auth.uid() = user_id);

-- Fix RLS policies for ai_conversations table
DROP POLICY IF EXISTS "Users can manage their conversations" ON public.ai_conversations;

CREATE POLICY "Users can view their own conversations" ON public.ai_conversations
FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own conversations" ON public.ai_conversations
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own conversations" ON public.ai_conversations
FOR UPDATE TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own conversations" ON public.ai_conversations
FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- Fix RLS policies for ai_messages table
DROP POLICY IF EXISTS "Users can manage messages in their conversations" ON public.ai_messages;

CREATE POLICY "Users can view messages in their conversations" ON public.ai_messages
FOR SELECT TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.ai_conversations 
  WHERE ai_conversations.id = ai_messages.conversation_id 
  AND ai_conversations.user_id = auth.uid()
));

CREATE POLICY "Users can create messages in their conversations" ON public.ai_messages
FOR INSERT TO authenticated
WITH CHECK (EXISTS (
  SELECT 1 FROM public.ai_conversations 
  WHERE ai_conversations.id = ai_messages.conversation_id 
  AND ai_conversations.user_id = auth.uid()
));

-- Fix RLS policies for testimonials table
DROP POLICY IF EXISTS "Users can view their own testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Users can create their own testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admins can manage testimonials" ON public.testimonials;

CREATE POLICY "Users can view their own testimonials" ON public.testimonials
FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own testimonials" ON public.testimonials
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage testimonials" ON public.testimonials
FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Allow public to view approved testimonials for landing page
CREATE POLICY "Anyone can view approved testimonials" ON public.testimonials
FOR SELECT
USING (status = 'approved');

-- Fix RLS policies for affiliates table
DROP POLICY IF EXISTS "Users can view their own affiliate data" ON public.affiliates;
DROP POLICY IF EXISTS "Admins can manage affiliates" ON public.affiliates;

CREATE POLICY "Users can view their own affiliate data" ON public.affiliates
FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage affiliates" ON public.affiliates
FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Fix RLS policies for affiliate_referrals table
DROP POLICY IF EXISTS "Affiliates can view their own referrals" ON public.affiliate_referrals;
DROP POLICY IF EXISTS "Admins can manage referrals" ON public.affiliate_referrals;

CREATE POLICY "Affiliates can view their own referrals" ON public.affiliate_referrals
FOR SELECT TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.affiliates 
  WHERE affiliates.id = affiliate_referrals.affiliate_id 
  AND affiliates.user_id = auth.uid()
));

CREATE POLICY "Admins can manage referrals" ON public.affiliate_referrals
FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Fix RLS policies for impersonation_sessions table
DROP POLICY IF EXISTS "Admins can manage impersonation sessions" ON public.impersonation_sessions;

CREATE POLICY "Admins can manage impersonation sessions" ON public.impersonation_sessions
FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));