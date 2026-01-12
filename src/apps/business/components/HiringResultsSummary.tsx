import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DISC_PROFILES } from "@/lib/disc";
import { 
  getDISCRankedProfiles, 
  getTemperamentRankedProfiles 
} from "@/lib/discHiringInsights";

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
  // Get ranked DISC profiles
  const discRanked = discResults 
    ? getDISCRankedProfiles({
        D: discResults.percentages?.D || 0,
        I: discResults.percentages?.I || 0,
        S: discResults.percentages?.S || 0,
        C: discResults.percentages?.C || 0,
      })
    : [];

  // Get ranked Temperament profiles
  const tempRanked = temperamentResults
    ? getTemperamentRankedProfiles({
        sanguineo: temperamentResults.percentages?.sanguineo || 0,
        colerico: temperamentResults.percentages?.colerico || 0,
        melancolico: temperamentResults.percentages?.melancolico || 0,
        fleumatico: temperamentResults.percentages?.fleumatico || 0,
      })
    : [];

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
                <p className="text-sm text-muted-foreground">Seu perfil predominante</p>
                <p className="text-2xl font-bold text-primary">
                  {discResults.primary} - {DISC_LABELS[discResults.primary]}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Secundário: {discResults.secondary} - {DISC_LABELS[discResults.secondary]}
                </p>
              </div>

              <div className="space-y-2">
                {discRanked.map(({ key, label, isTop }) => (
                  <div key={key} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                    <span className="font-medium flex items-center gap-2 text-sm">
                      <span>{DISC_EMOJIS[key]}</span>
                      {key} - {DISC_LABELS[key]}
                    </span>
                    {label && (
                      <Badge variant={isTop ? "default" : "secondary"} className="text-xs">
                        {label}
                      </Badge>
                    )}
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
                <p className="text-sm text-muted-foreground">Seu temperamento predominante</p>
                <p className="text-2xl font-bold text-primary">
                  {TEMPERAMENT_LABELS[temperamentResults.primary.toLowerCase()] || temperamentResults.primary}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Secundário: {TEMPERAMENT_LABELS[temperamentResults.secondary.toLowerCase()] || temperamentResults.secondary}
                </p>
              </div>

              <div className="space-y-2">
                {tempRanked.map(({ key, label, isTop }) => (
                  <div key={key} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                    <span className="font-medium flex items-center gap-2 text-sm">
                      <span>{TEMPERAMENT_EMOJIS[key]}</span>
                      {TEMPERAMENT_LABELS[key]}
                    </span>
                    {label && (
                      <Badge variant={isTop ? "default" : "secondary"} className="text-xs">
                        {label}
                      </Badge>
                    )}
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
