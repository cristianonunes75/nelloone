import { useLanguage } from "@/contexts/LanguageContext";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Users, 
  MessageSquare, 
  Brain, 
  TrendingUp, 
  AlertTriangle,
  Heart,
  Handshake,
  HelpCircle,
  ExternalLink
} from "lucide-react";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingFooter } from "@/components/landing/LandingFooter";

const content = {
  pt: {
    hero: {
      title: "Uma ferramenta complementar para profissionais que acompanham pessoas",
      subtitle: "Clareza estruturada, linguagem e mapas integrados para enriquecer processos de desenvolvimento humano.",
      description: "O Nello Identity foi criado para apoiar o autoconhecimento com responsabilidade, oferecendo uma leitura integrativa de padrões emocionais, comportamentais e relacionais.",
      note: "Ele não substitui o trabalho profissional.\nEle fortalece conversas, amplia consciência e organiza temas recorrentes.",
      cta: "Conhecer os 7 Mapas"
    },
    whyHelps: {
      title: "Um recurso de apoio, não um diagnóstico",
      description: "Muitos profissionais utilizam frameworks de personalidade e mapas reflexivos para ajudar seus clientes a nomear padrões, compreender bloqueios e aprofundar o processo.",
      intro: "O Nello Identity pode apoiar atendimentos ao oferecer:",
      benefits: [
        "linguagem estruturada para conversas difíceis",
        "organização de padrões emocionais recorrentes",
        "clareza sobre forças e tendências comportamentais",
        "insights para tomada de decisão e maturidade",
        "uma visão integrada que facilita perguntas melhores"
      ],
      closing: "Sempre como ferramenta complementar, educativa e ética."
    },
    applications: {
      title: "Aplicações comuns",
      cards: [
        {
          icon: "Users",
          title: "Pré processo",
          description: "Clientes chegam confusos. O Nello ajuda a organizar temas antes de iniciar um acompanhamento."
        },
        {
          icon: "MessageSquare",
          title: "Apoio de linguagem",
          description: "O relatório oferece palavras e mapas que facilitam conversas profundas."
        },
        {
          icon: "Brain",
          title: "Consciência de padrões",
          description: "O cliente reconhece repetições emocionais e comportamentais com mais clareza."
        },
        {
          icon: "TrendingUp",
          title: "Desenvolvimento e direção",
          description: "O foco é amadurecimento, não rotulação."
        }
      ]
    },
    whatIsNot: {
      title: "Importante",
      intro: "O Nello Identity não é:",
      items: [
        "avaliação psicológica clínica",
        "instrumento diagnóstico",
        "laudo profissional",
        "substituto de terapia ou acompanhamento especializado"
      ],
      closing: "É uma ferramenta de autoconhecimento e desenvolvimento humano, usada como apoio reflexivo."
    },
    ethics: {
      title: "Uso ético e complementar",
      paragraphs: [
        "O Nello respeita profundamente o trabalho de terapeutas e profissionais da escuta.",
        "Ele não compete com o acompanhamento.",
        "Ele pode funcionar como recurso adicional para enriquecer processos, ampliar consciência e gerar linguagem para transformação responsável.",
        "Se houver sofrimento emocional intenso ou necessidade clínica, o caminho recomendado é sempre o cuidado profissional habilitado."
      ]
    },
    partnership: {
      title: "Programa de parceria para profissionais",
      description: "Estamos construindo uma rede de profissionais que desejam oferecer aos seus clientes uma ferramenta complementar de autoconhecimento.",
      benefits: [
        "condições especiais",
        "materiais institucionais prontos",
        "suporte de aplicação ética",
        "possibilidade de recomendação estruturada"
      ],
      cta: "Quero saber mais sobre a parceria"
    },
    faq: {
      title: "Perguntas frequentes",
      items: [
        {
          question: "Isso substitui terapia?",
          answer: "Não. É um recurso complementar e reflexivo."
        },
        {
          question: "Posso usar com meus clientes?",
          answer: "Sim, como apoio educativo e linguagem estruturada, respeitando sua prática."
        },
        {
          question: "Isso é diagnóstico?",
          answer: "Não. Não possui finalidade clínica."
        },
        {
          question: "Existe parceria ou afiliados?",
          answer: "Sim. Estamos abrindo um programa para profissionais alinhados com essa visão."
        }
      ]
    },
    disclaimer: "O Nello Identity é uma ferramenta de autoconhecimento e desenvolvimento humano.\nNão substitui avaliação psicológica clínica ou acompanhamento terapêutico profissional.",
    mapsRoute: "/os-7-mapas"
  },
  en: {
    hero: {
      title: "A complementary tool for professionals who support people",
      subtitle: "Structured clarity, language and integrated maps to enrich human development processes.",
      description: "Nello Identity was created to support self-knowledge with responsibility, offering an integrative reading of emotional, behavioral and relational patterns.",
      note: "It does not replace professional work.\nIt strengthens conversations, expands awareness and organizes recurring themes.",
      cta: "Discover the 7 Maps"
    },
    whyHelps: {
      title: "A support resource, not a diagnosis",
      description: "Many professionals use personality frameworks and reflective maps to help their clients name patterns, understand blocks and deepen the process.",
      intro: "Nello Identity can support sessions by offering:",
      benefits: [
        "structured language for difficult conversations",
        "organization of recurring emotional patterns",
        "clarity about strengths and behavioral tendencies",
        "insights for decision-making and maturity",
        "an integrated view that facilitates better questions"
      ],
      closing: "Always as a complementary, educational and ethical tool."
    },
    applications: {
      title: "Common applications",
      cards: [
        {
          icon: "Users",
          title: "Pre-process",
          description: "Clients arrive confused. Nello helps organize themes before starting a follow-up."
        },
        {
          icon: "MessageSquare",
          title: "Language support",
          description: "The report offers words and maps that facilitate deep conversations."
        },
        {
          icon: "Brain",
          title: "Pattern awareness",
          description: "The client recognizes emotional and behavioral repetitions more clearly."
        },
        {
          icon: "TrendingUp",
          title: "Development and direction",
          description: "The focus is maturation, not labeling."
        }
      ]
    },
    whatIsNot: {
      title: "Important",
      intro: "Nello Identity is not:",
      items: [
        "clinical psychological assessment",
        "diagnostic instrument",
        "professional report",
        "substitute for therapy or specialized care"
      ],
      closing: "It is a self-knowledge and human development tool, used as reflective support."
    },
    ethics: {
      title: "Ethical and complementary use",
      paragraphs: [
        "Nello deeply respects the work of therapists and listening professionals.",
        "It does not compete with professional care.",
        "It can function as an additional resource to enrich processes, expand awareness and generate language for responsible transformation.",
        "If there is intense emotional suffering or clinical need, the recommended path is always qualified professional care."
      ]
    },
    partnership: {
      title: "Partnership program for professionals",
      description: "We are building a network of professionals who want to offer their clients a complementary self-knowledge tool.",
      benefits: [
        "special conditions",
        "ready institutional materials",
        "ethical application support",
        "structured recommendation possibility"
      ],
      cta: "I want to know more about the partnership"
    },
    faq: {
      title: "Frequently asked questions",
      items: [
        {
          question: "Does this replace therapy?",
          answer: "No. It is a complementary and reflective resource."
        },
        {
          question: "Can I use it with my clients?",
          answer: "Yes, as educational support and structured language, respecting your practice."
        },
        {
          question: "Is this a diagnosis?",
          answer: "No. It has no clinical purpose."
        },
        {
          question: "Is there a partnership or affiliates?",
          answer: "Yes. We are opening a program for professionals aligned with this vision."
        }
      ]
    },
    disclaimer: "Nello Identity is a self-knowledge and human development tool.\nIt does not replace clinical psychological assessment or professional therapeutic care.",
    mapsRoute: "/en/the-7-maps"
  }
};

