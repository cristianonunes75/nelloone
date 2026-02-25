import { LandingNav } from "@/components/landing/LandingNav";
import { NelloGlobalFooter } from "@/components/global/NelloGlobalFooter";
import { SEOHead } from "@/components/SEOHead";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MessageCircle, Heart, Compass, Shield } from "lucide-react";
import { FaithFAQSection } from "@/components/FaithFAQSection";

const CentralAjuda = () => {
  const { language } = useLanguage();
  const isEn = language === "en";

  const content = {
    pt: {
      title: "Central de Ajuda Identity",
      subtitle: "Orientações, dúvidas e apoio para sua jornada de autoconhecimento.",
      onboarding: {
        title: "Começando sua jornada",
        items: [
          "Não existem respostas certas ou erradas.",
          "O Identity não avalia você — ele revela.",
          "A leitura mostra padrões, não rótulos.",
          "Você pode responder no seu ritmo, sem pressa.",
          "A experiência foi criada para gerar clareza, não julgamento.",
        ],
      },
      journey: {
        title: "Como funciona a jornada",
        text: "A leitura acontece em etapas naturais. Cada mapa revela uma dimensão diferente de quem você é — seu modo de agir, sua energia interior, seus talentos naturais. Não é necessário entender tudo imediatamente. Os resultados ganham sentido conforme a jornada avança, e cada nova camada ilumina as anteriores.",
      },
      faq: {
        title: "Perguntas Frequentes",
        items: [
          {
            question: "O Identity é diagnóstico psicológico?",
            answer: "Não. O Identity é uma ferramenta de autoconhecimento e reflexão pessoal. Ele não substitui acompanhamento clínico, terapia ou qualquer avaliação profissional de saúde mental.",
          },
          {
            question: "Preciso responder todos os mapas?",
            answer: "O maior valor está na integração entre os mapas, mas cada um já traz insights valiosos por si só. Você pode avançar no seu ritmo — não há obrigação nem prazo.",
          },
          {
            question: "Existe resposta certa ou errada?",
            answer: "Não. Cada resposta reflete uma tendência natural sua. Não há certo ou errado — apenas diferentes formas de ser e agir no mundo.",
          },
          {
            question: "Posso usar os resultados profissionalmente?",
            answer: "Sim. Os resultados podem ser usados como ferramenta complementar em contextos educativos, de coaching ou desenvolvimento humano, respeitando sempre a sua prática profissional.",
          },
          {
            question: "Meus dados são seguros?",
            answer: "Sim. Seus dados são protegidos e tratados com total sigilo. Você pode solicitar a exclusão completa dos seus dados a qualquer momento pela área de privacidade da sua conta.",
          },
          {
            question: "Quanto tempo leva a leitura?",
            answer: "Cada mapa leva entre 5 e 15 minutos. Você pode pausar e retomar quando quiser — a jornada respeita o seu tempo.",
          },
          {
            question: "Posso refazer depois?",
            answer: "A leitura captura um momento. Refazê-la pode trazer novas percepções, especialmente em fases diferentes da vida.",
          },
        ],
      },
      support: {
        title: "Estamos aqui por você",
        text: "Se precisar de orientação ou tiver qualquer dúvida, nossa equipe está disponível para ajudar.",
        button: "Conversar com a equipe Identity",
      },
      disclaimerIntro: "Para sua segurança e clareza:",
      disclaimer: "O Identity Nello One é uma ferramenta de autoconhecimento e desenvolvimento pessoal. Não substitui diagnóstico psicológico ou acompanhamento terapêutico.",
    },
    en: {
      title: "Identity Help Center",
      subtitle: "Guidance, answers, and support for your self-knowledge journey.",
      onboarding: {
        title: "Beginning your journey",
        items: [
          "There are no right or wrong answers.",
          "Identity doesn't judge you — it reveals.",
          "The reading shows patterns, not labels.",
          "You can answer at your own pace, without rush.",
          "The experience was designed to bring clarity, not judgment.",
        ],
      },
      journey: {
        title: "How the journey works",
        text: "The reading unfolds in natural stages. Each map reveals a different dimension of who you are — your way of acting, your inner energy, your natural strengths. You don't need to understand everything right away. The results gain meaning as the journey progresses, and each new layer illuminates the ones before.",
      },
      faq: {
        title: "Frequently Asked Questions",
        items: [
          {
            question: "Is Identity a psychological diagnosis?",
            answer: "No. Identity is a self-knowledge and personal reflection tool. It does not replace clinical care, therapy, or any professional mental health evaluation.",
          },
          {
            question: "Do I need to complete all maps?",
            answer: "The greatest value lies in the integration between maps, but each one already brings valuable insights on its own. You can move at your own pace — there's no obligation or deadline.",
          },
          {
            question: "Are there right or wrong answers?",
            answer: "No. Each answer reflects a natural tendency of yours. There's no right or wrong — just different ways of being and acting in the world.",
          },
          {
            question: "Can I use the results professionally?",
            answer: "Yes. The results can be used as a complementary tool in educational, coaching, or human development contexts, always respecting your professional practice.",
          },
          {
            question: "Is my data secure?",
            answer: "Yes. Your data is protected and treated with complete confidentiality. You can request full deletion of your data at any time through the privacy section of your account.",
          },
          {
            question: "How long does the reading take?",
            answer: "Each map takes between 5 and 15 minutes. You can pause and resume whenever you want — the journey respects your time.",
          },
          {
            question: "Can I redo it later?",
            answer: "The reading captures a moment. Redoing it can bring new perceptions, especially in different phases of life.",
          },
        ],
      },
      support: {
        title: "We're here for you",
        text: "If you need guidance or have any questions, our team is available to help.",
        button: "Talk to the Identity team",
      },
      disclaimerIntro: "For your safety and clarity:",
      disclaimer: "Identity Nello One is a self-knowledge and personal development tool. It does not replace psychological diagnosis or therapeutic care.",
    },
  };

  const t = isEn ? content.en : content.pt;
  const whatsappLink = "https://wa.me/5561992430090";

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={isEn ? "Help Center | Nello Identity" : "Central de Ajuda | Nello Identity"}
        description={t.subtitle}
      />
      <LandingNav />

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="container max-w-3xl mx-auto text-center">
          <h1 className="font-display text-3xl md:text-5xl text-foreground mb-5 leading-tight">
            {t.title}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>
        </div>
      </section>

      {/* Onboarding Humano */}
      <section className="py-16 md:py-20 px-6">
        <div className="container max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary" />
            </div>
            <h2 className="font-display text-2xl md:text-3xl text-foreground">
              {t.onboarding.title}
            </h2>
          </div>
          <ul className="space-y-4 pl-1">
            {t.onboarding.items.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-muted-foreground leading-relaxed text-base md:text-lg">
                <span className="text-primary/60 mt-1.5 text-xs">●</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Como funciona a jornada */}
      <section className="py-16 md:py-20 px-6 bg-muted/20">
        <div className="container max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Compass className="w-5 h-5 text-primary" />
            </div>
            <h2 className="font-display text-2xl md:text-3xl text-foreground">
              {t.journey.title}
            </h2>
          </div>
          <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
            {t.journey.text}
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-20 px-6">
        <div className="container max-w-3xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl text-foreground mb-10 text-center">
            {t.faq.title}
          </h2>
          <Accordion type="single" collapsible className="space-y-3">
            {t.faq.items.map((item, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border border-border/40 rounded-xl px-6 bg-background/80"
              >
                <AccordionTrigger className="text-left font-medium hover:no-underline py-5 text-sm md:text-base">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 leading-relaxed text-sm md:text-base">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Faith FAQ */}
          <div className="mt-12">
            <FaithFAQSection />
          </div>
        </div>
      </section>

      {/* Suporte Humano */}
      <section className="py-20 md:py-24 px-6 bg-muted/20">
        <div className="container max-w-3xl mx-auto text-center">
          <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto mb-6">
            <MessageCircle className="w-7 h-7 text-primary" />
          </div>
          <h2 className="font-display text-2xl md:text-3xl text-foreground mb-4">
            {t.support.title}
          </h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto leading-relaxed text-base md:text-lg">
            {t.support.text}
          </p>
          <Button asChild size="lg" className="gap-2 rounded-full px-8">
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="w-5 h-5" />
              {t.support.button}
            </a>
          </Button>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-14 px-6 border-t border-border/30">
        <div className="container max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-muted-foreground/60" />
            <span className="text-sm text-muted-foreground/80 font-medium">{t.disclaimerIntro}</span>
          </div>
          <p className="text-sm text-muted-foreground/70 italic leading-relaxed">
            "{t.disclaimer}"
          </p>
        </div>
      </section>

      <NelloGlobalFooter currentApp="identity" />
    </div>
  );
};

export default CentralAjuda;
