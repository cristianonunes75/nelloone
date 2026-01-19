import { useState } from 'react';
import { Sparkles, ArrowRight, Check, Loader2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEssenceProfile } from '../hooks/useEssenceProfile';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useFeatureUsage } from '@/hooks/useFeatureUsage';
import { FeatureUsageIndicator } from '@/components/monetization/FeatureUsageIndicator';
import { PremiumLock } from '@/components/monetization/PremiumLock';
import { useFlowSubscription } from '../hooks/useFlowSubscription';

interface Suggestion {
  title: string;
  description: string;
  firstStep: string;
}

interface EssenceSuggestionsProps {
  onSelectSuggestion?: (title: string, description: string) => void;
  suggestions?: Suggestion[];
  isLoading?: boolean;
  onGenerate?: () => void;
}

export function EssenceSuggestions({ 
  onSelectSuggestion,
  suggestions: externalSuggestions,
  isLoading: externalLoading,
  onGenerate,
}: EssenceSuggestionsProps) {
  const { user } = useAuth();
  const { usage, trackUsage, canUseFeature } = useFeatureUsage();
  const { isSubscribed, startCheckout } = useFlowSubscription();
  const { 
    doorName, 
    doorIcon, 
    suggestionsPrompt,
    dom,
    chamado,
    essencia,
    hasEssenceData,
  } = useEssenceProfile();
  
  const [suggestions, setSuggestions] = useState<Suggestion[]>(externalSuggestions || []);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  
  const displaySuggestions = externalSuggestions || suggestions;
  const loading = externalLoading || isLoading;
  
  const generateSuggestions = async () => {
    if (!hasEssenceData || !user) {
      toast.error('Complete seu Código da Essência primeiro');
      return;
    }

    // Check if user can use this feature
    if (!canUseFeature('flow_sparks')) {
      toast.error('Você atingiu o limite de centelhas. Assine o Nello Flow Pro para continuar.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Track usage before generating
      const tracked = await trackUsage('flow_sparks', { action: 'generate_suggestions' });
      if (!tracked && !isSubscribed) {
        toast.error('Limite atingido. Assine para continuar.');
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase.functions.invoke('flow-mentor', {
        body: { 
          message: `GERAR_SUGESTOES_CENTELHA`,
          userId: user.id,
          essenceContext: {
            dom,
            chamado,
            essencia,
          }
        },
      });
      
      if (error) throw error;
      
      // Parse suggestions from AI response
      const response = data?.response || '';
      const parsedSuggestions = parseSuggestionsFromResponse(response);
      
      if (parsedSuggestions.length > 0) {
        setSuggestions(parsedSuggestions);
      } else {
        toast.error('Não foi possível gerar sugestões. Tente novamente.');
      }
    } catch (error) {
      console.error('Error generating suggestions:', error);
      toast.error('Erro ao gerar sugestões');
    } finally {
      setIsLoading(false);
    }
  };
  
  const parseSuggestionsFromResponse = (response: string): Suggestion[] => {
    const suggestions: Suggestion[] = [];
    
    // Try to parse numbered list format
    const regex = /(\d+)\.\s*\*\*([^*]+)\*\*[:\s]*([^\n]+)(?:\n[^1-9\n]*primeiro\s*passo[:\s]*([^\n]+))?/gi;
    let match;
    
    while ((match = regex.exec(response)) !== null && suggestions.length < 3) {
      suggestions.push({
        title: match[2].trim(),
        description: match[3].trim(),
        firstStep: match[4]?.trim() || 'Dedique 15 minutos para explorar esta ideia',
      });
    }
    
    // Fallback: split by numbers
    if (suggestions.length === 0) {
      const lines = response.split(/\n/);
      let currentSuggestion: Partial<Suggestion> = {};
      
      for (const line of lines) {
        const numMatch = line.match(/^(\d+)[.\)]\s*(.+)/);
        if (numMatch && suggestions.length < 3) {
          if (currentSuggestion.title) {
            suggestions.push({
              title: currentSuggestion.title,
              description: currentSuggestion.description || '',
              firstStep: currentSuggestion.firstStep || 'Comece com 15 minutos de exploração',
            });
          }
          currentSuggestion = { title: numMatch[2].trim() };
        } else if (currentSuggestion.title && line.trim()) {
          if (!currentSuggestion.description) {
            currentSuggestion.description = line.trim();
          }
        }
      }
      
      if (currentSuggestion.title && suggestions.length < 3) {
        suggestions.push({
          title: currentSuggestion.title,
          description: currentSuggestion.description || '',
          firstStep: 'Comece com 15 minutos de exploração',
        });
      }
    }
    
    return suggestions;
  };
  
  const handleSelect = (index: number) => {
    setSelectedIndex(index);
    const suggestion = displaySuggestions[index];
    if (onSelectSuggestion) {
      onSelectSuggestion(suggestion.title, suggestion.description);
    }
  };
  
  if (!hasEssenceData) {
    return null;
  }
  
  const flowUsage = usage.flow_sparks;
  const canGenerate = canUseFeature('flow_sparks');

  // Show premium lock if limit reached
  if (!canGenerate && displaySuggestions.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span>Gerador de Centelhas</span>
            <span className="text-lg">{doorIcon}</span>
          </div>
          <FeatureUsageIndicator
            remaining={flowUsage.remaining}
            limit={flowUsage.limit}
            isPremium={flowUsage.isPremium}
            featureName="Centelhas"
            language="pt"
            compact
          />
        </div>
        
        <PremiumLock
          featureType="flow_sparks"
          language="pt"
          onUnlock={startCheckout}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Sparkles className="w-4 h-4 text-violet-400" />
          <span>Gerador de Centelhas</span>
          <span className="text-lg">{doorIcon}</span>
        </div>
        {!flowUsage.isPremium && (
          <FeatureUsageIndicator
            remaining={flowUsage.remaining}
            limit={flowUsage.limit}
            isPremium={flowUsage.isPremium}
            featureName="Centelhas"
            language="pt"
            compact
          />
        )}
      </div>
      
      {displaySuggestions.length === 0 ? (
        <Button
          onClick={onGenerate || generateSuggestions}
          disabled={loading || !canGenerate}
          className="w-full bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 hover:from-violet-500/30 hover:to-fuchsia-500/30 border border-violet-500/30 text-white"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Consultando sua essência...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Gerar sugestões baseadas na minha essência
            </>
          )}
        </Button>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-slate-300">{suggestionsPrompt}</p>
          
          {displaySuggestions.map((suggestion, index) => (
            <div
              key={index}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                selectedIndex === index
                  ? 'bg-violet-500/20 border-violet-500/50'
                  : 'bg-slate-800/50 border-slate-700/50 hover:border-violet-500/30'
              }`}
              onClick={() => handleSelect(index)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h4 className="font-medium text-white mb-1">{suggestion.title}</h4>
                  <p className="text-sm text-slate-400 mb-2">{suggestion.description}</p>
                  <div className="flex items-center gap-2 text-xs text-emerald-400">
                    <ArrowRight className="w-3 h-3" />
                    <span>Primeiro passo (15min): {suggestion.firstStep}</span>
                  </div>
                </div>
                {selectedIndex === index && (
                  <Check className="w-5 h-5 text-violet-400 flex-shrink-0" />
                )}
              </div>
            </div>
          ))}
          
          {selectedIndex !== null && onSelectSuggestion && (
            <Button
              onClick={() => handleSelect(selectedIndex)}
              className="w-full bg-violet-500 hover:bg-violet-600"
            >
              Usar esta ideia
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
