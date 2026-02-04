import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useDiscernirAuth } from '../contexts/DiscernirAuthContext';
import { useIdentityEssencial } from '../hooks/useIdentityEssencial';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import {
  PersonalSpaceCard,
  PhotoUploadWithConsent,
  FunctionalCards,
  PersonalSpaceFooter
} from '../components/EspacoPessoal';

type PastoralStatus = 'em_escuta' | 'aguardando_conversa' | 'caminho_concluido';

export function DiscernirDashboard() {
  const { user } = useAuth();
  const { 
    couple, 
    hasIndividualConsent, 
    hasConjugalConsent, 
    hasPriestAccessConsent,
    isLoading: authLoading 
  } = useDiscernirAuth();
  const { status: essencialStatus, isLoading: essencialLoading, isJourneyComplete } = useIdentityEssencial();

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [parishName, setParishName] = useState<string | null>(null);
  const [isLoadingParish, setIsLoadingParish] = useState(true);

  const userName = user?.user_metadata?.full_name || 'Peregrino';
  const userId = user?.id;

  // Fetch user profile for avatar
  useEffect(() => {
    async function fetchProfile() {
      if (!userId) return;
      
      const { data } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', userId)
        .single();
      
      if (data?.avatar_url) {
        setAvatarUrl(data.avatar_url);
      }
    }
    
    fetchProfile();
  }, [userId]);

  // Fetch parish name if user is part of a couple
  useEffect(() => {
    async function fetchParish() {
      if (!couple?.parish_id) {
        setIsLoadingParish(false);
        return;
      }
      
      const { data } = await supabase
        .from('discernir_parishes')
        .select('name, city')
        .eq('id', couple.parish_id)
        .single();
      
      if (data) {
        setParishName(data.city ? `${data.name} - ${data.city}` : data.name);
      }
      setIsLoadingParish(false);
    }
    
    fetchParish();
  }, [couple?.parish_id]);

  // Calculate Identity Essencial progress
  const calculateEssencialProgress = () => {
    if (!essencialStatus) return 0;
    let completed = 0;
    if (essencialStatus.disc_status === 'completed') completed++;
    if (essencialStatus.temperamentos_status === 'completed') completed++;
    if (essencialStatus.estilos_conexao_status === 'completed') completed++;
    if (essencialStatus.has_rhythm_declaration) completed++;
    return (completed / 4) * 100;
  };

  // Determine pastoral status based on journey and consent state
  const determinePastoralStatus = (): PastoralStatus => {
    if (isJourneyComplete && hasIndividualConsent && hasPriestAccessConsent) {
      return 'caminho_concluido';
    }
    if (hasIndividualConsent) {
      return 'em_escuta';
    }
    return 'aguardando_conversa';
  };

  const handleAvatarChange = (newUrl: string | null) => {
    setAvatarUrl(newUrl);
  };

  if (authLoading || isLoadingParish) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/60 via-orange-50/30 to-amber-50/40">
      <div className="max-w-xl mx-auto px-4 py-8 space-y-8">
        {/* Header - Espaço Pessoal */}
        <div className="text-center space-y-1">
          <h1 className="font-serif text-2xl font-semibold text-amber-900">
            Espaço Pessoal
          </h1>
          <p className="text-sm text-amber-700/70">
            Sua área reservada de acompanhamento pastoral
          </p>
        </div>

        {/* Personal Card with Photo */}
        <div className="space-y-6">
          <PersonalSpaceCard
            fullName={userName}
            avatarUrl={avatarUrl}
            parishName={parishName}
            pastoralStatus={determinePastoralStatus()}
          />

          {/* Photo Upload Section */}
          {userId && (
            <div className="flex justify-center">
              <PhotoUploadWithConsent
                userId={userId}
                currentAvatarUrl={avatarUrl}
                fullName={userName}
                onAvatarChange={handleAvatarChange}
              />
            </div>
          )}
        </div>

        {/* Functional Cards */}
        <FunctionalCards
          hasIndividualConsent={hasIndividualConsent}
          isJourneyComplete={isJourneyComplete}
          essencialLoading={essencialLoading}
          essencialProgress={calculateEssencialProgress()}
          essencialCompletionSource={essencialStatus?.completion_source}
          hasConjugalConsent={hasConjugalConsent}
          hasPriestAccessConsent={hasPriestAccessConsent}
        />

        {/* LGPD Footer */}
        <PersonalSpaceFooter />
      </div>
    </div>
  );
}
