import { useMemo, useState } from 'react';
import { format, isToday, isPast, addDays, isBefore } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Loader2, 
  Shield, 
  ArrowLeft, 
  Clock, 
  AlertTriangle, 
  Calendar, 
  Phone,
  MessageSquare,
  CheckCircle,
} from 'lucide-react';
import { useLeads } from '@/hooks/useLeads';
import { useAdminPermissions } from '@/hooks/useAdminPermissions';
import { LeadFormDialog } from './leads/LeadFormDialog';
import { ActivityDialog } from './leads/ActivityDialog';
import { useNavigate } from 'react-router-dom';
import type { Lead, LeadActivity, ActivityType } from '@/types/leads';
import { leadStatusLabels, leadSourceLabels } from '@/types/leads';
import { cn } from '@/lib/utils';

export const AdminFollowups = () => {
  const navigate = useNavigate();
  const { hasPermission, isSuperAdmin, isLoading: permissionsLoading } = useAdminPermissions();
  const { leads, isLoading, updateLead, addActivity, getActivities } = useLeads();
  
  const [formOpen, setFormOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  
  const [activityDialogOpen, setActivityDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [activities, setActivities] = useState<LeadActivity[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(false);

  const canManageLeads = isSuperAdmin || hasPermission('can_manage_leads' as any);

  const { overdue, today, upcoming } = useMemo(() => {
    const now = new Date();
    const nextWeek = addDays(now, 7);
    
    const activeLeads = leads.filter(l => 
      l.next_action_date && 
      !['fechado_ganho', 'fechado_perdido'].includes(l.status)
    );
    
    return {
      overdue: activeLeads.filter(l => 
        isPast(new Date(l.next_action_date!)) && !isToday(new Date(l.next_action_date!))
      ).sort((a, b) => new Date(a.next_action_date!).getTime() - new Date(b.next_action_date!).getTime()),
      
      today: activeLeads.filter(l => 
        isToday(new Date(l.next_action_date!))
      ),
      
      upcoming: activeLeads.filter(l => {
        const date = new Date(l.next_action_date!);
        return !isPast(date) && !isToday(date) && isBefore(date, nextWeek);
      }).sort((a, b) => new Date(a.next_action_date!).getTime() - new Date(b.next_action_date!).getTime()),
    };
  }, [leads]);

  const handleEditClick = (lead: Lead) => {
    setEditingLead(lead);
    setFormOpen(true);
  };

  const handleUpdateLead = async (data: Partial<Lead>) => {
    if (editingLead) {
      await updateLead(editingLead.id, data);
      setEditingLead(null);
    }
  };

  const handleAddActivityClick = async (lead: Lead) => {
    setSelectedLead(lead);
    setActivityDialogOpen(true);
    setLoadingActivities(true);
    const acts = await getActivities(lead.id);
    setActivities(acts);
    setLoadingActivities(false);
  };

  const handleAddActivity = async (type: ActivityType, summary: string) => {
    if (selectedLead) {
      await addActivity(selectedLead.id, type, summary);
      const acts = await getActivities(selectedLead.id);
      setActivities(acts);
    }
  };

  const handleMarkDone = async (lead: Lead) => {
    // Move next action to tomorrow as a simple "done" action
    const tomorrow = addDays(new Date(), 1);
    await updateLead(lead.id, { 
      next_action_date: tomorrow.toISOString(),
      next_action: 'Follow-up' 
    });
    await addActivity(lead.id, 'note', `Ação "${lead.next_action}" concluída`);
  };

  if (permissionsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!canManageLeads) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md w-full border-border/50">
          <CardContent className="pt-8 pb-8 text-center space-y-6">
            <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <Shield className="w-8 h-8 text-destructive" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-foreground">Acesso Restrito</h3>
              <p className="text-muted-foreground text-sm">
                Você não tem permissão para visualizar follow-ups.
              </p>
            </div>
            <Button variant="outline" onClick={() => navigate('/admin')} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Voltar ao Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const FollowupCard = ({ lead, isOverdue = false }: { lead: Lead; isOverdue?: boolean }) => (
    <Card className={cn(
      "transition-all hover:shadow-md",
      isOverdue && "border-destructive/50 bg-destructive/5"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium truncate">{lead.full_name}</h4>
              <Badge variant="outline" className="text-[10px] shrink-0">
                {leadStatusLabels[lead.status]}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              {lead.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  {lead.phone}
                </span>
              )}
              <span>•</span>
              <span>{leadSourceLabels[lead.source]}</span>
            </div>
            
            <div className={cn(
              "p-2 rounded-md text-sm",
              isOverdue ? "bg-destructive/10" : "bg-muted"
            )}>
              <div className="flex items-center gap-2 font-medium">
                <Calendar className="w-3.5 h-3.5" />
                {format(new Date(lead.next_action_date!), "EEEE, dd 'de' MMMM", { locale: ptBR })}
                {isOverdue && (
                  <Badge variant="destructive" className="text-[10px]">Atrasado</Badge>
                )}
              </div>
              {lead.next_action && (
                <p className="mt-1">{lead.next_action}</p>
              )}
            </div>
          </div>
          
          <div className="flex flex-col gap-1">
            <Button size="sm" variant="outline" onClick={() => handleEditClick(lead)}>
              Editar
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleAddActivityClick(lead)}>
              <MessageSquare className="w-3 h-3 mr-1" />
              Nota
            </Button>
            <Button size="sm" variant="default" onClick={() => handleMarkDone(lead)}>
              <CheckCircle className="w-3 h-3 mr-1" />
              Feito
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const EmptyState = ({ message }: { message: string }) => (
    <div className="text-center py-12 text-muted-foreground">
      <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
      <p>{message}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Follow-ups</h1>
        <p className="text-muted-foreground text-sm">
          Suas ações pendentes organizadas por prazo
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card className={cn(overdue.length > 0 && "border-destructive/50")}>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className={cn("w-4 h-4", overdue.length > 0 ? "text-destructive" : "text-muted-foreground")} />
              <span className="text-sm text-muted-foreground">Atrasados</span>
            </div>
            <p className={cn("text-2xl font-bold mt-1", overdue.length > 0 && "text-destructive")}>
              {overdue.length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <span className="text-sm text-muted-foreground">Hoje</span>
            </div>
            <p className="text-2xl font-bold mt-1">{today.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Próximos 7 dias</span>
            </div>
            <p className="text-2xl font-bold mt-1">{upcoming.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue={overdue.length > 0 ? "overdue" : "today"}>
        <TabsList>
          <TabsTrigger value="overdue" className="gap-2">
            Atrasados
            {overdue.length > 0 && (
              <Badge variant="destructive" className="text-[10px] h-4 px-1">
                {overdue.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="today" className="gap-2">
            Hoje
            {today.length > 0 && (
              <Badge variant="secondary" className="text-[10px] h-4 px-1">
                {today.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="gap-2">
            Próximos 7 dias
            {upcoming.length > 0 && (
              <Badge variant="secondary" className="text-[10px] h-4 px-1">
                {upcoming.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overdue" className="mt-4">
          {overdue.length === 0 ? (
            <EmptyState message="Nenhuma ação atrasada! 🎉" />
          ) : (
            <div className="space-y-3">
              {overdue.map((lead) => (
                <FollowupCard key={lead.id} lead={lead} isOverdue />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="today" className="mt-4">
          {today.length === 0 ? (
            <EmptyState message="Nenhuma ação para hoje" />
          ) : (
            <div className="space-y-3">
              {today.map((lead) => (
                <FollowupCard key={lead.id} lead={lead} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="mt-4">
          {upcoming.length === 0 ? (
            <EmptyState message="Nenhuma ação agendada para os próximos dias" />
          ) : (
            <div className="space-y-3">
              {upcoming.map((lead) => (
                <FollowupCard key={lead.id} lead={lead} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <LeadFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        lead={editingLead}
        onSubmit={handleUpdateLead}
      />

      <ActivityDialog
        open={activityDialogOpen}
        onOpenChange={setActivityDialogOpen}
        lead={selectedLead}
        activities={activities}
        onAddActivity={handleAddActivity}
        isLoading={loadingActivities}
      />
    </div>
  );
};

export default AdminFollowups;
