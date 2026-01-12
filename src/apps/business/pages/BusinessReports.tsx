import { useState, useEffect, useCallback } from 'react';
import { 
  BarChart3, 
  Users, 
  AlertTriangle, 
  Lightbulb,
  TrendingUp,
  MessageSquare,
  Shield,
  Target,
  Lock,
  RefreshCw,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { BusinessLayout } from '../components/BusinessLayout';
import { useBusinessAuth } from '../hooks/useBusinessAuth';
import { useBusinessEnforcement } from '../hooks/useBusinessEnforcement';
import { SubscriptionStatusBanner } from '../components/SubscriptionStatusBanner';
import { BlockedAccessOverlay } from '../components/BlockedAccessOverlay';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface TeamInsights {
  total_members: number;
  completed_assessments: number;
  temperament_distribution: Record<string, number>;
  disc_distribution: Record<string, number>;
  team_strengths: string[];
  team_growth_areas: string[];
  conflict_risk_areas: string[];
  management_recommendations: string[];
  last_calculated_at?: string;
  calculation_member_count?: number;
}

type InsightsState = 'loading' | 'calculating' | 'insufficient' | 'ready' | 'error';

const MINIMUM_THRESHOLD = 3;

export default function BusinessReports() {
  const { company } = useBusinessAuth();
  const enforcement = useBusinessEnforcement();
  const [insights, setInsights] = useState<TeamInsights | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCalculating, setIsCalculating] = useState(false);
  const [insightsState, setInsightsState] = useState<InsightsState>('loading');

  const fetchInsights = useCallback(async () => {
    if (!company) return;
    
    try {
      const { data, error } = await supabase
        .from('company_team_insights')
        .select('*')
        .eq('company_id', company.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setInsights(data as unknown as TeamInsights);
        
        // Determine state based on data
        if ((data.completed_assessments || 0) >= MINIMUM_THRESHOLD && 
            Object.keys(data.temperament_distribution || {}).length > 0) {
          setInsightsState('ready');
        } else {
          setInsightsState('insufficient');
        }
      } else {
        setInsightsState('insufficient');
      }
    } catch (error) {
      console.error('Error fetching insights:', error);
      setInsightsState('error');
    } finally {
      setIsLoading(false);
    }
  }, [company]);

  useEffect(() => {
    if (company) {
      fetchInsights();
    }
  }, [company, fetchInsights]);

  const handleRecalculate = async () => {
    if (!company || isCalculating) return;
    
    setIsCalculating(true);
    setInsightsState('calculating');
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Não autenticado');
      }

      const response = await supabase.functions.invoke('business-calculate-insights', {
        body: { 
          company_id: company.id,
          triggered_by: 'manual'
        }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      const result = response.data;
      
      if (result.success) {
        if (result.completed_count !== undefined && result.completed_count < MINIMUM_THRESHOLD) {
          toast.info(`Dados insuficientes: ${result.completed_count}/${MINIMUM_THRESHOLD} jornadas completas`);
          setInsightsState('insufficient');
        } else {
          toast.success('Insights atualizados com sucesso!');
          setInsightsState('ready');
        }
        
        // Refresh data
        await fetchInsights();
      } else {
        throw new Error(result.error || 'Falha ao calcular insights');
      }
    } catch (error) {
      console.error('Error calculating insights:', error);
      toast.error('Erro ao atualizar insights. Tente novamente.');
      setInsightsState('error');
    } finally {
      setIsCalculating(false);
    }
  };

  const hasEnoughData = insightsState === 'ready';

  // Format last calculated time
  const getLastCalculatedText = () => {
    if (!insights?.last_calculated_at) return null;
    const date = new Date(insights.last_calculated_at);
    return `Última atualização: ${date.toLocaleDateString('pt-BR')} às ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  };

  if (isLoading) {
    return (
      <BusinessLayout>
        <div className="flex items-center justify-center py-20">
          <div className="text-center text-muted-foreground">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
            Carregando relatórios...
          </div>
        </div>
      </BusinessLayout>
    );
  }

  // Show blocked overlay if insights not accessible
  if (!enforcement.canViewInsights && !enforcement.isLoading) {
    return (
      <BusinessLayout>
        <BlockedAccessOverlay />
        <div className="space-y-6">
          <SubscriptionStatusBanner />
          <Card className="max-w-md mx-auto">
            <CardContent className="text-center py-12">
              <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Acesso restrito</h3>
              <p className="text-muted-foreground mb-4">
                {enforcement.blockReason || 'Faça upgrade para acessar os relatórios da equipe.'}
              </p>
              <Link to="/settings">
                <Button>Ver planos</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </BusinessLayout>
    );
  }

  return (
    <BusinessLayout>
      {/* Blocked overlay when trial expired or suspended */}
      <BlockedAccessOverlay />
      
      <div className="space-y-6">
        {/* Subscription Status Banner */}
        <SubscriptionStatusBanner />
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Relatórios da Equipe</h1>
            <p className="text-muted-foreground">
              Insights consolidados sobre os perfis e tendências do seu time
            </p>
          </div>
          
          {/* Recalculate Button */}
          <div className="flex flex-col items-end gap-1">
            <Button 
              onClick={handleRecalculate} 
              disabled={isCalculating}
              variant="outline"
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isCalculating ? 'animate-spin' : ''}`} />
              {isCalculating ? 'Calculando...' : 'Atualizar insights'}
            </Button>
            {getLastCalculatedText() && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {getLastCalculatedText()}
              </span>
            )}
          </div>
        </div>

        {/* Privacy Notice */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="flex items-start gap-3 pt-6">
            <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-primary">Dados anônimos e agregados</h4>
              <p className="text-sm text-muted-foreground">
                Estes relatórios mostram tendências da equipe como um todo. 
                Nenhuma informação individual é identificável. Mínimo de {MINIMUM_THRESHOLD} jornadas completas.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* State: Calculating */}
        {insightsState === 'calculating' && (
          <Card>
            <CardContent className="text-center py-12">
              <RefreshCw className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Calculando insights...</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Processando dados agregados da equipe. Isso pode levar alguns segundos.
              </p>
            </CardContent>
          </Card>
        )}

        {/* State: Insufficient Data */}
        {insightsState === 'insufficient' && !isCalculating && (
          <Card>
            <CardContent className="text-center py-12">
              <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Dados insuficientes</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-4">
                São necessários pelo menos <strong>{MINIMUM_THRESHOLD} colaboradores</strong> com a jornada completa 
                e compartilhamento ativado para gerar relatórios consolidados e garantir o anonimato.
              </p>
              <div className="flex flex-col items-center gap-3">
                <Badge variant="outline" className="text-base px-4 py-2">
                  {insights?.completed_assessments || 0}/{MINIMUM_THRESHOLD} jornadas completas
                </Badge>
                <p className="text-sm text-muted-foreground">
                  Convide mais colaboradores ou aguarde que completem suas jornadas.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* State: Error */}
        {insightsState === 'error' && !isCalculating && (
          <Card>
            <CardContent className="text-center py-12">
              <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Erro ao carregar dados</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-4">
                Não foi possível carregar os insights da equipe. Tente novamente.
              </p>
              <Button onClick={handleRecalculate} disabled={isCalculating}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Tentar novamente
              </Button>
            </CardContent>
          </Card>
        )}

        {/* State: Ready - Show full insights */}
        {hasEnoughData && !isCalculating && (
          <div className="space-y-6">
            {/* Summary Card */}
            <Card className="bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800">
              <CardContent className="flex items-center gap-4 py-4">
                <CheckCircle2 className="w-8 h-8 text-green-600 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-green-700 dark:text-green-400">
                    Insights disponíveis
                  </h4>
                  <p className="text-sm text-green-600/80 dark:text-green-500/80">
                    Baseado em {insights?.calculation_member_count || insights?.completed_assessments || 0} colaboradores 
                    com jornada completa e compartilhamento ativo
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Distribution Charts */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Temperament Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Distribuição de Temperamentos
                  </CardTitle>
                  <CardDescription>
                    Perfis predominantes na equipe
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(insights?.temperament_distribution || {}).map(([type, percentage]) => (
                    <div key={type} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{type}</span>
                        <span className="text-muted-foreground">{percentage}%</span>
                      </div>
                      <Progress value={percentage as number} className="h-2" />
                    </div>
                  ))}
                  {Object.keys(insights?.temperament_distribution || {}).length === 0 && (
                    <p className="text-muted-foreground text-sm">
                      Dados sendo processados...
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* DISC Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Perfis DISC
                  </CardTitle>
                  <CardDescription>
                    Estilos de comportamento da equipe
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(insights?.disc_distribution || {}).map(([type, percentage]) => (
                    <div key={type} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{type}</span>
                        <span className="text-muted-foreground">{percentage}%</span>
                      </div>
                      <Progress value={percentage as number} className="h-2" />
                    </div>
                  ))}
                  {Object.keys(insights?.disc_distribution || {}).length === 0 && (
                    <p className="text-muted-foreground text-sm">
                      Dados sendo processados...
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Strengths & Growth Areas */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-600">
                    <TrendingUp className="w-5 h-5" />
                    Forças da Equipe
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {(insights?.team_strengths || []).map((strength, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-green-500 mt-1">•</span>
                        {strength}
                      </li>
                    ))}
                    {(insights?.team_strengths || []).length === 0 && (
                      <p className="text-muted-foreground text-sm">
                        Dados sendo processados...
                      </p>
                    )}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-yellow-600">
                    <Lightbulb className="w-5 h-5" />
                    Áreas de Desenvolvimento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {(insights?.team_growth_areas || []).map((area, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-yellow-500 mt-1">•</span>
                        {area}
                      </li>
                    ))}
                    {(insights?.team_growth_areas || []).length === 0 && (
                      <p className="text-muted-foreground text-sm">
                        Dados sendo processados...
                      </p>
                    )}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Conflict Risks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-600">
                  <AlertTriangle className="w-5 h-5" />
                  Pontos de Atenção
                </CardTitle>
                <CardDescription>
                  Áreas com potencial de conflito ou tensão
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  {(insights?.conflict_risk_areas || []).map((risk, i) => (
                    <div key={i} className="flex items-start gap-2 p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{risk}</span>
                    </div>
                  ))}
                  {(insights?.conflict_risk_areas || []).length === 0 && (
                    <p className="text-muted-foreground text-sm col-span-2">
                      Nenhum ponto de risco identificado até o momento.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Management Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Recomendações para Gestão
                </CardTitle>
                <CardDescription>
                  Sugestões práticas baseadas no perfil da equipe
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(insights?.management_recommendations || []).map((rec, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-medium flex-shrink-0">
                        {i + 1}
                      </div>
                      <p className="text-sm">{rec}</p>
                    </div>
                  ))}
                  {(insights?.management_recommendations || []).length === 0 && (
                    <p className="text-muted-foreground text-sm">
                      Recomendações serão geradas após mais colaboradores completarem suas jornadas.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </BusinessLayout>
  );
}
