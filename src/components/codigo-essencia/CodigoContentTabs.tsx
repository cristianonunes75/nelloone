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
import { BarChart3 } from "lucide-react";
import { Language } from "@/contexts/LanguageContext";

interface ChartData {
  disc?: { D: number; I: number; S: number; C: number };
  temperament?: { primary?: string; secondary?: string; scores?: Record<string, number> };
  intelligences?: { scores?: Record<string, number>; top?: string[] };
  connectionStyle?: { primary?: string; secondary?: string; scores?: Record<string, number> };
}

interface CodigoContentTabsProps {
  // Tab 1: Essência
  essenciaContent: ReactNode;
  
  // Tab 2: Perfil - Chart data
  chartData: ChartData;
  
  // Tab 3: Vida Prática
  vidaPraticaContent: ReactNode;
  
  // Tab 4: Ativação
  hasUnlocked: boolean;
  
  language: Language;
}

export const CodigoContentTabs = ({
  essenciaContent,
  chartData,
  vidaPraticaContent,
  hasUnlocked,
  language,
}: CodigoContentTabsProps) => {
  const lang = language === 'en' ? 'en' : language === 'pt-pt' ? 'pt-pt' : 'pt';
  
  const translations = {
    pt: {
      detailedCharts: "Mapas Detalhados",
    },
    "pt-pt": {
      detailedCharts: "Mapas Detalhados",
    },
    en: {
      detailedCharts: "Detailed Charts",
    },
  };
  
  const t = translations[lang as keyof typeof translations] || translations.pt;

  // Tab 2: Perfil content
  const perfilContent = useMemo(() => (
    <>
      {/* Premium Progress Bars */}
      <PremiumProgressBars 
        disc={chartData.disc}
        temperament={chartData.temperament}
        connectionStyle={chartData.connectionStyle}
        language={lang}
      />
      
      <SectionDivider variant="line" />
      
      {/* Radar Chart */}
      <div className="bg-card/50 border border-border rounded-xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-primary" />
          <h2 className="font-bold">{lang === 'en' ? 'Your Essence Map' : 'Mapa da Essência'}</h2>
        </div>
        <EssenceRadarChart 
          disc={chartData.disc}
          temperament={chartData.temperament?.scores}
          intelligences={chartData.intelligences?.scores}
          language={lang}
        />
      </div>
      
      <SectionDivider variant="dots" />
      
      {/* Detailed Charts */}
      <div className="bg-card/50 border border-border rounded-xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-primary" />
          <h2 className="font-bold">{t.detailedCharts}</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {chartData.disc && Object.keys(chartData.disc).length > 0 && (
            <div className="bg-background rounded-lg p-3 border border-border">
              <h3 className="font-semibold text-xs mb-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500" />DISC
              </h3>
              <DISCChart results={chartData.disc} language={lang} />
            </div>
          )}
          {(chartData.temperament?.primary || chartData.temperament?.scores) && (
            <div className="bg-background rounded-lg p-3 border border-border">
              <h3 className="font-semibold text-xs mb-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />{lang === 'en' ? 'Temperaments' : 'Temperamentos'}
              </h3>
              <TemperamentChart results={{ primary: chartData.temperament.primary, secondary: chartData.temperament.secondary, scores: chartData.temperament.scores }} language={lang} />
            </div>
          )}
          {(chartData.intelligences?.scores || chartData.intelligences?.top?.length) && (
            <div className="bg-background rounded-lg p-3 border border-border">
              <h3 className="font-semibold text-xs mb-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-500" />{lang === 'en' ? 'Intelligences' : 'Inteligências'}
              </h3>
              <IntelligenceRanking results={{ scores: chartData.intelligences.scores, top: chartData.intelligences.top }} language={lang} />
            </div>
          )}
          {(chartData.connectionStyle?.primary || chartData.connectionStyle?.scores) && (
            <div className="bg-background rounded-lg p-3 border border-border">
              <h3 className="font-semibold text-xs mb-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />{lang === 'en' ? 'Connection' : 'Conexão'}
              </h3>
              <ConnectionStyleChart results={{ primary: chartData.connectionStyle.primary, secondary: chartData.connectionStyle.secondary, scores: chartData.connectionStyle.scores }} language={lang} />
            </div>
          )}
        </div>
      </div>
    </>
  ), [chartData, lang, t]);

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
