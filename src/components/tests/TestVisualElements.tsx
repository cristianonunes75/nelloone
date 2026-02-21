import { useMemo } from "react";
import { 
  Sparkles, Crown, Heart, Shield, Compass, Lightbulb, 
  Users, Target, Palette, Flame, Eye, Zap, Brain,
  Music, TreePine, MessageCircle, Hand, Footprints,
  Sun, Moon, Mountain, Waves, Wind, Star
} from "lucide-react";

interface TestVisualElementsProps {
  testType: string;
  currentQuestionIndex: number;
  totalQuestions: number;
  className?: string;
}

// Visual themes for each test type
const testThemes = {
  arquetipos: {
    name: "Arquétipos com Propósito",
    primaryColor: "hsl(var(--accent))",
    secondaryColor: "hsl(var(--lavender))",
    icons: [Crown, Shield, Heart, Sparkles, Compass, Lightbulb, Users, Target, Palette, Flame, Eye, Zap],
    gradientFrom: "from-violet-100",
    gradientTo: "to-purple-50",
    accentClass: "text-violet-600",
    bgPattern: "radial-gradient(circle at 20% 80%, hsl(var(--lavender)) 0%, transparent 50%), radial-gradient(circle at 80% 20%, hsl(var(--accent)) 0%, transparent 50%)"
  },
  arquetipos_proposito: {
    name: "Arquétipos com Propósito",
    primaryColor: "hsl(var(--accent))",
    secondaryColor: "hsl(var(--lavender))",
    icons: [Crown, Shield, Heart, Sparkles, Compass, Lightbulb, Users, Target, Palette, Flame, Eye, Zap],
    gradientFrom: "from-violet-100",
    gradientTo: "to-purple-50",
    accentClass: "text-violet-600",
    bgPattern: "radial-gradient(circle at 20% 80%, hsl(var(--lavender)) 0%, transparent 50%), radial-gradient(circle at 80% 20%, hsl(var(--accent)) 0%, transparent 50%)"
  },
  disc: {
    name: "DISC",
    primaryColor: "hsl(var(--primary))",
    secondaryColor: "hsl(var(--secondary))",
    icons: [Target, Users, Shield, Compass],
    gradientFrom: "from-blue-100",
    gradientTo: "to-cyan-50",
    accentClass: "text-blue-600",
    bgPattern: "linear-gradient(135deg, hsl(210 80% 95%) 0%, hsl(190 80% 95%) 100%)"
  },
  eneagrama: {
    name: "Eneagrama",
    primaryColor: "hsl(var(--founder-purple))",
    secondaryColor: "hsl(var(--founder-purple-light))",
    icons: [Star, Crown, Heart, Target, Eye, Shield, Sparkles, Compass, Flame],
    gradientFrom: "from-purple-100",
    gradientTo: "to-indigo-50",
    accentClass: "text-purple-600",
    bgPattern: "conic-gradient(from 0deg, hsl(280 50% 95%), hsl(260 50% 95%), hsl(240 50% 95%), hsl(280 50% 95%))"
  },
  temperamentos: {
    name: "Temperamentos",
    primaryColor: "hsl(var(--warning))",
    secondaryColor: "hsl(var(--secondary))",
    icons: [Flame, Wind, Mountain, Waves],
    gradientFrom: "from-amber-100",
    gradientTo: "to-orange-50",
    accentClass: "text-amber-600",
    bgPattern: "linear-gradient(45deg, hsl(38 80% 95%) 0%, hsl(28 80% 95%) 50%, hsl(18 80% 95%) 100%)"
  },
  inteligencias_multiplas: {
    name: "Inteligências Múltiplas",
    primaryColor: "hsl(var(--success))",
    secondaryColor: "hsl(var(--secondary))",
    icons: [Brain, Music, TreePine, Users, Compass, MessageCircle, Lightbulb, Footprints],
    gradientFrom: "from-emerald-100",
    gradientTo: "to-green-50",
    accentClass: "text-emerald-600",
    bgPattern: "radial-gradient(circle at 50% 50%, hsl(152 60% 95%) 0%, hsl(140 60% 95%) 100%)"
  },
  linguagens_amor: {
    name: "Estilos de Conexão Afetiva",
    primaryColor: "hsl(var(--destructive))",
    secondaryColor: "hsl(var(--accent))",
    icons: [Heart, MessageCircle, Hand, Star, Users],
    gradientFrom: "from-rose-100",
    gradientTo: "to-pink-50",
    accentClass: "text-rose-500",
    bgPattern: "radial-gradient(circle at 30% 70%, hsl(350 70% 95%) 0%, transparent 50%), radial-gradient(circle at 70% 30%, hsl(330 70% 95%) 0%, transparent 50%)"
  },
  solis: {
    name: "Estilos de Conexão Afetiva",
    primaryColor: "hsl(var(--destructive))",
    secondaryColor: "hsl(var(--accent))",
    icons: [Heart, MessageCircle, Hand, Star, Users],
    gradientFrom: "from-rose-100",
    gradientTo: "to-pink-50",
    accentClass: "text-rose-500",
    bgPattern: "radial-gradient(circle at 30% 70%, hsl(350 70% 95%) 0%, transparent 50%), radial-gradient(circle at 70% 30%, hsl(330 70% 95%) 0%, transparent 50%)"
  },
  mbti: {
    name: "Nello 16 Personality",
    primaryColor: "hsl(var(--ink-blue))",
    secondaryColor: "hsl(var(--bruma-blue))",
    icons: [Brain, Heart, Eye, Compass, Sun, Moon, Lightbulb, Users],
    gradientFrom: "from-slate-100",
    gradientTo: "to-blue-50",
    accentClass: "text-slate-600",
    bgPattern: "linear-gradient(180deg, hsl(210 30% 96%) 0%, hsl(220 30% 96%) 100%)"
  },
  nello16: {
    name: "Nello 16 Personality",
    primaryColor: "hsl(var(--ink-blue))",
    secondaryColor: "hsl(var(--bruma-blue))",
    icons: [Brain, Heart, Eye, Compass, Sun, Moon, Lightbulb, Users],
    gradientFrom: "from-slate-100",
    gradientTo: "to-blue-50",
    accentClass: "text-slate-600",
    bgPattern: "linear-gradient(180deg, hsl(210 30% 96%) 0%, hsl(220 30% 96%) 100%)"
  }
};

