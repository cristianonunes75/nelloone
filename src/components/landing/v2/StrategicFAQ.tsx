import { HelpCircle } from "lucide-react";
import { CrossDivider } from "./CrossDivider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

const faqItems = [
  {
    question: "Por que não posso comprar apenas um dos testes separadamente?",
    answer: "Porque a verdade sobre quem você é não está em um único teste. O Nello Identity não é uma prateleira de testes, mas um processo de síntese. O Código da Essência só é revelado quando cruzamos as 7 camadas da sua personalidade. Vender um teste isolado seria te entregar apenas uma peça de um quebra-cabeça de 1000 peças.",
  },
  {
    question: "O que torna o Código da Essência diferente de um relatório comum?",
    answer: "Relatórios comuns dizem \"o que\" você é. O Código da Essência explica \"como\" suas características interagem. Ele revela, por exemplo, por que sua forma de agir (DISC) às vezes entra em conflito com seus valores profundos (Eneagrama). É a única ferramenta que integra comportamento, emoção, motivação e propósito em um único mapa de navegação pessoal.",
  },
  {
    question: "Eu recebo o Código da Essência logo no início?",
    answer: "O Código da Essência é construído em tempo real enquanto você caminha. A cada etapa concluída, o Nello (seu guia) adiciona uma nova camada de profundidade à sua análise. Ao final da 7ª etapa, o sistema consolida tudo, entregando a visão completa e definitiva da sua estrutura humana.",
  },
  {
    question: "Por que o Nello Identity é pago, se existem testes gratuitos na internet?",
    answer: "Testes gratuitos entregam rótulos isolados e genéricos. O Nello Identity é uma plataforma de inteligência comportamental. Nós não apenas aplicamos os testes, mas cruzamos os dados entre eles usando uma lógica proprietária. Você não paga por um teste, paga pela integração dos resultados e pela clareza de como cada parte da sua personalidade influencia a outra.",
  },
  {
    question: "Por quanto tempo terei acesso aos meus resultados?",
    answer: "O acesso à sua área de membro e aos seus relatórios é vitalício. Você poderá baixar seu Código da Essência em PDF e revisitar seus insights sempre que precisar tomar uma decisão importante ou recalibrar sua rota pessoal e profissional.",
  },
  {
    question: "O pagamento é seguro? E se eu não me identificar com o conteúdo?",
    answer: "Sim, utilizamos o Stripe, uma das plataformas de pagamento mais seguras do mundo. Além disso, você tem a nossa Garantia Incondicional de 7 dias. Se por qualquer motivo você sentir que a jornada não agregou valor à sua vida, basta solicitar o reembolso total dentro desse período.",
  },
];

export const StrategicFAQ = () => {
  return (
    <section className="py-16 md:py-24 px-5 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-nello-gold/10 mb-4">
            <HelpCircle className="w-6 h-6 text-nello-gold" strokeWidth={1.5} />
          </div>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground mb-3">
            Perguntas Frequentes
          </h2>
          <CrossDivider className="mb-4" />
          <p className="text-base text-foreground/70 max-w-xl mx-auto">
            Entenda por que o Nello Identity é diferente de qualquer outro teste
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
