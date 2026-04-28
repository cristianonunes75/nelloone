import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BarChart3, RefreshCw, Shield, Users, TrendingUp, AlertTriangle, Scale, CheckCircle2 } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Cell, PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { BusinessLayout } from '../components/BusinessLayout';
import { useBusinessAuth } from '../hooks/useBusinessAuth';
import { useBusinessEnforcement } from '../hooks/useBusinessEnforcement';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

type ComparisonRow = {
  user_id: string;
  full_name: string;
  job_title: string | null;
  department: string | null;
  disc_profile: string | null;
  disc_secondary: string | null;
  disc_scores: Record<string, number> | null;
  disc_percentages: Record<string, number> | null;
  disc_completed_at: string | null;
  temperament_profile: string | null;
  temperament_secondary: string | null;
  temperament_scores: Record<string, number> | null;
  temperament_ranking: Array<{ temperament?: string; name?: string; percentage?: number }> | null;
  temperament_completed_at: string | null;
};

type DistributionItem = { key: string; label: string; count: number; percent: number; fill: string };

type RadarItem = { axis: string; value: number; fullMark: number };

const DISC_LABELS: Record<string, string> = {
  D: 'Dominância',
  I: 'Influência',
  S: 'Estabilidade',
  C: 'Conformidade',
};

const DISC_FILLS: Record<string, string> = {
  D: 'hsl(var(--destructive))',
  I: 'hsl(var(--accent))',
  S: 'hsl(var(--primary))',
  C: 'hsl(var(--secondary-foreground))',
};

const TEMPERAMENT_LABELS: Record<string, string> = {
  sanguineo: 'Sanguíneo',
  colerico: 'Colérico',
  melancolico: 'Melancólico',
  fleumatico: 'Fleumático',
};

const TEMPERAMENT_FILLS: Record<string, string> = {
  sanguineo: 'hsl(var(--accent))',
  colerico: 'hsl(var(--destructive))',
  melancolico: 'hsl(var(--primary))',
  fleumatico: 'hsl(var(--secondary-foreground))',
};

function normalizeKey(value?: string | null) {
  return value?.trim().toLowerCase() || '';
}

function normalizeDisc(value?: string | null) {
  const key = value?.trim().toUpperCase();
  return key && DISC_LABELS[key] ? key : null;
}

function formatDate(value?: string | null) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('pt-BR').format(new Date(value));
}

function buildDistribution(rows: ComparisonRow[], field: 'disc_profile' | 'temperament_profile', labels: Record<string, string>, fills: Record<string, string>): DistributionItem[] {
  const counts = rows.reduce<Record<string, number>>((acc, row) => {
    const raw = field === 'disc_profile' ? normalizeDisc(row[field]) : normalizeKey(row[field]);
    if (raw) acc[raw] = (acc[raw] || 0) + 1;
    return acc;
  }, {});
  const total = Object.values(counts).reduce((sum, count) => sum + count, 0);

  return Object.entries(labels).map(([key, label]) => ({
    key,
    label,
    count: counts[key] || 0,
    percent: total > 0 ? Math.round(((counts[key] || 0) / total) * 100) : 0,
    fill: fills[key] || 'hsl(var(--muted-foreground))',
  }));
}

function getAverageRadar(rows: ComparisonRow[], kind: 'disc' | 'temperament'): RadarItem[] {
  const keys = kind === 'disc' ? Object.keys(DISC_LABELS) : Object.keys(TEMPERAMENT_LABELS);
  const labels = kind === 'disc' ? DISC_LABELS : TEMPERAMENT_LABELS;
  const totals = keys.reduce<Record<string, { sum: number; count: number }>>((acc, key) => {
    acc[key] = { sum: 0, count: 0 };
    return acc;
  }, {});

  rows.forEach((row) => {
    const scores = kind === 'disc' ? row.disc_percentages : row.temperament_scores;
    keys.forEach((key) => {
      const value = scores?.[key];
      if (typeof value === 'number') {
        totals[key].sum += value;
        totals[key].count += 1;
      }
    });
  });

  return keys.map((key) => ({
    axis: labels[key],
    value: totals[key].count > 0 ? Math.round(totals[key].sum / totals[key].count) : 0,
    fullMark: 100,
  }));
}

