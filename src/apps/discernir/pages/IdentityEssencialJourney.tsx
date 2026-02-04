import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useIdentityEssencial, type RhythmDeclaration } from '../hooks/useIdentityEssencial';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { 
  CheckCircle2, 
  Circle,
  ArrowRight,
  Heart,
  Compass,
  Scale,
  Sparkles,
  ChevronRight,
  Loader2
} from 'lucide-react';

/**
 * Identity Essencial Journey Page
 * 
 * A lightweight pastoral journey that:
 * 1. Reuses existing DISC, Temperamentos, and Estilos de Conexão tests
 * 2. Adds simple rhythm declaration questions
 * 3. Generates a pastoral synthesis for DISCERNIR
 * 
 * Key principles:
 * - Human, formative language (not clinical)
 * - No evaluations or diagnoses
 * - Focus on the current moment, not fixed traits
 */

const RHYTHM_QUESTIONS = {
  responsibilities_count: {
    question: 'Quantas responsabilidades fixas você assumiu recentemente?',
    options: [
      { value: 'few', label: 'Poucas — tenho margem para imprevistos' },
      { value: 'moderate', label: 'Moderadas — consigo dar conta, mas sem folga' },
      { value: 'many', label: 'Muitas — estou no limite' },
      { value: 'too_many', label: 'Demais — não sei como estou conseguindo' },
    ],
  },
  rest_quality: {
    question: 'Como está seu descanso atualmente?',
    options: [
      { value: 'good', label: 'Bom — consigo descansar quando preciso' },
      { value: 'acceptable', label: 'Aceitável — descanso, mas não o suficiente' },
      { value: 'poor', label: 'Ruim — quase não consigo descansar' },
      { value: 'none', label: 'Inexistente — não lembro a última vez que descansei de verdade' },
    ],
  },
  current_rhythm: {
    question: 'Hoje, você diria que seu ritmo está:',
    options: [
      { value: 'light', label: 'Leve — tenho tempo para respirar' },
      { value: 'demanding', label: 'Exigente — dá para seguir, mas preciso de atenção' },
      { value: 'heavy', label: 'Pesado — estou me sentindo sobrecarregado(a)' },
    ],
  },
  guilt_when_resting: {
    question: 'Você sente culpa quando descansa?',
    options: [
      { value: 'false', label: 'Não — descanso sem culpa' },
      { value: 'true', label: 'Sim — frequentemente me sinto culpado(a) por parar' },
    ],
  },
  family_time_sufficient: {
    question: 'O tempo com sua família está sendo suficiente?',
    options: [
      { value: 'true', label: 'Sim — estou presente quanto gostaria' },
      { value: 'false', label: 'Não — gostaria de ter mais tempo com eles' },
    ],
  },
};

const RHYTHM_ANSWERS_STORAGE_KEY = 'discernir_rhythm_answers';

