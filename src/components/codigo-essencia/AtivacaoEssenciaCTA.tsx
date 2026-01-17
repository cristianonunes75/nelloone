import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Heart, Shield, Target, Flame, ArrowRight, Lock } from "lucide-react";
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
    // Emotional intro
    emotionalIntro: "Algumas pessoas não param de evoluir porque são fracas. Param porque tentam mudar contra quem são.",
    
    // Invitation text
    inviteTitle: "Ativação do Código da Essência",
    inviteDescription: "A Ativação do Código da Essência é o momento em que o autoconhecimento deixa de ser apenas compreensão e se transforma em alinhamento real com a sua vida.",
    inviteSubtext: "Aqui, você não vai receber mais informações. Você vai receber permissões, reenquadramentos e um caminho claro para viver sua essência sem culpa, sem autoexigência e sem violência interior.",
    
    // Highlights
    highlights: [
      { icon: Target, text: "Identificação dos sabotadores inconscientes" },
      { icon: Heart, text: "Liberação de padrões de autoabandono" },
      { icon: Shield, text: "Roteiro alinhado à sua essência" },
      { icon: Flame, text: "Compromisso real com sua própria vida" },
    ],
    
    price: "Por apenas R$ 97",
    cta: "Ativar meu Código da Essência",
    ctaUnlocked: "Acessar minha Ativação",
    
    // Psychological reinforcement
    reinforcement: "Isso não é um teste. É um código que você vai viver.",
  },
  en: {
    emotionalIntro: "Some people don't stop evolving because they're weak. They stop because they try to change against who they are.",
    
    inviteTitle: "Essence Code Activation",
    inviteDescription: "The Essence Code Activation is the moment when self-knowledge stops being just understanding and becomes real alignment with your life.",
    inviteSubtext: "Here, you won't receive more information. You'll receive permissions, reframings, and a clear path to live your essence without guilt, without self-demand, and without inner violence.",
    
    highlights: [
      { icon: Target, text: "Identification of unconscious saboteurs" },
      { icon: Heart, text: "Release from self-abandonment patterns" },
      { icon: Shield, text: "Roadmap aligned with your essence" },
      { icon: Flame, text: "Real commitment to your own life" },
    ],
    
    price: "For only $27",
    cta: "Activate my Essence Code",
    ctaUnlocked: "Access my Activation",
    
    reinforcement: "This is not a test. It's a code you're going to live.",
  },
  "pt-pt": {
    emotionalIntro: "Algumas pessoas não param de evoluir porque são fracas. Param porque tentam mudar contra quem são.",
    
    inviteTitle: "Ativação do Código da Essência",
    inviteDescription: "A Ativação do Código da Essência é o momento em que o autoconhecimento deixa de ser apenas compreensão e se transforma em alinhamento real com a tua vida.",
    inviteSubtext: "Aqui, não vais receber mais informações. Vais receber permissões, reenquadramentos e um caminho claro para viver a tua essência sem culpa, sem autoexigência e sem violência interior.",
    
    highlights: [
      { icon: Target, text: "Identificação dos sabotadores inconscientes" },
      { icon: Heart, text: "Libertação de padrões de autoabandono" },
      { icon: Shield, text: "Roteiro alinhado à tua essência" },
      { icon: Flame, text: "Compromisso real com a tua própria vida" },
    ],
    
    price: "Por apenas €27",
    cta: "Ativar o meu Código da Essência",
    ctaUnlocked: "Aceder à minha Ativação",
    
    reinforcement: "Isto não é um teste. É um código que vais viver.",
  },
};

export const AtivacaoEssenciaCTA = ({ language, hasUnlocked = false }: AtivacaoEssenciaCTAProps) => {
  const [purchaseOpen, setPurchaseOpen] = useState(false);
  const { user } = useAuth();
  const t = translations[language] || translations.pt;

  const handleClick = () => {
    if (hasUnlocked) {
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
        className="relative mt-12 overflow-hidden"
      >
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-rose-500/10 rounded-3xl" />
        
        <div className="relative border border-amber-500/20 rounded-3xl p-8 md:p-12">
          
          {/* Emotional Intro */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-8"
          >
            <p className="text-lg md:text-xl text-foreground/80 italic font-light max-w-2xl mx-auto leading-relaxed">
              "{t.emotionalIntro}"
            </p>
          </motion.div>

          {/* Divider */}
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent mx-auto mb-8" />

          {/* Title */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mb-6"
          >
            <div className="inline-flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span className="text-amber-600 dark:text-amber-400 font-medium text-sm uppercase tracking-wider">
                {t.inviteTitle}
              </span>
              <Sparkles className="w-5 h-5 text-amber-500" />
            </div>
          </motion.div>

          {/* Description */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center mb-8 max-w-2xl mx-auto space-y-4"
          >
            <p className="text-foreground/90 text-base md:text-lg leading-relaxed">
              {t.inviteDescription}
            </p>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
              {t.inviteSubtext}
            </p>
          </motion.div>

          {/* Highlights */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 max-w-2xl mx-auto"
          >
            {t.highlights.map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                className="flex items-center gap-3 bg-background/60 backdrop-blur-sm rounded-xl p-4 border border-amber-500/10"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <p className="text-sm text-foreground/90 font-medium">{item.text}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Section */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="text-center space-y-4"
          >
            <Button
              onClick={handleClick}
              size="lg"
              className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:via-orange-600 hover:to-rose-600 text-white font-bold text-base md:text-lg px-8 py-6 rounded-2xl shadow-xl shadow-orange-500/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/30 group"
            >
              {hasUnlocked ? (
                <>
                  {t.ctaUnlocked}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              ) : (
                <>
                  {t.cta}
                  <Sparkles className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform" />
                </>
              )}
            </Button>

            {!hasUnlocked && (
              <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">
                {t.price}
              </p>
            )}

            {/* Psychological reinforcement */}
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.1 }}
              className="text-sm text-muted-foreground font-medium italic pt-2"
            >
              {t.reinforcement}
            </motion.p>
          </motion.div>
        </div>
      </motion.div>

      <PurchaseAtivacaoDialog open={purchaseOpen} onOpenChange={setPurchaseOpen} />
    </>
  );
};
