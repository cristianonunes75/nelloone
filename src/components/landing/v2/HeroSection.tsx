import { Button } from "@/components/ui/button";
import { ArrowRight, Clock } from "lucide-react";
import { motion } from "framer-motion";

interface HeroSectionProps {
  onCTA: () => void;
}

export const HeroSection = ({ onCTA }: HeroSectionProps) => {
  return (
    <section className="relative min-h-[70vh] md:min-h-[80vh] flex items-center pt-16">
      <div className="relative z-10 container px-6 sm:px-8 lg:px-10 py-12 md:py-20">
        <div className="max-w-3xl mx-auto text-center">
          {/* Microlabel */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium mb-6"
          >
            Uma experiência guiada de autoconhecimento
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-[1.75rem] leading-[1.2] sm:text-3xl md:text-4xl lg:text-[3.25rem] lg:leading-[1.15] font-semibold text-foreground tracking-tight mb-6 md:mb-8"
          >
            Talvez você não precise mudar de vida.
            <br />
            <span className="text-foreground/70">Talvez precise apenas se compreender.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8 md:mb-10"
          >
            O Identity oferece uma Leitura Inicial que revela padrões internos, clareza pessoal e novos caminhos de compreensão sobre si mesmo.
          </motion.p>

          {/* Badges */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-3 mb-8 md:mb-10"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 text-sm text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              2 minutos
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 text-sm text-muted-foreground">
              ✓ Gratuito
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 text-sm text-muted-foreground">
              ✓ Sem cadastro
            </span>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-sm mx-auto"
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
      </div>
    </section>
  );
};
