import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useDiscernirAuth } from '../contexts/DiscernirAuthContext';
import { useIdentityEssencial } from '../hooks/useIdentityEssencial';
import { useDiscernirPilotMode } from '../hooks/useDiscernirPilotMode';
import { useDiscernimentoEspiritual } from '../hooks/useDiscernimentoEspiritual';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Church, ArrowRight, Cross } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  const isPilotMode = useDiscernirPilotMode();
  const { hasCodigoEssencia, discernimento } = useDiscernimentoEspiritual();

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
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // PILOT MODE: simplified dashboard
  if (isPilotMode) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50/60 via-orange-50/30 to-background">
        <div className="max-w-xl mx-auto px-4 py-8 space-y-8">
          <div className="text-center space-y-2">
            <h1 className="font-serif text-2xl font-semibold text-foreground">
              Bem-vindo, {userName}
            </h1>
            <p className="text-sm text-muted-foreground">
              Versão piloto — Perfil de Serviço
            </p>
          </div>

          <Card className="border-amber-200/50 bg-card overflow-hidden">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-amber-100 p-3">
                  <Church className="h-6 w-6 text-amber-700" />
                </div>
                <div>
                  <h2 className="font-serif text-lg font-semibold text-foreground">
                    Perfil de Serviço
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Questionário pastoral para padrinhos de círculo
                  </p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                Descubra seu perfil de serviço no círculo através de 44 perguntas
                sobre liderança, acolhimento, comunicação, trabalho em equipe,
                espiritualidade e energia de condução. Este instrumento ajuda a
                identificar como você pode servir melhor no seu grupo.
              </p>

              <div className="rounded-lg bg-muted/50 border border-border p-3">
                <p className="text-xs text-muted-foreground italic">
                  Este é um piloto pastoral. Os demais módulos do DISCERNIR
                  serão disponibilizados em breve.
                </p>
              </div>

              <Link to="/perfil-servico" className="block">
                <Button className="w-full gap-2">
                  Iniciar questionário
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Card Discernimento Espiritual — modo piloto */}
          {hasCodigoEssencia && (
            <Card className="border-amber-300/50 bg-gradient-to-br from-amber-50/80 to-orange-50/40">
              <CardContent className="p-8 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-amber-100 p-3">
                    <Cross className="h-6 w-6 text-amber-700" />
                  </div>
                  <div>
                    <h2 className="font-serif text-lg font-semibold text-foreground">
                      Discernimento Espiritual
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Guia pessoal para direção espiritual
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {discernimento
                    ? 'Seu Perfil de Discernimento Espiritual está pronto. Leve-o para sua próxima direção espiritual.'
                    : 'Gere um resumo espiritual baseado no seu Código da Essência para apoiar o discernimento da sua vocação, tensões interiores e caminhos de crescimento.'}
                </p>
                <Link to="/discernimento-espiritual" className="block">
                  <Button className="w-full gap-2 bg-amber-600 hover:bg-amber-700">
                    {discernimento ? 'Ver Perfil' : 'Gerar Discernimento Espiritual'}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          <PersonalSpaceFooter />
        </div>
      </div>
    );
  }

  // FULL MODE: original dashboard
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/60 via-orange-50/30 to-amber-50/40">
      <div className="max-w-xl mx-auto px-4 py-8 space-y-8">
        {/* Header - Espaço Pessoal */}
        <div className="text-center space-y-1">
          <h1 className="font-serif text-2xl font-semibold text-foreground">
            Espaço Pessoal
          </h1>
          <p className="text-sm text-muted-foreground">
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
          hasCodigoEssencia={hasCodigoEssencia}
          hasDiscernimento={!!discernimento}
        />

        {/* LGPD Footer */}
        <PersonalSpaceFooter />
      </div>
    </div>
  );
}
