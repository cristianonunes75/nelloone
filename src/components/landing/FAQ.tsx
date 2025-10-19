import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useHomeContent } from "@/hooks/useHomeContent";
import { Skeleton } from "@/components/ui/skeleton";

export const FAQ = () => {
  const { content, isLoading } = useHomeContent("faq");

  if (isLoading) {
    return (
      <section className="py-24 bg-background">
        <div className="container px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <Skeleton className="h-12 w-1/2 mx-auto mb-6" />
              <Skeleton className="h-6 w-1/3 mx-auto" />
            </div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  const faqs = (content?.content as any)?.items || [];
  const whatsapp = (content?.content as any)?.whatsapp || "5511999999999";
  return (
    <section className="py-24 bg-background">
      <div className="container px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {content?.title || "Perguntas"} <span className="text-gold">Frequentes</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              {(content?.content as any)?.description || "Tire suas dúvidas sobre o Essentia"}
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq: any, index: number) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-border rounded-2xl px-6 bg-accent/10"
              >
                <AccordionTrigger className="text-left font-semibold hover:no-underline py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              Ainda tem dúvidas?
            </p>
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold font-semibold hover:underline"
            >
              Fale conosco no WhatsApp →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
