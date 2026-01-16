import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Users, Globe, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CrossDivider } from "@/components/landing/v2/CrossDivider";

export const InvestorSection = () => {
  const metrics = [
    { value: "5", label: "Módulos Integrados", icon: Sparkles },
    { value: "1", label: "Inteligência Unificada", icon: TrendingUp },
    { value: "∞", label: "Potencial de Escala", icon: Globe },
    { value: "B2B + B2C", label: "Modelo de Negócio", icon: Users },
  ];

  return (
    <section id="investidor" className="py-20 md:py-28 px-5 sm:px-6 lg:px-8 bg-nello-graphite scroll-mt-20">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-14 md:mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-xs font-medium text-white/40 uppercase tracking-widest mb-4 block">
            Para Investidores
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-white font-semibold tracking-tight mb-4">
            Um Império Tecnológico Integrado
          </h2>
          <div className="flex items-center justify-center gap-4 py-2 mb-6">
            <div className="flex-1 h-px bg-nello-gold/30 max-w-24" />
            <Sparkles className="w-3 h-3 text-nello-gold/50" />
            <div className="flex-1 h-px bg-nello-gold/30 max-w-24" />
          </div>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Nello One não é apenas um teste de personalidade. É uma plataforma completa que acompanha o ser humano em toda sua jornada.
          </p>
        </motion.div>

        {/* Metrics Grid */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          {metrics.map((metric, index) => (
            <div 
              key={metric.label}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center"
            >
              <metric.icon className="w-5 h-5 text-nello-gold mx-auto mb-3" />
              <p className="font-display text-3xl md:text-4xl font-semibold text-white mb-1">
                {metric.value}
              </p>
              <p className="text-xs text-white/50">
                {metric.label}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Value Proposition */}
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-white/70 text-lg leading-relaxed max-w-3xl mx-auto mb-8">
            Com módulos para <span className="text-nello-gold">indivíduos</span>, <span className="text-nello-gold">empresas</span> e <span className="text-nello-gold">profissionais da área</span>, 
            Nello One cria um ecossistema de dados comportamentais únicos, com potencial de aplicação em RH, coaching, saúde mental e desenvolvimento pessoal.
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <Button 
            variant="outline"
            size="lg"
            className="text-base px-8 min-h-[52px] border-nello-gold/30 text-nello-gold hover:bg-nello-gold/10 rounded-full transition-all duration-300 group"
            onClick={() => window.location.href = 'mailto:invest@nello.one'}
          >
            Falar com o Fundador
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
          <p className="text-white/40 text-sm mt-4">
            invest@nello.one
          </p>
        </motion.div>
      </div>
    </section>
  );
};
