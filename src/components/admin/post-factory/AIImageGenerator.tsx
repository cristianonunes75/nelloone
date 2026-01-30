import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImageIcon, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface AIImageGeneratorProps {
  onImageGenerated: (imageUrl: string) => void;
}

export const AIImageGenerator = ({ onImageGenerated }: AIImageGeneratorProps) => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const generateImage = async () => {
    if (!prompt.trim()) {
      toast.error("Digite uma descrição para a imagem");
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-post-image", {
        body: { prompt: prompt.trim() }
      });

      if (error) throw error;
      
      if (data?.imageUrl) {
        setGeneratedImage(data.imageUrl);
        onImageGenerated(data.imageUrl);
        toast.success("Imagem gerada com sucesso!");
      } else {
        throw new Error("Nenhuma imagem retornada");
      }
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("Erro ao gerar imagem. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  const suggestedPrompts = [
    "Paisagem serena com montanhas ao pôr do sol, tons dourados e terrosos",
    "Pessoa em momento de reflexão, luz natural suave, minimalista",
    "Natureza contemplativa, floresta tranquila com raios de luz",
    "Céu noturno estrelado com silhueta de pessoa meditando",
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-nello-gold" />
          Gerar Imagem com IA
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-xs">Descrição da imagem</Label>
          <Textarea 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Descreva a imagem que deseja gerar..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Sugestões:</p>
          <div className="flex flex-wrap gap-1">
            {suggestedPrompts.map((suggestion, i) => (
              <button
                key={i}
                onClick={() => setPrompt(suggestion)}
                className="text-xs px-2 py-1 rounded-full bg-secondary hover:bg-secondary/80 transition-colors truncate max-w-full text-left"
                title={suggestion}
              >
                {suggestion.length > 40 ? suggestion.slice(0, 40) + "..." : suggestion}
              </button>
            ))}
          </div>
        </div>

        <Button
          onClick={generateImage}
          disabled={isGenerating || !prompt.trim()}
          className="w-full"
          variant="gold"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Gerando imagem...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Gerar Imagem
            </>
          )}
        </Button>

        {generatedImage && (
          <div className="mt-3 rounded-lg overflow-hidden border">
            <img 
              src={generatedImage} 
              alt="Imagem gerada" 
              className="w-full h-32 object-cover"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
