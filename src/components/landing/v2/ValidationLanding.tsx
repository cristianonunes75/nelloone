import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, X, ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ApprovedTestimonialsSection } from "./ApprovedTestimonialsSection";
import heroDawn from "@/assets/hero-dawn.jpg";
import reflectionWindow from "@/assets/reflection-window.jpg";
import pathTogether from "@/assets/path-together.jpg";
import horizonSunrise from "@/assets/horizon-sunrise.jpg";
import nelloPresence from "@/assets/nello-presence.jpg";

// Componente para exibir versículos bíblicos com estilo destacado
const ScriptureVerse = ({ 
  verse, 
  reference, 
  variant = "default" 
}: { 
  verse: string; 
  reference: string; 
  variant?: "default" | "hero" | "card";
}) => {
  if (variant === "hero") {
    return (
      <div className="pt-2 space-y-2 px-4 sm:px-0">
        <p className="font-scripture text-lg sm:text-xl md:text-2xl text-nello-gold tracking-wide leading-relaxed">
          {verse}
        </p>
        <p className="text-xs sm:text-sm text-muted-foreground font-medium tracking-wider uppercase">
          {reference}
        </p>
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className="text-center pt-4 sm:pt-6 pb-2 px-2 sm:px-0">
        <div className="inline-block px-4 sm:px-6 py-3 sm:py-4 bg-nello-gold-glow rounded-xl border border-nello-gold/20 max-w-full">
          <p className="font-scripture text-base sm:text-lg md:text-xl text-foreground/90 tracking-wide leading-relaxed">
            {verse}
          </p>
          <p className="text-[10px] sm:text-xs text-nello-gold font-semibold tracking-widest uppercase mt-2">
            {reference}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center pt-4 sm:pt-6 border-t border-nello-gold/20 px-2 sm:px-0">
      <p className="font-scripture text-base sm:text-lg md:text-xl text-foreground/85 tracking-wide leading-relaxed">
        {verse}
      </p>
      <p className="text-[10px] sm:text-xs text-nello-gold font-semibold tracking-widest uppercase mt-2">
        {reference}
      </p>
    </div>
  );
};

export const ValidationLanding = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const landing = t.landing;

  const handleCTA = () => {
    navigate("/auth");
  };

  return (
    <div className="flex flex-col bg-background">
      {/* SEÇÃO 1 - HERO */}
      <section 
        className="min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center px-4 sm:px-6 py-16 sm:py-20 relative bg-background-warm"
      >
        {/* Warm golden glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-nello-gold/8 rounded-full blur-3xl" />
        
        {/* Background image with warm overlay */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${heroDawn})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 30%'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background-warm/95 via-background-warm/85 to-background" />
        
        <div className="max-w-3xl mx-auto text-center space-y-6 sm:space-y-8 relative z-10">
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground leading-tight px-2">
            {landing.hero.title}
          </h1>
          <p className="font-body text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
            {landing.hero.subtitle}
          </p>
          
          {(landing.hero as any).verse && (
            <ScriptureVerse 
              verse={(landing.hero as any).verse}
              reference={(landing.hero as any).verse_ref}
              variant="hero"
            />
          )}
          
          <div className="pt-4 sm:pt-6 space-y-3 sm:space-y-4">
            <Button 
              onClick={handleCTA}
              size="lg" 
              className="text-base sm:text-lg px-8 sm:px-10 py-5 sm:py-6 rounded-full bg-nello-gold hover:bg-nello-gold-deep text-white shadow-lg hover:shadow-gold font-sans-ui font-medium"
            >
              {landing.hero.cta_primary}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {landing.hero.tagline}
            </p>
          </div>
        </div>
      </section>

      {/* SEÇÃO 2 - IDENTIFICAÇÃO */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto space-y-8 sm:space-y-10">
          <div className="relative rounded-xl sm:rounded-2xl overflow-hidden mb-6 sm:mb-8 shadow-lg">
            <img 
              src={reflectionWindow} 
              alt="Reflexão" 
              className="w-full h-48 sm:h-56 md:h-64 object-cover object-center" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-foreground text-center px-2">
            {landing.mirror.title}
          </h2>
          <div className="grid gap-3 sm:gap-4">
            {landing.mirror.items.map((item, index) => (
              <div 
                key={index}
                className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-background rounded-lg border border-border/50"
              >
                <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                <p className="text-sm sm:text-base text-foreground/90">{item}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-muted-foreground italic pt-2 sm:pt-4 text-sm sm:text-base px-2">
            {landing.mirror.closing}
          </p>
          
          {(landing.mirror as any).verse && (
            <ScriptureVerse 
              verse={(landing.mirror as any).verse}
              reference={(landing.mirror as any).verse_ref}
            />
          )}
        </div>
      </section>

      {/* SEÇÃO 3 - COMO FUNCIONA */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-3xl mx-auto space-y-10">
          <h2 className="font-heading text-2xl md:text-3xl font-semibold text-foreground text-center">
            {landing.transformation.title}
          </h2>
          <div className="grid gap-6">
            {landing.transformation.steps.map((step, index) => (
              <div 
                key={index}
                className="flex items-center gap-6 p-5 bg-secondary/50 rounded-xl border border-border/30"
              >
                <div className="w-10 h-10 rounded-full bg-nello-gold/10 text-nello-gold flex items-center justify-center font-bold shrink-0 font-body">
                  {step.number}
                </div>
                <div>
                  <p className="font-medium text-foreground font-body">{step.title}</p>
                  <p className="text-muted-foreground text-sm font-body">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-muted-foreground italic font-body">
            {(landing.transformation as any).closing}
          </p>
        </div>
      </section>

      {/* SEÇÃO 4 - O QUE VOCÊ VAI DESCOBRIR */}
      <section className="py-20 px-6 bg-secondary/30">
        <div className="max-w-3xl mx-auto space-y-10">
          <h2 className="font-heading text-2xl md:text-3xl font-semibold text-foreground text-center">
            {landing.improvements.title}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {landing.improvements.items.map((item, index) => (
              <Card key={index} className="border-border/30 bg-card/80">
                <CardContent className="p-5 flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-nello-gold shrink-0 mt-0.5" />
                  <p className="text-foreground/90 font-body">{item}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-center text-muted-foreground italic pt-4 font-body">
            {landing.improvements.closing}
          </p>
        </div>
      </section>

      {/* SEÇÃO 5 - O PAPEL DO MIGUEL */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 bg-background">
        <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
          <div className="relative rounded-xl sm:rounded-2xl overflow-hidden mb-3 sm:mb-4 shadow-md">
            <img 
              src={pathTogether} 
              alt="Caminho" 
              className="w-full h-40 sm:h-48 object-cover object-center" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
          </div>
          <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-semibold text-foreground text-center">
            {landing.miguel.title}
          </h2>
          <div className="bg-secondary/40 rounded-xl sm:rounded-2xl p-5 sm:p-8 space-y-5 sm:space-y-6 border border-border/30">
            <div className="flex items-center gap-4 justify-center">
              <img 
                src={nelloPresence} 
                alt="Nello" 
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-nello-gold/30 shadow-md"
              />
            </div>
            <p className="text-center text-foreground/90 text-base sm:text-lg px-2 font-body">
              {landing.miguel.description}
            </p>
            <blockquote className="text-center text-nello-gold italic text-base sm:text-lg border-l-4 border-nello-gold pl-4 mx-auto max-w-md font-scripture">
              "{(landing.miguel as any).quote}"
            </blockquote>
            <p className="text-center text-muted-foreground text-xs sm:text-sm px-2 font-body">
              {(landing.miguel as any).note}
            </p>
            
            {(landing.miguel as any).verse && (
              <ScriptureVerse 
                verse={(landing.miguel as any).verse}
                reference={(landing.miguel as any).verse_ref}
                variant="card"
              />
            )}
          </div>
        </div>
      </section>

      {/* SEÇÃO 6 - PARA QUEM É */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Check className="h-6 w-6 text-green-500" />
                {landing.not_for_you.title_for}
              </h3>
              <div className="space-y-3">
                {landing.not_for_you.items_for.map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-green-500/5 rounded-lg border border-green-500/20">
                    <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <p className="text-foreground/90">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <X className="h-6 w-6 text-red-400" />
                {landing.not_for_you.title_not}
              </h3>
              <div className="space-y-3">
                {landing.not_for_you.items_not.map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-red-500/5 rounded-lg border border-red-500/20">
                    <X className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                    <p className="text-foreground/90">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 7 - A JORNADA COMPLETA */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-3xl mx-auto space-y-10">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground text-center">
            {landing.what_you_get.title}
          </h2>
          <p className="text-center text-muted-foreground text-lg">
            {landing.what_you_get.subtitle}
          </p>
          <div className="bg-muted/50 rounded-xl p-8 space-y-4">
            <h3 className="font-medium text-foreground">
              Ao final da jornada, você recebe:
            </h3>
            <ul className="space-y-3">
              {landing.what_you_get.items.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-foreground/90">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="text-center text-muted-foreground italic">
            {landing.what_you_get.closing}
          </p>
        </div>
      </section>

      {/* SEÇÃO 8 - RESULTADO FINAL */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground text-center">
            {(landing as any).final_result?.title}
          </h2>
          <p className="text-center text-foreground/90 text-lg">
            {(landing as any).final_result?.description}
          </p>
          <p className="text-center text-muted-foreground italic">
            {(landing as any).final_result?.note}
          </p>
          
          {(landing as any).final_result?.verse && (
            <ScriptureVerse 
              verse={(landing as any).final_result?.verse}
              reference={(landing as any).final_result?.verse_ref}
            />
          )}
        </div>
      </section>

      {/* SEÇÃO 9 - DEPOIMENTOS */}
      <ApprovedTestimonialsSection />

      {/* SEÇÃO 10 - SIMPLICIDADE E VERDADE */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="flex flex-wrap justify-center gap-4">
            {((landing as any).simplicity?.items || []).map((item: string, index: number) => (
              <span 
                key={index}
                className="px-6 py-3 bg-muted rounded-full text-foreground/90 text-sm font-medium"
              >
                {item}
              </span>
            ))}
          </div>
          <p className="text-center text-muted-foreground italic text-lg pt-4">
            {(landing as any).simplicity?.closing}
          </p>
        </div>
      </section>

      {/* SEÇÃO 11 - NOSSA INSPIRAÇÃO */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 bg-gradient-to-b from-amber-50/30 to-muted/30 dark:from-stone-900/30 dark:to-muted/30">
        <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8 text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-foreground px-2">
            {(landing as any).inspiration?.title || "Nossa inspiração"}
          </h2>
          <p className="text-foreground/90 text-base sm:text-lg px-2">
            {(landing as any).inspiration?.description}
          </p>
          <p className="text-muted-foreground text-sm sm:text-base px-2">
            {(landing as any).inspiration?.text}
          </p>
          
          {(landing as any).inspiration?.verse && (
            <div className="pt-4 sm:pt-6 px-2">
              <div className="inline-block px-5 sm:px-8 py-5 sm:py-6 bg-amber-50/70 dark:bg-stone-800/50 rounded-xl sm:rounded-2xl border border-amber-200/50 dark:border-stone-600/40 shadow-sm max-w-full">
                <p className="font-scripture text-lg sm:text-xl md:text-2xl text-amber-900/90 dark:text-stone-200/95 tracking-wide leading-relaxed">
                  {(landing as any).inspiration?.verse}
                </p>
                <p className="text-xs sm:text-sm text-amber-700/70 dark:text-stone-400/80 font-semibold tracking-widest uppercase mt-2 sm:mt-3">
                  {(landing as any).inspiration?.verse_ref}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SEÇÃO 12 - CTA FINAL */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 relative bg-ink-deep">
        <div className="max-w-2xl mx-auto text-center space-y-6 sm:space-y-8 relative z-10">
          <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-semibold text-white px-4">
            {landing.cta.title}
          </h2>
          <Button 
            onClick={handleCTA}
            size="lg"
            className="text-base sm:text-lg px-8 sm:px-10 py-5 sm:py-6 rounded-full bg-nello-gold hover:bg-nello-gold-deep text-white shadow-lg hover:shadow-gold font-sans-ui font-medium"
          >
            {landing.cta.button}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="text-white/70 text-xs sm:text-sm px-4 font-body">
            {landing.cta.subtitle}
          </p>
        </div>
      </section>
    </div>
  );
};