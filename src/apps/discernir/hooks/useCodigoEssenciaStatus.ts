import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export function useCodigoEssenciaStatus() {
  const { user } = useAuth();
  const [hasCodigoEssencia, setHasCodigoEssencia] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    supabase
      .from('mapa_essencia')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        setHasCodigoEssencia(!!data);
        setIsLoading(false);
      });
  }, [user?.id]);

  return { hasCodigoEssencia, isLoading };
}
