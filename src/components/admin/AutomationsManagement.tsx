import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { 
  Zap, 
  Plus, 
  Play,
  Pause,
  ArrowRight,
  Trash2,
  Loader2,
  Settings,
  Mail,
  MessageSquare,
  Bell
} from "lucide-react";

interface Automation {
  id: string;
  name: string;
  description: string | null;
  trigger_event: string;
  trigger_config: any;
  action_type: string;
  action_config: any;
  is_active: boolean;
  execution_count: number;
  last_executed_at: string | null;
}

const TRIGGER_EVENTS = [
  { value: "test_completed", label: "Teste Completado", icon: "✅" },
  { value: "purchase_made", label: "Compra Realizada", icon: "💳" },
  { value: "days_inactive", label: "Dias Inativo", icon: "⏰" },
  { value: "payment_failed", label: "Pagamento Falhou", icon: "❌" },
  { value: "mapa_generated", label: "Mapa Gerado", icon: "🗺️" },
  { value: "user_registered", label: "Novo Usuário", icon: "👤" },
];

const ACTION_TYPES = [
  { value: "send_email", label: "Enviar Email", icon: Mail },
  { value: "miguel_message", label: "Mensagem do Miguel", icon: MessageSquare },
  { value: "notification", label: "Notificação", icon: Bell },
  { value: "webhook", label: "Webhook Externo", icon: Zap },
];

export const AutomationsManagement = () => {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newAutomation, setNewAutomation] = useState({
    name: "",
    description: "",
    trigger_event: "",
    action_type: "",
    action_config: {},
  });

  useEffect(() => {
    fetchAutomations();
  }, []);

  const fetchAutomations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("automations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAutomations(data || []);
    } catch (error) {
      console.error("Error fetching automations:", error);
      toast.error("Erro ao carregar automações");
    } finally {
      setLoading(false);
    }
  };

  const toggleAutomation = async (automation: Automation) => {
    try {
      const { error } = await supabase
        .from("automations")
        .update({ is_active: !automation.is_active })
        .eq("id", automation.id);

      if (error) throw error;
      
      toast.success(automation.is_active ? "Automação pausada" : "Automação ativada");
      fetchAutomations();
    } catch (error) {
      console.error("Error toggling automation:", error);
      toast.error("Erro ao atualizar automação");
    }
  };

  const createAutomation = async () => {
    if (!newAutomation.name || !newAutomation.trigger_event || !newAutomation.action_type) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    try {
      const { error } = await supabase
        .from("automations")
        .insert({
          name: newAutomation.name,
          description: newAutomation.description,
          trigger_event: newAutomation.trigger_event,
          trigger_config: {},
          action_type: newAutomation.action_type,
          action_config: newAutomation.action_config,
          created_by: (await supabase.auth.getUser()).data.user?.id,
        });

      if (error) throw error;
      
      toast.success("Automação criada com sucesso");
      setDialogOpen(false);
      setNewAutomation({
        name: "",
        description: "",
        trigger_event: "",
        action_type: "",
        action_config: {},
      });
      fetchAutomations();
    } catch (error) {
      console.error("Error creating automation:", error);
      toast.error("Erro ao criar automação");
    }
  };

  const deleteAutomation = async (id: string) => {
    try {
      const { error } = await supabase
        .from("automations")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      toast.success("Automação removida");
      fetchAutomations();
    } catch (error) {
      console.error("Error deleting automation:", error);
      toast.error("Erro ao remover automação");
    }
  };

  const getTriggerInfo = (event: string) => TRIGGER_EVENTS.find(t => t.value === event);
  const getActionInfo = (type: string) => ACTION_TYPES.find(a => a.value === type);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Zap className="w-8 h-8" />
            Automações
          </h2>
          <p className="text-muted-foreground">Configure regras SE → ENTÃO para automatizar ações</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nova Automação
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Criar Automação</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Nome da Automação</Label>
                <Input
                  placeholder="Ex: Boas-vindas após compra"
                  value={newAutomation.name}
                  onChange={(e) => setNewAutomation({ ...newAutomation, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Descrição (opcional)</Label>
                <Textarea
                  placeholder="Descreva o que esta automação faz..."
                  value={newAutomation.description}
                  onChange={(e) => setNewAutomation({ ...newAutomation, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>SE (Gatilho)</Label>
                  <Select
                    value={newAutomation.trigger_event}
                    onValueChange={(v) => setNewAutomation({ ...newAutomation, trigger_event: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {TRIGGER_EVENTS.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.icon} {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>ENTÃO (Ação)</Label>
                  <Select
                    value={newAutomation.action_type}
                    onValueChange={(v) => setNewAutomation({ ...newAutomation, action_type: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {ACTION_TYPES.map((a) => (
                        <SelectItem key={a.value} value={a.value}>
                          {a.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button className="w-full" onClick={createAutomation}>
                Criar Automação
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {automations.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <Zap className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma automação configurada</h3>
            <p className="text-muted-foreground mb-4">
              Crie automações para automatizar tarefas repetitivas.
            </p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeira Automação
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {automations.map((automation) => {
            const trigger = getTriggerInfo(automation.trigger_event);
            const action = getActionInfo(automation.action_type);
            const ActionIcon = action?.icon || Settings;

            return (
              <Card key={automation.id} className={!automation.is_active ? "opacity-60" : ""}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={automation.is_active}
                        onCheckedChange={() => toggleAutomation(automation)}
                      />
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          {automation.name}
                          <Badge variant={automation.is_active ? "default" : "secondary"}>
                            {automation.is_active ? "Ativa" : "Pausada"}
                          </Badge>
                        </CardTitle>
                        {automation.description && (
                          <CardDescription>{automation.description}</CardDescription>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => deleteAutomation(automation.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-xl">{trigger?.icon}</span>
                      <div>
                        <p className="text-xs text-muted-foreground">SE</p>
                        <p className="font-medium">{trigger?.label}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground" />
                    <div className="flex items-center gap-2 flex-1">
                      <ActionIcon className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">ENTÃO</p>
                        <p className="font-medium">{action?.label}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                    <span>Execuções: {automation.execution_count}</span>
                    {automation.last_executed_at && (
                      <span>
                        Última execução: {new Date(automation.last_executed_at).toLocaleDateString("pt-BR")}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
