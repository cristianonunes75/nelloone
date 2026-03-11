import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface DiscernimentoEspiritual {
  id: string;
  apresentacao: string;
  tendencias_personalidade: string[];
  tensoes_interiores: string[];
  riscos_espirituais: string[];
  potenciais_vocacao: string[];
  perguntas_direcao: string[];
  relatorio_texto: string;
  generated_at: string;
  version: number;
}

export function useDiscernimentoEspiritual() {
  const { user } = useAuth();
  const [discernimento, setDiscernimento] = useState<DiscernimentoEspiritual | null>(null);
  const [hasCodigoEssencia, setHasCodigoEssencia] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    fetchData();
  }, [user?.id]);

  const fetchData = async () => {
    if (!user?.id) return;
    setIsLoading(true);
    try {
      // Verifica se existe mapa_essencia
      const { data: mapa } = await supabase
        .from('mapa_essencia')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      setHasCodigoEssencia(!!mapa);

      // Busca discernimento existente
      const { data } = await supabase
        .from('discernimento_espiritual')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      setDiscernimento(data as DiscernimentoEspiritual | null);
    } catch (e) {
      console.error('useDiscernimentoEspiritual error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const refresh = () => fetchData();
  // expose as async so callers can await it

  return { discernimento, hasCodigoEssencia, isLoading, refresh };
}
