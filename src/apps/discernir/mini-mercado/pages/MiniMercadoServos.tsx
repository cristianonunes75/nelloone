import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Loader2, Users, FileUp } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import type { MMServoKind } from '../types';

const KINDS: { value: MMServoKind; label: string }[] = [
  { value: 'casal', label: 'Casal' },
  { value: 'jovem', label: 'Jovem' },
  { value: 'individual', label: 'Individual' },
  { value: 'padre', label: 'Padre' },
];

export function MiniMercadoServos() {
  const navigate = useNavigate();
  const { activeEventId, activeRole } = useMiniMercado();
  const { servos, teams, addServo, addTeam, teamName, isLoading } =
    useMiniMercadoServos(activeEventId);

  const [servoOpen, setServoOpen] = useState(false);
  const [teamOpen, setTeamOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [filterTeam, setFilterTeam] = useState<string>('all');

  // form servo
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [phone, setPhone] = useState('');
  const [kind, setKind] = useState<MMServoKind>('individual');
  const [teamId, setTeamId] = useState<string>('none');
  // form team
  const [teamNameInput, setTeamNameInput] = useState('');

  const filteredServos = useMemo(() => {
    if (filterTeam === 'all') return servos;
    if (filterTeam === 'none') return servos.filter((s) => !s.team_id);
    return servos.filter((s) => s.team_id === filterTeam);
  }, [servos, filterTeam]);

  const handleAddServo = async () => {
    if (!name.trim()) {
      toast.error('Informe o nome');
      return;
    }
    setBusy(true);
    try {
      await addServo({
        name: name.trim(),
        nickname: nickname.trim() || null,
        phone: phone.trim() || null,
        kind,
        team_id: teamId === 'none' ? null : teamId,
      });
      toast.success('Trabalhador cadastrado');
      setServoOpen(false);
      setName('');
      setNickname('');
      setPhone('');
      setKind('individual');
      setTeamId('none');
    } catch (e: any) {
      toast.error(e?.message || 'Erro ao cadastrar');
    } finally {
      setBusy(false);
    }
  };

  const handleAddTeam = async () => {
    if (!teamNameInput.trim()) {
      toast.error('Informe o nome da equipe');
      return;
    }
    setBusy(true);
    try {
      await addTeam(teamNameInput.trim());
      toast.success('Equipe criada');
      setTeamOpen(false);
      setTeamNameInput('');
    } catch (e: any) {
      toast.error(e?.message || 'Erro ao criar equipe');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-3">
      <Tabs defaultValue="servos">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="servos">Trabalhadores ({servos.length})</TabsTrigger>
          <TabsTrigger value="equipes">Equipes ({teams.length})</TabsTrigger>
        </TabsList>

        {/* SERVOS */}
        <TabsContent value="servos" className="space-y-3">
          <div className="flex items-center gap-2">
            <Select value={filterTeam} onValueChange={setFilterTeam}>
              <SelectTrigger className="h-9 flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as equipes</SelectItem>
                <SelectItem value="none">Sem equipe</SelectItem>
                {teams.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button size="sm" className="bg-amber-700 hover:bg-amber-800" onClick={() => setServoOpen(true)}>
              <Plus className="mr-1 h-4 w-4" /> Trabalhador
            </Button>
          </div>

          {activeRole === 'gestor' && (
            <Button
              variant="outline"
              className="w-full border-amber-300 text-amber-800"
              onClick={() => navigate('/mini-mercado/importar')}
            >
              <FileUp className="mr-2 h-4 w-4" /> Importar de PDF, Word ou foto
            </Button>
          )}

          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-7 w-7 animate-spin text-amber-700" />
            </div>
          ) : filteredServos.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="p-6 text-center text-sm text-muted-foreground">
                Nenhum trabalhador aqui ainda.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {filteredServos.map((s) => (
                <Card key={s.id}>
                  <CardContent className="flex items-center gap-3 p-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-xs font-semibold text-amber-800">
                      {(s.nickname || s.name).slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-foreground">{s.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {s.nickname ? `"${s.nickname}"` : ''}
                        {s.nickname && s.team_id ? ' · ' : ''}
                        {teamName(s.team_id)}
                      </p>
                    </div>
                    {s.is_quick_add && (
                      <Badge variant="outline" className="text-[10px]">
                        balcão
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* EQUIPES */}
        <TabsContent value="equipes" className="space-y-3">
          <Button size="sm" className="bg-amber-700 hover:bg-amber-800" onClick={() => setTeamOpen(true)}>
            <Plus className="mr-1 h-4 w-4" /> Nova equipe
          </Button>
          {teams.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="p-6 text-center text-sm text-muted-foreground">
                Nenhuma equipe. Crie as equipes de trabalho do retiro (Cozinha, Liturgia, etc.).
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {teams.map((t) => {
                const count = servos.filter((s) => s.team_id === t.id).length;
                return (
                  <Card key={t.id}>
                    <CardContent className="flex items-center gap-3 p-3">
                      <Users className="h-5 w-5 text-amber-700" />
                      <p className="flex-1 font-medium">{t.name}</p>
                      <Badge variant="outline" className="text-xs">
                        {count}
                      </Badge>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialog servo */}
      <Dialog open={servoOpen} onOpenChange={setServoOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo trabalhador</DialogTitle>
            <DialogDescription>Quem compra e acerta no fim do retiro.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Nome completo</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} autoFocus />
            </div>
            <div className="space-y-1.5">
              <Label>Como é chamado no retiro</Label>
              <Input
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Apelido / nome de tratamento usado no retiro"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Telefone</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Tipo</Label>
                <Select value={kind} onValueChange={(v) => setKind(v as MMServoKind)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {KINDS.map((k) => (
                      <SelectItem key={k.value} value={k.value}>
                        {k.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Equipe</Label>
                <Select value={teamId} onValueChange={setTeamId}>
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setServoOpen(false)} disabled={busy}>
              Cancelar
            </Button>
            <Button className="bg-amber-700 hover:bg-amber-800" onClick={handleAddServo} disabled={busy}>
              {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog equipe */}
      <Dialog open={teamOpen} onOpenChange={setTeamOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova equipe</DialogTitle>
            <DialogDescription>Equipe de trabalho do retiro.</DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5">
            <Label>Nome da equipe</Label>
            <Input
              value={teamNameInput}
              onChange={(e) => setTeamNameInput(e.target.value)}
              placeholder="Ex: Cozinha"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTeamOpen(false)} disabled={busy}>
              Cancelar
            </Button>
            <Button className="bg-amber-700 hover:bg-amber-800" onClick={handleAddTeam} disabled={busy}>
              {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Criar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
