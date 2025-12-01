import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { 
  Edit, 
  FileText, 
  Save,
  Loader2,
  Route,
  Info
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

// Define journey order based on test types
const JOURNEY_ORDER = [
  "arquetipos_proposito",
  "disc",
  "inteligencias_multiplas",
  "linguagens_amor",
  "mbti",
  "eneagrama",
  "temperamentos",
];

export const TestsJourneysManagement = () => {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTest, setEditingTest] = useState<Test | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("tests")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;
      
      // Sort by journey order
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
      
      toast.success("Teste atualizado com sucesso");
      fetchTests();
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Route className="w-8 h-8" />
            Testes e Jornadas
          </h2>
          <p className="text-muted-foreground">Gerencie os testes e a ordem da jornada Essentia</p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          <FileText className="w-4 h-4 mr-2" />
          {tests.length} testes
        </Badge>
      </div>

      <Alert className="bg-primary/5 border-primary/20">
        <Info className="h-4 w-4" />
        <AlertDescription>
          A ordem da jornada é definida pela sequência abaixo. Os usuários progridem linearmente, 
          desbloqueando cada teste ao completar o anterior.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        {tests.map((test) => {
          const journeyPosition = getJourneyPosition(test.type);
          
          return (
            <Card key={test.id} className={!test.active ? "opacity-60" : ""}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {journeyPosition && (
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                        {journeyPosition}
                      </div>
                    )}
                    <div className="text-2xl">{test.icon || "📝"}</div>
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {test.name}
                        <Badge variant={test.active ? "default" : "secondary"}>
                          {test.active ? "Ativo" : "Inativo"}
                        </Badge>
                        {test.is_free && (
                          <Badge variant="outline" className="bg-green-500/10 text-green-600">
                            Gratuito
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {test.questions_count} perguntas • {test.estimated_minutes} min
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`active-${test.id}`} className="text-sm text-muted-foreground">
                        Ativo
                      </Label>
                      <Switch
                        id={`active-${test.id}`}
                        checked={test.active}
                        onCheckedChange={() => toggleTestActive(test)}
                      />
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setEditingTest(test)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg">
                        <DialogHeader>
                          <DialogTitle>Editar Teste</DialogTitle>
                        </DialogHeader>
                        {editingTest && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
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
                            <div className="flex justify-end gap-2 pt-4">
                              <Button variant="outline" onClick={() => setEditingTest(null)}>
                                Cancelar
                              </Button>
                              <Button onClick={handleSaveTest} disabled={saving}>
                                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                                Salvar
                              </Button>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground">{test.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};