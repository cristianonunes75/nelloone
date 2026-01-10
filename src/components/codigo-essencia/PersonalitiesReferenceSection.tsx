import { Card } from "@/components/ui/card";
import { Users, Lightbulb, Star, BookOpen, AlertCircle } from "lucide-react";

interface Personality {
  name: string;
  field: string;
  profile_match: string;
  connection: string;
  lesson: string;
}

interface PersonalitiesReferenceData {
  intro?: string;
  personalities: Personality[];
  reflection?: string;
}

interface PersonalitiesReferenceSectionProps {
  data?: PersonalitiesReferenceData;
  language?: 'pt' | 'pt-pt' | 'en';
}

const TRANSLATIONS = {
  pt: {
    title: "Pessoas que Pensam Como Você",
    subtitle: "Referências de personalidades que compartilham características do seu perfil",
    fieldLabel: "Campo de atuação",
    matchLabel: "Conexão com seu perfil",
    connectionLabel: "Por que esta referência?",
    lessonLabel: "A lição",
    reflectionTitle: "Reflexão",
    disclaimer: "As personalidades apresentadas são referências simbólicas baseadas em padrões observáveis de comportamento. Não representam diagnóstico psicológico, nem garantem resultados similares. Use como inspiração para reflexão.",
  },
  'pt-pt': {
    title: "Pessoas que Pensam Como Tu",
    subtitle: "Referências de personalidades que partilham características do teu perfil",
    fieldLabel: "Campo de atuação",
    matchLabel: "Conexão com o teu perfil",
    connectionLabel: "Porque esta referência?",
    lessonLabel: "A lição",
    reflectionTitle: "Reflexão",
    disclaimer: "As personalidades apresentadas são referências simbólicas baseadas em padrões observáveis de comportamento. Não representam diagnóstico psicológico, nem garantem resultados semelhantes. Usa como inspiração para reflexão.",
  },
  en: {
    title: "People Who Think Like You",
    subtitle: "Reference personalities who share characteristics of your profile",
    fieldLabel: "Field",
    matchLabel: "Profile connection",
    connectionLabel: "Why this reference?",
    lessonLabel: "The lesson",
    reflectionTitle: "Reflection",
    disclaimer: "The personalities presented are symbolic references based on observable behavior patterns. They do not represent psychological diagnosis, nor guarantee similar results. Use as inspiration for reflection.",
  },
};

// Icon mapping for different fields
const getFieldIcon = (field: string) => {
  const fieldLower = field.toLowerCase();
  if (fieldLower.includes('tecnologia') || fieldLower.includes('technology') || fieldLower.includes('inovaç')) {
    return '💡';
  }
  if (fieldLower.includes('liderança') || fieldLower.includes('leadership') || fieldLower.includes('polít')) {
    return '👑';
  }
  if (fieldLower.includes('arte') || fieldLower.includes('cultura') || fieldLower.includes('art') || fieldLower.includes('music')) {
    return '🎨';
  }
  if (fieldLower.includes('espiritualidade') || fieldLower.includes('fé') || fieldLower.includes('faith') || fieldLower.includes('saint')) {
    return '✝️';
  }
  if (fieldLower.includes('ciência') || fieldLower.includes('science') || fieldLower.includes('conhecimento')) {
    return '🔬';
  }
  if (fieldLower.includes('empreendedorismo') || fieldLower.includes('entrepreneur') || fieldLower.includes('negócio')) {
    return '🚀';
  }
  if (fieldLower.includes('esporte') || fieldLower.includes('sport') || fieldLower.includes('performance')) {
    return '🏆';
  }
  if (fieldLower.includes('serviço') || fieldLower.includes('service') || fieldLower.includes('compaixão') || fieldLower.includes('compassion')) {
    return '🤝';
  }
  if (fieldLower.includes('educaç') || fieldLower.includes('education') || fieldLower.includes('ensino')) {
    return '📚';
  }
  return '⭐';
};

export function PersonalitiesReferenceSection({ data, language = 'pt' }: PersonalitiesReferenceSectionProps) {
  if (!data?.personalities || data.personalities.length === 0) return null;

  const t = TRANSLATIONS[language] || TRANSLATIONS.pt;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <Users className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">{t.title}</h2>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">{t.subtitle}</p>
      </div>

      {/* Intro if available */}
      {data.intro && (
        <p className="text-sm text-muted-foreground text-center max-w-lg mx-auto">
          {data.intro}
        </p>
      )}

      {/* Personalities Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.personalities.map((personality, idx) => (
          <Card 
            key={idx} 
            className="p-5 bg-gradient-to-br from-card to-muted/20 border-border hover:border-primary/30 transition-colors"
          >
            <div className="space-y-4">
              {/* Header with Icon and Name */}
              <div className="flex items-start gap-3">
                <span className="text-2xl">{getFieldIcon(personality.field)}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-foreground text-lg leading-tight">
                    {personality.name}
                  </h3>
                  <p className="text-xs text-primary font-medium mt-0.5">
                    {personality.field}
                  </p>
                </div>
              </div>

              {/* Profile Match Badge */}
              <div className="bg-muted/50 rounded-lg p-2">
                <p className="text-xs font-medium text-muted-foreground mb-0.5">
                  {t.matchLabel}
                </p>
                <p className="text-xs text-foreground">
                  {personality.profile_match}
                </p>
              </div>

              {/* Connection */}
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  <p className="text-xs font-medium text-muted-foreground">
                    {t.connectionLabel}
                  </p>
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  {personality.connection}
                </p>
              </div>

              {/* Lesson */}
              <div className="border-t border-border pt-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
                  <p className="text-xs font-medium text-muted-foreground">
                    {t.lessonLabel}
                  </p>
                </div>
                <p className="text-sm text-foreground/80 italic leading-relaxed">
                  "{personality.lesson}"
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Reflection */}
      {data.reflection && (
        <Card className="p-5 bg-primary/5 border-primary/20">
          <div className="flex gap-3">
            <Star className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-foreground text-sm mb-2">{t.reflectionTitle}</h4>
              <p className="text-sm text-foreground/80 leading-relaxed">
                {data.reflection}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Disclaimer */}
      <div className="flex items-start gap-2 p-3 bg-muted/30 rounded-lg">
        <AlertCircle className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          {t.disclaimer}
        </p>
      </div>
    </div>
  );
}
