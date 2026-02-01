import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2 } from 'lucide-react';
import type { Lead, LeadActivity, ActivityType } from '@/types/leads';
import { activityTypeLabels, activityTypeIcons } from '@/types/leads';

interface ActivityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead | null;
  activities: LeadActivity[];
  onAddActivity: (type: ActivityType, summary: string) => Promise<void>;
  isLoading?: boolean;
}

export const ActivityDialog = ({ 
  open, 
  onOpenChange, 
  lead, 
  activities, 
  onAddActivity,
  isLoading 
}: ActivityDialogProps) => {
  const [activityType, setActivityType] = useState<ActivityType>('note');
  const [summary, setSummary] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setSummary('');
      setActivityType('note');
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!summary.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onAddActivity(activityType, summary);
      setSummary('');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!lead) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Atividades - {lead.full_name}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3 pb-4 border-b">
          <div className="flex gap-2">
            <div className="w-32">
              <Select
                value={activityType}
                onValueChange={(value: ActivityType) => setActivityType(value)}
              >
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(['note', 'call', 'whatsapp', 'meeting'] as ActivityType[]).map((type) => (
                    <SelectItem key={type} value={type}>
                      {activityTypeIcons[type]} {activityTypeLabels[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Descreva a atividade..."
                rows={2}
                className="resize-none"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" size="sm" disabled={isSubmitting || !summary.trim()}>
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Registrar
            </Button>
          </div>
        </form>

        <div className="flex-1 min-h-0">
          <Label className="text-xs text-muted-foreground mb-2 block">
            Histórico ({activities.length})
          </Label>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          ) : activities.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Nenhuma atividade registrada ainda.
            </p>
          ) : (
            <ScrollArea className="h-[300px]">
              <div className="space-y-3 pr-4">
                {activities.map((activity) => (
                  <div 
                    key={activity.id} 
                    className="border-l-2 border-muted pl-3 py-1"
                  >
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{activityTypeIcons[activity.type]}</span>
                      <span className="font-medium">{activityTypeLabels[activity.type]}</span>
                      <span>•</span>
                      <span>
                        {format(new Date(activity.created_at), "dd/MM/yy 'às' HH:mm", { locale: ptBR })}
                      </span>
                    </div>
                    {activity.summary && (
                      <p className="text-sm mt-1">{activity.summary}</p>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