// Get theme for test type
const getTestTheme = (testType: string) => {
  return testThemes[testType as keyof typeof testThemes] || testThemes.disc;
};

// Floating icon component
const FloatingIcon = ({ 
  Icon, 
  delay, 
  size, 
  position,
  accentClass 
}: { 
  Icon: any; 
  delay: number; 
  size: number; 
  position: { top?: string; bottom?: string; left?: string; right?: string };
  accentClass: string;
}) => (
  <div 
    className={`absolute ${accentClass} opacity-20 animate-pulse`}
    style={{ 
      ...position,
      animationDelay: `${delay}ms`,
      animationDuration: '3s'
    }}
  >
    <Icon size={size} strokeWidth={1.5} />
  </div>
);

// Progress ring component
export const TestProgressRing = ({ 
  progress, 
  testType,
  size = 60 
}: { 
  progress: number; 
  testType: string;
  size?: number;
}) => {
  const theme = getTestTheme(testType);
  const circumference = 2 * Math.PI * 24;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size} viewBox="0 0 60 60">
        {/* Background circle */}
        <circle
          cx="30"
          cy="30"
          r="24"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          className="text-muted/30"
        />
        {/* Progress circle */}
        <circle
          cx="30"
          cy="30"
          r="24"
          fill="none"
          stroke={theme.primaryColor}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-xs font-medium ${theme.accentClass}`}>
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
};

// Question indicator with visual theme
export const TestQuestionIndicator = ({
  testType,
  currentIndex,
  total
}: {
  testType: string;
  currentIndex: number;
  total: number;
}) => {
  const theme = getTestTheme(testType);
  const visibleDots = Math.min(total, 10);
  const startDot = Math.max(0, Math.min(currentIndex - 4, total - visibleDots));

  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: visibleDots }).map((_, i) => {
        const dotIndex = startDot + i;
        const isActive = dotIndex === currentIndex;
        const isPast = dotIndex < currentIndex;
        
        return (
          <div
            key={dotIndex}
            className={`rounded-full transition-all duration-300 ${
              isActive 
                ? `w-6 h-2 ${theme.gradientFrom} ${theme.gradientTo} bg-gradient-to-r shadow-sm` 
                : isPast 
                  ? `w-2 h-2 ${theme.accentClass} opacity-60`
                  : 'w-2 h-2 bg-muted/40'
            }`}
            style={isActive ? { background: theme.bgPattern } : isPast ? { backgroundColor: theme.primaryColor, opacity: 0.6 } : {}}
          />
        );
      })}
      {total > visibleDots && (
        <span className="text-xs text-muted-foreground ml-1">
          +{total - visibleDots}
        </span>
      )}
    </div>
  );
};

// Background visual element
export const TestBackgroundVisual = ({
  testType,
  currentQuestionIndex
}: {
  testType: string;
  currentQuestionIndex: number;
}) => {
  const theme = getTestTheme(testType);
  const icons = theme.icons;
  
  // Select 3-4 icons based on question index for variety
  const selectedIcons = useMemo(() => {
    const iconCount = Math.min(4, icons.length);
    const startIndex = currentQuestionIndex % icons.length;
    return Array.from({ length: iconCount }).map((_, i) => 
      icons[(startIndex + i * 3) % icons.length]
    );
  }, [currentQuestionIndex, icons]);

  const positions = [
    { top: '10%', right: '5%' },
    { bottom: '15%', left: '5%' },
    { top: '50%', right: '8%' },
    { bottom: '30%', right: '12%' }
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Gradient background */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{ background: theme.bgPattern }}
      />
      
      {/* Floating icons */}
      {selectedIcons.map((Icon, i) => (
        <FloatingIcon
          key={`${currentQuestionIndex}-${i}`}
          Icon={Icon}
          delay={i * 500}
          size={24 + (i * 8)}
          position={positions[i]}
          accentClass={theme.accentClass}
        />
      ))}
    </div>
  );
};

// Test type badge
export const TestTypeBadge = ({ testType }: { testType: string }) => {
  const theme = getTestTheme(testType);
  const IconComponent = theme.icons[0];

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${theme.gradientFrom} ${theme.gradientTo} ${theme.accentClass}`}>
      <IconComponent size={14} strokeWidth={2} />
      <span className="text-xs font-medium">{theme.name}</span>
    </div>
  );
};

