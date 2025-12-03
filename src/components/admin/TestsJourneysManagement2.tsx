import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { 
  Edit, 
  Save,
  Loader2,
  Route,
  Eye,
  Clock,
  DollarSign
} from "lucide-react";

interface Test {
  id: string;
  name: string;
  type: string;
  description: string;
  questions_count: number;
  estimated_minutes: number;
  price_brl: number | null;
  is_free: boolean;
  active: boolean;
  icon: string | null;
}

const JOURNEY_ORDER = [
  "arquetipos_proposito",
  "disc",
  "inteligencias_multiplas",
  "linguagens_amor",
  "mbti",
  "eneagrama",
  "temperamentos",
];

const STATUS_OPTIONS = [
  { value: "active", label: "Ativo", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  { value: "draft", label: "Rascunho", color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  { value: "review", label: "Em Revisão", color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
];

export const TestsJourneysManagement2 = () => {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTest, setEditingTest] = useState<Test | null>(null);
  const [saving, setSaving] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      setLoading(true);
      // Buscar apenas testes PT (oficiais) - não mostrar EN nem duplicados
      const { data, error } = await supabase
        .from("tests")
        .select("*")
        .eq("language", "pt")
        .neq("type", "solis") // Excluir SOLIS
        .order("created_at", { ascending: true });

      if (error) throw error;
      
      const sortedTests = (data || []).sort((a, b) => {
        const orderA = JOURNEY_ORDER.indexOf(a.type);
        const orderB = JOURNEY_ORDER.indexOf(b.type);
        if (orderA === -1) return 1;
        if (orderB === -1) return -1;
        return orderA - orderB;
      });
      
      setTests(sortedTests);
    } catch (error) {
      console.error("Error fetching tests:", error);
      toast.error("Erro ao carregar testes");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTest = async () => {
    if (!editingTest) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from("tests")
        .update({
          name: editingTest.name,
          description: editingTest.description,
          active: editingTest.active,
          estimated_minutes: editingTest.estimated_minutes,
          icon: editingTest.icon,
        })
        .eq("id", editingTest.id);

      if (error) throw error;
      
      toast.success("Teste atualizado");
      fetchTests();
      setShowEdit(false);
      setEditingTest(null);
    } catch (error) {
      console.error("Error saving test:", error);
      toast.error("Erro ao salvar teste");
    } finally {
      setSaving(false);
    }
  };

  const toggleTestActive = async (test: Test) => {
    try {
      const { error } = await supabase
        .from("tests")
        .update({ active: !test.active })
        .eq("id", test.id);

      if (error) throw error;
      
      toast.success(test.active ? "Teste desativado" : "Teste ativado");
      fetchTests();
    } catch (error) {
      console.error("Error toggling test:", error);
      toast.error("Erro ao atualizar teste");
    }
  };

  const getJourneyPosition = (type: string) => {
    const index = JOURNEY_ORDER.indexOf(type);
    return index !== -1 ? index + 1 : null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 max-w-4xl px-4 md:px-0">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-xl md:text-2xl font-semibold tracking-tight flex items-center gap-2">
          <Route className="w-5 h-5 md:w-6 md:h-6" />
          Testes & Jornadas
        </h1>
        <p className="text-muted-foreground text-xs md:text-sm">
          Gerencie os testes e a sequência da jornada NELLO ONE
        </p>
      </div>

      {/* Info Card */}
      <Card className="p-3 md:p-4 bg-muted/50 border-border/50">
        <p className="text-xs md:text-sm text-muted-foreground">
          A ordem abaixo define a sequência da jornada. Os usuários progridem linearmente, 
          desbloqueando cada teste ao completar o anterior.
        </p>
      </Card>

      {/* Tests List */}
      <div className="space-y-3">
        {tests.map((test) => {
          const journeyPosition = getJourneyPosition(test.type);
          
          return (
            <Card 
              key={test.id} 
              className={`border-border/50 transition-opacity ${!test.active ? "opacity-50" : ""}`}
            >
              <CardContent className="p-3 md:p-4">
                {/* Mobile Layout */}
                <div className="flex flex-col gap-3 md:hidden">
                  <div className="flex items-start gap-3">
                    {/* Position */}
                    {journeyPosition && (
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary shrink-0 text-sm">
                        {journeyPosition}
                      </div>
                    )}
                    
                    {/* Icon */}
                    <div className="text-xl shrink-0">{test.icon || "📝"}</div>
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">{test.name}</h3>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1">
                        <Badge variant="outline" className={`text-xs ${test.active ? STATUS_OPTIONS[0].color : STATUS_OPTIONS[1].color}`}>
                          {test.active ? "Ativo" : "Inativo"}
                        </Badge>
                        {test.is_free && (
                          <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                            Gratuito
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Meta info */}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground pl-11">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {test.estimated_minutes} min
                    </span>
                    <span>{test.questions_count} perguntas</span>
                    {test.price_brl && (
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        R$ {test.price_brl}
                      </span>
                    )}
                  </div>
                  
                  {/* Mobile Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={test.active}
                        onCheckedChange={() => toggleTestActive(test)}
                      />
                      <span className="text-xs text-muted-foreground">
                        {test.active ? "Ativo" : "Inativo"}
                      </span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="h-9"
                      onClick={() => {
                        setEditingTest(test);
                        setShowEdit(true);
                      }}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden md:flex items-center gap-4">
                  {/* Position */}
                  {journeyPosition && (
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary shrink-0">
                      {journeyPosition}
                    </div>
                  )}
                  
                  {/* Icon */}
                  <div className="text-2xl shrink-0">{test.icon || "📝"}</div>
                  
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium truncate">{test.name}</h3>
                      <Badge variant="outline" className={test.active ? STATUS_OPTIONS[0].color : STATUS_OPTIONS[1].color}>
                        {test.active ? "Ativo" : "Inativo"}
                      </Badge>
                      {test.is_free && (
                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                          Gratuito
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {test.estimated_minutes} min
                      </span>
                      <span>{test.questions_count} perguntas</span>
                      {test.price_brl && (
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          R$ {test.price_brl}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 shrink-0">
                    <Switch
                      checked={test.active}
                      onCheckedChange={() => toggleTestActive(test)}
                    />
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setEditingTest(test);
                        setShowEdit(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Edit Dialog */}
      <Dialog open={showEdit} onOpenChange={setShowEdit}>
        <DialogContent className="max-w-[95vw] md:max-w-lg mx-4 md:mx-auto">
          <DialogHeader>
            <DialogTitle>Editar Teste</DialogTitle>
          </DialogHeader>
          {editingTest && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome</Label>
                  <Input
                    value={editingTest.name}
                    onChange={(e) => setEditingTest({ ...editingTest, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Ícone (emoji)</Label>
                  <Input
                    value={editingTest.icon || ""}
                    onChange={(e) => setEditingTest({ ...editingTest, icon: e.target.value })}
                    placeholder="🧠"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Descrição</Label>
                <Textarea
                  value={editingTest.description}
                  onChange={(e) => setEditingTest({ ...editingTest, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Tempo estimado (min)</Label>
                <Input
                  type="number"
                  value={editingTest.estimated_minutes}
                  onChange={(e) => setEditingTest({ ...editingTest, estimated_minutes: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="edit-active"
                  checked={editingTest.active}
                  onCheckedChange={(checked) => setEditingTest({ ...editingTest, active: checked })}
                />
                <Label htmlFor="edit-active">Ativo</Label>
              </div>
              <div className="flex flex-col-reverse md:flex-row justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowEdit(false)} className="w-full md:w-auto">
                  Cancelar
                </Button>
                <Button onClick={handleSaveTest} disabled={saving} className="w-full md:w-auto">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                  Salvar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
