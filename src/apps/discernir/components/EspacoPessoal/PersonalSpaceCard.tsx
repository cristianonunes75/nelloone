import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Clock, CheckCircle2 } from 'lucide-react';

interface PersonalSpaceCardProps {
  fullName: string;
  avatarUrl?: string | null;
  parishName?: string | null;
  pastoralStatus: 'em_escuta' | 'aguardando_conversa' | 'caminho_concluido';
}

const statusConfig = {
  em_escuta: {
    label: 'Em escuta',
    icon: Heart,
    className: 'bg-amber-100 text-amber-800 border-amber-200'
  },
  aguardando_conversa: {
    label: 'Aguardando conversa pastoral',
    icon: Clock,
    className: 'bg-blue-100 text-blue-800 border-blue-200'
  },
  caminho_concluido: {
    label: 'Caminho concluído',
    icon: CheckCircle2,
    className: 'bg-green-100 text-green-800 border-green-200'
  }
};

export function PersonalSpaceCard({ 
  fullName, 
  avatarUrl, 
  parishName,
  pastoralStatus 
}: PersonalSpaceCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const status = statusConfig[pastoralStatus];
  const StatusIcon = status.icon;

  return (
    <Card className="border-amber-200/60 bg-gradient-to-br from-amber-50/80 to-orange-50/40 shadow-sm">
      <CardContent className="pt-6 pb-6">
        <div className="flex items-center gap-5">
          {/* Avatar */}
          <Avatar className="w-20 h-20 border-2 border-amber-200/50 shadow-sm">
            <AvatarImage src={avatarUrl || undefined} alt={fullName} />
            <AvatarFallback className="text-xl bg-amber-100 text-amber-800 font-serif">
              {getInitials(fullName)}
            </AvatarFallback>
          </Avatar>

          {/* Info */}
          <div className="flex-1 min-w-0 space-y-2">
            <h2 className="font-serif text-xl font-semibold text-amber-900 truncate">
              {fullName}
            </h2>
            
            {parishName && (
              <p className="text-sm text-amber-700/70 truncate">
                {parishName}
              </p>
            )}

            <Badge 
              variant="outline" 
              className={`${status.className} font-normal text-xs gap-1.5`}
            >
              <StatusIcon className="h-3 w-3" />
              {status.label}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
