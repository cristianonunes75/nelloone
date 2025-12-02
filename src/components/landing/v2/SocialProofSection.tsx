import { useLanguage } from "@/contexts/LanguageContext";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { Quote, Shield, Brain, Users, Award } from "lucide-react";

const technicalIcons = [Shield, Brain, Users, Award];

export const SocialProofSection = () => {
  const { t } = useLanguage();
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const socialProof = (t.landing as any).social_proof;

  if (!socialProof) return null;

  return (
    <section className="py-16 md:py-24 bg-muted/30 relative overflow-hidden">
      <div ref={ref} className="container px-4 md:px-6">
        <h2 
          className={cn(
            "font-display text-2xl sm:text-3xl md:text-4xl text-center text-foreground mb-12 md:mb-16 transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          )}
        >
          {socialProof.title}
        </h2>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {socialProof.testimonials?.map((testimonial: any, index: number) => (
            <div
              key={index}
              className={cn(
                "relative bg-background rounded-2xl p-6 md:p-8 border border-border/50 shadow-sm transition-all duration-500",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
              )}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <Quote className="w-8 h-8 text-ink-blue/20 absolute top-4 right-4" />
              <p className="text-foreground/80 text-base md:text-lg leading-relaxed mb-4 italic">
                "{testimonial.quote}"
              </p>
              <p className="text-sm text-muted-foreground font-medium">
                — {testimonial.author}
              </p>
            </div>
          ))}
        </div>

        {/* Technical Proof */}
        <div 
          className={cn(
            "max-w-3xl mx-auto transition-all duration-700 delay-300",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          )}
        >
          <h3 className="font-display text-lg md:text-xl text-center text-foreground mb-6">
            {socialProof.technical?.title}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {socialProof.technical?.items?.map((item: string, index: number) => {
              const IconComponent = technicalIcons[index % technicalIcons.length];
              return (
                <div
                  key={index}
                  className="flex flex-col items-center text-center p-4 bg-background rounded-xl border border-border/30"
                >
                  <IconComponent className="w-5 h-5 text-ink-blue mb-2" />
                  <span className="text-xs md:text-sm text-muted-foreground">
                    {item}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
