import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, CheckCircle, Play } from "lucide-react";
import * as Icons from "lucide-react";
import { useNavigate } from "react-router-dom";

type TestStatus = "not_started" | "in_progress" | "completed";

interface TestCardProps {
  id: string;
  name: string;
  description: string;
  questionsCount: number;
  estimatedMinutes: number;
  icon?: string;
  status: TestStatus;
  progress: number;
  onStart: () => void;
}

export const TestCard = ({
  id,
  name,
  description,
  questionsCount,
  estimatedMinutes,
  icon = "Circle",
  status,
  progress,
  onStart,
}: TestCardProps) => {
  const navigate = useNavigate();
  const IconComponent = (Icons as any)[icon] || Icons.Circle;

  const statusConfig = {
    not_started: {
      badge: { label: "Novo", variant: "secondary" as const },
      button: { label: "Começar teste", icon: Play, action: onStart },
    },
    in_progress: {
      badge: { label: "Em andamento", variant: "default" as const },
      button: {
        label: "Continuar",
        icon: Play,
        action: () => navigate(`/cliente/teste/${id}`),
      },
    },
    completed: {
      badge: { label: "Concluído", variant: "outline" as const },
      button: {
        label: "Ver resultado",
        icon: CheckCircle,
        action: () => navigate(`/cliente/teste/${id}/resultado`),
      },
    },
  };

  const config = statusConfig[status];
  const ButtonIcon = config.button.icon;

  return (
    <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
          <IconComponent className="w-6 h-6 text-gold" />
        </div>
        <Badge variant={config.badge.variant}>{config.badge.label}</Badge>
      </div>

      <h3 className="text-xl font-semibold mb-2">{name}</h3>
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
        {description}
      </p>

      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{estimatedMinutes} min</span>
        </div>
        <div>
          <span>{questionsCount} questões</span>
        </div>
      </div>

      {status === "in_progress" && progress > 0 && (
        <div className="mb-4">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">{progress}% completo</p>
        </div>
      )}

      <Button
        onClick={config.button.action}
        className="w-full"
        variant={status === "completed" ? "outline" : "default"}
      >
        <ButtonIcon className="w-4 h-4 mr-2" />
        {config.button.label}
      </Button>
    </div>
  );
};
