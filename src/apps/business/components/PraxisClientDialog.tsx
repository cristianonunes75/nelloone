import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { usePraxisClients, PraxisClient } from '../hooks/usePraxisClients';

interface PraxisClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client?: PraxisClient;
  mode?: 'create' | 'edit';
}

export function PraxisClientDialog({
  open,
  onOpenChange,
  client,
  mode = 'create',
}: PraxisClientDialogProps) {
  const { createClient, updateClient } = usePraxisClients();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: client?.name || '',
    email: client?.email || '',
    phone: client?.phone || '',
    notes: client?.notes || '',
    session_rate: client?.session_rate?.toString() || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = {
        name: formData.name,
        email: formData.email || null,
        phone: formData.phone || null,
        notes: formData.notes || null,
        session_rate: formData.session_rate ? parseFloat(formData.session_rate) : null,
      };

      if (mode === 'edit' && client) {
        await updateClient(client.id, data);
      } else {
        await createClient(data);
      }

      onOpenChange(false);
      // Reset form
      setFormData({ name: '', email: '', phone: '', notes: '', session_rate: '' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {mode === 'edit' ? 'Editar Cliente' : 'Novo Cliente'}
            </DialogTitle>
            <DialogDescription>
              {mode === 'edit' 
                ? 'Atualize as informações do cliente.' 
                : 'Adicione um novo cliente à sua prática.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                placeholder="Nome completo do cliente"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@exemplo.com"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone/WhatsApp</Label>
              <Input
                id="phone"
                placeholder="+55 11 99999-9999"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="session_rate">Valor por sessão (R$)</Label>
              <Input
                id="session_rate"
                type="number"
                step="0.01"
                min="0"
                placeholder="250.00"
                value={formData.session_rate}
                onChange={(e) => setFormData(prev => ({ ...prev, session_rate: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                placeholder="Notas sobre o cliente..."
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || !formData.name}
              className="bg-gradient-to-r from-amber-500 to-orange-600"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : mode === 'edit' ? (
                'Salvar'
              ) : (
                'Adicionar'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
