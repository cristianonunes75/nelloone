import { Star, Quote } from "lucide-react";
import { useScrollAnimation, getStaggerDelay } from "@/hooks/useScrollAnimation";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { TESTIMONIAL_DISCLAIMER } from "@/lib/compliance/testimonialCompliance";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { checkTestimonialCompliance } from "@/lib/compliance/testimonialCompliance";

const FALLBACK_TESTIMONIALS = {
  en: [
    { name: "Mariana S.", role: "Designer", content: "It was like looking in the mirror for the first time. Nello asked questions that made me stop and think deeply about who I really am.", rating: 5 },
    { name: "Rafael M.", role: "Entrepreneur", content: "The NELLO IDENTITY Map gave me clarity on decisions I had been putting off for years. Now I know exactly where to focus my energy.", rating: 5 },
    { name: "Camila L.", role: "Psychologist", content: "As a mental health professional, I was impressed by the depth and accuracy of the analyses. A powerful self-knowledge tool.", rating: 5 },
  ],
  pt: [
    { name: "Mariana S.", role: "Designer", content: "Foi como olhar no espelho pela primeira vez. Nello fez perguntas que me fizeram parar e pensar profundamente sobre quem eu realmente sou.", rating: 5 },
    { name: "Rafael M.", role: "Empreendedor", content: "O Mapa NELLO IDENTITY me deu clareza sobre decisões que eu vinha adiando há anos. Agora sei exatamente onde colocar minha energia.", rating: 5 },
    { name: "Camila L.", role: "Psicóloga", content: "Como profissional de saúde mental, fiquei impressionada com a profundidade e precisão das análises. Uma ferramenta poderosa de autoconhecimento.", rating: 5 },
  ],
};

export const TestimonialsSection = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: cardsRef, isVisible: cardsVisible } = useScrollAnimation();
  const { ref: benefitsRef, isVisible: benefitsVisible } = useScrollAnimation();
  const { t, language } = useLanguage();
  const isEn = language === 'en';

  const { data: dbTestimonials } = useQuery({
    queryKey: ["landing-testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("id, content, is_featured, user_id, profiles:user_id(full_name, profession)")
        .eq("status", "approved")
        .eq("is_featured", true)
        .eq("consent_given", true)
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) throw error;

      return (data || [])
        .filter(t => checkTestimonialCompliance(t.content).riskLevel !== 'critical')
        .map(t => {
          const profile = t.profiles as unknown as { full_name: string | null; profession: string | null } | null;
          return {
            name: profile?.full_name || "Usuário",
            role: profile?.profession || (isEn ? "Identity User" : "Usuário Identity"),
            content: t.content,
            rating: 5,
          };
        });
    },
    staleTime: 1000 * 60 * 5,
  });

  const fallback = isEn ? FALLBACK_TESTIMONIALS.en : FALLBACK_TESTIMONIALS.pt;
  const testimonials = dbTestimonials && dbTestimonials.length > 0 ? dbTestimonials : fallback;

  const benefits = [
    t.landing.why.cards.clarity.title,
    t.landing.why.cards.direction.title,
    language === 'en' ? 'Simple language' : 'Linguagem simples',
    language === 'en' ? 'Serious tests' : 'Testes sérios',
    language === 'en' ? 'Human AI' : 'IA humana',
    t.landing.why.cards.journey.title,
  ];

  return (
    <section className="py-16 md:py-24 lg:py-32 bg-bruma-light/30">
      <div className="container px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          {/* Section header */}
          <div ref={headerRef} className="text-center mb-10 md:mb-16">
            <span 
              className={cn(
                "inline-block text-ink-blue font-medium text-xs md:text-sm tracking-wide uppercase mb-3 md:mb-4 transition-all duration-500",
                headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              {language === 'en' ? 'Real Transformations' : 'Transformações Reais'}
            </span>
            <h2 
              className={cn(
                "font-display text-2xl sm:text-display-sm md:text-display-md lg:text-display-lg text-foreground mb-4 md:mb-6 transition-all duration-500 delay-100",
                headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              {language === 'en' ? (
                <>
                  What they say who already
                  <span className="block">discovered who they are</span>
                </>
              ) : (
                <>
                  O que dizem quem já
                  <span className="block">descobriu quem é</span>
                </>
              )}
            </h2>
            <p 
              className={cn(
                "text-xs text-muted-foreground/70 max-w-xl mx-auto transition-all duration-500 delay-200",
                headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              {isEn ? TESTIMONIAL_DISCLAIMER.en : TESTIMONIAL_DISCLAIMER.pt}
            </p>
          </div>

          {/* Testimonials */}
          <div 
            ref={cardsRef} 
            className="flex md:grid md:grid-cols-3 gap-4 md:gap-6 mb-12 md:mb-20 overflow-x-auto pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory md:snap-none scrollbar-hide"
          >
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.name + index}
                className={cn(
                  "bg-card rounded-xl md:rounded-2xl p-4 md:p-6 border border-border/30 shadow-soft hover:shadow-medium hover:border-border/50 transition-all duration-300 min-w-[280px] md:min-w-0 snap-center flex-shrink-0 md:flex-shrink",
                  cardsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                )}
                style={cardsVisible ? getStaggerDelay(index, 0.15) : {}}
              >
                <Quote className="w-6 h-6 md:w-7 md:h-7 text-ink-blue/30 mb-3 md:mb-4" strokeWidth={1.5} />
                <p className="text-foreground mb-4 md:mb-6 leading-relaxed text-xs md:text-sm line-clamp-4 md:line-clamp-none">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground text-xs md:text-sm">{testimonial.name}</p>
                    <p className="text-[10px] md:text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 md:w-3.5 md:h-3.5 text-ink-blue fill-ink-blue" />
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
              "bg-card rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-12 border border-border/30 shadow-soft transition-all duration-700",
              benefitsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            <h3 className="font-display text-xl md:text-display-sm text-foreground text-center mb-6 md:mb-10">
              {t.landing.why.title}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
              {benefits.map((benefit, index) => (
                <div 
                  key={benefit}
                  className={cn(
                    "flex items-center gap-3 p-3 md:p-4 rounded-lg md:rounded-xl bg-bruma-light/50 hover:bg-bruma-light transition-all duration-300 cursor-default",
                    benefitsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  )}
                  style={benefitsVisible ? getStaggerDelay(index, 0.08) : {}}
                >
                  <div className="w-2 h-2 rounded-full bg-ink-blue flex-shrink-0" />
                  <p className="text-foreground text-xs md:text-sm">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
