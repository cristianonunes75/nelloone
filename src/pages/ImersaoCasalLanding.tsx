import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import {
  MessageCircle,
  Target,
  Clock,
  AlertTriangle,
  Users,
  Compass,
  Search,
  Wrench,
  Check,
} from "lucide-react";
import heroImg from "@/assets/imersao-casal-hero.jpg";
import dialogoImg from "@/assets/imersao-casal-dialogo.jpg";
import crisLisaImg from "@/assets/cris-lisa-imersao.jpg";

/* ─── Reusable scroll-animated wrapper ─── */
const Section = ({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  return (
    <section
      ref={ref}
      id={id}
      className={cn(
        "transition-all duration-700 ease-out",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
        className
      )}
    >
      {children}
    </section>
  );
};

/* ─── CTA handler ─── */
const scrollToCTA = () => {
  document.getElementById("investimento")?.scrollIntoView({ behavior: "smooth" });
};

/* ═══════════════════════════════════════════
   1 · HERO
   ═══════════════════════════════════════════ */
const HeroSection = () => (
  <Section className="relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-[#FAF8F5] via-[#F7F3EE] to-[#FAF8F5]" />
    <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32 grid md:grid-cols-2 gap-12 items-center">
      <div className="space-y-6">
        <p className="text-sm uppercase tracking-[0.25em] text-[hsl(var(--nello-gold))] font-medium">
          Experiência para casais
        </p>
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.15] text-foreground">
          Imersão <br />
          <span className="text-[hsl(var(--nello-gold-deep))]">Código do Casal</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed">
          Decodificação e Alinhamento Relacional
        </p>
        <p className="text-base text-muted-foreground leading-relaxed max-w-lg">
          Vocês se amam, mas às vezes parecem falar línguas diferentes.
        </p>
        <p className="text-base text-muted-foreground leading-relaxed max-w-lg">
          Experiência estruturada para ajudar casais a se entenderem melhor e
          alinhar expectativas antes que pequenos desencontros virem desgaste.
        </p>
        <Button
          onClick={scrollToCTA}
          size="lg"
          className="mt-4 rounded-full bg-[hsl(var(--nello-gold))] hover:bg-[hsl(var(--nello-gold-deep))] text-white px-8 py-6 text-base shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
        >
          Quero participar da turma
        </Button>
      </div>
      <div className="relative">
        <img
          src={heroImg}
          alt="Casal conversando com leveza em ambiente claro e natural"
          className="rounded-2xl shadow-xl object-cover w-full max-h-[480px]"
          loading="eager"
        />
      </div>
    </div>
  </Section>
);

/* ═══════════════════════════════════════════
   2 · PROBLEMA
   ═══════════════════════════════════════════ */
const problemas = [
  { icon: MessageCircle, text: "Comunicação que gera ruído" },
  { icon: Target, text: "Expectativas desalinhadas" },
  { icon: Clock, text: "Ritmos diferentes" },
  { icon: AlertTriangle, text: "Pequenos conflitos recorrentes" },
];

