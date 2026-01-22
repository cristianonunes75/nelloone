import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2, Check, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { 
  NelloProduct, 
  CardType, 
  CardFormat, 
  CardLanguage, 
  AICopySuggestion,
  PRODUCT_CONFIGS,
  TYPE_LABELS
} from "./types";

interface AIGeneratorPanelProps {
  product: NelloProduct;
  cardType: CardType;
  format: CardFormat;
  language: CardLanguage;
  onSuggestionSelect: (suggestion: AICopySuggestion) => void;
}

export const AIGeneratorPanel = ({
  product,
  cardType,
  format,
  language,
  onSuggestionSelect,
}: AIGeneratorPanelProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<AICopySuggestion[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const productConfig = PRODUCT_CONFIGS[product];

  const generateSuggestions = async () => {
    setIsGenerating(true);
    setSuggestions([]);
    setSelectedIndex(null);

    try {
      // Generate 3 suggestions in parallel
      const promises = Array.from({ length: 3 }).map(() =>
        supabase.functions.invoke("nello-post-factory", {
          body: {
            product,
            cardType,
            format,
            language,
            toneOfVoice: productConfig.toneOfVoice[language],
            productDescription: productConfig.description,
          },
        })
      );

      const results = await Promise.all(promises);
      const newSuggestions: AICopySuggestion[] = [];

      for (const result of results) {
        if (result.error) {
          console.error("AI generation error:", result.error);
          continue;
        }
        if (result.data) {
          newSuggestions.push(result.data);
        }
      }

      if (newSuggestions.length === 0) {
        throw new Error("Nenhuma sugestão gerada");
      }

      setSuggestions(newSuggestions);
      toast.success(`${newSuggestions.length} sugestões geradas!`);
    } catch (error) {
      console.error("Error generating suggestions:", error);
      toast.error("Erro ao gerar sugestões. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelect = (index: number) => {
    setSelectedIndex(index);
    onSuggestionSelect(suggestions[index]);
    toast.success("Sugestão aplicada!");
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-gold" />
            Gerar Copy com IA
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {productConfig.name}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Tipo: {TYPE_LABELS[language][cardType]}</span>
          <span>•</span>
          <span>Formato: {format}</span>
          <span>•</span>
          <span>{language === 'pt' ? 'Português' : 'English'}</span>
        </div>

        <Button
          onClick={generateSuggestions}
          disabled={isGenerating}
          className="w-full"
          variant="gold"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Gerando 3 sugestões...
            </>
          ) : suggestions.length > 0 ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Gerar novas sugestões
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Gerar Copy com IA
            </>
          )}
        </Button>

        {suggestions.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs font-medium text-muted-foreground">
              Selecione uma sugestão:
            </p>
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSelect(index)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  selectedIndex === index
                    ? "border-gold bg-gold/10"
                    : "border-border hover:border-gold/50 hover:bg-muted/50"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 space-y-1">
                    {suggestion.title && (
                      <p className="font-medium text-sm">{suggestion.title}</p>
                    )}
                    {suggestion.content && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {suggestion.content}
                      </p>
                    )}
                    {suggestion.cta && (
                      <Badge variant="secondary" className="text-xs mt-1">
                        {suggestion.cta}
                      </Badge>
                    )}
                  </div>
                  {selectedIndex === index && (
                    <Check className="w-4 h-4 text-gold flex-shrink-0" />
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
