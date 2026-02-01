import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Phone, Mail, Instagram, Calendar, DollarSign, Edit2, MessageSquare } from 'lucide-react';
import type { Lead } from '@/types/leads';
import { leadStatusLabels, leadStatusColors, leadSourceLabels } from '@/types/leads';
import { cn } from '@/lib/utils';

interface LeadCardProps {
  lead: Lead;
  onEdit: (lead: Lead) => void;
  onAddActivity: (lead: Lead) => void;
  compact?: boolean;
  draggable?: boolean;
}

export const LeadCard = ({ lead, onEdit, onAddActivity, compact = false, draggable = false }: LeadCardProps) => {
  const hasNextAction = lead.next_action && lead.next_action_date;
  const isOverdue = hasNextAction && new Date(lead.next_action_date!) < new Date();

  return (
    <Card 
      className={cn(
        "transition-all hover:shadow-md",
        draggable && "cursor-grab active:cursor-grabbing",
        isOverdue && "border-destructive/50 bg-destructive/5"
      )}
      draggable={draggable}
      data-lead-id={lead.id}
    >
      <CardContent className={cn("p-4", compact && "p-3")}>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm truncate">{lead.full_name}</h4>
            <Badge variant="secondary" className="text-[10px] mt-1">
              {leadSourceLabels[lead.source]}
            </Badge>
          </div>
          
          {!compact && (
            <Badge className={cn("text-[10px] shrink-0", leadStatusColors[lead.status])}>
              {leadStatusLabels[lead.status]}
            </Badge>
          )}
        </div>

        {!compact && (
          <div className="space-y-1 text-xs text-muted-foreground mb-3">
            {lead.phone && (
              <div className="flex items-center gap-1.5">
                <Phone className="w-3 h-3" />
                <span>{lead.phone}</span>
              </div>
            )}
            {lead.email && (
              <div className="flex items-center gap-1.5 truncate">
                <Mail className="w-3 h-3 shrink-0" />
                <span className="truncate">{lead.email}</span>
              </div>
            )}
            {lead.instagram_handle && (
              <div className="flex items-center gap-1.5">
                <Instagram className="w-3 h-3" />
                <span>{lead.instagram_handle}</span>
              </div>
            )}
          </div>
        )}

        {lead.value_estimate > 0 && (
          <div className="flex items-center gap-1 text-xs font-medium text-green-600 mb-2">
            <DollarSign className="w-3 h-3" />
            <span>R$ {lead.value_estimate.toLocaleString('pt-BR')}</span>
          </div>
        )}

        {hasNextAction && (
          <div className={cn(
            "text-xs p-2 rounded-md mb-2",
            isOverdue ? "bg-destructive/10 text-destructive" : "bg-muted"
          )}>
            <div className="flex items-center gap-1 font-medium">
              <Calendar className="w-3 h-3" />
              {format(new Date(lead.next_action_date!), "dd/MM", { locale: ptBR })}
              {isOverdue && " (atrasado)"}
            </div>
            <p className="mt-0.5 truncate">{lead.next_action}</p>
          </div>
        )}

        {!compact && (
          <div className="flex gap-1 mt-2">
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-7 text-xs flex-1"
              onClick={() => onEdit(lead)}
            >
              <Edit2 className="w-3 h-3 mr-1" />
              Editar
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-7 text-xs flex-1"
              onClick={() => onAddActivity(lead)}
            >
              <MessageSquare className="w-3 h-3 mr-1" />
              Nota
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
