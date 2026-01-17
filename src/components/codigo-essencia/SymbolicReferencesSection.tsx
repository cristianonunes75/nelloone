import { Card } from "@/components/ui/card";
import { Users, Sparkles, AlertCircle, Cross, Heart } from "lucide-react";

interface SpiritualReference {
  name: string;
  trait: string;
  context: string;
}

interface CulturalReference {
  name: string;
  pattern: string;
  context: string;
}

interface SymbolicReferencesData {
  spiritual_reference?: SpiritualReference;
  cultural_references?: CulturalReference[];
}

interface SymbolicReferencesSectionProps {
  data?: SymbolicReferencesData;
  language?: 'pt' | 'pt-pt' | 'en';
}

const TRANSLATIONS = {
  pt: {
    title: "Referências Simbólicas",
    intro: `Para algumas pessoas, referências espirituais, históricas ou culturais ajudam a visualizar melhor certos traços humanos.

As figuras citadas a seguir não são modelos a serem imitados, nem representam expectativas sobre quem você "deveria ser".

Elas funcionam apenas como espelhos simbólicos de características humanas, reconhecíveis em diferentes épocas e contextos.

Caso você não se identifique com referências religiosas, sinta-se totalmente à vontade para considerar apenas as referências culturais ou ignorar este bloco sem prejuízo algum para a compreensão do seu Código da Essência.`,
    spiritualTitle: "Referência espiritual (opcional)",
    spiritualDisclaimer: "Esta referência não sugere devoção nem comparação espiritual, servindo apenas como espelho simbólico de um traço humano específico.",
    culturalTitle: "Referências culturais",
    closing: "Essas referências são apenas caminhos simbólicos de compreensão. O mais importante é reconhecer como esses traços se manifestam na sua própria vida, no seu tempo e na sua história.",
    inPerson: "Em",
    traitIntro: "é possível reconhecer um traço humano semelhante ao seu:",
    patternIntro: "aparece um padrão semelhante ao seu na forma de",
    especially: "especialmente diante de",
  },
  'pt-pt': {
    title: "Referências Simbólicas",
    intro: `Para algumas pessoas, referências espirituais, históricas ou culturais ajudam a visualizar melhor certos traços humanos.

As figuras citadas a seguir não são modelos a serem imitados, nem representam expectativas sobre quem tu "deverias ser".

Elas funcionam apenas como espelhos simbólicos de características humanas, reconhecíveis em diferentes épocas e contextos.

Caso não te identifiques com referências religiosas, sente-te totalmente à vontade para considerar apenas as referências culturais ou ignorar este bloco sem prejuízo algum para a compreensão do teu Código da Essência.`,
    spiritualTitle: "Referência espiritual (opcional)",
    spiritualDisclaimer: "Esta referência não sugere devoção nem comparação espiritual, servindo apenas como espelho simbólico de um traço humano específico.",
    culturalTitle: "Referências culturais",
    closing: "Essas referências são apenas caminhos simbólicos de compreensão. O mais importante é reconhecer como esses traços se manifestam na tua própria vida, no teu tempo e na tua história.",
    inPerson: "Em",
    traitIntro: "é possível reconhecer um traço humano semelhante ao teu:",
    patternIntro: "aparece um padrão semelhante ao teu na forma de",
    especially: "especialmente diante de",
  },
  en: {
    title: "Symbolic References",
    intro: `For some people, spiritual, historical, or cultural references help visualize certain human traits more clearly.

The figures mentioned below are not models to be imitated, nor do they represent expectations about who you "should be."

They function only as symbolic mirrors of human characteristics, recognizable across different eras and contexts.

If you don't identify with religious references, feel completely free to consider only the cultural references or skip this section entirely without any loss to understanding your Essence Code.`,
    spiritualTitle: "Spiritual reference (optional)",
    spiritualDisclaimer: "This reference does not suggest devotion or spiritual comparison, serving only as a symbolic mirror of a specific human trait.",
    culturalTitle: "Cultural references",
    closing: "These references are only symbolic paths to understanding. What matters most is recognizing how these traits manifest in your own life, in your time, and in your story.",
    inPerson: "In",
    traitIntro: "it's possible to recognize a human trait similar to yours:",
    patternIntro: "a pattern similar to yours appears in the way of",
    especially: "especially when facing",
  },
};

export function SymbolicReferencesSection({ data, language = 'pt' }: SymbolicReferencesSectionProps) {
  // Only render if we have any data
  if (!data?.spiritual_reference && (!data?.cultural_references || data.cultural_references.length === 0)) {
    return null;
  }

  const t = TRANSLATIONS[language] || TRANSLATIONS.pt;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-muted/50 rounded-full flex items-center justify-center mx-auto">
          <Sparkles className="w-6 h-6 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">{t.title}</h2>
      </div>

      {/* Mandatory Introduction */}
      <Card className="p-5 bg-muted/20 border-border">
        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
          {t.intro}
        </p>
      </Card>

      {/* Spiritual Reference (Optional) */}
      {data.spiritual_reference && (
        <Card className="p-5 border-border">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Cross className="w-4 h-4 text-amber-600" />
              <h3 className="font-semibold text-foreground text-sm">
                {t.spiritualTitle}
              </h3>
            </div>
            
            <div className="space-y-3">
              <p className="text-sm text-foreground leading-relaxed">
                <span className="font-medium">{t.inPerson} {data.spiritual_reference.name}</span>, {t.traitIntro}{' '}
                {data.spiritual_reference.trait}, {t.especially} {data.spiritual_reference.context}.
              </p>
              
              <p className="text-xs text-muted-foreground italic border-l-2 border-amber-500/30 pl-3">
                {t.spiritualDisclaimer}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Cultural References */}
      {data.cultural_references && data.cultural_references.length > 0 && (
        <Card className="p-5 border-border">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-foreground text-sm">
                {t.culturalTitle}
              </h3>
            </div>
            
            <div className="space-y-4">
              {data.cultural_references.map((ref, idx) => (
                <div 
                  key={idx} 
                  className="bg-muted/30 rounded-lg p-4"
                >
                  <p className="text-sm text-foreground leading-relaxed">
                    <span className="font-medium">{t.inPerson} {ref.name}</span>, {t.patternIntro}{' '}
                    {ref.pattern}, {t.especially} {ref.context}.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Closing Observation */}
      <div className="flex items-start gap-3 p-4 bg-muted/10 rounded-lg border border-border/50">
        <Heart className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
        <p className="text-sm text-muted-foreground leading-relaxed italic">
          {t.closing}
        </p>
      </div>
    </div>
  );
}