function ExecutiveSummary({ rows, discData, temperamentData }: { rows: ComparisonRow[]; discData: DistributionItem[]; temperamentData: DistributionItem[] }) {
  const mappedDisc = rows.filter((row) => row.disc_profile).length;
  const mappedTemperament = rows.filter((row) => row.temperament_profile).length;
  const topDisc = [...discData].sort((a, b) => b.count - a.count)[0];
  const topTemperament = [...temperamentData].sort((a, b) => b.count - a.count)[0];
  const concentration = Math.max(topDisc?.percent || 0, topTemperament?.percent || 0);
  const coverage = rows.length > 0 ? Math.round((Math.min(mappedDisc, mappedTemperament) / rows.length) * 100) : 0;

  const summary = rows.length === 0
    ? 'Ainda não há dados compartilhados suficientes para comparar a equipe.'
    : `A equipe tem predominância em ${topDisc?.label || 'DISC ainda indefinido'} e ${topTemperament?.label || 'temperamento ainda indefinido'}. A cobertura comparável está em ${coverage}% das colaboradoras ativas com consentimento.`;

  const attention = concentration >= 60
    ? 'Há concentração alta em um eixo comportamental. Equilibre delegando funções que peçam estilos complementares.'
    : concentration >= 40
      ? 'Existe uma tendência predominante, mas ainda com diversidade útil para compor pares de trabalho.'
      : 'A distribuição está equilibrada, favorecendo colaboração entre diferentes estilos.';

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="h-5 w-5 text-primary" />
          Resumo executivo da equipe
        </CardTitle>
        <CardDescription>Leitura agregada para tomada de decisão como empresário.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-3 text-sm leading-relaxed">
          <p>{summary}</p>
          <p className="text-muted-foreground">{attention}</p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Metric label="Colaboradoras" value={rows.length} />
          <Metric label="DISC" value={mappedDisc} />
          <Metric label="Temperamentos" value={mappedTemperament} />
        </div>
      </CardContent>
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border bg-background/60 p-3 text-center">
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function DistributionChart({ title, data }: { title: string; data: DistributionItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
              <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} formatter={(value, name, item) => [`${value} colaboradora(s) · ${item.payload.percent}%`, 'Total']} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {data.map((entry) => <Cell key={entry.key} fill={entry.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function TeamRadar({ title, data }: { title: string; data: RadarItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data} outerRadius="72%">
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="axis" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
              <Tooltip formatter={(value) => [`${value}%`, 'Média']} />
              <Radar dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.22} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function CollaboratorCard({ row }: { row: ComparisonRow }) {
  const discKey = normalizeDisc(row.disc_profile);
  const tempKey = normalizeKey(row.temperament_profile);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base">{row.full_name}</CardTitle>
            <CardDescription>{[row.job_title, row.department].filter(Boolean).join(' · ') || 'Sem função informada'}</CardDescription>
          </div>
          {discKey && tempKey ? (
            <Badge variant="secondary" className="gap-1"><CheckCircle2 className="h-3 w-3" /> Completo</Badge>
          ) : (
            <Badge variant="outline" className="gap-1"><AlertTriangle className="h-3 w-3" /> Parcial</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border p-3">
          <p className="text-xs text-muted-foreground">DISC</p>
          <p className="mt-1 font-semibold">{discKey ? DISC_LABELS[discKey] : 'Não mapeado'}</p>
          <p className="text-xs text-muted-foreground">Secundário: {normalizeDisc(row.disc_secondary) ? DISC_LABELS[normalizeDisc(row.disc_secondary)!] : '—'}</p>
          <p className="mt-2 text-xs text-muted-foreground">Concluído em {formatDate(row.disc_completed_at)}</p>
        </div>
        <div className="rounded-lg border p-3">
          <p className="text-xs text-muted-foreground">Temperamento</p>
          <p className="mt-1 font-semibold">{tempKey ? TEMPERAMENT_LABELS[tempKey] || row.temperament_profile : 'Não mapeado'}</p>
          <p className="text-xs text-muted-foreground">Secundário: {TEMPERAMENT_LABELS[normalizeKey(row.temperament_secondary)] || row.temperament_secondary || '—'}</p>
          <p className="mt-2 text-xs text-muted-foreground">Concluído em {formatDate(row.temperament_completed_at)}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function BusinessTeamComparison() {
  const { company } = useBusinessAuth();
  const enforcement = useBusinessEnforcement();
  const [rows, setRows] = useState<ComparisonRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!company?.id) return;
    setIsLoading(true);
    const { data, error } = await (supabase as any).rpc('get_company_behavioral_comparison', { p_company_id: company.id });
    if (error) {
      console.error('Erro ao carregar comparação comportamental:', error);
      toast.error('Erro ao carregar comparação da equipe');
    } else {
      setRows((data || []) as ComparisonRow[]);
    }
    setIsLoading(false);
  }, [company?.id]);

  useEffect(() => {
    if (enforcement.canViewInsights) loadData();
  }, [enforcement.canViewInsights, loadData]);

  const discData = useMemo(() => buildDistribution(rows, 'disc_profile', DISC_LABELS, DISC_FILLS), [rows]);
  const temperamentData = useMemo(() => buildDistribution(rows, 'temperament_profile', TEMPERAMENT_LABELS, TEMPERAMENT_FILLS), [rows]);
  const discRadar = useMemo(() => getAverageRadar(rows, 'disc'), [rows]);
  const temperamentRadar = useMemo(() => getAverageRadar(rows, 'temperament'), [rows]);

  if (!enforcement.canViewInsights) {
    return (
      <BusinessLayout>
        <Card className="mx-auto max-w-lg">
          <CardContent className="py-12 text-center">
            <Shield className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h1 className="text-lg font-semibold">Recurso indisponível</h1>
            <p className="mt-2 text-sm text-muted-foreground">A comparação de equipe está disponível para empresas com assinatura ativa.</p>
          </CardContent>
        </Card>
      </BusinessLayout>
    );
  }

  return (
    <BusinessLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="gap-2 px-0 hover:bg-transparent">
                <ArrowLeft className="h-4 w-4" /> Voltar
              </Button>
            </Link>
            <div>
              <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
                <Scale className="h-6 w-6 text-primary" />
                Comparação comportamental da equipe
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">DISC e Temperamentos das colaboradoras com compartilhamento autorizado.</p>
            </div>
          </div>
          <Button variant="outline" onClick={loadData} disabled={isLoading} className="gap-2">
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} /> Atualizar
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-40" />
            <div className="grid gap-4 lg:grid-cols-2"><Skeleton className="h-80" /><Skeleton className="h-80" /></div>
          </div>
        ) : rows.length === 0 ? (
          <Card className="mx-auto max-w-xl border-dashed">
            <CardContent className="py-12 text-center">
              <Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h2 className="text-lg font-semibold">Ainda não há resultados compartilhados</h2>
              <p className="mt-2 text-sm text-muted-foreground">Convide colaboradoras para a jornada e confirme o consentimento de compartilhamento para ativar esta visão.</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <ExecutiveSummary rows={rows} discData={discData} temperamentData={temperamentData} />

            <div className="grid gap-6 xl:grid-cols-2">
              <DistributionChart title="Distribuição DISC" data={discData} />
              <DistributionChart title="Distribuição de Temperamentos" data={temperamentData} />
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <TeamRadar title="Média da equipe por eixo DISC" data={discRadar} />
              <TeamRadar title="Média da equipe por temperamento" data={temperamentRadar} />
            </div>

            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Comparação por colaboradora</h2>
              </div>
              <div className="grid gap-4 xl:grid-cols-2">
                {rows.map((row) => <CollaboratorCard key={row.user_id} row={row} />)}
              </div>
            </section>

            <div className="flex items-start gap-2 rounded-lg border border-dashed bg-muted/30 p-3 text-xs text-muted-foreground">
              <Shield className="mt-0.5 h-4 w-4 shrink-0" />
              <span>Esta página exibe dados individuais apenas das colaboradoras ativas que autorizaram o compartilhamento com a empresa. O acesso é restrito aos administradores da empresa.</span>
            </div>
          </>
        )}
      </div>
    </BusinessLayout>
  );
}
