import { useState } from 'react';
import { UserPlus, Loader2, Trash2, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useBibliotecaMembers, type EccMember } from '../hooks/useBibliotecaMembers';

const ROLE_LABEL: Record<string, string> = {
  owner: 'Dono',
  editor: 'Editor',
  viewer: 'Leitor',
};

export function BibliotecaAcesso() {
  const { members, isLoading, addMember, updateRole, removeMember } = useBibliotecaMembers();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<EccMember['role']>('viewer');
  const [busy, setBusy] = useState(false);

  const handleAdd = async () => {
    if (!email.includes('@')) {
      toast.error('Informe um e-mail válido');
      return;
    }
    setBusy(true);
    try {
      await addMember(email, role);
      toast.success('Acesso liberado');
      setEmail('');
      setRole('viewer');
    } catch (e: any) {
      toast.error(e?.message?.includes('duplicate') ? 'Esse e-mail já tem acesso' : e?.message || 'Erro');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-3">
      <h2 className="font-serif text-lg font-semibold text-amber-900">Quem tem acesso</h2>
      <p className="text-sm text-muted-foreground">
        Libere por e-mail. <strong>Editor</strong> pode adicionar e transcrever; <strong>Leitor</strong> só consulta.
      </p>

      <Card>
        <CardContent className="space-y-3 p-3">
          <div className="space-y-1.5">
            <Label>E-mail</Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="pessoa@email.com"
              inputMode="email"
            />
          </div>
          <div className="flex gap-2">
            <Select value={role} onValueChange={(v) => setRole(v as EccMember['role'])}>
              <SelectTrigger className="flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="viewer">Leitor</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
                <SelectItem value="owner">Dono</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-amber-700 hover:bg-amber-800" onClick={handleAdd} disabled={busy}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-amber-700" />
        </div>
      ) : (
        <div className="space-y-2">
          {members.map((m) => (
            <Card key={m.id}>
              <CardContent className="flex items-center gap-3 p-3">
                <ShieldCheck className="h-4 w-4 shrink-0 text-amber-700" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{m.email}</p>
                  {!m.user_id && <p className="text-[10px] text-muted-foreground">aguardando 1º login</p>}
                </div>
                {m.role === 'owner' ? (
                  <Badge variant="outline" className="border-amber-300 text-amber-800">
                    {ROLE_LABEL[m.role]}
                  </Badge>
                ) : (
                  <>
                    <Select value={m.role} onValueChange={(v) => updateRole(m.id, v as EccMember['role'])}>
                      <SelectTrigger className="h-8 w-24 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="viewer">Leitor</SelectItem>
                        <SelectItem value="editor">Editor</SelectItem>
                        <SelectItem value="owner">Dono</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground"
                      onClick={() => removeMember(m.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
