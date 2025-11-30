import { Star, Quote } from "lucide-react";
import { useScrollAnimation, getStaggerDelay } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    name: "Mariana S.",
    role: "Designer",
    content: "Foi como olhar no espelho pela primeira vez. Miguel fez perguntas que me fizeram parar e pensar profundamente sobre quem eu realmente sou.",
    rating: 5,
  },
  {
    name: "Rafael M.",
    role: "Empreendedor",
    content: "O Mapa da Essência me deu clareza sobre decisões que eu vinha adiando há anos. Agora sei exatamente onde colocar minha energia.",
    rating: 5,
  },
  {
    name: "Camila L.",
    role: "Psicóloga",
    content: "Como profissional de saúde mental, fiquei impressionada com a profundidade e precisão das análises. Uma ferramenta poderosa de autoconhecimento.",
    rating: 5,
  },
];

const benefits = [
  "Clareza sobre seus padrões de comportamento",
  "Entendimento profundo das suas motivações",
  "Descoberta dos seus talentos naturais",
  "Consciência sobre como você se relaciona",
  "Direção clara para seu desenvolvimento pessoal",
  "Integração de todas as dimensões de quem você é",
];

export const TestimonialsSection = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: cardsRef, isVisible: cardsVisible } = useScrollAnimation();
  const { ref: benefitsRef, isVisible: benefitsVisible } = useScrollAnimation();

  return (
    <section className="py-24 md:py-32 bg-secondary/30">
      <div className="container px-6">
        <div className="max-w-5xl mx-auto">
          {/* Section header */}
          <div ref={headerRef} className="text-center mb-16">
            <span 
              className={cn(
                "inline-block text-accent font-medium text-sm tracking-wide uppercase mb-4 transition-all duration-500",
                headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              Transformações Reais
            </span>
            <h2 
              className={cn(
                "font-display text-display-md md:text-display-lg text-foreground mb-6 transition-all duration-500 delay-100",
                headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              O que dizem quem já
              <span className="block">descobriu sua essência</span>
            </h2>
          </div>

          {/* Testimonials */}
          <div ref={cardsRef} className="grid md:grid-cols-3 gap-6 mb-20">
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.name}
                className={cn(
                  "bg-card rounded-2xl p-6 border border-border/50 shadow-soft hover:shadow-medium hover:border-border transition-all duration-300",
                  cardsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                )}
                style={cardsVisible ? getStaggerDelay(index, 0.15) : {}}
              >
                <Quote className="w-8 h-8 text-accent/30 mb-4" />
                <p className="text-foreground mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-accent fill-accent" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Benefits */}
          <div 
            ref={benefitsRef}
            className={cn(
              "bg-card rounded-3xl p-8 md:p-12 border border-border/50 shadow-soft transition-all duration-700",
              benefitsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            <h3 className="font-display text-display-sm text-foreground text-center mb-10">
              O que você vai descobrir
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {benefits.map((benefit, index) => (
                <div 
                  key={benefit}
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-all duration-300 cursor-default",
                    benefitsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  )}
                  style={benefitsVisible ? getStaggerDelay(index, 0.08) : {}}
                >
                  <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
                  <p className="text-foreground text-sm">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
