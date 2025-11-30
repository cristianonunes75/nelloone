import { Star, Quote } from "lucide-react";

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
  return (
    <section className="py-24 md:py-32 bg-secondary/30">
      <div className="container px-6">
        <div className="max-w-5xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <span className="inline-block text-accent font-medium text-sm tracking-wide uppercase mb-4">
              Transformações Reais
            </span>
            <h2 className="font-display text-display-md md:text-display-lg text-foreground mb-6">
              O que dizem quem já
              <span className="block">descobriu sua essência</span>
            </h2>
          </div>

          {/* Testimonials */}
          <div className="grid md:grid-cols-3 gap-6 mb-20">
            {testimonials.map((testimonial) => (
              <div 
                key={testimonial.name}
                className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft"
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
          <div className="bg-card rounded-3xl p-8 md:p-12 border border-border/50 shadow-soft">
            <h3 className="font-display text-display-sm text-foreground text-center mb-10">
              O que você vai descobrir
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {benefits.map((benefit) => (
                <div 
                  key={benefit}
                  className="flex items-center gap-3 p-4 rounded-xl bg-secondary/50"
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
