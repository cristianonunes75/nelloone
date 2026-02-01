import { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Shield, ArrowLeft, GripVertical } from 'lucide-react';
import { useLeads } from '@/hooks/useLeads';
import { useAdminPermissions } from '@/hooks/useAdminPermissions';
import { LeadCard } from './leads/LeadCard';
import { LeadFormDialog } from './leads/LeadFormDialog';
import { ActivityDialog } from './leads/ActivityDialog';
import { LostReasonDialog } from './leads/LostReasonDialog';
import { useNavigate } from 'react-router-dom';
import type { Lead, LeadStatus, LeadActivity, ActivityType } from '@/types/leads';
import { leadStatusLabels, pipelineColumns } from '@/types/leads';
import { cn } from '@/lib/utils';

export const AdminPipeline = () => {
  const navigate = useNavigate();
  const { hasPermission, isSuperAdmin, isLoading: permissionsLoading } = useAdminPermissions();
  const { leads, isLoading, changeLeadStatus, updateLead, addActivity, getActivities } = useLeads();
  
  const [draggingLead, setDraggingLead] = useState<Lead | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<LeadStatus | null>(null);
  
  const [formOpen, setFormOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  
  const [activityDialogOpen, setActivityDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [activities, setActivities] = useState<LeadActivity[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(false);
  
  const [lostReasonOpen, setLostReasonOpen] = useState(false);
  const [pendingLostLead, setPendingLostLead] = useState<Lead | null>(null);

  const canManageLeads = isSuperAdmin || hasPermission('can_manage_leads' as any);

  const leadsByStatus = useMemo(() => {
    const grouped: Record<LeadStatus, Lead[]> = {
      novo: [],
      qualificado: [],
      conversa_marcada: [],
      proposta_enviada: [],
      em_decisao: [],
      fechado_ganho: [],
      fechado_perdido: [],
    };
    
    leads.forEach(lead => {
      if (grouped[lead.status]) {
        grouped[lead.status].push(lead);
      }
    });
    
    return grouped;
  }, [leads]);

  const handleDragStart = (e: React.DragEvent, lead: Lead) => {
    setDraggingLead(lead);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, status: LeadStatus) => {
    e.preventDefault();
    setDragOverColumn(status);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = async (e: React.DragEvent, newStatus: LeadStatus) => {
    e.preventDefault();
    setDragOverColumn(null);
    
    if (!draggingLead || draggingLead.status === newStatus) {
      setDraggingLead(null);
      return;
    }

    // If moving to lost, require reason
    if (newStatus === 'fechado_perdido') {
      setPendingLostLead(draggingLead);
      setLostReasonOpen(true);
      setDraggingLead(null);
      return;
    }

    await changeLeadStatus(draggingLead.id, newStatus);
    setDraggingLead(null);
  };

  const handleConfirmLost = async (reason: string) => {
    if (pendingLostLead) {
      await changeLeadStatus(pendingLostLead.id, 'fechado_perdido', reason);
      setPendingLostLead(null);
    }
  };

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
                Você não tem permissão para visualizar o pipeline.
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pipeline de Vendas</h1>
        <p className="text-muted-foreground text-sm">
          Arraste os leads entre as colunas para atualizar o status
        </p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {pipelineColumns.map((status) => (
          <div
            key={status}
            className={cn(
              "flex-shrink-0 w-[280px] rounded-lg border-2 border-dashed transition-colors",
              dragOverColumn === status 
                ? "border-primary bg-primary/5" 
                : "border-transparent"
            )}
            onDragOver={(e) => handleDragOver(e, status)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, status)}
          >
            <Card className="h-full">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    {leadStatusLabels[status]}
                  </CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    {leadsByStatus[status].length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-2">
                <ScrollArea className="h-[calc(100vh-280px)]">
                  <div className="space-y-2 pr-2">
                    {leadsByStatus[status].map((lead) => (
                      <div
                        key={lead.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, lead)}
                        onDragEnd={() => setDraggingLead(null)}
                        className={cn(
                          "transition-opacity",
                          draggingLead?.id === lead.id && "opacity-50"
                        )}
                      >
                        <LeadCard
                          lead={lead}
                          compact
                          draggable
                          onEdit={handleEditClick}
                          onAddActivity={handleAddActivityClick}
                        />
                      </div>
                    ))}
                    {leadsByStatus[status].length === 0 && (
                      <p className="text-center text-sm text-muted-foreground py-8">
                        Nenhum lead
                      </p>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

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

      <LostReasonDialog
        open={lostReasonOpen}
        onOpenChange={setLostReasonOpen}
        onConfirm={handleConfirmLost}
        leadName={pendingLostLead?.full_name}
      />
    </div>
  );
};

export default AdminPipeline;
