import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Target, Lightbulb, ListTodo, MessageSquare, TrendingUp, CheckCircle2, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SEOHead } from '@/components/SEOHead';
import { FlowLayout } from '../components/FlowLayout';
import { useFlowProfile } from '../hooks/useFlowProfile';
import { useFlowData } from '../hooks/useFlowData';
import { useAuth } from '@/hooks/useAuth';
import { useEssenceProfile } from '../hooks/useEssenceProfile';
import { AdaptiveEmptyState } from '../components/AdaptiveEmptyState';
import { SparkProgressBar } from '../components/SparkProgressBar';
import { EssenceSuggestions } from '../components/EssenceSuggestions';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function FlowDashboardNew() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useFlowProfile();
  const { ideas, chosenIdea, offer, tasks, loading: dataLoading, addIdea, setIdeaAsFocus } = useFlowData();
  const essenceProfile = useEssenceProfile();
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);

  useEffect(() => {
    if (!profileLoading && profile && !profile.onboarding_completed) {
      navigate('/onboarding');
    }
  }, [profile, profileLoading, navigate]);

  const handleGenerateSuggestions = async () => {
    setIsGeneratingSuggestions(true);
    // This will trigger the EssenceSuggestions component to generate
    setTimeout(() => setIsGeneratingSuggestions(false), 100);
  };

  const handleSelectSuggestion = async (title: string, description: string) => {
    try {
      const newIdea = await addIdea(title, description);
      if (newIdea) {
        await setIdeaAsFocus(newIdea.id);
        toast.success('Ideia adicionada e definida como foco!');
      }
    } catch (error) {
      toast.error('Erro ao adicionar ideia');
    }
  };

  if (profileLoading || dataLoading) {
    return (
      <FlowLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
        </div>
      </FlowLayout>
    );
  }

  const tasksCompleted = tasks.filter(t => t.done).length;
  const tasksTotal = tasks.length;
  const progressPercent = tasksTotal > 0 ? (tasksCompleted / tasksTotal) * 100 : 0;

  // Determine FLOW step
  const getFlowStep = () => {
    if (!chosenIdea) return 'F';
    if (!offer || offer.status === 'draft') return 'L';
    if (tasksTotal === 0) return 'O';
    return 'W';
  };

  const flowStep = getFlowStep();
  const flowSteps = [
    { letter: 'F', name: 'Foco', desc: 'Escolher uma ideia', done: !!chosenIdea },
    { letter: 'L', name: 'Lapidar', desc: 'Criar sua oferta', done: offer?.status === 'active' },
    { letter: 'O', name: 'Operar', desc: 'Executar o plano', done: tasksTotal > 0 && tasksCompleted === tasksTotal },
    { letter: 'W', name: 'Watch', desc: 'Revisar e ajustar', done: false },
  ];

  return (
    <>
      <SEOHead title="Dashboard | Nello Flow" description="Seu painel de controle de foco e ação" />
      
      <FlowLayout>
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Olá{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name.split(' ')[0]}` : ''}! 👋
            </h1>
            <p className="text-slate-400">
              {profile?.monthly_goal 
                ? `Meta: R$ ${profile.monthly_goal.toLocaleString('pt-BR')} por mês`
                : 'Vamos transformar suas ideias em ação.'
              }
            </p>
          </div>

          {/* Foco da Semana - Hero Widget */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-violet-600/30 to-fuchsia-600/30 border border-violet-500/40">
            <div className="flex items-center gap-2 text-violet-300 text-sm font-medium mb-3">
              <Target className="w-4 h-4" />
              Foco da Semana
            </div>
            {chosenIdea ? (
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">{chosenIdea.title}</h2>
                {chosenIdea.description && (
                  <p className="text-slate-300">{chosenIdea.description}</p>
                )}
                <Link to="/plano" className="inline-block mt-4">
                  <Button variant="outline" size="sm" className="border-violet-500/50 text-violet-300 hover:bg-violet-500/20">
                    Ver Plano de Ação
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            ) : (
              <AdaptiveEmptyState 
                onGenerateSuggestions={handleGenerateSuggestions}
                isGenerating={isGeneratingSuggestions}
              />
            )}
          </div>

          {/* FLOW Method Progress */}
          <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50">
            <h2 className="text-lg font-semibold text-white mb-4">Método FLOW</h2>
            <div className="grid grid-cols-4 gap-4">
              {flowSteps.map((step, i) => (
                <div 
                  key={step.letter}
                  className={`p-4 rounded-xl border transition-all ${
                    flowStep === step.letter 
                      ? 'bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border-violet-500/50'
                      : step.done
                        ? 'bg-green-500/10 border-green-500/30'
                        : 'bg-slate-900/50 border-slate-700'
                  }`}
                >
                  <div className={`text-3xl font-bold mb-1 ${
                    step.done ? 'text-green-400' : flowStep === step.letter ? 'text-violet-400' : 'text-slate-600'
                  }`}>
                    {step.done ? <CheckCircle2 className="w-8 h-8" /> : step.letter}
                  </div>
                  <div className="text-sm font-medium text-white">{step.name}</div>
                  <div className="text-xs text-slate-500">{step.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Focus Card */}
            <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-violet-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Foco Atual</h3>
              </div>
              {chosenIdea ? (
                <div>
                  <p className="text-white font-medium mb-2">{chosenIdea.title}</p>
                  {chosenIdea.description && (
                    <p className="text-sm text-slate-400">{chosenIdea.description}</p>
                  )}
                </div>
              ) : (
                <div>
                  <p className="text-slate-400 mb-4">Nenhum foco definido ainda</p>
                  <Link to="/ideias">
                    <Button size="sm" className="bg-violet-500 hover:bg-violet-600">
                      Escolher Foco
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Ideas Card */}
            <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-fuchsia-500/10 flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-fuchsia-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Ideias</h3>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{ideas.length}</div>
              <p className="text-sm text-slate-400 mb-4">ideias registradas</p>
              <Link to="/ideias">
                <Button variant="outline" size="sm" className="border-slate-700 text-slate-300">
                  Ver todas
                </Button>
              </Link>
            </div>

            {/* Weekly Progress Card */}
            <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <ListTodo className="w-5 h-5 text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Plano da Semana</h3>
              </div>
              <SparkProgressBar 
                value={tasksCompleted} 
                max={tasksTotal} 
                showSpark={tasksTotal > 0}
              />
              <Link to="/plano">
                <Button variant="outline" size="sm" className="border-slate-700 text-slate-300">
                  {tasksTotal === 0 ? 'Criar tarefas' : 'Ver plano'}
                </Button>
              </Link>
            </div>

            {/* Offer Card */}
            <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-amber-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Minha Oferta</h3>
              </div>
              {offer ? (
                <div>
                  <p className="text-white mb-1">{offer.format || 'Em desenvolvimento'}</p>
                  {offer.price_suggested && (
                    <p className="text-sm text-slate-400">R$ {offer.price_suggested}</p>
                  )}
                  <div className={`inline-flex px-2 py-1 rounded text-xs mt-2 ${
                    offer.status === 'active' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {offer.status === 'active' ? 'Ativa' : 'Rascunho'}
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-slate-400 mb-4">Nenhuma oferta criada</p>
                  <Link to="/oferta">
                    <Button size="sm" variant="outline" className="border-slate-700 text-slate-300">
                      Criar Oferta
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mentor CTA */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/30 md:col-span-2 lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-violet-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Conversar com Nello</h3>
              </div>
              <p className="text-slate-300 mb-4">
                Seu mentor digital para clarear ideias, estruturar sua oferta ou planejar sua semana. Pé no chão, focado em resultados.
              </p>
              <Link to="/mentor">
                <Button className="bg-violet-500 hover:bg-violet-600">
                  Falar com Nello
                  <MessageSquare className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </FlowLayout>
    </>
  );
}
