import { cn } from "@/lib/utils";
import { User, Target, Zap, Shield, Brain, Heart, Compass } from "lucide-react";

interface ProfileSummaryCardProps {
  userName: string;
  disc?: { dominant?: string };
  temperament?: { primary?: string; secondary?: string };
  enneagram?: { type?: string; wing?: string };
  nello16?: { code?: string; name?: string };
  archetypes?: { primary?: string; secondary?: string };
  connectionStyle?: { primary?: string };
  intelligences?: { top?: string[] };
  language?: string;
}

const TEST_BADGES: Record<string, { icon: React.ReactNode; color: string }> = {
  disc: { icon: <Target className="w-3 h-3" />, color: "bg-red-500/20 text-red-600" },
  temperament: { icon: <Zap className="w-3 h-3" />, color: "bg-yellow-500/20 text-yellow-600" },
  enneagram: { icon: <Compass className="w-3 h-3" />, color: "bg-purple-500/20 text-purple-600" },
  nello16: { icon: <Brain className="w-3 h-3" />, color: "bg-blue-500/20 text-blue-600" },
  archetypes: { icon: <Shield className="w-3 h-3" />, color: "bg-emerald-500/20 text-emerald-600" },
  connection: { icon: <Heart className="w-3 h-3" />, color: "bg-pink-500/20 text-pink-600" },
};

export const ProfileSummaryCard = ({
  userName,
  disc,
  temperament,
  enneagram,
  nello16,
  archetypes,
  connectionStyle,
  intelligences,
  language = "pt",
}: ProfileSummaryCardProps) => {
  const lang = language === "en" ? "en" : language === "pt-pt" ? "pt-pt" : "pt";
  const firstName = userName.split(" ")[0];

  const summaryItems = [
    disc?.dominant && { test: "disc", value: `DISC: ${disc.dominant}` },
    temperament?.primary && { 
      test: "temperament", 
      value: `${lang === "en" ? "Temp" : "Temp"}: ${temperament.primary}${temperament.secondary ? ` + ${temperament.secondary}` : ""}` 
    },
    enneagram?.type && { 
      test: "enneagram", 
      value: `Eneagrama: ${enneagram.type}${enneagram.wing ? `w${enneagram.wing}` : ""}` 
    },
    nello16?.code && { test: "nello16", value: `Nello 16: ${nello16.code}` },
    archetypes?.primary && { 
      test: "archetypes", 
      value: `${lang === "en" ? "Archetype" : "Arquétipo"}: ${archetypes.primary}` 
    },
    connectionStyle?.primary && { 
      test: "connection", 
      value: `${lang === "en" ? "Connection" : "Conexão"}: ${connectionStyle.primary}` 
    },
  ].filter(Boolean) as { test: string; value: string }[];

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 border border-primary/20 p-6">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/5 rounded-full blur-2xl" />
      
      <div className="relative">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-2xl font-bold">
            {firstName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{firstName}</h2>
            <p className="text-muted-foreground text-sm">
              {lang === "en" ? "Your Essential Portrait" : "Seu Retrato Essencial"}
            </p>
          </div>
        </div>

        {/* Quick badges */}
        <div className="flex flex-wrap gap-2">
          {summaryItems.map(({ test, value }) => {
            const badge = TEST_BADGES[test];
            return (
              <div 
                key={test}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium",
                  badge?.color || "bg-muted text-muted-foreground"
                )}
              >
                {badge?.icon}
                {value}
              </div>
            );
          })}
        </div>

        {/* Top intelligences */}
        {intelligences?.top && intelligences.top.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border/50">
            <p className="text-xs text-muted-foreground mb-2">
              {lang === "en" ? "Top Intelligences:" : "Inteligências Dominantes:"}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {intelligences.top.slice(0, 3).map((intel, i) => (
                <span 
                  key={intel}
                  className={cn(
                    "px-2 py-0.5 rounded text-xs",
                    i === 0 ? "bg-amber-500/20 text-amber-600 font-medium" : "bg-muted text-muted-foreground"
                  )}
                >
                  {i === 0 ? "🥇 " : i === 1 ? "🥈 " : "🥉 "}
                  {intel}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
