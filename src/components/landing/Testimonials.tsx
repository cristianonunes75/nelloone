import { Card } from "@/components/ui/card";
import { Quote } from "lucide-react";
import { useHomeContent } from "@/hooks/useHomeContent";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";

export const Testimonials = () => {
  const { content, isLoading } = useHomeContent("testimonials");
  const { language } = useLanguage();
  
  const isEn = language === 'en';

  if (isLoading) {
    return (
      <section className="py-24 bg-background">
        <div className="container px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <Skeleton className="h-12 w-1/2 mx-auto mb-6" />
              <Skeleton className="h-6 w-3/4 mx-auto" />
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-48 rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  const testimonials = (content?.content as any)?.items || [];
  
  return (
    <section className="py-24 bg-background">
      <div className="container px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {isEn ? 'What people say about' : 'O que dizem sobre o'} <span className="text-gold">NELLO ONE</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {(content?.content as any)?.description || 
                (isEn 
                  ? "Real stories from people who discovered their true essence."
                  : "Histórias reais de pessoas que descobriram sua verdadeira essência.")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial: any, index: number) => (
              <Card 
                key={index}
                className="p-8 hover:shadow-xl transition-shadow duration-300 border-border/50"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="text-5xl">{testimonial.image}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                  <Quote className="w-8 h-8 text-gold/30" />
                </div>
                <p className="text-muted-foreground leading-relaxed italic">
                  "{testimonial.text}"
                </p>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground">
              {isEn 
                ? 'Ready to start your transformation journey?'
                : 'Pronto para iniciar sua jornada de transformação?'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};