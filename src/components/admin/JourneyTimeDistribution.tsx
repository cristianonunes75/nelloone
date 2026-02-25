import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TimeDistributionProps {
  durations: number[]; // in ms
}

const RANGES = [
  { label: "< 1 dia", max: 1 },
  { label: "1–3 dias", max: 3 },
  { label: "3–7 dias", max: 7 },
  { label: "7–14 dias", max: 14 },
  { label: "14+ dias", max: Infinity },
];

export function JourneyTimeDistribution({ durations }: TimeDistributionProps) {
  const days = durations.map(d => d / (1000 * 60 * 60 * 24));
  
  const buckets = RANGES.map((range, i) => {
    const min = i === 0 ? 0 : RANGES[i - 1].max;
    const count = days.filter(d => d >= min && d < range.max).length;
    return { ...range, count };
  });

  const maxCount = Math.max(...buckets.map(b => b.count), 1);

  if (durations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Distribuição de Tempo de Conclusão</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Nenhum usuário completou a jornada ainda.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Distribuição de Tempo de Conclusão</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {buckets.map((bucket) => (
          <div key={bucket.label} className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground w-20 shrink-0">{bucket.label}</span>
            <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${(bucket.count / maxCount) * 100}%` }}
              />
            </div>
            <span className="text-sm font-medium w-8 text-right">{bucket.count}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
