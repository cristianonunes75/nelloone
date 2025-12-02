import { useLanguage } from "@/contexts/LanguageContext";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { Sparkles, Check } from "lucide-react";

export const PersonalBrandingSection = () => {
  const { t } = useLanguage();
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const branding = (t.landing as any).personal_branding;

  if (!branding) return null;

  return (
    <section className="py-16 md:py-24 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-ink-blue/5 via-transparent to-bruma-blue/5" />
      
      <div ref={ref} className="container px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            {/* Content */}
            <div>
              <div 
                className={cn(
                  "inline-flex items-center gap-2 px-4 py-2 bg-ink-blue/10 rounded-full mb-6 transition-all duration-700",
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                )}
              >
                <Sparkles className="w-4 h-4 text-ink-blue" />
                <span className="text-sm font-medium text-ink-blue">Marketing Pessoal</span>
              </div>

              <h2 
                className={cn(
                  "font-display text-2xl sm:text-3xl md:text-4xl text-foreground mb-6 transition-all duration-700 delay-100",
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                )}
              >
                {branding.title}
              </h2>

              <p 
                className={cn(
                  "text-muted-foreground text-base md:text-lg leading-relaxed mb-8 transition-all duration-700 delay-200",
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                )}
              >
                {branding.description}
              </p>
            </div>

            {/* Benefits List */}
            <div 
              className={cn(
                "bg-muted/30 rounded-2xl p-6 md:p-8 border border-border/30 transition-all duration-700 delay-300",
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"
              )}
            >
              <p className="text-sm font-medium text-muted-foreground mb-5 uppercase tracking-wide">
                {branding.subtitle}
              </p>
              <div className="space-y-4">
                {branding.items?.map((item: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-start gap-3"
                  >
                    <div className="w-5 h-5 rounded-full bg-ink-blue flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-foreground text-sm md:text-base">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
