import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, Plus, LogIn, ArrowRight, Loader2, Users } from 'lucide-react';
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
import { useMiniMercadoEvents } from '../hooks/useMiniMercadoEvents';

const MOVEMENTS = [
  { value: 'ecc', label: 'ECC' },
  { value: 'segue-me', label: 'Segue-me' },
  { value: 'vem', label: 'Vem' },
  { value: 'outro', label: 'Outro' },
];

export function MiniMercadoOnboarding() {
  const navigate = useNavigate();
  const { events, isLoading, setActiveEventId, refetch } = useMiniMercado();
  const { createEvent, joinEvent } = useMiniMercadoEvents();

  const [createOpen, setCreateOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  // form criar
  const [name, setName] = useState('');
  const [movement, setMovement] = useState('ecc');
  const [startsOn, setStartsOn] = useState('');
  const [endsOn, setEndsOn] = useState('');
  const [pixKey, setPixKey] = useState('');

  // form entrar
  const [joinCode, setJoinCode] = useState('');

  const operar = (id: string) => {
    setActiveEventId(id);
    navigate('/mini-mercado/balcao');
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error('Dê um nome ao retiro');
      return;
    }
    setBusy(true);
    try {
      const ev = await createEvent({
        name: name.trim(),
        movement,
        starts_on: startsOn || null,
        ends_on: endsOn || null,
        pix_key: pixKey.trim() || null,
      });
      await refetch();
      toast.success('Retiro criado!');
      setCreateOpen(false);
      setName('');
      setPixKey('');
      setStartsOn('');
      setEndsOn('');
      operar(ev.id);
    } catch (e: any) {
      toast.error(e?.message || 'Erro ao criar retiro');
    } finally {
      setBusy(false);
    }
  };

  const handleJoin = async () => {
    if (!joinCode.trim()) {
      toast.error('Informe o código do retiro');
      return;
    }
    setBusy(true);
    try {
      const id = await joinEvent(joinCode.trim());
      await refetch();
      toast.success('Você entrou no retiro!');
      setJoinOpen(false);
      setJoinCode('');
      operar(id);
    } catch (e: any) {
      toast.error(e?.message || 'Código inválido');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-amber-50/30">
      <div className="mx-auto w-full max-w-2xl px-4 py-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100">
            <Store className="h-6 w-6 text-amber-700" />
          </div>
          <div>
            <h1 className="font-serif text-xl font-semibold text-amber-900">Mini Mercado</h1>
            <p className="text-sm text-amber-800/70">Vendas do retiro, acerto no fim</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-amber-700" />
          </div>
        ) : (
          <>
            {events.length > 0 && (
              <div className="mb-6 space-y-3">
                <h2 className="text-sm font-medium text-amber-900/80">Seus retiros</h2>
                {events.map((e) => (
                  <Card key={e.event.id} className="border-amber-200/70">
                    <CardContent className="flex items-center gap-3 p-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate font-semibold text-amber-900">{e.event.name}</p>
                          <Badge
                            variant="outline"
                            className="border-amber-300 bg-amber-50 text-[10px] text-amber-800"
                          >
                            {e.role === 'gestor' ? 'Gestor' : 'Caixa'}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {(e.event.movement || '').toUpperCase()} · código{' '}
                          <span className="font-mono font-semibold">{e.event.join_code}</span>
                        </p>
                      </div>
                      <Button
                        size="sm"
                        className="bg-amber-700 hover:bg-amber-800"
                        onClick={() => operar(e.event.id)}
                      >
                        Operar <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <Card
                className="cursor-pointer border-amber-200/70 transition-colors hover:bg-amber-50"
                onClick={() => setCreateOpen(true)}
              >
                <CardContent className="flex flex-col items-center gap-2 p-6 text-center">
                  <Plus className="h-7 w-7 text-amber-700" />
                  <p className="font-medium text-amber-900">Criar retiro</p>
                  <p className="text-xs text-muted-foreground">
                    Você vira o gestor e configura produtos e equipe
                  </p>
                </CardContent>
              </Card>
              <Card
                className="cursor-pointer border-amber-200/70 transition-colors hover:bg-amber-50"
                onClick={() => setJoinOpen(true)}
              >
                <CardContent className="flex flex-col items-center gap-2 p-6 text-center">
                  <LogIn className="h-7 w-7 text-amber-700" />
                  <p className="font-medium text-amber-900">Entrar por código</p>
                  <p className="text-xs text-muted-foreground">
                    Sua equipe lança vendas com o código do retiro
                  </p>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>

      {/* Dialog criar */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar retiro</DialogTitle>
            <DialogDescription>
              Configure o básico. Produtos e membros você cadastra depois.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Nome do retiro</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: XXXII ECC Lago Sul"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Movimento</Label>
              <Select value={movement} onValueChange={setMovement}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MOVEMENTS.map((m) => (
                    <SelectItem key={m.value} value={m.value}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Início</Label>
                <Input type="date" value={startsOn} onChange={(e) => setStartsOn(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Fim</Label>
                <Input type="date" value={endsOn} onChange={(e) => setEndsOn(e.target.value)} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Chave PIX (para o acerto)</Label>
              <Input
                value={pixKey}
                onChange={(e) => setPixKey(e.target.value)}
                placeholder="Opcional agora, pode pôr depois"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)} disabled={busy}>
              Cancelar
            </Button>
            <Button className="bg-amber-700 hover:bg-amber-800" onClick={handleCreate} disabled={busy}>
              {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Criar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog entrar */}
      <Dialog open={joinOpen} onOpenChange={setJoinOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Entrar por código</DialogTitle>
            <DialogDescription>
              Peça ao gestor o código de 6 letras/números do retiro.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-amber-700" /> Código do retiro
            </Label>
            <Input
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="Ex: A1B2C3"
              className="font-mono text-lg tracking-widest"
              maxLength={8}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setJoinOpen(false)} disabled={busy}>
              Cancelar
            </Button>
            <Button className="bg-amber-700 hover:bg-amber-800" onClick={handleJoin} disabled={busy}>
              {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Entrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