const iconMap: Record<string, React.ComponentType<any>> = {
  Users,
  MessageSquare,
  Brain,
  TrendingUp
};

export default function ParaProfissionais() {
  const { language } = useLanguage();
  const t = language === "en" ? content.en : content.pt;
  
  const heroAnimation = useScrollAnimation({ threshold: 0.1 });
  const whyAnimation = useScrollAnimation({ threshold: 0.1 });
  const applicationsAnimation = useScrollAnimation({ threshold: 0.1 });
  const whatIsNotAnimation = useScrollAnimation({ threshold: 0.1 });
  const ethicsAnimation = useScrollAnimation({ threshold: 0.1 });
  const partnershipAnimation = useScrollAnimation({ threshold: 0.1 });
  const faqAnimation = useScrollAnimation({ threshold: 0.1 });

  const whatsappLink = language === "en" 
    ? "https://wa.me/5511999999999?text=I%20want%20to%20know%20more%20about%20the%20professional%20partnership"
    : "https://wa.me/5511999999999?text=Quero%20saber%20mais%20sobre%20a%20parceria%20para%20profissionais";

  return (
    <div className="min-h-screen bg-background">
      <LandingNav />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 bg-gradient-to-b from-muted/50 to-background">
        <div 
          ref={heroAnimation.ref}
          className={cn(
            "container px-4 max-w-4xl mx-auto text-center transition-all duration-700",
            heroAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
            <Handshake className="w-8 h-8 text-primary" />
          </div>
          
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground mb-4 leading-tight">
            {t.hero.title}
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
            {t.hero.subtitle}
          </p>
          
          <p className="text-base text-foreground/80 mb-4 max-w-2xl mx-auto">
            {t.hero.description}
          </p>
          
          <p className="text-sm text-muted-foreground mb-8 whitespace-pre-line max-w-xl mx-auto">
            {t.hero.note}
          </p>
          
          <Button asChild size="lg" className="rounded-full">
            <Link to={t.mapsRoute}>
              {t.hero.cta}
            </Link>
          </Button>
        </div>
      </section>

      {/* Section 1 - Why it helps */}
      <section className="py-16 md:py-24">
        <div 
          ref={whyAnimation.ref}
          className={cn(
            "container px-4 max-w-3xl mx-auto transition-all duration-700",
            whyAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <h2 className="font-display text-2xl md:text-3xl text-foreground mb-6 text-center">
            {t.whyHelps.title}
          </h2>
          
          <p className="text-muted-foreground mb-6 text-center">
            {t.whyHelps.description}
          </p>
          
          <p className="text-foreground font-medium mb-4">
            {t.whyHelps.intro}
          </p>
          
          <ul className="space-y-3 mb-6">
            {t.whyHelps.benefits.map((benefit, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span className="text-foreground/80">{benefit}</span>
              </li>
            ))}
          </ul>
          
          <p className="text-muted-foreground italic text-center">
            {t.whyHelps.closing}
          </p>
        </div>
      </section>

      {/* Section 2 - Applications */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div 
          ref={applicationsAnimation.ref}
          className={cn(
            "container px-4 max-w-5xl mx-auto transition-all duration-700",
            applicationsAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <h2 className="font-display text-2xl md:text-3xl text-foreground mb-10 text-center">
            {t.applications.title}
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {t.applications.cards.map((card, index) => {
              const IconComponent = iconMap[card.icon];
              return (
                <Card 
                  key={index}
                  className={cn(
                    "border-border/50 transition-all duration-500",
                    applicationsAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                  )}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        {IconComponent && <IconComponent className="w-6 h-6 text-primary" />}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">{card.title}</h3>
                        <p className="text-sm text-muted-foreground">{card.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 3 - What Nello is NOT */}
      <section className="py-16 md:py-24">
        <div 
          ref={whatIsNotAnimation.ref}
          className={cn(
            "container px-4 max-w-3xl mx-auto transition-all duration-700",
            whatIsNotAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-900/50 dark:bg-amber-950/20">
            <CardContent className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                <h2 className="font-display text-xl md:text-2xl text-foreground">
                  {t.whatIsNot.title}
                </h2>
              </div>
              
              <p className="text-foreground font-medium mb-4">
                {t.whatIsNot.intro}
              </p>
              
              <ul className="space-y-2 mb-4">
                {t.whatIsNot.items.map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600 dark:bg-amber-400" />
                    <span className="text-foreground/80">{item}</span>
                  </li>
                ))}
              </ul>
              
              <p className="text-muted-foreground italic">
                {t.whatIsNot.closing}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Section 4 - Ethics */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div 
          ref={ethicsAnimation.ref}
          className={cn(
            "container px-4 max-w-3xl mx-auto transition-all duration-700",
            ethicsAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <Heart className="w-7 h-7 text-primary" />
            <h2 className="font-display text-2xl md:text-3xl text-foreground">
              {t.ethics.title}
            </h2>
          </div>
          
          <div className="space-y-4 text-center">
            {t.ethics.paragraphs.map((paragraph, index) => (
              <p 
                key={index} 
                className={cn(
                  "text-foreground/80",
                  index === t.ethics.paragraphs.length - 1 && "text-muted-foreground italic"
                )}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5 - Partnership */}
      <section className="py-16 md:py-24">
        <div 
          ref={partnershipAnimation.ref}
          className={cn(
            "container px-4 max-w-3xl mx-auto transition-all duration-700",
            partnershipAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
            <CardContent className="p-6 md:p-10 text-center">
              <Handshake className="w-12 h-12 text-primary mx-auto mb-4" />
              
              <h2 className="font-display text-2xl md:text-3xl text-foreground mb-4">
                {t.partnership.title}
              </h2>
              
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                {t.partnership.description}
              </p>
              
              <p className="text-foreground font-medium mb-3">
                {language === "en" ? "Partner professionals will have access to:" : "Profissionais parceiros terão acesso a:"}
              </p>
              
              <ul className="space-y-2 mb-8 max-w-md mx-auto">
                {t.partnership.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3 justify-center">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-foreground/80">{benefit}</span>
                  </li>
                ))}
              </ul>
              
              <Button asChild size="lg" className="rounded-full">
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  {t.partnership.cta}
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div 
          ref={faqAnimation.ref}
          className={cn(
            "container px-4 max-w-3xl mx-auto transition-all duration-700",
            faqAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <div className="flex items-center justify-center gap-3 mb-8">
            <HelpCircle className="w-7 h-7 text-primary" />
            <h2 className="font-display text-2xl md:text-3xl text-foreground">
              {t.faq.title}
            </h2>
          </div>
          
          <Accordion type="single" collapsible className="space-y-3">
            {t.faq.items.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-background border border-border/50 rounded-xl px-6 shadow-sm"
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
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-12 border-t border-border/50">
        <div className="container px-4 max-w-2xl mx-auto text-center">
          <p className="text-xs text-muted-foreground whitespace-pre-line">
            {t.disclaimer}
          </p>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
