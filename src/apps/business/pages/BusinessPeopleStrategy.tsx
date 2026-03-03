import { useState, useEffect } from 'react';
import { BusinessLayout } from '../components/BusinessLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useENPS } from '../hooks/useENPS';
import { useClimate, DIMENSION_LABELS, getClimateClassification } from '../hooks/useClimate';
import { useTeamInsights } from '../hooks/useTeamInsights';
import { useBusinessAuth } from '../hooks/useBusinessAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  TrendingUp, TrendingDown, Minus, BarChart3, Brain, Plus, Play, Square,
  Loader2, Sparkles, Users, ShieldAlert, Thermometer, AlertTriangle
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// ── eNPS Score Card ──
function ENPSScoreCard({ score, total }: { score: number | null; total: number }) {
  const getColor = (s: number) => s >= 50 ? 'text-green-500' : s >= 0 ? 'text-amber-500' : 'text-red-500';
  const getLabel = (s: number) => s >= 75 ? 'Excelente' : s >= 50 ? 'Muito Bom' : s >= 0 ? 'Razoável' : s >= -50 ? 'Crítico' : 'Alarmante';

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>eNPS</CardDescription>
        {score !== null ? (
          <CardTitle className={`text-4xl font-bold ${getColor(score)}`}>{Math.round(score)}</CardTitle>
        ) : (
          <CardTitle className="text-3xl text-muted-foreground">—</CardTitle>
        )}
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {score !== null ? `${getLabel(score)} · ${total} respostas` : 'Nenhum ciclo'}
        </p>
      </CardContent>
    </Card>
  );
}

// ── Climate Score Card ──
function ClimateScoreCard({ score, total }: { score: number | null; total: number }) {
  const { label, color } = getClimateClassification(score);
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>Clima Geral</CardDescription>
        {score !== null ? (
          <CardTitle className={`text-4xl font-bold ${color}`}>{score.toFixed(1)}<span className="text-lg text-muted-foreground">/5</span></CardTitle>
        ) : (
          <CardTitle className="text-3xl text-muted-foreground">—</CardTitle>
        )}
      </CardHeader>
      <CardContent>
        <p className={`text-sm ${color}`}>{label}{total > 0 ? ` · ${total} respostas` : ''}</p>
      </CardContent>
    </Card>
  );
}

// ── Critical Dimension Card ──
function CriticalDimensionCard({ dimensions }: { dimensions: Record<string, number> }) {
  const entries = Object.entries(dimensions);
  if (entries.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Dimensão Crítica</CardDescription>
          <CardTitle className="text-3xl text-muted-foreground">—</CardTitle>
        </CardHeader>
        <CardContent><p className="text-sm text-muted-foreground">Sem dados</p></CardContent>
      </Card>
    );
  }

  const sorted = entries.sort((a, b) => a[1] - b[1]);
  const [worstKey, worstScore] = sorted[0];
  const { color } = getClimateClassification(worstScore);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>Dimensão Crítica</CardDescription>
        <CardTitle className={`text-2xl font-bold ${color}`}>
          {DIMENSION_LABELS[worstKey] || worstKey}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className={`text-sm ${color}`}>{worstScore.toFixed(1)}/5</p>
      </CardContent>
    </Card>
  );
}

