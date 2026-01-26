import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Clock, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Assessment {
  id: string;
  test_type: string;
  status: string;
  completed_at: string | null;
  result_data: any;
  current_question_number?: number | null;
  last_activity_at?: string | null;
}

interface HiringAssessmentProgressCardProps {
  assessment: Assessment | undefined;
  testType: 'disc' | 'temperamentos';
  totalQuestions: number;
}

const TEST_CONFIG = {
  disc: {
    title: "Perfil DISC",
    emoji: "🎯",
    description: "Avaliação do perfil comportamental"
  },
  temperamentos: {
    title: "Temperamentos",
    emoji: "🔥",
    description: "Avaliação de temperamento"
  }
};

export function HiringAssessmentProgressCard({ 
  assessment, 
  testType, 
  totalQuestions 
}: HiringAssessmentProgressCardProps) {
  const config = TEST_CONFIG[testType];
  
  if (!assessment) {
    return (
      <Card className="border-muted">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <span>{config.emoji}</span>
              {config.title}
            </CardTitle>
            <Badge variant="secondary">
              <Clock className="h-3 w-3 mr-1" />
              Pendente
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            O candidato ainda não iniciou este teste.
          </p>
        </CardContent>
      </Card>
    );
  }

  const currentQuestion = assessment.current_question_number || 0;
  const progressPercent = totalQuestions > 0 ? Math.round((currentQuestion / totalQuestions) * 100) : 0;
  const lastActivity = assessment.last_activity_at;

  // Test completed
  if (assessment.status === "completed") {
    return (
      <Card className="border-green-200 bg-green-50/30 dark:bg-green-950/10">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <span>{config.emoji}</span>
              {config.title}
            </CardTitle>
            <Badge variant="default" className="bg-green-600">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Completo
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            ✅ Teste concluído com sucesso. Veja os resultados abaixo.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Test in progress
  if (assessment.status === "in_progress") {
    const isRecentlyActive = lastActivity && 
      new Date(lastActivity).getTime() > Date.now() - 5 * 60 * 1000; // 5 minutes

    return (
      <Card className="border-amber-200 bg-amber-50/30 dark:bg-amber-950/10">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <span>{config.emoji}</span>
              {config.title}
            </CardTitle>
            <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              Em Andamento
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Pergunta {currentQuestion} de {totalQuestions}
              </span>
              <span className="font-medium">{progressPercent}%</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            {lastActivity && (
              <span>
                Última atividade: {formatDistanceToNow(new Date(lastActivity), { 
                  addSuffix: true, 
                  locale: ptBR 
                })}
              </span>
            )}
            {isRecentlyActive && (
              <span className="flex items-center gap-1 text-green-600">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Candidato ativo agora
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default: pending state
  return (
    <Card className="border-muted">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <span>{config.emoji}</span>
            {config.title}
          </CardTitle>
          <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1" />
            Pendente
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          O candidato ainda não iniciou este teste.
        </p>
      </CardContent>
    </Card>
  );
}
