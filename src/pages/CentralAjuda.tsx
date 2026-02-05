import { LandingNav } from "@/components/landing/LandingNav";
import { NelloGlobalFooter } from "@/components/global/NelloGlobalFooter";
import { SEOHead } from "@/components/SEOHead";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MessageCircle, HelpCircle, BookOpen, Compass } from "lucide-react";

const CentralAjuda = () => {
  const { language } = useLanguage();
  const isEn = language === "en";

  const content = {
    pt: {
      title: "Central de Ajuda",
      subtitle: "Suporte, perguntas frequentes e orientações sobre o Nello Identity.",
      gettingStarted: {
        title: "Começando com o Nello",
        text: "O Nello Identity é uma jornada de autoconhecimento baseada em mapas integrados de desenvolvimento humano.",
        recommendations: [
          "Fazer os 7 mapas com calma",
          "Ler o Código da Essência como reflexão",
          "Usar os resultados como clareza, não como rótulo",
        ],
        recommendationsIntro: "Se você está começando agora, recomendamos:",
      },
      faq: {
        title: "Perguntas Frequentes",
        items: [
          {
            question: "O Nello é diagnóstico psicológico?",
            answer: "Não. É uma ferramenta reflexiva de autoconhecimento e não substitui acompanhamento clínico.",
          },
          {
            question: "Como acesso meu Código da Essência?",
            answer: "Após completar os mapas, o sistema gera sua síntese integrativa automaticamente na área do cliente.",
          },
          {
            question: "Posso usar isso em atendimentos profissionais?",
            answer: "Sim, como ferramenta complementar e educativa, respeitando sua prática.",
          },
          {
            question: "Preciso fazer todos os mapas?",
            answer: "O valor maior está na integração, mas cada mapa já traz insights úteis.",
          },
        ],
      },
      support: {
        title: "Precisa de ajuda?",
        text: "Se tiver dúvidas técnicas ou quiser falar com a equipe, entre em contato:",
        button: "Falar com suporte no WhatsApp",
      },
      disclaimer: "O Nello Identity é uma ferramenta de autoconhecimento e desenvolvimento humano. Não possui finalidade diagnóstica e não substitui avaliação psicológica clínica.",
    },
    en: {
      title: "Help Center",
      subtitle: "Support, frequently asked questions and guidance about Nello Identity.",
      gettingStarted: {
        title: "Getting Started with Nello",
        text: "Nello Identity is a self-knowledge journey based on integrated human development maps.",
        recommendations: [
          "Complete the 7 maps at your own pace",
          "Read the Essence Code as a reflection",
          "Use the results as clarity, not as a label",
        ],
        recommendationsIntro: "If you're just starting, we recommend:",
      },
      faq: {
        title: "Frequently Asked Questions",
        items: [
          {
            question: "Is Nello a psychological diagnosis?",
            answer: "No. It's a reflective self-knowledge tool and does not replace clinical care.",
          },
          {
            question: "How do I access my Essence Code?",
            answer: "After completing the maps, the system automatically generates your integrative synthesis in the client area.",
          },
          {
            question: "Can I use this in professional consultations?",
            answer: "Yes, as a complementary and educational tool, respecting your practice.",
          },
          {
            question: "Do I need to complete all maps?",
            answer: "The greatest value is in the integration, but each map already provides useful insights.",
          },
        ],
      },
      support: {
        title: "Need help?",
        text: "If you have technical questions or want to talk to our team, get in touch:",
        button: "Talk to support on WhatsApp",
      },
      disclaimer: "Nello Identity is a self-knowledge and human development tool. It has no diagnostic purpose and does not replace clinical psychological evaluation.",
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
      <section className="pt-32 pb-16 px-6">
        <div className="container max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
            <HelpCircle className="w-4 h-4" />
            <span className="text-sm font-medium">{isEn ? "Support" : "Suporte"}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            {t.title}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>
      </section>

      {/* Getting Started */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="container max-w-4xl mx-auto">
          <Card className="border-primary/20">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Compass className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-serif font-bold text-foreground mb-4">
                    {t.gettingStarted.title}
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    {t.gettingStarted.text}
                  </p>
                  <p className="text-foreground font-medium mb-3">
                    {t.gettingStarted.recommendationsIntro}
                  </p>
                  <ul className="space-y-2">
                    {t.gettingStarted.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2 text-muted-foreground">
                        <span className="text-primary mt-1">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-6">
        <div className="container max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <BookOpen className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-serif font-bold text-foreground">
              {t.faq.title}
            </h2>
          </div>
          <Accordion type="single" collapsible className="space-y-3">
            {t.faq.items.map((item, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border border-border rounded-xl px-6 bg-background"
              >
                <AccordionTrigger className="text-left font-medium hover:no-underline py-5">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Support */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="container max-w-4xl mx-auto text-center">
          <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto mb-6">
            <MessageCircle className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-foreground mb-4">
            {t.support.title}
          </h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            {t.support.text}
          </p>
          <Button asChild size="lg" className="gap-2">
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="w-5 h-5" />
              {t.support.button}
            </a>
          </Button>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-12 px-6 border-t border-border">
        <div className="container max-w-4xl mx-auto">
          <p className="text-sm text-muted-foreground text-center italic">
            "{t.disclaimer}"
          </p>
        </div>
      </section>

      <NelloGlobalFooter currentApp="identity" />
    </div>
  );
};

export default CentralAjuda;
