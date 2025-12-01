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
  Bot, 
  Save, 
  Play, 
  RefreshCw, 
  Sparkles,
  Loader2,
  User,
  MessageSquare,
  FileText
} from "lucide-react";

interface AIPrompt {
  id: string;
  name: string;
  prompt_text: string;
  description: string | null;
  is_active: boolean;
}

interface AISubprompt {
  id: string;
  parent_prompt_id: string | null;
  name: string;
  category: string;
  prompt_text: string;
  is_active: boolean;
  priority: number;
}

export const MiguelAIManagement2 = () => {
  const [prompts, setPrompts] = useState<AIPrompt[]>([]);
  const [subprompts, setSubprompts] = useState<AISubprompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<AIPrompt | null>(null);
  const [playgroundInput, setPlaygroundInput] = useState("");
  const [playgroundOutput, setPlaygroundOutput] = useState("");
  const [playgroundLoading, setPlaygroundLoading] = useState(false);

  // Persona fields
  const [personaTitle, setPersonaTitle] = useState("Miguel");
  const [personaDescription, setPersonaDescription] = useState("Seu guia espiritual e emocional na jornada de autoconhecimento");
  const [personaTone, setPersonaTone] = useState("Acolhedor, profundo, humano");
  const [welcomeMessage, setWelcomeMessage] = useState("Olá! Sou Miguel, seu guia nesta jornada de autoconhecimento.");

  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    try {
      setLoading(true);
      
      const { data: promptsData, error: promptsError } = await supabase
        .from("ai_prompts")
        .select("*")
        .order("name");

      if (promptsError) throw promptsError;

      const { data: subpromptsData, error: subpromptsError } = await supabase
        .from("ai_subprompts")
        .select("*")
        .order("priority");

      if (subpromptsError) throw subpromptsError;

      setPrompts(promptsData || []);
      setSubprompts(subpromptsData || []);
      
      if (promptsData && promptsData.length > 0) {
        setEditingPrompt(promptsData[0]);
      }
    } catch (error) {
      console.error("Error fetching prompts:", error);
      toast.error("Erro ao carregar prompts");
    } finally {
      setLoading(false);
    }
  };

  const handleSavePrompt = async () => {
    if (!editingPrompt) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from("ai_prompts")
        .update({
          prompt_text: editingPrompt.prompt_text,
          description: editingPrompt.description,
          is_active: editingPrompt.is_active,
        })
        .eq("id", editingPrompt.id);

      if (error) throw error;
      
      toast.success("Prompt salvo");
      fetchPrompts();
    } catch (error) {
      console.error("Error saving prompt:", error);
      toast.error("Erro ao salvar prompt");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSubprompt = async (subprompt: AISubprompt) => {
    try {
      const { error } = await supabase
        .from("ai_subprompts")
        .update({
          prompt_text: subprompt.prompt_text,
          is_active: subprompt.is_active,
        })
        .eq("id", subprompt.id);

      if (error) throw error;
      
      toast.success("Subprompt salvo");
      fetchPrompts();
    } catch (error) {
      console.error("Error saving subprompt:", error);
      toast.error("Erro ao salvar subprompt");
    }
  };

  const handlePlayground = async () => {
    if (!playgroundInput.trim()) {
      toast.error("Digite uma mensagem para testar");
      return;
    }

    setPlaygroundLoading(true);
    setPlaygroundOutput("");

    try {
      const { data, error } = await supabase.functions.invoke("miguel-agent", {
        body: {
          message: playgroundInput,
          context: "playground",
        },
      });

      if (error) throw error;
      setPlaygroundOutput(data?.response || "Sem resposta");
    } catch (error) {
      console.error("Playground error:", error);
      toast.error("Erro ao testar prompt");
      setPlaygroundOutput("Erro ao processar mensagem");
    } finally {
      setPlaygroundLoading(false);
    }
  };

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      guia: "bg-blue-500/10 text-blue-600 border-blue-500/20",
      resultados: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
      mapa: "bg-violet-500/10 text-violet-600 border-violet-500/20",
      onboarding: "bg-amber-500/10 text-amber-600 border-amber-500/20",
      acolhimento: "bg-rose-500/10 text-rose-600 border-rose-500/20",
    };
    return colors[category] || "bg-muted text-muted-foreground";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
          <Bot className="w-6 h-6" />
          Miguel – IA
        </h1>
        <p className="text-muted-foreground text-sm">Configure a persona, prompts e comportamento do Miguel</p>
      </div>

      <Tabs defaultValue="persona" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="persona">Identidade</TabsTrigger>
          <TabsTrigger value="prompt">Prompt Base</TabsTrigger>
          <TabsTrigger value="subprompts">Subprompts</TabsTrigger>
          <TabsTrigger value="playground">Playground</TabsTrigger>
        </TabsList>

        {/* Persona Tab */}
        <TabsContent value="persona" className="space-y-4">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-5 h-5" />
                Identidade e Persona
              </CardTitle>
              <CardDescription>
                Configure como Miguel se apresenta e interage com os usuários
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Título de Apresentação</Label>
                  <Input
                    value={personaTitle}
                    onChange={(e) => setPersonaTitle(e.target.value)}
                    placeholder="Miguel"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tom de Voz</Label>
                  <Input
                    value={personaTone}
                    onChange={(e) => setPersonaTone(e.target.value)}
                    placeholder="Acolhedor, profundo, humano"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Descrição Curta</Label>
                <Textarea
                  value={personaDescription}
                  onChange={(e) => setPersonaDescription(e.target.value)}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>Mensagem de Boas-vindas</Label>
                <Textarea
                  value={welcomeMessage}
                  onChange={(e) => setWelcomeMessage(e.target.value)}
                  rows={3}
                />
              </div>
              <Button className="w-full">
                <Save className="w-4 h-4 mr-2" />
                Salvar Identidade
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Prompt Base Tab */}
        <TabsContent value="prompt" className="space-y-4">
          {editingPrompt && (
            <Card className="border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{editingPrompt.name}</CardTitle>
                  <Switch
                    checked={editingPrompt.is_active}
                    onCheckedChange={(checked) => setEditingPrompt({ ...editingPrompt, is_active: checked })}
                  />
                </div>
                <CardDescription>{editingPrompt.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Prompt Principal</Label>
                  <Textarea
                    value={editingPrompt.prompt_text}
                    onChange={(e) => setEditingPrompt({ ...editingPrompt, prompt_text: e.target.value })}
                    rows={12}
                    className="font-mono text-sm"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={fetchPrompts}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Resetar
                  </Button>
                  <Button onClick={handleSavePrompt} disabled={saving}>
                    {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                    Salvar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Subprompts Tab */}
        <TabsContent value="subprompts" className="space-y-4">
          {subprompts.map((sp) => (
            <Card key={sp.id} className="border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base">{sp.name}</CardTitle>
                    <Badge variant="outline" className={getCategoryBadge(sp.category)}>
                      {sp.category}
                    </Badge>
                  </div>
                  <Switch
                    checked={sp.is_active}
                    onCheckedChange={(checked) => {
                      const updated = { ...sp, is_active: checked };
                      handleSaveSubprompt(updated);
                    }}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={sp.prompt_text}
                  onChange={(e) => {
                    setSubprompts(prev => prev.map(s => s.id === sp.id ? { ...s, prompt_text: e.target.value } : s));
                  }}
                  rows={4}
                  className="font-mono text-sm"
                />
                <div className="flex justify-end mt-3">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleSaveSubprompt(subprompts.find(s => s.id === sp.id) || sp)}
                  >
                    <Save className="w-3 h-3 mr-1" />
                    Salvar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {subprompts.length === 0 && (
            <Card className="p-8 text-center text-muted-foreground border-border/50">
              Nenhum subprompt cadastrado
            </Card>
          )}
        </TabsContent>

        {/* Playground Tab */}
        <TabsContent value="playground" className="space-y-4">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Playground do Miguel
              </CardTitle>
              <CardDescription>Teste prompts em tempo real</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Sua mensagem de teste</Label>
                <Textarea
                  placeholder="Digite uma mensagem para testar o Miguel..."
                  value={playgroundInput}
                  onChange={(e) => setPlaygroundInput(e.target.value)}
                  rows={4}
                />
              </div>
              <Button onClick={handlePlayground} disabled={playgroundLoading} className="w-full">
                {playgroundLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Play className="w-4 h-4 mr-2" />
                )}
                Testar
              </Button>
              {playgroundOutput && (
                <div className="space-y-2">
                  <Label>Resposta do Miguel</Label>
                  <div className="p-4 bg-muted/50 rounded-lg border border-border/50">
                    <p className="whitespace-pre-wrap text-sm">{playgroundOutput}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
