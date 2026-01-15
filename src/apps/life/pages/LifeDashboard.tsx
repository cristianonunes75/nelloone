import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, LogOut, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { SEOHead } from '@/components/SEOHead';
import { NelloAppSwitcher } from '@/components/shared/NelloAppSwitcher';
import { useUserApps } from '@/hooks/useUserApps';

export default function LifeDashboard() {
  const navigate = useNavigate();
  const { user, signOut, profile } = useAuth();
  const { hasCrossAppAccess, registerCurrentApp } = useUserApps();

  useEffect(() => {
    // Register this app when user accesses it
    registerCurrentApp();
  }, [registerCurrentApp]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <>
      <SEOHead
        title="Dashboard | Nello Life"
        description="Sua central de organização de vida e hábitos no Nello Life."
      />

      <div className="min-h-screen bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950">
        {/* Header */}
        <header className="border-b border-emerald-800/50 bg-emerald-950/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Nello Life</span>
            </div>

            <div className="flex items-center gap-3">
              {hasCrossAppAccess && (
                <NelloAppSwitcher variant="icon" className="text-emerald-300 hover:text-white hover:bg-emerald-800/50" />
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-emerald-300 hover:text-white hover:bg-emerald-800/50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 py-8">
          {/* Welcome */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Olá, {profile?.full_name?.split(' ')[0] || 'Viajante'}! 👋
            </h1>
            <p className="text-emerald-300/70">
              Bem-vindo ao Nello Life. Esta área está em desenvolvimento.
            </p>
          </div>

          {/* Coming Soon Card */}
          <div className="bg-emerald-900/30 border border-emerald-700/50 rounded-2xl p-8 text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400/20 to-teal-500/20 flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-emerald-400" />
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">
              Em Breve
            </h2>
            
            <p className="text-emerald-300/70 mb-8 max-w-md mx-auto">
              O Nello Life está sendo desenvolvido para ajudar você a organizar sua vida, 
              criar hábitos saudáveis e encontrar equilíbrio.
            </p>

            {hasCrossAppAccess && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <NelloAppSwitcher variant="full" className="bg-emerald-700/50 text-white hover:bg-emerald-600/50" />
              </div>
            )}
          </div>

          {/* Cross-app Banner */}
          {hasCrossAppAccess && (
            <div className="mt-8 bg-gradient-to-r from-violet-900/30 to-emerald-900/30 border border-violet-700/30 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-violet-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">
                    Você também tem acesso ao Nello One!
                  </h3>
                  <p className="text-violet-300/70 text-sm mb-3">
                    Continue sua jornada de autoconhecimento com testes de personalidade e relatórios detalhados.
                  </p>
                  <NelloAppSwitcher variant="full" />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
