import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Sparkles } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { NavSection } from "./NavSection";
import { LanguageToggle } from "@/components/LanguageToggle";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Simplified landing footer — no institutional links (7 Mapas, Metodologia, Profissionais).
 * Those appear only after the Leitura Inicial result and in the Dashboard.
 */
const LandingFooterSimple = () => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  return (
    <footer className="py-12 md:py-16 border-t border-border/40 bg-background">
      <div className="container px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-10 md:gap-12 mb-10">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="inline-flex items-center gap-1.5 mb-3">
                <span className="font-serif text-lg font-bold text-foreground">NELLO</span>
                <span className="font-serif text-lg font-light text-nello-gold">IDENTITY</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {isEn
                  ? 'Discover how you work through a guided journey.'
                  : 'Descubra como você funciona através de uma jornada guiada.'}
              </p>
              <LanguageToggle variant="minimal" />
            </div>

            {/* Support */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-foreground mb-4">
                {isEn ? 'Support' : 'Suporte'}
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link to={isEn ? '/en/help' : '/ajuda'} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {isEn ? 'Help Center' : 'Central de Ajuda'}
                  </Link>
                </li>
                <li>
                  <a href="mailto:suporte@nello.one" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {isEn ? 'Contact' : 'Contato'}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-foreground mb-4">
                Legal
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/termos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {isEn ? 'Terms of Use' : 'Termos de Uso'}
                  </Link>
                </li>
                <li>
                  <Link to="/privacidade" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {isEn ? 'Privacy & LGPD' : 'Privacidade e LGPD'}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground/60">
              © {new Date().getFullYear()} Nello One. {isEn ? 'All rights reserved.' : 'Todos os direitos reservados.'}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

const TESTIMONIALS = [
  "Eu achei que seria só mais um teste. Mas parecia que alguém estava descrevendo coisas que eu nunca consegui explicar.",
  "Não me senti avaliado. Me senti compreendido.",
  "Foi rápido, mas mexeu comigo o resto do dia.",
  "Percebi padrões que eu repetia há anos sem perceber.",
  "Não foi um resultado. Foi um espelho.",
];

export const NelloOneLanding = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const getLeituraPath = () => {
    if (language === 'en') return '/en/initial-reading';
    if (language === 'pt-pt') return '/pt-pt/leitura-inicial';
    return '/leitura-inicial';
  };

  const handleCTA = () => navigate(getLeituraPath());

  // Rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col bg-background min-h-screen">
      <NavSection />

      {/* ========== 1️⃣ HERO ========== */}
      <section className="relative min-h-[85vh] md:min-h-[90vh] flex items-center justify-center overflow-hidden pt-16">
        {/* Subtle warm glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] md:w-[700px] md:h-[700px] bg-nello-gold/5 rounded-full blur-3xl" />
        
        <div className="relative z-10 container px-6 sm:px-8 lg:px-10 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-display text-[1.75rem] leading-[1.2] sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground tracking-tight mb-6 md:mb-8">
              Talvez você não precise mudar de vida.
              <br />
              <span className="text-nello-gold">Talvez precise apenas se compreender.</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-foreground/80 leading-relaxed max-w-2xl mx-auto mb-8 md:mb-10">
              A Leitura Inicial do Identity revela padrões invisíveis da forma como você pensa, decide e se posiciona no mundo.
            </p>

            {/* Badges */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-8 md:mb-10">
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
            </div>

            {/* Single CTA */}
            <div className="max-w-sm mx-auto">
              <Button
                onClick={handleCTA}
                size="lg"
                className="w-full min-h-[56px] text-base px-8 rounded-full bg-nello-gold hover:bg-nello-gold/90 text-nello-graphite font-semibold shadow-lg transition-all duration-300 hover:scale-[1.02] group"
              >
                Começar minha Leitura
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* ========== 2️⃣ IDENTIFICAÇÃO EMOCIONAL ========== */}
      <section className="py-16 md:py-24 px-5 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
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

          <div className="text-center">
            <p className="font-display text-lg md:text-xl text-foreground/90 italic leading-relaxed">
              "Talvez não falte esforço.
              <br />
              <span className="text-nello-gold font-medium">Talvez falte clareza."</span>
            </p>
          </div>
        </div>
      </section>

      {/* ========== 3️⃣ DEPOIMENTOS HUMANIZADOS ========== */}
      <section className="py-16 md:py-24 px-5 sm:px-6 lg:px-8 bg-muted/20">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-foreground text-center mb-12">
            Pessoas que começaram pela Leitura Inicial
          </h2>

          <div className="relative min-h-[120px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={activeTestimonial}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <p className="font-display text-lg md:text-xl lg:text-2xl text-foreground/80 italic leading-relaxed">
                  "{TESTIMONIALS[activeTestimonial]}"
                </p>
              </motion.blockquote>
            </AnimatePresence>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveTestimonial(i)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  i === activeTestimonial ? "bg-nello-gold w-6" : "bg-foreground/20"
                )}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ========== 4️⃣ COMO FUNCIONA ========== */}
      <section className="py-16 md:py-24 px-5 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-foreground text-center mb-12">
            Um primeiro passo simples
          </h2>

          <div className="space-y-8">
            {[
              { step: "01", text: "Você responde algumas perguntas rápidas." },
              { step: "02", text: "O Identity organiza sinais do seu comportamento natural." },
              { step: "03", text: "Você recebe sua Leitura Inicial." },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-5">
                <div className="w-10 h-10 rounded-full bg-nello-gold/10 flex items-center justify-center shrink-0">
                  <span className="text-nello-gold font-display text-sm font-semibold">{item.step}</span>
                </div>
                <p className="text-foreground/80 text-base md:text-lg leading-relaxed pt-2">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== 5️⃣ CTA PRINCIPAL ========== */}
      <section className="py-16 md:py-24 px-5 sm:px-6 lg:px-8 bg-nello-graphite">
        <div className="max-w-xl mx-auto text-center">
          <Sparkles className="w-6 h-6 text-nello-gold mx-auto mb-4" strokeWidth={1.5} />

          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-white mb-6">
            Comece agora sua Leitura Inicial
          </h2>

          <div className="max-w-sm mx-auto space-y-3">
            <Button
              onClick={handleCTA}
              size="lg"
              className="w-full min-h-[56px] text-base px-8 rounded-full bg-nello-gold hover:bg-nello-gold/90 text-nello-graphite font-semibold shadow-xl transition-all duration-300 hover:scale-[1.02] group"
            >
              Começar minha Leitura
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <p className="text-white/50 text-sm">
              Sem compromisso. Apenas um primeiro olhar sobre você.
            </p>
          </div>
        </div>
      </section>

      {/* ========== NOTA DE RESPONSABILIDADE ========== */}
      <section className="py-8 px-5 sm:px-6 lg:px-8 bg-muted/20 border-t border-border/30">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs text-muted-foreground/60 leading-relaxed">
            O Identity é uma ferramenta de autoconhecimento e desenvolvimento pessoal. Não substitui diagnóstico psicológico, avaliação clínica ou acompanhamento terapêutico profissional.
          </p>
        </div>
      </section>

      {/* ========== FOOTER (LANDING-SPECIFIC) ========== */}
      <LandingFooterSimple />
    </div>
  );
};
