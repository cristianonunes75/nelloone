import { Button } from "@/components/ui/button";
import { ArrowRight, User, Palette, MessageCircle, Target, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useScrollAnimation, getStaggerDelay } from "@/hooks/useScrollAnimation";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import essenceMapImage from "@/assets/essence-map.jpg";

export const EssenceMapSection = () => {
  const navigate = useNavigate();
  const { ref, isVisible } = useScrollAnimation();
  const { t, language } = useLanguage();

  const mapSections = language === 'en' ? [
    { icon: User, label: "Core Identity", description: "Who you are in essence" },
    { icon: Palette, label: "Essential Image", description: "How you present yourself to the world" },
    { icon: MessageCircle, label: "Communication", description: "Your unique way of expressing" },
    { icon: Target, label: "Purpose", description: "What moves you deeply" },
    { icon: BookOpen, label: "Life Plan", description: "Paths for your evolution" },
  ] : [
    { icon: User, label: "Identidade Central", description: "Quem você é em essência" },
    { icon: Palette, label: "Imagem Essencial", description: "Como você se apresenta ao mundo" },
    { icon: MessageCircle, label: "Comunicação", description: "Sua forma única de se expressar" },
    { icon: Target, label: "Propósito", description: "O que move você profundamente" },
    { icon: BookOpen, label: "Plano de Vida", description: "Caminhos para sua evolução" },
  ];

  return (
    <section className="py-16 md:py-24 lg:py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 gradient-radial opacity-50" />
      
      <div ref={ref} className="container px-4 md:px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-10 md:gap-16 items-center">
            {/* Content */}
            <div className={cn(
              "transition-all duration-700 order-2 lg:order-1",
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 lg:-translate-x-8"
            )}>
              <span className="inline-block text-ink-blue font-medium text-xs md:text-sm tracking-wide uppercase mb-3 md:mb-4">
                {language === 'en' ? 'The Final Result' : 'O Resultado Final'}
              </span>
              <h2 className="font-display text-2xl sm:text-display-sm md:text-display-md lg:text-display-lg text-foreground mb-4 md:mb-6">
                {language === 'en' ? (
                  <>
                    Your
                    <span className="text-ink-blue"> NELLO ONE</span> Map
                  </>
                ) : (
                  <>
                    Seu Mapa
                    <span className="text-ink-blue"> NELLO ONE</span>
                  </>
                )}
              </h2>
              <p className="font-premium text-base md:text-lg text-muted-foreground mb-4 md:mb-6 leading-relaxed">
                "{t.landing.map.description}"
              </p>
              <p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8 leading-relaxed">
                {language === 'en' 
                  ? 'After completing the 7 tests, Nello synthesizes all your results into a single, personalized document: the NELLO ONE Map. The panel that brings all your results together in a clear and visual map.'
                  : 'Ao completar os 7 testes, Nello sintetiza todos os seus resultados em um documento único e personalizado: o Mapa NELLO ONE. O painel que une todos os seus resultados em um mapa claro e visual.'}
              </p>

              <div className="space-y-2 md:space-y-3 mb-8 md:mb-10">
                {mapSections.map((section, index) => (
                  <div 
                    key={section.label} 
                    className={cn(
                      "flex items-center gap-3 md:gap-4 group cursor-default transition-all duration-300",
                      isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                    )}
                    style={isVisible ? getStaggerDelay(index, 0.1) : {}}
                  >
                    <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-ink-blue/10 flex items-center justify-center flex-shrink-0 group-hover:bg-ink-blue/15 transition-colors duration-300">
                      <section.icon className="w-3.5 h-3.5 md:w-4 md:h-4 text-ink-blue" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-xs md:text-sm">{section.label}</p>
                      <p className="text-[10px] md:text-xs text-muted-foreground">{section.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Button 
                size="lg" 
                className="group w-full sm:w-auto h-11 md:h-12 px-5 md:px-6 text-sm md:text-base rounded-full bg-ink-blue hover:bg-ink-deep text-primary-foreground hover-lift press-effect"
                onClick={() => navigate("/auth")}
              >
                {language === 'en' ? 'Start My Journey' : 'Começar Minha Jornada'}
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </div>

            {/* Visual - Show first on mobile */}
            <div className={cn(
              "relative transition-all duration-700 delay-200 order-1 lg:order-2 w-full max-w-sm lg:max-w-none mx-auto",
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 lg:translate-x-8"
            )}>
              <div className="aspect-[4/5] relative">
                {/* Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-bruma-blue/20 to-lavender/20 rounded-2xl md:rounded-3xl blur-3xl subtle-pulse" />
                
                {/* Map image */}
                <div className="relative h-full rounded-2xl md:rounded-3xl overflow-hidden border border-border/30 shadow-large hover:shadow-glow transition-shadow duration-500">
                  <img 
                    src={essenceMapImage} 
                    alt="NELLO ONE Map"
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Overlay with content preview */}
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                  
                  {/* Header overlay */}
                  <div className="absolute top-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-b from-card/90 to-transparent">
                    <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wider">NELLO ONE</p>
                    <p className="font-display text-base md:text-xl text-foreground mt-1">
                      {language === 'en' ? 'Personality Map' : 'Mapa de Personalidade'}
                    </p>
                  </div>
                </div>

                {/* Floating badge */}
                <div className={cn(
                  "absolute -bottom-2 -right-2 md:-bottom-4 md:-right-4 bg-card px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl shadow-large border border-border/30 transition-all duration-500 delay-500",
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}>
                  <span className="text-xs md:text-sm font-medium text-ink-blue">
                    {language === 'en' ? 'Personalized PDF' : 'PDF Personalizado'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
