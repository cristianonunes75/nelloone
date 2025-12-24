import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Zap, ArrowRight, ArrowLeft, Plus, X, Loader2 } from 'lucide-react';
import { SEOHead } from '@/components/SEOHead';
import { useFlowProfile } from '../hooks/useFlowProfile';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const timeOptions = [
  { value: '2h', label: '2 horas por semana' },
  { value: '4h', label: '4 horas por semana' },
  { value: '6h', label: '6 horas por semana' },
  { value: '10h+', label: '10+ horas por semana' },
];

export default function FlowOnboarding() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, createProfile, updateProfile, loading: profileLoading } = useFlowProfile();
  
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [whatBroughtYou, setWhatBroughtYou] = useState('');
  const [monthlyGoal, setMonthlyGoal] = useState('');
  const [weeklyTime, setWeeklyTime] = useState('');
  const [feelsDispersed, setFeelsDispersed] = useState<boolean | null>(null);
  const [hasTdah, setHasTdah] = useState<string | null>(null);
  const [ideas, setIdeas] = useState<string[]>(['']);

  useEffect(() => {
    if (!profileLoading && profile?.onboarding_completed) {
      navigate('/dashboard');
    }
    if (!profileLoading && profile) {
      setStep(profile.onboarding_step || 1);
    }
  }, [profile, profileLoading, navigate]);

  const totalSteps = 8;

  const addIdea = () => {
    setIdeas([...ideas, '']);
  };

  const removeIdea = (index: number) => {
    if (ideas.length > 1) {
      setIdeas(ideas.filter((_, i) => i !== index));
    }
  };

  const updateIdeaText = (index: number, text: string) => {
    const updated = [...ideas];
    updated[index] = text;
    setIdeas(updated);
  };

  const handleNext = async () => {
    if (step < totalSteps) {
      const nextStep = step + 1;
      setStep(nextStep);
      
      // Save progress
      if (profile) {
        await updateProfile({ onboarding_step: nextStep });
      } else if (user) {
        await createProfile({ onboarding_step: nextStep });
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = async () => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      // Save profile
      const profileData = {
        monthly_goal: parseFloat(monthlyGoal) || 0,
        weekly_time_available: weeklyTime,
        feels_dispersed: feelsDispersed || false,
        has_tdah: hasTdah || 'not_answered',
        what_brought_you: whatBroughtYou,
        onboarding_completed: true,
        onboarding_step: 8,
      };

      if (profile) {
        await updateProfile(profileData);
      } else {
        await createProfile(profileData);
      }

      // Save ideas
      const validIdeas = ideas.filter(i => i.trim());
      if (validIdeas.length > 0) {
        await supabase.from('flow_ideas').insert(
          validIdeas.map(title => ({ user_id: user.id, title }))
        );
      }

      toast.success('Onboarding concluído!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast.error('Erro ao salvar dados');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1: return whatBroughtYou.trim().length > 0;
      case 2: return true; // Name/email from auth
      case 3: return monthlyGoal.length > 0;
      case 4: return weeklyTime !== '';
      case 5: return feelsDispersed !== null;
      case 6: return hasTdah !== null;
      case 7: return ideas.some(i => i.trim().length > 0);
      case 8: return true;
      default: return false;
    }
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title="Bem-vindo ao Nello Flow"
        description="Configure seu perfil e comece sua jornada de produtividade"
      />
      
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/10 via-transparent to-transparent" />
        
        <div className="w-full max-w-lg relative z-10">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-semibold text-white">Nello Flow</span>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">Passo {step} de {totalSteps}</span>
              <span className="text-sm text-violet-400">{Math.round((step / totalSteps) * 100)}%</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-300"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Card */}
          <div className="p-8 rounded-2xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-2">Bem-vindo ao Nello Flow!</h1>
                  <p className="text-slate-400">O que te trouxe aqui hoje?</p>
                </div>
                <Textarea
                  value={whatBroughtYou}
                  onChange={(e) => setWhatBroughtYou(e.target.value)}
                  placeholder="Conte um pouco sobre o que você busca..."
                  className="bg-slate-900/50 border-slate-700 text-white min-h-[120px]"
                />
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-2">Ótimo ter você aqui!</h1>
                  <p className="text-slate-400">Confirmamos seus dados:</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-700">
                  <p className="text-slate-300">Email: <span className="text-white">{user?.email}</span></p>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-2">Sua meta de renda</h1>
                  <p className="text-slate-400">Quanto você quer ganhar por mês com algo seu?</p>
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">R$</span>
                  <Input
                    type="number"
                    value={monthlyGoal}
                    onChange={(e) => setMonthlyGoal(e.target.value)}
                    placeholder="5000"
                    className="pl-12 bg-slate-900/50 border-slate-700 text-white text-lg py-6"
                  />
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-2">Seu tempo disponível</h1>
                  <p className="text-slate-400">Quanto tempo por semana você pode dedicar?</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {timeOptions.map(option => (
                    <button
                      key={option.value}
                      onClick={() => setWeeklyTime(option.value)}
                      className={cn(
                        "p-4 rounded-xl border text-left transition-all",
                        weeklyTime === option.value
                          ? "bg-violet-500/20 border-violet-500/50 text-violet-300"
                          : "bg-slate-900/50 border-slate-700 text-slate-400 hover:border-slate-600"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-2">Sobre seu foco</h1>
                  <p className="text-slate-400">Você se sente disperso com frequência?</p>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => setFeelsDispersed(true)}
                    className={cn(
                      "flex-1 p-4 rounded-xl border transition-all",
                      feelsDispersed === true
                        ? "bg-violet-500/20 border-violet-500/50 text-violet-300"
                        : "bg-slate-900/50 border-slate-700 text-slate-400 hover:border-slate-600"
                    )}
                  >
                    Sim
                  </button>
                  <button
                    onClick={() => setFeelsDispersed(false)}
                    className={cn(
                      "flex-1 p-4 rounded-xl border transition-all",
                      feelsDispersed === false
                        ? "bg-violet-500/20 border-violet-500/50 text-violet-300"
                        : "bg-slate-900/50 border-slate-700 text-slate-400 hover:border-slate-600"
                    )}
                  >
                    Não
                  </button>
                </div>
              </div>
            )}

            {step === 6 && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-2">Mais sobre você</h1>
                  <p className="text-slate-400">Você tem TDAH ou suspeita?</p>
                </div>
                <div className="flex gap-3">
                  {[
                    { value: 'yes', label: 'Sim' },
                    { value: 'no', label: 'Não' },
                    { value: 'maybe', label: 'Não sei' },
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => setHasTdah(option.value)}
                      className={cn(
                        "flex-1 p-4 rounded-xl border transition-all",
                        hasTdah === option.value
                          ? "bg-violet-500/20 border-violet-500/50 text-violet-300"
                          : "bg-slate-900/50 border-slate-700 text-slate-400 hover:border-slate-600"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 7 && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-2">Suas ideias</h1>
                  <p className="text-slate-400">Quais ideias estão na sua cabeça agora?</p>
                </div>
                <div className="space-y-3">
                  {ideas.map((idea, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={idea}
                        onChange={(e) => updateIdeaText(index, e.target.value)}
                        placeholder="Digite uma ideia..."
                        className="bg-slate-900/50 border-slate-700 text-white"
                      />
                      {ideas.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeIdea(index)}
                          className="text-slate-400 hover:text-red-400"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={addIdea}
                    className="w-full border-dashed border-slate-700 text-slate-400 hover:text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar outra ideia
                  </Button>
                </div>
              </div>
            )}

            {step === 8 && (
              <div className="space-y-6 text-center">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white mb-2">Tudo pronto!</h1>
                  <p className="text-slate-400">
                    O Nello Flow vai te ajudar a escolher um foco e transformar isso em ação. Vamos começar.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-4 mt-8">
              {step > 1 && (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="border-slate-700 text-slate-400 hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
              )}
              
              {step < totalSteps ? (
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="flex-1 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600"
                >
                  Continuar
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleComplete}
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Ir para o Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
