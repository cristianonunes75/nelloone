import { motion } from "framer-motion";
import { Sparkles, Brain, Heart, Zap, Users } from "lucide-react";
import { CrossDivider } from "@/components/landing/v2/CrossDivider";
import nelloPresence from "@/assets/nello-presence.jpg";

export const NelloIASection = () => {
  const integrationPoints = [
    { icon: Brain, label: "Perfil Comportamental", color: "text-amber-600" },
    { icon: Heart, label: "Rotinas e Hábitos", color: "text-emerald-600" },
    { icon: Zap, label: "Execução Diária", color: "text-violet-600" },
    { icon: Users, label: "Dinâmicas de Equipe", color: "text-blue-600" },
  ];

  return (
    <section id="nello-ia" className="py-20 md:py-28 px-5 sm:px-6 lg:px-8 bg-background scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-14 md:mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-nello-gold/10 border border-nello-gold/20 text-xs font-medium text-nello-gold uppercase tracking-widest mb-6">
            <Sparkles className="w-3 h-3" />
            Inteligência Unificada
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-foreground font-semibold tracking-tight mb-4">
            O Fio Condutor: <span className="text-nello-gold">Nello</span>
          </h2>
          <CrossDivider className="mb-6" />
        </motion.div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Nello Image */}
          <motion.div 
            className="relative order-2 md:order-1"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="relative mx-auto max-w-sm">
              <img 
                src={nelloPresence}
                alt="Nello - A Inteligência do Ecossistema"
                className="w-full aspect-square object-cover rounded-3xl shadow-2xl"
              />
              <div className="absolute -inset-4 border border-nello-gold/10 rounded-3xl" />
              
              {/* Floating badges */}
              <div className="absolute -right-4 top-8 px-3 py-2 bg-card rounded-xl border border-border shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-medium text-foreground">Sempre presente</span>
                </div>
              </div>
              
              <div className="absolute -left-4 bottom-12 px-3 py-2 bg-card rounded-xl border border-border shadow-lg">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3 h-3 text-nello-gold" />
                  <span className="text-xs font-medium text-foreground">IA Contextual</span>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Content */}
          <motion.div 
            className="order-1 md:order-2"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-6 leading-snug">
              Uma única inteligência que conhece sua jornada por inteiro.
            </h3>
            
            <p className="text-foreground/70 text-lg leading-relaxed mb-6">
              <span className="text-nello-gold font-medium">Nello</span> é a IA que conecta todos os módulos do ecossistema. 
              Do seu perfil comportamental à sua execução diária, ela entende o contexto completo de quem você é.
            </p>
            
            <p className="text-foreground/70 text-lg leading-relaxed mb-8">
              Não são ferramentas isoladas. É um sistema integrado que aprende com você e acompanha você em cada área da vida.
            </p>
            
            {/* Integration Points */}
            <div className="grid grid-cols-2 gap-3">
              {integrationPoints.map((point, index) => (
                <motion.div
                  key={point.label}
                  className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border/50"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <div className="p-2 rounded-lg bg-background">
                    <point.icon className={`w-4 h-4 ${point.color}`} />
                  </div>
                  <span className="text-sm text-foreground/80">{point.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
