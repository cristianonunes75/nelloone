import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export interface IdentityEssencialStatus {
  id: string | null;
  status: 'not_started' | 'in_progress' | 'completed';
  disc_status: 'not_started' | 'completed';
  temperamentos_status: 'not_started' | 'completed';
  estilos_conexao_status: 'not_started' | 'completed';
  has_rhythm_declaration: boolean;
  completion_source: 'reused' | 'completed' | null;
  tests_complete: {
    disc_complete: boolean;
    temperamentos_complete: boolean;
    estilos_conexao_complete: boolean;
    all_complete: boolean;
  };
}

export interface RhythmDeclaration {
  responsibilities_count: 'few' | 'moderate' | 'many' | 'too_many';
  rest_quality: 'good' | 'acceptable' | 'poor' | 'none';
  current_rhythm: 'light' | 'demanding' | 'heavy';
  guilt_when_resting: boolean;
  family_time_sufficient: boolean;
}

export function useIdentityEssencial() {
  const { user } = useAuth();
  const [status, setStatus] = useState<IdentityEssencialStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    if (!user) {
      setStatus(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Inicializar ou atualizar o Identity Essencial
      const { data, error: rpcError } = await supabase.rpc('init_identity_essencial', {
        p_user_id: user.id
      });

      if (rpcError) {
        console.error('Error initializing Identity Essencial:', rpcError);
        setError('Erro ao carregar status da jornada');
        return;
      }

      setStatus(data as unknown as IdentityEssencialStatus);
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('Erro inesperado ao carregar status');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  // Salvar declaração de ritmo
  const saveRhythmDeclaration = async (declaration: RhythmDeclaration): Promise<boolean> => {
    if (!user) return false;

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: updateError } = await supabase
        .from('identity_essencial')
        .update({
          rhythm_declaration: JSON.parse(JSON.stringify(declaration)),
          rhythm_declaration_at: new Date().toISOString(),
          status: status?.tests_complete?.all_complete ? 'completed' : 'in_progress',
          completed_at: status?.tests_complete?.all_complete ? new Date().toISOString() : null,
        } as any)
        .eq('user_id', user.id);

      if (updateError) {
        console.error('Error saving rhythm declaration:', updateError);
        return false;
      }

      await fetchStatus();
      return true;
    } catch (err) {
      console.error('Error saving rhythm declaration:', err);
      return false;
    }
  };

  // Verificar se a jornada está completa
  const isJourneyComplete = status?.status === 'completed';

  // Verificar se precisa responder mais testes
  const pendingTests = {
    disc: status?.disc_status !== 'completed',
    temperamentos: status?.temperamentos_status !== 'completed',
    estilos_conexao: status?.estilos_conexao_status !== 'completed',
  };

  // Próximo passo na jornada
  const getNextStep = (): 'disc' | 'temperamentos' | 'estilos_conexao' | 'rhythm_declaration' | 'complete' => {
    if (!status) return 'disc';
    
    if (status.disc_status !== 'completed') return 'disc';
    if (status.temperamentos_status !== 'completed') return 'temperamentos';
    if (status.estilos_conexao_status !== 'completed') return 'estilos_conexao';
    if (!status.has_rhythm_declaration) return 'rhythm_declaration';
    
    return 'complete';
  };

  return {
    status,
    isLoading,
    error,
    isJourneyComplete,
    pendingTests,
    getNextStep,
    saveRhythmDeclaration,
    refetch: fetchStatus,
  };
}
