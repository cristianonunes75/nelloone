/**
 * Team Insights Tab - shows aggregated team trends and health alerts.
 * Only visible to companies with active subscriptions.
 * Never exposes individual data - LGPD compliant.
 */

import { useEffect, useState } from 'react';
import { 
  BarChart3, RefreshCw, AlertTriangle, TrendingUp, 
  Users, Shield, Lightbulb, Clock, CheckCircle, Target
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useTeamInsights, type TeamInsightsData, type HealthAlert } from '../hooks/useTeamInsights';
import { useBusinessEnforcement } from '../hooks/useBusinessEnforcement';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function TeamInsightsTab() {
  const { insights, alerts, isLoading, lastCalculated, fetchInsights, recalculateInsights } = useTeamInsights();
  const enforcement = useBusinessEnforcement();
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (!hasLoaded && enforcement.canViewInsights) {
      fetchInsights();
      setHasLoaded(true);
    }
  }, [hasLoaded, enforcement.canViewInsights, fetchInsights]);

  if (!enforcement.canViewInsights) {
    return (
      <Card className="max-w-lg mx-auto">
        <CardContent className="text-center py-12">
          <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Recurso indisponível</h3>
          <p className="text-sm text-muted-foreground">
            Team Insights está disponível para empresas com assinatura ativa.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading && !insights) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-32" />)}
      </div>
    );
  }

  const hasData = insights && insights.completed_assessments > 0;

  return (
    <div className="space-y-6">
      {/* Header with refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Team Insights
          </h3>
          {lastCalculated && (
            <p className="text-xs text-muted-foreground mt-1">
              Atualizado em {format(new Date(lastCalculated), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
            </p>
          )}
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={recalculateInsights}
          disabled={isLoading}
          className="gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Recalcular
        </Button>
      </div>

      {/* Health Alerts */}
      {alerts.length > 0 && (
        <HealthAlertsSection alerts={alerts} />
      )}

      {!hasData ? (
        <EmptyInsightsCard />
      ) : (
        <>
          {/* Overview Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              label="Total de membros"
              value={insights.total_members}
              icon={<Users className="w-4 h-4" />}
            />
            <StatCard
              label="Avaliações concluídas"
              value={insights.completed_assessments}
              icon={<CheckCircle className="w-4 h-4" />}
            />
            <StatCard
              label="Pontos fortes"
              value={insights.team_strengths.length}
              icon={<TrendingUp className="w-4 h-4" />}
            />
            <StatCard
              label="Áreas de atenção"
              value={insights.conflict_risk_areas.length}
              icon={<AlertTriangle className="w-4 h-4" />}
            />
          </div>

          {/* Distribution Charts */}
          <div className="grid md:grid-cols-2 gap-6">
            <DistributionCard
              title="Distribuição DISC"
              data={insights.disc_distribution}
              colors={['bg-blue-500', 'bg-yellow-500', 'bg-green-500', 'bg-red-500']}
            />
            <DistributionCard
              title="Distribuição de Temperamentos"
              data={insights.temperament_distribution}
              colors={['bg-orange-500', 'bg-sky-500', 'bg-emerald-500', 'bg-purple-500']}
            />
          </div>

          {/* Strengths & Growth */}
          <div className="grid md:grid-cols-2 gap-6">
            <InsightListCard
              title="Pontos Fortes da Equipe"
              items={insights.team_strengths}
              icon={<TrendingUp className="w-5 h-5 text-emerald-500" />}
              emptyText="Dados insuficientes"
            />
            <InsightListCard
              title="Áreas de Crescimento"
              items={insights.team_growth_areas}
              icon={<Target className="w-5 h-5 text-amber-500" />}
              emptyText="Equipe bem equilibrada"
            />
          </div>

          {/* Management Recommendations */}
          <InsightListCard
            title="Recomendações de Gestão"
            items={insights.management_recommendations}
            icon={<Lightbulb className="w-5 h-5 text-primary" />}
            emptyText="Sem recomendações no momento"
          />

          {/* LGPD Notice */}
          <div className="text-xs text-muted-foreground p-3 bg-muted/30 rounded-lg border border-dashed flex items-start gap-2">
            <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>
              Todos os dados exibidos são agregados. Nenhuma informação individual de colaborador
              é revelada. Apenas colaboradores que deram consentimento explícito são incluídos na análise.
              Acessos são registrados para fins de auditoria (LGPD).
            </span>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Sub-components ─────────────────────────────────────────────

function StatCard({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="pt-4 pb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-muted-foreground">{icon}</span>
        </div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  );
}

function DistributionCard({ title, data, colors }: { title: string; data: Record<string, number>; colors: string[] }) {
  const entries = Object.entries(data);
  if (entries.length === 0) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-sm">{title}</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Dados insuficientes</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {entries.map(([label, pct], i) => (
          <div key={label} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>{label}</span>
              <span className="font-medium">{pct}%</span>
            </div>
            <Progress value={pct} className={`h-2 [&>div]:${colors[i % colors.length]}`} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function InsightListCard({ title, items, icon, emptyText }: { 
  title: string; items: string[]; icon: React.ReactNode; emptyText: string 
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">{icon} {title}</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">{emptyText}</p>
        ) : (
          <ul className="space-y-2">
            {items.map((item, i) => (
              <li key={i} className="text-sm flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

function HealthAlertsSection({ alerts }: { alerts: HealthAlert[] }) {
  const severityColor: Record<string, string> = {
    critical: 'border-destructive bg-destructive/5',
    warning: 'border-amber-500 bg-amber-500/5',
    info: 'border-blue-500 bg-blue-500/5',
  };

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-500" />
        Alertas de saúde da equipe
      </h4>
      {alerts.map(alert => (
        <div 
          key={alert.id} 
          className={`p-3 rounded-lg border ${severityColor[alert.severity] || severityColor.info}`}
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">{alert.title}</p>
            <Badge variant={alert.severity === 'critical' ? 'destructive' : 'outline'} className="text-xs">
              {alert.severity}
            </Badge>
          </div>
          {alert.description && (
            <p className="text-xs text-muted-foreground mt-1">{alert.description}</p>
          )}
        </div>
      ))}
    </div>
  );
}

function EmptyInsightsCard() {
  return (
    <Card className="max-w-lg mx-auto">
      <CardContent className="text-center py-12">
        <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Sem dados suficientes</h3>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          Os insights da equipe serão gerados quando colaboradores concluírem suas
          avaliações (Identity) e derem consentimento para compartilhar dados com a empresa.
        </p>
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>Clique em "Recalcular" quando houver dados disponíveis</span>
        </div>
      </CardContent>
    </Card>
  );
}
