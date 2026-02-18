
-- ===== HIRING ANSWERS: Remove duplicate SELECT policies =====
-- Keep "Secure answer select" (covers company_admin, super_admin, nello admin, token)
DROP POLICY IF EXISTS "Company admins can view answers" ON public.hiring_answers;
DROP POLICY IF EXISTS "Company admins can view hiring answers" ON public.hiring_answers;

-- Remove overly permissive INSERT (keep the proper one)
DROP POLICY IF EXISTS "Anyone can insert hiring answers for valid assessments" ON public.hiring_answers;

-- ===== HIRING CANDIDATES: Remove duplicate policies =====
-- Keep function-based policies, remove inline duplicates
DROP POLICY IF EXISTS "Company admins can view their candidates" ON public.hiring_candidates;
DROP POLICY IF EXISTS "Company admins can delete their candidates" ON public.hiring_candidates;
DROP POLICY IF EXISTS "Company admins can create candidates" ON public.hiring_candidates;

-- ===== HIRING ASSESSMENTS: Remove duplicate SELECT =====
-- Keep "Secure assessment select" (broader coverage)
DROP POLICY IF EXISTS "Company admins can view assessments" ON public.hiring_assessments;

-- ===== JOB APPLICATION LOGS: Remove duplicate SELECT =====
-- Keep "Company admins can view job application logs" (includes super_admin)
DROP POLICY IF EXISTS "Company admins can view application logs" ON public.job_application_logs;

-- ===== JOB APPLICATIONS: Remove duplicate ALL =====
-- Keep "Company team can manage applications" (broader coverage)
DROP POLICY IF EXISTS "Company admins can manage their applications" ON public.job_applications;