// Main visual elements wrapper
export default function TestVisualElements({
  testType,
  currentQuestionIndex,
  totalQuestions,
  className = ""
}: TestVisualElementsProps) {
  const theme = getTestTheme(testType);

  return (
    <div className={`relative ${className}`}>
      {/* Background visual */}
      <TestBackgroundVisual 
        testType={testType} 
        currentQuestionIndex={currentQuestionIndex} 
      />
      
      {/* Content overlay */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <TestTypeBadge testType={testType} />
          <TestProgressRing 
            progress={(currentQuestionIndex + 1) / totalQuestions * 100} 
            testType={testType}
          />
        </div>
        <TestQuestionIndicator
          testType={testType}
          currentIndex={currentQuestionIndex}
          total={totalQuestions}
        />
      </div>
    </div>
  );
}

// Visual decorations for specific test types
export const ArchetypeWheel = ({ className = "" }: { className?: string }) => (
  <div className={`relative w-32 h-32 ${className}`}>
    <svg viewBox="0 0 100 100" className="w-full h-full opacity-20">
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const x = 50 + 35 * Math.cos(angle);
        const y = 50 + 35 * Math.sin(angle);
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="6"
            className="fill-violet-300"
            style={{ animationDelay: `${i * 100}ms` }}
          />
        );
      })}
      <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="1" className="text-violet-200" />
    </svg>
  </div>
);

export const DISCQuadrant = ({ className = "" }: { className?: string }) => (
  <div className={`grid grid-cols-2 gap-1 w-24 h-24 opacity-20 ${className}`}>
    <div className="rounded-tl-lg bg-red-200" />
    <div className="rounded-tr-lg bg-yellow-200" />
    <div className="rounded-bl-lg bg-green-200" />
    <div className="rounded-br-lg bg-blue-200" />
  </div>
);

export const EnneagramSymbol = ({ className = "" }: { className?: string }) => (
  <div className={`relative w-28 h-28 ${className}`}>
    <svg viewBox="0 0 100 100" className="w-full h-full opacity-15">
      {/* Outer circle */}
      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" className="text-purple-300" />
      {/* 9 points */}
      {Array.from({ length: 9 }).map((_, i) => {
        const angle = (i * 40 - 90) * (Math.PI / 180);
        const x = 50 + 40 * Math.cos(angle);
        const y = 50 + 40 * Math.sin(angle);
        return (
          <circle key={i} cx={x} cy={y} r="5" className="fill-purple-300" />
        );
      })}
      {/* Inner triangle */}
      <polygon 
        points="50,10 15,80 85,80" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1" 
        className="text-purple-200"
      />
    </svg>
  </div>
);

export const TemperamentElements = ({ className = "" }: { className?: string }) => (
  <div className={`flex items-center gap-3 opacity-20 ${className}`}>
    <Flame size={24} className="text-red-300" />
    <Wind size={24} className="text-yellow-300" />
    <Mountain size={24} className="text-green-300" />
    <Waves size={24} className="text-blue-300" />
  </div>
);

export const IntelligenceGrid = ({ className = "" }: { className?: string }) => (
  <div className={`grid grid-cols-4 gap-2 opacity-15 ${className}`}>
    {[Brain, Music, TreePine, Users, Compass, MessageCircle, Lightbulb, Footprints].map((Icon, i) => (
      <div key={i} className="p-2 rounded bg-emerald-100 flex items-center justify-center">
        <Icon size={16} className="text-emerald-400" />
      </div>
    ))}
  </div>
);

export const ConnectionHearts = ({ className = "" }: { className?: string }) => (
  <div className={`flex items-center gap-2 opacity-20 ${className}`}>
    {[Heart, MessageCircle, Hand, Star, Users].map((Icon, i) => (
      <Icon key={i} size={20} className="text-rose-300" style={{ animationDelay: `${i * 200}ms` }} />
    ))}
  </div>
);
