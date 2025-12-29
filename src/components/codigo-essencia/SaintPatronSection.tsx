import { Card } from "@/components/ui/card";
import { Cross, Quote, Heart, Calendar, BookOpen, Sparkles } from "lucide-react";

interface SaintPatronData {
  saint: {
    name: string;
    title: string;
    lived: string;
    feast_day: string;
  };
  connection: {
    temperament_match: string;
    virtue_match: string;
    mission_match: string;
  };
  biography: string;
  quote: {
    text: string;
    source: string;
  };
  reflection: string;
  virtues_in_common: Array<{
    virtue: string;
    in_saint: string;
    in_you: string;
  }>;
  prayer: {
    title: string;
    text: string;
  };
  daily_practice: string;
}

interface SaintPatronSectionProps {
  data?: SaintPatronData;
  language?: 'pt' | 'pt-pt' | 'en';
}

const TRANSLATIONS = {
  pt: {
    title: "Seu Santo Padroeiro",
    subtitle: "Um caminho de santidade inspirado em quem viveu virtudes semelhantes",
    feastDay: "Festa",
    lived: "Viveu",
    connectionTitle: "Por que este santo?",
    temperamentMatch: "Temperamento",
    virtueMatch: "Virtude a desenvolver",
    missionMatch: "Missão compartilhada",
    biographyTitle: "Uma breve história",
    quoteTitle: "Palavras do santo",
    reflectionTitle: "Reflexão para você",
    virtuesTitle: "Virtudes em comum",
    inSaint: "No santo",
    inYou: "Em você",
    prayerTitle: "Invocação",
    practiceTitle: "Prática diária (30 dias)",
  },
  'pt-pt': {
    title: "O Teu Santo Padroeiro",
    subtitle: "Um caminho de santidade inspirado em quem viveu virtudes semelhantes",
    feastDay: "Festa",
    lived: "Viveu",
    connectionTitle: "Porque este santo?",
    temperamentMatch: "Temperamento",
    virtueMatch: "Virtude a desenvolver",
    missionMatch: "Missão partilhada",
    biographyTitle: "Uma breve história",
    quoteTitle: "Palavras do santo",
    reflectionTitle: "Reflexão para ti",
    virtuesTitle: "Virtudes em comum",
    inSaint: "No santo",
    inYou: "Em ti",
    prayerTitle: "Invocação",
    practiceTitle: "Prática diária (30 dias)",
  },
  en: {
    title: "Your Patron Saint",
    subtitle: "A path of holiness inspired by those who lived similar virtues",
    feastDay: "Feast",
    lived: "Lived",
    connectionTitle: "Why this saint?",
    temperamentMatch: "Temperament",
    virtueMatch: "Virtue to develop",
    missionMatch: "Shared mission",
    biographyTitle: "A brief story",
    quoteTitle: "Words of the saint",
    reflectionTitle: "Reflection for you",
    virtuesTitle: "Virtues in common",
    inSaint: "In the saint",
    inYou: "In you",
    prayerTitle: "Invocation",
    practiceTitle: "Daily practice (30 days)",
  },
};

