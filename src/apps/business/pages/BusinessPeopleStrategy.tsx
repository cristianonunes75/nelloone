import { useState, useEffect } from 'react';
import { BusinessLayout } from '../components/BusinessLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useENPS } from '../hooks/useENPS';
import { useTeamInsights } from '../hooks/useTeamInsights';
import { useBusinessAuth } from '../hooks/useBusinessAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  BarChart3, 
  Brain,
  Plus,
  Play,
  Square,
  Loader2,
  Sparkles,
  FileDown,
  Users
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function ENPSScoreCard({ score, total }: { score: number | null; total: number }) {
  if (score === null) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>eNPS Atual</CardDescription>
          <CardTitle className="text-3xl">—</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Nenhum ciclo ativo</p>
        </CardContent>
      </Card>
    );
  }

  const getScoreColor = (s: number) => {
    if (s >= 50) return 'text-green-500';
    if (s >= 0) return 'text-amber-500';
    return 'text-red-500';
  };

  const getScoreIcon = (s: number) => {
    if (s >= 50) return <TrendingUp className="w-5 h-5 text-green-500" />;
    if (s >= 0) return <Minus className="w-5 h-5 text-amber-500" />;
    return <TrendingDown className="w-5 h-5 text-red-500" />;
  };

  const getScoreLabel = (s: number) => {
    if (s >= 75) return 'Excelente';
    if (s >= 50) return 'Muito Bom';
    if (s >= 0) return 'Razoável';
    if (s >= -50) return 'Crítico';
    return 'Alarmante';
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>eNPS Atual</CardDescription>
        <div className="flex items-center gap-3">
          <CardTitle className={`text-4xl font-bold ${getScoreColor(score)}`}>
            {Math.round(score)}
          </CardTitle>
          {getScoreIcon(score)}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {getScoreLabel(score)} · {total} respostas
        </p>
      </CardContent>
    </Card>
  );
}

