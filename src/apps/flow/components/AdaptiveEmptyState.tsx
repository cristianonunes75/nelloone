import { Sparkles, Target, Compass, Lightbulb, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useEssenceProfile, DoorType } from '../hooks/useEssenceProfile';

interface AdaptiveEmptyStateProps {
  onGenerateSuggestions?: () => void;
  isGenerating?: boolean;
}

const DOOR_ICONS: Record<DoorType, React.ReactNode> = {
  visionary: <Target className="w-12 h-12 text-amber-400" />,
  seeker: <Compass className="w-12 h-12 text-emerald-400" />,
  executor: <Lightbulb className="w-12 h-12 text-blue-400" />,
  unknown: <Sparkles className="w-12 h-12 text-violet-400" />,
};

const DOOR_GRADIENTS: Record<DoorType, string> = {
  visionary: 'from-amber-500/20 to-orange-500/20 border-amber-500/30',
  seeker: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30',
  executor: 'from-blue-500/20 to-indigo-500/20 border-blue-500/30',
  unknown: 'from-violet-500/20 to-fuchsia-500/20 border-violet-500/30',
};

export function AdaptiveEmptyState({ onGenerateSuggestions, isGenerating }: AdaptiveEmptyStateProps) {
  const { 
    doorType, 
    doorName, 
    doorIcon, 
    emptyStateMessage, 
    hasEssenceData,
    highlightedFeatures,
  } = useEssenceProfile();
  
  return (
    <div className={`p-8 rounded-2xl bg-gradient-to-br ${DOOR_GRADIENTS[doorType]} border text-center`}>
      <div className="flex justify-center mb-4">
        <div className="relative">
          {DOOR_ICONS[doorType]}
          <span className="absolute -top-1 -right-1 text-2xl">{doorIcon}</span>
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-white mb-2">
        {emptyStateMessage}
      </h3>
      
      {hasEssenceData && (
        <p className="text-slate-400 mb-4 text-sm">
          Você foi identificado como <span className="text-white font-medium">{doorName}</span>
        </p>
      )}
      
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {highlightedFeatures.map((feature, i) => (
          <span 
            key={i}
            className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white/80"
          >
            {feature}
          </span>
        ))}
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/ideias">
          <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/20">
            Adicionar Ideia Manual
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
        
        {hasEssenceData && onGenerateSuggestions && (
          <Button 
            onClick={onGenerateSuggestions}
            disabled={isGenerating}
            className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Gerar sugestões baseadas na minha essência
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
