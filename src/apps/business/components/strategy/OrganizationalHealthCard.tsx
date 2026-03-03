import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface OrganizationalHealthCardProps {
  enpsScore: number | null;
  climateScore: number | null;
  performanceAvg: number | null;
  adherenceAvg: number | null;
  previousIndex?: number | null;
}

export function calculateHealthIndex(
  enpsScore: number | null,
  climateScore: number | null,
  performanceAvg: number | null,
  adherenceAvg: number | null
): number | null {
  let weightedSum = 0;
  let totalWeight = 0;

  // eNPS normalized: -100..+100 → 0..100
  if (enpsScore !== null) {
    const n = (enpsScore + 100) / 2;
    weightedSum += n * 0.3;
    totalWeight += 0.3;
  }

  // Climate: 1-5 → 0-100
  if (climateScore !== null) {
    const n = ((climateScore - 1) / 4) * 100;
    weightedSum += n * 0.3;
    totalWeight += 0.3;
  }

  // Performance: 1-5 → 0-100
  if (performanceAvg !== null) {
    const n = ((performanceAvg - 1) / 4) * 100;
    weightedSum += n * 0.2;
    totalWeight += 0.2;
  }

  // Adherence: already 0-100
  if (adherenceAvg !== null) {
    weightedSum += adherenceAvg * 0.2;
    totalWeight += 0.2;
  }

  if (totalWeight === 0) return null;
  return Math.round(weightedSum / totalWeight);
}

export function OrganizationalHealthCard({
  enpsScore,
  climateScore,
  performanceAvg,
  adherenceAvg,
  previousIndex,
}: OrganizationalHealthCardProps) {
  const index = calculateHealthIndex(enpsScore, climateScore, performanceAvg, adherenceAvg);

  const getLevel = (v: number | null) => {
    if (v === null) return { label: 'Sem dados', color: 'text-muted-foreground', bg: 'bg-muted', dot: 'bg-muted-foreground' };
    if (v >= 70) return { label: 'Saudável', color: 'text-green-600', bg: 'bg-green-500/10', dot: 'bg-green-500' };
    if (v >= 40) return { label: 'Atenção', color: 'text-amber-600', bg: 'bg-amber-500/10', dot: 'bg-amber-500' };
    return { label: 'Risco', color: 'text-red-600', bg: 'bg-red-500/10', dot: 'bg-red-500' };
  };

  const { label, color, bg, dot } = getLevel(index);

  const trend = index !== null && previousIndex !== null
    ? index - previousIndex
    : null;

  return (
    <Card className={`${bg} col-span-full`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className={`w-5 h-5 ${color}`} />
            <CardDescription className="text-sm font-medium">Índice de Saúde Organizacional</CardDescription>
          </div>
          <div className={`w-2.5 h-2.5 rounded-full ${dot}`} />
        </div>
        <div className="flex items-baseline gap-3">
          <CardTitle className={`text-5xl font-bold ${color}`}>
            {index !== null ? index : '—'}
          </CardTitle>
          {index !== null && <span className="text-lg text-muted-foreground">/100</span>}
          {trend !== null && (
            <div className={`flex items-center gap-1 text-sm ${trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-muted-foreground'}`}>
              {trend > 0 ? <TrendingUp className="w-4 h-4" /> : trend < 0 ? <TrendingDown className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
              <span>{trend > 0 ? '+' : ''}{trend} vs anterior</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className={`text-sm font-semibold ${color}`}>{label}</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
          {[
            { label: 'eNPS', value: enpsScore !== null ? Math.round(enpsScore) : '—', sub: enpsScore !== null ? '' : 'sem dados' },
            { label: 'Clima', value: climateScore !== null ? climateScore.toFixed(1) : '—', sub: climateScore !== null ? '/5' : 'sem dados' },
            { label: 'Performance', value: performanceAvg !== null ? performanceAvg.toFixed(1) : '—', sub: performanceAvg !== null ? '/5' : 'sem dados' },
            { label: 'Aderência', value: adherenceAvg !== null ? `${Math.round(adherenceAvg)}%` : '—', sub: adherenceAvg === null ? 'sem dados' : '' },
          ].map(item => (
            <div key={item.label} className="p-2 rounded-lg bg-background/60">
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="text-lg font-bold">{item.value}<span className="text-xs text-muted-foreground ml-0.5">{item.sub}</span></p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