function ENPSDistributionCard({ promoters, neutrals, detractors }: { promoters: number; neutrals: number; detractors: number }) {
  const total = promoters + neutrals + detractors;
  const data = [
    { name: 'Promotores', value: promoters, color: 'hsl(var(--chart-2))' },
    { name: 'Neutros', value: neutrals, color: 'hsl(var(--chart-4))' },
    { name: 'Detratores', value: detractors, color: 'hsl(var(--chart-1))' },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>Distribuição</CardDescription>
      </CardHeader>
      <CardContent>
        {total === 0 ? (
          <p className="text-sm text-muted-foreground">Sem dados</p>
        ) : (
          <div className="space-y-3">
            {data.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{item.value}</span>
                  <span className="text-xs text-muted-foreground">
                    ({total > 0 ? Math.round((item.value / total) * 100) : 0}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ENPSHistoryChart({ cycles }: { cycles: Array<{ title: string; enps_score: number | null; created_at: string }> }) {
  const data = cycles
    .filter(c => c.enps_score !== null)
    .reverse()
    .map(c => ({
      name: c.title,
      score: Math.round(c.enps_score!),
      date: new Date(c.created_at).toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
    }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>Evolução Histórica</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length < 2 ? (
          <p className="text-sm text-muted-foreground">Mínimo 2 ciclos para visualizar tendência</p>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" className="text-xs" />
              <YAxis domain={[-100, 100]} className="text-xs" />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

function AIInsightsCard({ companyId }: { companyId: string }) {
  const [insights, setInsights] = useState<Record<string, string> | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchInsights = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('people-enps-insights', {
        body: { company_id: companyId },
      });

      if (error) throw error;
      if (data?.insights) {
        setInsights(data.insights);
      }
    } catch (err) {
      console.error('Error fetching AI insights:', err);
      toast.error('Erro ao gerar insights');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="col-span-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">Análise Estratégica IA</CardTitle>
          </div>
          <Button size="sm" onClick={fetchInsights} disabled={isLoading} className="gap-2">
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {insights ? 'Atualizar' : 'Gerar Análise'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {!insights ? (
          <p className="text-sm text-muted-foreground">
            Clique em "Gerar Análise" para obter insights estratégicos baseados nos dados da sua empresa.
          </p>
        ) : (
          <div className="space-y-4">
            {insights.executive_summary && (
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-1">Resumo Executivo</h4>
                <p className="text-sm text-muted-foreground">{insights.executive_summary}</p>
              </div>
            )}
            {insights.main_risks && (
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-1">Principais Riscos</h4>
                <p className="text-sm text-muted-foreground">{insights.main_risks}</p>
              </div>
            )}
            {insights.most_engaged_profile && (
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-1">Perfil Mais Engajado</h4>
                <p className="text-sm text-muted-foreground">{insights.most_engaged_profile}</p>
              </div>
            )}
            {insights.least_engaged_profile && (
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-1">Perfil Menos Engajado</h4>
                <p className="text-sm text-muted-foreground">{insights.least_engaged_profile}</p>
              </div>
            )}
            {insights.strategic_recommendation && (
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-1">Recomendação Estratégica</h4>
                <p className="text-sm text-muted-foreground">{insights.strategic_recommendation}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function CreateCycleDialog({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [endDate, setEndDate] = useState('');
  const { createCycle } = useENPS();

  const handleCreate = async () => {
    if (!title.trim()) {
      toast.error('Informe o título do ciclo');
      return;
    }
    const result = await createCycle(title, endDate || undefined);
    if (result) {
      setOpen(false);
      setTitle('');
      setEndDate('');
      onCreated();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Novo Ciclo
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Ciclo eNPS</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div>
            <Label>Título</Label>
            <Input 
              placeholder="Ex: Q1 2026" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
            />
          </div>
          <div>
            <Label>Data de Encerramento (opcional)</Label>
            <Input 
              type="date" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)} 
            />
          </div>
          <Button onClick={handleCreate} className="w-full">Criar Ciclo</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function BusinessPeopleStrategy() {
  const { company } = useBusinessAuth();
  const { cycles, activeCycle, isLoading, fetchCycles, activateCycle, closeCycle } = useENPS();
  const { insights: teamInsights, fetchInsights: fetchTeamInsights } = useTeamInsights();

  useEffect(() => {
    fetchCycles();
    fetchTeamInsights();
  }, [fetchCycles, fetchTeamInsights]);

  const latestClosedWithScore = cycles.find(c => c.status === 'closed' && c.enps_score !== null);
  const displayCycle = activeCycle || latestClosedWithScore || null;

  return (
    <BusinessLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-primary" />
              People Strategy — CEO View
            </h1>
            <p className="text-muted-foreground mt-1">
              Visão executiva do engajamento e perfil comportamental da equipe
            </p>
          </div>
          <CreateCycleDialog onCreated={fetchCycles} />
        </div>

        {/* Cycles Management */}
        {cycles.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            {cycles.slice(0, 5).map(cycle => (
              <div key={cycle.id} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm bg-card">
                <span className={
                  cycle.status === 'active' ? 'text-green-500 font-medium' :
                  cycle.status === 'closed' ? 'text-muted-foreground' : 'text-amber-500'
                }>
                  {cycle.title}
                </span>
                {cycle.status === 'draft' && (
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => activateCycle(cycle.id)}>
                    <Play className="w-3 h-3" />
                  </Button>
                )}
                {cycle.status === 'active' && (
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => closeCycle(cycle.id)}>
                    <Square className="w-3 h-3" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ENPSScoreCard 
            score={displayCycle?.enps_score ?? null} 
            total={displayCycle?.total_responses ?? 0} 
          />
          <ENPSDistributionCard 
            promoters={displayCycle?.promoters_count ?? 0}
            neutrals={displayCycle?.neutrals_count ?? 0}
            detractors={displayCycle?.detractors_count ?? 0}
          />
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

        {/* History + DISC Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ENPSHistoryChart cycles={cycles} />
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Distribuição por Perfil DISC</CardDescription>
            </CardHeader>
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
                <p className="text-sm text-muted-foreground">Sem dados DISC disponíveis</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* AI Insights */}
        {company?.id && <AIInsightsCard companyId={company.id} />}
      </div>
    </BusinessLayout>
  );
}
