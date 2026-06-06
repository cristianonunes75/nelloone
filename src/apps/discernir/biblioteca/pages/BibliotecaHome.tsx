import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FolderOpen, Plus, Loader2, FolderPlus } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useBibliotecaAccess } from '../contexts/BibliotecaAccessContext';
import { useBibliotecaFolders } from '../hooks/useBibliotecaData';

export function BibliotecaHome() {
  const { canEdit } = useBibliotecaAccess();
  const { folders, isLoading, addFolder } = useBibliotecaFolders();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [name, setName] = useState('');
  const [kind, setKind] = useState<'geral' | 'equipe' | 'outro'>('equipe');

  const handleAdd = async () => {
    if (!name.trim()) {
      toast.error('Dê um nome à pasta');
      return;
    }
    setBusy(true);
    try {
      await addFolder(name.trim(), kind);
      toast.success('Pasta criada');
      setOpen(false);
      setName('');
    } catch (e: any) {
      toast.error(e?.message || 'Erro ao criar pasta');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-lg font-semibold text-amber-900">Pastas</h2>
        {canEdit && (
          <Button size="sm" className="bg-amber-700 hover:bg-amber-800" onClick={() => setOpen(true)}>
            <Plus className="mr-1 h-4 w-4" /> Nova pasta
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-7 w-7 animate-spin text-amber-700" />
        </div>
      ) : folders.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center gap-2 p-8 text-center text-sm text-muted-foreground">
            <FolderPlus className="h-7 w-7 text-amber-700/70" />
            Nenhuma pasta ainda. Crie "Geral" e uma por equipe (Cozinha, Liturgia...).
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2">
          {folders.map((f) => (
            <Link key={f.id} to={`/biblioteca/pasta/${f.id}`}>
              <Card className="transition-colors hover:bg-amber-50">
                <CardContent className="flex items-center gap-3 p-4">
                  <FolderOpen className="h-6 w-6 text-amber-700" />
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">{f.name}</p>
                    <p className="text-xs capitalize text-muted-foreground">{f.kind}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova pasta</DialogTitle>
            <DialogDescription>Ex: Geral, Cozinha, Liturgia, Acolhida.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Nome</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} autoFocus />
            </div>
            <div className="space-y-1.5">
              <Label>Tipo</Label>
              <Select value={kind} onValueChange={(v) => setKind(v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="geral">Geral</SelectItem>
                  <SelectItem value="equipe">Equipe</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={busy}>
              Cancelar
            </Button>
            <Button className="bg-amber-700 hover:bg-amber-800" onClick={handleAdd} disabled={busy}>
              {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Criar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
