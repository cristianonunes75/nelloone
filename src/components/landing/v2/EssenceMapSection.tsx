import { Button } from "@/components/ui/button";
import { ArrowRight, User, Palette, MessageCircle, Target, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

const mapSections = [
  { icon: User, label: "Identidade Central", description: "Quem você é em essência" },
  { icon: Palette, label: "Imagem Essencial", description: "Como você se apresenta ao mundo" },
  { icon: MessageCircle, label: "Comunicação", description: "Sua forma única de se expressar" },
  { icon: Target, label: "Propósito", description: "O que move você profundamente" },
  { icon: BookOpen, label: "Plano de Vida", description: "Caminhos para sua evolução" },
];

export const EssenceMapSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 gradient-radial opacity-50" />
      
      <div className="container px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <div>
              <span className="inline-block text-accent font-medium text-sm tracking-wide uppercase mb-4">
                O Resultado Final
              </span>
              <h2 className="font-display text-display-md md:text-display-lg text-foreground mb-6">
                Seu Mapa da
                <span className="text-accent"> Essência</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Ao completar os 7 testes, Miguel sintetiza todos os seus resultados 
                em um documento único e personalizado: o Mapa da Essência. Uma visão 
                integrada de quem você é, suas forças, desafios e caminhos de evolução.
              </p>

              <div className="space-y-4 mb-10">
                {mapSections.map((section) => (
                  <div key={section.label} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <section.icon className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{section.label}</p>
                      <p className="text-sm text-muted-foreground">{section.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Button 
                size="lg" 
                className="group h-14 px-8 text-base rounded-full"
                onClick={() => navigate("/auth")}
              >
                Começar Minha Jornada
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* Visual */}
            <div className="relative">
              <div className="aspect-[4/5] relative">
                {/* Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-sage/20 rounded-3xl blur-3xl" />
                
                {/* Map preview */}
                <div className="relative h-full bg-card rounded-3xl border border-border/50 shadow-large overflow-hidden">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-foreground to-foreground/90 text-primary-foreground p-6">
                    <p className="text-sm opacity-70">ESSENTIA</p>
                    <p className="font-display text-2xl mt-1">Mapa da Essência</p>
                  </div>
                  
                  {/* Content preview */}
                  <div className="p-6 space-y-4">
                    {mapSections.map((section, i) => (
                      <div 
                        key={section.label}
                        className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50"
                        style={{ opacity: 1 - i * 0.1 }}
                      >
                        <section.icon className="w-5 h-5 text-accent" />
                        <div className="flex-1">
                          <div className="h-2 bg-muted rounded-full w-3/4" />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bottom decoration */}
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-card to-transparent" />
                </div>

                {/* Floating badge */}
                <div className="absolute -bottom-4 -right-4 bg-accent text-accent-foreground px-4 py-2 rounded-xl shadow-medium font-medium text-sm">
                  PDF Personalizado
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
