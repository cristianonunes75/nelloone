import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Plus,
  Minus,
  Trash2,
  UserPlus,
  Check,
  Loader2,
  X,
  PencilLine,
} from 'lucide-react';
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
import { useMiniMercadoServos } from '../hooks/useMiniMercadoServos';
import { useMiniMercadoCatalog } from '../hooks/useMiniMercadoCatalog';
import { useMiniMercadoPurchases } from '../hooks/useMiniMercadoPurchases';
import { formatBRL, parseBRLToCents } from '../utils/brl';
import type { CartItem, MMServo } from '../types';

export function MiniMercadoBalcao() {
  const { activeEventId, activeOperatorId } = useMiniMercado();
  const { servos, teams, addServo, teamName } = useMiniMercadoServos(activeEventId);
  const { products, isLoading: loadingProducts } = useMiniMercadoCatalog(activeEventId, true);
  const { createPurchase } = useMiniMercadoPurchases(activeEventId);

  const [servo, setServo] = useState<MMServo | null>(null);
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // dialogs
  const [quickOpen, setQuickOpen] = useState(false);
  const [avulsoOpen, setAvulsoOpen] = useState(false);

  // quick add servo
  const [qName, setQName] = useState('');
  const [qTeam, setQTeam] = useState<string>('none');
  // item avulso
  const [aName, setAName] = useState('');
  const [aPrice, setAPrice] = useState('');

  const filteredServos = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return servos;
    return servos.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.nickname || '').toLowerCase().includes(q)
    );
  }, [servos, search]);

  const total = cart.reduce((acc, it) => acc + it.price_cents * it.qty, 0);

  const addToCart = (item: { product_id: string | null; name: string; price_cents: number }) => {
    setCart((prev) => {
      const idx = prev.findIndex((c) => c.product_id && c.product_id === item.product_id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
        return next;
      }
      return [
        ...prev,
        {
          key: item.product_id ?? `avulso-${Date.now()}-${prev.length}`,
          product_id: item.product_id,
          name: item.name,
          price_cents: item.price_cents,
          qty: 1,
        },
      ];
    });
  };

  const changeQty = (key: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) => (c.key === key ? { ...c, qty: c.qty + delta } : c))
        .filter((c) => c.qty > 0)
    );
  };

  const removeItem = (key: string) =>
    setCart((prev) => prev.filter((c) => c.key !== key));

  const handleQuickAdd = async () => {
    if (!qName.trim()) {
      toast.error('Informe o nome');
      return;
    }
    try {
      const created = await addServo({
        name: qName.trim(),
        team_id: qTeam === 'none' ? null : qTeam,
        is_quick_add: true,
      });
      setServo(created);
      setQuickOpen(false);
      setQName('');
      setQTeam('none');
      toast.success('Membro adicionado');
    } catch (e: any) {
      toast.error(e?.message || 'Erro ao adicionar');
    }
  };

  const handleAvulso = () => {
    const cents = parseBRLToCents(aPrice);
    if (!aName.trim() || cents <= 0) {
      toast.error('Informe nome e valor do item');
      return;
    }
    addToCart({ product_id: null, name: aName.trim(), price_cents: cents });
    setAvulsoOpen(false);
    setAName('');
    setAPrice('');
  };

  const handleSubmit = async () => {
    if (!servo || cart.length === 0) return;
    setSubmitting(true);
    try {
      await createPurchase({
        servoId: servo.id,
        operatorId: activeOperatorId,
        items: cart,
      });
      toast.success(`Compra lançada para ${servo.nickname || servo.name}`);
      setCart([]);
      setServo(null);
      setSearch('');
    } catch (e: any) {
      toast.error(e?.message || 'Erro ao lançar compra');
    } finally {
      setSubmitting(false);
    }
  };

  // ===== Etapa 1: escolher servo =====
  if (!servo) {
    return (
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar membro por nome ou apelido"
            className="h-12 pl-9 text-base"
            autoFocus
          />
        </div>
        <Button
          variant="outline"
          className="w-full border-amber-300 text-amber-800"
          onClick={() => setQuickOpen(true)}
        >
          <UserPlus className="mr-2 h-4 w-4" /> Adicionar membro rápido
        </Button>

        {servos.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="p-6 text-center text-sm text-muted-foreground">
              Nenhum membro cadastrado ainda. Use{' '}
              <Link to="/mini-mercado/servos" className="font-medium text-amber-700 underline">
                Membros
              </Link>{' '}
              para cadastrar a equipe ou importar o PDF.
            </CardContent>
          </Card>
        )}

        <div className="space-y-2">
          {filteredServos.map((s) => (
            <button
              key={s.id}
              onClick={() => setServo(s)}
              className="flex w-full items-center gap-3 rounded-lg border bg-background p-3 text-left transition-colors hover:bg-amber-50"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-semibold text-amber-800">
                {(s.nickname || s.name).slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-foreground">{s.name}</p>
                {(s.nickname || s.team_id) && (
                  <p className="truncate text-xs text-muted-foreground">
                    {s.nickname ? s.nickname : ''}
                    {s.nickname && s.team_id ? ' · ' : ''}
                    {teamName(s.team_id)}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Dialog quick add */}
        <Dialog open={quickOpen} onOpenChange={setQuickOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Membro rápido</DialogTitle>
              <DialogDescription>Cadastro rápido no balcão.</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label>Nome</Label>
                <Input value={qName} onChange={(e) => setQName(e.target.value)} autoFocus />
              </div>
              <div className="space-y-1.5">
                <Label>Equipe</Label>
                <Select value={qTeam} onValueChange={setQTeam}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sem equipe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sem equipe</SelectItem>
                    {teams.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setQuickOpen(false)}>
                Cancelar
              </Button>
              <Button className="bg-amber-700 hover:bg-amber-800" onClick={handleQuickAdd}>
                Adicionar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // ===== Etapa 2: lançar compra =====
  return (
    <div className="space-y-4 pb-28">
      {/* servo selecionado */}
      <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50/60 p-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-200 text-sm font-semibold text-amber-900">
          {(servo.nickname || servo.name).slice(0, 2).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-amber-900">{servo.name}</p>
          <p className="truncate text-xs text-amber-800/70">{teamName(servo.team_id)}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-amber-800"
          onClick={() => {
            setServo(null);
            setCart([]);
          }}
        >
          <X className="mr-1 h-4 w-4" /> Trocar
        </Button>
      </div>

      {/* grade de produtos */}
      {loadingProducts ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-7 w-7 animate-spin text-amber-700" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {products.map((p) => (
            <button
              key={p.id}
              onClick={() => addToCart({ product_id: p.id, name: p.name, price_cents: p.price_cents })}
              className="flex min-h-[72px] flex-col items-start justify-between rounded-lg border bg-background p-3 text-left transition-colors active:bg-amber-100"
            >
              <span className="text-sm font-medium leading-tight text-foreground">{p.name}</span>
              <span className="mt-1 text-sm font-semibold text-amber-700">
                {formatBRL(p.price_cents)}
              </span>
            </button>
          ))}
          <button
            onClick={() => setAvulsoOpen(true)}
            className="flex min-h-[72px] flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-amber-300 p-3 text-amber-700 transition-colors active:bg-amber-100"
          >
            <PencilLine className="h-5 w-5" />
            <span className="text-xs font-medium">Item avulso</span>
          </button>
        </div>
      )}

      {/* carrinho */}
      {cart.length > 0 && (
        <Card>
          <CardContent className="space-y-2 p-3">
            {cart.map((it) => (
              <div key={it.key} className="flex items-center gap-2">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{it.name}</p>
                  <p className="text-xs text-muted-foreground">{formatBRL(it.price_cents)}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => changeQty(it.key, -1)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-6 text-center text-sm font-semibold">{it.qty}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => changeQty(it.key, 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <span className="w-20 text-right text-sm font-semibold">
                  {formatBRL(it.price_cents * it.qty)}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground"
                  onClick={() => removeItem(it.key)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* barra fixa de lançar */}
      <div className="fixed bottom-16 left-0 right-0 z-30 border-t bg-background/95 p-3 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-lg font-bold text-amber-900">{formatBRL(total)}</p>
          </div>
          <Button
            size="lg"
            className="h-12 flex-1 bg-amber-700 text-base hover:bg-amber-800"
            disabled={cart.length === 0 || submitting}
            onClick={handleSubmit}
          >
            {submitting ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Check className="mr-2 h-5 w-5" />
            )}
            Lançar compra
          </Button>
        </div>
      </div>

      {/* Dialog item avulso */}
      <Dialog open={avulsoOpen} onOpenChange={setAvulsoOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Item avulso</DialogTitle>
            <DialogDescription>Produto que não está no catálogo.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Nome do item</Label>
              <Input value={aName} onChange={(e) => setAName(e.target.value)} autoFocus />
            </div>
            <div className="space-y-1.5">
              <Label>Valor</Label>
              <Input
                value={aPrice}
                onChange={(e) => setAPrice(e.target.value)}
                inputMode="decimal"
                placeholder="Ex: 5,00"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAvulsoOpen(false)}>
              Cancelar
            </Button>
            <Button className="bg-amber-700 hover:bg-amber-800" onClick={handleAvulso}>
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
