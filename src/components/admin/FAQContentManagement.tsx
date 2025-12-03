import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useHomeContent } from "@/hooks/useHomeContent";
import { Loader2, Save, Plus, Trash2 } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

export const FAQContentManagement = () => {
  const { content, isLoading, updateContent, isUpdating } = useHomeContent("faq");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [items, setItems] = useState<FAQItem[]>([]);

  useEffect(() => {
    if (content?.content) {
      setTitle(content.title);
      setDescription((content.content as any).description || "");
      setWhatsapp((content.content as any).whatsapp || "");
      setItems((content.content as any).items || []);
    }
  }, [content]);

  const handleAddItem = () => {
    setItems([...items, { question: "", answer: "" }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof FAQItem, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleSave = () => {
    updateContent({
      title,
      content: {
        description,
        whatsapp,
        items: items.filter(item => item.question.trim() !== ""),
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
        <CardTitle>Editar FAQ</CardTitle>
        <CardDescription>
          Gerencie as perguntas frequentes exibidas na página inicial
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Perguntas"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Subtítulo</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tire suas dúvidas sobre o NELLO ONE"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="whatsapp">WhatsApp (com DDI)</Label>
          <Input
            id="whatsapp"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="5511999999999"
          />
          <p className="text-xs text-muted-foreground">
            Exemplo: 5511999999999 (sem espaços ou símbolos)
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Perguntas e Respostas</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddItem}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Adicionar Pergunta
            </Button>
          </div>

          {items.map((item, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 space-y-3">
                  <div className="space-y-1">
                    <Label>Pergunta</Label>
                    <Input
                      value={item.question}
                      onChange={(e) => handleItemChange(index, "question", e.target.value)}
                      placeholder="Digite a pergunta..."
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Resposta</Label>
                    <Textarea
                      value={item.answer}
                      onChange={(e) => handleItemChange(index, "answer", e.target.value)}
                      placeholder="Digite a resposta..."
                      rows={3}
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveItem(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
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