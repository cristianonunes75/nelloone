import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useHomeContent } from "@/hooks/useHomeContent";
import { Loader2, Save } from "lucide-react";

export const HeroContentManagement = () => {
  const { content, isLoading, updateContent, isUpdating } = useHomeContent("hero");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [primaryButtonText, setPrimaryButtonText] = useState("");
  const [secondaryButtonText, setSecondaryButtonText] = useState("");

  useEffect(() => {
    if (content?.content) {
      setTitle(content.title);
      setSubtitle((content.content as any).subtitle || "");
      setDescription((content.content as any).description || "");
      setPrimaryButtonText((content.content as any).primaryButtonText || "");
      setSecondaryButtonText((content.content as any).secondaryButtonText || "");
    }
  }, [content]);

  const handleSave = () => {
    updateContent({
      title,
      content: {
        subtitle,
        description,
        primaryButtonText,
        secondaryButtonText,
      } as any,
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-gold" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Editar Seção Hero</CardTitle>
        <CardDescription>
          Gerencie o conteúdo exibido na primeira seção da página inicial
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Título Principal</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Sua imagem pode comunicar"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="subtitle">Subtítulo (em dourado)</Label>
          <Input
            id="subtitle"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="verdade, fé e autoridade"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Uma experiência completa de autoconhecimento..."
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="primaryBtn">Botão Primário</Label>
            <Input
              id="primaryBtn"
              value={primaryButtonText}
              onChange={(e) => setPrimaryButtonText(e.target.value)}
              placeholder="Comece sua jornada Essentia"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="secondaryBtn">Botão Secundário</Label>
            <Input
              id="secondaryBtn"
              value={secondaryButtonText}
              onChange={(e) => setSecondaryButtonText(e.target.value)}
              placeholder="Conheça o Essentia"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button
            onClick={handleSave}
            disabled={isUpdating}
            className="gap-2 bg-gold hover:bg-gold-dark"
          >
            {isUpdating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Salvar Alterações
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};