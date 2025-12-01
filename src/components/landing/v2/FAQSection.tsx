import { useLanguage } from "@/contexts/LanguageContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, DollarSign, Globe } from "lucide-react";

export function FAQSection() {
  const { t, language } = useLanguage();
  const faq = (t.landing as any).faq;

  if (!faq) return null;

  const faqItems = [
    {
      key: "pricing",
      icon: DollarSign,
      question: faq.pricing?.question,
      answer: faq.pricing?.answer,
    },
    {
      key: "currency",
      icon: Globe,
      question: faq.currency?.question,
      answer: faq.currency?.answer,
    },
  ].filter(item => item.question && item.answer);

  if (faqItems.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container px-4 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
            <HelpCircle className="w-7 h-7 text-primary" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            {faq.title}
          </h2>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqItems.map((item, index) => (
            <AccordionItem
              key={item.key}
              value={item.key}
              className="bg-background border border-border rounded-xl px-6 shadow-sm"
            >
              <AccordionTrigger className="py-5 text-left hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-medium text-foreground text-base md:text-lg">
                    {item.question}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-5 pl-13">
                <p className="text-muted-foreground leading-relaxed pl-13 ml-13">
                  {item.answer}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Currency Protection Notice */}
        <div className="mt-8 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
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
