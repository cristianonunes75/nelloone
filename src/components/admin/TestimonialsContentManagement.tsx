import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useHomeContent } from "@/hooks/useHomeContent";
import { Loader2, Save, Plus, Trash2 } from "lucide-react";

interface Testimonial {
  name: string;
  role: string;
  text: string;
  image: string;
}

export const TestimonialsContentManagement = () => {
  const { content, isLoading, updateContent, isUpdating } = useHomeContent("testimonials");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    if (content?.content) {
      setTitle(content.title);
      setDescription((content.content as any).description || "");
      setTestimonials((content.content as any).items || []);
    }
  }, [content]);

  const handleAddTestimonial = () => {
    setTestimonials([...testimonials, { name: "", role: "", text: "", image: "👤" }]);
  };

  const handleRemoveTestimonial = (index: number) => {
    setTestimonials(testimonials.filter((_, i) => i !== index));
  };

  const handleTestimonialChange = (index: number, field: keyof Testimonial, value: string) => {
    const newTestimonials = [...testimonials];
    newTestimonials[index] = { ...newTestimonials[index], [field]: value };
    setTestimonials(newTestimonials);
  };

  const handleSave = () => {
    updateContent({
      title,
      content: {
        description,
        items: testimonials.filter(t => t.name.trim() !== ""),
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
        <CardTitle>Editar Depoimentos</CardTitle>
        <CardDescription>
          Gerencie os depoimentos exibidos na página inicial
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="O que dizem sobre o"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Depoimentos</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddTestimonial}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Adicionar Depoimento
            </Button>
          </div>

          {testimonials.map((testimonial, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label>Emoji</Label>
                    <Input
                      value={testimonial.image}
                      onChange={(e) => handleTestimonialChange(index, "image", e.target.value)}
                      placeholder="👤"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Nome</Label>
                    <Input
                      value={testimonial.name}
                      onChange={(e) => handleTestimonialChange(index, "name", e.target.value)}
                      placeholder="Nome completo"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Profissão</Label>
                    <Input
                      value={testimonial.role}
                      onChange={(e) => handleTestimonialChange(index, "role", e.target.value)}
                      placeholder="Cargo ou profissão"
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveTestimonial(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-1">
                <Label>Depoimento</Label>
                <Textarea
                  value={testimonial.text}
                  onChange={(e) => handleTestimonialChange(index, "text", e.target.value)}
                  placeholder="Texto completo do depoimento..."
                  rows={3}
                />
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