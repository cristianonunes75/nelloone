import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Heart, Shield, Target, Flame, ArrowRight, Lock, Compass, Eye, MessageCircle } from "lucide-react";
import { Language } from "@/contexts/LanguageContext";
import { PurchaseAtivacaoDialog } from "@/components/cliente/PurchaseAtivacaoDialog";
import { motion } from "framer-motion";

interface AtivacaoTabContentProps {
  language: Language;
  hasUnlocked?: boolean;
}

const translations = {
  pt: {
    // Emotional intro
    emotionalIntro: "Algumas pessoas não param de evoluir porque são fracas. Param porque tentam mudar contra quem são.",
    
    // Main title
    mainTitle: "Ativação do Código da Essência",
    
    // Description
    description: "A Ativação é o momento em que o autoconhecimento deixa de ser apenas compreensão e se transforma em **alinhamento real** com a sua vida.",
    descriptionSub: "Aqui, você não recebe mais informações; você recebe **permissões**, **reenquadramentos** e um caminho claro para viver sua essência sem culpa e sem violência interior.",
    
    // Pillars title
    pillarsTitle: "Os 4 Pilares da Sua Transformação:",
    
    // Pillars
    pillars: [
      { icon: Shield, text: "Identificação dos sabotadores inconscientes", color: "from-red-500/20 to-orange-500/20" },
      { icon: Heart, text: "Liberação de padrões de autoabandono", color: "from-pink-500/20 to-rose-500/20" },
      { icon: Compass, text: "Roteiro alinhado à sua essência", color: "from-teal-500/20 to-cyan-500/20" },
      { icon: Flame, text: "Compromisso real com sua própria vida", color: "from-amber-500/20 to-yellow-500/20" },
    ],
    
    // What you'll receive
    whatYouReceive: "O que você vai receber:",
    modules: [
      { icon: Target, title: "Ativação Prática", desc: "Ajustes de atitude, linguagem e limites" },
      { icon: Eye, title: "Convites de Observação", desc: "Reflexões para 6 áreas da vida" },
      { icon: MessageCircle, title: "Declaração de Ativação", desc: "Sua frase de poder personalizada" },
    ],
    
    price: "Por apenas R$ 197",
    cta: "QUERO ATIVAR MEU CÓDIGO AGORA",
    ctaUnlocked: "Acessar minha Ativação",
    
    // Reinforcement
    reinforcement: "Isso não é um teste. É um código que você vai viver.",
    
    // Locked message
    lockedMessage: "O conteúdo completo da Ativação está disponível após a compra."
  },
  en: {
    emotionalIntro: "Some people don't stop evolving because they're weak. They stop because they try to change against who they are.",
    
    mainTitle: "Essence Code Activation",
    
    description: "Activation is the moment when self-knowledge stops being just understanding and becomes **real alignment** with your life.",
    descriptionSub: "Here, you won't receive more information; you'll receive **permissions**, **reframings**, and a clear path to live your essence without guilt and without inner violence.",
    
    pillarsTitle: "The 4 Pillars of Your Transformation:",
    
    pillars: [
      { icon: Shield, text: "Identification of unconscious saboteurs", color: "from-red-500/20 to-orange-500/20" },
      { icon: Heart, text: "Release from self-abandonment patterns", color: "from-pink-500/20 to-rose-500/20" },
      { icon: Compass, text: "Roadmap aligned with your essence", color: "from-teal-500/20 to-cyan-500/20" },
      { icon: Flame, text: "Real commitment to your own life", color: "from-amber-500/20 to-yellow-500/20" },
    ],
    
    whatYouReceive: "What you'll receive:",
    modules: [
      { icon: Target, title: "Practical Activation", desc: "Adjustments in attitude, language, and boundaries" },
      { icon: Eye, title: "Observation Invitations", desc: "Reflections for 6 life areas" },
      { icon: MessageCircle, title: "Activation Declaration", desc: "Your personalized power statement" },
    ],
    
    price: "For only $27",
    cta: "I WANT TO ACTIVATE MY CODE NOW",
    ctaUnlocked: "Access my Activation",
    
    reinforcement: "This is not a test. It's a code you're going to live.",
    
    lockedMessage: "The full Activation content is available after purchase."
  },
  "pt-pt": {
    emotionalIntro: "Algumas pessoas não param de evoluir porque são fracas. Param porque tentam mudar contra quem são.",
    
    mainTitle: "Ativação do Código da Essência",
    
    description: "A Ativação é o momento em que o autoconhecimento deixa de ser apenas compreensão e se transforma em **alinhamento real** com a tua vida.",
    descriptionSub: "Aqui, não vais receber mais informações; vais receber **permissões**, **reenquadramentos** e um caminho claro para viver a tua essência sem culpa e sem violência interior.",
    
    pillarsTitle: "Os 4 Pilares da Tua Transformação:",
    
    pillars: [
      { icon: Shield, text: "Identificação dos sabotadores inconscientes", color: "from-red-500/20 to-orange-500/20" },
      { icon: Heart, text: "Libertação de padrões de autoabandono", color: "from-pink-500/20 to-rose-500/20" },
      { icon: Compass, text: "Roteiro alinhado à tua essência", color: "from-teal-500/20 to-cyan-500/20" },
      { icon: Flame, text: "Compromisso real com a tua própria vida", color: "from-amber-500/20 to-yellow-500/20" },
    ],
    
    whatYouReceive: "O que vais receber:",
    modules: [
      { icon: Target, title: "Ativação Prática", desc: "Ajustes de atitude, linguagem e limites" },
      { icon: Eye, title: "Convites de Observação", desc: "Reflexões para 6 áreas da vida" },
      { icon: MessageCircle, title: "Declaração de Ativação", desc: "A tua frase de poder personalizada" },
    ],
    
    price: "Por apenas €27",
    cta: "QUERO ATIVAR O MEU CÓDIGO AGORA",
    ctaUnlocked: "Aceder à minha Ativação",
    
    reinforcement: "Isto não é um teste. É um código que vais viver.",
    
    lockedMessage: "O conteúdo completo da Ativação está disponível após a compra."
  },
};

