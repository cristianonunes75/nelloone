import { HelpCircle } from "lucide-react";
import { CrossDivider } from "./CrossDivider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface FAQItem {
  question: string;
  answer: string;
}

const DEFAULT_FAQ_ITEMS: FAQItem[] = [
  {
    question: "Isso é um teste psicológico ou diagnóstico clínico?",
    answer: "Não. O Identity é uma ferramenta de autoconhecimento e reflexão. Ele oferece clareza sobre tendências e padrões do momento, mas não constitui diagnóstico psicológico ou avaliação clínica. Os resultados descrevem como você está hoje — e podem mudar com o tempo e com o desenvolvimento pessoal. Para questões de saúde mental, recomenda-se acompanhamento profissional qualificado.",
  },
  {
    question: "Por que não posso comprar apenas um dos mapas separadamente?",
    answer: "A Jornada Identity foi desenhada como um processo integrado de 7 etapas. Cada mapa revela uma camada diferente de como você está hoje. Quando isolados, eles perdem a sinergia entre si. O Código da Essência é justamente a síntese de todos os 7 mapas trabalhando juntos — oferecer apenas um seria como entregar um capítulo de um livro sem o restante da história.",
  },
  {
    question: "O que torna o Código da Essência diferente de um relatório comum?",
    answer: "A maioria dos testes gera relatórios descritivos. O Código da Essência é diferente: ele conecta padrões, aponta pontos de atenção e mostra forças disponíveis nesta fase da sua vida. O resultado é uma síntese prática que você consegue usar no dia a dia — nas decisões, nas relações e nos seus próximos passos.",
  },
  {
    question: "Eu recebo o Código da Essência logo no início?",
    answer: "Não. O Código da Essência é o resultado final da Jornada. Você passa pelas 7 etapas no seu ritmo, e ao final recebe o relatório completo em PDF. Isso é intencional: o processo de reflexão em cada camada é tão importante quanto o resultado final.",
  },
  {
    question: "Por que a Jornada Identity é paga, se existem testes gratuitos na internet?",
    answer: "Existem testes gratuitos, mas eles são fragmentados. Você faz um aqui, outro ali, e fica com peças soltas de um quebra-cabeça. A Jornada Identity integra 7 mapas em um processo coerente, com uma síntese final que conecta tudo. Você não está pagando pelos mapas isolados — está pagando pela integração, pela organização e pela clareza prática.",
  },
  {
    question: "Como vou usar isso na prática depois?",
    answer: "Você recebe um relatório final com reflexões práticas, pontos de atenção e um plano orientativo de 90 dias. Muitas pessoas usam como apoio para decisões, autoconhecimento e conversas mais profundas — inclusive em contextos profissionais. Sempre como ferramenta reflexiva, sem caráter clínico.",
  },
  {
    question: "Por quanto tempo terei acesso aos meus resultados?",
    answer: "Acesso vitalício. Uma vez que você completa a Jornada, seus resultados ficam salvos na sua conta para sempre. Você pode revisitar seu Código da Essência quantas vezes quiser. Não há assinatura recorrente nem expiração.",
  },
  {
    question: "O pagamento é seguro?",
    answer: "Sim, 100% seguro. Usamos Stripe, uma das plataformas de pagamento mais confiáveis do mundo. Todos os seus dados são criptografados. Se não ficar satisfeito, você tem 7 dias para solicitar reembolso total.",
  },
];

export const StrategicFAQ = () => {
  const { t } = useLanguage();
  
  // Get translated FAQ items or use defaults
  const faqSection = t.landing.faq_strategic || {};
  const faqItems: FAQItem[] = faqSection.items || DEFAULT_FAQ_ITEMS;
  const title = faqSection.title || "Perguntas Frequentes";
  const subtitle = faqSection.subtitle || "Tire suas dúvidas sobre a Jornada Identity";

  return (
    <section className="py-16 md:py-24 px-5 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-nello-gold/10 mb-4">
            <HelpCircle className="w-6 h-6 text-nello-gold" strokeWidth={1.5} />
          </div>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground mb-3">
            {title}
          </h2>
          <CrossDivider className="mb-4" />
          <p className="text-base text-foreground/70 max-w-xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Accordion */}
        <Accordion type="single" collapsible className="space-y-3">
          {faqItems.map((item, index) => (
            <AccordionItem
              key={index}
              value={`faq-${index}`}
              className={cn(
                "bg-background border border-border/50 rounded-xl px-5 md:px-6 shadow-sm",
                "transition-all duration-300 hover:border-nello-gold/30"
              )}
            >
              <AccordionTrigger className="py-5 text-left hover:no-underline group">
                <span className="font-medium text-foreground text-sm md:text-base pr-4 group-hover:text-nello-gold transition-colors">
                  {item.question}
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-5">
                <p className="text-foreground/70 leading-relaxed text-sm md:text-base">
                  {item.answer}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
