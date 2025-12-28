import { Sparkles, Award, Fingerprint } from "lucide-react";

interface ProductHeaderProps {
  userName: string;
  language?: string;
}

export const ProductHeader = ({ userName, language = "pt" }: ProductHeaderProps) => {
  const firstName = userName?.split(' ')[0] || "Viajante";
  
  const content = {
    pt: {
      badge: "MÉTODO NELLO ONE™",
      title: "Código da Essência",
      tagline: "Isso não é um teste. É um código que você vai viver.",
      promiseLine1: `${firstName}, este documento traz uma leitura profunda sobre seus padrões, forças e riscos, com base nos testes que você respondeu.`,
      promiseLine2: "Use este material como um espelho para refletir, tomar decisões melhores, construir relacionamentos mais honestos e viver com mais clareza.",
      promiseLine3: "Este não é um diagnóstico, nem define quem você é. É um convite à consciência, ao desenvolvimento e à melhoria contínua.",
      warning: "Aviso: O que você está prestes a ler pode incomodar. Verdade costuma fazer isso.",
      pillars: [
        { icon: "🎯", label: "Precisão", desc: "7 testes integrados" },
        { icon: "🔥", label: "Confronto", desc: "Verdades que libertam" },
        { icon: "🗺️", label: "Direção", desc: "Plano de 90 dias" },
      ]
    },
    "pt-pt": {
      badge: "MÉTODO NELLO ONE™",
      title: "Código da Essência",
      tagline: "Isto não é um teste. É um código que vais viver.",
      promiseLine1: `${firstName}, este documento traz uma leitura profunda sobre os teus padrões, forças e riscos, com base nos testes que respondeste.`,
      promiseLine2: "Usa este material como um espelho para refletir, tomar decisões melhores, construir relacionamentos mais honestos e viver com mais clareza.",
      promiseLine3: "Este não é um diagnóstico, nem define quem tu és. É um convite à consciência, ao desenvolvimento e à melhoria contínua.",
      warning: "Aviso: O que estás prestes a ler pode incomodar. A verdade costuma fazer isso.",
      pillars: [
        { icon: "🎯", label: "Precisão", desc: "7 testes integrados" },
        { icon: "🔥", label: "Confronto", desc: "Verdades que libertam" },
        { icon: "🗺️", label: "Direção", desc: "Plano de 90 dias" },
      ]
    },
    en: {
      badge: "NELLO ONE™ METHOD",
      title: "Essence Code",
      tagline: "This is not a test. It's a code you will live.",
      promiseLine1: `${firstName}, this document offers a deep reading of your patterns, strengths and risks, based on the tests you completed.`,
      promiseLine2: "Use this material as a mirror to reflect, make better decisions, build more honest relationships, and live with greater clarity.",
      promiseLine3: "This is not a diagnosis, nor does it define who you are. It's an invitation to awareness, development, and continuous improvement.",
      warning: "Warning: What you're about to read may be uncomfortable. Truth often is.",
      pillars: [
        { icon: "🎯", label: "Precision", desc: "7 integrated tests" },
        { icon: "🔥", label: "Confrontation", desc: "Truths that free" },
        { icon: "🗺️", label: "Direction", desc: "90-day plan" },
      ]
    }
  };

  const t = content[language as keyof typeof content] || content.pt;

  return (
    <div className="relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.1),transparent_50%)]" />
      
      <div className="relative p-6 md:p-8">
        {/* Badge */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 px-4 py-1.5 rounded-full">
            <Award className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold tracking-widest text-primary">{t.badge}</span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Fingerprint className="w-8 h-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t.title}
            </h1>
          </div>
          <p className="text-lg md:text-xl font-medium text-foreground/80 italic">
            "{t.tagline}"
          </p>
        </div>

        {/* Promise Box */}
        <div className="max-w-2xl mx-auto mb-6">
          <div className="bg-background/80 backdrop-blur border border-border rounded-xl p-5 space-y-3">
            <p className="text-sm md:text-base leading-relaxed text-center">
              {t.promiseLine1}
            </p>
            <p className="text-sm md:text-base leading-relaxed text-center">
              {t.promiseLine2}
            </p>
            <p className="text-sm md:text-base leading-relaxed text-center text-muted-foreground italic">
              {t.promiseLine3}
            </p>
          </div>
        </div>

        {/* Warning */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 text-amber-600 dark:text-amber-400 text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            <span>{t.warning}</span>
          </div>
        </div>

        {/* Pillars */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-8">
          {t.pillars.map((pillar, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <span className="text-lg">{pillar.icon}</span>
              <div>
                <span className="font-bold">{pillar.label}</span>
                <span className="text-muted-foreground"> · {pillar.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Divider */}
      <div className="h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
    </div>
  );
};