// Helper to render text with bold markdown
const renderBoldText = (text: string) => {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, index) => 
    index % 2 === 1 ? <strong key={index} className="font-bold text-foreground">{part}</strong> : part
  );
};

export const AtivacaoTabContent = ({ language, hasUnlocked = false }: AtivacaoTabContentProps) => {
  const [purchaseOpen, setPurchaseOpen] = useState(false);
  const t = translations[language as keyof typeof translations] || translations.pt;

  const handleClick = () => {
    if (hasUnlocked) {
      const basePath = language === 'pt' ? '' : language === 'en' ? '/en' : `/${language}`;
      window.location.href = `${basePath}/cliente/ativacao`;
    } else {
      setPurchaseOpen(true);
    }
  };

  return (
    <>
      <div className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-background to-orange-500/5 rounded-3xl" />
        
        <div className="relative space-y-8">
          {/* Emotional Intro - Hero Quote */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-8 text-center"
          >
            <p className="text-xl md:text-2xl text-white/90 italic font-light leading-relaxed">
              "{t.emotionalIntro}"
            </p>
          </motion.div>

          {/* Main Content Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-rose-500/10 border-2 border-amber-500/30 rounded-3xl p-6 md:p-10"
          >
            {/* Title */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-amber-500" />
                <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent dark:from-amber-400 dark:to-orange-400">
                  {t.mainTitle}
                </h2>
                <Sparkles className="w-6 h-6 text-amber-500" />
              </div>
            </div>

            {/* Description */}
            <div className="max-w-2xl mx-auto text-center space-y-4 mb-10">
              <p className="text-lg text-foreground/90 leading-relaxed">
                {renderBoldText(t.description)}
              </p>
              <p className="text-base text-muted-foreground leading-relaxed">
                {renderBoldText(t.descriptionSub)}
              </p>
            </div>

            {/* 4 Pillars */}
            <div className="mb-10">
              <h3 className="text-center text-lg font-semibold mb-6 text-foreground/90">
                {t.pillarsTitle}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {t.pillars.map((pillar, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                    className={`flex items-center gap-4 bg-gradient-to-r ${pillar.color} backdrop-blur-sm rounded-xl p-5 border border-white/10`}
                  >
                    <div className="w-12 h-12 rounded-full bg-background/80 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <pillar.icon className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                    </div>
                    <p className="text-base font-medium text-foreground">{pillar.text}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* What You'll Receive (for non-unlocked) */}
            {!hasUnlocked && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="bg-background/60 rounded-2xl p-6 mb-8"
              >
                <h3 className="text-center text-lg font-semibold mb-6 text-foreground/90">
                  {t.whatYouReceive}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {t.modules.map((module, index) => (
                    <div key={index} className="text-center p-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center mx-auto mb-3">
                        <module.icon className="w-7 h-7 text-amber-600 dark:text-amber-400" />
                      </div>
                      <h4 className="font-semibold text-sm mb-1">{module.title}</h4>
                      <p className="text-xs text-muted-foreground">{module.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Locked Content Indicator (for non-unlocked) */}
            {!hasUnlocked && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
                className="flex items-center justify-center gap-2 text-muted-foreground text-sm mb-8 p-4 bg-muted/30 rounded-xl"
              >
                <Lock className="w-4 h-4" />
                <span>{t.lockedMessage}</span>
              </motion.div>
            )}

            {/* CTA Section */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="text-center space-y-4"
            >
              <Button
                onClick={handleClick}
                size="lg"
                className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:via-orange-600 hover:to-rose-600 text-white font-bold text-base md:text-lg px-10 py-7 rounded-2xl shadow-xl shadow-orange-500/25 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/35 group"
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
                <p className="text-base font-semibold text-amber-600 dark:text-amber-400">
                  {t.price}
                </p>
              )}

              {/* Psychological reinforcement */}
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.2 }}
                className="text-base text-foreground/80 font-medium italic pt-4"
              >
                "{t.reinforcement}"
              </motion.p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <PurchaseAtivacaoDialog open={purchaseOpen} onOpenChange={setPurchaseOpen} />
    </>
  );
};
