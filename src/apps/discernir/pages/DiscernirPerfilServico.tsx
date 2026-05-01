import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ChevronRight, ChevronLeft, Copy, Check, ClipboardList, Church, Download, Share2 } from 'lucide-react';
import {
  calculateCircleProfile,
  getBlockLabel,
  getRoleDescription,
  generateNoticerPayload,
  type BlockKey,
  type CircleProfileResult,
} from '../utils/circleProfileCalculation';
import { downloadPerfilServicoPDF } from '../utils/perfilServicoPDF';
import { cn } from '@/lib/utils';

interface Question {
  id: string;
  order_index: number;
  block: string;
  prompt: string;
}

const LIKERT_OPTIONS = [
  { value: '1', label: 'Nunca' },
  { value: '2', label: 'Raramente' },
  { value: '3', label: 'Às vezes' },
  { value: '4', label: 'Frequentemente' },
  { value: '5', label: 'Quase sempre' },
];

const QUESTIONS_PER_PAGE = 8;

type Phase = 'intro' | 'questionnaire' | 'saving' | 'result';

export function DiscernirPerfilServico() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [phase, setPhase] = useState<Phase>('intro');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<CircleProfileResult | null>(null);
  const [existingResult, setExistingResult] = useState<CircleProfileResult | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  // Load questions & check existing result
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [qRes, profileRes] = await Promise.all([
          supabase
            .from('discernir_circle_profile_questions')
            .select('id, order_index, block, prompt')
            .eq('is_active', true)
            .eq('version', 'v1')
            .order('order_index'),
          user
            ? supabase
                .from('discernir_circle_profiles')
                .select('*')
                .eq('user_id', user.id)
                .eq('status', 'completed')
                .order('created_at', { ascending: false })
                .limit(1)
            : Promise.resolve({ data: null, error: null }),
        ]);

        if (qRes.error) throw qRes.error;
        setQuestions(qRes.data || []);

        if (profileRes.data && profileRes.data.length > 0) {
          const existing = profileRes.data[0];
          setExistingResult({
            version: existing.version,
            primary_role: existing.primary_role,
            secondary_role: existing.secondary_role || '',
            tertiary_role: existing.tertiary_role || '',
            scores: existing.scores as any,
            percentages: existing.percentages as any,
            ranking: existing.ranking as any,
            summary_text: '',
          });
        }
      } catch (err) {
        console.error('Error loading questions:', err);
        toast({ title: 'Erro ao carregar perguntas', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);
  const pageQuestions = questions.slice(
    currentPage * QUESTIONS_PER_PAGE,
    (currentPage + 1) * QUESTIONS_PER_PAGE
  );

  const allAnswered = questions.every(q => answers[q.order_index] !== undefined);
  const pageAllAnswered = pageQuestions.every(q => answers[q.order_index] !== undefined);

  const handleAnswer = (orderIndex: number, value: string) => {
    setAnswers(prev => ({ ...prev, [orderIndex]: parseInt(value) }));
  };

  const handleSubmit = async () => {
    if (!user || !allAnswered) return;
    setPhase('saving');

    const calcResult = calculateCircleProfile(answers);
    setResult(calcResult);

    try {
      const { error } = await supabase.from('discernir_circle_profiles').insert({
        user_id: user.id,
        version: 'v1',
        status: 'completed',
        answers: answers as any,
        scores: calcResult.scores as any,
        percentages: calcResult.percentages as any,
        ranking: calcResult.ranking as any,
        primary_role: calcResult.primary_role,
        secondary_role: calcResult.secondary_role,
        tertiary_role: calcResult.tertiary_role,
      } as any);

      if (error) throw error;
      setPhase('result');
    } catch (err: any) {
      console.error('Error saving profile:', err);
      toast({ title: 'Erro ao salvar resultado', description: err.message, variant: 'destructive' });
      setPhase('questionnaire');
    }
  };

  const handleCopy = async (type: 'text' | 'json') => {
    if (!result) return;
    const content = type === 'json'
      ? JSON.stringify(generateNoticerPayload(result), null, 2)
      : result.summary_text;

    await navigator.clipboard.writeText(content);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
    toast({ title: 'Copiado!' });
  };

  const handleRetake = () => {
    setAnswers({});
    setCurrentPage(0);
    setResult(null);
    setExistingResult(null);
    setPhase('intro');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-amber-700" />
      </div>
    );
  }

  // INTRO PHASE
  if (phase === 'intro') {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-3">
          <Church className="w-10 h-10 text-amber-700 mx-auto" />
          <h1 className="text-2xl font-serif font-semibold text-foreground">
            Perfil de Serviço
          </h1>
          <p className="text-muted-foreground">
            Descubra como você pode servir melhor no seu círculo pastoral.
          </p>
        </div>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Este questionário contém <strong>44 afirmações</strong> sobre como você age em grupo.
              Para cada uma, escolha a frequência que melhor descreve seu comportamento habitual.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Não há respostas certas ou erradas. O objetivo é identificar seus <strong>pontos fortes
              naturais</strong> para o serviço no círculo.
            </p>
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
              <p className="text-xs text-amber-800 italic">
                ⚠️ Este questionário não mede santidade, não mede espiritualidade de forma objetiva,
                não é avaliação psicológica. É um apoio para formação e melhor encaixe de serviço.
              </p>
            </div>
          </CardContent>
        </Card>

        {existingResult && (
          <Card className="border-amber-200 bg-amber-50/50">
            <CardContent className="pt-6 space-y-2">
              <p className="text-sm font-medium text-amber-900">
                Você já respondeu este questionário anteriormente.
              </p>
              <p className="text-xs text-amber-700">
                Papel principal: <strong>{existingResult.primary_role}</strong>
              </p>
              <Button variant="outline" size="sm" onClick={() => {
                setResult(existingResult);
                setPhase('result');
              }}>
                Ver resultado anterior
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-center">
          <Button
            variant="gold"
            size="lg"
            onClick={() => setPhase('questionnaire')}
            className="gap-2"
          >
            <ClipboardList className="w-5 h-5" />
            {existingResult ? 'Refazer questionário' : 'Iniciar questionário'}
          </Button>
        </div>
      </div>
    );
  }

  // SAVING PHASE
  if (phase === 'saving') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-amber-700" />
        <p className="text-muted-foreground">Calculando seu perfil de serviço...</p>
      </div>
    );
  }

  // RESULT PHASE
  if (phase === 'result' && result) {
    const userName = (user?.user_metadata as any)?.full_name || user?.email || undefined;
    return <ResultView result={result} onCopy={handleCopy} copied={copied} onRetake={handleRetake} userName={userName} />;
  }

  // QUESTIONNAIRE PHASE
  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / questions.length) * 100);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Página {currentPage + 1} de {totalPages}</span>
          <span>{answeredCount}/{questions.length} respondidas</span>
        </div>
        <Progress value={progressPercent} className="h-2" />
      </div>

      <div className="space-y-6">
        {pageQuestions.map((q) => (
          <Card key={q.id} className={cn(
            "transition-all",
            answers[q.order_index] !== undefined && "border-amber-300 bg-amber-50/30"
          )}>
            <CardHeader className="pb-3">
              <CardDescription className="text-xs uppercase tracking-wider text-amber-700">
                {getBlockLabel(q.block as BlockKey)}
              </CardDescription>
              <CardTitle className="text-base font-normal leading-relaxed">
                {q.order_index}. {q.prompt}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={answers[q.order_index]?.toString() || ''}
                onValueChange={(v) => handleAnswer(q.order_index, v)}
                className="flex flex-wrap gap-3"
              >
                {LIKERT_OPTIONS.map((opt) => (
                  <div key={opt.value} className="flex items-center gap-1.5">
                    <RadioGroupItem value={opt.value} id={`q${q.order_index}-${opt.value}`} />
                    <Label
                      htmlFor={`q${q.order_index}-${opt.value}`}
                      className="text-sm cursor-pointer"
                    >
                      {opt.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4">
        <Button
          variant="outline"
          onClick={() => setCurrentPage(p => p - 1)}
          disabled={currentPage === 0}
          className="gap-1"
        >
          <ChevronLeft className="w-4 h-4" /> Anterior
        </Button>

        {currentPage < totalPages - 1 ? (
          <Button
            variant="gold"
            onClick={() => setCurrentPage(p => p + 1)}
            disabled={!pageAllAnswered}
            className="gap-1"
          >
            Próxima <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            variant="gold"
            onClick={handleSubmit}
            disabled={!allAnswered}
            className="gap-1"
          >
            Finalizar <Check className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

// --- Result Sub-component ---

function ResultView({
  result,
  onCopy,
  copied,
  onRetake,
}: {
  result: CircleProfileResult;
  onCopy: (type: 'text' | 'json') => void;
  copied: string | null;
  onRetake: () => void;
}) {
  const blocks: BlockKey[] = ['lideranca', 'acolhimento', 'comunicacao', 'equipe', 'espiritualidade', 'conducao'];
  const top3 = result.ranking.slice(0, 3);

  const medalEmoji = ['🥇', '🥈', '🥉'];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-serif font-semibold text-foreground">
          Seu Perfil de Serviço
        </h1>
        <p className="text-muted-foreground text-sm">
          Resultado baseado nas suas respostas
        </p>
      </div>

      {/* Top 3 Roles */}
      <div className="grid gap-4">
        {top3.map((r, i) => (
          <Card key={r.role} className={cn(
            i === 0 && "border-amber-400 bg-amber-50/60",
            i === 1 && "border-amber-200 bg-amber-50/30",
          )}>
            <CardContent className="pt-5 pb-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{medalEmoji[i]}</span>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground">{r.role}</h3>
                    <span className="text-sm font-medium text-amber-800">{r.percentage}%</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {getRoleDescription(r.role)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* All Blocks Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Percentuais por Dimensão</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {blocks.map((block) => (
            <div key={block} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{getBlockLabel(block)}</span>
                <span className="font-medium">{result.percentages[block]}%</span>
              </div>
              <Progress value={result.percentages[block]} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
        <p className="text-xs text-amber-800 italic">
          ⚠️ Este resultado não mede santidade nem espiritualidade de forma objetiva.
          É um apoio pastoral para formação e discernimento de serviço no círculo.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 justify-center">
        <Button
          variant="gold-outline"
          onClick={() => onCopy('text')}
          className="gap-2"
        >
          <Copy className="w-4 h-4" />
          {copied === 'text' ? 'Copiado!' : 'Copiar resultado'}
        </Button>
        <Button
          variant="outline"
          onClick={() => onCopy('json')}
          className="gap-2"
        >
          <ClipboardList className="w-4 h-4" />
          {copied === 'json' ? 'Copiado!' : 'Copiar para Noticer'}
        </Button>
        <Button
          variant="ghost"
          onClick={onRetake}
          className="text-muted-foreground"
        >
          Refazer questionário
        </Button>
      </div>
    </div>
  );
}
