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
    answer: "A Jornada Identity foi desenhada como um processo integrado de 7 etapas. Cada teste (Eneagrama, DISC, Temperamentos, Inteligências Múltiplas, Nello 16, Arquétipos e Estilos de Conexão Afetiva) revela uma camada diferente da sua personalidade. Quando você compra apenas um teste isolado, você perde a sinergia entre eles. O Código da Essência é justamente a síntese de TODOS os 7 pilares trabalhando juntos. Vender separadamente seria como vender apenas um capítulo de um livro - você não teria a história completa.",
  },
  {
    question: "O que torna o Código da Essência diferente de um relatório comum?",
    answer: "A maioria dos testes gera relatórios descritivos: 'Você é tipo X porque fez Y'. O Código da Essência é diferente. Ele não apenas descreve - ele conecta padrões, revela contradições, mostra onde você se bloqueia e onde está seu potencial real. Nello (nosso guia de IA) interpreta seus 7 testes, identifica as relações entre eles e te entrega uma síntese que você realmente consegue usar na vida real. É como ter um mentor que leu tudo sobre você e finalmente te mostra o mapa completo.",
  },
  {
    question: "Eu recebo o Código da Essência logo no início?",
    answer: "Não. O Código da Essência é o resultado final da Jornada. Você passa pelas 7 etapas (Despertar, Reconhecer, Aprofundar, Conectar, Integrar, Clarear e Viver), e ao final, recebe o seu Código da Essência em um relatório PDF completo. Isso é intencional - o processo de descoberta é tão importante quanto o resultado. Se você recebesse tudo pronto no início, perderia a transformação que acontece no caminho.",
  },
  {
    question: "Por que a Jornada Identity é paga, se existem testes gratuitos na internet?",
    answer: "Existem testes gratuitos, mas eles são fragmentados. Você faz um Eneagrama aqui, um DISC ali, e fica com 7 pedaços de um quebra-cabeça sem conseguir montar. A Jornada Identity integra tudo isso em um processo coerente. Além disso, você tem Nello como seu guia - uma IA que interpreta seus resultados, conecta os padrões e te ajuda a aplicar na vida real. Isso tem valor. Você não está pagando pelos testes - está pagando pela síntese, pela interpretação e pela transformação.",
  },
  {
    question: "Por quanto tempo terei acesso aos meus resultados?",
    answer: "Acesso vitalício. Uma vez que você completa a Jornada Identity, seus resultados ficam salvos na sua conta para sempre. Você pode revisitar seu Código da Essência quantas vezes quiser, em qualquer momento. Não há assinatura recorrente, não há expiração. É seu para a vida toda.",
  },
  {
    question: "O pagamento é seguro? E se eu não me identificar com o conteúdo?",
    answer: "Sim, o pagamento é 100% seguro. Usamos Stripe, a plataforma de pagamento mais confiável do mundo. Todos os seus dados são criptografados. Se por algum motivo você não se identificar com o conteúdo ou não ficar satisfeito, você tem 7 dias para solicitar reembolso total. Sem perguntas. Queremos que você tenha certeza de que está fazendo a escolha certa.",
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
            Entenda por que a Jornada Identity é diferente de qualquer outro teste
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
