import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Sparkles, 
  TrendingUp, 
  Target, 
  Leaf,
  Info,
  CheckCircle2,
  Lightbulb,
  MapPin
} from "lucide-react";
import { getCandidateFeedback, DISC_CANDIDATE_INSIGHTS, TEMPERAMENT_CANDIDATE_INSIGHTS } from "@/lib/candidateInsights";

interface DISCScores {
  D: number;
  I: number;
  S: number;
  C: number;
}

interface TemperamentScores {
  sanguineo: number;
  colerico: number;
  melancolico: number;
  fleumatico: number;
}

interface CandidateResultsFeedbackProps {
  candidateName: string;
  discResults?: {
    primary: string;
    secondary: string;
    percentages: DISCScores;
  };
  temperamentResults?: {
    primary: string;
    secondary: string;
    percentages: TemperamentScores;
  };
}

const DISC_LABELS: Record<string, string> = {
  D: "Dominância",
  I: "Influência",
  S: "Estabilidade",
  C: "Conformidade",
};

const TEMPERAMENT_LABELS: Record<string, string> = {
  sanguineo: "Sanguíneo",
  colerico: "Colérico",
  melancolico: "Melancólico",
  fleumatico: "Fleumático",
};

const DISC_EMOJIS: Record<string, string> = {
  D: "🎯",
  I: "✨",
  S: "🌿",
  C: "🔍",
};

const TEMPERAMENT_EMOJIS: Record<string, string> = {
  sanguineo: "🌞",
  colerico: "🔥",
  melancolico: "🌊",
  fleumatico: "🍃",
};

export function CandidateResultsFeedback({ 
  candidateName, 
  discResults, 
  temperamentResults 
}: CandidateResultsFeedbackProps) {
  const firstName = candidateName.split(' ')[0];
  
  // Get combined feedback if both results available
  const feedback = discResults && temperamentResults 
    ? getCandidateFeedback(discResults.primary, temperamentResults.primary)
    : null;

  return (
    <div className="space-y-6">
      {/* 1️⃣ Mensagem inicial de contexto */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <Info className="h-4 w-4 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">
                Olá, {firstName}! 👋
              </p>
              <p className="text-sm text-muted-foreground">
                Os resultados abaixo descrevem tendências naturais do seu perfil. 
                Eles não definem limites, não são diagnósticos e não indicam adequação 
                a qualquer posição específica. São pontos de reflexão para seu desenvolvimento 
                pessoal e profissional.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2️⃣ Perfil predominante (narrativo) */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* DISC Profile */}
        {discResults && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <span>{DISC_EMOJIS[discResults.primary] || "🎯"}</span>
                Seu Perfil DISC
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-lg font-semibold text-primary">
                  {DISC_LABELS[discResults.primary]}
                </p>
                <p className="text-xs text-muted-foreground">
                  Perfil predominante
                </p>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {DISC_CANDIDATE_INSIGHTS[discResults.primary]?.profileDescription}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Temperament Profile */}
        {temperamentResults && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <span>{TEMPERAMENT_EMOJIS[temperamentResults.primary.toLowerCase()] || "🔥"}</span>
                Seu Temperamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-lg font-semibold text-primary">
                  {TEMPERAMENT_LABELS[temperamentResults.primary.toLowerCase()] || temperamentResults.primary}
                </p>
                <p className="text-xs text-muted-foreground">
                  Temperamento predominante
                </p>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {TEMPERAMENT_CANDIDATE_INSIGHTS[temperamentResults.primary.toLowerCase()]?.profileDescription}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* 3️⃣ Pontos fortes profissionais */}
      {feedback && feedback.combinedStrengths.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Seus Pontos Fortes Profissionais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {feedback.combinedStrengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span className="text-sm">{strength}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* 4️⃣ Oportunidades de desenvolvimento */}
      {feedback && feedback.combinedDevelopment.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-amber-500" />
              Oportunidades de Desenvolvimento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Áreas onde você pode continuar crescendo:
            </p>
            <ul className="space-y-2">
              {feedback.combinedDevelopment.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <TrendingUp className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* 5️⃣ Ambiente de desenvolvimento ideal */}
      {feedback && feedback.combinedEnvironment && (
        <Card className="border-green-200 bg-green-50/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-600" />
              Ambiente de Desenvolvimento Ideal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {feedback.combinedEnvironment}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Nota de fechamento */}
      <div className="text-center pt-2">
        <p className="text-xs text-muted-foreground italic">
          Este resultado é uma ferramenta de autoconhecimento. 
          As decisões do processo seletivo são tomadas pela empresa com base em múltiplos critérios.
        </p>
      </div>
    </div>
  );
}
