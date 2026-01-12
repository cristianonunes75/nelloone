import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DISC_PROFILES } from "@/lib/disc";

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

interface HiringResultsSummaryProps {
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

const DISC_COLORS: Record<string, string> = {
  D: "bg-red-500",
  I: "bg-yellow-500",
  S: "bg-green-500",
  C: "bg-blue-500",
};

const DISC_LABELS: Record<string, string> = {
  D: "Dominância",
  I: "Influência",
  S: "Estabilidade",
  C: "Conformidade",
};

const TEMPERAMENT_COLORS: Record<string, string> = {
  sanguineo: "bg-yellow-500",
  colerico: "bg-red-500",
  melancolico: "bg-blue-500",
  fleumatico: "bg-green-500",
};

const TEMPERAMENT_LABELS: Record<string, string> = {
  sanguineo: "Sanguíneo",
  colerico: "Colérico",
  melancolico: "Melancólico",
  fleumatico: "Fleumático",
};

const TEMPERAMENT_EMOJIS: Record<string, string> = {
  sanguineo: "🌞",
  colerico: "🔥",
  melancolico: "🌊",
  fleumatico: "🍃",
};

const DISC_EMOJIS: Record<string, string> = {
  D: "🎯",
  I: "✨",
  S: "🌿",
  C: "🔍",
};

export function HiringResultsSummary({ 
  candidateName, 
  discResults, 
  temperamentResults 
}: HiringResultsSummaryProps) {
  return (
    <div className="space-y-4">
      <p className="text-center text-muted-foreground">
        Veja um resumo do seu perfil, {candidateName.split(' ')[0]}:
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        {/* DISC Card */}
        {discResults && (
          <Card className="border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <span>{DISC_EMOJIS[discResults.primary] || "🎯"}</span>
                Perfil DISC
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-3 rounded-lg bg-primary/5">
                <p className="text-sm text-muted-foreground">Seu perfil dominante</p>
                <p className="text-2xl font-bold text-primary">
                  {discResults.primary} - {DISC_LABELS[discResults.primary]}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Secundário: {discResults.secondary} - {DISC_LABELS[discResults.secondary]}
                </p>
              </div>

              <div className="space-y-2">
                {Object.entries(discResults.percentages)
                  .sort((a, b) => b[1] - a[1])
                  .map(([key, value]) => (
                    <div key={key} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">
                          {key} - {DISC_LABELS[key]}
                        </span>
                        <span className="text-muted-foreground">{Math.round(value)}%</span>
                      </div>
                      <Progress 
                        value={value} 
                        className={`h-2 [&>div]:${DISC_COLORS[key]}`}
                      />
                    </div>
                  ))}
              </div>

              <p className="text-xs text-muted-foreground text-center italic">
                {DISC_PROFILES[discResults.primary as keyof typeof DISC_PROFILES]?.shortDescription?.pt}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Temperament Card */}
        {temperamentResults && (
          <Card className="border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <span>{TEMPERAMENT_EMOJIS[temperamentResults.primary.toLowerCase()] || "🔥"}</span>
                Temperamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-3 rounded-lg bg-primary/5">
                <p className="text-sm text-muted-foreground">Seu temperamento dominante</p>
                <p className="text-2xl font-bold text-primary">
                  {TEMPERAMENT_LABELS[temperamentResults.primary.toLowerCase()] || temperamentResults.primary}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Secundário: {TEMPERAMENT_LABELS[temperamentResults.secondary.toLowerCase()] || temperamentResults.secondary}
                </p>
              </div>

              <div className="space-y-2">
                {Object.entries(temperamentResults.percentages)
                  .sort((a, b) => b[1] - a[1])
                  .map(([key, value]) => (
                    <div key={key} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium flex items-center gap-1">
                          <span>{TEMPERAMENT_EMOJIS[key]}</span>
                          {TEMPERAMENT_LABELS[key]}
                        </span>
                        <span className="text-muted-foreground">{Math.round(value)}%</span>
                      </div>
                      <Progress 
                        value={value} 
                        className={`h-2 [&>div]:${TEMPERAMENT_COLORS[key]}`}
                      />
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
