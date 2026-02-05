import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

interface AnswerOption {
  value: string;
  label: string;
}

interface TestAnswerOptionsProps {
  testType: string;
  options: AnswerOption[];
  selectedAnswer: string;
  onAnswerChange: (value: string) => void;
  questionId?: string; // Used for consistent randomization per question
}

// Seeded random number generator for consistent shuffling
const seededRandom = (seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return () => {
    hash = (hash * 1103515245 + 12345) & 0x7fffffff;
    return hash / 0x7fffffff;
  };
};

// Shuffle array using Fisher-Yates with seeded randomization
const shuffleWithSeed = <T,>(array: T[], seed: string): T[] => {
  const result = [...array];
  const random = seededRandom(seed);
  
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  
  return result;
};

// Test-specific styling configurations with static Tailwind classes
const testStyles = {
  arquetipos: {
    layout: 'cards' as const,
    borderRadius: 'rounded-2xl',
    selectedBg: 'bg-violet-50',
    selectedBorder: 'border-violet-400',
    hoverBg: 'hover:bg-violet-50/50',
    iconBg: 'bg-violet-100',
    iconBgSelected: 'bg-violet-500',
    iconText: 'text-violet-500',
    badgeBg: 'bg-violet-500',
    badgeBgLight: 'bg-violet-100',
    badgeText: 'text-violet-600',
    dotBg: 'bg-violet-500',
    dotBorder: 'border-violet-500',
  },
  arquetipos_proposito: {
    layout: 'cards' as const,
    borderRadius: 'rounded-2xl',
    selectedBg: 'bg-violet-50',
    selectedBorder: 'border-violet-400',
    hoverBg: 'hover:bg-violet-50/50',
    iconBg: 'bg-violet-100',
    iconBgSelected: 'bg-violet-500',
    iconText: 'text-violet-500',
    badgeBg: 'bg-violet-500',
    badgeBgLight: 'bg-violet-100',
    badgeText: 'text-violet-600',
    dotBg: 'bg-violet-500',
    dotBorder: 'border-violet-500',
  },
  disc: {
    layout: 'grid' as const,
    borderRadius: 'rounded-xl',
    selectedBg: 'bg-blue-50',
    selectedBorder: 'border-blue-500',
    hoverBg: 'hover:bg-blue-50/50',
    iconBg: 'bg-blue-100',
    iconBgSelected: 'bg-blue-500',
    iconText: 'text-blue-500',
    badgeBg: 'bg-blue-500',
    badgeBgLight: 'bg-blue-100',
    badgeText: 'text-blue-600',
    dotBg: 'bg-blue-500',
    dotBorder: 'border-blue-500',
  },
  eneagrama: {
    layout: 'list' as const,
    borderRadius: 'rounded-lg',
    selectedBg: 'bg-purple-50',
    selectedBorder: 'border-purple-500',
    hoverBg: 'hover:bg-purple-50/50',
    iconBg: 'bg-purple-100',
    iconBgSelected: 'bg-purple-500',
    iconText: 'text-purple-500',
    badgeBg: 'bg-purple-500',
    badgeBgLight: 'bg-purple-100',
    badgeText: 'text-purple-600',
    dotBg: 'bg-purple-500',
    dotBorder: 'border-purple-500',
    borderLeft: 'border-l-purple-500',
  },
  temperamentos: {
    layout: 'buttons' as const,
    borderRadius: 'rounded-full',
    selectedBg: 'bg-amber-50',
    selectedBorder: 'border-amber-500',
    hoverBg: 'hover:bg-amber-50/50',
    iconBg: 'bg-amber-100',
    iconBgSelected: 'bg-amber-500',
    iconText: 'text-amber-500',
    badgeBg: 'bg-amber-500',
    badgeBgLight: 'bg-amber-100',
    badgeText: 'text-amber-600',
    dotBg: 'bg-amber-500',
    dotBorder: 'border-amber-500',
  },
  inteligencias_multiplas: {
    layout: 'grid' as const,
    borderRadius: 'rounded-xl',
    selectedBg: 'bg-emerald-50',
    selectedBorder: 'border-emerald-500',
    hoverBg: 'hover:bg-emerald-50/50',
    iconBg: 'bg-emerald-100',
    iconBgSelected: 'bg-emerald-500',
    iconText: 'text-emerald-500',
    badgeBg: 'bg-emerald-500',
    badgeBgLight: 'bg-emerald-100',
    badgeText: 'text-emerald-600',
    dotBg: 'bg-emerald-500',
    dotBorder: 'border-emerald-500',
  },
  linguagens_amor: {
    layout: 'cards' as const,
    borderRadius: 'rounded-3xl',
    selectedBg: 'bg-rose-50',
    selectedBorder: 'border-rose-400',
    hoverBg: 'hover:bg-rose-50/50',
    iconBg: 'bg-rose-100',
    iconBgSelected: 'bg-rose-500',
    iconText: 'text-rose-500',
    badgeBg: 'bg-rose-500',
    badgeBgLight: 'bg-rose-100',
    badgeText: 'text-rose-600',
    dotBg: 'bg-rose-500',
    dotBorder: 'border-rose-400',
  },
  solis: {
    layout: 'cards' as const,
    borderRadius: 'rounded-3xl',
    selectedBg: 'bg-rose-50',
    selectedBorder: 'border-rose-400',
    hoverBg: 'hover:bg-rose-50/50',
    iconBg: 'bg-rose-100',
    iconBgSelected: 'bg-rose-500',
    iconText: 'text-rose-500',
    badgeBg: 'bg-rose-500',
    badgeBgLight: 'bg-rose-100',
    badgeText: 'text-rose-600',
    dotBg: 'bg-rose-500',
    dotBorder: 'border-rose-400',
  },
  mbti: {
    layout: 'scale' as const,
    borderRadius: 'rounded-lg',
    selectedBg: 'bg-slate-100',
    selectedBorder: 'border-slate-500',
    hoverBg: 'hover:bg-slate-50',
    iconBg: 'bg-slate-200',
    iconBgSelected: 'bg-slate-500',
    iconText: 'text-slate-500',
    badgeBg: 'bg-slate-500',
    badgeBgLight: 'bg-slate-200',
    badgeText: 'text-slate-600',
    dotBg: 'bg-slate-500',
    dotBorder: 'border-slate-500',
  }
};

