import { useState, useEffect } from 'react';
import { useDiscernirAuth } from '../../contexts/DiscernirAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  Loader2,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  Copy
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Invite {
  id: string;
  spouse_a_email: string;
  spouse_b_email: string;
  spouse_a_name: string | null;
  spouse_b_name: string | null;
  status: string;
  invite_token: string;
  expires_at: string;
  created_at: string;
}

export function DiscernirPriestInvites() {
  const { priest } = useDiscernirAuth();
  const [invites, setInvites] = useState<Invite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Form state
  const [spouseAName, setSpouseAName] = useState('');
  const [spouseAEmail, setSpouseAEmail] = useState('');
  const [spouseBName, setSpouseBName] = useState('');
  const [spouseBEmail, setSpouseBEmail] = useState('');

  useEffect(() => {
    fetchInvites();
  }, [priest]);

  const fetchInvites = async () => {
    if (!priest) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('discernir_couple_invites')
        .select('*')
        .eq('parish_id', priest.parish_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvites(data || []);
    } catch (error: any) {
      console.error('Error fetching invites:', error);
      toast.error('Erro ao carregar convites');
    } finally {
      setIsLoading(false);
    }
  };

  const createInvite = async () => {
    if (!priest) return;
    if (!spouseAEmail || !spouseBEmail) {
      toast.error('Preencha os emails de ambos os cônjuges');
      return;
    }

    setIsCreating(true);
    try {
      const { data, error } = await supabase
        .from('discernir_couple_invites')
        .insert({
          parish_id: priest.parish_id,
          invited_by: priest.id,
          spouse_a_email: spouseAEmail.toLowerCase().trim(),
          spouse_b_email: spouseBEmail.toLowerCase().trim(),
          spouse_a_name: spouseAName.trim() || null,
          spouse_b_name: spouseBName.trim() || null,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Convite criado!', {
        description: 'Compartilhe o link com o casal.'
      });

      // Reset form
      setSpouseAName('');
      setSpouseAEmail('');
      setSpouseBName('');
      setSpouseBEmail('');
      setDialogOpen(false);
      
      fetchInvites();
    } catch (error: any) {
      toast.error('Erro ao criar convite', { description: error.message });
    } finally {
      setIsCreating(false);
    }
  };

  const copyInviteLink = (token: string) => {
    const link = `${window.location.origin}/convite/${token}`;
    navigator.clipboard.writeText(link);
    toast.success('Link copiado!');
  };

  const getStatusBadge = (status: string, expiresAt: string) => {
    const isExpired = new Date(expiresAt) < new Date();
    
    if (isExpired && status === 'pending') {
      return <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">Expirado</Badge>;
    }
    
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Pendente</Badge>;
      case 'accepted':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Aceito</Badge>;
      case 'declined':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Recusado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-amber-700" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-amber-900">
            Convites
          </h1>
          <p className="text-amber-800/70 mt-1">
            Convide casais para participar do DISCERNIR
          </p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-amber-700 hover:bg-amber-800">
              <Plus className="h-4 w-4 mr-2" />
              Novo Convite
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Convidar Casal</DialogTitle>
              <DialogDescription>
                Preencha os dados do casal para gerar o convite
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="spouse-a-name">Nome do Cônjuge A</Label>
                  <Input
                    id="spouse-a-name"
                    value={spouseAName}
                    onChange={(e) => setSpouseAName(e.target.value)}
                    placeholder="João"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="spouse-a-email">Email do Cônjuge A *</Label>
                  <Input
                    id="spouse-a-email"
                    type="email"
                    value={spouseAEmail}
                    onChange={(e) => setSpouseAEmail(e.target.value)}
                    placeholder="joao@email.com"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="spouse-b-name">Nome do Cônjuge B</Label>
                  <Input
                    id="spouse-b-name"
                    value={spouseBName}
                    onChange={(e) => setSpouseBName(e.target.value)}
                    placeholder="Maria"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="spouse-b-email">Email do Cônjuge B *</Label>
                  <Input
                    id="spouse-b-email"
                    type="email"
                    value={spouseBEmail}
                    onChange={(e) => setSpouseBEmail(e.target.value)}
                    placeholder="maria@email.com"
                    required
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={createInvite}
                disabled={isCreating}
                className="bg-amber-700 hover:bg-amber-800"
              >
                {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Criar Convite
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {invites.length === 0 ? (
        <Card className="border-amber-200/50">
          <CardContent className="pt-6 text-center">
            <Send className="h-12 w-12 text-amber-300 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-amber-900 mb-2">
              Nenhum convite enviado
            </h2>
            <p className="text-amber-800/70">
              Crie convites para os casais participarem da experiência DISCERNIR.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {invites.map((invite) => (
            <Card key={invite.id} className="border-amber-200/50">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-amber-900">
                      {invite.spouse_a_name || invite.spouse_a_email} & {invite.spouse_b_name || invite.spouse_b_email}
                    </h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span>{invite.spouse_a_email}</span>
                      <span>•</span>
                      <span>{invite.spouse_b_email}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>
                        Expira em {new Date(invite.expires_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(invite.status, invite.expires_at)}
                    {invite.status === 'pending' && new Date(invite.expires_at) > new Date() && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyInviteLink(invite.invite_token)}
                        className="text-amber-700 border-amber-200"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copiar Link
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Info Box */}
      <Card className="border-amber-200/50 bg-amber-50/30">
        <CardContent className="pt-6">
          <p className="text-center text-sm text-amber-800/70">
            Os convites expiram automaticamente após 30 dias.
            <br />
            Cada cônjuge precisa aceitar individualmente usando o link.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
