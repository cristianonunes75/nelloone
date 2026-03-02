import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useBusinessAuth } from '../../hooks/useBusinessAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Plus, Trash2, Search, Users } from 'lucide-react';

export function WhatsAppContacts() {
  const { company } = useBusinessAuth();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ name: '', phone: '', tags: '', hasConsent: false });

  const { data: contacts, isLoading } = useQuery({
    queryKey: ['whatsapp-contacts', company?.id],
    queryFn: async () => {
      if (!company?.id) return [];
      const { data, error } = await supabase
        .from('business_whatsapp_contacts' as any)
        .select('*')
        .eq('company_id', company.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!company?.id,
  });

  const addContact = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !company?.id) throw new Error('Não autenticado');
      
      const tags = form.tags.split(',').map(t => t.trim()).filter(Boolean);
      const { error } = await supabase
        .from('business_whatsapp_contacts' as any)
        .insert({
          company_id: company.id,
          name: form.name.trim(),
          phone: form.phone.trim(),
          tags,
          has_consent: form.hasConsent,
          consent_given_at: form.hasConsent ? new Date().toISOString() : null,
          created_by: user.id,
        } as any);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whatsapp-contacts'] });
      setForm({ name: '', phone: '', tags: '', hasConsent: false });
      setDialogOpen(false);
      toast.success('Contato adicionado');
    },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteContact = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('business_whatsapp_contacts' as any)
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whatsapp-contacts'] });
      toast.success('Contato removido');
    },
    onError: (e: any) => toast.error(e.message),
  });

  const filtered = (contacts || []).filter((c: any) =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search)
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Contatos ({contacts?.length || 0})
        </CardTitle>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="w-4 h-4 mr-1" /> Adicionar</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Contato</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Nome *</Label>
                <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Nome completo" />
              </div>
              <div>
                <Label>Telefone * (com DDD e código do país)</Label>
                <Input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+5511999999999" />
              </div>
              <div>
                <Label>Tags (separadas por vírgula)</Label>
                <Input value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} placeholder="lead, vip, padrinho" />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={form.hasConsent}
                  onCheckedChange={(v) => setForm(p => ({ ...p, hasConsent: v === true }))}
                />
                <Label className="text-sm cursor-pointer">
                  Este contato deu consentimento explícito para receber mensagens
                </Label>
              </div>
              <Button
                onClick={() => addContact.mutate()}
                disabled={!form.name || !form.phone || addContact.isPending}
                className="w-full"
              >
                {addContact.isPending ? 'Salvando...' : 'Salvar Contato'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar contato..."
              className="pl-10"
            />
          </div>
        </div>

        {isLoading ? (
          <p className="text-muted-foreground text-center py-8">Carregando...</p>
        ) : filtered.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">Nenhum contato encontrado</p>
        ) : (
          <div className="space-y-2">
            {filtered.map((contact: any) => (
              <div key={contact.id} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground truncate">{contact.name}</span>
                    {contact.has_consent ? (
                      <Badge variant="outline" className="text-xs border-green-500/50 text-green-600">Consentimento</Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs border-destructive/50 text-destructive">Sem consentimento</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{contact.phone}</p>
                  {contact.tags?.length > 0 && (
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {contact.tags.map((tag: string) => (
                        <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteContact.mutate(contact.id)}
                  className="text-muted-foreground hover:text-destructive shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
