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
      promise: `${firstName}, este documento revela quem você realmente é — não quem você tenta ser. Use-o para tomar decisões melhores, construir relacionamentos mais honestos e viver com mais clareza.`,
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
      promise: `${firstName}, este documento revela quem tu realmente és — não quem tu tentas ser. Usa-o para tomar decisões melhores, construir relacionamentos mais honestos e viver com mais clareza.`,
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
      promise: `${firstName}, this document reveals who you really are — not who you try to be. Use it to make better decisions, build more honest relationships, and live with greater clarity.`,
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
          <div className="bg-background/80 backdrop-blur border border-border rounded-xl p-5">
            <p className="text-sm md:text-base leading-relaxed text-center">
              {t.promise}
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
