import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { Check, type LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { ReactNode } from "react";

/**
 * Blocos reutilizáveis para landings temáticas do Nello One Identity.
 *
 * Padrão visual herdado de ImersaoCasalLanding.
 * Cada landing nova (mudanca-de-carreira, escolha-vocacional, crise-dos-30, etc)
 * compõe estes blocos passando o copy específico daquela dor.
 *
 * O CTA padrão leva pra /checkout (JornadaIdentity), preço R$ 99.
 */

export const Section = ({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
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

export const scrollToInvestimento = () => {
  document.getElementById("investimento")?.scrollIntoView({ behavior: "smooth" });
};

/* ───────── HERO ───────── */
export const LandingHero = ({
  eyebrow,
  title,
  highlight,
  subtitle,
  paragraphs,
  ctaText = "Quero meu relatório agora",
}: {
  eyebrow: string;
  title: string;
  highlight: string;
  subtitle: string;
  paragraphs: string[];
  ctaText?: string;
}) => (
  <Section className="relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-[#FAF8F5] via-[#F7F3EE] to-[#FAF8F5]" />
    <div className="absolute inset-0 gradient-glow opacity-60" />
    <div className="relative max-w-4xl mx-auto px-6 py-24 md:py-32 text-center space-y-6">
      <p className="text-sm uppercase tracking-[0.25em] text-[hsl(var(--nello-gold))] font-medium">
        {eyebrow}
      </p>
      <h1 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.15] text-foreground">
        {title} <br />
        <span className="text-[hsl(var(--nello-gold-deep))]">{highlight}</span>
      </h1>
      <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed max-w-2xl mx-auto">
        {subtitle}
      </p>
      <div className="space-y-4 max-w-2xl mx-auto pt-2">
        {paragraphs.map((p, i) => (
          <p key={i} className="text-base text-muted-foreground leading-relaxed">
            {p}
          </p>
        ))}
      </div>
      <Button
        onClick={scrollToInvestimento}
        size="lg"
        className="mt-6 rounded-full bg-[hsl(var(--nello-gold))] hover:bg-[hsl(var(--nello-gold-deep))] text-white px-10 py-6 text-base shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
      >
        {ctaText}
      </Button>
      <p className="text-xs text-muted-foreground/70 pt-2">
        Relatório entregue em minutos, no seu painel.
      </p>
    </div>
  </Section>
);

/* ───────── PROBLEMA ───────── */
export const LandingProblem = ({
  title,
  highlight,
  items,
}: {
  title: string;
  highlight: string;
  items: { icon: LucideIcon; text: string }[];
}) => (
  <Section className="bg-white py-20 md:py-28">
    <div className="max-w-3xl mx-auto px-6 space-y-10">
      <h2 className="font-display text-3xl md:text-4xl text-foreground leading-tight text-center">
        {title}{" "}
        <span className="text-[hsl(var(--nello-gold-deep))]">{highlight}</span>
      </h2>
      <ul className="space-y-5">
        {items.map(({ icon: Icon, text }) => (
          <li key={text} className="flex items-center gap-4 text-muted-foreground">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[hsl(var(--nello-gold-glow))] flex items-center justify-center">
              <Icon className="w-5 h-5 text-[hsl(var(--nello-gold-deep))]" />
            </div>
            <span className="text-base">{text}</span>
          </li>
        ))}
      </ul>
    </div>
  </Section>
);

/* ───────── O QUE É (PILARES) ───────── */
export const LandingPillars = ({
  title,
  intro,
  blocks,
}: {
  title: string;
  intro?: string;
  blocks: { icon: LucideIcon; title: string; desc: string }[];
}) => (
  <Section className="bg-[#FAF8F5] py-20 md:py-28">
    <div className="max-w-5xl mx-auto px-6 text-center space-y-12">
      <div className="space-y-4">
        <h2 className="font-display text-3xl md:text-4xl text-foreground">
          {title}
        </h2>
        {intro && (
          <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {intro}
          </p>
        )}
      </div>
      <div className="grid sm:grid-cols-2 gap-8">
        {blocks.map(({ icon: Icon, title, desc }) => (
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

/* ───────── COMO FUNCIONA ───────── */
export const LandingHow = ({
  title,
  steps,
}: {
  title: string;
  steps: { num: string; title: string; desc: string }[];
}) => (
  <Section className="bg-white py-20 md:py-28">
    <div className="max-w-3xl mx-auto px-6 space-y-12">
      <h2 className="font-display text-3xl md:text-4xl text-foreground text-center">
        {title}
      </h2>
      <div className="relative space-y-12">
        <div className="absolute left-6 top-4 bottom-4 w-px bg-[hsl(var(--nello-gold-light))]" />
        {steps.map(({ num, title, desc }) => (
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

/* ───────── PARA QUEM É ───────── */
export const LandingForWho = ({
  title,
  items,
}: {
  title: string;
  items: string[];
}) => (
  <Section className="bg-[#FAF8F5] py-20 md:py-28">
    <div className="max-w-3xl mx-auto px-6 space-y-10">
      <h2 className="font-display text-3xl md:text-4xl text-foreground text-center">
        {title}
      </h2>
      <ul className="space-y-5">
        {items.map((item) => (
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

/* ───────── PROVA / AUTORIDADE ───────── */
export const LandingAuthority = ({
  title,
  paragraphs,
}: {
  title: string;
  paragraphs: string[];
}) => (
  <Section className="bg-white py-20 md:py-28">
    <div className="max-w-3xl mx-auto px-6 space-y-8 text-center">
      <h2 className="font-display text-3xl md:text-4xl text-foreground leading-tight">
        {title}
      </h2>
      <div className="space-y-5">
        {paragraphs.map((p, i) => (
          <p key={i} className="text-base text-muted-foreground leading-relaxed">
            {p}
          </p>
        ))}
      </div>
    </div>
  </Section>
);

/* ───────── INVESTIMENTO ───────── */
export const LandingPricing = ({
  badge = "Vagas iniciais",
  headline = "Investimento",
  oldPrice = "R$ 197",
  price = "R$ 97",
  priceSubtitle = "pagamento único · acesso vitalício · vai pra R$ 197 após as 50 primeiras vagas",
  ctaText = "Começar agora",
  guaranteeText = "7 dias de garantia incondicional. Não gostou, devolvemos cada centavo.",
  urgencyText,
  navigateTo = "/checkout",
}: {
  badge?: string;
  headline?: string;
  oldPrice?: string | null;
  price?: string;
  priceSubtitle?: string;
  ctaText?: string;
  guaranteeText?: string;
  urgencyText?: string;
  navigateTo?: string;
}) => {
  const navigate = useNavigate();
  return (
    <Section id="investimento" className="bg-[#F5F0EA] py-20 md:py-28">
      <div className="max-w-xl mx-auto px-6 text-center space-y-8">
        <span className="inline-block bg-[hsl(var(--nello-gold))] text-white text-xs uppercase tracking-widest px-4 py-1.5 rounded-full font-medium">
          {badge}
        </span>
        <h2 className="font-display text-3xl md:text-4xl text-foreground">
          {headline}
        </h2>
        <div className="space-y-1">
          {oldPrice && (
            <p className="text-2xl md:text-3xl font-display text-muted-foreground/50 line-through">
              {oldPrice}
            </p>
          )}
          <p className="text-5xl md:text-6xl font-display text-[hsl(var(--nello-gold-deep))]">
            {price}
          </p>
          <p className="text-muted-foreground text-sm pt-1">{priceSubtitle}</p>
        </div>
        {urgencyText && (
          <p className="text-sm text-[hsl(var(--nello-gold-deep))] font-medium">
            {urgencyText}
          </p>
        )}
        <Button
          size="lg"
          onClick={() => navigate(navigateTo)}
          className="rounded-full bg-[hsl(var(--nello-gold))] hover:bg-[hsl(var(--nello-gold-deep))] text-white px-10 py-6 text-base shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
        >
          {ctaText}
        </Button>
        <p className="text-xs text-muted-foreground leading-relaxed pt-2">
          {guaranteeText}
        </p>
      </div>
    </Section>
  );
};

/* ───────── DISCLAIMER ───────── */
export const LandingDisclaimer = ({
  text = "A Jornada Identity é uma ferramenta de autoconhecimento. Não constitui diagnóstico clínico, avaliação terapêutica ou aconselhamento profissional. Os resultados refletem padrões comportamentais e não devem substituir acompanhamento especializado.",
}: {
  text?: string;
}) => (
  <footer className="bg-[#FAF8F5] py-10 border-t border-[hsl(var(--nello-gold-glow))]">
    <p className="max-w-3xl mx-auto px-6 text-center text-xs text-muted-foreground leading-relaxed">
      {text}
    </p>
  </footer>
);

/* ───────── SHELL ───────── */
export const LandingShell = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen bg-[#FAF8F5] scroll-smooth">{children}</div>
);
