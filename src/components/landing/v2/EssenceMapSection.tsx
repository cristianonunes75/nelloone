import { Button } from "@/components/ui/button";
import { ArrowRight, User, Palette, MessageCircle, Target, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useScrollAnimation, getStaggerDelay } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import essenceMapImage from "@/assets/essence-map.jpg";

const mapSections = [
  { icon: User, label: "Identidade Central", description: "Quem você é em essência" },
  { icon: Palette, label: "Imagem Essencial", description: "Como você se apresenta ao mundo" },
  { icon: MessageCircle, label: "Comunicação", description: "Sua forma única de se expressar" },
  { icon: Target, label: "Propósito", description: "O que move você profundamente" },
  { icon: BookOpen, label: "Plano de Vida", description: "Caminhos para sua evolução" },
];

export const EssenceMapSection = () => {
  const navigate = useNavigate();
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 gradient-radial opacity-50" />
      
      <div ref={ref} className="container px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <div className={cn(
              "transition-all duration-700",
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
            )}>
              <span className="inline-block text-gold font-medium text-sm tracking-wide uppercase mb-4">
                O Resultado Final
              </span>
              <h2 className="font-display text-display-md md:text-display-lg text-foreground mb-6">
                Seu Mapa da
                <span className="text-gold"> Essência</span>
              </h2>
              <p className="font-miguel text-lg text-muted-foreground mb-6 leading-relaxed">
                "Um mapa para quem você é por dentro."
              </p>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Ao completar os 7 testes, Miguel sintetiza todos os seus resultados 
                em um documento único e personalizado: o Mapa da Essência. Uma visão 
                integrada de quem você é, suas forças, desafios e caminhos de evolução.
              </p>

              <div className="space-y-3 mb-10">
                {mapSections.map((section, index) => (
                  <div 
                    key={section.label} 
                    className={cn(
                      "flex items-center gap-4 group cursor-default transition-all duration-300",
                      isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                    )}
                    style={isVisible ? getStaggerDelay(index, 0.1) : {}}
                  >
                    <div className="w-9 h-9 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0 group-hover:bg-gold/15 transition-colors duration-300">
                      <section.icon className="w-4 h-4 text-gold" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">{section.label}</p>
                      <p className="text-xs text-muted-foreground">{section.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Button 
                size="lg" 
                className="group h-12 px-6 text-base rounded-full bg-gold hover:bg-gold-dark text-primary-foreground hover-lift press-effect"
                onClick={() => navigate("/auth")}
              >
                Começar Minha Jornada
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </div>

            {/* Visual */}
            <div className={cn(
              "relative transition-all duration-700 delay-200",
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            )}>
              <div className="aspect-[4/5] relative">
                {/* Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-gold/15 to-soul-amber/15 rounded-3xl blur-3xl subtle-pulse" />
                
                {/* Map image */}
                <div className="relative h-full rounded-3xl overflow-hidden border border-border/30 shadow-large hover:shadow-glow transition-shadow duration-500">
                  <img 
                    src={essenceMapImage} 
                    alt="Mapa da Essência"
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Overlay with content preview */}
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                  
                  {/* Header overlay */}
                  <div className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-card/90 to-transparent">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">ESSENTIA</p>
                    <p className="font-display text-xl text-foreground mt-1">Mapa da Essência</p>
                  </div>
                </div>

                {/* Floating badge */}
                <div className={cn(
                  "absolute -bottom-4 -right-4 bg-card px-4 py-2 rounded-xl shadow-large border border-border/30 transition-all duration-500 delay-500",
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}>
                  <span className="text-sm font-medium text-gold">PDF Personalizado</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
