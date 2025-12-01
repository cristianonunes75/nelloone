import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { 
  FileEdit, 
  Save, 
  Loader2,
  Plus,
  Trash2,
  Eye,
  ExternalLink
} from "lucide-react";

interface ContentSection {
  id: string;
  section: string;
  title: string | null;
  content: any;
}

const SECTION_CONFIG: Record<string, { label: string; icon: string; description: string }> = {
  hero: { 
    label: "Hero", 
    icon: "🏠", 
    description: "Título principal e chamada para ação" 
  },
  about: { 
    label: "O que é o Essentia", 
    icon: "✨", 
    description: "Descrição do produto" 
  },
  "how-it-works": {
    label: "Como Funciona",
    icon: "🔄",
    description: "Etapas da jornada"
  },
  "for-who": { 
    label: "Para Quem É", 
    icon: "👥", 
    description: "Perfis de público-alvo" 
  },
  testimonials: { 
    label: "Depoimentos", 
    icon: "💬", 
    description: "Depoimentos de clientes" 
  },
  miguel: {
    label: "Miguel – O Guia",
    icon: "🤖",
    description: "Seção sobre o assistente IA"
  },
  faq: { 
    label: "FAQ", 
    icon: "❓", 
    description: "Perguntas frequentes" 
  },
  cta: {
    label: "CTA Final",
    icon: "🎯",
    description: "Chamada final para ação"
  },
  footer: {
    label: "Rodapé",
    icon: "📜",
    description: "Links e informações do rodapé"
  },
};

