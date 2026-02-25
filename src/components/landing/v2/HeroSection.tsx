import { Button } from "@/components/ui/button";
import { ArrowRight, Clock } from "lucide-react";
import { motion } from "framer-motion";

interface HeroSectionProps {
  onCTA: () => void;
}

export const HeroSection = ({ onCTA }: HeroSectionProps) => {
  return (
    <section className="relative min-h-[85vh] md:min-h-[90vh] flex items-center overflow-hidden pt-16">
      {/* Subtle warm glow */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] md:w-[700px] md:h-[700px] bg-nello-gold/5 rounded-full blur-3xl" />

      <div className="relative z-10 container px-6 sm:px-8 lg:px-10 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16 items-center max-w-6xl mx-auto">
          {/* Text — left 60% */}
          <div className="lg:col-span-3 text-center lg:text-left">
            {/* Microlabel */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-xs uppercase tracking-[0.2em] text-nello-gold font-medium mb-4"
            >
              Uma experiência guiada de autoconhecimento
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display text-[1.75rem] leading-[1.2] sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground tracking-tight mb-6 md:mb-8"
            >
              Talvez você não precise mudar de vida.
              <br />
              <span className="text-nello-gold">Talvez precise apenas se compreender.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-base sm:text-lg md:text-xl text-foreground/70 leading-relaxed max-w-2xl mx-auto lg:mx-0 mb-8 md:mb-10"
            >
              A Leitura Inicial apresenta tendências de comportamento e percepção pessoal de forma reflexiva e educativa.
            </motion.p>

            {/* Badges */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-8 md:mb-10"
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 text-sm text-foreground/70">
                <Clock className="w-3.5 h-3.5" />
                2 minutos
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 text-sm text-foreground/70">
                ✓ Gratuito
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 text-sm text-foreground/70">
                ✓ Sem cadastro obrigatório
              </span>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="max-w-sm mx-auto lg:mx-0"
            >
              <Button
                onClick={onCTA}
                size="lg"
                className="w-full min-h-[56px] text-base px-8 rounded-full bg-nello-gold hover:bg-nello-gold/90 text-nello-graphite font-semibold shadow-lg transition-all duration-300 hover:scale-[1.02] group"
              >
                Começar minha Leitura Inicial
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </div>

          {/* Image — right 40% */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="lg:col-span-2 flex justify-center"
          >
            <div className="relative w-full max-w-md lg:max-w-none">
              <img
                src="/images/landing-hero-introspection.webp"
                alt="Pessoa em momento de reflexão e introspecção"
                className="w-full h-auto rounded-2xl shadow-2xl object-cover"
                loading="eager"
              />
              {/* Soft overlay fade at edges */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};
