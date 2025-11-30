import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { 
  FileText, 
  Save, 
  Image,
  Type,
  Moon,
  Sun,
  Loader2,
  RefreshCw,
  Eye
} from "lucide-react";

interface ContentSection {
  id: string;
  section: string;
  title: string | null;
  content: any;
}

export const DynamicContentManagement = () => {
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

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
      const { error } = await supabase
        .from("home_content")
        .update({
          title: section.title,
          content: section.content,
        })
        .eq("id", section.id);

      if (error) throw error;
      toast.success("Conteúdo salvo com sucesso");
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

  const getSectionIcon = (section: string) => {
    switch (section) {
      case "hero": return "🏠";
      case "about": return "ℹ️";
      case "for-who": return "👥";
      case "testimonials": return "💬";
      case "faq": return "❓";
      default: return "📄";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <FileText className="w-8 h-8" />
            Conteúdo Dinâmico
          </h2>
          <p className="text-muted-foreground">Edite textos e conteúdos sem mexer em código</p>
        </div>
        <Button variant="outline" onClick={fetchContent}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Atualizar
        </Button>
      </div>

      <Tabs defaultValue="landing" className="space-y-6">
        <TabsList>
          <TabsTrigger value="landing">Landing Page</TabsTrigger>
          <TabsTrigger value="tests">Textos dos Testes</TabsTrigger>
          <TabsTrigger value="results">Textos de Resultados</TabsTrigger>
          <TabsTrigger value="theme">Tema</TabsTrigger>
        </TabsList>

        <TabsContent value="landing" className="space-y-4">
          {sections.map((section) => (
            <Card key={section.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-xl">{getSectionIcon(section.section)}</span>
                  {section.title || section.section}
                </CardTitle>
                <CardDescription>Seção: {section.section}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Título da Seção</Label>
                  <Input
                    value={section.title || ""}
                    onChange={(e) => updateSection(section.id, "title", e.target.value)}
                    placeholder="Título..."
                  />
                </div>
                
                {typeof section.content === 'object' && (
                  <div className="space-y-4">
                    {Object.entries(section.content).map(([key, value]) => (
                      <div key={key} className="space-y-2">
                        <Label className="capitalize">{key.replace(/_/g, ' ')}</Label>
                        {typeof value === 'string' && value.length > 100 ? (
                          <Textarea
                            value={value as string}
                            onChange={(e) => updateContentField(section.id, key, e.target.value)}
                            rows={4}
                          />
                        ) : typeof value === 'string' ? (
                          <Input
                            value={value as string}
                            onChange={(e) => updateContentField(section.id, key, e.target.value)}
                          />
                        ) : (
                          <pre className="p-2 bg-muted rounded text-xs overflow-auto">
                            {JSON.stringify(value, null, 2)}
                          </pre>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" asChild>
                    <a href="/" target="_blank">
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </a>
                  </Button>
                  <Button onClick={() => handleSave(section)} disabled={saving === section.id}>
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
          ))}
        </TabsContent>

        <TabsContent value="tests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Textos dos Testes</CardTitle>
              <CardDescription>Edite descrições e instruções dos testes</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Use a seção "Testes & Perguntas" para editar descrições de testes individuais.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Textos de Resultados</CardTitle>
              <CardDescription>Configure templates de resultados e interpretações</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Os textos de resultados são gerados dinamicamente pelo Miguel com base nos prompts configurados.
                Ajuste os prompts na seção "Miguel – Controle da IA" para personalizar as interpretações.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="theme" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card className="cursor-pointer hover:border-primary transition-colors">
              <CardContent className="pt-6 text-center">
                <Sun className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
                <h3 className="font-semibold">Modo Ivory</h3>
                <p className="text-sm text-muted-foreground">Tema claro e elegante</p>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:border-primary transition-colors">
              <CardContent className="pt-6 text-center">
                <Moon className="w-12 h-12 mx-auto mb-4 text-blue-500" />
                <h3 className="font-semibold">Modo Escuro</h3>
                <p className="text-sm text-muted-foreground">Tema escuro sofisticado</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
