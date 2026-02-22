import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft,
  Plus,
  Calendar,
  Clock,
  DollarSign,
  Edit,
  MoreVertical,
  FileText,
  Brain,
  ChevronRight,
  Tag,
  Sparkles,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { useOperatorWorkspace } from '../hooks/useOperatorWorkspace';
import { usePraxisSessions, PraxisClient, ClientSession } from '../hooks/usePraxisClients';
import { PraxisClientDialog } from '../components/PraxisClientDialog';
import { PraxisSessionDialog } from '../components/PraxisSessionDialog';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

export default function PraxisClientDetail() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const { workspace } = useOperatorWorkspace();
  const { sessions, isLoading: sessionsLoading, deleteSession } = usePraxisSessions(clientId || null);
  
  const [client, setClient] = useState<PraxisClient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditClient, setShowEditClient] = useState(false);
  const [showAddSession, setShowAddSession] = useState(false);
  const [editingSession, setEditingSession] = useState<ClientSession | null>(null);
  const [deletingSession, setDeletingSession] = useState<string | null>(null);

  useEffect(() => {
    const fetchClient = async () => {
      if (!clientId || !workspace?.id) return;

      try {
        const { data, error } = await supabase
          .from('professional_clients')
          .select('*')
          .eq('id', clientId)
          .eq('professional_id', workspace.id)
          .single();

        if (error) throw error;
        setClient(data);
      } catch (err) {
        console.error('Error fetching client:', err);
        toast.error('Cliente não encontrado');
        navigate('/praxis/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    fetchClient();
  }, [clientId, workspace?.id, navigate]);

  const handleDeleteSession = async () => {
    if (!deletingSession) return;
    await deleteSession(deletingSession);
    setDeletingSession(null);
  };

  const getSessionTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      coaching: 'Coaching',
      mentoring: 'Mentoria',
      therapy: 'Terapia',
      consulting: 'Consultoria',
      followup: 'Follow-up',
    };
    return types[type] || type;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      scheduled: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      no_show: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
    };
    return colors[status] || '';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-48 mb-8" />
          <Skeleton className="h-32 mb-8" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!client) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/praxis/dashboard">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
              </Button>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-semibold">Praxis</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Client Header */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={client.photo_url || undefined} />
                <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-600 text-white text-xl">
                  {client.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold">{client.name}</h1>
                  <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
                    {client.status === 'active' ? 'Ativo' : 'Arquivado'}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  {client.email && <span>{client.email}</span>}
                  {client.phone && <span>{client.phone}</span>}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button 
                  className="bg-gradient-to-r from-amber-500 to-orange-600"
                  onClick={() => setShowAddSession(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Sessão
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setShowEditClient(true)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Editar cliente
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
              <div className="text-center">
                <p className="text-2xl font-bold">{client.total_sessions}</p>
                <p className="text-sm text-muted-foreground">Sessões</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">
                  {client.session_rate ? `R$ ${client.session_rate}` : '-'}
                </p>
                <p className="text-sm text-muted-foreground">Por sessão</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">
                  {client.last_session_at 
                    ? format(new Date(client.last_session_at), 'dd/MM', { locale: ptBR })
                    : '-'}
                </p>
                <p className="text-sm text-muted-foreground">Última sessão</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="sessions" className="space-y-6">
          <TabsList>
            <TabsTrigger value="sessions">Sessões</TabsTrigger>
            <TabsTrigger value="notes">Notas</TabsTrigger>
            <TabsTrigger value="evolution">Evolução</TabsTrigger>
          </TabsList>

          <TabsContent value="sessions">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Sessões</CardTitle>
                <CardDescription>Todas as sessões com este cliente</CardDescription>
              </CardHeader>
              <CardContent>
                {sessionsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <Skeleton key={i} className="h-24" />
                    ))}
                  </div>
                ) : sessions.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium mb-2">Nenhuma sessão registrada</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Adicione a primeira sessão com este cliente
                    </p>
                    <Button onClick={() => setShowAddSession(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Nova Sessão
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sessions.map((session) => (
                      <div
                        key={session.id}
                        className="flex items-start gap-4 p-4 rounded-xl border hover:bg-muted/50 transition-colors"
                      >
                        <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-6 h-6 text-amber-600" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium">{session.title}</p>
                            <Badge className={getStatusColor(session.status)}>
                              {session.status === 'completed' ? 'Concluída' : 
                               session.status === 'scheduled' ? 'Agendada' : 
                               session.status === 'cancelled' ? 'Cancelada' : 'Não compareceu'}
                            </Badge>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-2">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {format(new Date(session.session_date), "d 'de' MMM, HH:mm", { locale: ptBR })}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {session.duration_minutes} min
                            </span>
                            <span className="flex items-center gap-1">
                              <Tag className="w-3 h-3" />
                              {getSessionTypeLabel(session.session_type)}
                            </span>
                          </div>

                          {session.notes && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {session.notes}
                            </p>
                          )}

                          {session.tags && session.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {session.tags.map(tag => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setEditingSession(session)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => setDeletingSession(session.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes">
            <Card>
              <CardHeader>
                <CardTitle>Notas Gerais</CardTitle>
                <CardDescription>Anotações sobre o cliente</CardDescription>
              </CardHeader>
              <CardContent>
                {client.notes ? (
                  <p className="whitespace-pre-wrap">{client.notes}</p>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    Nenhuma nota adicionada ainda
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="evolution">
            <Card>
              <CardHeader>
                <CardTitle>Evolução do Cliente</CardTitle>
                <CardDescription>Marcos e progressos ao longo do tempo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium mb-2">Em breve</p>
                  <p className="text-sm text-muted-foreground">
                    Gráficos de evolução e marcos importantes serão exibidos aqui
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Client Dialog */}
      {showEditClient && (
        <PraxisClientDialog
          open={showEditClient}
          onOpenChange={setShowEditClient}
          client={client}
          mode="edit"
        />
      )}

      {/* Add/Edit Session Dialog */}
      <PraxisSessionDialog
        open={showAddSession || !!editingSession}
        onOpenChange={(open) => {
          if (!open) {
            setShowAddSession(false);
            setEditingSession(null);
          }
        }}
        clientId={clientId!}
        session={editingSession || undefined}
        mode={editingSession ? 'edit' : 'create'}
      />

      {/* Delete Session Confirmation */}
      <AlertDialog open={!!deletingSession} onOpenChange={() => setDeletingSession(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir sessão?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A sessão e todas as suas anotações serão permanentemente removidas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteSession} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
