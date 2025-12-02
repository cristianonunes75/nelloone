import { useLanguage } from "@/contexts/LanguageContext";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

export function FAQSection() {
  const { t, language } = useLanguage();
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const faq = (t.landing as any).faq;

  if (!faq) return null;

  // Use the new items array if available, otherwise fallback to old structure
  const faqItems = faq.items || [
    { question: faq.pricing?.question, answer: faq.pricing?.answer },
    { question: faq.currency?.question, answer: faq.currency?.answer },
  ].filter(item => item.question && item.answer);

  if (faqItems.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div ref={ref} className="container px-4 max-w-4xl mx-auto">
        <div 
          className={cn(
            "text-center mb-12 transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          )}
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-ink-blue/10 mb-4">
            <HelpCircle className="w-7 h-7 text-ink-blue" />
          </div>
          <h2 className="font-display text-2xl md:text-3xl lg:text-4xl text-foreground mb-3">
            {faq.title}
          </h2>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqItems.map((item: any, index: number) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className={cn(
                "bg-background border border-border/50 rounded-xl px-6 shadow-sm transition-all duration-500",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
              )}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <AccordionTrigger className="py-5 text-left hover:no-underline">
                <span className="font-medium text-foreground text-sm md:text-base pr-4">
                  {item.question}
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-5">
                <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                  {item.answer}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Currency Protection Notice */}
        <div 
          className={cn(
            "mt-8 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl transition-all duration-700 delay-500",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          )}
        >
          <p className="text-sm text-center text-amber-700 dark:text-amber-300">
            {language === 'en' 
              ? '🔒 Your region: Global (USD). Prices are shown in US Dollars.'
              : '🔒 Sua região: Brasil (BRL). Preços exibidos em Reais.'
            }
          </p>
        </div>
      </div>
    </section>
  );
}