const ProblemaSection = () => (
  <Section className="bg-white py-20 md:py-28">
    <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
      <div className="space-y-8">
        <h2 className="font-display text-3xl md:text-4xl text-foreground leading-tight">
          Diferença não é o problema.{" "}
          <span className="text-[hsl(var(--nello-gold-deep))]">
            Falta de entendimento é.
          </span>
        </h2>
        <ul className="space-y-5">
          {problemas.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-4 text-muted-foreground">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[hsl(var(--nello-gold-glow))] flex items-center justify-center">
                <Icon className="w-5 h-5 text-[hsl(var(--nello-gold-deep))]" />
              </div>
              <span className="text-base">{text}</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <img
          src={dialogoImg}
          alt="Casal em diálogo tranquilo"
          className="rounded-2xl shadow-lg object-cover w-full max-h-[420px]"
          loading="lazy"
        />
      </div>
    </div>
  </Section>
);

/* ═══════════════════════════════════════════
   3 · O QUE É
   ═══════════════════════════════════════════ */
const blocos = [
  {
    icon: Compass,
    title: "Mapeamento Individual",
    desc: "Cada pessoa responde individualmente para revelar seu perfil de funcionamento.",
  },
  {
    icon: Users,
    title: "Cruzamento Estruturado",
    desc: "Os perfis são cruzados para mostrar onde vocês se complementam e onde há atrito.",
  },
  {
    icon: Search,
    title: "Identificação de Padrões",
    desc: "Padrões repetitivos de comunicação e conflito são mapeados com clareza.",
  },
  {
    icon: Wrench,
    title: "Ajustes Práticos",
    desc: "Orientações concretas para ajustar a dinâmica do dia a dia do casal.",
  },
];

const OQueESection = () => (
  <Section className="bg-[#FAF8F5] py-20 md:py-28">
    <div className="max-w-5xl mx-auto px-6 text-center space-y-12">
      <h2 className="font-display text-3xl md:text-4xl text-foreground">
        O que é a Imersão Código do Casal
      </h2>
      <div className="grid sm:grid-cols-2 gap-8">
        {blocos.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 text-left space-y-4"
          >
            <div className="w-12 h-12 rounded-full bg-[hsl(var(--nello-gold-glow))] flex items-center justify-center">
              <Icon className="w-6 h-6 text-[hsl(var(--nello-gold-deep))]" />
            </div>
            <h3 className="font-display text-xl text-foreground">{title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  </Section>
);

/* ═══════════════════════════════════════════
   4 · COMO FUNCIONA
   ═══════════════════════════════════════════ */
const etapas = [
  {
    num: "01",
    title: "Aplicação Individual",
    desc: "Cada parceiro responde ao mapeamento de forma independente, garantindo autenticidade nas respostas.",
  },
  {
    num: "02",
    title: "Encontro 1 — Decodificação Estrutural",
    desc: "Apresentação detalhada do cruzamento dos perfis, revelando dinâmicas e padrões do casal.",
  },
  {
    num: "03",
    title: "Encontro 2 — Alinhamento Aplicado",
    desc: "Tradução prática dos resultados em ajustes concretos para o dia a dia do relacionamento.",
  },
];

const ComoFuncionaSection = () => (
  <Section className="bg-white py-20 md:py-28">
    <div className="max-w-3xl mx-auto px-6 space-y-12">
      <h2 className="font-display text-3xl md:text-4xl text-foreground text-center">
        Como Funciona
      </h2>
      <div className="relative space-y-12">
        {/* Vertical line */}
        <div className="absolute left-6 top-4 bottom-4 w-px bg-[hsl(var(--nello-gold-light))]" />
        {etapas.map(({ num, title, desc }) => (
          <div key={num} className="flex gap-8 items-start relative">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[hsl(var(--nello-gold))] text-white flex items-center justify-center font-display text-lg z-10">
              {num}
            </div>
            <div className="space-y-2 pt-1">
              <h3 className="font-display text-xl text-foreground">{title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </Section>
);

/* ═══════════════════════════════════════════
   5 · PARA QUEM É
   ═══════════════════════════════════════════ */
const paraQuem = [
  "Casais que se amam, mas sentem que a comunicação poderia ser melhor",
  "Casais que querem prevenir desgaste antes que ele se instale",
  "Casais em fase de transição — filhos, carreira, mudanças",
  "Casais que já tentaram conversar, mas acabam no mesmo padrão",
  "Casais que querem entender as diferenças ao invés de lutar contra elas",
];

const ParaQuemSection = () => (
  <Section className="bg-[#FAF8F5] py-20 md:py-28">
    <div className="max-w-3xl mx-auto px-6 space-y-10">
      <h2 className="font-display text-3xl md:text-4xl text-foreground text-center">
        Para Quem É
      </h2>
      <ul className="space-y-5">
        {paraQuem.map((item) => (
          <li key={item} className="flex items-start gap-4">
            <div className="flex-shrink-0 mt-1">
              <Check className="w-5 h-5 text-[hsl(var(--nello-gold))]" />
            </div>
            <span className="text-muted-foreground text-base leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  </Section>
);

/* ═══════════════════════════════════════════
   6 · QUEM CONDUZ
   ═══════════════════════════════════════════ */
const QuemConduzSection = () => (
  <Section className="bg-white py-20 md:py-28">
    <div className="max-w-5xl mx-auto px-6 space-y-12">
      <h2 className="font-display text-3xl md:text-4xl text-foreground text-center">
        Quem Conduz
      </h2>
      <div className="flex flex-col items-center gap-10">
        <div className="w-64 h-64 md:w-72 md:h-72 rounded-full overflow-hidden border-4 border-[hsl(var(--nello-gold-light))] shadow-lg">
          <img
            src={crisLisaImg}
            alt="Cris e Lisa Marini"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-2xl text-center">
          <div className="space-y-2">
            <h3 className="font-display text-xl text-foreground">Cris</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Especialista em alinhamento relacional com base em desenvolvimento
              humano e formação em coaching.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-display text-xl text-foreground">Lisa Marini</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Co-facilitadora responsável pela leitura relacional complementar e
              equilíbrio de percepção.
            </p>
          </div>
        </div>
      </div>
    </div>
  </Section>
);

/* ═══════════════════════════════════════════
   7 · INVESTIMENTO
   ═══════════════════════════════════════════ */
const InvestimentoSection = () => (
  <Section id="investimento" className="bg-[#F5F0EA] py-20 md:py-28">
    <div className="max-w-xl mx-auto px-6 text-center space-y-8">
      <span className="inline-block bg-[hsl(var(--nello-gold))] text-white text-xs uppercase tracking-widest px-4 py-1.5 rounded-full font-medium">
        Turma Fundadora · 10 casais
      </span>
      <h2 className="font-display text-3xl md:text-4xl text-foreground">
        Investimento
      </h2>
      <p className="text-4xl md:text-5xl font-display text-[hsl(var(--nello-gold-deep))]">
        R$ 1.497
      </p>
      <p className="text-muted-foreground text-sm">por casal</p>
      <Button
        size="lg"
        className="rounded-full bg-[hsl(var(--nello-gold))] hover:bg-[hsl(var(--nello-gold-deep))] text-white px-10 py-6 text-base shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
        onClick={() =>
          window.open(
            "https://wa.me/5561992430090?text=Quero%20participar%20da%20Imers%C3%A3o%20C%C3%B3digo%20do%20Casal",
            "_blank"
          )
        }
      >
        Garantir minha vaga
      </Button>
    </div>
  </Section>
);

/* ═══════════════════════════════════════════
   8 · RODAPÉ / DISCLAIMER
   ═══════════════════════════════════════════ */
const DisclaimerFooter = () => (
  <footer className="bg-[#FAF8F5] py-10 border-t border-[hsl(var(--nello-gold-glow))]">
    <p className="max-w-3xl mx-auto px-6 text-center text-xs text-muted-foreground leading-relaxed">
      Processo de desenvolvimento relacional estruturado. Não substitui terapia
      psicológica ou acompanhamento clínico.
    </p>
  </footer>
);

/* ═══════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════ */
const ImersaoCasalLanding = () => (
  <div className="min-h-screen bg-[#FAF8F5] scroll-smooth">
    <HeroSection />
    <ProblemaSection />
    <OQueESection />
    <ComoFuncionaSection />
    <ParaQuemSection />
    <QuemConduzSection />
    <InvestimentoSection />
    <DisclaimerFooter />
  </div>
);

export default ImersaoCasalLanding;
