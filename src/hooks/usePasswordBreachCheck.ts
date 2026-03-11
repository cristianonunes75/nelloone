import { useState, useCallback, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PasswordBreachCheckResult {
  isBreached: boolean | null;
  isChecking: boolean;
  breachCount: number;
  checkPassword: (password: string) => void;
  reset: () => void;
}

export function usePasswordBreachCheck(debounceMs: number = 500): PasswordBreachCheckResult {
  const [isBreached, setIsBreached] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [breachCount, setBreachCount] = useState(0);
  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const reset = useCallback(() => {
    setIsBreached(null);
    setIsChecking(false);
    setBreachCount(0);
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  const checkPassword = useCallback((password: string) => {
    // Cancel any pending request
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Reset if password is too short
    if (!password || password.length < 6) {
      setIsBreached(null);
      setIsChecking(false);
      setBreachCount(0);
      return;
    }

    setIsChecking(true);

    debounceTimeout.current = setTimeout(async () => {
      abortControllerRef.current = new AbortController();
      
      try {
        const { data, error } = await supabase.functions.invoke('check-password-breach', {
          body: { password },
        });

        if (error) {
          console.error('Error checking password breach:', error);
          setIsBreached(null);
          return;
        }

        setIsBreached(data.breached === true);
        setBreachCount(data.count || 0);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('Error checking password breach:', err);
        }
        setIsBreached(null);
      } finally {
        setIsChecking(false);
      }
    }, debounceMs);
  }, [debounceMs]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return { isBreached, isChecking, breachCount, checkPassword, reset };
}
