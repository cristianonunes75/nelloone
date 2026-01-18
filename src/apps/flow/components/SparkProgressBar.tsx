import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SparkProgressBarProps {
  value: number;
  max: number;
  showSpark?: boolean;
  label?: string;
  className?: string;
}

export function SparkProgressBar({ 
  value, 
  max, 
  showSpark = false,
  label,
  className 
}: SparkProgressBarProps) {
  const [animate, setAnimate] = useState(false);
  const percentage = max > 0 ? (value / max) * 100 : 0;
  
  useEffect(() => {
    if (showSpark && value === 1 && max >= 1) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [value, max, showSpark]);
  
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">{label}</span>
          <span className="text-white font-medium">{value}/{max}</span>
        </div>
      )}
      
      <div className="relative h-3 bg-slate-800 rounded-full overflow-hidden">
        {/* Progress fill */}
        <div 
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            animate 
              ? "bg-gradient-to-r from-violet-500 via-fuchsia-500 to-amber-400" 
              : "bg-gradient-to-r from-violet-500 to-fuchsia-500"
          )}
          style={{ width: `${percentage}%` }}
        />
        
        {/* Shimmer effect when first task is complete */}
        {animate && (
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </div>
        )}
        
        {/* Spark icon at progress edge */}
        {animate && (
          <div 
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10"
            style={{ left: `${percentage}%` }}
          >
            <Sparkles className="w-5 h-5 text-amber-400 animate-pulse drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
          </div>
        )}
      </div>
      
      {/* Achievement message */}
      {animate && (
        <div className="text-center text-sm text-amber-400 font-medium animate-fade-in">
          ✨ Primeira tarefa do dia concluída! Você quebrou a inércia.
        </div>
      )}
    </div>
  );
}