// ── Risk Index Card ──
function RiskIndexCard({ riskIndex, factors }: { riskIndex: number | null; factors: string[] }) {
  const getRiskLevel = (v: number | null) => {
    if (v === null) return { label: 'Sem dados', color: 'text-muted-foreground', bg: 'bg-muted' };
    if (v >= 70) return { label: 'Verde', color: 'text-green-500', bg: 'bg-green-500/10' };
    if (v >= 40) return { label: 'Amarelo', color: 'text-amber-500', bg: 'bg-amber-500/10' };
    return { label: 'Vermelho', color: 'text-red-500', bg: 'bg-red-500/10' };
  };

  const { label, color, bg } = getRiskLevel(riskIndex);

  return (
    <Card className={bg}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <ShieldAlert className={`w-5 h-5 ${color}`} />
          <CardDescription>Índice de Risco</CardDescription>
        </div>
        <CardTitle className={`text-4xl font-bold ${color}`}>
          {riskIndex !== null ? riskIndex : '—'}
          {riskIndex !== null && <span className="text-lg text-muted-foreground">/100</span>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className={`text-sm font-medium ${color}`}>{label}</p>
        {factors.length > 0 && (
          <div className="mt-2 space-y-1">
            {factors.map((f, i) => (
              <p key={i} className="text-xs text-muted-foreground flex items-start gap-1">
                <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />{f}
              </p>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ── Climate Heatmap ──
function ClimateHeatmap({ dimensions }: { dimensions: Record<string, number> }) {
  const entries = Object.entries(dimensions);
  if (entries.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-2"><CardDescription>Heatmap por Dimensão</CardDescription></CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {entries.map(([key, score]) => {
            const { color } = getClimateClassification(score);
            const bgColor = score >= 4 ? 'bg-green-500/10' : score >= 3 ? 'bg-amber-500/10' : 'bg-red-500/10';
            return (
              <div key={key} className={`p-3 rounded-lg ${bgColor}`}>
                <p className="text-xs text-muted-foreground">{DIMENSION_LABELS[key] || key}</p>
                <p className={`text-xl font-bold ${color}`}>{score.toFixed(1)}</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// ── Comparison Chart (eNPS vs Climate) ──
function ComparisonChart({ enpsCycles, climateCycles }: {
  enpsCycles: Array<{ title: string; enps_score: number | null; created_at: string }>;
  climateCycles: Array<{ title: string; overall_score: number | null; created_at: string }>;
}) {
  // Merge by title or date proximity
  const enpsData = enpsCycles.filter(c => c.enps_score !== null).reverse();
  const climateData = climateCycles.filter(c => c.overall_score !== null).reverse();

  if (enpsData.length < 1 && climateData.length < 1) {
    return (
      <Card>
        <CardHeader className="pb-2"><CardDescription>eNPS vs Clima</CardDescription></CardHeader>
        <CardContent><p className="text-sm text-muted-foreground">Dados insuficientes</p></CardContent>
      </Card>
    );
  }

  // Simple: use index-based alignment
  const maxLen = Math.max(enpsData.length, climateData.length);
  const data = Array.from({ length: maxLen }, (_, i) => ({
    name: enpsData[i]?.title || climateData[i]?.title || `${i + 1}`,
    eNPS: enpsData[i] ? Math.round(((enpsData[i].enps_score! + 100) / 200) * 5 * 10) / 10 : null,
    Clima: climateData[i]?.overall_score ?? null,
  }));

  return (
    <Card>
      <CardHeader className="pb-2"><CardDescription>eNPS (normalizado) vs Clima</CardDescription></CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="name" className="text-xs" />
            <YAxis domain={[0, 5]} className="text-xs" />
            <Tooltip />
            <Line type="monotone" dataKey="eNPS" stroke="hsl(var(--primary))" strokeWidth={2} dot connectNulls />
            <Line type="monotone" dataKey="Clima" stroke="hsl(var(--chart-2))" strokeWidth={2} dot connectNulls />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// ── AI Insights Card (updated for strategy) ──
function AIInsightsCard({ companyId }: { companyId: string }) {
  const [insights, setInsights] = useState<Record<string, string> | null>(null);
  const [riskIndex, setRiskIndex] = useState<number | null>(null);
  const [riskFactors, setRiskFactors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchInsights = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('people-strategy-insights', {
        body: { company_id: companyId },
      });
      if (error) throw error;
      if (data?.insights) setInsights(data.insights);
      if (data?.risk_index !== undefined) setRiskIndex(data.risk_index);
      if (data?.risk_factors) setRiskFactors(data.risk_factors);
    } catch (err) {
      console.error('Error fetching AI insights:', err);
      toast.error('Erro ao gerar insights');
    } finally {
      setIsLoading(false);
    }
  };

  const sections = [
    { key: 'executive_summary', label: 'Resumo Executivo' },
    { key: 'top_risks', label: 'Principais Riscos' },
    { key: 'top_strengths', label: 'Principais Forças' },
    { key: 'trend_analysis', label: 'Tendência de Evolução' },
    { key: 'priority_action', label: 'Ação Prioritária' },
    { key: 'priority_dimension', label: 'Dimensão a Priorizar' },
    { key: 'profile_needing_support', label: 'Perfil que Precisa de Suporte' },
  ];

  return (
    <Card className="col-span-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">Diagnóstico Estratégico IA</CardTitle>
          </div>
          <Button size="sm" onClick={fetchInsights} disabled={isLoading} className="gap-2">
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {insights ? 'Atualizar' : 'Gerar Diagnóstico'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {!insights ? (
          <p className="text-sm text-muted-foreground">
            Clique em "Gerar Diagnóstico" para cruzar eNPS + Clima + Perfil Comportamental.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sections.map(({ key, label }) => {
              const value = insights[key];
              if (!value || value === 'N/A') return null;
              return (
                <div key={key} className={key === 'executive_summary' ? 'md:col-span-2' : ''}>
                  <h4 className="text-sm font-semibold text-foreground mb-1">{label}</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">{value}</p>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ── Create Cycle Dialog (reusable for eNPS and Climate) ──
function CreateCycleDialog({ type, onCreated }: { type: 'enps' | 'climate'; onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [endDate, setEndDate] = useState('');
  const { createCycle: createENPS } = useENPS();
  const { createCycle: createClimate } = useClimate();

  const handleCreate = async () => {
    if (!title.trim()) { toast.error('Informe o título'); return; }
    const fn = type === 'enps' ? createENPS : createClimate;
    const result = await fn(title, endDate || undefined);
    if (result) { setOpen(false); setTitle(''); setEndDate(''); onCreated(); }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-1.5">
          <Plus className="w-3.5 h-3.5" />
          {type === 'enps' ? 'eNPS' : 'Clima'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Ciclo {type === 'enps' ? 'eNPS' : 'Clima'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div><Label>Título</Label><Input placeholder="Ex: Q1 2026" value={title} onChange={e => setTitle(e.target.value)} /></div>
          <div><Label>Encerramento (opcional)</Label><Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} /></div>
          <Button onClick={handleCreate} className="w-full">Criar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Cycle Pills ──
function CyclePills({ cycles, onActivate, onClose }: {
  cycles: Array<{ id: string; title: string; status: string }>;
  onActivate: (id: string) => void;
  onClose: (id: string) => void;
}) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {cycles.slice(0, 5).map(cycle => (
        <div key={cycle.id} className="flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs bg-card">
          <span className={
            cycle.status === 'active' ? 'text-green-500 font-medium' :
            cycle.status === 'closed' ? 'text-muted-foreground' : 'text-amber-500'
          }>{cycle.title}</span>
          {cycle.status === 'draft' && (
            <button onClick={() => onActivate(cycle.id)} className="hover:text-primary"><Play className="w-3 h-3" /></button>
          )}
          {cycle.status === 'active' && (
            <button onClick={() => onClose(cycle.id)} className="hover:text-primary"><Square className="w-3 h-3" /></button>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Main Page ──
export default function BusinessPeopleStrategy() {
  const { company } = useBusinessAuth();
  const enps = useENPS();
  const climate = useClimate();
  const { insights: teamInsights, fetchInsights: fetchTeamInsights } = useTeamInsights();

  // AI-computed risk from edge function
  const [riskIndex, setRiskIndex] = useState<number | null>(null);
  const [riskFactors, setRiskFactors] = useState<string[]>([]);

  useEffect(() => {
    enps.fetchCycles();
    climate.fetchCycles();
    fetchTeamInsights();
  }, [enps.fetchCycles, climate.fetchCycles, fetchTeamInsights]);

  const displayEnps = enps.activeCycle || enps.cycles.find(c => c.status === 'closed' && c.enps_score !== null) || null;
  const displayClimate = climate.activeCycle || climate.cycles.find(c => c.status === 'closed' && c.overall_score !== null) || null;

  const refreshAll = () => { enps.fetchCycles(); climate.fetchCycles(); };

  return (
    <BusinessLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-primary" />
              People Strategy — CEO View
            </h1>
            <p className="text-muted-foreground mt-1">
              Visão executiva integrada: eNPS + Clima + Perfil Comportamental
            </p>
          </div>
          <div className="flex items-center gap-2">
            <CreateCycleDialog type="enps" onCreated={refreshAll} />
            <CreateCycleDialog type="climate" onCreated={refreshAll} />
          </div>
        </div>

        {/* Cycle management */}
        {(enps.cycles.length > 0 || climate.cycles.length > 0) && (
          <div className="flex flex-col sm:flex-row gap-4">
            {enps.cycles.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">eNPS</p>
                <CyclePills cycles={enps.cycles} onActivate={enps.activateCycle} onClose={enps.closeCycle} />
              </div>
            )}
            {climate.cycles.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Clima</p>
                <CyclePills cycles={climate.cycles} onActivate={climate.activateCycle} onClose={climate.closeCycle} />
              </div>
            )}
          </div>
        )}

        {/* Top 4 Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ENPSScoreCard score={displayEnps?.enps_score ?? null} total={displayEnps?.total_responses ?? 0} />
          <ClimateScoreCard score={displayClimate?.overall_score ?? null} total={displayClimate?.total_responses ?? 0} />
          <CriticalDimensionCard dimensions={displayClimate?.dimension_scores ?? {}} />
          <RiskIndexCard riskIndex={riskIndex} factors={riskFactors} />
        </div>

        {/* Heatmap + Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ClimateHeatmap dimensions={displayClimate?.dimension_scores ?? {}} />
          <ComparisonChart enpsCycles={enps.cycles} climateCycles={climate.cycles} />
        </div>

        {/* DISC Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2"><CardDescription>Distribuição DISC</CardDescription></CardHeader>
            <CardContent>
              {teamInsights?.disc_distribution && Object.keys(teamInsights.disc_distribution).length > 0 ? (
                <div className="space-y-2">
                  {Object.entries(teamInsights.disc_distribution).map(([profile, count]) => {
                    const total = Object.values(teamInsights.disc_distribution).reduce((a, b) => a + b, 0);
                    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                    return (
                      <div key={profile} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{profile}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs text-muted-foreground w-10 text-right">{pct}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Sem dados DISC</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Equipe</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                <Users className="w-6 h-6 text-muted-foreground" />
                {teamInsights?.total_members ?? '—'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {teamInsights?.completed_assessments ?? 0} com avaliação completa
              </p>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights */}
        {company?.id && <AIInsightsCard companyId={company.id} />}
      </div>
    </BusinessLayout>
  );
}
