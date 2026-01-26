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

    return [
      {
        subject: t.dimensions.dominance,
        [profileA.name]: discA.D || 50,
        [profileB.name]: discB.D || 50,
        fullMark: 100,
      },
      {
        subject: t.dimensions.influence,
        [profileA.name]: discA.I || 50,
        [profileB.name]: discB.I || 50,
        fullMark: 100,
      },
      {
        subject: t.dimensions.stability,
        [profileA.name]: discA.S || 50,
        [profileB.name]: discB.S || 50,
        fullMark: 100,
      },
      {
        subject: t.dimensions.conformity,
        [profileA.name]: discA.C || 50,
        [profileB.name]: discB.C || 50,
        fullMark: 100,
      },
    ];
  }, [profileA, profileB, t]);

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
          <PolarGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground)/0.3)" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: 'hsl(var(--foreground))', fontSize: 11 }}
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 100]} 
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
          />
          <Radar
            name={profileA.name}
            dataKey={profileA.name}
            stroke="rgb(212, 175, 55)"
            fill="rgb(212, 175, 55)"
            fillOpacity={0.3}
            strokeWidth={3}
          />
          <Radar
            name={profileB.name}
            dataKey={profileB.name}
            stroke="rgb(74, 74, 74)"
            fill="rgb(74, 74, 74)"
            fillOpacity={0.3}
            strokeWidth={3}
          />
          <Legend 
            wrapperStyle={{ 
              paddingTop: '10px',
              fontSize: '12px'
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
