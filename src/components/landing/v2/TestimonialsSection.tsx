import { Star, Quote } from "lucide-react";
import { useScrollAnimation, getStaggerDelay } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { TESTIMONIAL_DISCLAIMER } from "@/lib/compliance/testimonialCompliance";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { checkTestimonialCompliance } from "@/lib/compliance/testimonialCompliance";

export const TestimonialsSection = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: cardsRef, isVisible: cardsVisible } = useScrollAnimation();

  const { data: testimonials } = useQuery({
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
            role: profile?.profession || "Usuário Identity",
            content: t.content,
            rating: 5,
          };
        });
    },
    staleTime: 1000 * 60 * 5,
  });

  // Hide section entirely if no real testimonials
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="py-12 md:py-20 bg-muted/20">
      <div className="container px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Section header */}
          <div ref={headerRef} className="text-center mb-8 md:mb-12">
            <h2
              className={cn(
                "font-display text-2xl sm:text-3xl text-foreground mb-3 transition-all duration-500",
                headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              Experiências reais
            </h2>
            <p
              className={cn(
                "text-xs text-muted-foreground/70 max-w-xl mx-auto transition-all duration-500 delay-100",
                headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              {TESTIMONIAL_DISCLAIMER.pt}
            </p>
          </div>

          {/* Testimonials */}
          <div
            ref={cardsRef}
            className="flex md:grid md:grid-cols-3 gap-4 md:gap-6 overflow-x-auto pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory md:snap-none scrollbar-hide"
          >
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.name + index}
                className={cn(
                  "bg-card rounded-xl p-4 md:p-6 border border-border/30 shadow-soft hover:shadow-medium transition-all duration-300 min-w-[280px] md:min-w-0 snap-center flex-shrink-0 md:flex-shrink",
                  cardsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                )}
                style={cardsVisible ? getStaggerDelay(index, 0.15) : {}}
              >
                <Quote className="w-6 h-6 text-muted-foreground/30 mb-3" strokeWidth={1.5} />
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
                      <Star key={i} className="w-3 h-3 md:w-3.5 md:h-3.5 text-foreground/40 fill-foreground/40" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
