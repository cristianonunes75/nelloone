import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { NavSection } from "./NavSection";
import { LandingFooterSimple } from "./LandingFooterSimple";
import { HeroSection } from "./HeroSection";
import { PromiseSection } from "./PromiseSection";
import { EmotionalIdentificationSection } from "./EmotionalIdentificationSection";
import { TestimonialsSection } from "./TestimonialsSection";
import { DifferentiationSection } from "./DifferentiationSection";
import { FinalCTASection } from "./FinalCTASection";
import { BrandSignature } from "./BrandSignature";

export const NelloOneLanding = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const getLeituraPath = () => {
    if (language === 'en') return '/en/initial-reading';
    if (language === 'pt-pt') return '/pt-pt/leitura-inicial';
    return '/leitura-inicial';
  };

  const handleCTA = () => navigate(getLeituraPath());

  return (
    <div className="flex flex-col bg-background min-h-screen">
      <NavSection />
      <HeroSection onCTA={handleCTA} />
      <PromiseSection />
      <EmotionalIdentificationSection />
      <TestimonialsSection />
      <DifferentiationSection />
      <FinalCTASection onCTA={handleCTA} />
      <BrandSignature />

      {/* Disclaimer institucional */}
      <section className="py-8 px-5 sm:px-6 lg:px-8 bg-muted/20 border-t border-border/30">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs text-muted-foreground/60 leading-relaxed">
            O Identity é uma ferramenta educativa e reflexiva de autoconhecimento.
            Não constitui diagnóstico, avaliação clínica ou aconselhamento profissional.
          </p>
        </div>
      </section>

      <LandingFooterSimple />
    </div>
  );
};
