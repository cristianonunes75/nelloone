import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePerformance } from '../../hooks/usePerformance';
import { Plus, Play, Square, Target, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

function CreatePerformanceCycleDialog({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('180');
  const [endDate, setEndDate] = useState('');
  const { createCycle } = usePerformance();

  const handleCreate = async () => {
    if (!title.trim()) { toast.error('Informe o título'); return; }
    const result = await createCycle(title, type, endDate || undefined);
    if (result) { setOpen(false); setTitle(''); setEndDate(''); onCreated(); }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-1.5">
          <Plus className="w-3.5 h-3.5" />Performance
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Novo Ciclo de Performance</DialogTitle></DialogHeader>
        <div className="space-y-4 pt-2">
          <div><Label>Título</Label><Input placeholder="Ex: Avaliação S1 2026" value={title} onChange={e => setTitle(e.target.value)} /></div>
          <div>
            <Label>Tipo</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="90">90° (Autoavaliação)</SelectItem>
                <SelectItem value="180">180° (Gestor → Colaborador)</SelectItem>
                <SelectItem value="360">360° (Múltiplos avaliadores)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div><Label>Encerramento (opcional)</Label><Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} /></div>
          <Button onClick={handleCreate} className="w-full">Criar Ciclo</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function PerformanceTab() {
  const perf = usePerformance();

  useEffect(() => {
    perf.fetchCycles();
  }, [perf.fetchCycles]);

  const activeCycle = perf.activeCycle;
  const closedCycles = perf.cycles.filter(c => c.status === 'closed');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Performance Review
          </h2>
          <p className="text-sm text-muted-foreground">Ciclos de avaliação de desempenho</p>
        </div>
        <CreatePerformanceCycleDialog onCreated={() => perf.fetchCycles()} />
      </div>

      {/* Active Cycle */}
      {activeCycle ? (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardDescription>Ciclo Ativo</CardDescription>
                <CardTitle className="text-lg">{activeCycle.title}</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                  {activeCycle.review_type}°
                </span>
                {activeCycle.status === 'draft' && (
                  <Button size="sm" variant="outline" onClick={() => perf.activateCycle(activeCycle.id)}>
                    <Play className="w-3 h-3 mr-1" />Ativar
                  </Button>
                )}
                {activeCycle.status === 'active' && (
                  <Button size="sm" variant="outline" onClick={() => perf.closeCycle(activeCycle.id)}>
                    <Square className="w-3 h-3 mr-1" />Encerrar
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Status: <span className="font-medium capitalize">{activeCycle.status}</span>
              {activeCycle.end_date && ` · Encerra em ${new Date(activeCycle.end_date).toLocaleDateString('pt-BR')}`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">
              Nenhum ciclo de performance ativo. Crie um novo ciclo para começar.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Cycle History */}
      {closedCycles.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Histórico</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {closedCycles.map(cycle => (
              <Card key={cycle.id} className="opacity-75">
                <CardHeader className="pb-2">
                  <CardDescription>{cycle.review_type}°</CardDescription>
                  <CardTitle className="text-sm">{cycle.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    {new Date(cycle.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total de Ciclos</CardDescription>
            <CardTitle className="text-3xl">{perf.cycles.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Ciclos Concluídos</CardDescription>
            <CardTitle className="text-3xl">{closedCycles.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Tipo mais usado</CardDescription>
            <CardTitle className="text-3xl">
              {perf.cycles.length > 0
                ? (() => {
                    const counts: Record<string, number> = {};
                    perf.cycles.forEach(c => { counts[c.review_type] = (counts[c.review_type] || 0) + 1; });
                    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0] + '°';
                  })()
                : '—'
              }
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
