import { ReactNode, useMemo } from "react";
import { CodigoTabs } from "./CodigoTabs";
import { PremiumProgressBars } from "./PremiumProgressBars";
import { AtivacaoTabContent } from "./AtivacaoTabContent";
import { SectionDivider } from "./SectionDivider";
import { EssenceRadarChart } from "./EssenceRadarChart";
import { DISCChart } from "./DISCChart";
import { TemperamentChart } from "./TemperamentChart";
import { IntelligenceRanking } from "./IntelligenceRanking";
import { ConnectionStyleChart } from "./ConnectionStyleChart";
import { ProfileRarityBadge } from "./ProfileRarityBadge";
import { BarChart3, Radar } from "lucide-react";
import { Language } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

interface ChartData {
  disc?: { D: number; I: number; S: number; C: number };
  temperament?: { primary?: string; secondary?: string; scores?: Record<string, number> };
  intelligences?: { scores?: Record<string, number>; top?: string[] };
  connectionStyle?: { primary?: string; secondary?: string; scores?: Record<string, number> };
}

interface CodigoContentTabsProps {
  // Tab 1: Essência
  essenciaContent: ReactNode;
  
  // Tab 2: Perfil - Chart data + Rarity
  chartData: ChartData;
  rarityData?: { percentage?: number; explanation?: string };
  
  // Tab 3: Vida Prática
  vidaPraticaContent: ReactNode;
  
  // Tab 4: Ativação
  hasUnlocked: boolean;
  
  language: Language;
}

export const CodigoContentTabs = ({
  essenciaContent,
  chartData,
  rarityData,
  vidaPraticaContent,
  hasUnlocked,
  language,
}: CodigoContentTabsProps) => {
  const lang = language === 'en' ? 'en' : language === 'pt-pt' ? 'pt-pt' : 'pt';
  
  const translations = {
    pt: {
      essenceMap: "Mapa da Essência",
      detailedCharts: "Mapas Detalhados",
      disc: "Perfil DISC",
      temperaments: "Temperamentos",
      intelligences: "Inteligências",
      connection: "Estilo de Conexão",
    },
    "pt-pt": {
      essenceMap: "Mapa da Essência",
      detailedCharts: "Mapas Detalhados",
      disc: "Perfil DISC",
      temperaments: "Temperamentos",
      intelligences: "Inteligências",
      connection: "Estilo de Conexão",
    },
    en: {
      essenceMap: "Essence Map",
      detailedCharts: "Detailed Charts",
      disc: "DISC Profile",
      temperaments: "Temperaments",
      intelligences: "Intelligences",
      connection: "Connection Style",
    },
  };
  
  const t = translations[lang as keyof typeof translations] || translations.pt;

  // Tab 2: Perfil content - Premium dashboard style
  const perfilContent = useMemo(() => (
    <>
      {/* Premium Progress Bars - Essence Indicators */}
      <PremiumProgressBars 
        disc={chartData.disc}
        temperament={chartData.temperament}
        connectionStyle={chartData.connectionStyle}
        language={lang}
      />
      
      <SectionDivider variant="line" />
      
      {/* Radar Chart - Full width premium card */}
      <motion.div 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-gradient-to-br from-[hsl(220,50%,18%,0.04)] to-[hsl(42,70%,50%,0.04)] border border-[hsl(220,50%,30%,0.15)] rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[hsl(220,50%,25%)] to-[hsl(220,50%,18%)] flex items-center justify-center shadow-lg" style={{ boxShadow: '0 4px 16px hsla(220,50%,25%,0.25)' }}>
            <Radar className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-lg font-bold text-foreground">{t.essenceMap}</h2>
        </div>
        <EssenceRadarChart 
          disc={chartData.disc}
          temperament={chartData.temperament?.scores}
          intelligences={chartData.intelligences?.scores}
          language={lang}
        />
      </motion.div>
      
      {/* Profile Rarity - Moved to Perfil tab */}
      {rarityData && (rarityData.percentage || rarityData.explanation) && (
        <>
          <SectionDivider variant="dots" />
          <ProfileRarityBadge 
            percentage={rarityData.percentage}
            explanation={rarityData.explanation}
            language={lang}
          />
        </>
      )}
      
      <SectionDivider variant="dots" />
      
      {/* Detailed Charts Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-card/50 border border-border/50 rounded-2xl p-5"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[hsl(42,70%,50%)] to-[hsl(40,75%,40%)] flex items-center justify-center shadow-lg" style={{ boxShadow: '0 4px 16px hsla(42,70%,50%,0.25)' }}>
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-lg font-bold text-foreground">{t.detailedCharts}</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {chartData.disc && Object.keys(chartData.disc).length > 0 && (
            <div className="bg-background rounded-xl p-4 border border-border/50">
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[hsl(42,70%,50%)] to-[hsl(40,75%,40%)]" />
                {t.disc}
              </h3>
              <DISCChart results={chartData.disc} language={lang} />
            </div>
          )}
          {(chartData.temperament?.primary || chartData.temperament?.scores) && (
            <div className="bg-background rounded-xl p-4 border border-border/50">
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[hsl(220,50%,30%)] to-[hsl(220,50%,22%)]" />
                {t.temperaments}
              </h3>
              <TemperamentChart results={{ primary: chartData.temperament.primary, secondary: chartData.temperament.secondary, scores: chartData.temperament.scores }} language={lang} />
            </div>
          )}
          {(chartData.intelligences?.scores || chartData.intelligences?.top?.length) && (
            <div className="bg-background rounded-xl p-4 border border-border/50">
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[hsl(42,65%,55%)] to-[hsl(38,70%,45%)]" />
                {t.intelligences}
              </h3>
              <IntelligenceRanking results={{ scores: chartData.intelligences.scores, top: chartData.intelligences.top }} language={lang} />
            </div>
          )}
          {(chartData.connectionStyle?.primary || chartData.connectionStyle?.scores) && (
            <div className="bg-background rounded-xl p-4 border border-border/50">
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[hsl(220,45%,40%)] to-[hsl(220,50%,28%)]" />
                {t.connection}
              </h3>
              <ConnectionStyleChart results={{ primary: chartData.connectionStyle.primary, secondary: chartData.connectionStyle.secondary, scores: chartData.connectionStyle.scores }} language={lang} />
            </div>
          )}
        </div>
      </motion.div>
    </>
  ), [chartData, rarityData, lang, t]);

  // Tab 4: Ativação content
  const ativacaoContent = useMemo(() => (
    <AtivacaoTabContent 
      language={language}
      hasUnlocked={hasUnlocked}
    />
  ), [language, hasUnlocked]);

  return (
    <CodigoTabs
      essenciaContent={essenciaContent}
      perfilContent={perfilContent}
      vidaPraticaContent={vidaPraticaContent}
      ativacaoContent={ativacaoContent}
      language={lang}
    />
  );
};
