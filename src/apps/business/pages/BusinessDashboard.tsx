import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  UserPlus, 
  BarChart3, 
  Clock, 
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BusinessLayout } from '../components/BusinessLayout';
import { useBusinessAuth } from '../hooks/useBusinessAuth';
import { supabase } from '@/integrations/supabase/client';

interface DashboardStats {
  totalMembers: number;
  pendingInvites: number;
  completedAssessments: number;
  inProgressAssessments: number;
}

export default function BusinessDashboard() {
  const { company } = useBusinessAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalMembers: 0,
    pendingInvites: 0,
    completedAssessments: 0,
    inProgressAssessments: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (company) {
      fetchStats();
    }
  }, [company]);

  const fetchStats = async () => {
    if (!company) return;
    
    try {
      // Get team members
      const { count: membersCount } = await supabase
        .from('company_users')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', company.id)
        .eq('is_active', true);
      
      // Get pending invites
      const { count: invitesCount } = await supabase
        .from('company_invites')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', company.id)
        .eq('status', 'pending');
      
      // Get team insights
      const { data: insights } = await supabase
        .from('company_team_insights')
        .select('completed_assessments, total_members')
        .eq('company_id', company.id)
        .single();
      
      setStats({
        totalMembers: membersCount || 0,
        pendingInvites: invitesCount || 0,
        completedAssessments: insights?.completed_assessments || 0,
        inProgressAssessments: (membersCount || 0) - (insights?.completed_assessments || 0),
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const completionRate = stats.totalMembers > 0 
    ? Math.round((stats.completedAssessments / stats.totalMembers) * 100) 
    : 0;

  return (
    <BusinessLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Visão geral da sua equipe no Nello Business
            </p>
          </div>
          <Link to="/invite">
            <Button className="gap-2">
              <UserPlus className="w-4 h-4" />
              Convidar colaboradores
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de membros
              </CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMembers}</div>
              <p className="text-xs text-muted-foreground mt-1">
                colaboradores ativos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Convites pendentes
              </CardTitle>
              <Clock className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingInvites}</div>
              <p className="text-xs text-muted-foreground mt-1">
                aguardando aceite
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Jornadas completas
              </CardTitle>
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedAssessments}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {completionRate}% de conclusão
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Em andamento
              </CardTitle>
              <AlertCircle className="w-4 h-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inProgressAssessments}</div>
              <p className="text-xs text-muted-foreground mt-1">
                jornadas em progresso
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Progress Section */}
        <Card>
          <CardHeader>
            <CardTitle>Progresso da equipe</CardTitle>
            <CardDescription>
              Acompanhe quantos colaboradores completaram as avaliações
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Taxa de conclusão</span>
                <span className="text-sm text-muted-foreground">{completionRate}%</span>
              </div>
              <Progress value={completionRate} className="h-2" />
              <p className="text-sm text-muted-foreground">
                {stats.completedAssessments} de {stats.totalMembers} colaboradores completaram a jornada
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <Link to="/reports">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-primary" />
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-muted-foreground" />
                </div>
                <CardTitle className="mt-4">Ver relatórios da equipe</CardTitle>
                <CardDescription>
                  Acesse insights consolidados sobre os perfis e tendências da sua equipe
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <Link to="/team">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-muted-foreground" />
                </div>
                <CardTitle className="mt-4">Gerenciar equipe</CardTitle>
                <CardDescription>
                  Veja o status de cada colaborador e acompanhe o progresso individual
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>
        </div>
      </div>
    </BusinessLayout>
  );
}
