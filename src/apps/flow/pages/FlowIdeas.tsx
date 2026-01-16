import { useState } from 'react';
import { Lightbulb, Plus, Star, Archive, Trash2, MoreVertical, Target, Loader2, Sparkles, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SEOHead } from '@/components/SEOHead';
import { FlowLayout } from '../components/FlowLayout';
import { useFlowData, FlowIdea } from '../hooks/useFlowData';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export default function FlowIdeas() {
  const { ideas, chosenIdea, loading, addIdea, updateIdea, deleteIdea, setIdeaAsFocus } = useFlowData();
  const { user } = useAuth();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filter, setFilter] = useState<'all' | 'backlog' | 'archived'>('all');
  
  // AI assistance state
  const [aiLoading, setAiLoading] = useState<'title' | 'description' | 'expand' | null>(null);
  const [aiSuggestion, setAiSuggestion] = useState<{ type: 'title' | 'description' | 'expand'; content: string; ideaId?: string } | null>(null);
  const [editingIdea, setEditingIdea] = useState<FlowIdea | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const handleAdd = async () => {
    if (!newTitle.trim()) return;
    
    setIsSubmitting(true);
    try {
      await addIdea(newTitle, newDescription);
      setNewTitle('');
      setNewDescription('');
      setIsAddOpen(false);
      toast.success('Ideia adicionada!');
    } catch (error) {
      toast.error('Erro ao adicionar ideia');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSetFocus = async (idea: FlowIdea) => {
    try {
      await setIdeaAsFocus(idea.id);
      toast.success('Foco definido!');
    } catch (error) {
      toast.error('Erro ao definir foco');
    }
  };

  const handleArchive = async (idea: FlowIdea) => {
    try {
      await updateIdea(idea.id, { status: 'archived' });
      toast.success('Ideia arquivada');
    } catch (error) {
      toast.error('Erro ao arquivar');
    }
  };

  const handleDelete = async (idea: FlowIdea) => {
    try {
      await deleteIdea(idea.id);
      toast.success('Ideia removida');
    } catch (error) {
      toast.error('Erro ao remover');
    }
  };

  const handleEdit = (idea: FlowIdea) => {
    setEditingIdea(idea);
    setEditTitle(idea.title);
    setEditDescription(idea.description || '');
    setIsEditOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingIdea || !editTitle.trim()) return;
    
    setIsSubmitting(true);
    try {
      await updateIdea(editingIdea.id, { title: editTitle, description: editDescription });
      setIsEditOpen(false);
      setEditingIdea(null);
      toast.success('Ideia atualizada!');
    } catch (error) {
      toast.error('Erro ao atualizar ideia');
    } finally {
      setIsSubmitting(false);
    }
  };

  // AI Help for new idea
  const requestAIHelp = async (type: 'title' | 'description', context?: string) => {
    if (!user?.id) {
      toast.error('Faça login para usar o Mentor IA');
      return;
    }

    setAiLoading(type);
    setAiSuggestion(null);

    try {
      let prompt = '';
      if (type === 'title') {
        prompt = `Me ajude a criar um título claro e atraente para uma ideia de negócio/produto. ${context ? `Contexto: ${context}` : 'Preciso de sugestões criativas para um novo projeto.'}`;
      } else {
        prompt = `Me ajude a desenvolver e descrever melhor esta ideia de negócio: "${newTitle || context}". Escreva uma descrição clara que explique o que é, para quem é e qual valor entrega.`;
      }

      const { data, error } = await supabase.functions.invoke('flow-mentor', {
        body: { message: prompt, userId: user.id },
      });

      if (error) throw error;

      if (data?.response) {
        setAiSuggestion({ type, content: data.response });
      }
    } catch (error) {
      console.error('Error getting AI help:', error);
      toast.error('Erro ao obter ajuda do Mentor IA');
    } finally {
      setAiLoading(null);
    }
  };

  // AI Help to expand existing idea
  const requestExpandIdea = async (idea: FlowIdea) => {
    if (!user?.id) {
      toast.error('Faça login para usar o Mentor IA');
      return;
    }

    setAiLoading('expand');
    setAiSuggestion(null);

    try {
      const prompt = `Me ajude a desenvolver melhor esta ideia de negócio:
      
Título: ${idea.title}
${idea.description ? `Descrição atual: ${idea.description}` : 'Ainda sem descrição.'}

Por favor, me dê uma descrição mais completa e estruturada, incluindo:
- O que é exatamente
- Para quem é (público-alvo)
- Qual problema resolve
- Qual valor único entrega

Seja direto e prático.`;

      const { data, error } = await supabase.functions.invoke('flow-mentor', {
        body: { message: prompt, userId: user.id },
      });

      if (error) throw error;

      if (data?.response) {
        setAiSuggestion({ type: 'expand', content: data.response, ideaId: idea.id });
      }
    } catch (error) {
      console.error('Error getting AI help:', error);
      toast.error('Erro ao obter ajuda do Mentor IA');
    } finally {
      setAiLoading(null);
    }
  };

  const applyExpandSuggestion = async () => {
    if (!aiSuggestion || aiSuggestion.type !== 'expand' || !aiSuggestion.ideaId) return;
    
    try {
      await updateIdea(aiSuggestion.ideaId, { description: aiSuggestion.content });
      setAiSuggestion(null);
      toast.success('Descrição atualizada!');
    } catch (error) {
      toast.error('Erro ao atualizar ideia');
    }
  };

  const filteredIdeas = ideas.filter(idea => {
    if (filter === 'all') return idea.status !== 'archived';
    if (filter === 'archived') return idea.status === 'archived';
    return idea.status === filter;
  });

  if (loading) {
    return (
      <FlowLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
        </div>
      </FlowLayout>
    );
  }

  return (
    <>
      <SEOHead title="Ideias | Nello Flow" description="Gerencie suas ideias no Nello Flow" />
      
      <FlowLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                <Lightbulb className="w-7 h-7 text-fuchsia-400" />
                Minhas Ideias
              </h1>
              <p className="text-slate-400 mt-1">Capture e organize suas ideias aqui</p>
            </div>
            
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button className="bg-violet-500 hover:bg-violet-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Ideia
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border-slate-700 max-w-lg">
                <DialogHeader>
                  <DialogTitle className="text-white">Nova Ideia</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-slate-300">Título da ideia</label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => requestAIHelp('title')}
                        disabled={aiLoading !== null}
                        className="text-violet-400 hover:text-violet-300 hover:bg-violet-500/10 gap-1.5 h-7 px-2"
                      >
                        {aiLoading === 'title' ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Sparkles className="w-3.5 h-3.5" />
                        )}
                        <span className="text-xs">Analisar com Nello</span>
                      </Button>
                    </div>
                    <Input
                      placeholder="Ex: Mentoria para designers iniciantes"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                    {aiSuggestion?.type === 'title' && (
                      <div className="p-3 rounded-lg bg-violet-500/10 border border-violet-500/30 space-y-2">
                        <div className="flex items-start gap-2">
                          <Sparkles className="w-4 h-4 text-violet-400 mt-0.5 shrink-0" />
                          <p className="text-sm text-slate-300">{aiSuggestion.content}</p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => setAiSuggestion(null)}
                          variant="ghost"
                          className="text-slate-400 h-7"
                        >
                          Fechar
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-slate-300">Descrição (opcional)</label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => requestAIHelp('description', newTitle)}
                        disabled={aiLoading !== null || !newTitle.trim()}
                        className="text-violet-400 hover:text-violet-300 hover:bg-violet-500/10 gap-1.5 h-7 px-2"
                      >
                        {aiLoading === 'description' ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Sparkles className="w-3.5 h-3.5" />
                        )}
                        <span className="text-xs">Analisar com Nello</span>
                      </Button>
                    </div>
                    <Textarea
                      placeholder="Descreva sua ideia, para quem é, qual problema resolve..."
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      className="bg-slate-800 border-slate-700 text-white min-h-[100px]"
                    />
                    {aiSuggestion?.type === 'description' && (
                      <div className="p-3 rounded-lg bg-violet-500/10 border border-violet-500/30 space-y-2">
                        <div className="flex items-start gap-2">
                          <Sparkles className="w-4 h-4 text-violet-400 mt-0.5 shrink-0" />
                          <p className="text-sm text-slate-300 whitespace-pre-wrap">{aiSuggestion.content}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => {
                              setNewDescription(aiSuggestion.content);
                              setAiSuggestion(null);
                            }}
                            className="bg-violet-500 hover:bg-violet-600 h-7"
                          >
                            Usar
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => setAiSuggestion(null)}
                            variant="ghost"
                            className="text-slate-400 h-7"
                          >
                            Ignorar
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <Button
                    onClick={handleAdd}
                    disabled={!newTitle.trim() || isSubmitting}
                    className="w-full bg-violet-500 hover:bg-violet-600"
                  >
                    {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Adicionar
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Chosen Idea Highlight */}
          {chosenIdea && (
            <div className="p-6 rounded-2xl bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 border border-violet-500/30">
              <div className="flex items-center gap-2 text-violet-400 text-sm font-medium mb-2">
                <Target className="w-4 h-4" />
                Foco Atual
              </div>
              <h3 className="text-xl font-semibold text-white">{chosenIdea.title}</h3>
              {chosenIdea.description && (
                <p className="text-slate-300 mt-1">{chosenIdea.description}</p>
              )}
            </div>
          )}

          {/* AI Suggestion for expanding idea */}
          {aiSuggestion?.type === 'expand' && (
            <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/30 space-y-3">
              <div className="flex items-start gap-2">
                <Sparkles className="w-5 h-5 text-violet-400 mt-0.5 shrink-0" />
                <div>
                  <div className="text-sm font-medium text-violet-400 mb-1">Sugestão do Nello</div>
                  <p className="text-sm text-slate-300 whitespace-pre-wrap">{aiSuggestion.content}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={applyExpandSuggestion}
                  className="bg-violet-500 hover:bg-violet-600"
                >
                  Aplicar à ideia
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setAiSuggestion(null)}
                  className="text-slate-400"
                >
                  Ignorar
                </Button>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="flex gap-2">
            {(['all', 'backlog', 'archived'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  filter === f
                    ? "bg-violet-500/20 text-violet-400 border border-violet-500/30"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                )}
              >
                {f === 'all' ? 'Todas' : f === 'backlog' ? 'Backlog' : 'Arquivadas'}
              </button>
            ))}
          </div>

          {/* Ideas List */}
          {filteredIdeas.length === 0 ? (
            <div className="text-center py-16">
              <Lightbulb className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Nenhuma ideia ainda</h3>
              <p className="text-slate-400 mb-6">Comece adicionando suas ideias acima</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredIdeas.map(idea => (
                <div
                  key={idea.id}
                  className={cn(
                    "p-4 rounded-xl border transition-all",
                    idea.status === 'chosen'
                      ? "bg-violet-500/10 border-violet-500/30"
                      : "bg-slate-800/50 border-slate-700/50 hover:border-slate-600"
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-white font-medium">{idea.title}</h3>
                        {idea.status === 'chosen' && (
                          <Star className="w-4 h-4 text-violet-400 fill-current" />
                        )}
                      </div>
                      {idea.description && (
                        <p className="text-slate-400 text-sm mt-1">{idea.description}</p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {/* AI Expand Button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => requestExpandIdea(idea)}
                        disabled={aiLoading !== null}
                        className="text-violet-400 hover:text-violet-300 hover:bg-violet-500/10"
                        title="Desenvolver com IA"
                      >
                        {aiLoading === 'expand' && aiSuggestion?.ideaId === idea.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Sparkles className="w-4 h-4" />
                        )}
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-slate-400">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                          <DropdownMenuItem 
                            onClick={() => handleEdit(idea)}
                            className="text-slate-400 focus:text-slate-300"
                          >
                            <Pencil className="w-4 h-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          {idea.status !== 'chosen' && (
                            <DropdownMenuItem 
                              onClick={() => handleSetFocus(idea)}
                              className="text-violet-400 focus:text-violet-300"
                            >
                              <Target className="w-4 h-4 mr-2" />
                              Definir como foco
                            </DropdownMenuItem>
                          )}
                          {idea.status !== 'archived' && (
                            <DropdownMenuItem 
                              onClick={() => handleArchive(idea)}
                              className="text-slate-400 focus:text-slate-300"
                            >
                              <Archive className="w-4 h-4 mr-2" />
                              Arquivar
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            onClick={() => handleDelete(idea)}
                            className="text-red-400 focus:text-red-300"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tips */}
          <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/30">
            <h3 className="text-sm font-medium text-white mb-2">💡 Dicas</h3>
            <ul className="text-sm text-slate-400 space-y-1">
              <li>• Use o botão <Sparkles className="w-3 h-3 inline text-violet-400" /> para pedir ajuda da IA</li>
              <li>• Defina apenas UMA ideia como foco por vez</li>
              <li>• Arquive ideias que podem esperar</li>
            </ul>
          </div>
        </div>
      </FlowLayout>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">Editar Ideia</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Título</label>
              <Input
                placeholder="Título da ideia"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Descrição</label>
              <Textarea
                placeholder="Descrição da ideia"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="bg-slate-800 border-slate-700 text-white min-h-[100px]"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleSaveEdit}
                disabled={!editTitle.trim() || isSubmitting}
                className="flex-1 bg-violet-500 hover:bg-violet-600"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Salvar
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsEditOpen(false)}
                className="border-slate-700 text-slate-300"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}