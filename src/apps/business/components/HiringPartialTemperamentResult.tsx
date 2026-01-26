import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getTemperamentRankedProfiles } from "@/lib/discHiringInsights";

interface HiringPartialTemperamentResultProps {
  result: any;
}

const temperamentData: Record<string, { name: string; emoji: string; color: string }> = {
  sanguineo: { name: "Sanguíneo", emoji: "🌬️", color: "text-yellow-600" },
  colerico: { name: "Colérico", emoji: "🔥", color: "text-red-600" },
  melancolico: { name: "Melancólico", emoji: "💧", color: "text-blue-600" },
  fleumatico: { name: "Fleumático", emoji: "🌍", color: "text-green-600" },
};

export function HiringPartialTemperamentResult({ result }: HiringPartialTemperamentResultProps) {
  const primary = result?.primary;
  const ranking = result?.ranking || [];

  if (!primary) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🔥</span>
            Temperamento
          </CardTitle>
          <CardDescription>
            Dados insuficientes para classificação
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Build percentages from ranking for the ranking function
  const percentages: Record<string, number> = {};
  ranking.forEach((item: any) => {
    if (item.temperament) {
      percentages[item.temperament] = item.percentage || 0;
    }
  });

  // Get ranked profiles with predominance labels
  const rankedProfiles = getTemperamentRankedProfiles(percentages);

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">{temperamentData[primary?.temperament]?.emoji}</span>
          Temperamento
        </CardTitle>
        <CardDescription>
          {primary?.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {rankedProfiles.map(({ key, label, isTop }) => {
            const tempData = temperamentData[key];
            
            return (
              <div 
                key={key} 
                className={`p-4 rounded-lg border ${isTop ? 'border-primary bg-primary/5' : 'border-border'}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{tempData?.emoji}</span>
                  <span className="font-medium text-sm">{tempData?.name}</span>
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