export const LandingContentManagement2 = () => {
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("hero");

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("home_content")
        .select("*")
        .order("section");

      if (error) throw error;
      setSections(data || []);
    } catch (error) {
      console.error("Error fetching content:", error);
      toast.error("Erro ao carregar conteúdo");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (section: ContentSection) => {
    setSaving(section.id);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from("home_content")
        .update({
          title: section.title,
          content: section.content,
          updated_by: user?.id,
        })
        .eq("id", section.id);

      if (error) throw error;
      toast.success("Conteúdo salvo!");
    } catch (error) {
      console.error("Error saving content:", error);
      toast.error("Erro ao salvar conteúdo");
    } finally {
      setSaving(null);
    }
  };

  const updateSection = (id: string, field: string, value: any) => {
    setSections(prev => prev.map(s => 
      s.id === id ? { ...s, [field]: value } : s
    ));
  };

  const updateContentField = (id: string, field: string, value: any) => {
    setSections(prev => prev.map(s => 
      s.id === id ? { ...s, content: { ...s.content, [field]: value } } : s
    ));
  };

  const updateArrayItem = (sectionId: string, arrayField: string, index: number, itemField: string, value: any) => {
    setSections(prev => prev.map(s => {
      if (s.id !== sectionId) return s;
      const newArray = [...(s.content[arrayField] || [])];
      newArray[index] = { ...newArray[index], [itemField]: value };
      return { ...s, content: { ...s.content, [arrayField]: newArray } };
    }));
  };

  const addArrayItem = (sectionId: string, arrayField: string, template: any) => {
    setSections(prev => prev.map(s => {
      if (s.id !== sectionId) return s;
      const newArray = [...(s.content[arrayField] || []), template];
      return { ...s, content: { ...s.content, [arrayField]: newArray } };
    }));
  };

  const removeArrayItem = (sectionId: string, arrayField: string, index: number) => {
    setSections(prev => prev.map(s => {
      if (s.id !== sectionId) return s;
      const newArray = (s.content[arrayField] || []).filter((_: any, i: number) => i !== index);
      return { ...s, content: { ...s.content, [arrayField]: newArray } };
    }));
  };

  const renderSectionEditor = (section: ContentSection) => {
    const config = SECTION_CONFIG[section.section];
    
    return (
      <Card key={section.id} className="border-border/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <span>{config?.icon || "📄"}</span>
            {config?.label || section.section}
          </CardTitle>
          <CardDescription>{config?.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Título da Seção</Label>
            <Input
              value={section.title || ""}
              onChange={(e) => updateSection(section.id, "title", e.target.value)}
              placeholder="Título..."
            />
          </div>

          {/* Content fields based on section type */}
          {section.section === "hero" && renderHeroFields(section)}
          {section.section === "about" && renderAboutFields(section)}
          {section.section === "for-who" && renderForWhoFields(section)}
          {section.section === "testimonials" && renderTestimonialsFields(section)}
          {section.section === "faq" && renderFaqFields(section)}

          {/* Save button */}
          <div className="flex justify-end gap-2 pt-4 border-t border-border/50">
            <Button variant="outline" size="sm" asChild>
              <a href="/" target="_blank">
                <ExternalLink className="w-4 h-4 mr-2" />
                Ver na Home
              </a>
            </Button>
            <Button size="sm" onClick={() => handleSave(section)} disabled={saving === section.id}>
              {saving === section.id ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Salvar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderHeroFields = (section: ContentSection) => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Subtítulo</Label>
        <Input
          value={section.content?.subtitle || ""}
          onChange={(e) => updateContentField(section.id, "subtitle", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Descrição</Label>
        <Textarea
          value={section.content?.description || ""}
          onChange={(e) => updateContentField(section.id, "description", e.target.value)}
          rows={3}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Botão Principal</Label>
          <Input
            value={section.content?.primaryButtonText || ""}
            onChange={(e) => updateContentField(section.id, "primaryButtonText", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Botão Secundário</Label>
          <Input
            value={section.content?.secondaryButtonText || ""}
            onChange={(e) => updateContentField(section.id, "secondaryButtonText", e.target.value)}
          />
        </div>
      </div>
    </div>
  );

  const renderAboutFields = (section: ContentSection) => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Parágrafos</Label>
        {(section.content?.paragraphs || []).map((p: string, i: number) => (
          <div key={i} className="flex gap-2">
            <Textarea
              value={p}
              onChange={(e) => {
                const newParagraphs = [...(section.content?.paragraphs || [])];
                newParagraphs[i] = e.target.value;
                updateContentField(section.id, "paragraphs", newParagraphs);
              }}
              rows={2}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                const newParagraphs = (section.content?.paragraphs || []).filter((_: any, idx: number) => idx !== i);
                updateContentField(section.id, "paragraphs", newParagraphs);
              }}
            >
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const newParagraphs = [...(section.content?.paragraphs || []), ""];
            updateContentField(section.id, "paragraphs", newParagraphs);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Parágrafo
        </Button>
      </div>
    </div>
  );

  const renderForWhoFields = (section: ContentSection) => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Descrição</Label>
        <Textarea
          value={section.content?.description || ""}
          onChange={(e) => updateContentField(section.id, "description", e.target.value)}
          rows={2}
        />
      </div>
      <Label className="text-xs text-muted-foreground">Perfis</Label>
      <div className="space-y-3">
        {(section.content?.profiles || []).map((profile: any, i: number) => (
          <Card key={i} className="p-3 bg-muted/30">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs text-muted-foreground">Perfil {i + 1}</span>
              <Button variant="ghost" size="sm" onClick={() => removeArrayItem(section.id, "profiles", i)}>
                <Trash2 className="w-3 h-3 text-destructive" />
              </Button>
            </div>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Input
                  value={profile.icon || ""}
                  onChange={(e) => updateArrayItem(section.id, "profiles", i, "icon", e.target.value)}
                  placeholder="Ícone"
                />
                <Input
                  value={profile.title || ""}
                  onChange={(e) => updateArrayItem(section.id, "profiles", i, "title", e.target.value)}
                  placeholder="Título"
                />
              </div>
              <Textarea
                value={profile.description || ""}
                onChange={(e) => updateArrayItem(section.id, "profiles", i, "description", e.target.value)}
                placeholder="Descrição"
                rows={2}
              />
            </div>
          </Card>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => addArrayItem(section.id, "profiles", { icon: "✨", title: "", description: "" })}
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Perfil
        </Button>
      </div>
    </div>
  );

  const renderTestimonialsFields = (section: ContentSection) => (
    <div className="space-y-4">
      <Label className="text-xs text-muted-foreground">Depoimentos</Label>
      <div className="space-y-3">
        {(section.content?.testimonials || []).map((testimonial: any, i: number) => (
          <Card key={i} className="p-3 bg-muted/30">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs text-muted-foreground">Depoimento {i + 1}</span>
              <Button variant="ghost" size="sm" onClick={() => removeArrayItem(section.id, "testimonials", i)}>
                <Trash2 className="w-3 h-3 text-destructive" />
              </Button>
            </div>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Input
                  value={testimonial.name || ""}
                  onChange={(e) => updateArrayItem(section.id, "testimonials", i, "name", e.target.value)}
                  placeholder="Nome"
                />
                <Input
                  value={testimonial.role || ""}
                  onChange={(e) => updateArrayItem(section.id, "testimonials", i, "role", e.target.value)}
                  placeholder="Cargo"
                />
              </div>
              <Textarea
                value={testimonial.text || ""}
                onChange={(e) => updateArrayItem(section.id, "testimonials", i, "text", e.target.value)}
                placeholder="Depoimento"
                rows={3}
              />
            </div>
          </Card>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => addArrayItem(section.id, "testimonials", { name: "", role: "", text: "" })}
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Depoimento
        </Button>
      </div>
    </div>
  );

  const renderFaqFields = (section: ContentSection) => (
    <div className="space-y-4">
      <Label className="text-xs text-muted-foreground">Perguntas e Respostas</Label>
      <div className="space-y-3">
        {(section.content?.items || []).map((item: any, i: number) => (
          <Card key={i} className="p-3 bg-muted/30">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs text-muted-foreground">Pergunta {i + 1}</span>
              <Button variant="ghost" size="sm" onClick={() => removeArrayItem(section.id, "items", i)}>
                <Trash2 className="w-3 h-3 text-destructive" />
              </Button>
            </div>
            <div className="space-y-2">
              <Input
                value={item.question || ""}
                onChange={(e) => updateArrayItem(section.id, "items", i, "question", e.target.value)}
                placeholder="Pergunta"
              />
              <Textarea
                value={item.answer || ""}
                onChange={(e) => updateArrayItem(section.id, "items", i, "answer", e.target.value)}
                placeholder="Resposta"
                rows={3}
              />
            </div>
          </Card>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => addArrayItem(section.id, "items", { question: "", answer: "" })}
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Pergunta
        </Button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const availableSections = sections.filter(s => SECTION_CONFIG[s.section]);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
          <FileEdit className="w-6 h-6" />
          Landing & Conteúdo
        </h1>
        <p className="text-muted-foreground text-sm">Edite todos os textos da página inicial</p>
      </div>

      {/* Info */}
      <Card className="p-4 bg-amber-500/5 border-amber-500/20">
        <p className="text-sm text-amber-800">
          Tudo que você alterar aqui atualiza a landing page do Essentia. Revise com cuidado antes de salvar.
        </p>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/50 p-1">
          {Object.entries(SECTION_CONFIG).map(([key, config]) => (
            <TabsTrigger key={key} value={key} className="text-xs px-3 py-1.5">
              <span className="mr-1">{config.icon}</span>
              {config.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {availableSections.map((section) => (
          <TabsContent key={section.id} value={section.section}>
            {renderSectionEditor(section)}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
