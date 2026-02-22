/**
 * Organizational Impact Tab - shows team evolution, behavior indicators,
 * cultural trends, and organizational alerts.
 * Part of the Identity Corporate growth system.
 */

import { useEffect, useState, useCallback } from 'react';
import { 
  TrendingUp, Activity, Globe, AlertTriangle, Shield,
  FileText, Share2, Award, Users, RefreshCw, Clock, Download
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTeamInsights } from '../hooks/useTeamInsights';
import { useBusinessEnforcement } from '../hooks/useBusinessEnforcement';
import { useBusinessAuth } from '../hooks/useBusinessAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function OrganizationalImpactTab() {
  const { insights, alerts, isLoading, lastCalculated, fetchInsights, recalculateInsights } = useTeamInsights();
  const enforcement = useBusinessEnforcement();
  const { company, isCompanyAdmin } = useBusinessAuth();
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [badges, setBadges] = useState<Array<{ id: string; badge_name: string; badge_type: string; awarded_at: string }>>([]);

  useEffect(() => {
    if (!hasLoaded && enforcement.canViewInsights && company?.id) {
      fetchInsights();
      fetchBadges();
      setHasLoaded(true);
    }
  }, [hasLoaded, enforcement.canViewInsights, company?.id, fetchInsights]);

  const fetchBadges = useCallback(async () => {
    if (!company?.id) return;
    const { data } = await supabase
      .from('company_badges')
      .select('id, badge_name, badge_type, awarded_at')
      .eq('company_id', company.id)
      .eq('is_active', true);
    setBadges(data || []);
  }, [company?.id]);

  const handleGenerateReport = async () => {
    if (!company?.id) return;
    setIsGeneratingReport(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-executive-report', {
        body: { company_id: company.id },
      });
      if (error) throw error;
      if (data?.reportUrl) {
        window.open(data.reportUrl, '_blank');
        toast.success('Relatório executivo gerado com sucesso');
      } else if (data?.reportId) {
        toast.success('Relatório executivo gerado. Verifique a aba de relatórios.');
      }
    } catch (err) {
      console.error('Error generating executive report:', err);
      toast.error('Erro ao gerar relatório executivo');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  if (!enforcement.canViewInsights) {
    return (
      <Card className="max-w-lg mx-auto">
        <CardContent className="text-center py-12">
          <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Recurso indisponível</h3>
          <p className="text-sm text-muted-foreground">
            Impacto Organizacional está disponível para empresas com licença Identity Corporate ativa.
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Impacto Organizacional
          </h3>
          {lastCalculated && (
            <p className="text-xs text-muted-foreground mt-1">
              Atualizado em {format(new Date(lastCalculated), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          {isCompanyAdmin && hasData && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerateReport}
              disabled={isGeneratingReport}
              className="gap-2"
            >
              <FileText className={`w-4 h-4 ${isGeneratingReport ? 'animate-pulse' : ''}`} />
              Relatório Executivo
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={recalculateInsights}
            disabled={isLoading}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
      </div>

      {!hasData ? (
        <EmptyImpactCard />
      ) : (
        <Tabs defaultValue="evolution" className="space-y-4">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="evolution">Evolução</TabsTrigger>
            <TabsTrigger value="behavior">Comportamento</TabsTrigger>
            <TabsTrigger value="culture">Cultura</TabsTrigger>
            <TabsTrigger value="alerts">Alertas</TabsTrigger>
          </TabsList>

          {/* Team Evolution */}
          <TabsContent value="evolution" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <EvolutionCard
                title="Membros ativos"
                value={insights.total_members}
                subtitle="na empresa"
                icon={<Users className="w-5 h-5 text-primary" />}
              />
              <EvolutionCard
                title="Avaliações concluídas"
                value={insights.completed_assessments}
                subtitle={`${insights.total_members > 0 ? Math.round((insights.completed_assessments / insights.total_members) * 100) : 0}% de adesão`}
                icon={<TrendingUp className="w-5 h-5 text-emerald-500" />}
              />
              <EvolutionCard
                title="Pontos fortes identificados"
                value={insights.team_strengths.length}
                subtitle="na equipe"
                icon={<Award className="w-5 h-5 text-amber-500" />}
              />
            </div>

            {/* Strengths */}
            {insights.team_strengths.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Pontos Fortes da Equipe</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {insights.team_strengths.map((s, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">{s}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Growth areas */}
            {insights.team_growth_areas.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Áreas de Crescimento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {insights.team_growth_areas.map((g, i) => (
                      <Badge key={i} variant="outline" className="text-xs">{g}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Behavior Indicators */}
          <TabsContent value="behavior" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <DistributionCard title="Perfil DISC Agregado" data={insights.disc_distribution} />
              <DistributionCard title="Temperamentos da Equipe" data={insights.temperament_distribution} />
            </div>

            {insights.communication_styles && Object.keys(insights.communication_styles).length > 0 && (
              <DistributionCard title="Estilos de Comunicação" data={insights.communication_styles} />
            )}

            {insights.management_recommendations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Recomendações de Gestão
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {insights.management_recommendations.map((r, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary font-bold">•</span>
                        {r}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Cultural Trends */}
          <TabsContent value="culture" className="space-y-4">
            {insights.leadership_potential_indicators.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Indicadores de Potencial de Liderança</CardTitle>
                  <CardDescription>Tendências culturais identificadas na equipe</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {insights.leadership_potential_indicators.map((ind, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <TrendingUp className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                        {ind}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {insights.team_building_suggestions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Sugestões de Team Building</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {insights.team_building_suggestions.map((s, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <Users className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {insights.conflict_risk_areas.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    Áreas de Risco de Conflito
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {insights.conflict_risk_areas.map((c, i) => (
                      <li key={i} className="text-sm text-muted-foreground">{c}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Badges */}
            {badges.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-500" />
                    Selos da Empresa
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {badges.map(badge => (
                      <div key={badge.id} className="flex items-center gap-2 p-3 rounded-lg border bg-muted/30">
                        <Award className="w-5 h-5 text-amber-500" />
                        <div>
                          <p className="text-sm font-medium">{badge.badge_name}</p>
                          <p className="text-xs text-muted-foreground">
                            Concedido em {format(new Date(badge.awarded_at), 'dd/MM/yyyy', { locale: ptBR })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Organizational Alerts */}
          <TabsContent value="alerts" className="space-y-4">
            {alerts.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Shield className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
                  <p className="text-sm font-medium">Nenhum alerta ativo</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    A saúde organizacional está dentro dos parâmetros esperados.
                  </p>
                </CardContent>
              </Card>
            ) : (
              alerts.map(alert => (
                <Card key={alert.id} className={
                  alert.severity === 'critical' ? 'border-destructive' :
                  alert.severity === 'warning' ? 'border-amber-500' : ''
                }>
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                          alert.severity === 'critical' ? 'text-destructive' : 'text-amber-500'
                        }`} />
                        <div>
                          <p className="text-sm font-medium">{alert.title}</p>
                          {alert.description && (
                            <p className="text-xs text-muted-foreground mt-1">{alert.description}</p>
                          )}
                        </div>
                      </div>
                      <Badge variant={alert.severity === 'critical' ? 'destructive' : 'outline'}>
                        {alert.severity}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      )}

      {/* LGPD Notice */}
      <div className="text-xs text-muted-foreground p-3 bg-muted/30 rounded-lg border border-dashed flex items-start gap-2">
        <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <span>
          Todos os dados são agregados e anonimizados. Nenhuma informação individual é revelada.
          Apenas colaboradores com consentimento explícito são incluídos. Conforme LGPD.
        </span>
      </div>
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────

function EvolutionCard({ title, value, subtitle, icon }: {
  title: string; value: number; subtitle: string; icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="pt-5 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
            {icon}
          </div>
          <div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">{title}</p>
            <p className="text-xs text-muted-foreground/70">{subtitle}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DistributionCard({ title, data }: { title: string; data: Record<string, number> }) {
  const entries = Object.entries(data);
  if (entries.length === 0) return null;

  const total = entries.reduce((sum, [, v]) => sum + v, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {entries.map(([label, value]) => {
          const pct = total > 0 ? Math.round((value / total) * 100) : 0;
          return (
            <div key={label} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{label}</span>
                <span className="font-medium text-muted-foreground">{pct}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

function EmptyImpactCard() {
  return (
    <Card className="max-w-lg mx-auto">
      <CardContent className="text-center py-12">
        <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Impacto em construção</h3>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          O painel de impacto organizacional será populado à medida que colaboradores
          concluírem suas avaliações Identity e derem consentimento para compartilhar dados.
        </p>
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>Clique em "Atualizar" quando houver dados disponíveis</span>
        </div>
      </CardContent>
    </Card>
  );
}
