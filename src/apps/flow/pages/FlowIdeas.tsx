import { useState } from 'react';
import { Lightbulb, Plus, Star, Archive, Trash2, MoreVertical, Target, Loader2 } from 'lucide-react';
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

export default function FlowIdeas() {
  const { ideas, chosenIdea, loading, addIdea, updateIdea, deleteIdea, setIdeaAsFocus } = useFlowData();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filter, setFilter] = useState<'all' | 'backlog' | 'archived'>('all');

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
              <DialogContent className="bg-slate-900 border-slate-700">
                <DialogHeader>
                  <DialogTitle className="text-white">Nova Ideia</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <Input
                    placeholder="Título da ideia"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                  <Textarea
                    placeholder="Descrição (opcional)"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white min-h-[100px]"
                  />
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
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-slate-400">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
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
              ))}
            </div>
          )}
        </div>
      </FlowLayout>
    </>
  );
}
