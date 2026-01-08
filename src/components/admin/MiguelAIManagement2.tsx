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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { 
  Bot, 
  Save, 
  Play, 
  RefreshCw, 
  Sparkles,
  Loader2,
  User,
  Plus,
  Copy,
  Trash2,
  Pencil,
  FileText,
  FolderOpen,
  Search
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

interface SubpromptFormData {
  name: string;
  category: string;
  prompt_text: string;
  is_active: boolean;
  priority: number;
}

const CATEGORIES = [
  { value: "guia", label: "Guia", description: "Orientações e guias gerais" },
  { value: "resultados", label: "Resultados", description: "Interpretação de resultados de testes" },
  { value: "mapa", label: "Mapa", description: "Geração do Mapa da Essência" },
  { value: "onboarding", label: "Onboarding", description: "Acolhimento de novos usuários" },
  { value: "acolhimento", label: "Acolhimento", description: "Mensagens de acolhimento" },
  { value: "analises", label: "Análises", description: "Análises comportamentais e de perfil" },
  { value: "comportamentos", label: "Comportamentos", description: "Padrões de comportamento" },
  { value: "premium", label: "Premium", description: "Subprompts para recursos premium" },
  { value: "admin", label: "Admin", description: "Subprompts para uso administrativo" },
  { value: "outro", label: "Outro", description: "Outros subprompts" },
];

const initialFormData: SubpromptFormData = {
  name: "",
  category: "guia",
  prompt_text: "",
  is_active: true,
  priority: 0,
};

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
  const [personaTitle, setPersonaTitle] = useState("Nello");
  const [personaDescription, setPersonaDescription] = useState("Seu guia espiritual e emocional na jornada de autoconhecimento");
  const [personaTone, setPersonaTone] = useState("Acolhedor, profundo, humano");
  const [welcomeMessage, setWelcomeMessage] = useState("Olá! Sou Nello, seu guia nesta jornada de autoconhecimento.");

  // Subprompt CRUD
  const [isSubpromptDialogOpen, setIsSubpromptDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [subpromptToDelete, setSubpromptToDelete] = useState<AISubprompt | null>(null);
  const [editingSubprompt, setEditingSubprompt] = useState<AISubprompt | null>(null);
  const [formData, setFormData] = useState<SubpromptFormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [savingSubprompt, setSavingSubprompt] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");

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

  // Subprompt CRUD operations
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = "Nome interno é obrigatório";
    } else if (!/^[a-z0-9_-]+$/.test(formData.name)) {
      errors.name = "Use apenas letras minúsculas, números, _ e -";
    } else {
      // Check for duplicate names (excluding current editing)
      const duplicate = subprompts.find(
        sp => sp.name === formData.name && sp.id !== editingSubprompt?.id
      );
      if (duplicate) {
        errors.name = "Este nome interno já existe";
      }
    }
    
    if (!formData.prompt_text.trim()) {
      errors.prompt_text = "O texto do prompt é obrigatório";
    }
    
    if (!formData.category) {
      errors.category = "Selecione uma categoria";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenCreateDialog = () => {
    setEditingSubprompt(null);
    setFormData(initialFormData);
    setFormErrors({});
    setIsSubpromptDialogOpen(true);
  };

  const handleOpenEditDialog = (subprompt: AISubprompt) => {
    setEditingSubprompt(subprompt);
    setFormData({
      name: subprompt.name,
      category: subprompt.category,
      prompt_text: subprompt.prompt_text,
      is_active: subprompt.is_active,
      priority: subprompt.priority,
    });
    setFormErrors({});
    setIsSubpromptDialogOpen(true);
  };

  const handleDuplicate = (subprompt: AISubprompt) => {
    setEditingSubprompt(null);
    setFormData({
      name: `${subprompt.name}_copy`,
      category: subprompt.category,
      prompt_text: subprompt.prompt_text,
      is_active: false, // Start as inactive
      priority: subprompt.priority,
    });
    setFormErrors({});
    setIsSubpromptDialogOpen(true);
  };

  const handleSaveSubprompt = async () => {
    if (!validateForm()) return;
    
    setSavingSubprompt(true);
    try {
      if (editingSubprompt) {
        // Update existing
        const { error } = await supabase
          .from("ai_subprompts")
          .update({
            name: formData.name,
            category: formData.category,
            prompt_text: formData.prompt_text,
            is_active: formData.is_active,
            priority: formData.priority,
          })
          .eq("id", editingSubprompt.id);

        if (error) throw error;
        toast.success("Subprompt atualizado com sucesso");
      } else {
        // Create new
        const { error } = await supabase
          .from("ai_subprompts")
          .insert({
            name: formData.name,
            category: formData.category,
            prompt_text: formData.prompt_text,
            is_active: formData.is_active,
            priority: formData.priority,
          });

        if (error) throw error;
        toast.success("Subprompt criado com sucesso");
      }
      
      setIsSubpromptDialogOpen(false);
      fetchPrompts();
    } catch (error: any) {
      console.error("Error saving subprompt:", error);
      if (error.code === "23505") {
        toast.error("Este nome interno já existe");
      } else {
        toast.error("Erro ao salvar subprompt");
      }
    } finally {
      setSavingSubprompt(false);
    }
  };

  const handleDeleteSubprompt = async () => {
    if (!subpromptToDelete) return;
    
    try {
      const { error } = await supabase
        .from("ai_subprompts")
        .delete()
        .eq("id", subpromptToDelete.id);

      if (error) throw error;
      
      toast.success("Subprompt excluído");
      setIsDeleteDialogOpen(false);
      setSubpromptToDelete(null);
      fetchPrompts();
    } catch (error) {
      console.error("Error deleting subprompt:", error);
      toast.error("Erro ao excluir subprompt");
    }
  };

  const handleToggleActive = async (subprompt: AISubprompt) => {
    try {
      const { error } = await supabase
        .from("ai_subprompts")
        .update({ is_active: !subprompt.is_active })
        .eq("id", subprompt.id);

      if (error) throw error;
      
      setSubprompts(prev => 
        prev.map(sp => sp.id === subprompt.id ? { ...sp, is_active: !sp.is_active } : sp)
      );
      toast.success(subprompt.is_active ? "Subprompt desativado" : "Subprompt ativado");
    } catch (error) {
      console.error("Error toggling subprompt:", error);
      toast.error("Erro ao alterar status");
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
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/nello-agent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            messages: [{ role: "user", content: playgroundInput }],
            context: { location: "playground" },
          }),
        }
      );

      if (!response.ok) throw new Error("Erro na resposta");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ") && line !== "data: [DONE]") {
              try {
                const jsonStr = line.slice(6).trim();
                if (jsonStr && jsonStr !== "[DONE]") {
                  const parsed = JSON.parse(jsonStr);
                  const content = parsed.choices?.[0]?.delta?.content;
                  if (content) {
                    fullText += content;
                    setPlaygroundOutput(fullText);
                  }
                }
              } catch {}
            }
          }
        }
      }

      if (!fullText) {
        setPlaygroundOutput("Sem resposta do Miguel");
      }
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
      analises: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
      comportamentos: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
      premium: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
      admin: "bg-slate-500/10 text-slate-600 border-slate-500/20",
      outro: "bg-gray-500/10 text-gray-600 border-gray-500/20",
    };
    return colors[category] || "bg-muted text-muted-foreground";
  };

  const getCategoryLabel = (value: string) => {
    return CATEGORIES.find(c => c.value === value)?.label || value;
  };

  // Filter subprompts
  const filteredSubprompts = subprompts.filter(sp => {
    const matchesSearch = !searchQuery || 
      sp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sp.prompt_text.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || sp.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Group by category
  const groupedSubprompts = filteredSubprompts.reduce((acc, sp) => {
    if (!acc[sp.category]) acc[sp.category] = [];
    acc[sp.category].push(sp);
    return acc;
  }, {} as Record<string, AISubprompt[]>);

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
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight flex items-center gap-3">
          <Bot className="w-6 h-6 md:w-7 md:h-7" strokeWidth={1.5} />
          Miguel – IA
        </h1>
        <p className="text-muted-foreground text-sm">
          Configure a persona, prompts e comportamento do Miguel
        </p>
      </div>

      <Tabs defaultValue="subprompts" className="space-y-6">
        <TabsList className="bg-muted/50 p-1 h-auto rounded-xl">
          <TabsTrigger value="persona" className="text-sm rounded-lg py-2 px-4 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            Identidade
          </TabsTrigger>
          <TabsTrigger value="prompt" className="text-sm rounded-lg py-2 px-4 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            Prompt Base
          </TabsTrigger>
          <TabsTrigger value="subprompts" className="text-sm rounded-lg py-2 px-4 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            Subprompts
          </TabsTrigger>
          <TabsTrigger value="playground" className="text-sm rounded-lg py-2 px-4 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            Playground
          </TabsTrigger>
        </TabsList>

        {/* Persona Tab */}
        <TabsContent value="persona" className="space-y-4 mt-0">
          <Card className="border-border/50 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-5 h-5" strokeWidth={1.5} />
                Identidade e Persona
              </CardTitle>
              <CardDescription>
                Configure como Miguel se apresenta e interage com os usuários
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Título de Apresentação</Label>
                  <Input
                    value={personaTitle}
                    onChange={(e) => setPersonaTitle(e.target.value)}
                    placeholder="Miguel"
                    className="h-11 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tom de Voz</Label>
                  <Input
                    value={personaTone}
                    onChange={(e) => setPersonaTone(e.target.value)}
                    placeholder="Acolhedor, profundo, humano"
                    className="h-11 rounded-xl"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Descrição Curta</Label>
                <Textarea
                  value={personaDescription}
                  onChange={(e) => setPersonaDescription(e.target.value)}
                  rows={2}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>Mensagem de Boas-vindas</Label>
                <Textarea
                  value={welcomeMessage}
                  onChange={(e) => setWelcomeMessage(e.target.value)}
                  rows={3}
                  className="rounded-xl"
                />
              </div>
              <Button className="w-full h-11 rounded-xl bg-foreground text-background hover:bg-foreground/90">
                <Save className="w-4 h-4 mr-2" strokeWidth={1.5} />
                Salvar Identidade
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Prompt Base Tab */}
        <TabsContent value="prompt" className="space-y-4 mt-0">
          {editingPrompt && (
            <Card className="border-border/50 rounded-2xl">
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
                    className="font-mono text-sm rounded-xl"
                  />
                </div>
                <div className="flex flex-col-reverse md:flex-row justify-end gap-2">
                  <Button variant="outline" onClick={fetchPrompts} className="rounded-xl h-10">
                    <RefreshCw className="w-4 h-4 mr-2" strokeWidth={1.5} />
                    Resetar
                  </Button>
                  <Button onClick={handleSavePrompt} disabled={saving} className="rounded-xl h-10 bg-foreground text-background hover:bg-foreground/90">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" strokeWidth={1.5} />}
                    Salvar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Subprompts Tab */}
        <TabsContent value="subprompts" className="space-y-4 mt-0">
          {/* Header with actions */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                <Input
                  placeholder="Buscar subprompts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-10 rounded-xl"
                />
              </div>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-[160px] h-10 rounded-xl">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {CATEGORIES.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleOpenCreateDialog} className="rounded-xl h-10 bg-foreground text-background hover:bg-foreground/90">
              <Plus className="w-4 h-4 mr-2" strokeWidth={1.5} />
              Criar Subprompt
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-background rounded-xl border border-border/50 p-4">
              <p className="text-2xl font-semibold">{subprompts.length}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
            <div className="bg-background rounded-xl border border-border/50 p-4">
              <p className="text-2xl font-semibold">{subprompts.filter(s => s.is_active).length}</p>
              <p className="text-xs text-muted-foreground">Ativos</p>
            </div>
            <div className="bg-background rounded-xl border border-border/50 p-4">
              <p className="text-2xl font-semibold">{Object.keys(groupedSubprompts).length}</p>
              <p className="text-xs text-muted-foreground">Categorias</p>
            </div>
            <div className="bg-background rounded-xl border border-border/50 p-4">
              <p className="text-2xl font-semibold">{filteredSubprompts.length}</p>
              <p className="text-xs text-muted-foreground">Filtrados</p>
            </div>
          </div>

          {/* Subprompts list */}
          <div className="space-y-4">
            {Object.entries(groupedSubprompts).map(([category, items]) => (
              <div key={category} className="space-y-3">
                <div className="flex items-center gap-2">
                  <FolderOpen className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                  <h3 className="text-sm font-medium">{getCategoryLabel(category)}</h3>
                  <Badge variant="outline" className="text-xs">{items.length}</Badge>
                </div>
                <div className="grid gap-3">
                  {items.map((sp) => (
                    <Card key={sp.id} className="border-border/50 rounded-xl overflow-hidden">
                      <div className="p-4 md:p-5">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <code className="text-sm font-medium font-mono bg-muted px-2 py-0.5 rounded">
                                {sp.name}
                              </code>
                              <Badge variant="outline" className={`text-xs ${getCategoryBadge(sp.category)}`}>
                                {getCategoryLabel(sp.category)}
                              </Badge>
                              {!sp.is_active && (
                                <Badge variant="outline" className="text-xs bg-muted">Inativo</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {sp.prompt_text.substring(0, 150)}...
                            </p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <Switch
                              checked={sp.is_active}
                              onCheckedChange={() => handleToggleActive(sp)}
                            />
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleOpenEditDialog(sp)}
                              className="h-8 w-8 rounded-lg"
                            >
                              <Pencil className="w-4 h-4" strokeWidth={1.5} />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleDuplicate(sp)}
                              className="h-8 w-8 rounded-lg"
                            >
                              <Copy className="w-4 h-4" strokeWidth={1.5} />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => {
                                setSubpromptToDelete(sp);
                                setIsDeleteDialogOpen(true);
                              }}
                              className="h-8 w-8 rounded-lg text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
            {filteredSubprompts.length === 0 && (
              <Card className="p-8 text-center border-border/50 rounded-xl">
                <FileText className="w-10 h-10 mx-auto text-muted-foreground/50 mb-3" strokeWidth={1.5} />
                <p className="text-muted-foreground">
                  {searchQuery || filterCategory !== "all" 
                    ? "Nenhum subprompt encontrado com os filtros atuais"
                    : "Nenhum subprompt cadastrado"}
                </p>
                {!searchQuery && filterCategory === "all" && (
                  <Button onClick={handleOpenCreateDialog} variant="outline" className="mt-4 rounded-xl">
                    <Plus className="w-4 h-4 mr-2" strokeWidth={1.5} />
                    Criar primeiro subprompt
                  </Button>
                )}
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Playground Tab */}
        <TabsContent value="playground" className="space-y-4 mt-0">
          <Card className="border-border/50 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5" strokeWidth={1.5} />
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
                  className="rounded-xl"
                />
              </div>
              <Button 
                onClick={handlePlayground} 
                disabled={playgroundLoading} 
                className="w-full h-11 rounded-xl bg-foreground text-background hover:bg-foreground/90"
              >
                {playgroundLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Play className="w-4 h-4 mr-2" strokeWidth={1.5} />
                )}
                Testar
              </Button>
              {playgroundOutput && (
                <div className="space-y-2">
                  <Label>Resposta do Miguel</Label>
                  <div className="p-4 bg-muted/50 rounded-xl border border-border/50">
                    <p className="whitespace-pre-wrap text-sm">{playgroundOutput}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create/Edit Subprompt Dialog */}
      <Dialog open={isSubpromptDialogOpen} onOpenChange={setIsSubpromptDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingSubprompt ? "Editar Subprompt" : "Criar Subprompt"}
            </DialogTitle>
            <DialogDescription>
              {editingSubprompt 
                ? "Atualize as configurações do subprompt"
                : "Crie um novo subprompt para expandir as capacidades do Miguel"}
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome Interno (slug) *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value.toLowerCase().replace(/\s/g, '_') })}
                    placeholder="ex: analise_perfil"
                    className={`h-10 rounded-xl font-mono ${formErrors.name ? "border-destructive" : ""}`}
                  />
                  {formErrors.name && (
                    <p className="text-xs text-destructive">{formErrors.name}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Identificador único. Use letras minúsculas, números, _ e -
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Categoria *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger className={`h-10 rounded-xl ${formErrors.category ? "border-destructive" : ""}`}>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>
                          <div className="flex flex-col">
                            <span>{cat.label}</span>
                            <span className="text-xs text-muted-foreground">{cat.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.category && (
                    <p className="text-xs text-destructive">{formErrors.category}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Prioridade</Label>
                  <Input
                    type="number"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })}
                    className="h-10 rounded-xl"
                  />
                  <p className="text-xs text-muted-foreground">
                    Maior número = maior prioridade
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <div className="flex items-center gap-3 h-10">
                    <Switch
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    />
                    <span className="text-sm">
                      {formData.is_active ? "Ativo" : "Inativo"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Texto do Prompt *</Label>
                <Textarea
                  value={formData.prompt_text}
                  onChange={(e) => setFormData({ ...formData, prompt_text: e.target.value })}
                  placeholder="Digite o texto do prompt..."
                  rows={10}
                  className={`font-mono text-sm rounded-xl ${formErrors.prompt_text ? "border-destructive" : ""}`}
                />
                {formErrors.prompt_text && (
                  <p className="text-xs text-destructive">{formErrors.prompt_text}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Use variáveis como {"{userName}"}, {"{testResults}"}, etc.
                </p>
              </div>
            </div>
          </ScrollArea>

          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsSubpromptDialogOpen(false)}
              className="rounded-xl"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSaveSubprompt} 
              disabled={savingSubprompt}
              className="rounded-xl bg-foreground text-background hover:bg-foreground/90"
            >
              {savingSubprompt ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" strokeWidth={1.5} />
              )}
              {editingSubprompt ? "Salvar Alterações" : "Criar Subprompt"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Subprompt</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o subprompt{" "}
              <code className="font-mono bg-muted px-1 rounded">{subpromptToDelete?.name}</code>?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSubprompt}
              className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
