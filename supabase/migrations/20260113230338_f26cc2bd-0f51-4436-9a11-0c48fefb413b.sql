-- =====================================================
-- CORREÇÃO 1: RLS POLICIES PARA hiring_assessments
-- Remover políticas "always true" e criar políticas seguras
-- =====================================================

-- Remover políticas existentes permissivas
DROP POLICY IF EXISTS "Anyone can create assessments" ON public.hiring_assessments;
DROP POLICY IF EXISTS "Anyone can update assessments" ON public.hiring_assessments;
DROP POLICY IF EXISTS "Public can view assessments" ON public.hiring_assessments;

-- Criar política de INSERT segura:
-- 1. Candidato pode criar via token de candidatura válido (verificado via candidate_id linkado)
-- 2. Company admin pode criar para candidatos da sua empresa
CREATE POLICY "Secure assessment insert"
ON public.hiring_assessments
FOR INSERT
WITH CHECK (
  -- Company admin can create assessments for their candidates
  EXISTS (
    SELECT 1 FROM public.hiring_candidates hc
    JOIN public.company_users cu ON cu.company_id = hc.company_id
    WHERE hc.id = hiring_assessments.candidate_id
    AND cu.user_id = auth.uid()
    AND cu.role IN ('company_admin', 'super_admin')
    AND cu.is_active = true
  )
  OR
  -- Anyone can create if they have a valid candidate (public flow via token)
  EXISTS (
    SELECT 1 FROM public.hiring_candidates hc
    WHERE hc.id = hiring_assessments.candidate_id
    AND hc.invite_token IS NOT NULL
    AND hc.status IN ('pending', 'assessment_sent', 'assessment_started')
  )
);

-- Criar política de UPDATE segura:
-- 1. Candidato pode atualizar seu próprio assessment
-- 2. Company admin pode atualizar assessments da sua empresa
CREATE POLICY "Secure assessment update"
ON public.hiring_assessments
FOR UPDATE
USING (
  -- Company admin can update their company's assessments
  EXISTS (
    SELECT 1 FROM public.hiring_candidates hc
    JOIN public.company_users cu ON cu.company_id = hc.company_id
    WHERE hc.id = hiring_assessments.candidate_id
    AND cu.user_id = auth.uid()
    AND cu.role IN ('company_admin', 'super_admin')
    AND cu.is_active = true
  )
  OR
  -- The candidate who started this assessment can update it
  EXISTS (
    SELECT 1 FROM public.hiring_candidates hc
    WHERE hc.id = hiring_assessments.candidate_id
    AND hc.invite_token IS NOT NULL
    AND hc.status IN ('pending', 'assessment_sent', 'assessment_started', 'completed')
  )
);

-- Criar política de SELECT segura:
-- 1. Company admin pode ver assessments da sua empresa
-- 2. Candidato pode ver seu próprio assessment via candidate_id
CREATE POLICY "Secure assessment select"
ON public.hiring_assessments
FOR SELECT
USING (
  -- Company admin can view their company's assessments
  EXISTS (
    SELECT 1 FROM public.hiring_candidates hc
    JOIN public.company_users cu ON cu.company_id = hc.company_id
    WHERE hc.id = hiring_assessments.candidate_id
    AND cu.user_id = auth.uid()
    AND cu.role IN ('company_admin', 'super_admin')
    AND cu.is_active = true
  )
  OR
  -- Global admin
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
  OR
  -- Candidate can view their own via token-based flow
  EXISTS (
    SELECT 1 FROM public.hiring_candidates hc
    WHERE hc.id = hiring_assessments.candidate_id
    AND hc.invite_token IS NOT NULL
  )
);

-- =====================================================
-- CORREÇÃO 2: RLS POLICIES PARA hiring_answers
-- =====================================================

-- Remover políticas existentes permissivas
DROP POLICY IF EXISTS "Anyone can create answers" ON public.hiring_answers;
DROP POLICY IF EXISTS "Public can view answers" ON public.hiring_answers;

-- Criar política de INSERT segura para hiring_answers
CREATE POLICY "Secure answer insert"
ON public.hiring_answers
FOR INSERT
WITH CHECK (
  -- User can insert answers for assessments they own (via candidate)
  EXISTS (
    SELECT 1 FROM public.hiring_assessments ha
    JOIN public.hiring_candidates hc ON hc.id = ha.candidate_id
    WHERE ha.id = hiring_answers.assessment_id
    AND hc.invite_token IS NOT NULL
    AND hc.status IN ('pending', 'assessment_sent', 'assessment_started')
  )
  OR
  -- Company admin can insert on behalf
  EXISTS (
    SELECT 1 FROM public.hiring_assessments ha
    JOIN public.hiring_candidates hc ON hc.id = ha.candidate_id
    JOIN public.company_users cu ON cu.company_id = hc.company_id
    WHERE ha.id = hiring_answers.assessment_id
    AND cu.user_id = auth.uid()
    AND cu.role IN ('company_admin', 'super_admin')
    AND cu.is_active = true
  )
);

-- Criar política de SELECT segura para hiring_answers
CREATE POLICY "Secure answer select"
ON public.hiring_answers
FOR SELECT
USING (
  -- Company admin can view answers from their candidates
  EXISTS (
    SELECT 1 FROM public.hiring_assessments ha
    JOIN public.hiring_candidates hc ON hc.id = ha.candidate_id
    JOIN public.company_users cu ON cu.company_id = hc.company_id
    WHERE ha.id = hiring_answers.assessment_id
    AND cu.user_id = auth.uid()
    AND cu.role IN ('company_admin', 'super_admin')
    AND cu.is_active = true
  )
  OR
  -- Global admin
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
  OR
  -- Candidate can view their own answers via token
  EXISTS (
    SELECT 1 FROM public.hiring_assessments ha
    JOIN public.hiring_candidates hc ON hc.id = ha.candidate_id
    WHERE ha.id = hiring_answers.assessment_id
    AND hc.invite_token IS NOT NULL
  )
);