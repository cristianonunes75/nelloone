import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import type { Lead, LeadSource } from '@/types/leads';
import { leadSourceLabels } from '@/types/leads';

interface LeadFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead?: Lead | null;
  onSubmit: (data: Partial<Lead>) => Promise<void>;
}

export const LeadFormDialog = ({ open, onOpenChange, lead, onSubmit }: LeadFormDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<Lead>>({
    full_name: '',
    phone: '',
    email: '',
    instagram_handle: '',
    source: 'outro',
    value_estimate: 0,
    notes: '',
    next_action: '',
    next_action_date: '',
  });

  useEffect(() => {
    if (lead) {
      setFormData({
        full_name: lead.full_name,
        phone: lead.phone || '',
        email: lead.email || '',
        instagram_handle: lead.instagram_handle || '',
        source: lead.source,
        value_estimate: lead.value_estimate,
        notes: lead.notes || '',
        next_action: lead.next_action || '',
        next_action_date: lead.next_action_date?.split('T')[0] || '',
      });
    } else {
      setFormData({
        full_name: '',
        phone: '',
        email: '',
        instagram_handle: '',
        source: 'outro',
        value_estimate: 0,
        notes: '',
        next_action: '',
        next_action_date: '',
      });
    }
  }, [lead, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSubmit({
        ...formData,
        next_action_date: formData.next_action_date 
          ? new Date(formData.next_action_date).toISOString() 
          : null,
      });
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{lead ? 'Editar Lead' : 'Novo Lead'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="full_name">Nome Completo *</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                required
                placeholder="Nome do lead"
              />
            </div>

            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(11) 99999-9999"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@exemplo.com"
              />
            </div>

            <div>
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                value={formData.instagram_handle || ''}
                onChange={(e) => setFormData({ ...formData, instagram_handle: e.target.value })}
                placeholder="@usuario"
              />
            </div>

            <div>
              <Label htmlFor="source">Origem</Label>
              <Select
                value={formData.source}
                onValueChange={(value: LeadSource) => setFormData({ ...formData, source: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(leadSourceLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="value_estimate">Valor Estimado (R$)</Label>
              <Input
                id="value_estimate"
                type="number"
                value={formData.value_estimate || 0}
                onChange={(e) => setFormData({ ...formData, value_estimate: Number(e.target.value) })}
                placeholder="0"
              />
            </div>

            <div>
              <Label htmlFor="next_action_date">Data Próxima Ação</Label>
              <Input
                id="next_action_date"
                type="date"
                value={formData.next_action_date?.split('T')[0] || ''}
                onChange={(e) => setFormData({ ...formData, next_action_date: e.target.value })}
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="next_action">Próxima Ação</Label>
              <Input
                id="next_action"
                value={formData.next_action || ''}
                onChange={(e) => setFormData({ ...formData, next_action: e.target.value })}
                placeholder="Ex: Ligar para marcar reunião"
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="notes">Notas</Label>
              <Textarea
                id="notes"
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Observações sobre o lead..."
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting || !formData.full_name}>
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {lead ? 'Salvar' : 'Criar Lead'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
