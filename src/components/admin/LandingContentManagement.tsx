import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { 
  FileEdit, 
  Save, 
  Loader2,
  Info,
  Plus,
  Trash2,
  Eye
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
    description: "Título principal, subtítulo e botões de ação da home" 
  },
  about: { 
    label: "O que é o NELLO ONE", 
    icon: "ℹ️", 
    description: "Seção explicativa sobre o que é o NELLO ONE" 
  },
  "for-who": { 
    label: "Para Quem É", 
    icon: "👥", 
    description: "Perfis de público-alvo do NELLO ONE" 
  },
  testimonials: { 
    label: "Depoimentos", 
    icon: "💬", 
    description: "Depoimentos de clientes satisfeitos" 
  },
  faq: { 
    label: "Perguntas Frequentes", 
    icon: "❓", 
    description: "Perguntas e respostas sobre o NELLO ONE" 
  },
};

export const LandingContentManagement = () => {
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
      toast.success("Conteúdo salvo com sucesso!");
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
      <Card key={section.id}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-xl">{config?.icon || "📄"}</span>
            {config?.label || section.section}
          </CardTitle>
          <CardDescription>{config?.description || `Edite o conteúdo da seção ${section.section}`}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label>Título da Seção</Label>
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
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" asChild>
              <a href="/" target="_blank">
                <Eye className="w-4 h-4 mr-2" />
                Ver na Home
              </a>
            </Button>
            <Button onClick={() => handleSave(section)} disabled={saving === section.id}>
              {saving === section.id ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Salvar Alterações
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderHeroFields = (section: ContentSection) => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Subtítulo</Label>
        <Input
          value={section.content?.subtitle || ""}
          onChange={(e) => updateContentField(section.id, "subtitle", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label>Descrição</Label>
        <Textarea
          value={section.content?.description || ""}
          onChange={(e) => updateContentField(section.id, "description", e.target.value)}
          rows={3}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Texto Botão Principal</Label>
          <Input
            value={section.content?.primaryButtonText || ""}
            onChange={(e) => updateContentField(section.id, "primaryButtonText", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Texto Botão Secundário</Label>
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
        <Label>Parágrafos</Label>
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
      <div className="space-y-2">
        <Label>Localização</Label>
        <Input
          value={section.content?.location || ""}
          onChange={(e) => updateContentField(section.id, "location", e.target.value)}
        />
      </div>
    </div>
  );

  const renderForWhoFields = (section: ContentSection) => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Descrição da Seção</Label>
        <Textarea
          value={section.content?.description || ""}
          onChange={(e) => updateContentField(section.id, "description", e.target.value)}
          rows={2}
        />
      </div>
      <Label>Perfis</Label>
      <div className="space-y-4">
        {(section.content?.profiles || []).map((profile: any, i: number) => (
          <Card key={i} className="p-4">
            <div className="flex justify-between items-start mb-3">
              <span className="text-sm font-medium">Perfil {i + 1}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeArrayItem(section.id, "profiles", i)}
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
            <div className="space-y-3">
              <Input
                value={profile.icon || ""}
                onChange={(e) => updateArrayItem(section.id, "profiles", i, "icon", e.target.value)}
                placeholder="Ícone (emoji)"
              />
              <Input
                value={profile.title || ""}
                onChange={(e) => updateArrayItem(section.id, "profiles", i, "title", e.target.value)}
                placeholder="Título"
              />
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
      <div className="space-y-2">
        <Label>Descrição da Seção</Label>
        <Textarea
          value={section.content?.description || ""}
          onChange={(e) => updateContentField(section.id, "description", e.target.value)}
          rows={2}
        />
      </div>
      <Label>Depoimentos</Label>
      <div className="space-y-4">
        {(section.content?.testimonials || []).map((testimonial: any, i: number) => (
          <Card key={i} className="p-4">
            <div className="flex justify-between items-start mb-3">
              <span className="text-sm font-medium">Depoimento {i + 1}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeArrayItem(section.id, "testimonials", i)}
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  value={testimonial.name || ""}
                  onChange={(e) => updateArrayItem(section.id, "testimonials", i, "name", e.target.value)}
                  placeholder="Nome"
                />
                <Input
                  value={testimonial.role || ""}
                  onChange={(e) => updateArrayItem(section.id, "testimonials", i, "role", e.target.value)}
                  placeholder="Cargo/Função"
                />
              </div>
              <Textarea
                value={testimonial.text || ""}
                onChange={(e) => updateArrayItem(section.id, "testimonials", i, "text", e.target.value)}
                placeholder="Texto do depoimento"
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
      <div className="space-y-2">
        <Label>Descrição da Seção</Label>
        <Textarea
          value={section.content?.description || ""}
          onChange={(e) => updateContentField(section.id, "description", e.target.value)}
          rows={2}
        />
      </div>
      <div className="space-y-2">
        <Label>WhatsApp de Contato</Label>
        <Input
          value={section.content?.whatsapp || ""}
          onChange={(e) => updateContentField(section.id, "whatsapp", e.target.value)}
          placeholder="5511999999999"
        />
      </div>
      <Label>Perguntas e Respostas</Label>
      <div className="space-y-4">
        {(section.content?.items || []).map((item: any, i: number) => (
          <Card key={i} className="p-4">
            <div className="flex justify-between items-start mb-3">
              <span className="text-sm font-medium">Pergunta {i + 1}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeArrayItem(section.id, "items", i)}
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
            <div className="space-y-3">
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <FileEdit className="w-8 h-8" />
            Landing e Conteúdo
          </h2>
          <p className="text-muted-foreground">Edite todos os textos da página inicial</p>
        </div>
      </div>

      <Alert className="bg-primary/5 border-primary/20">
        <Info className="h-4 w-4" />
        <AlertDescription>
          Tudo que você alterar aqui atualiza a landing page do NELLO ONE. Revise com cuidado antes de salvar.
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full">
          {Object.entries(SECTION_CONFIG).map(([key, config]) => (
            <TabsTrigger key={key} value={key} className="gap-1">
              <span className="hidden sm:inline">{config.icon}</span>
              <span className="text-xs sm:text-sm">{config.label}</span>
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