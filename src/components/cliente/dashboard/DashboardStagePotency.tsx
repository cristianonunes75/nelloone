import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Target,
  Sparkles,
  Calendar,
  Heart,
  Key,
  Eye,
  ArrowRight,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { JourneyStep } from "@/hooks/useJourneyProgress";
import * as Icons from "lucide-react";

interface TestResult {
  testType: string;
  testName: string;
  summary: string;
}

interface DashboardStagePotencyProps {
  displayName: string;
  testResults: TestResult[];
  journeySteps: JourneyStep[];
  hasAtivacao: boolean;
  onViewAtivacao: () => void;
  onViewCodigo: () => void;
  onViewResult: (step: JourneyStep) => void;
}

const testIcons: Record<string, string> = {
  arquetipos_proposito: "Target",
  inteligencias_multiplas: "Brain",
  linguagens_amor: "Heart",
  estilos_conexao: "Heart",
  mbti: "Compass",
  nello16: "Compass",
  disc: "Activity",
  eneagrama: "Star",
  temperamentos: "Flame",
};

const ativacaoModules = [
  {
    id: "plano-90-dias",
    name: "Plano de 90 Dias",
    description: "Ações práticas baseadas no seu Código",
    icon: Calendar,
    color: "from-amber-500 to-orange-500",
  },
  {
    id: "manual-relacionamentos",
    name: "Manual de Relacionamentos",
    description: "Como se conectar com cada tipo",
    icon: Heart,
    color: "from-pink-500 to-rose-500",
  },
  {
    id: "verdades-libertam",
    name: "Verdades que Libertam",
    description: "Insights profundos sobre sua essência",
    icon: Key,
    color: "from-violet-500 to-purple-500",
  },
];

export function DashboardStagePotency({
  displayName,
  testResults,
  journeySteps,
  hasAtivacao,
  onViewAtivacao,
  onViewCodigo,
  onViewResult,
}: DashboardStagePotencyProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
  };

  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Premium Hero - Ativação do Código */}
      <motion.div 
        variants={itemVariants}
        className="relative overflow-hidden bg-gradient-to-br from-amber-500/20 via-orange-400/15 to-amber-500/10 border border-amber-500/40 rounded-3xl p-8 md:p-10"
      >
        {/* Premium glow effects */}
        <div className="absolute top-0 left-1/2 w-96 h-96 bg-amber-500/20 rounded-full -translate-y-1/2 -translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-orange-400/20 rounded-full translate-y-1/2 translate-x-1/2 blur-2xl" />
        
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Target className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Premium</span>
              <h2 className="text-2xl font-bold">Ativação do Código</h2>
            </div>
          </div>
          
          <p className="text-muted-foreground mb-6 max-w-lg">
            Olá, {displayName}! Sua clareza interior foi transformada em ação. 
            Acesse seus conteúdos personalizados.
          </p>

          {/* Quick Access Modules */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
            {ativacaoModules.map((module) => (
              <button
                key={module.id}
                onClick={onViewAtivacao}
                className="flex items-center gap-3 p-4 bg-background/50 backdrop-blur-sm border border-border/50 rounded-xl hover:border-amber-500/50 hover:bg-amber-500/5 transition-all group text-left"
              >
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br shadow-md",
                  module.color
                )}>
                  <module.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{module.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{module.description}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-amber-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
              </button>
            ))}
          </div>

          <Button 
            size="lg" 
            onClick={onViewAtivacao}
            className="gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-500/30"
          >
            <Eye className="w-5 h-5" />
            Ver Relatório Completo
          </Button>
        </div>
      </motion.div>

      {/* Código da Essência Quick Access */}
      <motion.div 
        variants={itemVariants}
        className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Código da Essência</h3>
              <p className="text-sm text-muted-foreground">Seu mapa interior completo</p>
            </div>
          </div>
          <Button variant="outline" onClick={onViewCodigo} className="gap-2">
            <Eye className="w-4 h-4" />
            Ver Código
          </Button>
        </div>
      </motion.div>

      {/* Knowledge Base - Results Grid */}
      <motion.div variants={itemVariants}>
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
          Sua Base de Conhecimento
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {journeySteps.filter(s => s.status === "completed").map((step) => {
            const iconName = testIcons[step.testType] || "Circle";
            const IconComponent = (Icons as any)[iconName] || Icons.Circle;
            const result = testResults.find(r => r.testType === step.testType);
            
            return (
              <motion.button
                key={step.testId}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onViewResult(step)}
                className="bg-card border border-border rounded-xl p-4 text-left hover:border-primary/30 hover:bg-primary/5 transition-all group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <IconComponent className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted-foreground font-medium truncate">
                    {step.name}
                  </span>
                </div>
                <p className="font-semibold text-sm line-clamp-2">
                  {result?.summary || "Ver resultado"}
                </p>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
