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
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { 
  Bot, 
  Save, 
  Play, 
  RefreshCw, 
  Settings,
  MessageSquare,
  Sparkles,
  Loader2,
  History,
  Trash2
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

export const MiguelAIManagement = () => {
  const [prompts, setPrompts] = useState<AIPrompt[]>([]);
  const [subprompts, setSubprompts] = useState<AISubprompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<AIPrompt | null>(null);
  const [editingSubprompt, setEditingSubprompt] = useState<AISubprompt | null>(null);
  const [playgroundInput, setPlaygroundInput] = useState("");
  const [playgroundOutput, setPlaygroundOutput] = useState("");
  const [playgroundLoading, setPlaygroundLoading] = useState(false);
  const [temperature, setTemperature] = useState([0.7]);
  const [maxTokens, setMaxTokens] = useState([2048]);

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
      
      toast.success("Prompt salvo com sucesso");
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
      const { data, error } = await supabase.functions.invoke("nello-agent", {
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
      guia: "bg-blue-500/10 text-blue-600",
      resultados: "bg-green-500/10 text-green-600",
      mapa: "bg-purple-500/10 text-purple-600",
      onboarding: "bg-yellow-500/10 text-yellow-600",
      acolhimento: "bg-pink-500/10 text-pink-600",
    };
    return colors[category] || "bg-gray-500/10 text-gray-600";
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
            <Bot className="w-8 h-8" />
            Nello AI – Controle da IA
          </h2>
          <p className="text-muted-foreground">Configure prompts, subprompts e comportamento do Nello AI</p>
        </div>
      </div>

      <Tabs defaultValue="prompts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="prompts">Prompt Base</TabsTrigger>
          <TabsTrigger value="subprompts">Subprompts</TabsTrigger>
          <TabsTrigger value="playground">Playground</TabsTrigger>
          <TabsTrigger value="config">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="prompts" className="space-y-4">
          {editingPrompt && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{editingPrompt.name}</span>
                  <Switch
                    checked={editingPrompt.is_active}
                    onCheckedChange={(checked) => setEditingPrompt({ ...editingPrompt, is_active: checked })}
                  />
                </CardTitle>
                <CardDescription>{editingPrompt.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Prompt Principal</Label>
                  <Textarea
                    value={editingPrompt.prompt_text}
                    onChange={(e) => setEditingPrompt({ ...editingPrompt, prompt_text: e.target.value })}
                    rows={10}
                    className="font-mono text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Descrição</Label>
                  <Input
                    value={editingPrompt.description || ""}
                    onChange={(e) => setEditingPrompt({ ...editingPrompt, description: e.target.value })}
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

        <TabsContent value="subprompts" className="space-y-4">
          <div className="grid gap-4">
            {subprompts.map((sp) => (
              <Card key={sp.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{sp.name}</CardTitle>
                      <Badge className={getCategoryBadge(sp.category)}>{sp.category}</Badge>
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
          </div>
        </TabsContent>

        <TabsContent value="playground" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Playground do Nello AI
              </CardTitle>
              <CardDescription>Teste prompts em tempo real</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Sua mensagem de teste</Label>
                <Textarea
                  placeholder="Digite uma mensagem para testar o Nello AI..."
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
                  <Label>Resposta do Nello AI</Label>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="whitespace-pre-wrap">{playgroundOutput}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Configurações do Modelo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Temperatura</Label>
                    <span className="text-sm text-muted-foreground">{temperature[0]}</span>
                  </div>
                  <Slider
                    value={temperature}
                    onValueChange={setTemperature}
                    max={1}
                    step={0.1}
                  />
                  <p className="text-xs text-muted-foreground">
                    Valores menores = respostas mais focadas. Valores maiores = respostas mais criativas.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Max Tokens</Label>
                    <span className="text-sm text-muted-foreground">{maxTokens[0]}</span>
                  </div>
                  <Slider
                    value={maxTokens}
                    onValueChange={setMaxTokens}
                    min={256}
                    max={4096}
                    step={256}
                  />
                  <p className="text-xs text-muted-foreground">
                    Limite máximo de tokens na resposta.
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <History className="w-4 h-4 mr-2" />
                  Ver Logs
                </Button>
                <Button variant="outline" className="flex-1">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Resetar Memórias
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
