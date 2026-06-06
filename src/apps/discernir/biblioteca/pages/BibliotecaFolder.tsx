import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FileText, Plus, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useBibliotecaAccess } from '../contexts/BibliotecaAccessContext';
import { useBibliotecaFolders, useBibliotecaDocuments } from '../hooks/useBibliotecaData';

export function BibliotecaFolder() {
  const { id } = useParams<{ id: string }>();
  const { canEdit } = useBibliotecaAccess();
  const { folders } = useBibliotecaFolders();
  const { documents, isLoading, addDocument } = useBibliotecaDocuments(id ?? null);
  const folder = folders.find((f) => f.id === id);

  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleAdd = async () => {
    if (!title.trim()) {
      toast.error('Dê um título ao documento');
      return;
    }
    setBusy(true);
    try {
      await addDocument(title.trim(), description);
      toast.success('Documento criado');
      setOpen(false);
      setTitle('');
      setDescription('');
    } catch (e: any) {
      toast.error(e?.message || 'Erro ao criar documento');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-3">
      <Link to="/biblioteca" className="flex items-center gap-1 text-sm text-amber-700">
        <ArrowLeft className="h-4 w-4" /> Pastas
      </Link>

      <div className="flex items-center justify-between">
        <h2 className="font-serif text-lg font-semibold text-amber-900">
          {folder?.name ?? 'Pasta'}
        </h2>
        {canEdit && (
          <Button size="sm" className="bg-amber-700 hover:bg-amber-800" onClick={() => setOpen(true)}>
            <Plus className="mr-1 h-4 w-4" /> Documento
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-7 w-7 animate-spin text-amber-700" />
        </div>
      ) : documents.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-8 text-center text-sm text-muted-foreground">
            Nenhum documento nesta pasta ainda.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {documents.map((d) => (
            <Link key={d.id} to={`/biblioteca/doc/${d.id}`}>
              <Card className="transition-colors hover:bg-amber-50">
                <CardContent className="flex items-center gap-3 p-3">
                  <FileText className="h-5 w-5 shrink-0 text-amber-700" />
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">{d.title}</p>
                    {d.description && (
                      <p className="truncate text-xs text-muted-foreground">{d.description}</p>
                    )}
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
            <DialogTitle>Novo documento</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Título</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
            </div>
            <div className="space-y-1.5">
              <Label>Descrição (opcional)</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
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
