import { motion } from "framer-motion";

export const EmotionalIdentificationSection = () => {
  return (
    <section className="py-16 md:py-24 px-5 sm:px-6 lg:px-8 bg-muted/20">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground text-center mb-10">
          Você já sentiu isso?
        </h2>

        <div className="space-y-4 mb-10">
          {[
            "Sente que tem potencial mas não sabe como direcionar.",
            "Toma decisões e depois questiona se fez o certo.",
            "Percebe padrões se repetindo na vida.",
            "Sente que ninguém explica exatamente como você funciona.",
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 text-foreground/80 text-base md:text-lg leading-relaxed">
              <span className="text-nello-gold mt-1 shrink-0">—</span>
              <span>{item}</span>
            </div>
          ))}
        </div>

        <div className="text-center mb-12">
          <p className="font-display text-lg md:text-xl text-foreground/90 italic leading-relaxed">
            "Talvez não falte esforço.
            <br />
            <span className="text-nello-gold font-medium">Talvez falte clareza."</span>
          </p>
        </div>

        {/* Segunda imagem — reforço emocional */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative max-w-4xl mx-auto"
        >
          <img
            src="/images/landing-reflection-moment.webp"
            alt="Pessoa em momento silencioso de reflexão pessoal"
            className="w-full h-auto rounded-2xl object-cover max-h-[400px]"
            loading="lazy"
          />
          {/* Fade overlay */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-background/40 via-transparent to-background/20 pointer-events-none" />
        </motion.div>
      </div>
    </section>
  );
};
