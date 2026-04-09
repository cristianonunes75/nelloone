import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Eye,
  Target,
  ArrowRight,
  Star,
  Film,
  Heart,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { JourneyStep } from "@/hooks/useJourneyProgress";
import * as Icons from "lucide-react";
import { DashboardTestimonialSection } from "./DashboardTestimonialSection";
import { useNavigate } from "react-router-dom";
import { useRevelacaoEssenciaFlag } from "@/hooks/useFeatureFlag";
import { useAuth } from "@/hooks/useAuth";
import { useCoupleCodeAccess } from "@/hooks/useCoupleCodeAccess";

interface TestResult {
  testType: string;
  testName: string;
  summary: string;
  icon?: string;
}

interface DashboardStageRevelationProps {
  displayName: string;
  hasCodigoUnlocked: boolean;
  hasSavedCodigo: boolean;
  testResults: TestResult[];
  journeySteps: JourneyStep[];
  isAtivacaoEnabled: boolean;
  hasAtivacaoPurchased: boolean;
  needsAtivacaoPurchase: boolean;
  onGenerateCode: () => void;
  onViewResult: (step: JourneyStep) => void;
  onPurchaseAtivacao: () => void;
  onStartAtivacao: () => void;
}

const testIcons: Record<string, string> = {
  arquetipos_proposito: "Target",
  inteligencias_multiplas: "Brain",
  estilos_conexao_afetiva: "Heart",
  estilos_conexao: "Heart",
  linguagens_amor: "Heart", // LEGACY
  mbti: "Compass",
  nello16: "Compass",
  disc: "Activity",
  eneagrama: "Star",
  temperamentos: "Flame",
};

export function DashboardStageRevelation({
  displayName,
  hasCodigoUnlocked,
  hasSavedCodigo,
  testResults,
  journeySteps,
  isAtivacaoEnabled,
  hasAtivacaoPurchased,
  needsAtivacaoPurchase,
  onGenerateCode,
  onViewResult,
  onPurchaseAtivacao,
  onStartAtivacao,
}: DashboardStageRevelationProps) {
  const navigate = useNavigate();
  const { userRole } = useAuth();
  const { isEnabled: revelacaoEnabled } = useRevelacaoEssenciaFlag();
  const { hasPurchased: hasCoupleCodePurchased } = useCoupleCodeAccess();
  const isAdmin = userRole === "admin";
  const showRevelacao = revelacaoEnabled || isAdmin;

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
      {/* Hero Card - Majestic */}
      <motion.div 
        variants={itemVariants}
        className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 border border-primary/30 rounded-3xl p-8 md:p-12 text-center"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full -translate-y-1/2 -translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-accent/20 rounded-full translate-y-1/2 translate-x-1/2 blur-3xl" />
        
        <div className="relative">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/30"
          >
            <Sparkles className="w-10 h-10 text-primary-foreground" />
          </motion.div>

          <motion.h1 
            className="text-3xl md:text-4xl font-bold tracking-tight mb-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {hasSavedCodigo ? (
              <>Seu Código da Essência</>
            ) : (
              <>Seu Código está pronto</>
            )}
          </motion.h1>
          
          <motion.p 
            className="text-muted-foreground text-lg mb-8 max-w-md mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {hasSavedCodigo 
              ? `Parabéns, ${displayName}! Sua essência foi revelada.`
              : `${displayName}, você completou sua jornada. Descubra sua essência.`
            }
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button 
              size="lg" 
              onClick={onGenerateCode}
              className="gap-3 px-8 py-6 text-lg rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
            >
              {hasSavedCodigo ? (
                <>
                  <Eye className="w-5 h-5" />
                  Ver Minha Essência
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Gerar Meu Código
                </>
              )}
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Revelação da Essência - Cinematic Experience */}
      {showRevelacao && hasSavedCodigo && (
        <motion.div 
          variants={itemVariants}
          className="relative overflow-hidden bg-gradient-to-r from-zinc-900 to-zinc-800 border border-zinc-700/50 rounded-2xl p-6 md:p-8 text-white"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--primary)/0.15),transparent_60%)]" />
          <div className="relative flex flex-col md:flex-row items-start md:items-center gap-5">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
              <Film className="w-6 h-6 text-white/80" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-1">A Revelação da Essência</h3>
              <p className="text-sm text-white/60">
                Uma experiência contemplativa sobre quem você é. Sem pressa, sem explicações — apenas reconhecimento.
              </p>
            </div>
            <Button
              onClick={() => navigate("/cliente/revelacao")}
              variant="ghost"
              className="text-white/80 hover:text-white border border-white/20 hover:border-white/40 gap-2 shrink-0"
            >
              Vivenciar
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      )}

      <motion.div variants={itemVariants}>
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
          Seus Resultados
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
                <ArrowRight className="w-4 h-4 text-muted-foreground mt-2 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Ativação Banner - Magnetic Upsell */}
      {isAtivacaoEnabled && hasSavedCodigo && !hasAtivacaoPurchased && (
        <motion.div 
          variants={itemVariants}
          className="relative overflow-hidden bg-gradient-to-r from-amber-500/20 via-orange-400/15 to-amber-500/20 border border-amber-500/30 rounded-2xl p-6 md:p-8"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl" />
          
          <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-500/30">
              <Target className="w-7 h-7 text-white" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
                  Próximo nível
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2">Ativação do Código</h3>
              <p className="text-muted-foreground text-sm mb-4 md:mb-0">
                Transforme autoconhecimento em ação. Receba seu Plano de 90 Dias, 
                Manual de Relacionamentos e Verdades que Libertam.
              </p>
            </div>
            
            <div className="flex flex-col items-start md:items-end gap-2">
              <span className="text-2xl font-bold text-amber-600">R$ 197</span>
              <Button 
                onClick={onPurchaseAtivacao}
                className="gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-500/30"
              >
                Desbloquear
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Ativação Already Purchased - Start */}
      {isAtivacaoEnabled && hasAtivacaoPurchased && !needsAtivacaoPurchase && (
        <motion.div 
          variants={itemVariants}
          className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl p-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Ativação Liberada ✓</h3>
              <p className="text-sm text-muted-foreground">Seu plano personalizado está pronto</p>
            </div>
            <Button onClick={onStartAtivacao} className="gap-2">
              Iniciar Ativação
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      )}

      {/* Código do Casal - Upsell Banner */}
      {hasSavedCodigo && !hasCoupleCodePurchased && (
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden bg-gradient-to-r from-pink-500/15 via-rose-400/10 to-pink-500/15 border border-pink-500/30 rounded-2xl p-6 md:p-8"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/20 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl" />

          <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-pink-500/30">
              <Heart className="w-7 h-7 text-white" />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-pink-500" />
                <span className="text-xs font-semibold text-pink-600 uppercase tracking-wider">
                  Cruzamento de Códigos
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2">Código do Casal</h3>
              <p className="text-muted-foreground text-sm">
                Descubra como sua essência se conecta com a de outra pessoa. Invite seu parceiro(a) e gerem juntos o mapa do relacionamento.
              </p>
            </div>

            <div className="shrink-0">
              <Button
                onClick={() => navigate("/cliente/cruzamentos")}
                className="gap-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg shadow-pink-500/30"
              >
                Convidar parceiro(a)
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Testimonial Section */}
      <DashboardTestimonialSection />
    </motion.div>
  );
}
