import { motion } from "framer-motion";
import { Compass, Heart, Eye, Layers, Fingerprint, Sparkles } from "lucide-react";

interface SymbolicProgressProps {
  currentTestIndex: number;
  totalTests: number;
  testType?: string;
  lang?: 'pt' | 'pt-pt' | 'en';
}

// Journey stage messages (replace percentages with symbolic progression)
const JOURNEY_STAGES = {
  pt: [
    { message: "Explorando como você reage ao mundo", icon: Compass },
    { message: "Descobrindo o que te move por dentro", icon: Heart },
    { message: "Observando padrões mais profundos", icon: Eye },
    { message: "Conectando suas diferentes camadas", icon: Layers },
    { message: "Integrando sua identidade única", icon: Fingerprint },
    { message: "Preparando seu retrato pessoal", icon: Sparkles },
    { message: "Fechando seu mapa completo", icon: Sparkles },
  ],
  'pt-pt': [
    { message: "A explorar como reage ao mundo", icon: Compass },
    { message: "A descobrir o que o move por dentro", icon: Heart },
    { message: "A observar padrões mais profundos", icon: Eye },
    { message: "A conectar as suas diferentes camadas", icon: Layers },
    { message: "A integrar a sua identidade única", icon: Fingerprint },
    { message: "A preparar o seu retrato pessoal", icon: Sparkles },
    { message: "A fechar o seu mapa completo", icon: Sparkles },
  ],
  en: [
    { message: "Exploring how you react to the world", icon: Compass },
    { message: "Discovering what moves you inside", icon: Heart },
    { message: "Observing deeper patterns", icon: Eye },
    { message: "Connecting your different layers", icon: Layers },
    { message: "Integrating your unique identity", icon: Fingerprint },
    { message: "Preparing your personal portrait", icon: Sparkles },
    { message: "Completing your full map", icon: Sparkles },
  ],
};

export function SymbolicProgress({ 
  currentTestIndex, 
  totalTests,
  testType,
  lang = 'pt' 
}: SymbolicProgressProps) {
  const stages = JOURNEY_STAGES[lang];
  const stageIndex = Math.min(currentTestIndex, stages.length - 1);
  const currentStage = stages[stageIndex];
  const Icon = currentStage.icon;

  // Calculate visual progress (dots instead of percentage)
  const progressDots = Array.from({ length: totalTests }, (_, i) => i < currentTestIndex);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-3 p-4"
    >
      {/* Symbolic message */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="w-4 h-4 text-primary" />
        <span className="font-light">{currentStage.message}</span>
      </div>

      {/* Visual dots progress */}
      <div className="flex items-center gap-1.5">
        {progressDots.map((completed, index) => (
          <motion.div
            key={index}
            initial={index === currentTestIndex - 1 ? { scale: 0 } : false}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.05, type: "spring" }}
            className={`
              w-2.5 h-2.5 rounded-full transition-colors duration-300
              ${index < currentTestIndex 
                ? "bg-primary" 
                : index === currentTestIndex 
                  ? "bg-primary/50 animate-pulse" 
                  : "bg-muted-foreground/20"
              }
            `}
          />
        ))}
      </div>
    </motion.div>
  );
}

// Compact version for use in headers
export function SymbolicProgressCompact({ 
  currentTestIndex, 
  totalTests,
  lang = 'pt' 
}: Omit<SymbolicProgressProps, 'testType'>) {
  const stages = JOURNEY_STAGES[lang];
  const stageIndex = Math.min(currentTestIndex, stages.length - 1);
  const currentStage = stages[stageIndex];
  const Icon = currentStage.icon;

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-full">
      <Icon className="w-3.5 h-3.5 text-primary" />
      <span className="text-xs text-muted-foreground truncate max-w-[180px]">
        {currentStage.message}
      </span>
    </div>
  );
}
