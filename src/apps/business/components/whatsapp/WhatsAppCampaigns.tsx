import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useBusinessAuth } from '../../hooks/useBusinessAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Plus, Send, Rocket, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const STATUS_MAP: Record<string, { label: string; icon: any; color: string }> = {
  draft: { label: 'Rascunho', icon: Clock, color: 'text-muted-foreground' },
  sending: { label: 'Enviando', icon: Rocket, color: 'text-amber-500' },
  completed: { label: 'Concluída', icon: CheckCircle, color: 'text-green-600' },
  failed: { label: 'Erro', icon: XCircle, color: 'text-destructive' },
};

export function WhatsAppCampaigns() {
  const { company } = useBusinessAuth();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: '', message: '', filterTags: '' });

  const { data: campaigns, isLoading } = useQuery({
    queryKey: ['whatsapp-campaigns', company?.id],
    queryFn: async () => {
      if (!company?.id) return [];
      const { data, error } = await supabase
        .from('business_whatsapp_campaigns' as any)
        .select('*')
        .eq('company_id', company.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!company?.id,
    refetchInterval: 5000, // Real-time polling for status updates
  });

  const createCampaign = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !company?.id) throw new Error('Não autenticado');

      const filterTags = form.filterTags.split(',').map(t => t.trim()).filter(Boolean);
      const { error } = await supabase
        .from('business_whatsapp_campaigns' as any)
        .insert({
          company_id: company.id,
          name: form.name.trim(),
          message_template: form.message.trim(),
          filter_tags: filterTags,
          status: 'draft',
          created_by: user.id,
        } as any);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whatsapp-campaigns'] });
      setForm({ name: '', message: '', filterTags: '' });
      setDialogOpen(false);
      toast.success('Campanha criada');
    },
    onError: (e: any) => toast.error(e.message),
  });

  const sendCampaign = useMutation({
    mutationFn: async (campaignId: string) => {
      const { data, error } = await supabase.functions.invoke('business-send-whatsapp', {
        body: { campaign_id: campaignId },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['whatsapp-campaigns'] });
      toast.success(`Campanha enviada: ${data.sent} enviados, ${data.failed} falharam`);
    },
    onError: (e: any) => {
      toast.error(e.message);
    },
  });

  const variableHints = [
    { var: '{{nome}}', desc: 'Nome do contato' },
    { var: '{{tag}}', desc: 'Tags do contato' },
    { var: '{{link}}', desc: 'Link personalizado' },
  ];

  return (
    <div className="space-y-4">
      {/* Create campaign */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-foreground">Campanhas</h3>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="w-4 h-4 mr-1" /> Nova Campanha</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Nova Campanha</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Nome da campanha *</Label>
                <Input
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="Ex: Boas-vindas padrinhos"
                />
              </div>
              <div>
                <Label>Filtrar por tags (opcional, separadas por vírgula)</Label>
                <Input
                  value={form.filterTags}
                  onChange={e => setForm(p => ({ ...p, filterTags: e.target.value }))}
                  placeholder="padrinho, lider"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Deixe vazio para enviar a todos os contatos com consentimento
                </p>
              </div>
              <div>
                <Label>Mensagem *</Label>
                <Textarea
                  value={form.message}
                  onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                  placeholder="Olá {{nome}}, temos uma novidade para você..."
                  rows={5}
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {variableHints.map(v => (
                    <button
                      key={v.var}
                      type="button"
                      onClick={() => setForm(p => ({ ...p, message: p.message + v.var }))}
                      className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      {v.var} — {v.desc}
                    </button>
                  ))}
                </div>
              </div>

              {/* Consent warning */}
              <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  Somente contatos com consentimento explícito receberão a mensagem.
                </p>
              </div>

              <Button
                onClick={() => createCampaign.mutate()}
                disabled={!form.name || !form.message || createCampaign.isPending}
                className="w-full"
              >
                {createCampaign.isPending ? 'Criando...' : 'Criar Campanha'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Campaigns list */}
      {isLoading ? (
        <p className="text-muted-foreground text-center py-8">Carregando...</p>
      ) : (campaigns || []).length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Nenhuma campanha criada ainda
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {(campaigns || []).map((campaign: any) => {
            const statusInfo = STATUS_MAP[campaign.status] || STATUS_MAP.draft;
            const StatusIcon = statusInfo.icon;
            const progress = campaign.total_contacts > 0
              ? Math.round(((campaign.sent_count + campaign.failed_count) / campaign.total_contacts) * 100)
              : 0;

            return (
              <Card key={campaign.id}>
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-foreground truncate">{campaign.name}</h4>
                        <Badge variant="outline" className={`text-xs ${statusInfo.color}`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusInfo.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {campaign.message_template}
                      </p>
                      {campaign.filter_tags?.length > 0 && (
                        <div className="flex gap-1 flex-wrap mb-2">
                          {campaign.filter_tags.map((tag: string) => (
                            <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                          ))}
                        </div>
                      )}
                      {(campaign.status === 'sending' || campaign.status === 'completed') && (
                        <div className="space-y-1">
                          <Progress value={progress} className="h-2" />
                          <div className="flex gap-4 text-xs text-muted-foreground">
                            <span>Total: {campaign.total_contacts}</span>
                            <span className="text-green-600">Enviados: {campaign.sent_count}</span>
                            {campaign.failed_count > 0 && (
                              <span className="text-destructive">Falhas: {campaign.failed_count}</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    {campaign.status === 'draft' && (
                      <Button
                        size="sm"
                        onClick={() => sendCampaign.mutate(campaign.id)}
                        disabled={sendCampaign.isPending}
                      >
                        <Send className="w-4 h-4 mr-1" />
                        Enviar
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
