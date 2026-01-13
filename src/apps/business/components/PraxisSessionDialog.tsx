import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { usePraxisSessions, ClientSession } from '../hooks/usePraxisClients';

interface PraxisSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string;
  session?: ClientSession;
  mode?: 'create' | 'edit';
}

export function PraxisSessionDialog({
  open,
  onOpenChange,
  clientId,
  session,
  mode = 'create',
}: PraxisSessionDialogProps) {
  const { createSession, updateSession } = usePraxisSessions(clientId);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    session_date: new Date().toISOString().slice(0, 16),
    duration_minutes: '60',
    session_type: 'coaching',
    status: 'scheduled',
    objectives: '',
    notes: '',
    insights: '',
    tasks_for_client: '',
    attention_points: '',
  });

  useEffect(() => {
    if (session && mode === 'edit') {
      setFormData({
        title: session.title || '',
        session_date: session.session_date.slice(0, 16),
        duration_minutes: session.duration_minutes?.toString() || '60',
        session_type: session.session_type || 'coaching',
        status: session.status || 'scheduled',
        objectives: session.objectives || '',
        notes: session.notes || '',
        insights: session.insights || '',
        tasks_for_client: session.tasks_for_client || '',
        attention_points: session.attention_points || '',
      });
    }
  }, [session, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = {
        title: formData.title,
        session_date: new Date(formData.session_date).toISOString(),
        duration_minutes: parseInt(formData.duration_minutes) || 60,
        session_type: formData.session_type,
        status: formData.status,
        objectives: formData.objectives || null,
        notes: formData.notes || null,
        insights: formData.insights || null,
        tasks_for_client: formData.tasks_for_client || null,
        attention_points: formData.attention_points || null,
      };

      if (mode === 'edit' && session) {
        await updateSession(session.id, data);
      } else {
        await createSession(data);
      }

      onOpenChange(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {mode === 'edit' ? 'Editar Sessão' : 'Nova Sessão'}
            </DialogTitle>
            <DialogDescription>
              {mode === 'edit' ? 'Atualize os detalhes da sessão.' : 'Registre uma nova sessão com o cliente.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título da Sessão *</Label>
              <Input
                id="title"
                placeholder="Ex: Sessão de Alinhamento"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="session_date">Data e Hora *</Label>
                <Input
                  id="session_date"
                  type="datetime-local"
                  value={formData.session_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, session_date: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duração (min)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="15"
                  step="15"
                  value={formData.duration_minutes}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration_minutes: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select value={formData.session_type} onValueChange={(v) => setFormData(prev => ({ ...prev, session_type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="coaching">Coaching</SelectItem>
                    <SelectItem value="mentoring">Mentoria</SelectItem>
                    <SelectItem value="therapy">Terapia</SelectItem>
                    <SelectItem value="consulting">Consultoria</SelectItem>
                    <SelectItem value="followup">Follow-up</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData(prev => ({ ...prev, status: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Agendada</SelectItem>
                    <SelectItem value="completed">Concluída</SelectItem>
                    <SelectItem value="cancelled">Cancelada</SelectItem>
                    <SelectItem value="no_show">Não compareceu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="objectives">Objetivos</Label>
              <Textarea
                id="objectives"
                placeholder="O que pretendemos alcançar nesta sessão..."
                value={formData.objectives}
                onChange={(e) => setFormData(prev => ({ ...prev, objectives: e.target.value }))}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Anotações</Label>
              <Textarea
                id="notes"
                placeholder="Notas da sessão..."
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="insights">Insights</Label>
              <Textarea
                id="insights"
                placeholder="Descobertas e percepções importantes..."
                value={formData.insights}
                onChange={(e) => setFormData(prev => ({ ...prev, insights: e.target.value }))}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tasks">Tarefas para o Cliente</Label>
              <Textarea
                id="tasks"
                placeholder="Atividades e tarefas..."
                value={formData.tasks_for_client}
                onChange={(e) => setFormData(prev => ({ ...prev, tasks_for_client: e.target.value }))}
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || !formData.title}
              className="bg-gradient-to-r from-amber-500 to-orange-600"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : mode === 'edit' ? 'Salvar' : 'Criar Sessão'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
