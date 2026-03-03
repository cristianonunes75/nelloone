import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePDI } from '../../hooks/usePDI';
import { useBusinessAuth } from '../../hooks/useBusinessAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BookOpen, Sparkles, Loader2, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function PDITab() {
  const pdi = usePDI();
  const { company } = useBusinessAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  useEffect(() => {
    pdi.fetchPlans();
  }, [pdi.fetchPlans]);

  useEffect(() => {
    if (selectedPlan) {
      pdi.fetchGoals(selectedPlan);
      pdi.fetchCheckins(selectedPlan);
    }
  }, [selectedPlan, pdi.fetchGoals, pdi.fetchCheckins]);

  const handleGeneratePDI = async (companyUserId: string) => {
    if (!company?.id) return;
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('people-pdi-generator', {
        body: { company_id: company.id, company_user_id: companyUserId },
      });
      if (error) throw error;

      if (data?.goals && data.goals.length > 0) {
        // Create PDI plan
        const plan = await pdi.createPlan(companyUserId);
        if (plan) {
          // Add generated goals
          for (const goal of data.goals) {
            await pdi.addGoal(plan.id, {
              title: goal.title,
              description: goal.description,
              category: goal.category,
              priority: goal.priority,
              success_metric: goal.success_metric,
              deadline: goal.deadline_weeks ? new Date(Date.now() + goal.deadline_weeks * 7 * 24 * 60 * 60 * 1000).toISOString() : undefined,
            });
          }
          toast.success('PDI gerado pela IA com sucesso');
          setSelectedPlan(plan.id);
        }
      }
      if (data?.manager_recommendation) {
        toast.info(`Recomendação para gestor: ${data.manager_recommendation.substring(0, 100)}...`);
      }
    } catch (err) {
      console.error('Error generating PDI:', err);
      toast.error('Erro ao gerar PDI');
    } finally {
      setIsGenerating(false);
    }
  };

  const activePlans = pdi.plans.filter(p => p.status === 'active');
  const completedPlans = pdi.plans.filter(p => p.status === 'completed');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Plano de Desenvolvimento Individual
          </h2>
          <p className="text-sm text-muted-foreground">PDI conectado ao perfil comportamental e performance</p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>PDIs Ativos</CardDescription>
            <CardTitle className="text-3xl text-primary">{activePlans.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>PDIs Concluídos</CardDescription>
            <CardTitle className="text-3xl text-green-500">{completedPlans.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Metas</CardDescription>
            <CardTitle className="text-3xl">{pdi.totalGoals}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Progresso Geral</CardDescription>
            <CardTitle className="text-3xl">{pdi.progressPct}%</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={pdi.progressPct} className="h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Active Plans */}
      {activePlans.length > 0 ? (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">PDIs Ativos</h3>
          {activePlans.map(plan => (
            <Card
              key={plan.id}
              className={`cursor-pointer transition-colors ${selectedPlan === plan.id ? 'border-primary' : ''}`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">PDI #{plan.id.substring(0, 8)}</CardTitle>
                  <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                    {plan.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Criado em {new Date(plan.created_at).toLocaleDateString('pt-BR')}
                  {plan.target_date && ` · Meta: ${new Date(plan.target_date).toLocaleDateString('pt-BR')}`}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground mb-3">
              Nenhum PDI ativo. Gere um PDI via IA com base no perfil e performance do colaborador.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Selected Plan Goals */}
      {selectedPlan && pdi.goals.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">Metas do PDI</h3>
          {pdi.goals.map(goal => (
            <Card key={goal.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {goal.status === 'completed' ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : goal.status === 'in_progress' ? (
                      <Clock className="w-4 h-4 text-amber-500" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-muted-foreground" />
                    )}
                    <CardTitle className="text-sm">{goal.title}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded bg-muted capitalize">{goal.category}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      goal.priority === 'high' ? 'bg-red-500/10 text-red-500' :
                      goal.priority === 'medium' ? 'bg-amber-500/10 text-amber-500' :
                      'bg-muted text-muted-foreground'
                    }`}>{goal.priority}</span>
                  </div>
                </div>
              </CardHeader>
              {goal.description && (
                <CardContent>
                  <p className="text-xs text-muted-foreground">{goal.description}</p>
                  {goal.success_metric && (
                    <p className="text-xs text-muted-foreground mt-1">
                      <strong>Métrica:</strong> {goal.success_metric}
                    </p>
                  )}
                  <div className="flex gap-2 mt-2">
                    {goal.status !== 'in_progress' && (
                      <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); pdi.updateGoalStatus(goal.id, 'in_progress', selectedPlan); }}>
                        Iniciar
                      </Button>
                    )}
                    {goal.status !== 'completed' && (
                      <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); pdi.updateGoalStatus(goal.id, 'completed', selectedPlan); }}>
                        Concluir
                      </Button>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Checkins */}
      {selectedPlan && pdi.checkins.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">Check-ins</h3>
          {pdi.checkins.map(checkin => (
            <Card key={checkin.id}>
              <CardHeader className="pb-2">
                <CardDescription>{new Date(checkin.checkin_date).toLocaleDateString('pt-BR')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-1">
                {checkin.progress_notes && <p className="text-xs"><strong>Progresso:</strong> {checkin.progress_notes}</p>}
                {checkin.blockers && <p className="text-xs text-red-500"><strong>Bloqueios:</strong> {checkin.blockers}</p>}
                {checkin.next_steps && <p className="text-xs"><strong>Próximos passos:</strong> {checkin.next_steps}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