type TestStyleKey = keyof typeof testStyles;
type TestStyle = typeof testStyles[TestStyleKey];

const getStyle = (testType: string): TestStyle => {
  return testStyles[testType as TestStyleKey] || testStyles.disc;
};

// Cards Layout - Elegant cards with icons
const CardsLayout = ({ 
  options, 
  selectedAnswer, 
  onAnswerChange, 
  style 
}: { 
  options: AnswerOption[]; 
  selectedAnswer: string; 
  onAnswerChange: (v: string) => void;
  style: TestStyle;
}) => {
  return (
    <div className="space-y-4">
      {options.map((option, index) => {
        const value = String((option as any).value);
        const isSelected = selectedAnswer === value;
        
        return (
          <motion.div
            key={value}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              delay: index * 0.08,
              type: "spring",
              stiffness: 400,
              damping: 25
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
              relative flex items-center gap-4 p-5 border-2 cursor-pointer
              transition-colors duration-300 ${style.borderRadius}
              ${isSelected 
                ? `${style.selectedBg} ${style.selectedBorder} shadow-lg` 
                : `border-border ${style.hoverBg} hover:shadow-md`
              }
            `}
            onClick={() => onAnswerChange(value)}
          >
            {/* Neutral letter indicator instead of predictable icons */}
            <motion.div 
              animate={isSelected ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.3 }}
              className={`
                flex items-center justify-center w-12 h-12 rounded-xl text-lg font-medium transition-all duration-300
                ${isSelected 
                  ? `${style.iconBgSelected} text-white shadow-md` 
                  : `${style.iconBg} ${style.iconText}`
                }
              `}
            >
              {String.fromCharCode(65 + index)}
            </motion.div>
            
            {/* Content */}
            <div className="flex-1">
              <Label className="cursor-pointer font-light text-base leading-relaxed block">
                {option.label}
              </Label>
            </div>

            {/* Selection indicator */}
            <motion.div 
              animate={isSelected ? { scale: [1, 1.2, 1] } : { scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`
                w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                ${isSelected 
                  ? `${style.dotBorder} ${style.dotBg}` 
                  : 'border-muted'
                }
              `}
            >
              {isSelected && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-2 h-2 rounded-full bg-white" 
                />
              )}
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
};

// Grid Layout - 2-column grid for DISC-style tests
const GridLayout = ({ 
  options, 
  selectedAnswer, 
  onAnswerChange, 
  style 
}: { 
  options: AnswerOption[]; 
  selectedAnswer: string; 
  onAnswerChange: (v: string) => void;
  style: TestStyle;
}) => {
  const gradients = [
    'linear-gradient(90deg, #ef4444, #f97316)',
    'linear-gradient(90deg, #eab308, #84cc16)',
    'linear-gradient(90deg, #22c55e, #14b8a6)',
    'linear-gradient(90deg, #3b82f6, #8b5cf6)',
    'linear-gradient(90deg, #a855f7, #ec4899)'
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {options.map((option, index) => {
        const value = String((option as any).value);
        const isSelected = selectedAnswer === value;
        
        return (
          <motion.div
            key={value}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              delay: index * 0.06,
              type: "spring",
              stiffness: 400,
              damping: 25
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`
              relative p-5 border-2 cursor-pointer transition-colors duration-300
              ${style.borderRadius}
              ${isSelected 
                ? `${style.selectedBg} ${style.selectedBorder} shadow-lg` 
                : `border-border ${style.hoverBg} hover:shadow-md`
              }
            `}
            onClick={() => onAnswerChange(value)}
          >
            {/* Color accent bar */}
            <motion.div 
              className={`absolute top-0 left-0 right-0 h-1 rounded-t-xl`}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: isSelected ? 1 : 0.3, opacity: isSelected ? 1 : 0.3 }}
              transition={{ duration: 0.3 }}
              style={{ 
                background: gradients[index % gradients.length],
                transformOrigin: 'left'
              }}
            />
            
            {/* Letter badge */}
            <motion.div 
              animate={isSelected ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.3 }}
              className={`
                inline-flex items-center justify-center w-8 h-8 rounded-lg mb-3 text-sm font-semibold
                transition-colors
                ${isSelected 
                  ? `${style.badgeBg} text-white` 
                  : `${style.badgeBgLight} ${style.badgeText}`
                }
              `}
            >
              {String.fromCharCode(65 + index)}
            </motion.div>
            
            <Label className="cursor-pointer font-light text-sm leading-relaxed block">
              {option.label}
            </Label>

            {/* Radio indicator */}
            <RadioGroupItem 
              value={value} 
              id={value}
              className="absolute top-4 right-4"
            />
          </motion.div>
        );
      })}
    </div>
  );
};

// List Layout - Clean numbered list for Enneagram
const ListLayout = ({ 
  options, 
  selectedAnswer, 
  onAnswerChange, 
  style 
}: { 
  options: AnswerOption[]; 
  selectedAnswer: string; 
  onAnswerChange: (v: string) => void;
  style: TestStyle;
}) => (
  <div className="space-y-2">
    {options.map((option, index) => {
      const value = String((option as any).value);
      const isSelected = selectedAnswer === value;
      
      return (
        <div
          key={value}
          className={`
            flex items-center gap-4 p-4 border-l-4 cursor-pointer transition-all duration-200
            ${style.borderRadius}
            ${isSelected 
              ? `${style.selectedBg} ${(style as any).borderLeft || 'border-l-purple-500'} shadow-sm` 
              : `bg-transparent border-l-transparent ${style.hoverBg}`
            }
          `}
          onClick={() => onAnswerChange(value)}
        >
          {/* Number */}
          <div className={`
            flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
            transition-all
            ${isSelected 
              ? `${style.badgeBg} text-white` 
              : `${style.badgeBgLight} ${style.badgeText}`
            }
          `}>
            {index + 1}
          </div>
          
          <Label className="flex-1 cursor-pointer font-light text-base leading-relaxed">
            {option.label}
          </Label>

          <RadioGroupItem value={value} id={value} />
        </div>
      );
    })}
  </div>
);

// Buttons Layout - Pill-shaped buttons for Temperaments
const ButtonsLayout = ({ 
  options, 
  selectedAnswer, 
  onAnswerChange, 
  style 
}: { 
  options: AnswerOption[]; 
  selectedAnswer: string; 
  onAnswerChange: (v: string) => void;
  style: TestStyle;
}) => {
  return (
    <div className="flex flex-col gap-3">
      {options.map((option, index) => {
        const value = String((option as any).value);
        const isSelected = selectedAnswer === value;
        
        return (
          <button
            key={value}
            type="button"
            className={`
              flex items-center gap-4 px-6 py-4 border-2 text-left
              transition-all duration-300 rounded-2xl
              ${isSelected 
                ? `${style.selectedBg} ${style.selectedBorder} shadow-lg scale-[1.02]` 
                : `border-border ${style.hoverBg} hover:shadow-md`
              }
            `}
            onClick={() => onAnswerChange(value)}
          >
            {/* Neutral letter indicator instead of predictable icons */}
            <div className={`
              flex items-center justify-center w-10 h-10 rounded-full text-base font-medium
              ${isSelected ? `${style.iconBgSelected} text-white` : `${style.iconBg} ${style.iconText}`}
            `}>
              {String.fromCharCode(65 + index)}
            </div>
            <span className="flex-1 font-light text-base">{option.label}</span>
            <div className={`
              w-5 h-5 rounded-full border-2 flex items-center justify-center
              ${isSelected ? style.dotBorder : 'border-muted'}
            `}>
              {isSelected && <div className={`w-2.5 h-2.5 rounded-full ${style.dotBg}`} />}
            </div>
          </button>
        );
      })}
    </div>
  );
};

// Scale Layout - Horizontal scale for MBTI-style tests
const ScaleLayout = ({ 
  options, 
  selectedAnswer, 
  onAnswerChange, 
  style 
}: { 
  options: AnswerOption[]; 
  selectedAnswer: string; 
  onAnswerChange: (v: string) => void;
  style: TestStyle;
}) => {
  // For scale-type questions, show options as dots/circles
  const isLikertScale = options.length <= 7 && options.every(o => !isNaN(Number(o.value)));
  
  if (isLikertScale) {
    return (
      <div className="py-6">
        {/* Labels */}
        <div className="flex justify-between text-sm text-muted-foreground mb-6 px-2">
          <span className="font-light">Discordo totalmente</span>
          <span className="font-light">Concordo totalmente</span>
        </div>
        
        {/* Scale dots */}
        <div className="flex justify-between items-center gap-2 px-4">
          {options.map((option, index) => {
            const value = String((option as any).value);
            const isSelected = selectedAnswer === value;
            const distanceFromCenter = Math.abs(index - Math.floor(options.length / 2));
            const baseSize = 48 - distanceFromCenter * 6;
            
            return (
              <button
                key={value}
                type="button"
                onClick={() => onAnswerChange(value)}
                className={`
                  rounded-full transition-all duration-300 flex items-center justify-center
                  border-2
                  ${isSelected 
                    ? `${style.dotBg} ${style.dotBorder} shadow-lg scale-110` 
                    : `${style.iconBg} border-transparent hover:scale-105`
                  }
                `}
                style={{ 
                  width: `${baseSize}px`, 
                  height: `${baseSize}px` 
                }}
              >
                {isSelected && <div className="w-3 h-3 rounded-full bg-white" />}
              </button>
            );
          })}
        </div>
        
        {/* Value indicator */}
        {selectedAnswer && (
          <div className="text-center mt-6 text-sm text-muted-foreground">
            <span className="px-3 py-1 bg-muted rounded-full">
              Resposta: <span className="font-medium">{selectedAnswer}</span>
            </span>
          </div>
        )}
      </div>
    );
  }
  
  // Fallback to vertical list for non-scale options
  return (
    <div className="space-y-3">
      {options.map((option, index) => {
        const value = String((option as any).value);
        const isSelected = selectedAnswer === value;
        
        return (
          <div
            key={value}
            className={`
              flex items-center gap-4 p-4 border-2 cursor-pointer transition-all duration-200
              ${style.borderRadius}
              ${isSelected 
                ? `${style.selectedBg} ${style.selectedBorder} shadow-md` 
                : `border-border ${style.hoverBg}`
              }
            `}
            onClick={() => onAnswerChange(value)}
          >
            {/* Dot indicator */}
            <div className={`
              w-4 h-4 rounded-full transition-all
              ${isSelected ? style.dotBg : style.iconBg}
            `} />
            
            <Label className="flex-1 cursor-pointer font-light text-base leading-relaxed">
              {option.label}
            </Label>

            <RadioGroupItem value={value} id={value} />
          </div>
        );
      })}
    </div>
  );
};

export default function TestAnswerOptions({
  testType,
  options,
  selectedAnswer,
  onAnswerChange,
  questionId
}: TestAnswerOptionsProps) {
  const style = getStyle(testType);
  
  // Shuffle options if questionId is provided (consistent per question)
  // Don't shuffle scale/likert type questions as order matters there
  const shouldShuffle = questionId && style.layout !== 'scale';
  const displayOptions = shouldShuffle 
    ? shuffleWithSeed(options, questionId) 
    : options;

  return (
    <RadioGroup value={selectedAnswer} onValueChange={onAnswerChange}>
      {style.layout === 'cards' && (
        <CardsLayout 
          options={displayOptions} 
          selectedAnswer={selectedAnswer} 
          onAnswerChange={onAnswerChange}
          style={style}
        />
      )}
      {style.layout === 'grid' && (
        <GridLayout 
          options={displayOptions} 
          selectedAnswer={selectedAnswer} 
          onAnswerChange={onAnswerChange}
          style={style}
        />
      )}
      {style.layout === 'list' && (
        <ListLayout 
          options={displayOptions} 
          selectedAnswer={selectedAnswer} 
          onAnswerChange={onAnswerChange}
          style={style}
        />
      )}
      {style.layout === 'buttons' && (
        <ButtonsLayout 
          options={displayOptions} 
          selectedAnswer={selectedAnswer} 
          onAnswerChange={onAnswerChange}
          style={style}
        />
      )}
      {style.layout === 'scale' && (
        <ScaleLayout 
          options={options} 
          selectedAnswer={selectedAnswer} 
          onAnswerChange={onAnswerChange}
          style={style}
        />
      )}
    </RadioGroup>
  );
}

// Export style helper for use in other components
export { getStyle, testStyles };
