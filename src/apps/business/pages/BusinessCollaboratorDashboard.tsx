import { Link } from 'react-router-dom';
import { 
  Building2, 
  BookOpen, 
  CheckCircle2, 
  Clock,
  ArrowRight,
  Lock
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useBusinessAuth } from '../hooks/useBusinessAuth';

export default function BusinessCollaboratorDashboard() {
  const { profile } = useAuth();
  const { company } = useBusinessAuth();
  
  const journeyProgress = profile ? 
    (profile.journey_completed_tests / profile.journey_total_tests) * 100 : 0;

  // Mock test data - in real app, fetch from database
  const tests = [
    { id: 'temperamentos', name: 'Temperamentos', status: 'completed', order: 1 },
    { id: 'disc', name: 'DISC', status: 'completed', order: 2 },
    { id: 'eneagrama', name: 'Eneagrama', status: 'in_progress', order: 3 },
    { id: 'inteligencias', name: 'Inteligências Múltiplas', status: 'locked', order: 4 },
    { id: 'estilos-conexao', name: 'Estilos de Conexão', status: 'locked', order: 5 },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <Lock className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-700">Concluído</Badge>;
      case 'in_progress':
        return <Badge variant="secondary">Em andamento</Badge>;
      default:
        return <Badge variant="outline">Bloqueado</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <span className="text-lg font-semibold">Minha Jornada</span>
                {company && (
                  <span className="text-sm text-muted-foreground block -mt-1">{company.name}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="space-y-6">
          {/* Welcome */}
          <div>
            <h1 className="text-2xl font-bold">
              Olá, {profile?.full_name?.split(' ')[0] || 'Colaborador'}!
            </h1>
            <p className="text-muted-foreground">
              Continue sua jornada de autoconhecimento
            </p>
          </div>

          {/* Progress Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Seu progresso</CardTitle>
              <CardDescription>
                {profile?.journey_completed_tests || 0} de {profile?.journey_total_tests || 5} testes concluídos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={journeyProgress} className="h-3" />
              <p className="text-sm text-muted-foreground mt-2">
                {Math.round(journeyProgress)}% da jornada completa
              </p>
            </CardContent>
          </Card>

          {/* Tests List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Sua jornada
              </CardTitle>
              <CardDescription>
                Complete os testes na ordem para desbloquear seu Código da Essência
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {tests.map((test, index) => (
                <div 
                  key={test.id}
                  className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                    test.status === 'locked' 
                      ? 'bg-muted/50 opacity-60' 
                      : 'bg-card hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium">{test.name}</h4>
                      {getStatusBadge(test.status)}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusIcon(test.status)}
                    {test.status === 'in_progress' && (
                      <Button size="sm" className="gap-1">
                        Continuar
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    )}
                    {test.status === 'completed' && (
                      <Button variant="outline" size="sm">
                        Ver resultado
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Privacy Reminder */}
          <Card className="bg-muted/50 border-dashed">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium mb-1">Seus resultados são privados</h4>
                  <p className="text-sm text-muted-foreground">
                    Apenas você tem acesso ao seu relatório completo. 
                    A empresa vê apenas dados agregados da equipe, 
                    sem identificação individual.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
