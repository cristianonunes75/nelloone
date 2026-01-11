import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ExistingUserInfo {
  exists: boolean;
  has_completed_tests: boolean;
  completed_tests_count: number;
  has_essence_code: boolean;
  first_name: string | null;
  already_in_company: boolean;
  already_invited: boolean;
}

interface EmailCheckResult {
  email: string;
  info: ExistingUserInfo | null;
  isLoading: boolean;
  error: string | null;
}

export function useExistingUserCheck(companyId: string | undefined) {
  const [checkResults, setCheckResults] = useState<Map<string, EmailCheckResult>>(new Map());
  const [isChecking, setIsChecking] = useState(false);

  const checkEmail = useCallback(async (email: string): Promise<ExistingUserInfo | null> => {
    if (!companyId || !email) return null;

    const emailLower = email.toLowerCase().trim();
    
    // Check if we already have a result for this email
    const existing = checkResults.get(emailLower);
    if (existing && !existing.isLoading && !existing.error) {
      return existing.info;
    }

    // Mark as loading
    setCheckResults(prev => new Map(prev).set(emailLower, {
      email: emailLower,
      info: null,
      isLoading: true,
      error: null,
    }));

    try {
      setIsChecking(true);
      
      const { data, error } = await supabase.functions.invoke('business-check-existing-user', {
        body: { email: emailLower, company_id: companyId },
      });

      if (error) {
        console.error('Error checking email:', error);
        setCheckResults(prev => new Map(prev).set(emailLower, {
          email: emailLower,
          info: null,
          isLoading: false,
          error: error.message,
        }));
        return null;
      }

      const info = data as ExistingUserInfo;
      
      setCheckResults(prev => new Map(prev).set(emailLower, {
        email: emailLower,
        info,
        isLoading: false,
        error: null,
      }));

      return info;
    } catch (err) {
      console.error('Error checking email:', err);
      setCheckResults(prev => new Map(prev).set(emailLower, {
        email: emailLower,
        info: null,
        isLoading: false,
        error: 'Failed to check email',
      }));
      return null;
    } finally {
      setIsChecking(false);
    }
  }, [companyId, checkResults]);

  const getResultForEmail = useCallback((email: string): EmailCheckResult | undefined => {
    return checkResults.get(email.toLowerCase().trim());
  }, [checkResults]);

  const clearResults = useCallback(() => {
    setCheckResults(new Map());
  }, []);

  return {
    checkEmail,
    getResultForEmail,
    clearResults,
    isChecking,
    checkResults,
  };
}
