import { User, Zap, AlertTriangle, Scale, Target, Quote, Compass } from "lucide-react";

interface ExecutiveSummaryProps {
  tresForcasCentrais?: string[];
  quemVoceE: string;
  maiorForca: string;
  maiorRisco: string;
  tensaoCentral: string;
  direcao90Dias: string;
  fraseSintese: string;
  language?: string;
}

export const ExecutiveSummary = ({
  tresForcasCentrais,
  quemVoceE,
  maiorForca,
  maiorRisco,
  tensaoCentral,
  direcao90Dias,
  fraseSintese,
  language = "pt"
}: ExecutiveSummaryProps) => {
  const labels = {
    pt: {
      title: "Seu Código em 1 Página",
      subtitle: "O essencial sobre quem você é",
      centralForces: "Seu Código gira em torno de 3 forças centrais",
      whoYouAre: "Quem Você É",
      greatestStrength: "Maior Força",
      greatestRisk: "Maior Risco",
      centralTension: "Tensão Central",
      direction90Days: "Direção 90 Dias",
      synthesis: "Síntese do Código"
    },
    "pt-pt": {
      title: "O Teu Código em 1 Página",
      subtitle: "O essencial sobre quem tu és",
      centralForces: "O teu Código gira em torno de 3 forças centrais",
      whoYouAre: "Quem Tu És",
      greatestStrength: "Maior Força",
      greatestRisk: "Maior Risco",
      centralTension: "Tensão Central",
      direction90Days: "Direção 90 Dias",
      synthesis: "Síntese do Código"
    },
    en: {
      title: "Your Code in 1 Page",
      subtitle: "The essentials about who you are",
      centralForces: "Your Code revolves around 3 central forces",
      whoYouAre: "Who You Are",
      greatestStrength: "Greatest Strength",
      greatestRisk: "Greatest Risk",
      centralTension: "Central Tension",
      direction90Days: "90-Day Direction",
      synthesis: "Code Synthesis"
    }
  };

  const t = labels[language as keyof typeof labels] || labels.pt;

  return (
    <div className="bg-gradient-to-br from-primary/15 via-accent/10 to-primary/5 border-2 border-primary/30 rounded-2xl p-6 shadow-lg">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-4 py-2 rounded-full mb-2">
          <span className="text-lg">🔑</span>
          <span className="font-bold text-sm uppercase tracking-wide">{t.title}</span>
        </div>
        <p className="text-xs text-muted-foreground">{t.subtitle}</p>
      </div>

      {/* Main Content */}
      <div className="space-y-4">
        {/* 3 Central Forces - New Section */}
        {tresForcasCentrais && tresForcasCentrais.length > 0 && (
          <div className="bg-gradient-to-r from-primary/20 to-accent/20 border-2 border-primary/40 rounded-xl p-5 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Compass className="w-5 h-5 text-primary" />
              <span className="font-bold text-primary text-sm">{t.centralForces}:</span>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {tresForcasCentrais.map((forca, index) => (
                <span
                  key={index}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-bold shadow-md"
                >
                  {index + 1}. {forca}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Who You Are - Full Width */}
        <div className="bg-background/80 border border-primary/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <User className="w-4 h-4 text-primary" />
            <span className="font-semibold text-primary text-xs uppercase">{t.whoYouAre}</span>
          </div>
          <p className="text-sm font-medium leading-relaxed">{quemVoceE}</p>
        </div>

        {/* Two Column Grid */}
        <div className="grid md:grid-cols-2 gap-3">
          {/* Greatest Strength */}
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-emerald-500" />
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-xs uppercase">{t.greatestStrength}</span>
            </div>
            <p className="text-sm leading-snug">{maiorForca}</p>
          </div>

          {/* Greatest Risk */}
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span className="font-semibold text-red-600 dark:text-red-400 text-xs uppercase">{t.greatestRisk}</span>
            </div>
            <p className="text-sm leading-snug">{maiorRisco}</p>
          </div>
        </div>

        {/* Two Column Grid - Tension & Direction */}
        <div className="grid md:grid-cols-2 gap-3">
          {/* Central Tension */}
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Scale className="w-4 h-4 text-amber-500" />
              <span className="font-semibold text-amber-600 dark:text-amber-400 text-xs uppercase">{t.centralTension}</span>
            </div>
            <p className="text-sm leading-snug font-medium">{tensaoCentral}</p>
          </div>

          {/* 90-Day Direction */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-blue-500" />
              <span className="font-semibold text-blue-600 dark:text-blue-400 text-xs uppercase">{t.direction90Days}</span>
            </div>
            <p className="text-sm leading-snug">{direcao90Dias}</p>
          </div>
        </div>

        {/* Synthesis - Full Width Quote */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/30 rounded-xl p-5 mt-4">
          <div className="flex items-center gap-2 mb-3">
            <Quote className="w-4 h-4 text-primary" />
            <span className="font-semibold text-primary text-xs uppercase">{t.synthesis}</span>
          </div>
          <blockquote className="text-base font-medium italic leading-relaxed text-foreground/90 border-l-4 border-primary/40 pl-4">
            "{fraseSintese}"
          </blockquote>
        </div>
      </div>
    </div>
  );
};
