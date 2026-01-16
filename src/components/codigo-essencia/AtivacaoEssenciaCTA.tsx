import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Zap, Heart, Star, ArrowRight, Lock, Gift } from "lucide-react";
import { Language } from "@/contexts/LanguageContext";
import { PurchaseAtivacaoDialog } from "@/components/cliente/PurchaseAtivacaoDialog";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";

interface AtivacaoEssenciaCTAProps {
  language: Language;
  hasUnlocked?: boolean;
}

const translations = {
  pt: {
    badge: "Próximo Passo",
    title: "Ative o Poder do Seu Código",
    subtitle: "Você descobriu quem você é. Agora é hora de despertar o que você pode se tornar.",
    description: "A Ativação da Essência vai além do autoconhecimento: ela conecta você com a sua missão, revela seus padrões de autossabotagem e desvenda o caminho prático para viver em plena potência.",
    benefits: [
      { icon: Zap, text: "Descubra sua missão de vida baseada no seu código único" },
      { icon: Heart, text: "Identifique padrões inconscientes que travam seu potencial" },
      { icon: Star, text: "Receba orientações práticas para manifestar sua essência" },
      { icon: Gift, text: "Roteiro personalizado de ações alinhadas com quem você é" },
    ],
    price: "Por apenas R$ 97",
    cta: "Ativar Minha Essência",
    ctaUnlocked: "Acessar Ativação",
    urgency: "Transforme conhecimento em poder real",
    guarantee: "Garantia de 7 dias ou seu dinheiro de volta",
  },
  en: {
    badge: "Next Step",
    title: "Activate Your Code's Power",
    subtitle: "You've discovered who you are. Now it's time to awaken what you can become.",
    description: "The Essence Activation goes beyond self-knowledge: it connects you with your mission, reveals your self-sabotage patterns, and unveils the practical path to living at full power.",
    benefits: [
      { icon: Zap, text: "Discover your life mission based on your unique code" },
      { icon: Heart, text: "Identify unconscious patterns blocking your potential" },
      { icon: Star, text: "Receive practical guidance to manifest your essence" },
      { icon: Gift, text: "Personalized action roadmap aligned with who you are" },
    ],
    price: "For only $27",
    cta: "Activate My Essence",
    ctaUnlocked: "Access Activation",
    urgency: "Transform knowledge into real power",
    guarantee: "7-day money-back guarantee",
  },
  "pt-pt": {
    badge: "Próximo Passo",
    title: "Active o Poder do Seu Código",
    subtitle: "Descobriste quem és. Agora é hora de despertar o que podes tornar-te.",
    description: "A Ativação da Essência vai além do autoconhecimento: conecta-te com a tua missão, revela os teus padrões de autossabotagem e desvenda o caminho prático para viver em plena potência.",
    benefits: [
      { icon: Zap, text: "Descobre a tua missão de vida baseada no teu código único" },
      { icon: Heart, text: "Identifica padrões inconscientes que travam o teu potencial" },
      { icon: Star, text: "Recebe orientações práticas para manifestar a tua essência" },
      { icon: Gift, text: "Roteiro personalizado de ações alinhadas com quem és" },
    ],
    price: "Por apenas €27",
    cta: "Ativar a Minha Essência",
    ctaUnlocked: "Aceder à Ativação",
    urgency: "Transforma conhecimento em poder real",
    guarantee: "Garantia de 7 dias ou dinheiro de volta",
  },
};

export const AtivacaoEssenciaCTA = ({ language, hasUnlocked = false }: AtivacaoEssenciaCTAProps) => {
  const [purchaseOpen, setPurchaseOpen] = useState(false);
  const { user } = useAuth();
  const t = translations[language] || translations.pt;

  const handleClick = () => {
    if (hasUnlocked) {
      // Navigate to activation page
      window.location.href = `/${language}/ativacao-codigo`;
    } else {
      setPurchaseOpen(true);
    }
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative mt-8 overflow-hidden"
      >
        {/* Background with animated gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-orange-500/15 to-rose-500/20 rounded-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-400/10 via-transparent to-transparent rounded-3xl" />
        
        {/* Decorative elements */}
        <div className="absolute top-4 right-4 opacity-20">
          <Sparkles className="w-24 h-24 text-amber-500" />
        </div>
        <div className="absolute bottom-4 left-4 opacity-10">
          <Star className="w-16 h-16 text-orange-500" />
        </div>

        <div className="relative border-2 border-amber-500/30 rounded-3xl p-6 md:p-8">
          {/* Badge */}
          <div className="flex justify-center mb-4">
            <motion.span 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg"
            >
              <Sparkles className="w-3 h-3" />
              {t.badge}
            </motion.span>
          </div>

          {/* Title */}
          <motion.h3 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-2xl md:text-3xl font-bold text-center bg-gradient-to-r from-amber-600 via-orange-500 to-rose-500 bg-clip-text text-transparent mb-3"
          >
            {t.title}
          </motion.h3>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center text-foreground/80 font-medium mb-4 max-w-lg mx-auto"
          >
            {t.subtitle}
          </motion.p>

          {/* Description */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-center text-sm text-muted-foreground mb-6 max-w-xl mx-auto"
          >
            {t.description}
          </motion.p>

          {/* Benefits */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6 max-w-2xl mx-auto"
          >
            {t.benefits.map((benefit, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                className="flex items-start gap-3 bg-background/60 backdrop-blur-sm rounded-xl p-3 border border-amber-500/20"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="w-4 h-4 text-white" />
                </div>
                <p className="text-sm text-foreground/90 leading-snug">{benefit.text}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Price and CTA */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="text-center space-y-4"
          >
            {!hasUnlocked && (
              <p className="text-lg font-bold text-amber-600 dark:text-amber-400">
                {t.price}
              </p>
            )}

            <Button
              onClick={handleClick}
              size="lg"
              className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:via-orange-600 hover:to-rose-600 text-white font-bold text-lg px-8 py-6 rounded-2xl shadow-xl shadow-orange-500/25 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/30 group"
            >
              {hasUnlocked ? (
                <>
                  {t.ctaUnlocked}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5 mr-2" />
                  {t.cta}
                  <Sparkles className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform" />
                </>
              )}
            </Button>

            <p className="text-xs text-muted-foreground font-medium">
              {t.urgency}
            </p>

            {!hasUnlocked && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                ✓ {t.guarantee}
              </p>
            )}
          </motion.div>
        </div>
      </motion.div>

      <PurchaseAtivacaoDialog open={purchaseOpen} onOpenChange={setPurchaseOpen} />
    </>
  );
};
