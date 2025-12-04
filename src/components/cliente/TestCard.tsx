import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, CheckCircle, Play, Gift, RotateCcw } from "lucide-react";
import * as Icons from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";

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
  onReset?: () => void;
  isFree?: boolean;
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
  onReset,
  isFree = false,
}: TestCardProps) => {
  const navigate = useNavigate();
  const { user, userRole } = useAuth();
  const { language } = useLanguage();
  const IconComponent = (Icons as any)[icon] || Icons.Circle;
  const isAdmin = userRole === "admin";
  const basePath = language === 'en' ? '/en' : language === 'pt-pt' ? '/pt-pt' : '';

  // Get user test ID for this test
  const { data: userTest } = useQuery({
    queryKey: ["user-test-id", id, user?.id],
    enabled: !!user && status !== "not_started",
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_tests")
        .select("id")
        .eq("test_id", id)
        .eq("user_id", user!.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

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
        action: () => userTest && navigate(`${basePath}/cliente/test-execution/${id}/${userTest.id}`),
      },
    },
    completed: {
      badge: { label: "Concluído", variant: "outline" as const },
      button: {
        label: "Ver resultado",
        icon: CheckCircle,
        action: () => userTest && navigate(`${basePath}/cliente/test-results/${userTest.id}`),
      },
    },
  };

  const config = statusConfig[status];
  const ButtonIcon = config.button.icon;

  return (
    <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-all duration-300 relative">
      {isFree && (
        <div className="absolute top-4 right-4">
          <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20">
            <Gift className="w-3 h-3 mr-1" />
            Grátis
          </Badge>
        </div>
      )}
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
          <IconComponent className="w-6 h-6 text-gold" />
        </div>
        {!isFree && <Badge variant={config.badge.variant}>{config.badge.label}</Badge>}
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

      <div className="flex gap-2">
        <Button
          onClick={config.button.action}
          className="flex-1"
          variant={status === "completed" ? "outline" : "default"}
        >
          <ButtonIcon className="w-4 h-4 mr-2" />
          {config.button.label}
        </Button>
        {isAdmin && status === "completed" && onReset && (
          <Button
            onClick={onReset}
            variant="ghost"
            size="icon"
            title="Reiniciar teste"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
