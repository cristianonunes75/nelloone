import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "O que são arquétipos e como eles me ajudam?",
    answer: "Arquétipos são padrões universais de comportamento e personalidade. No Essentia, usamos a análise de arquétipos para identificar como você se comunica naturalmente e qual imagem reflete melhor sua essência. Isso orienta desde a escolha de roupas até a postura na sessão fotográfica.",
  },
  {
    question: "Preciso ser católico para participar?",
    answer: "Não! O Essentia é para todos que buscam uma conexão mais profunda entre imagem e propósito. Nossa abordagem respeita valores cristãos de verdade e autenticidade, mas acolhemos pessoas de todas as crenças que se identificam com essa visão.",
  },
  {
    question: "As fotos são minhas? Posso usar onde quiser?",
    answer: "Sim! Todas as fotos editadas são suas e você pode usá-las livremente em redes sociais, sites, materiais impressos, eventos e apresentações. No plano promocional, solicitamos autorização para uso das imagens em mockups de divulgação do Essentia, sempre preservando sua privacidade.",
  },
  {
    question: "Como funciona o pagamento?",
    answer: "Aceitamos Pix (desconto à vista), cartão de crédito (até 3x sem juros no plano completo) e boleto bancário. O pagamento é 100% seguro via Mercado Pago ou Stripe. Após a confirmação, você recebe acesso imediato à plataforma e pode agendar sua sessão.",
  },
  {
    question: "Quanto tempo leva para receber as fotos?",
    answer: "Os testes ficam disponíveis imediatamente após a conclusão. A sessão fotográfica é agendada conforme disponibilidade (presencial ou locação). As fotos editadas são entregues em até 15 dias úteis após a sessão, com prévia disponível em 7 dias.",
  },
  {
    question: "Posso fazer os testes sem a sessão fotográfica?",
    answer: "Sim! Oferecemos o Pacote Testes (9 testes completos) e também testes individuais. São opções perfeitas para quem quer começar pelo autoconhecimento antes de investir na fotografia.",
  },
  {
    question: "A oferta promocional é limitada?",
    answer: "Sim! Os valores promocionais são exclusivos para os primeiros 100 clientes cadastrados. Após esse limite, os preços voltam ao valor regular. Não perca essa oportunidade!",
  },
  {
    question: "Posso fazer a sessão em outro local?",
    answer: "Sim! Oferecemos sessões em nosso estúdio (São Paulo) e também fazemos sessões em locação conforme disponibilidade. O local pode ser escolhido de acordo com seu perfil e preferências identificados nos testes.",
  },
];

export const FAQ = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Perguntas <span className="text-gold">Frequentes</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Tire suas dúvidas sobre o Essentia
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
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
              href="https://wa.me/5511999999999"
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
