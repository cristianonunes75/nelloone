import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowUpRight,
  Briefcase,
  ClipboardList,
  Target,
  BookOpen,
  BarChart3,
  Users
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { BusinessLayout } from '../components/BusinessLayout';
import { useBusinessAuth } from '../hooks/useBusinessAuth';
import { SubscriptionStatusBanner } from '../components/SubscriptionStatusBanner';
import { SubscriptionStatusCard } from '../components/SubscriptionStatusCard';
import { BlockedAccessOverlay } from '../components/BlockedAccessOverlay';
import { supabase } from '@/integrations/supabase/client';
import { PRODUCT_IDENTITY } from '../config/featureFlags';
import { BusinessProgramsTab } from '../components/BusinessProgramsTab';
import { TeamInsightsTab } from '../components/TeamInsightsTab';
import { SeatManagementCard } from '../components/SeatManagementCard';

interface DashboardStats {
  activeJobs: number;
  totalCandidates: number;
}

export default function BusinessDashboard() {
  const { company, isNelloOneSuperAdmin } = useBusinessAuth();
  const [stats, setStats] = useState<DashboardStats>({
    activeJobs: 0,
    totalCandidates: 0,
  });
  const [allCompanies, setAllCompanies] = useState<Array<{ id: string; name: string; slug: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (company) {
      fetchStats();
    } else if (isNelloOneSuperAdmin) {
      fetchAllCompanies();
    } else {
      setIsLoading(false);
    }
  }, [company, isNelloOneSuperAdmin]);

  const fetchAllCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('id, name, slug')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setAllCompanies(data || []);
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    if (!company) return;
    
    try {
      // Get active jobs count
      const { count: jobsCount } = await supabase
        .from('job_postings')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', company.id)
        .eq('status', 'published');
      
      // Get total candidates count
      const { count: candidatesCount } = await supabase
        .from('hiring_candidates')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', company.id);
      
      setStats({
        activeJobs: jobsCount || 0,
        totalCandidates: candidatesCount || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Super admin without company sees all companies overview
  if (isNelloOneSuperAdmin && !company) {
    return (
      <BusinessLayout>
        <div className="space-y-8">
          <div>
            <h1 className="text-2xl font-bold">Admin Overview - {PRODUCT_IDENTITY.name}</h1>
            <p className="text-muted-foreground">
              Visão geral de todas as empresas
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Empresas cadastradas</CardTitle>
              <CardDescription>
                {allCompanies.length} empresas encontradas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {allCompanies.length === 0 ? (
                <p className="text-muted-foreground">Nenhuma empresa cadastrada ainda.</p>
              ) : (
                <div className="space-y-2">
                  {allCompanies.map((c) => (
                    <div key={c.id} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                      <div>
                        <p className="font-medium">{c.name}</p>
                        <p className="text-sm text-muted-foreground">/{c.slug}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        Ver detalhes
                      </Button>
                    </div>
                  ))}
                </div>
              )}
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
      
      <div className="space-y-8">
        {/* Subscription Status Banner */}
        <SubscriptionStatusBanner />
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              {PRODUCT_IDENTITY.tagline}
            </p>
          </div>
          <Link to="/jobs">
            <Button className="gap-2">
              <ClipboardList className="w-4 h-4" />
              Criar nova vaga
            </Button>
          </Link>
        </div>

        {/* Stats Grid + Subscription Card - HIRING FOCUSED */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 grid gap-4 md:grid-cols-2">
            {/* Active Jobs */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Vagas ativas
                </CardTitle>
                <ClipboardList className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeJobs}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  publicadas
                </p>
              </CardContent>
            </Card>

            {/* Total Candidates */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total de candidatos
                </CardTitle>
                <Briefcase className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalCandidates}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  em avaliação
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Subscription status card on the side */}
          <div className="lg:col-span-1">
            <SubscriptionStatusCard />
          </div>
        </div>

        {/* Quick Actions - HIRING FOCUSED */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* View Jobs */}
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <Link to="/jobs">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <ClipboardList className="w-5 h-5 text-primary" />
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-muted-foreground" />
                </div>
                <CardTitle className="mt-4">Gerenciar vagas</CardTitle>
                <CardDescription>
                  Crie vagas, defina perfis ideais e compartilhe links com candidatos
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>

          {/* View Candidates */}
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <Link to="/hiring">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-primary" />
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-muted-foreground" />
                </div>
                <CardTitle className="mt-4">Ver candidatos</CardTitle>
                <CardDescription>
                  Acompanhe avaliações DISC e Temperamentos dos seus candidatos
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>
        </div>

        {/* Tabs: Overview + Programs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="licenses">
              <Users className="w-4 h-4 mr-1" />
              Licenças
            </TabsTrigger>
            <TabsTrigger value="insights">
              <BarChart3 className="w-4 h-4 mr-1" />
              Team Insights
            </TabsTrigger>
            <TabsTrigger value="programs">
              <BookOpen className="w-4 h-4 mr-1" />
              Programas Praxis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            {/* Product Info Card */}
            <Card className="bg-muted/30 border-dashed">
              <CardContent className="flex items-start gap-4 pt-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">{PRODUCT_IDENTITY.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {PRODUCT_IDENTITY.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="licenses">
            <SeatManagementCard />
          </TabsContent>

          <TabsContent value="insights">
            <TeamInsightsTab />
          </TabsContent>

          <TabsContent value="programs">
            <BusinessProgramsTab />
          </TabsContent>
        </Tabs>
      </div>
    </BusinessLayout>
  );
}
