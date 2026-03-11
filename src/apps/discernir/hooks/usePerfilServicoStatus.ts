import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export function usePerfilServicoStatus() {
  const { user } = useAuth();
  const [isCompleted, setIsCompleted] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    supabase
      .from('discernir_circle_profiles')
      .select('status')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        setIsStarted(!!data);
        setIsCompleted(data?.status === 'completed');
        setIsLoading(false);
      });
  }, [user?.id]);

  return { isCompleted, isStarted, isLoading };
}
