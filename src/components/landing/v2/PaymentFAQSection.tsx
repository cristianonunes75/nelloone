import { useLanguage } from "@/contexts/LanguageContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CreditCard, Shield, Clock, HelpCircle } from "lucide-react";

const getFAQData = (language: string) => {
  const isEn = language === 'en';
  
  return [
    {
      question: isEn ? "What payment methods are accepted?" : "Quais formas de pagamento são aceitas?",
      answer: isEn 
        ? "We accept credit cards (Visa, Mastercard, American Express), debit cards, and Pix (Brazil only). All payments are processed securely via Stripe."
        : "Aceitamos cartões de crédito (Visa, Mastercard, American Express), cartões de débito e Pix. Todos os pagamentos são processados de forma segura via Stripe.",
      icon: CreditCard,
    },
    {
      question: isEn ? "Is my payment secure?" : "Meu pagamento é seguro?",
      answer: isEn
        ? "Yes! All transactions are encrypted and processed through Stripe, a PCI-compliant payment processor used by millions of businesses worldwide."
        : "Sim! Todas as transações são criptografadas e processadas através do Stripe, um processador de pagamentos certificado PCI usado por milhões de empresas no mundo.",
      icon: Shield,
    },
    {
      question: isEn ? "How does the 7-day guarantee work?" : "Como funciona a garantia de 7 dias?",
      answer: isEn
        ? "If you're not satisfied within 7 days of purchase, contact us and we'll provide a full refund. No questions asked."
        : "Se você não estiver satisfeito em até 7 dias após a compra, entre em contato e faremos o reembolso integral. Sem perguntas.",
      icon: Clock,
    },
    {
      question: isEn ? "Can I pay in installments?" : "Posso parcelar?",
      answer: isEn
        ? "Yes! You can pay in up to 12 interest-free installments using your credit card."
        : "Sim! Você pode parcelar em até 12x sem juros no cartão de crédito.",
      icon: HelpCircle,
    },
  ];
};

export const PaymentFAQSection = () => {
  const { language } = useLanguage();
  const faqs = getFAQData(language);
  const isEn = language === 'en';

  return (
    <div className="mt-12 max-w-2xl mx-auto">
      <h3 className="text-lg font-semibold text-center mb-6">
        {isEn ? "Payment FAQ" : "Dúvidas sobre Pagamento"}
      </h3>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`} className="border-border/50">
            <AccordionTrigger className="text-left hover:no-underline">
              <div className="flex items-center gap-3">
                <faq.icon className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-sm">{faq.question}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground pl-7">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
