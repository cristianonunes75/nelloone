import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

const lostReasons = [
  { value: 'preco', label: 'Preço alto' },
  { value: 'concorrente', label: 'Escolheu concorrente' },
  { value: 'timing', label: 'Momento não é ideal' },
  { value: 'nao_respondeu', label: 'Não respondeu' },
  { value: 'desistiu', label: 'Desistiu do processo' },
  { value: 'outro', label: 'Outro motivo' },
];

interface LostReasonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: string) => Promise<void>;
  leadName?: string;
}

export const LostReasonDialog = ({ open, onOpenChange, onConfirm, leadName }: LostReasonDialogProps) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    const reason = selectedReason === 'outro' 
      ? customReason 
      : lostReasons.find(r => r.value === selectedReason)?.label || selectedReason;
    
    if (!reason.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onConfirm(reason);
      onOpenChange(false);
      setSelectedReason('');
      setCustomReason('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Motivo da Perda</DialogTitle>
          <DialogDescription>
            Registre o motivo pelo qual o lead {leadName} foi perdido. Isso ajuda a melhorar o processo de vendas.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div>
            <Label htmlFor="reason">Motivo *</Label>
            <Select value={selectedReason} onValueChange={setSelectedReason}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o motivo" />
              </SelectTrigger>
              <SelectContent>
                {lostReasons.map((reason) => (
                  <SelectItem key={reason.value} value={reason.value}>
                    {reason.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedReason === 'outro' && (
            <div>
              <Label htmlFor="customReason">Descreva o motivo</Label>
              <Textarea
                id="customReason"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Explique o motivo da perda..."
                rows={3}
              />
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button 
              variant="destructive"
              onClick={handleConfirm}
              disabled={isSubmitting || !selectedReason || (selectedReason === 'outro' && !customReason.trim())}
            >
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Confirmar Perda
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