export function SaintPatronSection({ data, language = 'pt' }: SaintPatronSectionProps) {
  if (!data?.saint?.name) return null;

  const t = TRANSLATIONS[language] || TRANSLATIONS.pt;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto">
          <Cross className="w-6 h-6 text-amber-600" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">{t.title}</h2>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">{t.subtitle}</p>
      </div>

      {/* Saint Card - Main */}
      <Card className="p-6 bg-gradient-to-br from-amber-50/50 to-orange-50/30 dark:from-amber-950/20 dark:to-orange-950/10 border-amber-200/50 dark:border-amber-800/30">
        <div className="space-y-4">
          {/* Saint Name and Title */}
          <div className="text-center space-y-1">
            <h3 className="text-2xl font-bold text-amber-800 dark:text-amber-200">
              {data.saint.name}
            </h3>
            <p className="text-amber-700/80 dark:text-amber-300/80 italic">
              {data.saint.title}
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mt-2">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {t.lived}: {data.saint.lived}
              </span>
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                {t.feastDay}: {data.saint.feast_day}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Connection - Why this saint? */}
      <Card className="p-5 border-border">
        <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Heart className="w-4 h-4 text-primary" />
          {t.connectionTitle}
        </h4>
        <div className="grid gap-3">
          <div className="bg-muted/30 rounded-lg p-3">
            <p className="text-xs font-medium text-muted-foreground mb-1">{t.temperamentMatch}</p>
            <p className="text-sm text-foreground">{data.connection.temperament_match}</p>
          </div>
          <div className="bg-muted/30 rounded-lg p-3">
            <p className="text-xs font-medium text-muted-foreground mb-1">{t.virtueMatch}</p>
            <p className="text-sm text-foreground">{data.connection.virtue_match}</p>
          </div>
          <div className="bg-muted/30 rounded-lg p-3">
            <p className="text-xs font-medium text-muted-foreground mb-1">{t.missionMatch}</p>
            <p className="text-sm text-foreground">{data.connection.mission_match}</p>
          </div>
        </div>
      </Card>

      {/* Biography */}
      <Card className="p-5 border-border">
        <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-primary" />
          {t.biographyTitle}
        </h4>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {data.biography}
        </p>
      </Card>

      {/* Quote */}
      <Card className="p-5 bg-primary/5 border-primary/20">
        <div className="flex gap-3">
          <Quote className="w-8 h-8 text-primary/50 flex-shrink-0" />
          <div className="space-y-2">
            <p className="text-foreground font-medium italic leading-relaxed">
              "{data.quote.text}"
            </p>
            <p className="text-xs text-muted-foreground">— {data.quote.source}</p>
          </div>
        </div>
      </Card>

      {/* Reflection */}
      <Card className="p-5 border-border">
        <h4 className="font-semibold text-foreground mb-3">{t.reflectionTitle}</h4>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {data.reflection}
        </p>
      </Card>

      {/* Virtues in Common */}
      {data.virtues_in_common && data.virtues_in_common.length > 0 && (
        <Card className="p-5 border-border">
          <h4 className="font-semibold text-foreground mb-4">{t.virtuesTitle}</h4>
          <div className="space-y-4">
            {data.virtues_in_common.map((virtue, idx) => (
              <div key={idx} className="border-l-2 border-amber-500 pl-4 space-y-2">
                <p className="font-medium text-amber-700 dark:text-amber-300">{virtue.virtue}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div className="bg-muted/30 rounded p-2">
                    <p className="text-xs font-medium text-muted-foreground mb-0.5">{t.inSaint}</p>
                    <p className="text-foreground">{virtue.in_saint}</p>
                  </div>
                  <div className="bg-primary/5 rounded p-2">
                    <p className="text-xs font-medium text-muted-foreground mb-0.5">{t.inYou}</p>
                    <p className="text-foreground">{virtue.in_you}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Prayer */}
      <Card className="p-5 bg-gradient-to-br from-amber-50/80 to-orange-50/50 dark:from-amber-950/30 dark:to-orange-950/20 border-amber-200/50 dark:border-amber-800/30">
        <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-3 flex items-center gap-2">
          <Cross className="w-4 h-4" />
          {data.prayer.title}
        </h4>
        <p className="text-sm text-amber-900/80 dark:text-amber-100/80 leading-relaxed italic">
          {data.prayer.text}
        </p>
      </Card>

      {/* Daily Practice */}
      <Card className="p-5 border-primary/30 bg-primary/5">
        <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          {t.practiceTitle}
        </h4>
        <p className="text-sm text-foreground leading-relaxed">
          {data.daily_practice}
        </p>
      </Card>
    </div>
  );
}
