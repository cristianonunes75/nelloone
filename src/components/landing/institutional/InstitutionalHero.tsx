import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import heroDawn from "@/assets/hero-dawn.jpg";

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1
    }
  }
};

export const InstitutionalHero = () => {
  const handleCTA = () => {
    window.location.href = 'https://identity.nello.one/auth';
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroDawn})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/90 to-background" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-transparent to-background/90" />
      
      {/* Subtle accent glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-20 pointer-events-none">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-nello-gold/30 via-transparent to-transparent blur-3xl" />
      </div>

      {/* Content */}
      <motion.div 
        className="relative z-10 container px-5 sm:px-6 lg:px-8 py-24 md:py-32"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div variants={fadeInUp} className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-nello-gold/10 border border-nello-gold/20 text-xs font-medium text-nello-gold uppercase tracking-widest">
              <Sparkles className="w-3 h-3" />
              Uma Vida. Um Ecossistema.
            </span>
          </motion.div>
          
          {/* Headline */}
          <motion.h1 
            variants={fadeInUp}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-foreground leading-[1.1] tracking-tight mb-8"
          >
            <span className="text-nello-gold">Nello One</span>
          </motion.h1>
          
          {/* Subheadline */}
          <motion.p 
            variants={fadeInUp}
            className="text-xl md:text-2xl lg:text-3xl text-foreground/80 font-display leading-relaxed max-w-3xl mx-auto mb-4"
          >
            A inteligência que integra sua{' '}
            <span className="text-nello-gold">essência</span>, sua{' '}
            <span className="text-nello-gold">fé</span> e seu{' '}
            <span className="text-nello-gold">impacto no mundo</span>
          </motion.p>
          
          <motion.p 
            variants={fadeInUp}
            className="text-lg text-foreground/60 font-light leading-relaxed max-w-2xl mx-auto mb-12"
          >
            em uma única jornada unificada.
          </motion.p>
          
          {/* CTA */}
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              onClick={handleCTA}
              size="lg" 
              className="text-base px-10 min-h-[56px] bg-nello-gold hover:bg-nello-gold/90 text-nello-graphite font-medium rounded-full transition-all duration-300 hover:scale-[1.02] shadow-lg group"
            >
              Começar minha jornada
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            
            <Button 
              variant="outline"
              size="lg" 
              onClick={() => document.getElementById('ecossistema')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-base px-8 min-h-[56px] border-foreground/20 text-foreground hover:bg-foreground/5 rounded-full transition-all duration-300"
            >
              Explorar o Ecossistema
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-foreground/20 flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-foreground/30 rounded-full" />
        </div>
      </div>
    </section>
  );
};
