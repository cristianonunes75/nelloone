import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DISC_PROFILES } from "@/lib/disc";
import { getDiscDisplayData } from "@/lib/discRanking";

interface HiringPartialDISCResultProps {
  result: any;
}

const DISC_LABELS: Record<string, string> = {
  D: "Dominância",
  I: "Influência",
  S: "Estabilidade",
  C: "Conformidade",
};

export function HiringPartialDISCResult({ result }: HiringPartialDISCResultProps) {
  const discDisplay = getDiscDisplayData(result);
  const primaryKey = discDisplay.primaryKey as keyof typeof DISC_PROFILES;

  if (!discDisplay.isValid) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            Perfil DISC
          </CardTitle>
          <CardDescription>
            {discDisplay.fallbackText || 'Dados insuficientes para classificação'}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">{DISC_PROFILES[primaryKey]?.emoji}</span>
          Perfil DISC
        </CardTitle>
        <CardDescription>
          {DISC_PROFILES[primaryKey]?.shortDescription?.pt}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {discDisplay.ranking.map(({ key, label, isTop }) => {
            const profile = DISC_PROFILES[key as keyof typeof DISC_PROFILES];
            
            return (
              <div 
                key={key} 
                className={`p-4 rounded-lg border ${isTop ? 'border-primary bg-primary/5' : 'border-border'}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{profile?.emoji}</span>
                  <span className="font-medium text-sm">{DISC_LABELS[key]}</span>
                </div>
                {label && (
                  <Badge 
                    variant={isTop ? "default" : "secondary"} 
                    className="text-xs"
                  >
                    {label}
                  </Badge>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
