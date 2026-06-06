import { useState } from 'react';
import { Plus, Copy, Loader2, Power } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
import { useMiniMercado } from '../contexts/MiniMercadoContext';
import { useMiniMercadoCatalog } from '../hooks/useMiniMercadoCatalog';
import { formatBRL, parseBRLToCents } from '../utils/brl';
import type { MMProduct } from '../types';

export function MiniMercadoProdutos() {
  const { activeEventId, events } = useMiniMercado();
  const { products, isLoading, addProduct, updateProduct, copyFromEvent } =
    useMiniMercadoCatalog(activeEventId);

  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<MMProduct | null>(null);
  const [copyOpen, setCopyOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [copySource, setCopySource] = useState<string>('');

  const otherEvents = events.filter((e) => e.event.id !== activeEventId);

  const openAdd = () => {
    setName('');
    setPrice('');
    setEditing(null);
    setAddOpen(true);
  };

  const openEdit = (p: MMProduct) => {
    setEditing(p);
    setName(p.name);
    setPrice((p.price_cents / 100).toFixed(2).replace('.', ','));
    setAddOpen(true);
  };

  const handleSave = async () => {
    const cents = parseBRLToCents(price);
    if (!name.trim() || cents <= 0) {
      toast.error('Informe nome e valor');
      return;
    }
    setBusy(true);
    try {
      if (editing) {
        await updateProduct(editing.id, { name: name.trim(), price_cents: cents });
        toast.success('Produto atualizado');
      } else {
        await addProduct(name.trim(), cents);
        toast.success('Produto adicionado');
      }
      setAddOpen(false);
    } catch (e: any) {
      toast.error(e?.message || 'Erro ao salvar');
    } finally {
      setBusy(false);
    }
  };

  const toggleActive = async (p: MMProduct) => {
    try {
      await updateProduct(p.id, { is_active: !p.is_active });
    } catch (e: any) {
      toast.error(e?.message || 'Erro');
    }
  };

  const handleCopy = async () => {
    if (!copySource) return;
    setBusy(true);
    try {
      const n = await copyFromEvent(copySource);
      toast.success(n > 0 ? `${n} produtos copiados` : 'Nada para copiar');
      setCopyOpen(false);
    } catch (e: any) {
      toast.error(e?.message || 'Erro ao copiar');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-lg font-semibold text-amber-900">Produtos</h2>
        <div className="flex gap-2">
          {otherEvents.length > 0 && (
            <Button variant="outline" size="sm" onClick={() => setCopyOpen(true)}>
              <Copy className="mr-1 h-4 w-4" /> Copiar
            </Button>
          )}
          <Button size="sm" className="bg-amber-700 hover:bg-amber-800" onClick={openAdd}>
            <Plus className="mr-1 h-4 w-4" /> Novo
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-7 w-7 animate-spin text-amber-700" />
        </div>
      ) : products.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-6 text-center text-sm text-muted-foreground">
            Nenhum produto. Adicione o primeiro ou copie de outro retiro.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {products.map((p) => (
            <Card key={p.id} className={p.is_active ? '' : 'opacity-60'}>
              <CardContent className="flex items-center gap-3 p-3">
                <button className="min-w-0 flex-1 text-left" onClick={() => openEdit(p)}>
                  <p className="truncate font-medium text-foreground">{p.name}</p>
                  <p className="text-sm font-semibold text-amber-700">{formatBRL(p.price_cents)}</p>
                </button>
                {!p.is_active && (
                  <Badge variant="outline" className="text-[10px]">
                    inativo
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground"
                  onClick={() => toggleActive(p)}
                  title={p.is_active ? 'Desativar' : 'Ativar'}
                >
                  <Power className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog add/edit */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar produto' : 'Novo produto'}</DialogTitle>
            <DialogDescription>Preço deste retiro.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Nome</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} autoFocus />
            </div>
            <div className="space-y-1.5">
              <Label>Valor</Label>
              <Input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                inputMode="decimal"
                placeholder="Ex: 5,00"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)} disabled={busy}>
              Cancelar
            </Button>
            <Button className="bg-amber-700 hover:bg-amber-800" onClick={handleSave} disabled={busy}>
              {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog copiar */}
      <Dialog open={copyOpen} onOpenChange={setCopyOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Copiar catálogo</DialogTitle>
            <DialogDescription>
              Traz os produtos de outro retiro. Produtos repetidos são ignorados.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5">
            <Label>Retiro de origem</Label>
            <Select value={copySource} onValueChange={setCopySource}>
              <SelectTrigger>
                <SelectValue placeholder="Escolha o retiro" />
              </SelectTrigger>
              <SelectContent>
                {otherEvents.map((e) => (
                  <SelectItem key={e.event.id} value={e.event.id}>
                    {e.event.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCopyOpen(false)} disabled={busy}>
              Cancelar
            </Button>
            <Button
              className="bg-amber-700 hover:bg-amber-800"
              onClick={handleCopy}
              disabled={busy || !copySource}
            >
              {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Copiar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
