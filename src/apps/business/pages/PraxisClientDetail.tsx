import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, Plus, Calendar, Clock, Edit, MoreVertical, FileText, Brain,
  Tag, Sparkles, Trash2, Trophy, Flag, Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useOperatorWorkspace } from '../hooks/useOperatorWorkspace';
import { usePraxisSessions, usePraxisMilestones, PraxisClient, ClientSession } from '../hooks/usePraxisClients';
import { PraxisClientDialog } from '../components/PraxisClientDialog';
import { PraxisSessionDialog } from '../components/PraxisSessionDialog';
import { format, isPast, isFuture } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

export default function PraxisClientDetail() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const { workspace } = useOperatorWorkspace();
  const { sessions, upcomingSessions, completedSessions, isLoading: sessionsLoading, deleteSession } = usePraxisSessions(clientId || null);
  const { milestones, isLoading: milestonesLoading, createMilestone, deleteMilestone } = usePraxisMilestones(clientId || null);
  
  const [client, setClient] = useState<PraxisClient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditClient, setShowEditClient] = useState(false);
  const [showAddSession, setShowAddSession] = useState(false);
  const [editingSession, setEditingSession] = useState<ClientSession | null>(null);
  const [deletingSession, setDeletingSession] = useState<string | null>(null);
  const [showAddMilestone, setShowAddMilestone] = useState(false);
  const [deletingMilestone, setDeletingMilestone] = useState<string | null>(null);
  const [milestoneForm, setMilestoneForm] = useState({ title: '', description: '', milestone_type: 'achievement' });

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

  const handleDeleteMilestone = async () => {
    if (!deletingMilestone) return;
    await deleteMilestone(deletingMilestone);
    setDeletingMilestone(null);
  };

  const handleCreateMilestone = async () => {
    if (!milestoneForm.title) return;
    await createMilestone({
      title: milestoneForm.title,
      description: milestoneForm.description || null,
      milestone_type: milestoneForm.milestone_type,
    });
    setMilestoneForm({ title: '', description: '', milestone_type: 'achievement' });
    setShowAddMilestone(false);
  };

  const getSessionTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      coaching: 'Coaching', mentoring: 'Mentoria', therapy: 'Terapia',
      consulting: 'Consultoria', followup: 'Follow-up',
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

  const getMilestoneIcon = (type: string) => {
    switch (type) {
      case 'achievement': return <Trophy className="w-4 h-4 text-amber-500" />;
      case 'breakthrough': return <Sparkles className="w-4 h-4 text-purple-500" />;
      case 'goal_reached': return <Target className="w-4 h-4 text-green-500" />;
      default: return <Flag className="w-4 h-4 text-blue-500" />;
    }
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
                <Link to="/praxis/dashboard"><ArrowLeft className="w-5 h-5" /></Link>
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
                <Button className="bg-gradient-to-r from-amber-500 to-orange-600" onClick={() => setShowAddSession(true)}>
                  <Plus className="w-4 h-4 mr-2" />Nova Sessão
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon"><MoreVertical className="w-4 h-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setShowEditClient(true)}>
                      <Edit className="w-4 h-4 mr-2" />Editar cliente
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t">
              <div className="text-center">
                <p className="text-2xl font-bold">{sessions.length}</p>
                <p className="text-sm text-muted-foreground">Sessões</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{upcomingSessions.length}</p>
                <p className="text-sm text-muted-foreground">Próximas</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{milestones.length}</p>
                <p className="text-sm text-muted-foreground">Marcos</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">
                  {client.session_rate ? `R$ ${client.session_rate}` : '-'}
                </p>
                <p className="text-sm text-muted-foreground">Por sessão</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Sessions Banner */}
        {upcomingSessions.length > 0 && (
          <Card className="mb-6 border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-500" />
                Próximos Encontros
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {upcomingSessions.slice(0, 3).map(s => (
                  <div key={s.id} className="flex items-center justify-between p-2 rounded-lg bg-background/60">
                    <div>
                      <p className="font-medium text-sm">{s.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(s.session_date), "EEEE, d 'de' MMM 'às' HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">{getSessionTypeLabel(s.session_type)}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs defaultValue="sessions" className="space-y-6">
          <TabsList>
            <TabsTrigger value="sessions">Sessões</TabsTrigger>
            <TabsTrigger value="milestones">Marcos</TabsTrigger>
            <TabsTrigger value="notes">Notas</TabsTrigger>
            <TabsTrigger value="evolution">Evolução</TabsTrigger>
          </TabsList>

          {/* Sessions Tab */}
          <TabsContent value="sessions">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Sessões</CardTitle>
                <CardDescription>Todas as sessões com este cliente</CardDescription>
              </CardHeader>
              <CardContent>
                {sessionsLoading ? (
                  <div className="space-y-4">{[1, 2, 3].map(i => <Skeleton key={i} className="h-24" />)}</div>
                ) : sessions.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium mb-2">Nenhuma sessão registrada</p>
                    <p className="text-sm text-muted-foreground mb-4">Adicione a primeira sessão com este cliente</p>
                    <Button onClick={() => setShowAddSession(true)}><Plus className="w-4 h-4 mr-2" />Nova Sessão</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sessions.map((session) => (
                      <div key={session.id} className="flex items-start gap-4 p-4 rounded-xl border hover:bg-muted/50 transition-colors">
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
                              <Clock className="w-3 h-3" />{session.duration_minutes} min
                            </span>
                            <span className="flex items-center gap-1">
                              <Tag className="w-3 h-3" />{getSessionTypeLabel(session.session_type)}
                            </span>
                          </div>
                          {session.notes && <p className="text-sm text-muted-foreground line-clamp-2">{session.notes}</p>}
                          {session.tags && session.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {session.tags.map(tag => <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>)}
                            </div>
                          )}
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setEditingSession(session)}>
                              <Edit className="w-4 h-4 mr-2" />Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setDeletingSession(session.id)} className="text-destructive">
                              <Trash2 className="w-4 h-4 mr-2" />Excluir
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

          {/* Milestones Tab */}
          <TabsContent value="milestones">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Marcos Atingidos</CardTitle>
                  <CardDescription>Conquistas e progressos ao longo da jornada</CardDescription>
                </div>
                <Button size="sm" onClick={() => setShowAddMilestone(true)} className="bg-gradient-to-r from-amber-500 to-orange-600">
                  <Plus className="w-4 h-4 mr-1" />Novo Marco
                </Button>
              </CardHeader>
              <CardContent>
                {milestonesLoading ? (
                  <div className="space-y-4">{[1, 2].map(i => <Skeleton key={i} className="h-16" />)}</div>
                ) : milestones.length === 0 ? (
                  <div className="text-center py-12">
                    <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium mb-2">Nenhum marco registrado</p>
                    <p className="text-sm text-muted-foreground mb-4">Registre conquistas e progressos do cliente</p>
                    <Button onClick={() => setShowAddMilestone(true)}><Plus className="w-4 h-4 mr-2" />Novo Marco</Button>
                  </div>
                ) : (
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />
                    <div className="space-y-6">
                      {milestones.map((m) => (
                        <div key={m.id} className="flex items-start gap-4 relative">
                          <div className="w-10 h-10 rounded-full border-2 border-background bg-muted flex items-center justify-center z-10">
                            {getMilestoneIcon(m.milestone_type)}
                          </div>
                          <div className="flex-1 pt-1">
                            <div className="flex items-center justify-between">
                              <p className="font-medium">{m.title}</p>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">
                                  {format(new Date(m.milestone_date), "d 'de' MMM yyyy", { locale: ptBR })}
                                </span>
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setDeletingMilestone(m.id)}>
                                  <Trash2 className="w-3 h-3 text-muted-foreground" />
                                </Button>
                              </div>
                            </div>
                            {m.description && <p className="text-sm text-muted-foreground mt-1">{m.description}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notes Tab */}
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
                  <p className="text-muted-foreground text-center py-8">Nenhuma nota adicionada ainda</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Evolution Tab */}
          <TabsContent value="evolution">
            <Card>
              <CardHeader>
                <CardTitle>Evolução do Cliente</CardTitle>
                <CardDescription>Visão consolidada da jornada</CardDescription>
              </CardHeader>
              <CardContent>
                {(sessions.length === 0 && milestones.length === 0) ? (
                  <div className="text-center py-12">
                    <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium mb-2">Sem dados ainda</p>
                    <p className="text-sm text-muted-foreground">Registre sessões e marcos para visualizar a evolução</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Summary */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-4 rounded-xl bg-muted/50 text-center">
                        <p className="text-2xl font-bold text-green-600">{completedSessions.length}</p>
                        <p className="text-xs text-muted-foreground">Sessões concluídas</p>
                      </div>
                      <div className="p-4 rounded-xl bg-muted/50 text-center">
                        <p className="text-2xl font-bold text-amber-600">{milestones.length}</p>
                        <p className="text-xs text-muted-foreground">Marcos atingidos</p>
                      </div>
                      <div className="p-4 rounded-xl bg-muted/50 text-center">
                        <p className="text-2xl font-bold text-blue-600">{upcomingSessions.length}</p>
                        <p className="text-xs text-muted-foreground">Encontros agendados</p>
                      </div>
                    </div>

                    {/* Combined Timeline */}
                    <div>
                      <h3 className="font-semibold mb-4">Timeline</h3>
                      <div className="relative">
                        <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />
                        <div className="space-y-4">
                          {[
                            ...completedSessions.map(s => ({ type: 'session' as const, date: s.session_date, data: s })),
                            ...milestones.map(m => ({ type: 'milestone' as const, date: m.milestone_date, data: m })),
                          ]
                            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                            .slice(0, 20)
                            .map((item, idx) => (
                              <div key={idx} className="flex items-start gap-4 relative">
                                <div className="w-10 h-10 rounded-full border-2 border-background bg-muted flex items-center justify-center z-10">
                                  {item.type === 'session' 
                                    ? <Calendar className="w-4 h-4 text-green-500" />
                                    : getMilestoneIcon((item.data as any).milestone_type)
                                  }
                                </div>
                                <div className="flex-1 pt-1">
                                  <p className="font-medium text-sm">
                                    {item.type === 'session' ? (item.data as ClientSession).title : (item.data as any).title}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {format(new Date(item.date), "d 'de' MMM yyyy", { locale: ptBR })}
                                    {item.type === 'session' && ' — Sessão'}
                                    {item.type === 'milestone' && ' — Marco'}
                                  </p>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Client Dialog */}
      {showEditClient && (
        <PraxisClientDialog open={showEditClient} onOpenChange={setShowEditClient} client={client} mode="edit" />
      )}

      {/* Add/Edit Session Dialog */}
      <PraxisSessionDialog
        open={showAddSession || !!editingSession}
        onOpenChange={(open) => { if (!open) { setShowAddSession(false); setEditingSession(null); } }}
        clientId={clientId!}
        session={editingSession || undefined}
        mode={editingSession ? 'edit' : 'create'}
      />

      {/* Add Milestone Dialog */}
      <Dialog open={showAddMilestone} onOpenChange={setShowAddMilestone}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Novo Marco</DialogTitle>
            <DialogDescription>Registre uma conquista ou progresso do cliente.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Título *</Label>
              <Input
                placeholder="Ex: Primeira apresentação pública"
                value={milestoneForm.title}
                onChange={(e) => setMilestoneForm(p => ({ ...p, title: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea
                placeholder="Detalhes sobre o marco..."
                value={milestoneForm.description}
                onChange={(e) => setMilestoneForm(p => ({ ...p, description: e.target.value }))}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Tipo</Label>
              <div className="flex gap-2 flex-wrap">
                {[
                  { value: 'achievement', label: '🏆 Conquista' },
                  { value: 'breakthrough', label: '✨ Avanço' },
                  { value: 'goal_reached', label: '🎯 Meta atingida' },
                  { value: 'checkpoint', label: '🚩 Checkpoint' },
                ].map(t => (
                  <Badge
                    key={t.value}
                    variant={milestoneForm.milestone_type === t.value ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setMilestoneForm(p => ({ ...p, milestone_type: t.value }))}
                  >
                    {t.label}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddMilestone(false)}>Cancelar</Button>
            <Button onClick={handleCreateMilestone} disabled={!milestoneForm.title} className="bg-gradient-to-r from-amber-500 to-orange-600">
              Criar Marco
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Session Confirmation */}
      <AlertDialog open={!!deletingSession} onOpenChange={() => setDeletingSession(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir sessão?</AlertDialogTitle>
            <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteSession} className="bg-destructive text-destructive-foreground">Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Milestone Confirmation */}
      <AlertDialog open={!!deletingMilestone} onOpenChange={() => setDeletingMilestone(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir marco?</AlertDialogTitle>
            <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteMilestone} className="bg-destructive text-destructive-foreground">Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
