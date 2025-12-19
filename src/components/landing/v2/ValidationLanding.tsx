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
import miguelPresence from "@/assets/miguel-presence.jpg";

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
      <div className="pt-2 space-y-1">
        <p className="font-scripture text-xl md:text-2xl text-white/95 tracking-wide">
          {verse}
        </p>
        <p className="text-sm text-white/70 font-medium tracking-wider uppercase">
          {reference}
        </p>
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className="text-center pt-6 pb-2">
        <div className="inline-block px-6 py-4 bg-amber-50/50 dark:bg-amber-900/10 rounded-xl border border-amber-200/30 dark:border-amber-700/20">
          <p className="font-scripture text-lg md:text-xl text-amber-900/90 dark:text-amber-100/90 tracking-wide leading-relaxed">
            {verse}
          </p>
          <p className="text-xs text-amber-700/70 dark:text-amber-300/60 font-semibold tracking-widest uppercase mt-2">
            {reference}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center pt-6 border-t border-amber-200/40 dark:border-amber-800/20">
      <p className="font-scripture text-lg md:text-xl text-amber-800/90 dark:text-amber-200/80 tracking-wide leading-relaxed">
        {verse}
      </p>
      <p className="text-xs text-amber-600/70 dark:text-amber-400/60 font-semibold tracking-widest uppercase mt-2">
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
    <div className="flex flex-col">
      {/* SEÇÃO 1 - HERO */}
      <section 
        className="min-h-[90vh] flex items-center justify-center px-6 py-20 relative"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.55)), url(${heroDawn})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="max-w-3xl mx-auto text-center space-y-8 relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            {landing.hero.title}
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            {landing.hero.subtitle}
          </p>
          
          {(landing.hero as any).verse && (
            <ScriptureVerse 
              verse={(landing.hero as any).verse}
              reference={(landing.hero as any).verse_ref}
              variant="hero"
            />
          )}
          
          <div className="pt-6 space-y-4">
            <Button 
              onClick={handleCTA}
              size="lg" 
              className="text-lg px-10 py-6 rounded-full bg-white text-foreground hover:bg-white/90 shadow-lg"
            >
              {landing.hero.cta_primary}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <p className="text-sm text-white/70">
              {landing.hero.tagline}
            </p>
          </div>
        </div>
      </section>

      {/* SEÇÃO 2 - IDENTIFICAÇÃO */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="relative rounded-2xl overflow-hidden mb-8 shadow-lg">
            <img src={reflectionWindow} alt="Reflexão" className="w-full h-64 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground text-center">
            {landing.mirror.title}
          </h2>
          <div className="grid gap-4">
            {landing.mirror.items.map((item, index) => (
              <div 
                key={index}
                className="flex items-start gap-4 p-4 bg-background rounded-lg border border-border/50"
              >
                <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                <p className="text-foreground/90">{item}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-muted-foreground italic pt-4">
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
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground text-center">
            {landing.transformation.title}
          </h2>
          <div className="grid gap-6">
            {landing.transformation.steps.map((step, index) => (
              <div 
                key={index}
                className="flex items-center gap-6 p-5 bg-muted/50 rounded-xl"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
                  {step.number}
                </div>
                <div>
                  <p className="font-medium text-foreground">{step.title}</p>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-muted-foreground italic">
            {(landing.transformation as any).closing}
          </p>
        </div>
      </section>

      {/* SEÇÃO 4 - O QUE VOCÊ VAI DESCOBRIR */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-3xl mx-auto space-y-10">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground text-center">
            {landing.improvements.title}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {landing.improvements.items.map((item, index) => (
              <Card key={index} className="border-border/50">
                <CardContent className="p-5 flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-foreground/90">{item}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-center text-muted-foreground italic pt-4">
            {landing.improvements.closing}
          </p>
        </div>
      </section>

      {/* SEÇÃO 5 - O PAPEL DO MIGUEL */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="relative rounded-2xl overflow-hidden mb-4 shadow-lg">
            <img src={pathTogether} alt="Caminho" className="w-full h-48 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground text-center">
            {landing.miguel.title}
          </h2>
          <div className="bg-muted/50 rounded-2xl p-8 space-y-6">
            <div className="flex items-center gap-4 justify-center">
              <img 
                src={miguelPresence} 
                alt="Miguel" 
                className="w-20 h-20 rounded-full object-cover border-2 border-primary/20 shadow-md"
              />
            </div>
            <p className="text-center text-foreground/90 text-lg">
              {landing.miguel.description}
            </p>
            <blockquote className="text-center text-primary italic text-lg border-l-4 border-primary pl-4 mx-auto max-w-md">
              "{(landing.miguel as any).quote}"
            </blockquote>
            <p className="text-center text-muted-foreground text-sm">
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
      <section className="py-20 px-6 bg-gradient-to-b from-amber-50/30 to-muted/30 dark:from-amber-900/5 dark:to-muted/30">
        <div className="max-w-3xl mx-auto space-y-8 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
            {(landing as any).inspiration?.title || "Nossa inspiração"}
          </h2>
          <p className="text-foreground/90 text-lg">
            {(landing as any).inspiration?.description}
          </p>
          <p className="text-muted-foreground">
            {(landing as any).inspiration?.text}
          </p>
          
          {(landing as any).inspiration?.verse && (
            <div className="pt-6">
              <div className="inline-block px-8 py-6 bg-amber-50/70 dark:bg-amber-900/20 rounded-2xl border border-amber-200/50 dark:border-amber-700/30 shadow-sm">
                <p className="font-scripture text-xl md:text-2xl text-amber-900/90 dark:text-amber-100/90 tracking-wide leading-relaxed">
                  {(landing as any).inspiration?.verse}
                </p>
                <p className="text-sm text-amber-700/70 dark:text-amber-300/60 font-semibold tracking-widest uppercase mt-3">
                  {(landing as any).inspiration?.verse_ref}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SEÇÃO 12 - CTA FINAL */}
      <section 
        className="py-24 px-6 relative"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.45), rgba(0,0,0,0.65)), url(${horizonSunrise})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="max-w-2xl mx-auto text-center space-y-8 relative z-10">
          <h2 className="text-2xl md:text-3xl font-semibold text-white">
            {landing.cta.title}
          </h2>
          <Button 
            onClick={handleCTA}
            size="lg"
            className="text-lg px-10 py-6 rounded-full bg-white text-foreground hover:bg-white/90 shadow-lg"
          >
            {landing.cta.button}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="text-white/70 text-sm">
            {landing.cta.subtitle}
          </p>
        </div>
      </section>
    </div>
  );
};