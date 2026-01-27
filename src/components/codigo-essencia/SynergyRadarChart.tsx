import { useMemo } from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface SynergyRadarChartProps {
  profileA: {
    name: string;
    disc?: { D?: number; I?: number; S?: number; C?: number };
    temperament?: string;
    archetype?: string;
  };
  profileB: {
    name: string;
    disc?: { D?: number; I?: number; S?: number; C?: number };
    temperament?: string;
    archetype?: string;
  };
  language: 'pt' | 'pt-pt' | 'en';
}

const TRANSLATIONS = {
  pt: {
    dimensions: {
      dominance: "Dominância",
      influence: "Influência",
      stability: "Estabilidade",
      conformity: "Conformidade",
      action: "Ação",
      emotion: "Emoção",
      patience: "Paciência",
      analysis: "Análise",
    },
  },
  'pt-pt': {
    dimensions: {
      dominance: "Dominância",
      influence: "Influência",
      stability: "Estabilidade",
      conformity: "Conformidade",
      action: "Ação",
      emotion: "Emoção",
      patience: "Paciência",
      analysis: "Análise",
    },
  },
  en: {
    dimensions: {
      dominance: "Dominance",
      influence: "Influence",
      stability: "Stability",
      conformity: "Conformity",
      action: "Action",
      emotion: "Emotion",
      patience: "Patience",
      analysis: "Analysis",
    },
  },
};

export const SynergyRadarChart = ({ profileA, profileB, language }: SynergyRadarChartProps) => {
  const t = TRANSLATIONS[language];

  const chartData = useMemo(() => {
    const discA = profileA.disc || { D: 50, I: 50, S: 50, C: 50 };
    const discB = profileB.disc || { D: 50, I: 50, S: 50, C: 50 };

    // Use fixed keys to ensure two distinct datasets regardless of names
    return [
      {
        subject: t.dimensions.dominance,
        personA: discA.D ?? 50,
        personB: discB.D ?? 50,
        fullMark: 100,
      },
      {
        subject: t.dimensions.influence,
        personA: discA.I ?? 50,
        personB: discB.I ?? 50,
        fullMark: 100,
      },
      {
        subject: t.dimensions.stability,
        personA: discA.S ?? 50,
        personB: discB.S ?? 50,
        fullMark: 100,
      },
      {
        subject: t.dimensions.conformity,
        personA: discA.C ?? 50,
        personB: discB.C ?? 50,
        fullMark: 100,
      },
    ];
  }, [profileA.disc, profileB.disc, t]);

  // Ensure names are distinct for legend display
  const nameA = profileA.name || "Pessoa A";
  const nameB = profileB.name || "Pessoa B";

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
          <PolarGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground)/0.3)" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: 'hsl(var(--foreground))', fontSize: 11 }}
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 100]} 
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
            tickCount={5}
          />
          {/* Dataset A - Gold/Amber with semi-transparent fill */}
          <Radar
            name={nameA}
            dataKey="personA"
            stroke="hsl(45, 70%, 50%)"
            fill="hsl(45, 70%, 50%)"
            fillOpacity={0.35}
            strokeWidth={2.5}
          />
          {/* Dataset B - Purple/Indigo with semi-transparent fill */}
          <Radar
            name={nameB}
            dataKey="personB"
            stroke="hsl(260, 60%, 55%)"
            fill="hsl(260, 60%, 55%)"
            fillOpacity={0.35}
            strokeWidth={2.5}
          />
          <Legend 
            wrapperStyle={{ 
              paddingTop: '16px',
              fontSize: '13px'
            }}
            iconType="circle"
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
