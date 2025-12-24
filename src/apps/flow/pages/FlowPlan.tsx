import { useState } from 'react';
import { ListTodo, Plus, Check, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { SEOHead } from '@/components/SEOHead';
import { FlowLayout } from '../components/FlowLayout';
import { useFlowData } from '../hooks/useFlowData';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function FlowPlan() {
  const { tasks, getCurrentWeek, addTask, toggleTask, deleteTask, loading } = useFlowData();
  const [newTask, setNewTask] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async () => {
    if (!newTask.trim()) return;
    
    setIsAdding(true);
    try {
      await addTask(newTask);
      setNewTask('');
      toast.success('Tarefa adicionada!');
    } catch (error) {
      toast.error('Erro ao adicionar tarefa');
    } finally {
      setIsAdding(false);
    }
  };

  const handleToggle = async (id: string, done: boolean) => {
    try {
      await toggleTask(id, !done);
    } catch (error) {
      toast.error('Erro ao atualizar tarefa');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTask(id);
      toast.success('Tarefa removida');
    } catch (error) {
      toast.error('Erro ao remover tarefa');
    }
  };

  const completedCount = tasks.filter(t => t.done).length;
  const totalCount = tasks.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

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
      <SEOHead title="Plano de Ação | Nello Flow" description="Seu plano semanal no Nello Flow" />
      
      <FlowLayout>
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <ListTodo className="w-7 h-7 text-green-400" />
              Plano de Ação
            </h1>
            <p className="text-slate-400 mt-1">
              Semana atual: {getCurrentWeek()}
            </p>
          </div>

          {/* Progress */}
          <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Progresso da Semana</h2>
              <span className="text-2xl font-bold text-white">{completedCount}/{totalCount}</span>
            </div>
            <Progress value={progressPercent} className="h-3" />
            <p className="text-sm text-slate-400 mt-2">
              {progressPercent === 100 
                ? '🎉 Parabéns! Você completou todas as tarefas!'
                : progressPercent >= 50 
                  ? '💪 Você está no caminho certo!' 
                  : 'Vamos focar nas tarefas desta semana'}
            </p>
          </div>

          {/* Add Task */}
          <div className="flex gap-3">
            <Input
              placeholder="Nova tarefa para esta semana..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              className="bg-slate-800/50 border-slate-700 text-white"
            />
            <Button
              onClick={handleAdd}
              disabled={!newTask.trim() || isAdding}
              className="bg-violet-500 hover:bg-violet-600"
            >
              {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            </Button>
          </div>

          {/* Tasks List */}
          {tasks.length === 0 ? (
            <div className="text-center py-16">
              <ListTodo className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Nenhuma tarefa ainda</h3>
              <p className="text-slate-400">Adicione tarefas para sua semana acima</p>
            </div>
          ) : (
            <div className="space-y-2">
              {tasks.map(task => (
                <div
                  key={task.id}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-xl border transition-all group",
                    task.done
                      ? "bg-green-500/10 border-green-500/30"
                      : "bg-slate-800/50 border-slate-700/50 hover:border-slate-600"
                  )}
                >
                  <Checkbox
                    checked={task.done}
                    onCheckedChange={() => handleToggle(task.id, task.done)}
                    className="border-slate-600 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                  />
                  <span className={cn(
                    "flex-1 transition-all",
                    task.done ? "text-slate-400 line-through" : "text-white"
                  )}>
                    {task.description}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(task.id)}
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Tips */}
          <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/30">
            <h3 className="text-sm font-medium text-white mb-2">💡 Dicas do Método FLOW</h3>
            <ul className="text-sm text-slate-400 space-y-1">
              <li>• Limite-se a 5-7 tarefas por semana</li>
              <li>• Cada tarefa deve ser específica e acionável</li>
              <li>• Priorize o que move o ponteiro do seu negócio</li>
              <li>• Comece pelas tarefas mais importantes</li>
            </ul>
          </div>
        </div>
      </FlowLayout>
    </>
  );
}
