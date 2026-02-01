import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Plus, 
  Search, 
  Users, 
  Filter,
  Loader2,
  Shield,
  ArrowLeft,
} from 'lucide-react';
import { useLeads } from '@/hooks/useLeads';
import { useAdminPermissions } from '@/hooks/useAdminPermissions';
import { LeadFormDialog } from './leads/LeadFormDialog';
import { ActivityDialog } from './leads/ActivityDialog';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Lead, LeadStatus, LeadSource, LeadActivity, ActivityType } from '@/types/leads';
import { leadStatusLabels, leadStatusColors, leadSourceLabels } from '@/types/leads';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

export const AdminLeads = () => {
  const navigate = useNavigate();
  const { hasPermission, isSuperAdmin, isLoading: permissionsLoading } = useAdminPermissions();
  const { leads, isLoading, createLead, updateLead, addActivity, getActivities } = useLeads();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');
  const [sourceFilter, setSourceFilter] = useState<LeadSource | 'all'>('all');
  
  const [formOpen, setFormOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  
  const [activityDialogOpen, setActivityDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [activities, setActivities] = useState<LeadActivity[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(false);

  // Check permission - must be after all hooks
  const canManageLeads = isSuperAdmin || hasPermission('can_manage_leads' as any);

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesSearch = 
        lead.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone?.includes(searchTerm);
      
      const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
      const matchesSource = sourceFilter === 'all' || lead.source === sourceFilter;
      
      return matchesSearch && matchesStatus && matchesSource;
    });
  }, [leads, searchTerm, statusFilter, sourceFilter]);

  // Access denied state
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
                Você não tem permissão para gerenciar leads.
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

  const handleCreateLead = async (data: Partial<Lead>) => {
    await createLead(data);
  };

  const handleUpdateLead = async (data: Partial<Lead>) => {
    if (editingLead) {
      await updateLead(editingLead.id, data);
      setEditingLead(null);
    }
  };

  const handleEditClick = (lead: Lead) => {
    setEditingLead(lead);
    setFormOpen(true);
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Leads</h1>
          <p className="text-muted-foreground text-sm">
            Gerencie seus leads e oportunidades de venda
          </p>
        </div>
        <Button onClick={() => { setEditingLead(null); setFormOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Lead
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Total</span>
            </div>
            <p className="text-2xl font-bold mt-1">{leads.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">Em negociação</div>
            <p className="text-2xl font-bold mt-1">
              {leads.filter(l => ['qualificado', 'conversa_marcada', 'proposta_enviada', 'em_decisao'].includes(l.status)).length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">Ganhos</div>
            <p className="text-2xl font-bold mt-1 text-green-600">
              {leads.filter(l => l.status === 'fechado_ganho').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">Valor potencial</div>
            <p className="text-2xl font-bold mt-1">
              R$ {leads.reduce((sum, l) => sum + (l.value_estimate || 0), 0).toLocaleString('pt-BR')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, email ou telefone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as LeadStatus | 'all')}>
              <SelectTrigger className="w-[160px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos status</SelectItem>
                {Object.entries(leadStatusLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sourceFilter} onValueChange={(v) => setSourceFilter(v as LeadSource | 'all')}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Origem" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas origens</SelectItem>
                {Object.entries(leadSourceLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum lead encontrado</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Origem</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Próxima Ação</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead.full_name}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {lead.phone && <div>{lead.phone}</div>}
                        {lead.email && <div className="text-muted-foreground truncate max-w-[200px]">{lead.email}</div>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{leadSourceLabels[lead.source]}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn("text-xs", leadStatusColors[lead.status])}>
                        {leadStatusLabels[lead.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {lead.value_estimate > 0 ? `R$ ${lead.value_estimate.toLocaleString('pt-BR')}` : '-'}
                    </TableCell>
                    <TableCell>
                      {lead.next_action_date ? (
                        <div className="text-sm">
                          <div className={cn(
                            "font-medium",
                            new Date(lead.next_action_date) < new Date() && "text-destructive"
                          )}>
                            {format(new Date(lead.next_action_date), "dd/MM", { locale: ptBR })}
                          </div>
                          {lead.next_action && (
                            <div className="text-muted-foreground truncate max-w-[150px]">
                              {lead.next_action}
                            </div>
                          )}
                        </div>
                      ) : '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => handleEditClick(lead)}>
                          Editar
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleAddActivityClick(lead)}>
                          Notas
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <LeadFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        lead={editingLead}
        onSubmit={editingLead ? handleUpdateLead : handleCreateLead}
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

export default AdminLeads;
