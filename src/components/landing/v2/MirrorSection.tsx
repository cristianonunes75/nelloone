import { useLanguage } from "@/contexts/LanguageContext";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export const MirrorSection = () => {
  const { t } = useLanguage();
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const mirror = (t.landing as any).mirror;

  if (!mirror) return null;

  return (
    <section className="py-16 md:py-24 bg-muted/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bruma-blue/5 to-transparent" />
      
      <div ref={ref} className="container px-4 md:px-6 relative z-10">
        <div className="max-w-3xl mx-auto">
          <h2 
            className={cn(
              "font-display text-xl sm:text-2xl md:text-3xl text-center text-foreground mb-10 md:mb-12 transition-all duration-700",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}
          >
            {mirror.title}
          </h2>

          <div className="grid gap-3 md:gap-4">
            {mirror.items?.map((item: string, index: number) => (
              <div
                key={index}
                className={cn(
                  "flex items-start gap-4 p-4 md:p-5 bg-background rounded-xl border border-border/50 shadow-sm transition-all duration-500",
                  isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6",
                )}
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                <div className="w-6 h-6 rounded-full bg-ink-blue/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-ink-blue" />
                </div>
                <span className="text-foreground/90 text-sm md:text-base leading-relaxed">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
