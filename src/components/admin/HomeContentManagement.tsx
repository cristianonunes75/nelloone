import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useHomeContent } from "@/hooks/useHomeContent";
import { Loader2, Plus, Trash2, Save } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const HomeContentManagement = () => {
  const { content, isLoading, updateContent, isUpdating } = useHomeContent("about");
  const [title, setTitle] = useState("");
  const [paragraphs, setParagraphs] = useState<string[]>([]);
  const [location, setLocation] = useState("");

  useEffect(() => {
    if (content) {
      setTitle(content.title);
      setParagraphs(content.content.paragraphs);
      setLocation(content.content.location);
    }
  }, [content]);

  const handleAddParagraph = () => {
    setParagraphs([...paragraphs, ""]);
  };

  const handleRemoveParagraph = (index: number) => {
    setParagraphs(paragraphs.filter((_, i) => i !== index));
  };

  const handleParagraphChange = (index: number, value: string) => {
    const newParagraphs = [...paragraphs];
    newParagraphs[index] = value;
    setParagraphs(newParagraphs);
  };

  const handleSave = () => {
    updateContent({
      title,
      content: {
        paragraphs: paragraphs.filter(p => p.trim() !== ""),
        location,
      },
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Conteúdo da Home</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-gold" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Editar Conteúdo da Home</CardTitle>
        <CardDescription>
          Gerencie o texto exibido na seção "O que é o NELLO ONE?" da página inicial
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="O que é o"
          />
          <p className="text-xs text-muted-foreground">
            O texto "NELLO ONE" em dourado será adicionado automaticamente após o título
          </p>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Parágrafos</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddParagraph}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Adicionar Parágrafo
            </Button>
          </div>

          {paragraphs.map((paragraph, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <Label htmlFor={`paragraph-${index}`}>Parágrafo {index + 1}</Label>
                  <Textarea
                    id={`paragraph-${index}`}
                    value={paragraph}
                    onChange={(e) => handleParagraphChange(index, e.target.value)}
                    placeholder="Digite o conteúdo do parágrafo..."
                    rows={3}
                    className="mt-1"
                  />
                  {index === paragraphs.length - 1 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Este parágrafo será exibido em dourado com destaque
                    </p>
                  )}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveParagraph(index)}
                  className="mt-7 text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <Separator />

        <div className="space-y-2">
          <Label htmlFor="location">Texto de Localização</Label>
          <Input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Atendemos exclusivamente em Brasília-DF..."
          />
          <p className="text-xs text-muted-foreground">
            Este texto será exibido em itálico no final da seção
          </p>
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