export function IdentityEssencialJourney() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { status, isLoading, isJourneyComplete, getNextStep, saveRhythmDeclaration, refetch } = useIdentityEssencial();
  
  const [currentView, setCurrentView] = useState<'overview' | 'rhythm_form'>('overview');
  const [isSaving, setIsSaving] = useState(false);
  
  // Persist rhythm answers in sessionStorage to prevent data loss on page refresh
  const [rhythmAnswers, setRhythmAnswers] = useState<Partial<RhythmDeclaration>>(() => {
    try {
      const stored = sessionStorage.getItem(RHYTHM_ANSWERS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  // Save answers to sessionStorage whenever they change
  useEffect(() => {
    if (Object.keys(rhythmAnswers).length > 0) {
      sessionStorage.setItem(RHYTHM_ANSWERS_STORAGE_KEY, JSON.stringify(rhythmAnswers));
    }
  }, [rhythmAnswers]);

  // Clear stored answers when journey is complete
  useEffect(() => {
    if (isJourneyComplete) {
      sessionStorage.removeItem(RHYTHM_ANSWERS_STORAGE_KEY);
    }
  }, [isJourneyComplete]);

  // Prevent accidental page close/refresh while filling form
  useEffect(() => {
    const hasUnsavedAnswers = currentView === 'rhythm_form' && Object.keys(rhythmAnswers).length > 0;
    
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedAnswers && !isSaving) {
        e.preventDefault();
        e.returnValue = 'Você tem respostas não salvas. Deseja realmente sair?';
        return e.returnValue;
      }
    };

    if (hasUnsavedAnswers) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [currentView, rhythmAnswers, isSaving]);

  // Check if returning from test completion
  useEffect(() => {
    const completed = searchParams.get('completed');
    if (completed) {
      toast.success('Teste concluído!', {
        description: 'Seu progresso foi salvo.'
      });
      refetch();
    }
  }, [searchParams, refetch]);

  // Calculate progress
  const calculateProgress = () => {
    if (!status) return 0;
    let completed = 0;
    if (status.disc_status === 'completed') completed++;
    if (status.temperamentos_status === 'completed') completed++;
    if (status.estilos_conexao_status === 'completed') completed++;
    if (status.has_rhythm_declaration) completed++;
    return (completed / 4) * 100;
  };

  const handleStartTest = (testType: 'disc' | 'temperamentos' | 'estilos_conexao') => {
    // Navigate to the Identity test execution page with return URL
    const testSlug = testType === 'estilos_conexao' ? 'estilos-conexao' : testType;
    const returnUrl = encodeURIComponent('/discernir/identity-essencial?completed=true');
    
    // Navigate to the test in Identity context
    navigate(`/cliente/teste/${testSlug}?return_to=${returnUrl}&context=discernir`);
  };

  const handleRhythmSubmit = async () => {
    // Validate all questions answered
    const requiredFields = ['responsibilities_count', 'rest_quality', 'current_rhythm', 'guilt_when_resting', 'family_time_sufficient'];
    const allAnswered = requiredFields.every(field => rhythmAnswers[field as keyof RhythmDeclaration] !== undefined);
    
    if (!allAnswered) {
      toast.error('Por favor, responda todas as perguntas');
      return;
    }

    setIsSaving(true);
    try {
      // Convert string booleans to actual booleans
      const declaration: RhythmDeclaration = {
        responsibilities_count: rhythmAnswers.responsibilities_count as RhythmDeclaration['responsibilities_count'],
        rest_quality: rhythmAnswers.rest_quality as RhythmDeclaration['rest_quality'],
        current_rhythm: rhythmAnswers.current_rhythm as RhythmDeclaration['current_rhythm'],
        guilt_when_resting: rhythmAnswers.guilt_when_resting === true || rhythmAnswers.guilt_when_resting === 'true' as any,
        family_time_sufficient: rhythmAnswers.family_time_sufficient === true || rhythmAnswers.family_time_sufficient === 'true' as any,
      };

      const success = await saveRhythmDeclaration(declaration);
      
      if (success) {
        // Clear stored answers on successful save
        sessionStorage.removeItem(RHYTHM_ANSWERS_STORAGE_KEY);
        setRhythmAnswers({});
        
        toast.success('Respostas salvas!', {
          description: 'Sua jornada Identity Essencial foi concluída.'
        });
        setCurrentView('overview');
      } else {
        toast.error('Erro ao salvar respostas');
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-amber-700" />
      </div>
    );
  }

  // Journey complete - show completion state
  if (isJourneyComplete) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="border-green-200 bg-green-50/30">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="font-serif text-2xl text-green-800">
              Jornada Concluída
            </CardTitle>
            <CardDescription className="text-green-700">
              Você completou o Identity Essencial
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-amber-800">
              Sua base humana está pronta para apoiar a escuta pastoral no DISCERNIR.
            </p>
            
            {status?.completion_source === 'reused' && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                Dados reaproveitados do Identity
              </Badge>
            )}

            <div className="pt-4 space-y-3">
              <Button 
                onClick={() => navigate('/discernir/dashboard')}
                className="w-full bg-amber-700 hover:bg-amber-800"
              >
                Voltar ao DISCERNIR
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              
              <p className="text-xs text-amber-700/70 italic">
                Deseja aprofundar seu autoconhecimento?{' '}
                <button 
                  onClick={() => navigate('/cliente')}
                  className="underline hover:text-amber-900"
                >
                  Conheça a Jornada do Código da Essência
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Rhythm declaration form
  if (currentView === 'rhythm_form') {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="border-amber-200/50">
          <CardHeader>
            <CardTitle className="font-serif text-xl text-amber-900 flex items-center gap-2">
              <Scale className="h-5 w-5" />
              Retrato do Seu Momento
            </CardTitle>
            <CardDescription>
              Estas perguntas ajudam a entender como você está vivendo agora. 
              Não há respostas certas ou erradas.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {Object.entries(RHYTHM_QUESTIONS).map(([key, q]) => (
              <div key={key} className="space-y-3">
                <Label className="text-base font-medium text-amber-900">
                  {q.question}
                </Label>
                <RadioGroup
                  value={String(rhythmAnswers[key as keyof RhythmDeclaration] ?? '')}
                  onValueChange={(value) => setRhythmAnswers(prev => ({
                    ...prev,
                    [key]: value === 'true' ? true : value === 'false' ? false : value
                  }))}
                  className="space-y-2"
                >
                  {q.options.map((opt) => (
                    <div 
                      key={opt.value} 
                      className="flex items-start space-x-3 p-3 rounded-lg border border-amber-100 hover:bg-amber-50/50 transition-colors"
                    >
                      <RadioGroupItem value={opt.value} id={`${key}-${opt.value}`} className="mt-0.5" />
                      <Label 
                        htmlFor={`${key}-${opt.value}`}
                        className="text-sm text-amber-800 cursor-pointer"
                      >
                        {opt.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}

            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setCurrentView('overview')}
                disabled={isSaving}
              >
                Voltar
              </Button>
              <Button 
                onClick={handleRhythmSubmit}
                disabled={isSaving}
                className="flex-1 bg-amber-700 hover:bg-amber-800"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Concluir
              </Button>
            </div>

            <p className="text-xs text-amber-700/60 text-center italic">
              "Esta leitura refere-se ao momento atual e pode mudar com o tempo."
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main overview
  const nextStep = getNextStep();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Institutional Transparency Card */}
      <Card className="border-amber-200/40 bg-amber-50/40">
        <CardContent className="pt-5 pb-5">
          <h3 className="text-sm font-medium text-amber-800 mb-2">
            Sobre esta experiência
          </h3>
          <div className="space-y-2 text-xs text-amber-700/80 leading-relaxed">
            <p>
              Esta etapa de autoconhecimento é oferecida pela plataforma <span className="font-medium">Nello Identity</span>, 
              especializada em experiências pessoais de reflexão e autoconhecimento humano.
            </p>
            <p>
              O DISCERNIR utiliza apenas partes dessas informações, com seu consentimento, 
              para apoiar a escuta pastoral.
            </p>
            <p className="font-medium text-amber-800/90">
              Seus dados permanecem sob seu controle.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="font-serif text-2xl font-semibold text-amber-900">
          Identity Essencial
        </h1>
        <p className="text-amber-800/70 text-sm">
          Base humana para a escuta pastoral
        </p>
      </div>

      {/* Progress */}
      <Card className="border-amber-200/50">
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-amber-700">
              <span>Progresso</span>
              <span>{Math.round(calculateProgress())}%</span>
            </div>
            <Progress value={calculateProgress()} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Steps */}
      <div className="space-y-3">
        {/* DISC */}
        <StepCard
          title="Perfil Comportamental"
          description="Como você age e reage em diferentes situações"
          icon={<Compass className="h-5 w-5" />}
          status={status?.disc_status === 'completed' ? 'completed' : nextStep === 'disc' ? 'current' : 'pending'}
          onAction={() => handleStartTest('disc')}
          isReused={status?.disc_status === 'completed' && status?.completion_source === 'reused'}
        />

        {/* Temperamentos */}
        <StepCard
          title="Temperamento"
          description="Seu ritmo natural de energia e recuperação"
          icon={<Heart className="h-5 w-5" />}
          status={status?.temperamentos_status === 'completed' ? 'completed' : nextStep === 'temperamentos' ? 'current' : 'pending'}
          onAction={() => handleStartTest('temperamentos')}
          isReused={status?.temperamentos_status === 'completed' && status?.completion_source === 'reused'}
        />

        {/* Estilos de Conexão */}
        <StepCard
          title="Estilos de Conexão"
          description="Como você se sente cuidado(a) e se reabastece"
          icon={<Sparkles className="h-5 w-5" />}
          status={status?.estilos_conexao_status === 'completed' ? 'completed' : nextStep === 'estilos_conexao' ? 'current' : 'pending'}
          onAction={() => handleStartTest('estilos_conexao')}
          isReused={status?.estilos_conexao_status === 'completed' && status?.completion_source === 'reused'}
        />

        {/* Rhythm Declaration */}
        <StepCard
          title="Retrato do Momento"
          description="Uma fotografia simples do seu ritmo atual"
          icon={<Scale className="h-5 w-5" />}
          status={status?.has_rhythm_declaration ? 'completed' : nextStep === 'rhythm_declaration' ? 'current' : 'pending'}
          onAction={() => setCurrentView('rhythm_form')}
        />
      </div>

      {/* Info Box */}
      <Card className="border-amber-200/50 bg-amber-50/30">
        <CardContent className="pt-6">
          <p className="text-center text-sm text-amber-800 italic">
            Esta jornada não é avaliação nem diagnóstico. 
            É uma base humana para apoiar a escuta pastoral.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// Step Card Component
interface StepCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  status: 'pending' | 'current' | 'completed';
  onAction: () => void;
  isReused?: boolean;
}

function StepCard({ title, description, icon, status, onAction, isReused }: StepCardProps) {
  return (
    <Card 
      className={`border transition-all ${
        status === 'current' 
          ? 'border-amber-400 shadow-md' 
          : status === 'completed' 
            ? 'border-green-200 bg-green-50/30' 
            : 'border-amber-100 opacity-60'
      }`}
    >
      <CardContent className="pt-4 pb-4">
        <div className="flex items-center gap-4">
          <div className={`p-2 rounded-full ${
            status === 'completed' 
              ? 'bg-green-100 text-green-600' 
              : status === 'current'
                ? 'bg-amber-100 text-amber-700'
                : 'bg-gray-100 text-gray-400'
          }`}>
            {status === 'completed' ? <CheckCircle2 className="h-5 w-5" /> : icon}
          </div>
          
          <div className="flex-1">
            <h3 className="font-medium text-amber-900 flex items-center gap-2">
              {title}
              {isReused && (
                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600 border-blue-200">
                  Reaproveitado
                </Badge>
              )}
            </h3>
            <p className="text-sm text-amber-700/70">{description}</p>
          </div>
          
          {status === 'current' && (
            <Button 
              size="sm"
              onClick={onAction}
              className="bg-amber-700 hover:bg-amber-800"
            >
              {status === 'current' ? 'Iniciar' : 'Continuar'}
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          )}
          
          {status === 'pending' && (
            <Circle className="h-5 w-5 text-gray-300" />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
