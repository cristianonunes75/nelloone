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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";
import { 
  Plus, 
  Edit, 
  Trash2, 
  FileText, 
  Eye,
  Save,
  Loader2,
  GripVertical
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
  stripe_price_id: string | null;
}

interface Question {
  id: string;
  test_id: string;
  question_number: number;
  question_text: string;
  options: any;
}

export const TestsQuestionsManagement = () => {
  const [tests, setTests] = useState<Test[]>([]);
  const [questions, setQuestions] = useState<Record<string, Question[]>>({});
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
      setTests(data || []);
    } catch (error) {
      console.error("Error fetching tests:", error);
      toast.error("Erro ao carregar testes");
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async (testId: string) => {
    if (questions[testId]) return;
    
    try {
      const { data, error } = await supabase
        .from("test_questions")
        .select("*")
        .eq("test_id", testId)
        .order("question_number", { ascending: true });

      if (error) throw error;
      setQuestions(prev => ({ ...prev, [testId]: data || [] }));
    } catch (error) {
      console.error("Error fetching questions:", error);
      toast.error("Erro ao carregar perguntas");
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
          price_brl: editingTest.price_brl,
          is_free: editingTest.is_free,
          active: editingTest.active,
          estimated_minutes: editingTest.estimated_minutes,
          icon: editingTest.icon,
          stripe_price_id: editingTest.stripe_price_id,
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
          <h2 className="text-3xl font-bold tracking-tight">Testes & Perguntas</h2>
          <p className="text-muted-foreground">Gerencie os testes e suas perguntas</p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          <FileText className="w-4 h-4 mr-2" />
          {tests.length} testes
        </Badge>
      </div>

      <div className="grid gap-4">
        {tests.map((test) => (
          <Card key={test.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
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
                    <p className="text-sm text-muted-foreground mt-1">
                      {test.questions_count} perguntas • {test.estimated_minutes} min • 
                      {test.is_free ? " Grátis" : ` R$ ${test.price_brl?.toFixed(2) || "0.00"}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={test.active}
                    onCheckedChange={() => toggleTestActive(test)}
                  />
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setEditingTest(test)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
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
                          <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label>Preço (R$)</Label>
                              <Input
                                type="number"
                                value={editingTest.price_brl || ""}
                                onChange={(e) => setEditingTest({ ...editingTest, price_brl: parseFloat(e.target.value) || null })}
                                disabled={editingTest.is_free}
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
                            <div className="space-y-2">
                              <Label>Stripe Price ID</Label>
                              <Input
                                value={editingTest.stripe_price_id || ""}
                                onChange={(e) => setEditingTest({ ...editingTest, stripe_price_id: e.target.value })}
                                placeholder="price_..."
                              />
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                              <Switch
                                id="is_free"
                                checked={editingTest.is_free}
                                onCheckedChange={(checked) => setEditingTest({ ...editingTest, is_free: checked })}
                              />
                              <Label htmlFor="is_free">Gratuito</Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <Switch
                                id="active"
                                checked={editingTest.active}
                                onCheckedChange={(checked) => setEditingTest({ ...editingTest, active: checked })}
                              />
                              <Label htmlFor="active">Ativo</Label>
                            </div>
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
                  <Button variant="ghost" size="sm" onClick={() => fetchQuestions(test.id)}>
                    <Eye className="w-4 h-4 mr-2" />
                    Perguntas
                  </Button>
                </div>
              </div>
            </CardHeader>
            {questions[test.id] && (
              <CardContent>
                <Accordion type="single" collapsible>
                  <AccordionItem value="questions">
                    <AccordionTrigger className="text-sm">
                      Ver {questions[test.id].length} perguntas
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {questions[test.id].map((q, idx) => (
                          <div key={q.id} className="p-3 bg-muted/50 rounded-lg">
                            <div className="flex items-start gap-3">
                              <Badge variant="outline" className="shrink-0">
                                {q.question_number}
                              </Badge>
                              <p className="text-sm">{q.question_text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};
